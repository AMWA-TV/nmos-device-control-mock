import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { CommandResponseNoValue, CommandResponseWithValue } from '../NCProtocol/Commands';
import { INotificationContext } from '../SessionManager';

export function myIdDecorator(identity: string) {
    return Reflect.metadata('identity', identity);
}

export abstract class NcObject
{
    public notificationContext: INotificationContext;

    @myIdDecorator('1p1')
    public abstract classID: number[];

    @myIdDecorator('1p2')
    public abstract classVersion: string;

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
    public lockState: NcLockState;

    @myIdDecorator('1p10')
    public touchpoints: NcTouchpoint[] | null;

    public constructor(
        oid: number,
        constantOid: boolean,
        owner: number | null,
        role: string,
        userLabel: string,
        lockable: boolean,
        lockState: NcLockState,
        touchpoints: NcTouchpoint[] | null,
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
    public Get(oid: number, id: NcElementID, handle: number) : CommandResponseWithValue
    {
        let key: string = `${id.level}p${id.index}`;

        switch(key)
        {
            case '1p1':
                return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.classID, null);
            case '1p2':
                return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.classVersion, null);
            case '1p3':
                return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.oid, null);
            case '1p4':
                return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.constantOid, null);
            case '1p5':
                return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.owner, null);
            case '1p6':
                return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.role, null);
            case '1p7':
                return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.userLabel, null);
            case '1p8':
                return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.lockable, null);
            case '1p9':
                return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.lockState, null);
            case '1p10':
                return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.touchpoints, null);
        }

        return new CommandResponseWithValue(handle, NcMethodStatus.ProcessingFailed, null, 'Property does not exist in object');
    }

    //'1m2'
    public Set(oid: number, id: NcElementID, value: any, handle: number) : CommandResponseNoValue
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
                return new CommandResponseNoValue(handle, NcMethodStatus.ProcessingFailed, 'Property is readonly');
            case '1p7':
                this.userLabel = value;
                this.notificationContext.NotifyPropertyChanged(this.oid, id, this.userLabel);
                return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
            case '1p8':
            case '1p9':
            case '1p10':
                return new CommandResponseNoValue(handle, NcMethodStatus.ProcessingFailed, 'Property is readonly');
        }

        return new CommandResponseNoValue(handle, NcMethodStatus.ProcessingFailed, 'Property does not exist in object');
    }
}

export class NcElementID
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

export enum NcMethodStatus
{
    OK = 0,
    ProtocolVersionError = 1,
    DeviceError = 2,
    Readonly = 3,
    Locked = 4,
    BadCommandFormat = 5,
    BadOid = 6,
    ParameterError = 7,
    ParameterOutOfRange = 8,
    NotImplemented = 9,
    InvalidRequest = 10,
    ProcessingFailed = 11,
    BadMethodID = 12,
    PartiallySucceeded = 13,
    Timeout = 14,
    BufferOverflow = 15,
    OmittedProperty = 16
}

export enum NcPropertyChangeType
{
    CurrentChanged = 0,
    MinChanged = 1,
    MaxChanged = 2,
    ItemAdded = 3,
    ItemChanged = 4,
    ItemDeleted = 5
}

export enum NcLockState
{
    NoLock = 0,
    LockNoWrite = 1,
    LockNoReadWrite = 2
}

export enum NcIoDirection
{
    Undefined = 0,
    Input = 1,
    Output = 2,
    Bidirectional = 3
}

export class NcPort
{
    public role: string;

    public direction: NcIoDirection;

    public clockPath: string[] | null;

    public constructor(
        role: string,
        direction: NcIoDirection,
        clockPath: string[] | null)
    {
        this.role = role;
        this.direction = direction;
        this.clockPath = clockPath;
    }
}

export class NcSignalPath
{
    public role: string;

    public label: string;

    public source: string;

    public sink: string;

    public constructor(
        role: string,
        label: string,
        source: string,
        sink: string)
    {
        this.role = role;
        this.label = label;
        this.source = source;
        this.sink = sink;
    }
}

abstract class NcTouchpointResource
{
    public resourceType: string;

    public id: any;

    public constructor(
        resourceType: string)
    {
        this.resourceType = resourceType;
    }
}

export class NcTouchpointResourceNmos extends NcTouchpointResource
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

export abstract class NcTouchpoint
{
    public contextNamespace: string;

    public resources: NcTouchpointResource[];

    constructor(
        contextNamespace: string,
        resources: NcTouchpointResource[])
    {
        this.contextNamespace = contextNamespace;
        this.resources = resources;
    }
}

export class NcTouchpointNmos extends NcTouchpoint
{
    constructor(
        contextNamespace: string,
        resources: NcTouchpointResourceNmos[])
    {
        super(contextNamespace, resources);
    }
}