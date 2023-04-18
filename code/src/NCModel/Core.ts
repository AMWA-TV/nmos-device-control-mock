import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { CommandResponseError, CommandResponseNoValue, CommandResponseWithValue } from '../NCProtocol/Commands';
import { WebSocketConnection } from '../Server';
import { INotificationContext } from '../SessionManager';
import { NcReceiverStatus } from './Features';

export function myIdDecorator(identity: string) {
    return Reflect.metadata('identity', identity);
}

export abstract class BaseType
{
    public static GetTypeDescriptor(includeInherited: boolean) : NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptor("NotDefined", NcDatatypeType.Struct, null, "Base");
    }
}

export abstract class NcObject
{
    public notificationContext: INotificationContext;

    public static staticClassID: number[] = [ 1 ];

    @myIdDecorator('1p1')
    public classID: number[] = NcObject.staticClassID;

    @myIdDecorator('1p2')
    public oid: number;

    @myIdDecorator('1p3')
    public constantOid: boolean;

    @myIdDecorator('1p4')
    public owner: number | null

    @myIdDecorator('1p5')
    public role: string;

    @myIdDecorator('1p6')
    public userLabel: string | null;

    @myIdDecorator('1p7')
    public touchpoints: NcTouchpoint[] | null;

    @myIdDecorator('1p8')
    public runtimePropertyConstraints: NcPropertyConstraints[] | null;

    public description: string;

