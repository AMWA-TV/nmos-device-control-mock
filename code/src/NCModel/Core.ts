import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { CommandResponseNoValue, CommandResponseWithValue } from '../NCProtocol/Commands';
import { WebSocketConnection } from '../Server';
import { INotificationContext } from '../SessionManager';

export function myIdDecorator(identity: string) {
    return Reflect.metadata('identity', identity);
}

export abstract class BaseType
{
    public static GetTypeDescriptor() : NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptor("NotDefined", NcDatatypeType.Struct, null, "Base");
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
    public touchpoints: NcTouchpoint[] | null;

    public description: string;

    public constructor(
        oid: number,
        constantOid: boolean,
        owner: number | null,
        role: string,
        userLabel: string,
        touchpoints: NcTouchpoint[] | null,
        description: string,
        notificationContext: INotificationContext)
    {
        this.oid = oid;
        this.constantOid = constantOid;
        this.owner = owner;
        this.role = role;
        this.userLabel = userLabel;
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
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.touchpoints, null);
                default:
                    return new CommandResponseNoValue(handle, NcMethodStatus.PropertyNotImplemented, 'Property does not exist in object');
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
                    return new CommandResponseNoValue(handle, NcMethodStatus.Readonly, 'Property is readonly');
                case '1p7':
                    this.userLabel = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.userLabel, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
                case '1p8':
                    return new CommandResponseNoValue(handle, NcMethodStatus.Readonly, 'Property is readonly');
                default:
                    return new CommandResponseNoValue(handle, NcMethodStatus.PropertyNotImplemented, 'Property does not exist in object');
            }
        }

        return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }

    public InvokeMethod(socket: WebSocketConnection, oid: number, methodId: NcElementId, args: { [key: string]: any } | null, handle: number) : CommandResponseNoValue
    {
        return new CommandResponseNoValue(handle, NcMethodStatus.MethodNotImplemented, 'Method does not exist in object');
    }

    public GenerateMemberDescriptor() : NcBlockMemberDescriptor
    {
        return new NcBlockMemberDescriptor(this.role, this.oid, this.constantOid, new NcClassIdentity(this.classID, this.classVersion), this.userLabel, this.owner, this.description, null);
    }

    public static GetClassDescriptor() : NcClassDescriptor
    {
        return new NcClassDescriptor("NcObject class descriptor",
            [ 
                new NcPropertyDescriptor(new NcElementId(1, 1), "classId", "NcClassId", true, true, false, false, null, "Class identity"),
                new NcPropertyDescriptor(new NcElementId(1, 2), "classVersion", "NcVersionCode", true, true, false, false, null, "Class version"),
                new NcPropertyDescriptor(new NcElementId(1, 3), "oid", "NcOid", true, true, false, false, null, "Object identifier"),
                new NcPropertyDescriptor(new NcElementId(1, 4), "constantOid", "NcBoolean", true, true, false, false, null, "TRUE iff OID is hardwired into device"),
                new NcPropertyDescriptor(new NcElementId(1, 5), "owner", "NcOid", true, true, true, false, null, "OID of containing block. Can only ever be null for the root block" ),
                new NcPropertyDescriptor(new NcElementId(1, 6), "role", "NcName", true, true, false, false, null, "role of obj in containing block"),
                new NcPropertyDescriptor(new NcElementId(1, 7), "userLabel", "NcString", false, true, false, false, null, "Scribble strip"),
                new NcPropertyDescriptor(new NcElementId(1, 8), "touchpoints", "NcTouchpoint", true, true, true, true, null, "Touchpoints to other contexts"),
            ],
            [ 
                new NcMethodDescriptor(new NcElementId(1, 1), "Get", "NcMethodResultPropertyValue", [
                    new NcParameterDescriptor("id", "NcPropertyId", false, false, null, "Property id")
                ], "Get property value"),
                new NcMethodDescriptor(new NcElementId(1, 2), "Set", "NcMethodResult", [
                    new NcParameterDescriptor("id", "NcPropertyId", false, false, null, "Property id"),
                    new NcParameterDescriptor("value", null, true, null, null, "Property value")
                ], "Set property value"),
                new NcMethodDescriptor(new NcElementId(1, 3), "GetSequenceItem", "NcMethodResultPropertyValue", [
                    new NcParameterDescriptor("id", "NcPropertyId", false, false, null, "Property id"),
                    new NcParameterDescriptor("index", "NcId32", false, false, null, "Index of item in the sequence")
                ], "Get sequence item"),
                new NcMethodDescriptor(new NcElementId(1, 4), "SetSequenceItem", "NcMethodResult", [
                    new NcParameterDescriptor("id", "NcPropertyId", false, false, null, "Property id"),
                    new NcParameterDescriptor("index", "NcId32", false, false, null, "Index of item in the sequence"),
                    new NcParameterDescriptor("value", null, true, null, null, "Value")
                ], "Set sequence item value"),
                new NcMethodDescriptor(new NcElementId(1, 5), "AddSequenceItem", "NcMethodResultId32", [
                    new NcParameterDescriptor("id", "NcPropertyId", false, false, null, "Property id"),
                    new NcParameterDescriptor("value", null, true, null, null, "Value")
                ], "Add item to sequence"),
                new NcMethodDescriptor(new NcElementId(1, 6), "RemoveSequenceItem", "NcMethodResult", [
                    new NcParameterDescriptor("id", "NcPropertyId", false, false, null, "Property id"),
                    new NcParameterDescriptor("index", "NcId32", false, false, null, "Index of item in the sequence"),
                ], "Delete sequence item")
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
            new NcFieldDescriptor("level", "NcUint16", false, false, null, "Level of the element"),
            new NcFieldDescriptor("index", "NcUint16", false, false, null, "Index of the element")
        ], null, null, "Class element id which contains the level and index");
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export enum NcMethodStatus
{
    OK = 200,
    BadCommandFormat = 400,
    Unauthorized = 401,
    BadOid = 404,
    Readonly = 405,
    InvalidRequest = 406,
    Conflict = 409,
    BufferOverflow = 413,
    ParameterError = 417,
    Locked = 423,
    DeviceError = 500,
    MethodNotImplemented = 501,
    PropertyNotImplemented = 502,
    NotReady = 503,
    Timeout = 504,
    ProtocolVersionError = 505
}

export enum NcPropertyChangeType
{
    ValueChanged = 0,
    SequenceItemAdded = 1,
    SequenceItemChanged = 2,
    SequenceItemRemoved = 3
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
            new NcFieldDescriptor("role", "NcName", false, false, null, "Unique within owning object"),
            new NcFieldDescriptor("direction", "NcIoDirection", false, false, null, "Input (sink) or output (source) port"),
            new NcFieldDescriptor("clockPath", "NcNamePath", true, false, null, "Rolepath of this port's sample clock or null if none")
        ], null, null, "Port class");
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
            new NcFieldDescriptor("owner", "NcNamePath", false, true, null, "Rolepath of owning object"),
            new NcFieldDescriptor("role", "NcName", false, false, null, "Unique identifier of this port within the owning object")
        ], null, null, "Device-unique port identifier");
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
            new NcFieldDescriptor("role", "NcName", false, false, null, "Unique identifier of this signal path in this block"),
            new NcFieldDescriptor("label", "NcString", true, false, null, "Optional label"),
            new NcFieldDescriptor("source", "NcPortReference", false, false, null, "Source reference"),
            new NcFieldDescriptor("sink", "NcPortReference", false, false, null, "Sink reference")
        ], null, null, "Signal path descriptor");
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
            new NcFieldDescriptor("resourceType", "NcString", false, false, null, "The type of the resource")
        ], null, null, "Touchpoint resource class");
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
            new NcFieldDescriptor("id", "NcUUID", false, false, null, "NMOS resource UUID")
        ], "NcTouchpointResource", null, "Touchpoint resource class for NMOS resources");

        currentClassDescriptor.content = currentClassDescriptor.content.concat(baseDescriptor.content);

        return currentClassDescriptor;
    }
}

