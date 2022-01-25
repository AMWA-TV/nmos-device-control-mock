import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { CommandResponseNoValue, CommandResponseWithValue } from '../NCProtocol/Commands';
import { INotificationContext } from '../SessionManager';

export function myIdDecorator(identity: string) {
    return Reflect.metadata('identity', identity);
}

export abstract class NcaObject
{
    public notificationContext: INotificationContext;

    @myIdDecorator('1p1')
    public abstract classID: number[];

    @myIdDecorator('1p2')
    public abstract classVersion: number;

    @myIdDecorator('1p3')
    public oid: number;

    @myIdDecorator('1p4')
    public constantOid: boolean;

    @myIdDecorator('1p5')
    public owner: number | null

    @myIdDecorator('1p6')
    public role: string;

    @myIdDecorator('1p7')
    public userLabel: string;

    @myIdDecorator('1p8')
    public lockable: boolean;

    @myIdDecorator('1p9')
    public lockState: NcaLockState;

    @myIdDecorator('1p10')
    public touchpoints: NcaTouchpoint[] | null;

    public constructor(
        oid: number,
        constantOid: boolean,
        owner: number | null,
        role: string,
        userLabel: string,
        lockable: boolean,
        lockState: NcaLockState,
        touchpoints: NcaTouchpoint[] | null,
        notificationContext: INotificationContext)
    {
        this.oid = oid;
        this.constantOid = constantOid;
        this.owner = owner;
        this.role = role;
        this.userLabel = userLabel;
        this.lockable = lockable;
        this.lockState = lockState;
        this.touchpoints = touchpoints;
        this.notificationContext = notificationContext;
    }

    //'1m1'
    public Get(oid: number, id: NcaElementID, handle: number) : CommandResponseWithValue
    {
        let key: string = `${id.level}p${id.index}`;

        switch(key)
        {
            case '1p1':
                return new CommandResponseWithValue(handle, NcaMethodStatus.OK, this.classID, null);
            case '1p2':
                return new CommandResponseWithValue(handle, NcaMethodStatus.OK, this.classVersion, null);
            case '1p3':
                return new CommandResponseWithValue(handle, NcaMethodStatus.OK, this.oid, null);
            case '1p4':
                return new CommandResponseWithValue(handle, NcaMethodStatus.OK, this.constantOid, null);
            case '1p5':
                return new CommandResponseWithValue(handle, NcaMethodStatus.OK, this.owner, null);
            case '1p6':
                return new CommandResponseWithValue(handle, NcaMethodStatus.OK, this.role, null);
            case '1p7':
                return new CommandResponseWithValue(handle, NcaMethodStatus.OK, this.userLabel, null);
            case '1p8':
                return new CommandResponseWithValue(handle, NcaMethodStatus.OK, this.lockable, null);
            case '1p9':
                return new CommandResponseWithValue(handle, NcaMethodStatus.OK, this.lockState, null);
            case '1p10':
                return new CommandResponseWithValue(handle, NcaMethodStatus.OK, this.touchpoints, null);
        }

        return new CommandResponseWithValue(handle, NcaMethodStatus.ProcessingFailed, null, 'Property does not exist in object');
    }

    //'1m2'
    public Set(oid: number, id: NcaElementID, value: any, handle: number) : CommandResponseNoValue
    {
        let key: string = `${id.level}p${id.index}`;

        switch(key)
        {
            case '1p1':
            case '1p2':
            case '1p3':
            case '1p4':
            case '1p5':
            case '1p6':
                return new CommandResponseNoValue(handle, NcaMethodStatus.ProcessingFailed, 'Property is readonly');
            case '1p7':
                this.userLabel = value;
                this.notificationContext.NotifyPropertyChanged(this.oid, id, this.userLabel);
                return new CommandResponseNoValue(handle, NcaMethodStatus.OK, null);
            case '1p8':
            case '1p9':
            case '1p10':
                return new CommandResponseNoValue(handle, NcaMethodStatus.ProcessingFailed, 'Property is readonly');
        }

        return new CommandResponseNoValue(handle, NcaMethodStatus.ProcessingFailed, 'Property does not exist in object');
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

export enum NcaLockState
{
    NoLock = 0,
    LockNoWrite = 1,
    LockNoReadWrite = 2
}

export enum NcaIoDirection
{
    Undefined = 0,
    Input = 1,
    Output = 2,
    Bidirectional = 3
}

export class NcaPort
{
    public role: string;

    public direction: NcaIoDirection;

    public clockPath: string[] | null;

    public constructor(
        role: string,
        direction: NcaIoDirection,
        clockPath: string[] | null)
    {
        this.role = role;
        this.direction = direction;
        this.clockPath = clockPath;
    }
}

export class NcaSignalPath
{
    public role: string;

    public source: string;

    public sink: string;

    public constructor(
        role: string,
        source: string,
        sink: string)
    {
        this.role = role;
        this.source = source;
        this.sink = sink;
    }
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