    public constructor(
        oid: number,
        constantOid: boolean,
        owner: number | null,
        role: string,
        userLabel: string | null,
        touchpoints: NcTouchpoint[] | null,
        runtimePropertyConstraints: NcPropertyConstraints[] | null,
        description: string,
        notificationContext: INotificationContext)
    {
        this.oid = oid;
        this.constantOid = constantOid;
        this.owner = owner;
        this.role = role;
        this.userLabel = userLabel;
        this.touchpoints = touchpoints;
        this.runtimePropertyConstraints = runtimePropertyConstraints;
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
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.classID);
                case '1p2':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.oid);
                case '1p3':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.constantOid);
                case '1p4':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.owner);
                case '1p5':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.role);
                case '1p6':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.userLabel);
                case '1p7':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.touchpoints);
                case '1p8':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.runtimePropertyConstraints);
                default:
                    return new CommandResponseError(handle, NcMethodStatus.PropertyNotImplemented, 'Property does not exist in object');
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
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
                    return new CommandResponseError(handle, NcMethodStatus.Readonly, 'Property is readonly');
                case '1p6':
                    this.userLabel = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.userLabel, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                case '1p7':
                case '1p8':
                    return new CommandResponseError(handle, NcMethodStatus.Readonly, 'Property is readonly');
                default:
                    return new CommandResponseError(handle, NcMethodStatus.PropertyNotImplemented, 'Property does not exist in object');
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }

    public InvokeMethod(socket: WebSocketConnection, oid: number, methodId: NcElementId, args: { [key: string]: any } | null, handle: number) : CommandResponseNoValue
    {
        return new CommandResponseError(handle, NcMethodStatus.MethodNotImplemented, 'Method does not exist in object');
    }

    public GenerateMemberDescriptor() : NcBlockMemberDescriptor
    {
        return new NcBlockMemberDescriptor(this.role, this.oid, this.constantOid, this.classID, this.userLabel, this.owner, this.description, null);
    }

    public static GetClassDescriptor(includeInherited: boolean) : NcClassDescriptor
    {
        return new NcClassDescriptor(`${NcObject.name} class descriptor`,
            NcObject.staticClassID, NcObject.name, null,
            [ 
                new NcPropertyDescriptor(new NcElementId(1, 1), "classId", "NcClassId", true, true, false, false, null, "Class identity"),
                new NcPropertyDescriptor(new NcElementId(1, 2), "oid", "NcOid", true, true, false, false, null, "Object identifier"),
                new NcPropertyDescriptor(new NcElementId(1, 3), "constantOid", "NcBoolean", true, true, false, false, null, "TRUE iff OID is hardwired into device"),
                new NcPropertyDescriptor(new NcElementId(1, 4), "owner", "NcOid", true, true, true, false, null, "OID of containing block. Can only ever be null for the root block" ),
                new NcPropertyDescriptor(new NcElementId(1, 5), "role", "NcString", true, true, false, false, null, "role of obj in containing block"),
                new NcPropertyDescriptor(new NcElementId(1, 6), "userLabel", "NcString", false, true, true, false, null, "Scribble strip"),
                new NcPropertyDescriptor(new NcElementId(1, 7), "touchpoints", "NcTouchpoint", true, true, true, true, null, "Touchpoints to other contexts"),
                new NcPropertyDescriptor(new NcElementId(1, 8), "runtimePropertyConstraints", "NcPropertyConstraints", true, true, true, true, null, "Runtime property constraints"),
            ],
            [ 
                new NcMethodDescriptor(new NcElementId(1, 1), "Get", "NcMethodResultPropertyValue", [
                    new NcParameterDescriptor("id", "NcPropertyId", false, false, null, "Property id")
                ], "Get property value"),
                new NcMethodDescriptor(new NcElementId(1, 2), "Set", "NcMethodResult", [
                    new NcParameterDescriptor("id", "NcPropertyId", false, false, null, "Property id"),
                    new NcParameterDescriptor("value", null, true, false, null, "Property value")
                ], "Set property value"),
                new NcMethodDescriptor(new NcElementId(1, 3), "GetSequenceItem", "NcMethodResultPropertyValue", [
                    new NcParameterDescriptor("id", "NcPropertyId", false, false, null, "Property id"),
                    new NcParameterDescriptor("index", "NcId", false, false, null, "Index of item in the sequence")
                ], "Get sequence item"),
                new NcMethodDescriptor(new NcElementId(1, 4), "SetSequenceItem", "NcMethodResult", [
                    new NcParameterDescriptor("id", "NcPropertyId", false, false, null, "Property id"),
                    new NcParameterDescriptor("index", "NcId", false, false, null, "Index of item in the sequence"),
                    new NcParameterDescriptor("value", null, true, false, null, "Value")
                ], "Set sequence item value"),
                new NcMethodDescriptor(new NcElementId(1, 5), "AddSequenceItem", "NcMethodResultId", [
                    new NcParameterDescriptor("id", "NcPropertyId", false, false, null, "Property id"),
                    new NcParameterDescriptor("value", null, true, false, null, "Value")
                ], "Add item to sequence"),
                new NcMethodDescriptor(new NcElementId(1, 6), "RemoveSequenceItem", "NcMethodResult", [
                    new NcParameterDescriptor("id", "NcPropertyId", false, false, null, "Property id"),
                    new NcParameterDescriptor("index", "NcId", false, false, null, "Index of item in the sequence"),
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

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
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

export class NcPropertyId extends NcElementId
{
    constructor(
        level: number,
        index: number)
    {
        super(level, index);
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentDescriptor = new NcDatatypeDescriptorStruct("NcPropertyId", [], "NcElementId", null, "Property id which contains the level and index");

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentDescriptor.fields = currentDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

        return currentDescriptor;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcMethodId extends NcElementId
{
    constructor(
        level: number,
        index: number)
    {
        super(level, index);
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentDescriptor = new NcDatatypeDescriptorStruct("NcMethodId", [], "NcElementId", null, "Method id which contains the level and index");

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentDescriptor.fields = currentDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

        return currentDescriptor;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcEventId extends NcElementId
{
    constructor(
        level: number,
        index: number)
    {
        super(level, index);
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentDescriptor = new NcDatatypeDescriptorStruct("NcEventId", [], "NcElementId", null, "Event id which contains the level and index");

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentDescriptor.fields = currentDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

        return currentDescriptor;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export enum NcMethodStatus
{
    OK = 200,
    PropertyDeprecated = 298,
    MethodDeprecated = 299,
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

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("NcPort", [
            new NcFieldDescriptor("role", "NcString", false, false, null, "Unique within owning object"),
            new NcFieldDescriptor("direction", "NcIoDirection", false, false, null, "Input (sink) or output (source) port"),
            new NcFieldDescriptor("clockPath", "NcRolePath", true, false, null, "Role path of this port's sample clock or null if none")
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

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("NcPortReference", [
            new NcFieldDescriptor("owner", "NcRolePath", false, false, null, "Role path of owning object"),
            new NcFieldDescriptor("role", "NcString", false, false, null, "Unique role of this port within the owning object")
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

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("NcSignalPath", [
            new NcFieldDescriptor("role", "NcString", false, false, null, "Unique identifier of this signal path in this block"),
            new NcFieldDescriptor("label", "NcString", true, false, null, "Optional label"),
            new NcFieldDescriptor("source", "NcPortReference", false, false, null, "Source reference"),
            new NcFieldDescriptor("sink", "NcPortReference", false, false, null, "Sink reference")
        ], null, null, "Signal path descriptor");
    }
}

export abstract class NcMethodResult extends BaseType
{
    public status: NcMethodStatus;

    public constructor(
        status: NcMethodStatus)
    {
        super();

        this.status = status;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("NcMethodResult", [
            new NcFieldDescriptor("status", "NcMethodStatus", false, false, null, "Status for the invoked method")
        ], null, null, "Base result of the invoked method");
    }
}

export class NcMethodResultError extends NcMethodResult
{
    public errorMessage: string;

    public constructor(
        status: NcMethodStatus,
        errorMessage: string)
    {
        super(status);

        this.errorMessage = errorMessage;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcMethodResultError", [
            new NcFieldDescriptor("errorMessage", "NcString", true, false, null, "Optional error message"),
        ], "NcMethodResult", null, "Error result - to be used when the method call encounters an error")

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentClassDescriptor.fields = currentClassDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

        return currentClassDescriptor;
    }
}

export class NcMethodResultPropertyValue extends NcMethodResult
{
    public value: any | null;

    public constructor(
        status: NcMethodStatus,
        value: any | null)
    {
        super(status);

        this.value = value;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcMethodResultPropertyValue", [
            new NcFieldDescriptor("value", null, true, false, null, "Getter method value for the associated property")
        ], "NcMethodResult", null, "Result when invoking the getter method associated with a property")

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentClassDescriptor.fields = currentClassDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

        return currentClassDescriptor;
    }
}

export class NcMethodResultId extends NcMethodResult
{
    public value: number;

    public constructor(
        status: NcMethodStatus,
        value: number)
    {
        super(status);

        this.value = value;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcMethodResultId", [
            new NcFieldDescriptor("value", "NcId", false, false, null, "Id result value")
        ], "NcMethodResult", null, "Id method result")

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentClassDescriptor.fields = currentClassDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

        return currentClassDescriptor;
    }
}

export class NcMethodResultReceiverStatus extends NcMethodResult
{
    public value: NcReceiverStatus;

    public constructor(
        status: NcMethodStatus,
        value: NcReceiverStatus)
    {
        super(status);

        this.value = value;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcMethodResultReceiverStatus", [
            new NcFieldDescriptor("value", "NcReceiverStatus", false, false, null, "Receiver status method result value")
        ], "NcMethodResult", null, "Method result containing receiver status information as the value")

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentClassDescriptor.fields = currentClassDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

        return currentClassDescriptor;
    }
}

export class NcMethodResultBlockMemberDescriptors extends NcMethodResult
{
    public value: NcBlockMemberDescriptor[];

    public constructor(
        status: NcMethodStatus,
        value: NcBlockMemberDescriptor[])
    {
        super(status);

        this.value = value;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcMethodResultBlockMemberDescriptors", [
            new NcFieldDescriptor("value", "NcBlockMemberDescriptor", false, true, null, "Block member descriptors method result value")
        ], "NcMethodResult", null, "Method result containing block member descriptors as the value")

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentClassDescriptor.fields = currentClassDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

        return currentClassDescriptor;
    }
}

export class NcMethodResultClassDescriptor extends NcMethodResult
{
    public value: NcClassDescriptor;

    public constructor(
        status: NcMethodStatus,
        value: NcClassDescriptor)
    {
        super(status);

        this.value = value;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcMethodResultClassDescriptor", [
            new NcFieldDescriptor("value", "NcClassDescriptor", false, false, null, "Class descriptor method result value")
        ], "NcMethodResult", null, "Method result containing a class descriptor as the value")

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentClassDescriptor.fields = currentClassDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

        return currentClassDescriptor;
    }
}

export class NcMethodResultDatatypeDescriptor extends NcMethodResult
{
    public value: NcDatatypeDescriptor;

    public constructor(
        status: NcMethodStatus,
        value: NcDatatypeDescriptor)
    {
        super(status);

        this.value = value;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcMethodResultDatatypeDescriptor", [
            new NcFieldDescriptor("value", "NcDatatypeDescriptor", false, false, null, "Datatype descriptor method result value")
        ], "NcMethodResult", null, "Method result containing a datatype descriptor as the value")

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentClassDescriptor.fields = currentClassDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

        return currentClassDescriptor;
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

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
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

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcTouchpointResourceNmos", [
            new NcFieldDescriptor("id", "NcUuid", false, false, null, "NMOS resource UUID")
        ], "NcTouchpointResource", null, "Touchpoint resource class for NMOS resources");

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentClassDescriptor.fields = currentClassDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

        return currentClassDescriptor;
    }
}