export abstract class NcTouchpoint extends BaseType
{
    public contextNamespace: string;

    public resource: NcTouchpointResource;

    constructor(
        contextNamespace: string,
        resource: NcTouchpointResource)
    {
        super();

        this.contextNamespace = contextNamespace;
        this.resource = resource;
    }

    public static override GetTypeDescriptor(): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("NcTouchpoint", [
            new NcFieldDescriptor("contextNamespace", "NcString", false, false, null, "Context namespace")
        ], null, null, "Base touchpoint class");
    }
}

export class NcTouchpointNmos extends NcTouchpoint
{
    constructor(
        contextNamespace: string,
        resource: NcTouchpointResourceNmos)
    {
        super(contextNamespace, resource);
    }

    public static override GetTypeDescriptor(): NcDatatypeDescriptor
    {
        let baseDescriptor = super.GetTypeDescriptor();

        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcTouchpointNmos", [
            new NcFieldDescriptor("resource", "NcTouchpointResourceNmos", false, false, null, "Context resource linked"),
        ], "NcTouchpoint", null, "Touchpoint class for NMOS resources");

        currentClassDescriptor.content = currentClassDescriptor.content.concat(baseDescriptor.content);

        return currentClassDescriptor;
    }
}

export class NcClassIdentity extends BaseType
{
    public id: number[];
    public version: string;

    constructor(
        id: number[],
        version: string) 
    {
        super();

        this.id = id;
        this.version = version;
    }

    public static override GetTypeDescriptor(): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("NcClassIdentity", [
            new NcFieldDescriptor("id", "NcClassId", false, false, null, "Class identity"),
            new NcFieldDescriptor("version", "NcVersionCode", false, false, null, "Class version in semantic versioning format")
        ], null, null, "Class identity and version");
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
    public constraints: NcPropertyConstraint | null;

