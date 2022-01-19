import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { INotificationContext } from '../SessionManager';

export abstract class NcaObject
{
    public abstract classID: number[];
    public abstract classVersion: number;

    public notificationContext: INotificationContext;

    public oid: number;

    public constantOid: boolean;

    public resources: NcaTouchpoint[] | null;

    public constructor(
        oid: number,
        resources: NcaTouchpoint[] | null,
        constantOid: boolean,
        notificationContext: INotificationContext)
    {
        this.oid = oid;
        this.resources = resources;
        this.constantOid = constantOid;
        this.notificationContext = notificationContext;
    }
}

export class NcaElementID
{
    public level: number;
    public index: number;

    constructor(
        level: number,
        index: number) 
    {
        this.level = level;
        this.index = index;
    }

    public ToJson() 
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export enum NcaMethodStatus
{
    OK = 0,
    ProtocolVersionError = 1,
    DeviceError = 2,
    Locked = 3,
    BadCommandFormat = 4,
    BadOid = 5,
    ParameterError = 5,
    ParameterOutOfRange = 5,
    NotImplemented = 5,
    InvalidRequest = 5,
    ProcessingFailed = 5,
    BadMethodID = 5,
    PartiallySucceeded = 5,
    Timeout = 5,
    BufferOverflow = 5
}

export enum NcaPropertyChangeType
{
    CurrentChanged = 0,
    MinChanged = 1,
    MaxChanged = 2,
    ItemAdded = 3,
    ItemChanged = 4,
    ItemDeleted = 5
}

abstract class TouchpointResource
{
    public resourceType: string;

    public id: any;

    public constructor(
        resourceType: string)
    {
        this.resourceType = resourceType;
    }
}

export class TouchpointResourceNmos extends TouchpointResource
{
    public override id: string;

    public constructor(
        resourceType: string,
        id: string)
    {
        super(resourceType);

        this.id = id;
    }
}

export abstract class NcaTouchpoint
{
    public contextNamespace: string;

    public resources: TouchpointResource[];

    constructor(
        contextNamespace: string,
        resources: TouchpointResource[])
    {
        this.contextNamespace = contextNamespace;
        this.resources = resources;
    }
}

export class NcaTouchpointNmos extends NcaTouchpoint
{
    constructor(
        contextNamespace: string,
        resources: TouchpointResourceNmos[])
    {
        super(contextNamespace, resources);
    }
}