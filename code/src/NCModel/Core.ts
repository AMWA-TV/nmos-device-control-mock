import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { CommandResponseNoValue, CommandResponseWithValue } from '../NCProtocol/Commands';
import { INotificationContext } from '../SessionManager';

export function myIdDecorator(identity: string) {
    return Reflect.metadata('identity', identity);
}

export abstract class BaseType
{
    public static GetTypeDescriptor() : NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptor("NotDefined", NcDatatypeType.Null);
    }
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

    public InvokeMethod(oid: number, methodID: NcElementID, args: { [key: string]: any } | null, handle: number) : CommandResponseNoValue
    {
        return new CommandResponseNoValue(handle, NcMethodStatus.BadMethodID, 'Method does not exist in object');
    }

    public GenerateMemberDescriptor() : NcBlockMemberDescriptor
    {
        return new NcBlockMemberDescriptor(this.role, this.oid, this.constantOid, new NcClassIdentity(this.classID, this.classVersion), this.userLabel, this.owner);
    }

    public static GetClassDescriptor() : NcClassDescriptor
    {
        return new NcClassDescriptor("NcObject class descriptor",
            [ 
                new NcPropertyDescriptor(new NcElementID(1, 1), "classId", "ncClassID", true, true, true),
                new NcPropertyDescriptor(new NcElementID(1, 2), "classVersion", "ncVersionCode", true, true, true),
                new NcPropertyDescriptor(new NcElementID(1, 3), "oid", "ncOid", true, true, true),
                new NcPropertyDescriptor(new NcElementID(1, 4), "constantOid", "ncBoolean", true, true, true),
                new NcPropertyDescriptor(new NcElementID(1, 5), "owner", "ncOid", true, true, true),
                new NcPropertyDescriptor(new NcElementID(1, 6), "role", "ncOid", true, true, true),
                new NcPropertyDescriptor(new NcElementID(1, 7), "userLabel", "ncOid", false, true, true),
                new NcPropertyDescriptor(new NcElementID(1, 8), "lockable", "ncOid", true, true, true),
                new NcPropertyDescriptor(new NcElementID(1, 9), "lockState", "ncOid", false, false, true),
                new NcPropertyDescriptor(new NcElementID(1, 10), "touchpoints", "ncTouchpoint", true, true, true),
            ],
            [ 
                new NcMethodDescriptor(new NcElementID(1, 1), "get", "ncMethodResultPropertyValue", [new NcParameterDescriptor("id", "ncPropertyId", true)]),
                new NcMethodDescriptor(new NcElementID(1, 2), "set", "ncMethodResult", [
                    new NcParameterDescriptor("id", "ncPropertyId", true),
                    new NcParameterDescriptor("value", "", true)
                ]),
                new NcMethodDescriptor(new NcElementID(1, 3), "clear", "ncMethodResult", [
                    new NcParameterDescriptor("id", "ncPropertyId", true)
                ]),
                new NcMethodDescriptor(new NcElementID(1, 4), "getCollectionItem", "ncMethodResultPropertyValue", [
                    new NcParameterDescriptor("id", "ncPropertyId", true),
                    new NcParameterDescriptor("index", "ncId32", true)
                ]),
                new NcMethodDescriptor(new NcElementID(1, 5), "setCollectionItem", "ncMethodResult", [
                    new NcParameterDescriptor("id", "ncPropertyId", true),
                    new NcParameterDescriptor("index", "ncId32", true),
                    new NcParameterDescriptor("value", "", true)
                ]),
                new NcMethodDescriptor(new NcElementID(1, 6), "addCollectionItem", "ncMethodResultId32", [
                    new NcParameterDescriptor("id", "ncPropertyId", true),
                    new NcParameterDescriptor("value", "", true)
                ]),
                new NcMethodDescriptor(new NcElementID(1, 7), "removeCollectionItem", "ncMethodResult", [
                    new NcParameterDescriptor("id", "ncPropertyId", true),
                    new NcParameterDescriptor("index", "ncId32", true),
                ]),
                new NcMethodDescriptor(new NcElementID(1, 8), "lockWait", "ncMethodResult", [
                    new NcParameterDescriptor("target", "ncOid", true),
                    new NcParameterDescriptor("requestedLockStatus", "ncLockStatus", true),
                    new NcParameterDescriptor("timeout", "ncTimeInterval", true),
                ]),
                new NcMethodDescriptor(new NcElementID(1, 9), "abortWaits", "ncMethodResult", [
                    new NcParameterDescriptor("target", "ncOid", true)
                ]),
            ],
            [ new NcEventDescriptor(new NcElementID(1, 1), "PropertyChanged", "ncPropertyChangedEventData") ]
        );
    }
}