export class NcTouchpointResourceNmosChannelMapping extends NcTouchpointResourceNmos
{
    public ioId: string;

    public constructor(
        resourceType: string,
        id: string,
        ioId: string)
    {
        super(resourceType, id);

        this.ioId = ioId;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcTouchpointResourceNmosChannelMapping", [
            new NcFieldDescriptor("ioId", "NcString", false, false, null, "IS-08 Audio Channel Mapping input or output ID")
        ], "NcTouchpointResourceNmos", null, "Touchpoint resource class for NMOS resources");

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentClassDescriptor.fields = currentClassDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

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

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
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

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcTouchpointNmos", [
            new NcFieldDescriptor("resource", "NcTouchpointResourceNmos", false, false, null, "Context NMOS resource"),
        ], "NcTouchpoint", null, "Touchpoint class for NMOS resources");

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentClassDescriptor.fields = currentClassDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

        return currentClassDescriptor;
    }
}

export class NcTouchpointNmosChannelMapping extends NcTouchpoint
{
    constructor(
        contextNamespace: string,
        resource: NcTouchpointResourceNmosChannelMapping)
    {
        super(contextNamespace, resource);
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcTouchpointNmosChannelMapping", [
            new NcFieldDescriptor("resource", "NcTouchpointResourceNmosChannelMapping", false, false, null, "Context Channel Mapping resource"),
        ], "NcTouchpoint", null, "Touchpoint class for NMOS IS-08 resources");

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentClassDescriptor.fields = currentClassDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

        return currentClassDescriptor;
    }
}

