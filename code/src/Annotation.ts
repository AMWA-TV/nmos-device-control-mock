import { Application, Request, Response } from 'express';

import { Configuration } from './Configuration';
import { NmosResource, NmosTags } from './NmosResource';

const READ_ONLY_TAG_PREFIXES = [
    'urn:x-nmos:tag:grouphint/',
    'urn:x-nmos:tag:asset:'
];

const RESOURCE_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export interface AnnotationCatalog
{
    self: NmosResource;
    devices: NmosResource[];
    sources: NmosResource[];
    flows: NmosResource[];
    senders: NmosResource[];
    receivers: NmosResource[];
}

interface AnnotationPatch
{
    label?: string | null;
    description?: string | null;
    tags?: { [name: string]: string[] | null } | null;
}

interface AnnotationErrorBody
{
    code: number;
    error: string;
    debug: string | null;
}

type AnnotationFailure = { ok: false, status: number, error: AnnotationErrorBody };
type AnnotationSuccess = { ok: true, resource: NmosResource };

export class AnnotationStore
{
    private configuration: Configuration;

    public constructor(configuration: Configuration)
    {
        this.configuration = configuration;
        if(!this.configuration.annotations)
            this.configuration.annotations = {};
    }

    public Restore(resource: NmosResource)
    {
        const saved = this.configuration.annotations[resource.id];
        if(!saved || typeof saved !== 'object')
            return;

        if(typeof saved.label === 'string')
            resource.label = saved.label;

        if(typeof saved.description === 'string')
            resource.description = saved.description;

        if(!saved.tags || typeof saved.tags !== 'object' || Array.isArray(saved.tags))
            return;

        const next: NmosTags = {};
        for(const name of Object.keys(resource.tags))
        {
            if(isReadOnlyTag(name))
                next[name] = resource.tags[name].slice();
        }

        for(const name of Object.keys(saved.tags))
        {
            const values = saved.tags[name];
            if(isReadOnlyTag(name) || !Array.isArray(values) || values.some(value => typeof value !== 'string'))
                continue;

            next[name] = values.slice();
        }

        resource.tags = next;
    }

    public Save(resource: NmosResource)
    {
        const tags: NmosTags = {};
        for(const name of Object.keys(resource.tags))
        {
            if(!isReadOnlyTag(name))
                tags[name] = resource.tags[name].slice();
        }

        this.configuration.annotations[resource.id] = {
            label: resource.label,
            description: resource.description,
            tags: tags
        };
        this.configuration.WriteConfig();
    }
}

export function registerAnnotationApi(app: Application, catalog: AnnotationCatalog, store: AnnotationStore)
{
    const collections: { [name: string]: NmosResource[] } = {
        devices: catalog.devices,
        sources: catalog.sources,
        flows: catalog.flows,
        senders: catalog.senders,
        receivers: catalog.receivers
    };

    route(app, 'get', '/x-nmos/annotation', (_req, res) => {
        sendJson(res, 200, [ 'v1.0/' ]);
    });

    route(app, 'get', '/x-nmos/annotation/v1.0', (_req, res) => {
        sendJson(res, 200, [ 'node/' ]);
    });

    route(app, 'get', '/x-nmos/annotation/v1.0/node', (_req, res) => {
        sendJson(res, 200, [
            'self/',
            'devices/',
            'sources/',
            'flows/',
            'senders/',
            'receivers/'
        ]);
    });

    route(app, 'get', '/x-nmos/annotation/v1.0/node/self', (_req, res) => {
        sendJson(res, 200, catalog.self.ToAnnotation());
    });

    route(app, 'patch', '/x-nmos/annotation/v1.0/node/self', (req, res) => {
        patchResource(catalog.self, req, res, store);
    });

    for(const name of Object.keys(collections))
    {
        route(app, 'get', `/x-nmos/annotation/v1.0/node/${name}`, (_req, res) => {
            sendJson(res, 200, collections[name].map(resource => `${resource.id}/`));
        });

        route(app, 'get', `/x-nmos/annotation/v1.0/node/${name}/:id`, (req, res) => {
            const resource = findResource(collections[name], req.params.id);
            if(!resource)
            {
                sendError(res, 404, 'Resource not found', `No ${name} resource with id ${req.params.id}`);
                return;
            }

            sendJson(res, 200, resource.ToAnnotation());
        });

        route(app, 'patch', `/x-nmos/annotation/v1.0/node/${name}/:id`, (req, res) => {
            const resource = findResource(collections[name], req.params.id);
            if(!resource)
            {
                sendError(res, 404, 'Resource not found', `No ${name} resource with id ${req.params.id}`);
                return;
            }

            patchResource(resource, req, res, store);
        });
    }
}