export class NcElementID extends BaseType
{
    public level: number;
    public index: number;

    constructor(
        level: number,
        index: number) 
    {
        super();

        this.level = level;
        this.index = index;
    }

    public static override GetTypeDescriptor(): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("ncElementID", [
            new NcPropertyDescriptor(new NcElementID(1, 1), "level", "ncUint16", true, true, true),
            new NcPropertyDescriptor(new NcElementID(1, 1), "index", "ncUint16", true, true, true)
        ]);
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

export class NcPort extends BaseType
{
    public role: string;

    public direction: NcIoDirection;

    public clockPath: string[] | null;

    public constructor(
        role: string,
        direction: NcIoDirection,
        clockPath: string[] | null)
    {
        super();

        this.role = role;
        this.direction = direction;
        this.clockPath = clockPath;
    }

    public static override GetTypeDescriptor(): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("ncPort", [
            new NcPropertyDescriptor(new NcElementID(1, 1), "role", "ncRole", true, true, true),
            new NcPropertyDescriptor(new NcElementID(1, 2), "direction", "ncIoDirection", true, true, true),
            new NcPropertyDescriptor(new NcElementID(1, 3), "clockPath", "ncRolePath", true, true, true)
        ]);
    }
}

export class NcSignalPath extends BaseType
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
        super();

        this.role = role;
        this.label = label;
        this.source = source;
        this.sink = sink;
    }

    public static override GetTypeDescriptor(): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("ncSignalPath", [
            new NcPropertyDescriptor(new NcElementID(1, 1), "role", "ncName", true, true, true),
            new NcPropertyDescriptor(new NcElementID(1, 2), "source", "ncRole", true, true, true),
            new NcPropertyDescriptor(new NcElementID(1, 3), "sink", "ncRole", true, true, true)
        ]);
    }
}

abstract class NcTouchpointResource extends BaseType
{
    public resourceType: string;

    public id: any;

    public constructor(
        resourceType: string)
    {
        super();

        this.resourceType = resourceType;
    }

    public static override GetTypeDescriptor(): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("ncTouchpointResource", [
            new NcPropertyDescriptor(new NcElementID(1, 1), "resourceType", "ncString", true, true, true)
        ]);
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

    public static override GetTypeDescriptor(): NcDatatypeDescriptor
    {
        let baseDescriptor = super.GetTypeDescriptor();

        let currentClassDescriptor = new NcDatatypeDescriptorStruct("ncTouchpointResourceNmos", [
            new NcPropertyDescriptor(new NcElementID(2, 1), "id", "ncString", true, true, true)
        ]);

        currentClassDescriptor.content = currentClassDescriptor.content.concat(baseDescriptor.content);

        return currentClassDescriptor;
    }
}

export abstract class NcTouchpoint extends BaseType
{
    public contextNamespace: string;

    public resources: NcTouchpointResource[];

    constructor(
        contextNamespace: string,
        resources: NcTouchpointResource[])
    {
        super();

        this.contextNamespace = contextNamespace;
        this.resources = resources;
    }

    public static override GetTypeDescriptor(): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("ncTouchpoint", [
            new NcPropertyDescriptor(new NcElementID(1, 1), "contextNamespace", "ncString", true, true, true)
        ]);
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

    public static override GetTypeDescriptor(): NcDatatypeDescriptor
    {
        let baseDescriptor = super.GetTypeDescriptor();

        let currentClassDescriptor = new NcDatatypeDescriptorStruct("ncTouchpointNmos", [
            new NcPropertyDescriptor(new NcElementID(1, 1), "resources", "ncTouchpointResourceNmos", true, true, true),
        ]);

        currentClassDescriptor.content = currentClassDescriptor.content.concat(baseDescriptor.content);

        return currentClassDescriptor;
    }
}

export class NcClassIdentity extends BaseType
{
    public classID: number[];
    public version: string;

    constructor(
        classID: number[],
        version: string) 
    {
        super();

        this.classID = classID;
        this.version = version;
    }

