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
        return new NcDatatypeDescriptor("NotDefined", NcDatatypeType.Struct, "Base");
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

    public description: string;

    public constructor(
        oid: number,
        constantOid: boolean,
        owner: number | null,
        role: string,
        userLabel: string,
        lockable: boolean,
        lockState: NcLockState,
        touchpoints: NcTouchpoint[] | null,
        description: string,
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
        this.description = description;
        this.notificationContext = notificationContext;
    }

    //'1m1'
    public Get(oid: number, id: NcElementId, handle: number) : CommandResponseNoValue
    {
        if(oid == this.oid)
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
                default:
                    return new CommandResponseNoValue(handle, NcMethodStatus.ProcessingFailed, 'Property does not exist in object');
            }
        }

        return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }

    //'1m2'
    public Set(oid: number, id: NcElementId, value: any, handle: number) : CommandResponseNoValue
    {
        if(oid == this.oid)
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
                default:
                    return new CommandResponseNoValue(handle, NcMethodStatus.ProcessingFailed, 'Property does not exist in object');
            }
        }

        return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }

    public InvokeMethod(oid: number, methodID: NcElementId, args: { [key: string]: any } | null, handle: number) : CommandResponseNoValue
    {
        return new CommandResponseNoValue(handle, NcMethodStatus.BadMethodID, 'Method does not exist in object');
    }

    public GenerateMemberDescriptor() : NcBlockMemberDescriptor
    {
        return new NcBlockMemberDescriptor(this.role, this.oid, this.constantOid, new NcClassIdentity(this.classID, this.classVersion), this.userLabel, this.owner, this.description);
    }

    public static GetClassDescriptor() : NcClassDescriptor
    {
        return new NcClassDescriptor("NcObject class descriptor",
            [ 
                new NcPropertyDescriptor(new NcElementId(1, 1), "classId", "NcClassId", true, true, false, false, null, "Class identity"),
                new NcPropertyDescriptor(new NcElementId(1, 2), "classVersion", "NcVersionCode", true, true, false, false, null, "Class version"),
                new NcPropertyDescriptor(new NcElementId(1, 3), "oid", "ncOid", true, true, false, false, null, "Object identifier"),
                new NcPropertyDescriptor(new NcElementId(1, 4), "constantOid", "NcBoolean", true, true, false, false, null, "TRUE iff OID is hardwired into device"),
                new NcPropertyDescriptor(new NcElementId(1, 5), "owner", "NcOid", true, true, true, false, null, "OID of containing block. Can only ever be null for the root block" ),
                new NcPropertyDescriptor(new NcElementId(1, 6), "role", "NcName", true, true, false, false, null, "role of obj in containing block"),
                new NcPropertyDescriptor(new NcElementId(1, 7), "userLabel", "NcString", false, true, false, false, null, "Scribble strip"),
                new NcPropertyDescriptor(new NcElementId(1, 8), "lockable", "NcBoolean", true, true, false, false, null, "Flag signalling if the object can be locked"),
                new NcPropertyDescriptor(new NcElementId(1, 9), "lockState", "NcLockState", false, false, false, false, null, "Enum property exposing the lock state"),
                new NcPropertyDescriptor(new NcElementId(1, 10), "touchpoints", "NcTouchpoint", true, true, true, true, null, "Touchpoints to other contexts"),
            ],
            [ 
                new NcMethodDescriptor(new NcElementId(1, 1), "Get", "NcMethodResultPropertyValue", [new NcParameterDescriptor("id", "NcPropertyId", false, null, "Property id")], "Get property value"),
                new NcMethodDescriptor(new NcElementId(1, 2), "Set", "NcMethodResult", [
                    new NcParameterDescriptor("id", "NcPropertyId", false, null, "Property id"),
                    new NcParameterDescriptor("value", null, true, null, "Property value")
                ], "Set property value"),
                new NcMethodDescriptor(new NcElementId(1, 3), "Clear", "NcMethodResult", [
                    new NcParameterDescriptor("id", "NcPropertyId", false, null, "Property id")
                ], "Sets property to initial value"),
                new NcMethodDescriptor(new NcElementId(1, 4), "GetSequenceItem", "NcMethodResultPropertyValue", [
                    new NcParameterDescriptor("id", "NcPropertyId", false, null, "Property id"),
                    new NcParameterDescriptor("index", "NcId32", false, null, "Index of item in the sequence")
                ], "Get sequence item"),
                new NcMethodDescriptor(new NcElementId(1, 5), "SetSequenceItem", "NcMethodResult", [
                    new NcParameterDescriptor("id", "NcPropertyId", false, null, "Property id"),
                    new NcParameterDescriptor("index", "NcId32", false, null, "Index of item in the sequence"),
                    new NcParameterDescriptor("value", null, true, null, "Value")
                ], "Set sequence item value"),
                new NcMethodDescriptor(new NcElementId(1, 6), "AddSequenceItem", "NcMethodResultId32", [
                    new NcParameterDescriptor("id", "NcPropertyId", false, null, "Property id"),
                    new NcParameterDescriptor("value", null, true, null, "Value")
                ], "Add item to sequence"),
                new NcMethodDescriptor(new NcElementId(1, 7), "RemoveSequenceItem", "NcMethodResult", [
                    new NcParameterDescriptor("id", "NcPropertyId", false, null, "Property id"),
                    new NcParameterDescriptor("index", "NcId32", false, null, "Index of item in the sequence"),
                ], "Delete sequence item"),
                new NcMethodDescriptor(new NcElementId(1, 8), "LockWait", "NcMethodResult", [
                    new NcParameterDescriptor("requestedLockStatus", "NcLockState", false, null, "Type of lock requested, or unlock"),
                    new NcParameterDescriptor("timeout", "NcTimeInterval", false, null, "Method fails if wait exceeds this.  0=forever"),
                ], "Lock method"),
                new NcMethodDescriptor(new NcElementId(1, 9), "AbortLockWaits", "NcMethodResult", [], "Abort all this session's lock waits on this object"),
            ],
            [ new NcEventDescriptor(new NcElementId(1, 1), "PropertyChanged", "NcPropertyChangedEventData", "Property changed event") ]
        );
    }
}