async function patchResource(resource: NmosResource, req: Request, res: Response, store: AnnotationStore)
{
    console.log(`patch - ${req.url}, body: ${JSON.stringify(req.body)}`);

    const previous = snapshotAnnotation(resource);
    const result = applyAnnotationPatch(resource, req.body);
    if(!result.ok)
    {
        sendJson(res, result.status, result.error);
        return;
    }

    result.resource.BumpVersion();

    const registered = await result.resource.registrationClient.RegisterOrUpdateResource(
        result.resource.registrationType,
        result.resource);
    if(!registered)
    {
        restoreAnnotation(result.resource, previous);
        sendError(
            res,
            500,
            'Could not update the IS-04 registry',
            `The Registration API did not accept ${result.resource.registrationType} ${result.resource.id}`);
        return;
    }

    store.Save(result.resource);
    sendJson(res, 200, result.resource.ToAnnotation());
}

interface AnnotationSnapshot
{
    label: string;
    description: string;
    tags: NmosTags;
    version: string;
    versionSeconds: string;
    versionNanoSeconds: number;
}

function snapshotAnnotation(resource: NmosResource): AnnotationSnapshot
{
    const tags: NmosTags = {};
    for(const name of Object.keys(resource.tags))
        tags[name] = resource.tags[name].slice();

    return {
        label: resource.label,
        description: resource.description,
        tags: tags,
        version: resource.version,
        versionSeconds: resource.versionSeconds,
        versionNanoSeconds: resource.versionNanoSeconds
    };
}

function restoreAnnotation(resource: NmosResource, previous: AnnotationSnapshot)
{
    resource.label = previous.label;
    resource.description = previous.description;
    resource.tags = previous.tags;
    resource.version = previous.version;
    resource.versionSeconds = previous.versionSeconds;
    resource.versionNanoSeconds = previous.versionNanoSeconds;
}

function applyAnnotationPatch(resource: NmosResource, body: unknown): AnnotationSuccess | AnnotationFailure
{
    const parsed = parsePatch(body);
    if(!parsed.ok)
        return parsed;

    const readOnly = rejectReadOnlyTags(parsed.patch);
    if(!readOnly.ok)
        return readOnly;

    if(parsed.patch.label !== undefined)
        resource.label = parsed.patch.label === null ? resource.defaultLabel : parsed.patch.label;

    if(parsed.patch.description !== undefined)
        resource.description = parsed.patch.description === null ? resource.defaultDescription : parsed.patch.description;

    if(parsed.patch.tags !== undefined)
        resource.tags = nextTags(resource, parsed.patch.tags);

    return { ok: true, resource: resource };
}