    public static override GetTypeDescriptor(): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("ncClassIdentity", [
            new NcPropertyDescriptor(new NcElementID(1, 1), "id", "ncClassId", true, true, true),
            new NcPropertyDescriptor(new NcElementID(1, 2), "version", "ncVersionCode", true, true, true)
        ]);
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcBlockMemberDescriptor extends BaseType
{
    public role: string;
    public oid: number;
    public constantOid: boolean;
    public identity: NcClassIdentity;
    public userLabel: string;
    public owner: number | null;

    constructor(
        role: string,
        oid: number,
        constantOid: boolean,
        identity: NcClassIdentity,
        userLabel: string,
        owner: number | null)
    {
        super();

        this.role = role;
        this.oid = oid;
        this.constantOid = constantOid;
        this.identity = identity;
        this.userLabel = userLabel;
        this.owner = owner;
    }

    public static override GetTypeDescriptor(): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("ncBlockMemberDescriptor", [
            new NcPropertyDescriptor(new NcElementID(1, 1), "role", "ncRole", true, true, true),
            new NcPropertyDescriptor(new NcElementID(1, 2), "oid", "ncOid", true, true, true),
            new NcPropertyDescriptor(new NcElementID(1, 3), "constantOid", "ncBoolean", true, true, true),
            new NcPropertyDescriptor(new NcElementID(1, 4), "identity", "ncClassIdentity", true, true, true),
            new NcPropertyDescriptor(new NcElementID(1, 5), "userLabel", "ncLabel", true, true, true),
            new NcPropertyDescriptor(new NcElementID(1, 6), "owner", "ncOid", true, true, true)
        ]);
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcPropertyDescriptor
{
    public id: NcElementID;
    public name: string;
    public typeName: string;
    public readOnly: boolean;
    public persistent: boolean;
    public required: boolean;

    constructor(
        id: NcElementID,
        name: string,
        typeName: string,
        readOnly: boolean,
        persistent: boolean,
        required: boolean)
    {
        this.id = id;
        this.name = name;
        this.typeName = typeName;
        this.readOnly = readOnly;
        this.persistent = persistent;
        this.required = required;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcParameterDescriptor
{
    public name: string;
    public typeName: string;
    public required: boolean;

    constructor(
        name: string,
        typeName: string,
        required: boolean)
    {
        this.name = name;
        this.typeName = typeName;
        this.required = required;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcMethodDescriptor
{
    public id: NcElementID;
    public name: string;
    public resultDatatype: string;
    public parameters: NcParameterDescriptor[];

    constructor(
        id: NcElementID,
        name: string,
        resultDatatype: string,
        parameters: NcParameterDescriptor[])
    {
        this.id = id;
        this.name = name;
        this.resultDatatype = resultDatatype;
        this.parameters = parameters;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcEventDescriptor
{
    public id: NcElementID;
    public name: string;
    public eventDatatype: string;

    constructor(
        id: NcElementID,
        name: string,
        eventDatatype: string)
    {
        this.id = id;
        this.name = name;
        this.eventDatatype = eventDatatype;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcClassDescriptor
{
    public description: string;
    public properties: NcPropertyDescriptor[];
    public methods: NcMethodDescriptor[];
    public events: NcEventDescriptor[];

    constructor(
        description: string,
        properties: NcPropertyDescriptor[],
        methods: NcMethodDescriptor[],
        events: NcEventDescriptor[])
    {
        this.description = description;
        this.properties = properties;
        this.methods = methods;
        this.events = events;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export enum NcDatatypeType
{
    Primitive = 0,
    Typedef = 1,
    Struct = 2,
    Enum = 3,
    Null = 4
}

export class NcFieldDescriptor
{
    public name: string;
    public typeName: string;

    constructor(
        name: string,
        typeName: string)
    {
        this.name = name;
        this.typeName = typeName;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcEnumItemDescriptor
{
    public name: string;
    public index: number;

    constructor(
        name: string,
        index: number)
    {
        this.name = name;
        this.index = index;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcDatatypeDescriptor
{
    public name: string;
    public type: NcDatatypeType;
    public content: any | null;

    constructor(
        name: string,
        type: NcDatatypeType)
    {
        this.name = name;
        this.type = type;
        this.content = null;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcDatatypeDescriptorPrimitive extends NcDatatypeDescriptor
{
    public override content: string;

    constructor(
        name: string)
    {
        super(name, NcDatatypeType.Primitive);

        this.content = "";
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcDatatypeDescriptorTypeDef extends NcDatatypeDescriptor
{
    public override content: string;

    constructor(
        name: string,
        content: string)
    {
        super(name, NcDatatypeType.Typedef);

        this.content = content;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcDatatypeDescriptorStruct extends NcDatatypeDescriptor
{
    public override content: NcPropertyDescriptor[];

    constructor(
        name: string,
        content: NcPropertyDescriptor[])
    {
        super(name, NcDatatypeType.Struct);

        this.content = content;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcDatatypeDescriptorEnum extends NcDatatypeDescriptor
{
    public override content: NcEnumItemDescriptor[];

    constructor(
        name: string,
        content: NcEnumItemDescriptor[])
    {
        super(name, NcDatatypeType.Enum);

        this.content = content;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}