export class NcElementId extends BaseType
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
        return new NcDatatypeDescriptorStruct("NcElementId", [
            new NcFieldDescriptor("level", "NcUint16", false, false, "Level of the element"),
            new NcFieldDescriptor("index", "NcUint16", false, false, "Index of the element")
        ], null, "Class element id which contains the level and index");
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
        return new NcDatatypeDescriptorStruct("NcPort", [
            new NcFieldDescriptor("role", "NcName", false, false, "Unique within owning object"),
            new NcFieldDescriptor("direction", "NcIoDirection", false, false, "Input (sink) or output (source) port"),
            new NcFieldDescriptor("clockPath", "NcNamePath", true, false, "Rolepath of this port's sample clock or null if none")
        ], null, "Port class");
    }
}

export class NcPortReference extends BaseType
{
    public owner: string[];

    public role: string;

    public constructor(
        owner: string[],
        role: string)
    {
        super();

        this.owner = owner;
        this.role = role;
    }

    public static override GetTypeDescriptor(): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("NcPortReference", [
            new NcFieldDescriptor("owner", "NcNamePath", false, true, "Rolepath of owning object"),
            new NcFieldDescriptor("role", "NcName", false, false, "Unique identifier of this port within the owning object")
        ], null, "Device-unique port identifier");
    }
}

export class NcSignalPath extends BaseType
{
    public role: string;

    public label: string;

    public source: NcPortReference;

    public sink: NcPortReference;

    public constructor(
        role: string,
        label: string,
        source: NcPortReference,
        sink: NcPortReference)
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
            new NcFieldDescriptor("role", "NcName", false, false, "Unique identifier of this signal path in this block"),
            new NcFieldDescriptor("label", "NcString", false, false, "Optional label"),
            new NcFieldDescriptor("source", "NcPortReference", false, false, "Source reference"),
            new NcFieldDescriptor("sink", "NcPortReference", false, false, "Sink reference")
        ], null, "Signal path descriptor");
    }
}

export abstract class NcTouchpointResource extends BaseType
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
        return new NcDatatypeDescriptorStruct("NcTouchpointResource", [
            new NcFieldDescriptor("resourceType", "ncString", false, false, "The type of the resource")
        ], null, "Touchpoint resource class");
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

        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcTouchpointResourceNmos", [
            new NcFieldDescriptor("id", "NcUUID", false, false, "NMOS resource UUID")
        ], "NcTouchpointResource", "Touchpoint resource class for NMOS resources");

        currentClassDescriptor.content = currentClassDescriptor.content.concat(baseDescriptor.content);

        return currentClassDescriptor;
    }
}

export abstract class NcTouchpoint extends BaseType
{
    public contextNamespace: string;