export abstract class NcDescriptor extends BaseType
{
    public description: string;

    constructor(
        description: string)
    {
        super();

        this.description = description;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("NcDescriptor", [
            new NcFieldDescriptor("description", "NcString", true, false, null, "Optional user facing description")
        ], null, null, "Base descriptor");
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
    public classId: number[];
    public userLabel: string | null;
    public owner: number | null;
    public description: string;
    public constraints: NcPropertyConstraints | null;

    constructor(
        role: string,
        oid: number,
        constantOid: boolean,
        classId: number[],
        userLabel: string | null,
        owner: number | null,
        description: string,
        constraints: NcPropertyConstraints | null)
    {
        super();

        this.role = role;
        this.oid = oid;
        this.constantOid = constantOid;
        this.classId = classId;
        this.userLabel = userLabel;
        this.owner = owner;
        this.description = description;
        this.constraints = constraints;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcBlockMemberDescriptor", [
            new NcFieldDescriptor("role", "NcString", false, false, null, "Role of member in its containing block"),
            new NcFieldDescriptor("oid", "NcOid", false, false, null, "OID of member"),
            new NcFieldDescriptor("constantOid", "NcBoolean", false, false, null, "TRUE iff member's OID is hardwired into device"),
            new NcFieldDescriptor("classId", "NcClassId", false, false, null, "Class ID"),
            new NcFieldDescriptor("userLabel", "NcString", true, false, null, "User label"),
            new NcFieldDescriptor("owner", "NcOid", false, false, null, "Containing block's OID")
        ], "NcDescriptor", null, "Descriptor which is specific to a block member which is not a block");

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentClassDescriptor.fields = currentClassDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