function parsePatch(body: unknown): { ok: true, patch: AnnotationPatch } | AnnotationFailure
{
    if(body === null || typeof body !== 'object' || Array.isArray(body))
        return failure(400, 'Request body must be a JSON object', 'The request did not meet the schema');

    const record = body as { [key: string]: unknown };
    for(const key of Object.keys(record))
    {
        if(key !== 'label' && key !== 'description' && key !== 'tags')
            return failure(400, `Unexpected property '${key}'`, 'Additional properties are not allowed');
    }

    const patch: AnnotationPatch = {};

    if('label' in record)
    {
        if(record.label !== null && typeof record.label !== 'string')
            return failure(400, 'label must be a string or null', 'The request did not meet the schema');

        patch.label = record.label;
    }

    if('description' in record)
    {
        if(record.description !== null && typeof record.description !== 'string')
            return failure(400, 'description must be a string or null', 'The request did not meet the schema');

        patch.description = record.description;
    }

    if('tags' in record)
    {
        if(record.tags === null)
        {
            patch.tags = null;
        }
        else if(typeof record.tags !== 'object' || Array.isArray(record.tags))
        {
            return failure(400, 'tags must be an object or null', 'The request did not meet the schema');
        }
        else
        {
            const tags: { [name: string]: string[] | null } = {};
            for(const name of Object.keys(record.tags))
            {
                if(name === '__proto__' || name === 'constructor' || name === 'prototype')
                    return failure(400, `Invalid tag name '${name}'`, 'The request did not meet the schema');

                const values = record.tags[name];
                if(values === null)
                {
                    tags[name] = null;
                    continue;
                }

                if(!Array.isArray(values) || values.some(value => typeof value !== 'string'))
                    return failure(400, `Tag '${name}' must be an array of strings or null`, 'The request did not meet the schema');

                tags[name] = values.slice();
            }

            patch.tags = tags;
        }
    }

    return { ok: true, patch: patch };
}

function rejectReadOnlyTags(patch: AnnotationPatch): { ok: true } | AnnotationFailure
{
    if(patch.tags === undefined || patch.tags === null)
        return { ok: true };

    for(const name of Object.keys(patch.tags))
    {
        if(isReadOnlyTag(name))
            return failure(500, `Tag '${name}' is read-only`, 'BCP-002-01 group hint tags and BCP-002-02 asset tags cannot be changed');
    }

    return { ok: true };
}

function nextTags(resource: NmosResource, tags: { [name: string]: string[] | null } | null): NmosTags
{
    if(tags === null)
    {
        const reset: NmosTags = {};
        for(const name of Object.keys(resource.tags))
        {
            if(isReadOnlyTag(name))
                reset[name] = resource.tags[name].slice();
        }

        for(const name of Object.keys(resource.defaultTags))
        {
            if(!isReadOnlyTag(name))
                reset[name] = resource.defaultTags[name].slice();
        }

        return reset;
    }

    const next: NmosTags = {};
    for(const name of Object.keys(resource.tags))
        next[name] = resource.tags[name].slice();

    for(const name of Object.keys(tags))
    {
        const values = tags[name];
        if(values === null)
        {
            if(Object.prototype.hasOwnProperty.call(resource.defaultTags, name) && !isReadOnlyTag(name))
                next[name] = resource.defaultTags[name].slice();
            else
                delete next[name];
        }
        else
        {
            next[name] = values.slice();
        }
    }

    return next;
}

function findResource(resources: NmosResource[], id: string | string[] | undefined): NmosResource | null
{
    const resourceId = Array.isArray(id) ? id[0] : id;
    if(!resourceId || !RESOURCE_ID_PATTERN.test(resourceId))
        return null;

    return resources.find(resource => resource.id === resourceId) ?? null;
}

function isReadOnlyTag(name: string): boolean
{
    return READ_ONLY_TAG_PREFIXES.some(prefix => name.startsWith(prefix));
}

function failure(status: number, error: string, debug: string): AnnotationFailure
{
    return {
        ok: false,
        status: status,
        error: {
            code: status,
            error: error,
            debug: debug
        }
    };
}

function sendError(res: Response, status: number, error: string, debug: string)
{
    sendJson(res, status, {
        code: status,
        error: error,
        debug: debug
    });
}

function sendJson(res: Response, status: number, body: unknown)
{
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(body));
    res.end();
}

function route(app: Application, method: 'get' | 'patch', path: string, handler: (req: Request, res: Response) => void)
{
    app[method](path, handler);
    app[method](`${path}/`, handler);
}