    public resource: NcTouchpointResource[];

    constructor(
        contextNamespace: string,
        resources: NcTouchpointResource[])
    {
        super();

        this.contextNamespace = contextNamespace;
        this.resource = resources;
    }

    public static override GetTypeDescriptor(): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("NcTouchpoint", [
            new NcFieldDescriptor("contextNamespace", "NcString", false, false, "Context namespace")
        ], null, "Base touchpoint class");
    }
}

export class NcTouchpointNmos extends NcTouchpoint
{
    constructor(
        contextNamespace: string,
        resource: NcTouchpointResourceNmos[])
    {
        super(contextNamespace, resource);
    }

    public static override GetTypeDescriptor(): NcDatatypeDescriptor
    {
        let baseDescriptor = super.GetTypeDescriptor();

        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcTouchpointNmos", [
            new NcFieldDescriptor("resource", "NcTouchpointResourceNmos", false, false, "Context resource linked"),
        ], "NcTouchpoint", "Touchpoint class for NMOS resources");

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
        return new NcDatatypeDescriptorStruct("NcClassIdentity", [
            new NcFieldDescriptor("id", "NcClassId", false, false, "Class identity"),
            new NcFieldDescriptor("version", "NcVersionCode", false, false, "Class version in semantic versioning format")
        ], null, "Class identity and version");
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export abstract class NcDescriptor
{
    public description: string;

    constructor(
        description: string)
    {
        this.description = description;
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
    public description: string;

    constructor(
        role: string,
        oid: number,
        constantOid: boolean,
        identity: NcClassIdentity,
        userLabel: string,
        owner: number | null,
        description: string)
    {
        super();

        this.role = role;
        this.oid = oid;
        this.constantOid = constantOid;
        this.identity = identity;
        this.userLabel = userLabel;
        this.owner = owner;
        this.description = description;
    }

    public static override GetTypeDescriptor(): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("NcBlockMemberDescriptor", [
            new NcFieldDescriptor("role", "NcName", false, false, "Role of member in its containing block"),
            new NcFieldDescriptor("oid", "NcOid", false, false, "OID of member"),
            new NcFieldDescriptor("constantOid", "NcBoolean", false, false, "TRUE iff member's OID is hardwired into device"),
            new NcFieldDescriptor("identity", "NcClassIdentity", false, false, "Class ID & version of member"),
            new NcFieldDescriptor("userLabel", "NcString", false, false, "User label"),
            new NcFieldDescriptor("owner", "NcOid", false, false, "Containing block's OID")
        ], null, "Descriptor which is specific to a block member which is not a block");
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcBlockDescriptor extends NcBlockMemberDescriptor
{
    public blockSpecId: string | null;

    constructor(
        blockSpecId: string | null,
        role: string,
        oid: number,
        constantOid: boolean,
        identity: NcClassIdentity,
        userLabel: string,
        owner: number | null,
        description: string)
    {
        super(role, oid, constantOid, identity, userLabel, owner, description);

        this.blockSpecId = blockSpecId;
        this.oid = oid;
        this.constantOid = constantOid;
        this.identity = identity;
        this.userLabel = userLabel;
        this.owner = owner;
        this.description = description;
    }

    public static override GetTypeDescriptor(): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("NcBlockDescriptor", [
            new NcFieldDescriptor("role", "NcName", false, false, "Role of member in its containing block"),
            new NcFieldDescriptor("oid", "NcOid", false, false, "OID of member"),
            new NcFieldDescriptor("constantOid", "NcBoolean", false, false, "TRUE iff member's OID is hardwired into device"),
            new NcFieldDescriptor("identity", "NcClassIdentity", false, false, "Class ID & version of member"),
            new NcFieldDescriptor("userLabel", "NcString", false, false, "User label"),
            new NcFieldDescriptor("owner", "NcOid", false, false, "Containing block's OID"),
            new NcFieldDescriptor("blockSpecId", "NcString", false, false, "ID of BlockSpec this block implements")
        ], "NcBlockMemberDescriptor", "Descriptor which is specific to a block");
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcPropertyDescriptor extends NcDescriptor
{
    public id: NcElementId;
    public name: string;
    public typeName: string | null;
    public readOnly: boolean;
    public persistent: boolean;
    public isNullable: boolean;
    public isSequence: boolean;
    public constraints: NcParameterConstraint | null;

    constructor(
        id: NcElementId,
        name: string,
        typeName: string | null,
        readOnly: boolean,
        persistent: boolean,
        isNullable: boolean,
        isSequence: boolean,
        constraints: NcParameterConstraint | null,
        description: string)
    {
        super(description);

        this.id = id;
        this.name = name;
        this.typeName = typeName;
        this.readOnly = readOnly;
        this.persistent = persistent;
        this.isNullable = isNullable;
        this.isSequence = isSequence;
        this.constraints = constraints;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export abstract class NcParameterConstraint
{
    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcParameterConstraintNumber extends NcParameterConstraint
{
    public maximum: number;
    public minimum: number;
    public step: number;

    constructor(
        maximum: number,
        minimum: number,
        step: number)
    {
        super();

        this.maximum = maximum;
        this.minimum = minimum;
        this.step = step;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcParameterConstraintString extends NcParameterConstraint
{
    public maxCharacters: number;
    public pattern: string;

    constructor(
        maxCharacters: number,
        pattern: string)
    {
        super();
        
        this.maxCharacters = maxCharacters;
        this.pattern = pattern;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcParameterDescriptor extends NcDescriptor
{
    public name: string;
    public typeName: string | null;
    public isNullable: boolean;
    public constraints: NcParameterConstraint | null;

    constructor(
        name: string,
        typeName: string | null,
        isNullable: boolean,
        constraints: NcParameterConstraint | null,
        description: string)
    {
        super(description);

        this.name = name;
        this.typeName = typeName;
        this.isNullable = isNullable;
        this.constraints = constraints;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcMethodDescriptor extends NcDescriptor
{
    public id: NcElementId;
    public name: string;
    public resultDatatype: string;
    public parameters: NcParameterDescriptor[];

    constructor(
        id: NcElementId,
        name: string,
        resultDatatype: string,
        parameters: NcParameterDescriptor[],
        description: string)
    {
        super(description);

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

export class NcEventDescriptor extends NcDescriptor
{
    public id: NcElementId;
    public name: string;
    public eventDatatype: string;

    constructor(
        id: NcElementId,
        name: string,
        eventDatatype: string,
        description: string)
    {
        super(description);

        this.id = id;
        this.name = name;
        this.eventDatatype = eventDatatype;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcClassDescriptor extends NcDescriptor
{
    public properties: NcPropertyDescriptor[];
    public methods: NcMethodDescriptor[];
    public events: NcEventDescriptor[];

    constructor(
        description: string,
        properties: NcPropertyDescriptor[],
        methods: NcMethodDescriptor[],
        events: NcEventDescriptor[])
    {
        super(description);

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
    Enum = 3
}

export class NcFieldDescriptor extends NcDescriptor
{
    public name: string;
    public typeName: string | null;
    public isNullable: boolean;
    public isSequence: boolean;

    constructor(
        name: string,
        typeName: string | null,
        isNullable: boolean,
        isSequence: boolean,
        description: string)
    {
        super(description);

        this.name = name;
        this.typeName = typeName;
        this.isNullable = isNullable;
        this.isSequence = isSequence;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcEnumItemDescriptor extends NcDescriptor
{
    public name: string;
    public index: number;

    constructor(
        name: string,
        index: number,
        description: string)
    {
        super(description);

        this.name = name;
        this.index = index;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcDatatypeDescriptor extends NcDescriptor
{
    public name: string;
    public type: NcDatatypeType;
    public content: any | null;

    constructor(
        name: string,
        type: NcDatatypeType,
        description: string)
    {
        super(description);

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
    constructor(
        name: string,
        description: string)
    {
        super(name, NcDatatypeType.Primitive, description);
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcDatatypeDescriptorTypeDef extends NcDatatypeDescriptor
{
    public override content: string;
    public isSequence: boolean;

    constructor(
        name: string,
        content: string,
        isSequence: boolean,
        description: string)
    {
        super(name, NcDatatypeType.Typedef, description);

        this.content = content;
        this.isSequence = isSequence;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcDatatypeDescriptorStruct extends NcDatatypeDescriptor
{
    public override content: NcFieldDescriptor[];

    public parentType: string | null;

    constructor(
        name: string,
        content: NcFieldDescriptor[],
        parentType: string | null,
        description: string)
    {
        super(name, NcDatatypeType.Struct, description);

        this.content = content;
        this.parentType = parentType;
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
        content: NcEnumItemDescriptor[],
        description: string)
    {
        super(name, NcDatatypeType.Enum, description);

        this.content = content;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}