        return currentClassDescriptor;
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
        classId: number[],
        userLabel: string | null,
        owner: number | null,
        description: string,
        constraints: NcPropertyConstraints | null)
    {
        super(role, oid, constantOid, classId, userLabel, owner, description, constraints);

        this.blockSpecId = blockSpecId;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcBlockDescriptor", [
            new NcFieldDescriptor("blockSpecId", "NcString", false, false, null, "ID of BlockSpec this block implements")
        ], "NcBlockMemberDescriptor", null, "Descriptor which is specific to a block");

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentClassDescriptor.fields = currentClassDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

        return currentClassDescriptor;
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
    public isReadOnly: boolean;
    public isPersistent: boolean;
    public isNullable: boolean;
    public isSequence: boolean;
    public isDeprecated: boolean;
    public isConstant: boolean;
    public constraints: NcParameterConstraints | null;

    constructor(
        id: NcElementId,
        name: string,
        typeName: string | null,
        isReadOnly: boolean,
        isPersistent: boolean,
        isNullable: boolean,
        isSequence: boolean,
        constraints: NcParameterConstraints | null,
        description: string,
        isDeprecated: boolean = false,
        isConstant: boolean = false)
    {
        super(description);

        this.id = id;
        this.name = name;
        this.typeName = typeName;
        this.isReadOnly = isReadOnly;
        this.isPersistent = isPersistent;
        this.isNullable = isNullable;
        this.isSequence = isSequence;
        this.constraints = constraints;
        this.isDeprecated = isDeprecated
        this.isConstant = isConstant;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcPropertyDescriptor", [
            new NcFieldDescriptor("id", "NcPropertyId", false, false, null, "Property id with level and index"),
            new NcFieldDescriptor("name", "NcName", false, false, null, "Name of property"),
            new NcFieldDescriptor("typeName", "NcName", true, false, null, "Name of property's datatype. Can only ever be null if the type is any"),
            new NcFieldDescriptor("isReadOnly", "NcBoolean", false, false, null, "TRUE iff property is read-only"),
            new NcFieldDescriptor("isPersistent", "NcBoolean", false, false, null, "TRUE iff property value survives power-on reset"),
            new NcFieldDescriptor("isNullable", "NcBoolean", false, false, null, "TRUE iff property is nullable"),
            new NcFieldDescriptor("isSequence", "NcBoolean", false, false, null, "TRUE iff property is a sequence"),
            new NcFieldDescriptor("isDeprecated", "NcBoolean", false, false, null, "TRUE iff property is marked as deprecated"),
            new NcFieldDescriptor("isConstant", "NcBoolean", false, false, null, "TRUE iff property is readonly and constant (its value is never expected to change)"),
            new NcFieldDescriptor("constraints", "NcParameterConstraints", true, false, null, "Optional constraints on top of the underlying data type")
        ], "NcDescriptor", null, "Descriptor of a class property");

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentClassDescriptor.fields = currentClassDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

        return currentClassDescriptor;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcPropertyConstraints extends BaseType
{
    public path: string[] | null;
    public propertyId: NcElementId;
    public defaultValue: any | null;

    constructor(
        path: string[] | null,
        propertyId: NcElementId,
        defaultValue: any | null)
    {
        super();

        this.path = path;
        this.propertyId = propertyId;
        this.defaultValue = defaultValue;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("NcPropertyConstraints", [
            new NcFieldDescriptor("path", "NcRolePath", true, false, null, "relative path to member (null means current member)"),
            new NcFieldDescriptor("propertyId", "NcPropertyId", false, false, null, "ID of property being constrained"),
            new NcFieldDescriptor("defaultValue", null, true, false, null, "optional default value")
        ], null, null, "Property constraints class");
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcPropertyConstraintsNumber extends NcPropertyConstraints
{
    public maximum: number;
    public minimum: number;
    public step: number;

    constructor(
        path: string[] | null,
        propertyId: NcElementId,
        defaultValue: any | null,
        maximum: number,
        minimum: number,
        step: number)
    {
        super(path, propertyId, defaultValue);

        this.maximum = maximum;
        this.minimum = minimum;
        this.step = step;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcPropertyConstraintsNumber", [
            new NcFieldDescriptor("maximum", null, true, false, null, "optional maximum"),
            new NcFieldDescriptor("minimum", null, true, false, null, "optional minimum"),
            new NcFieldDescriptor("step", null, true, false, null, "optional step"),
        ], "NcPropertyConstraints", null, "Number property constraints class");

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentClassDescriptor.fields = currentClassDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

        return currentClassDescriptor;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcPropertyConstraintsString extends NcPropertyConstraints
{
    public maxCharacters: number;
    public pattern: string;

    constructor(
        path: string[] | null,
        propertyId: NcElementId,
        defaultValue: any | null,
        maxCharacters: number,
        pattern: string)
    {
        super(path, propertyId, defaultValue);
        
        this.maxCharacters = maxCharacters;
        this.pattern = pattern;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcPropertyConstraintsString", [
            new NcFieldDescriptor("maxCharacters", "NcUint32", true, false, null, "maximum characters allowed"),
            new NcFieldDescriptor("pattern", "NcRegex", true, false, null, "regex pattern")
        ], "NcPropertyConstraints", null, "String property constraints class");

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentClassDescriptor.fields = currentClassDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

        return currentClassDescriptor;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcPropertyConstraintsFixed extends NcPropertyConstraints
{
    public value: any | null;

    constructor(
        path: string[] | null,
        propertyId: NcElementId,
        defaultValue: any | null,
        value: any | null)
    {
        super(path, propertyId, defaultValue);
        
        this.value = value;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcPropertyConstraintsFixed", [
            new NcFieldDescriptor("value", null, true, false, null, "Signals a fixed value for this property")
        ], "NcPropertyConstraints", null, "Fixed property constraints class");

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentClassDescriptor.fields = currentClassDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

        return currentClassDescriptor;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcPropertyConstraintsEnum extends NcPropertyConstraints
{
    public possibleValues: NcEnumItemDescriptor[];

    constructor(
        path: string[] | null,
        propertyId: NcElementId,
        defaultValue: any | null,
        possibleValues: NcEnumItemDescriptor[])
    {
        super(path, propertyId, defaultValue);
        
        this.possibleValues = possibleValues;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcPropertyConstraintsEnum", [
            new NcFieldDescriptor("possibleValues", "NcEnumItemDescriptor", false, true, null, "Allowed values")
        ], "NcPropertyConstraints", null, "Enum property constraints class");

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentClassDescriptor.fields = currentClassDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

        return currentClassDescriptor;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export abstract class NcParameterConstraints extends BaseType
{
    public defaultValue: any | null;

    constructor(
        defaultValue: any | null)
    {
        super();

        this.defaultValue = defaultValue;
    } 

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("NcParameterConstraints", [
            new NcFieldDescriptor("defaultValue", null, true, false, null, "Default value")
        ], null, null, "Abstract parameter constraints class");
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcParameterConstraintsNumber extends NcParameterConstraints
{
    public maximum: number;
    public minimum: number;
    public step: number;

    constructor(
        maximum: number,
        minimum: number,
        step: number)
    {
        super(null);

        this.maximum = maximum;
        this.minimum = minimum;
        this.step = step;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcParameterConstraintsNumber", [
            new NcFieldDescriptor("maximum", null, true, false, null, "optional maximum"),
            new NcFieldDescriptor("minimum", null, true, false, null, "optional minimum"),
            new NcFieldDescriptor("step", null, true, false, null, "optional step"),
        ], "NcParameterConstraints", null, "Number parameter constraints class");

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentClassDescriptor.fields = currentClassDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

        return currentClassDescriptor;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcParameterConstraintsString extends NcParameterConstraints
{
    public maxCharacters: number | null;
    public pattern: string | null;

    constructor(
        maxCharacters: number | null,
        pattern: string | null)
    {
        super(null);
        
        this.maxCharacters = maxCharacters;
        this.pattern = pattern;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcParameterConstraintsString", [
            new NcFieldDescriptor("maxCharacters", "NcUint32", true, false, null, "maximum characters allowed"),
            new NcFieldDescriptor("pattern", "NcRegex", true, false, null, "regex pattern")
        ], "NcParameterConstraints", null, "String parameter constraints class");

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentClassDescriptor.fields = currentClassDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

        return currentClassDescriptor;
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
    public isSequence: boolean;
    public constraints: NcParameterConstraints | null;

    constructor(
        name: string,
        typeName: string | null,
        isNullable: boolean,
        isSequence: boolean,
        constraints: NcParameterConstraints | null,
        description: string)
    {
        super(description);

        this.name = name;
        this.typeName = typeName;
        this.isNullable = isNullable;
        this.isSequence = isSequence;
        this.constraints = constraints;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcParameterDescriptor", [
            new NcFieldDescriptor("name", "NcName", false, false, null, "Name of parameter"),
            new NcFieldDescriptor("typeName", "NcName", true, false, null, "Name of parameter's datatype. Can only ever be null if the type is any"),
            new NcFieldDescriptor("isNullable", "NcBoolean", false, false, null, "TRUE iff property is nullable"),
            new NcFieldDescriptor("isSequence", "NcBoolean", false, false, null, "TRUE iff property is a sequence"),
            new NcFieldDescriptor("constraints", "NcParameterConstraints", true, false, null, "Optional constraints on top of the underlying data type")
        ], "NcDescriptor", null, "Descriptor of a method parameter");

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentClassDescriptor.fields = currentClassDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

        return currentClassDescriptor;
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
    public isDeprecated: boolean;

    constructor(
        id: NcElementId,
        name: string,
        resultDatatype: string,
        parameters: NcParameterDescriptor[],
        description: string,
        isDeprecated: boolean = false)
    {
        super(description);

        this.id = id;
        this.name = name;
        this.resultDatatype = resultDatatype;
        this.parameters = parameters;
        this.isDeprecated = isDeprecated;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcMethodDescriptor", [
            new NcFieldDescriptor("id", "NcMethodId", false, false, null, "Method id with level and index"),
            new NcFieldDescriptor("name", "NcName", false, false, null, "Name of method"),
            new NcFieldDescriptor("resultDatatype", "NcName", true, false, null, "Name of method result's datatype"),
            new NcFieldDescriptor("parameters", "NcParameterDescriptor", false, true, null, "Parameter descriptors if any"),
            new NcFieldDescriptor("isDeprecated", "NcBoolean", false, false, null, "TRUE iff property is marked as deprecated")
        ], "NcDescriptor", null, "Descriptor of a class method");

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentClassDescriptor.fields = currentClassDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

        return currentClassDescriptor;
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
    public isDeprecated: boolean;

    constructor(
        id: NcElementId,
        name: string,
        eventDatatype: string,
        description: string,
        isDeprecated: boolean = false)
    {
        super(description);

        this.id = id;
        this.name = name;
        this.eventDatatype = eventDatatype;
        this.isDeprecated = isDeprecated;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcEventDescriptor", [
            new NcFieldDescriptor("id", "NcEventId", false, false, null, "Event id with level and index"),
            new NcFieldDescriptor("name", "NcName", false, false, null, "Name of event"),
            new NcFieldDescriptor("eventDatatype", "NcName", true, false, null, "Name of event data's datatype"),
            new NcFieldDescriptor("isDeprecated", "NcBoolean", false, false, null, "TRUE iff property is marked as deprecated")
        ], "NcDescriptor", null, "Descriptor of a class event");

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentClassDescriptor.fields = currentClassDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

        return currentClassDescriptor;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcClassDescriptor extends NcDescriptor
{
    public identity: number[];
    public name: string;
    public fixedRole: string | null;
    public properties: NcPropertyDescriptor[];
    public methods: NcMethodDescriptor[];
    public events: NcEventDescriptor[];

    constructor(
        description: string,
        identity: number[],
        name: string,
        fixedRole: string | null,
        properties: NcPropertyDescriptor[],
        methods: NcMethodDescriptor[],
        events: NcEventDescriptor[])
    {
        super(description);

        this.identity = identity;
        this.name = name;
        this.fixedRole = fixedRole;
        this.properties = properties;
        this.methods = methods;
        this.events = events;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcClassDescriptor", [
            new NcFieldDescriptor("identity", "NcClassId", false, false, null, "Identity of the class"),
            new NcFieldDescriptor("name", "NcName", false, false, null, "Name of the class"),
            new NcFieldDescriptor("fixedRole", "NcString", true, false, null, "Role if the class has fixed role (manager classes)"),
            new NcFieldDescriptor("properties", "NcPropertyDescriptor", false, true, null, "Property descriptors"),
            new NcFieldDescriptor("methods", "NcMethodDescriptor", false, true, null, "Method descriptors"),
            new NcFieldDescriptor("events", "NcEventDescriptor", false, true, null, "Event descriptors")
        ], "NcDescriptor", null, "Descriptor of a class");

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentClassDescriptor.fields = currentClassDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

        return currentClassDescriptor;
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
    public constraints: NcParameterConstraints | null;

    constructor(
        name: string,
        typeName: string | null,
        isNullable: boolean,
        isSequence: boolean,
        constraints: NcParameterConstraints | null,
        description: string)
    {
        super(description);

        this.name = name;
        this.typeName = typeName;
        this.isNullable = isNullable;
        this.isSequence = isSequence;
        this.constraints = constraints;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcFieldDescriptor", [
            new NcFieldDescriptor("name", "NcName", false, false, null, "Name of field"),
            new NcFieldDescriptor("typeName", "NcName", true, false, null, "Name of field's datatype. Can only ever be null if the type is any"),
            new NcFieldDescriptor("isNullable", "NcBoolean", false, false, null, "TRUE iff field is nullable"),
            new NcFieldDescriptor("isSequence", "NcBoolean", false, false, null, "TRUE iff field is a sequence"),
            new NcFieldDescriptor("constraints", "NcParameterConstraints", true, false, null, "Optional constraints on top of the underlying data type")
        ], "NcDescriptor", null, "Descriptor of a field of a struct");

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentClassDescriptor.fields = currentClassDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

        return currentClassDescriptor;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcEnumItemDescriptor extends NcDescriptor
{
    public name: string;
    public value: number;

    constructor(
        name: string,
        value: number,
        description: string)
    {
        super(description);

        this.name = name;
        this.value = value;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcEnumItemDescriptor", [
            new NcFieldDescriptor("name", "NcName", false, false, null, "Name of option"),
            new NcFieldDescriptor("value", "NcUint16", false, false, null, "Enum item numerical value")
        ], "NcDescriptor", null, "Descriptor of an enum item");

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentClassDescriptor.fields = currentClassDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

        return currentClassDescriptor;
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
    public constraints: NcParameterConstraints | null;

    constructor(
        name: string,
        type: NcDatatypeType,
        constraints: NcParameterConstraints | null,
        description: string)
    {
        super(description);

        this.name = name;
        this.type = type;
        this.constraints = constraints;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcDatatypeDescriptor", [
            new NcFieldDescriptor("name", "NcName", false, false, null, "Datatype name"),
            new NcFieldDescriptor("type", "NcDatatypeType", false, false, null, "Type: Primitive, Typedef, Struct, Enum"),
            new NcFieldDescriptor("constraints", "NcParameterConstraints", true, false, null, "Optional constraints on top of the underlying data type")
        ], "NcDescriptor", null, "Base datatype descriptor");

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentClassDescriptor.fields = currentClassDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

        return currentClassDescriptor;
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
        constraints: NcParameterConstraints | null,
        description: string)
    {
        super(name, NcDatatypeType.Primitive, constraints, description);
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcDatatypeDescriptorPrimitive", [], "NcDatatypeDescriptor", null, "Primitive datatype descriptor");

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentClassDescriptor.fields = currentClassDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

        return currentClassDescriptor;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcDatatypeDescriptorTypeDef extends NcDatatypeDescriptor
{
    public parentType: string;
    public isSequence: boolean;

    constructor(
        name: string,
        parentType: string,
        isSequence: boolean,
        constraints: NcParameterConstraints | null,
        description: string)
    {
        super(name, NcDatatypeType.Typedef, constraints, description);

        this.parentType = parentType;
        this.isSequence = isSequence;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcDatatypeDescriptorTypeDef", [
            new NcFieldDescriptor("parentType", "NcName", false, false, null, "Original typedef datatype name"),
            new NcFieldDescriptor("isSequence", "NcBoolean", false, false, null, "TRUE iff type is a typedef sequence of another type")
        ], "NcDatatypeDescriptor", null, "Type def datatype descriptor");

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentClassDescriptor.fields = currentClassDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

        return currentClassDescriptor;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcDatatypeDescriptorStruct extends NcDatatypeDescriptor
{
    public fields: NcFieldDescriptor[];

    public parentType: string | null;

    constructor(
        name: string,
        fields: NcFieldDescriptor[],
        parentType: string | null,
        constraints: NcParameterConstraints | null,
        description: string)
    {
        super(name, NcDatatypeType.Struct, constraints, description);

        this.fields = fields;
        this.parentType = parentType;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcDatatypeDescriptorStruct", [
            new NcFieldDescriptor("fields", "NcFieldDescriptor", false, true, null, "One item descriptor per field of the struct"),
            new NcFieldDescriptor("parentType", "NcName", true, false, null, "Name of the parent type if any or null if it has no parent")
        ], "NcDatatypeDescriptor", null, "Struct datatype descriptor");

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentClassDescriptor.fields = currentClassDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

        return currentClassDescriptor;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcDatatypeDescriptorEnum extends NcDatatypeDescriptor
{
    public items: NcEnumItemDescriptor[];

    constructor(
        name: string,
        items: NcEnumItemDescriptor[],
        constraints: NcParameterConstraints | null,
        description: string)
    {
        super(name, NcDatatypeType.Enum, constraints, description);

        this.items = items;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcDatatypeDescriptorEnum", [
            new NcFieldDescriptor("items", "NcEnumItemDescriptor", false, true, null, "One item descriptor per enum option")
        ], "NcDatatypeDescriptor", null, "Enum datatype descriptor");

        if(includeInherited)
        {
            let baseDescriptor = super.GetTypeDescriptor(includeInherited);

            let baseDescriptorStruct = baseDescriptor as NcDatatypeDescriptorStruct;
            if(baseDescriptorStruct)
                currentClassDescriptor.fields = currentClassDescriptor.fields.concat(baseDescriptorStruct.fields);
        }

        return currentClassDescriptor;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}