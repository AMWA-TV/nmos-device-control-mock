import { jsonIgnore } from 'json-ignore';
import { TAI64 } from "tai64";

import { RegistrationClient } from './RegistrationClient';

export type NmosTags = { [name: string]: string[] };

export abstract class NmosResource
{
    public id: string;
    public version: string;
    public label: string;
    public description: string;
    public tags: NmosTags;

    @jsonIgnore()
    public registrationClient: RegistrationClient;

    @jsonIgnore()
    public registrationType: string;

    @jsonIgnore()
    public defaultLabel: string;

    @jsonIgnore()
    public defaultDescription: string;

    @jsonIgnore()
    public defaultTags: NmosTags;

    @jsonIgnore()
    public versionSeconds: string;
    @jsonIgnore()
    public versionNanoSeconds: number;

    public constructor(
        id: string,
        label: string,
        registrationClient: RegistrationClient)
    {
        this.id = id;
        this.label = label;
        this.versionNanoSeconds = 0;
        this.versionSeconds = `${TAI64.now().toUnix().toString()}`;
        this.version = `${this.versionSeconds}:${this.versionNanoSeconds}`;
        this.description = label;
        this.tags = {};
        this.registrationClient = registrationClient;
        this.registrationType = '';
        this.defaultLabel = label;
        this.defaultDescription = this.description;
        this.defaultTags = {};
    }

    public BumpVersion()
    {
        let newVersionSeconds = `${TAI64.now().toUnix().toString()}`;
        if(newVersionSeconds != this.versionSeconds)
        {
            this.versionSeconds = newVersionSeconds;
            this.versionNanoSeconds = 0;
        }
        else
            this.versionNanoSeconds++;

        this.version = `${this.versionSeconds}:${this.versionNanoSeconds}`;
    }

    public CaptureAnnotationDefaults()
    {
        this.defaultLabel = this.label;
        this.defaultDescription = this.description;
        this.defaultTags = {};

        for(const name of Object.keys(this.tags))
            this.defaultTags[name] = this.tags[name].slice();
    }

    public ToAnnotation()
    {
        return {
            id: this.id,
            version: this.version,
            label: this.label,
            description: this.description,
            tags: this.tags
        };
    }

    public abstract ToJson();
}