    constructor(
        role: string,
        oid: number,
        constantOid: boolean,
        identity: NcClassIdentity,
        userLabel: string,
        owner: number | null,
        description: string,
        constraints: NcPropertyConstraint | null)
    {
        super();

        this.role = role;
        this.oid = oid;
        this.constantOid = constantOid;
        this.identity = identity;
        this.userLabel = userLabel;
        this.owner = owner;
        this.description = description;
        this.constraints = constraints;
    }

    public static override GetTypeDescriptor(): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("NcBlockMemberDescriptor", [
            new NcFieldDescriptor("role", "NcName", false, false, null, "Role of member in its containing block"),
            new NcFieldDescriptor("oid", "NcOid", false, false, null, "OID of member"),
            new NcFieldDescriptor("constantOid", "NcBoolean", false, false, null, "TRUE iff member's OID is hardwired into device"),
            new NcFieldDescriptor("identity", "NcClassIdentity", false, false, null, "Class ID & version of member"),
            new NcFieldDescriptor("userLabel", "NcString", false, false, null, "User label"),
            new NcFieldDescriptor("owner", "NcOid", false, false, null, "Containing block's OID")
        ], null, null, "Descriptor which is specific to a block member which is not a block");
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
        description: string,
        constraints: NcPropertyConstraint | null)
    {
        super(role, oid, constantOid, identity, userLabel, owner, description, constraints);

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
            new NcFieldDescriptor("role", "NcName", false, false, null, "Role of member in its containing block"),
            new NcFieldDescriptor("oid", "NcOid", false, false, null, "OID of member"),
            new NcFieldDescriptor("constantOid", "NcBoolean", false, false, null, "TRUE iff member's OID is hardwired into device"),
            new NcFieldDescriptor("identity", "NcClassIdentity", false, false, null, "Class ID & version of member"),
            new NcFieldDescriptor("userLabel", "NcString", false, false, null, "User label"),
            new NcFieldDescriptor("owner", "NcOid", false, false, null, "Containing block's OID"),
            new NcFieldDescriptor("blockSpecId", "NcString", false, false, null, "ID of BlockSpec this block implements")
        ], "NcBlockMemberDescriptor", null, "Descriptor which is specific to a block");
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

export class NcPropertyConstraint
{
    public path: string[] | null;
    public propertyId: NcElementId;
    public value: any | null;

    constructor(
        path: string[] | null,
        propertyId: NcElementId,
        value: any | null)
    {
        this.path = path;
        this.propertyId = propertyId;
        this.value = value;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcPropertyConstraintNumber extends NcPropertyConstraint
{
    public maximum: number;
    public minimum: number;
    public step: number;

    constructor(
        path: string[] | null,
        propertyId: NcElementId,
        value: any | null,
        maximum: number,
        minimum: number,
        step: number)
    {
        super(path, propertyId, value);

        this.maximum = maximum;
        this.minimum = minimum;
        this.step = step;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcPropertyConstraintString extends NcPropertyConstraint
{
    public maxCharacters: number;
    public pattern: string;

    constructor(
        path: string[] | null,
        propertyId: NcElementId,
        value: any | null,
        maxCharacters: number,
        pattern: string)
    {
        super(path, propertyId, value);
        
        this.maxCharacters = maxCharacters;
        this.pattern = pattern;
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
    public maxCharacters: number | null;
    public pattern: string | null;

    constructor(
        maxCharacters: number | null,
        pattern: string | null)
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
    public isSequence: boolean | null;
    public constraints: NcParameterConstraint | null;

    constructor(
        name: string,
        typeName: string | null,
        isNullable: boolean,
        isSequence: boolean | null,
        constraints: NcParameterConstraint | null,
        description: string)
    {
        super(description);

        this.name = name;
        this.typeName = typeName;
        this.isNullable = isNullable;
        this.isSequence = isSequence;
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
    public isSequence: boolean | null;
    public constraints: NcParameterConstraint | null;

    constructor(
        name: string,
        typeName: string | null,
        isNullable: boolean,
        isSequence: boolean | null,
        constraints: NcParameterConstraint | null,
        description: string)
    {
        super(description);

        this.name = name;
        this.typeName = typeName;
        this.isNullable = isNullable;
        this.isSequence = isSequence;
        this.constraints = constraints;
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
    public constraints: NcParameterConstraint | null;

    constructor(
        name: string,
        type: NcDatatypeType,
        constraints: NcParameterConstraint | null,
        description: string)
    {
        super(description);

        this.name = name;
        this.type = type;
        this.constraints = constraints;
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
        constraints: NcParameterConstraint | null,
        description: string)
    {
        super(name, NcDatatypeType.Primitive, constraints, description);
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
        constraints: NcParameterConstraint | null,
        description: string)
    {
        super(name, NcDatatypeType.Typedef, constraints, description);

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
        constraints: NcParameterConstraint | null,
        description: string)
    {
        super(name, NcDatatypeType.Struct, constraints, description);

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
        constraints: NcParameterConstraint | null,
        description: string)
    {
        super(name, NcDatatypeType.Enum, constraints, description);

        this.content = content;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}