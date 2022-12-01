import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { CommandResponseNoValue, CommandResponseWithValue } from '../NCProtocol/Commands';
import { NcPropertyChangedEventData } from '../NCProtocol/Notifications';
import { WebSocketConnection } from '../Server';
import { INotificationContext } from '../SessionManager';
import { NcBlock } from './Blocks';
import {
    BaseType,
    myIdDecorator,
    NcBlockMemberDescriptor,
    NcClassDescriptor,
    NcClassIdentity,
    NcDatatypeDescriptor,
    NcDatatypeDescriptorEnum,
    NcDatatypeDescriptorPrimitive,
    NcDatatypeDescriptorStruct,
    NcDatatypeDescriptorTypeDef,
    NcElementId,
    NcEnumItemDescriptor,
    NcEvent,
    NcFieldDescriptor,
    NcLockState,
    NcMethodDescriptor,
    NcMethodStatus,
    NcObject,
    NcParameterDescriptor,
    NcPort,
    NcPortReference,
    NcPropertyChangeType,
    NcPropertyDescriptor,
    NcSignalPath,
    NcTouchpoint,
    NcTouchpointNmos,
    NcTouchpointResource,
    NcTouchpointResourceNmos } from './Core';
import { DemoDataType, NcDemo, NcGain, NcReceiverMonitor, NcReceiverStatus } from './Features';

export abstract class NcManager extends NcObject
{
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
        super(oid, constantOid, owner, role, userLabel, lockable, lockState, touchpoints, description, notificationContext);
    }
}

export class NcManufacturer extends BaseType
{
    public name: string;
    public organizationId: null;
    public website: string;

    constructor(
        name: string,
        website: string)
    {
        super();

        this.name = name;
        this.organizationId = null;
        this.website = website;
    }

    public static override GetTypeDescriptor(): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("NcManufacturer", [
            new NcFieldDescriptor("name", "NcString", false, false, null, "Manufacturer's name"),
            new NcFieldDescriptor("organizationId", "NcOrganizationId", true, false, null, "IEEE OUI or CID of manufacturer"),
            new NcFieldDescriptor("website", "NcUri", true, false, null, "URL of the manufacturer's website")
        ], null, null, "Manufacturer descriptor");
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcProduct extends BaseType
{
    public name: string;
    public key: string;
    public revisionLevel: string;
    public brandName: string;
    public uuid: string;
    public description: string;

    constructor(
        name: string,
        key: string,
        revisionLevel: string,
        brandName: string,
        uuid: string,
        description: string)
    {
        super();

        this.name = name;
        this.key = key;
        this.revisionLevel = revisionLevel;
        this.brandName = brandName;
        this.uuid = uuid;
        this.description = description;
    }

    public static override GetTypeDescriptor(): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("NcProduct", [
            new NcFieldDescriptor("name", "NcString", false, false, null, "Product name"),
            new NcFieldDescriptor("key", "NcString", false, false, null, "Manufacturer's unique key to product - model number, SKU, etc"),
            new NcFieldDescriptor("revisionLevel", "NcString", false, false, null, "Manufacturer's product revision level code"),
            new NcFieldDescriptor("brandName", "NcString", true, false, null, "Brand name under which product is sold"),
            new NcFieldDescriptor("uuid", "NcString", true, false, null, "Unique UUID of product (not product instance)"),
            new NcFieldDescriptor("description", "NcString", true, false, null, "Text description of product"),
        ], null, null, "Product descriptor");
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcDeviceOperationalState extends BaseType
{
    public generic: NcDeviceGenericState;
    public deviceSpecificDetails: null;

    constructor(
        generic: NcDeviceGenericState)
    {
        super();

        this.generic = generic;
        this.deviceSpecificDetails = null;
    }

    public static override GetTypeDescriptor(): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("NcDeviceOperationalState", [
            new NcFieldDescriptor("generic", "NcDeviceGenericState", false, false, null, "Generic operational state"),
            new NcFieldDescriptor("deviceSpecificDetails", "NcBlob", true, false, null, "Specific device details")
        ], null, null, "Device operational state");
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export enum NcDeviceGenericState
{
    NormalOperation = 0,
    Initializing = 1,
    Updating = 2
}

export enum NcResetCause
{
    PowerOn = 0,
    InternalError = 1,
    Upgrade = 2,
    ControllerRequest = 3
}

export class NcDeviceManager extends NcManager
{
    public classID: number[] = [ 1, 3, 1 ];
    public classVersion: string = "1.0.0";

    @myIdDecorator('3p1')
    public ncVersion: string = "1.0.0";

    @myIdDecorator('3p2')
    public manufacturer: NcManufacturer;

    @myIdDecorator('3p3')
    public product: NcProduct;

    @myIdDecorator('3p4')
    public serialNumber: string;

    @myIdDecorator('3p5')
    public userInventoryCode: string | null;

    @myIdDecorator('3p6')
    public deviceName: string | null;

    @myIdDecorator('3p7')
    public deviceRole: string | null;

    @myIdDecorator('3p8')
    public operationalState: NcDeviceOperationalState;

    @myIdDecorator('3p9')
    public resetCause: NcResetCause;

    @myIdDecorator('3p10')
    public message: string | null;

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
        super(oid, constantOid, owner, role, userLabel, lockable, lockState, touchpoints, description, notificationContext);

        this.manufacturer = new NcManufacturer("Mock manufacturer", "https://specs.amwa.tv/nmos/");
        this.product = new NcProduct("Mock device", "mock-001", "1.0.0", "Mock brand", "2dcd15f6-aecc-4f01-bf66-b1044c677ef4", "Mock device for testing and prototyping");
        this.serialNumber = "123-mock";
        this.userInventoryCode = null;
        this.deviceName = null;
        this.deviceRole = null;
        this.operationalState = new NcDeviceOperationalState(NcDeviceGenericState.NormalOperation);
        this.resetCause = NcResetCause.PowerOn;
        this.message = "Nothing to report";
    }

    //'1m1'
    public override Get(oid: number, propertyId: NcElementId, handle: number) : CommandResponseNoValue
    {
        if(oid == this.oid)
        {
            let key: string = `${propertyId.level}p${propertyId.index}`;

            switch(key)
            {
                case '3p1':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.ncVersion, null);
                case '3p2':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.manufacturer, null);
                case '3p3':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.product, null);
                case '3p4':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.serialNumber, null);
                case '3p5':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.userInventoryCode, null);
                case '3p6':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.deviceName, null);
                case '3p7':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.deviceRole, null);
                case '3p8':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.operationalState, null);
                case '3p9':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.resetCause, null);
                case '3p10':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.message, null);
                default:
                    return super.Get(oid, propertyId, handle);
            }
        }

        return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }

    //'1m2'
    public override Set(oid: number, id: NcElementId, value: any, handle: number) : CommandResponseNoValue
    {
        if(oid == this.oid)
        {
            let key: string = `${id.level}p${id.index}`;

            switch(key)
            {
                case '3p1':
                case '3p2':
                case '3p3':
                case '3p4':
                case '3p8':
                case '3p9':
                case '3p10':
                    return new CommandResponseNoValue(handle, NcMethodStatus.ProcessingFailed, 'Property is readonly');
                case '3p5':
                    this.userInventoryCode = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.userInventoryCode, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
                case '3p6':
                    this.deviceName = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.deviceName, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
                case '3p7':
                    this.deviceRole = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.deviceRole, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
                default:
                    return super.Set(oid, id, value, handle);
            }
        }

        return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }

    public static override GetClassDescriptor(): NcClassDescriptor
    {
        let baseDescriptor = super.GetClassDescriptor();

        let currentClassDescriptor = new NcClassDescriptor("NcDeviceManager class descriptor",
            [
                new NcPropertyDescriptor(new NcElementId(3, 1), "ncVersion", "NcVersionCode", true, true, false, false, null, "Version of nc this dev uses"),
                new NcPropertyDescriptor(new NcElementId(3, 2), "manufacturer", "NcManufacturer", true, true, false, false, null, "Manufacturer descriptor"),
                new NcPropertyDescriptor(new NcElementId(3, 3), "product", "NcProduct", true, true, false, false, null, "Product descriptor"),
                new NcPropertyDescriptor(new NcElementId(3, 4), "serialNumber", "NcString", true, true, false, false, null, "Serial number"),
                new NcPropertyDescriptor(new NcElementId(3, 5), "userInventoryCode", "NcString", false, true, false, false, null, "Asset tracking identifier (user specified)"),
                new NcPropertyDescriptor(new NcElementId(3, 6), "deviceName", "NcString", false, true, false, false, null, "Name of this device in the application. Instance name, not product name."),
                new NcPropertyDescriptor(new NcElementId(3, 7), "deviceRole", "NcString", false, true, false, false, null, "Role of this device in the application."),
                new NcPropertyDescriptor(new NcElementId(3, 8), "operationalState", "NcDeviceOperationalState", true, true, false, false, null, "Device operational state"),
                new NcPropertyDescriptor(new NcElementId(3, 9), "resetCause", "NcResetCause", true, true, false, false, null, "Reason for most recent reset"),
                new NcPropertyDescriptor(new NcElementId(3, 10), "message", "NcString", true, true, true, false, null, "Arbitrary message from dev to controller"),
            ],
            [],
            []
        );

        currentClassDescriptor.properties = currentClassDescriptor.properties.concat(baseDescriptor.properties);
        currentClassDescriptor.methods = currentClassDescriptor.methods.concat(baseDescriptor.methods);
        currentClassDescriptor.events = currentClassDescriptor.events.concat(baseDescriptor.events);

        return currentClassDescriptor;
    }
}

export class NcClassManager extends NcManager
{
    public classID: number[] = [ 1, 3, 2 ];
    public classVersion: string = "1.0.0";

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
        super(oid, constantOid, owner, role, userLabel, lockable, lockState, touchpoints, description, notificationContext);
    }

    public override InvokeMethod(socket: WebSocketConnection, oid: number, methodId: NcElementId, args: { [key: string]: any; } | null, handle: number): CommandResponseNoValue 
    {
        if(oid == this.oid)
        {
            let key: string = `${methodId.level}m${methodId.index}`;

            switch(key)
            {
                case '3m1':
                    {
                        if(args != null && 'identity' in args)
                        {
                            let identity = args['identity'] as NcClassIdentity;
                            let descriptors = this.GetClassDescriptors(identity);
                            if(descriptors.length > 0)
                                return new CommandResponseWithValue(handle, NcMethodStatus.OK, descriptors, null);
                            else
                                return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Class identity could not be found');
                        }
                        else
                            return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'No class identity has been provided');
                    }
                case '3m2':
                    {
                        if(args != null && 'name' in args)
                        {
                            let name = args['name'] as string;
                            let descriptors = this.GetTypeDescriptors(name);
                            if(descriptors.length > 0)
                                return new CommandResponseWithValue(handle, NcMethodStatus.OK, descriptors, null);
                            else
                                return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Type name could not be found');
                        }
                        else
                            return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'No type name has been provided');
                    }
                default:
                    return super.InvokeMethod(socket, oid, methodId, args, handle);
            }
        }

        return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }

    public static override GetClassDescriptor(): NcClassDescriptor 
    {
        let baseDescriptor = super.GetClassDescriptor();

        let currentClassDescriptor = new NcClassDescriptor("NcClassManager class descriptor",
            [ 
                new NcPropertyDescriptor(new NcElementId(3, 1), "controlClasses", "NcClassDescriptor", true, true, false, true, null, "Descriptions of all control classes in the device"),
                new NcPropertyDescriptor(new NcElementId(3, 2), "datatypes", "NcDatatypeDescriptor", true, true, false, true, null, "Descriptions of all data types in the device")
            ],
            [ 
                new NcMethodDescriptor(new NcElementId(3, 1), "GetControlClass", "NcMethodResultClassDescriptors", [
                    new NcParameterDescriptor("identity", "NcClassIdentity", false, false,  null, "class ID & version"),
                    new NcParameterDescriptor("allElements", "NcBoolean", false, false,  null, "TRUE to include inherited class elements")
                ], "Get a single class descriptor"),
                new NcMethodDescriptor(new NcElementId(3, 2), "GetDatatype", "NcMethodResultDatatypeDescriptors", [
                    new NcParameterDescriptor("name", "NcName", false, false,  null, "name of datatype"),
                    new NcParameterDescriptor("allDefs", "NcBoolean", false, false,  null, "TRUE to include descriptors of component datatypes")
                ], "Get descriptor of datatype and maybe its component datatypes"),
                new NcMethodDescriptor(new NcElementId(3, 3), "GetControlClasses", "NcMethodResultClassDescriptors", [
                    new NcParameterDescriptor("blockPath", "NcNamePath", false, false,  null, "path to block"),
                    new NcParameterDescriptor("recurseBlocks", "NcBoolean", false, false,  null, "TRUE to recurse contained blocks"),
                    new NcParameterDescriptor("allElements", "NcBoolean", false, false,  null, "TRUE to include inherited class elements")
                ], "Get descriptors of classes used by block(s)"),
                new NcMethodDescriptor(new NcElementId(3, 4), "GetDataTypes", "NcMethodResultDatatypeDescriptors", [
                    new NcParameterDescriptor("blockPath", "NcNamePath", false, false,  null, "path to block"),
                    new NcParameterDescriptor("recurseBlocks", "NcBoolean", false, false,  null, "TRUE to recurse contained blocks"),
                    new NcParameterDescriptor("allDefs", "NcBoolean", false, false,  null, "TRUE to include descriptors of referenced datatypes")
                ], " Get descriptors of datatypes used by blocks(s)")
            ],
            []
        );

        currentClassDescriptor.properties = currentClassDescriptor.properties.concat(baseDescriptor.properties);
        currentClassDescriptor.methods = currentClassDescriptor.methods.concat(baseDescriptor.methods);
        currentClassDescriptor.events = currentClassDescriptor.events.concat(baseDescriptor.events);

        return currentClassDescriptor;
    }

    private GetClassDescriptors(identity: NcClassIdentity) : NcClassDescriptor[]
    {
        let key: string = identity.id.join('.');

        switch(key)
        {
            case '1.1': 
                return [ NcBlock.GetClassDescriptor() ];
            case '1.3.1': 
                return [ NcDeviceManager.GetClassDescriptor() ];
            case '1.3.2': 
                return [ NcClassManager.GetClassDescriptor() ];
            case '1.3.4': 
                return [ NcSubscriptionManager.GetClassDescriptor() ];
            case '1.2.0.1':
                return [ NcDemo.GetClassDescriptor() ];
            case '1.2.2': 
                return [ NcReceiverMonitor.GetClassDescriptor() ];
            case '1.2.1.1.1': 
                return [ NcGain.GetClassDescriptor() ];
            default:
                return new Array<NcClassDescriptor>();
        }
    }

    private GetTypeDescriptors(name: string) : NcDatatypeDescriptor[]
    {
        switch(name)
        {
            case 'NcBoolean': 
                return [ new NcDatatypeDescriptorPrimitive("NcBoolean", null, "Boolean primitive type")];
            case 'NcInt8': 
                return [ new NcDatatypeDescriptorPrimitive("NcInt8", null, "byte")];
            case 'NcInt16': 
                return [ new NcDatatypeDescriptorPrimitive("NcInt16", null, "short")];
            case 'NcInt32': 
                return [ new NcDatatypeDescriptorPrimitive("NcInt32", null, "long")];
            case 'NcInt64': 
                return [ new NcDatatypeDescriptorPrimitive("NcInt64", null, "longlong")];
            case 'NcUint8': 
                return [ new NcDatatypeDescriptorPrimitive("NcUint8", null, "octet")];
            case 'NcUint16': 
                return [ new NcDatatypeDescriptorPrimitive("NcUint16", null, "unsignedshort")];
            case 'NcUint32': 
                return [ new NcDatatypeDescriptorPrimitive("NcUint32", null, "unsignedlong")];
            case 'NcUint64': 
                return [ new NcDatatypeDescriptorPrimitive("NcUint64", null, "unsignedlonglong")];
            case 'NcFloat32': 
                return [ new NcDatatypeDescriptorPrimitive("NcFloat32", null, "unrestrictedfloat")];
            case 'NcFloat64': 
                return [ new NcDatatypeDescriptorPrimitive("NcFloat64", null, "unrestricteddouble")];
            case 'NcString': 
                return [ new NcDatatypeDescriptorPrimitive("NcString", null, "UTF-8 string")];
            case 'NcBlob': 
                return [ new NcDatatypeDescriptorPrimitive("NcBlob", null, "blob")];
            case 'NcBlobFixedLen': 
                return [ new NcDatatypeDescriptorPrimitive("NcBlobFixedLen", null, "fixed length blob")];
            case 'NcClassId': 
                return [ new NcDatatypeDescriptorTypeDef("NcClassId", "NcClassIdField", true, null, "Sequence of class ID fields.")];
            case 'NcClassIdField': 
                return [ new NcDatatypeDescriptorTypeDef("NcClassIdField", "NcInt32", false, null, "Class ID field. Either a definition index or an authority key.")];
            case 'NcVersionCode': 
                return [ new NcDatatypeDescriptorTypeDef("NcVersionCode", "NcString", false, null, "Version code in semantic versioning format")];
            case 'NcUri': 
                return [ new NcDatatypeDescriptorTypeDef("NcUri", "NcString", false, null, "Uniform resource identifier")];
            case 'NcOrganizationId': 
                return [ new NcDatatypeDescriptorTypeDef("NcOrganizationId", "NcBlobFixedLen", true, null, "Unique 24-bit organization ID")];
            case 'NcManufacturer': 
                return [ NcManufacturer.GetTypeDescriptor() ];
            case 'NcProduct': 
                return [ NcProduct.GetTypeDescriptor() ];
            case 'NcDeviceGenericState': 
                return [ new NcDatatypeDescriptorEnum("NcDeviceGenericState", [
                    new NcEnumItemDescriptor("NormalOperation", 0, "Normal operation"),
                    new NcEnumItemDescriptor("Initializing", 1, "Initializing"),
                    new NcEnumItemDescriptor("Updating", 2, "Updating")
                ], null, "Device generic operational state")];
            case 'NcResetCause': 
                return [ new NcDatatypeDescriptorEnum("NcResetCause", [
                    new NcEnumItemDescriptor("PowerOn", 0, "Power on"),
                    new NcEnumItemDescriptor("InternalError", 1, "Internal error"),
                    new NcEnumItemDescriptor("Upgrade", 2, "Upgrade"),
                    new NcEnumItemDescriptor("ControllerRequest", 3, "Controller request")
                ], null, "Device generic operational state")];
            case 'NcDeviceOperationalState': 
                return [ NcDeviceOperationalState.GetTypeDescriptor() ];
            case 'NcOid': 
                return [ new NcDatatypeDescriptorTypeDef("NcOid", "NcUint32", false, null, "Object id")];
            case 'NcName': 
                return [ new NcDatatypeDescriptorTypeDef("NcName", "NcString", false, null, "Programmatically significant name, alphanumerics + underscore, no spaces")];
            case 'NcNamePath': 
                return [ new NcDatatypeDescriptorTypeDef("NcNamePath", "NcName", true, null, "Name path")];
            case 'NcId32': 
                return [ new NcDatatypeDescriptorTypeDef("NcId32", "NcUint32", false, null, "Identity handler")];
            case 'NcTimeInterval': 
                return [ new NcDatatypeDescriptorTypeDef("NcTimeInterval", "NcFloat64", false, null, "Floating point seconds")];
            case 'NcDB': 
                return [ new NcDatatypeDescriptorTypeDef("NcDB", "NcFloat32", false, null, "A ratio expressed in dB.")];
            case 'NcPropertyId': 
                return [ new NcDatatypeDescriptorTypeDef("NcPropertyId", "NcElementId", false, null, "Class property id which contains the level and index")];
            case 'NcElementId': 
                return [ NcElementId.GetTypeDescriptor() ];
            case 'NcPropertyChangeType': 
                return [ new NcDatatypeDescriptorEnum("NcPropertyChangeType", [
                    new NcEnumItemDescriptor("ValueChanged", 0, "Current value changed"),
                    new NcEnumItemDescriptor("SequenceItemAdded", 1, "Sequence item added"),
                    new NcEnumItemDescriptor("SequenceItemChanged", 2, "Sequence item changed"),
                    new NcEnumItemDescriptor("SequenceItemRemoved", 3, "Sequence item removed")
                ], null, "Type of property change")];
            case 'NcPropertyChangedEventData': 
                return [ NcPropertyChangedEventData.GetTypeDescriptor() ];
            case 'NcLockState': 
                return [ new NcDatatypeDescriptorEnum("NcLockState", [
                    new NcEnumItemDescriptor("MoLock", 0, "Not locked"),
                    new NcEnumItemDescriptor("NockNoWrite", 1, "Locked for write operations"),
                    new NcEnumItemDescriptor("LockNoReadWrite", 2, "Locked for both read and write operations")
                ], null, "Lock state enum data type")];
            case 'NcMethodStatus': 
                return [ new NcDatatypeDescriptorEnum("NcMethodStatus", [
                    new NcEnumItemDescriptor("Ok", 0, "Method call was successful"),
                    new NcEnumItemDescriptor("ProtocolVersionError", 1, "Control command had incompatible protocol version code"),
                    new NcEnumItemDescriptor("DeviceError", 2, "Device has encountered an error"),
                    new NcEnumItemDescriptor("Readonly", 3, "Attempted to modify a readonly state"),
                    new NcEnumItemDescriptor("Locked", 4, "Attempted to modify a locked property"),
                    new NcEnumItemDescriptor("BadCommandFormat", 5, "Badly-formed command"),
                    new NcEnumItemDescriptor("BadOid", 6, "Command addresses a nonexistent object"),
                    new NcEnumItemDescriptor("ParameterError", 7, "Method parameter has invalid format"),
                    new NcEnumItemDescriptor("ParameterOutOfRange", 8, "Method parameter has out-of-range value"),
                    new NcEnumItemDescriptor("NotImplemented", 9, "Addressed method is not implemented by the addressed object"),
                    new NcEnumItemDescriptor("InvalidRequest", 10, "Requested method call is invalid in current operating context"),
                    new NcEnumItemDescriptor("ProcessingFailed", 11, "Device did not succeed in executing the addressed method"),
                    new NcEnumItemDescriptor("BadMethodID", 12, "Command addresses a method that is not in the addressed object"),
                    new NcEnumItemDescriptor("PartiallySucceeded", 13, "Addressed method began executing but stopped before completing"),
                    new NcEnumItemDescriptor("Timeout", 14, "Method call did not finish within the allotted time"),
                    new NcEnumItemDescriptor("BufferOverflow", 15, "Something was too big"),
                    new NcEnumItemDescriptor("OmittedProperty", 16, "Command referenced an optional property that is not instantiated in the referenced object")
                ], null, "Method invokation status")];
            case 'NcMethodResult':
                return [ new NcDatatypeDescriptorStruct("NcMethodResult", [
                    new NcFieldDescriptor("status", "NcMethodStatus", false, false, null, "Status for the invoked method"),
                    new NcFieldDescriptor("errorMessage", "NcString", true, false, null, "Optional error message")
                ], null, null, "Result of the invoked method")];
            case 'NcMethodResultPropertyValue':
                return [ new NcDatatypeDescriptorStruct("NcMethodResultPropertyValue", [
                    new NcFieldDescriptor("status", "NcMethodStatus", false, false, null, "Status for the invoked method"),
                    new NcFieldDescriptor("errorMessage", "NcString", true, false, null, "Optional error message"),
                    new NcFieldDescriptor("value", null, true, null, null, "Getter method value for the associated property")
                ], "NcMethodResult", null, "Result when invoking the getter method associated with a property")];
            case 'NcMethodResultId32':
                return [ new NcDatatypeDescriptorStruct("NcMethodResultId32", [
                    new NcFieldDescriptor("status", "NcMethodStatus", false, false, null, "Status for the invoked method"),
                    new NcFieldDescriptor("errorMessage", "NcString", true, false, null, "Optional error message"),
                    new NcFieldDescriptor("value", "NcId32", false, false, null, "NcId32 method result value")
                ], "NcMethodResult", null, "Method result containing an NcId32 value")];
            case 'NcClassIdentity': 
                return [ NcClassIdentity.GetTypeDescriptor() ];
            case 'NcEvent': 
                return [ NcEvent.GetTypeDescriptor() ];
            case 'NcBlockMemberDescriptor': 
                return [ NcBlockMemberDescriptor.GetTypeDescriptor() ];
            case 'NcMethodResultBlockMemberDescriptors':
                return [ new NcDatatypeDescriptorStruct("NcMethodResultBlockMemberDescriptors", [
                    new NcFieldDescriptor("status", "NcMethodStatus", false, false, null, "Status for the invoked method"),
                    new NcFieldDescriptor("errorMessage", "NcString", true, false, null, "Optional error message"),
                    new NcFieldDescriptor("value", "NcBlockMemberDescriptor", false, true, null, "Block member descriptors method result value")
                ], "NcMethodResult", null, "Method result containing block member descriptors as the value")];
            case 'NcReceiverStatus': 
                return [ NcReceiverStatus.GetTypeDescriptor() ];
            case 'NcMethodResultReceiverStatus':
                return [ new NcDatatypeDescriptorStruct("NcMethodResultReceiverStatus", [
                    new NcFieldDescriptor("status", "NcMethodStatus", false, false, null, "Status for the invoked method"),
                    new NcFieldDescriptor("errorMessage", "NcString", true, false, null, "Optional error message"),
                    new NcFieldDescriptor("value", "NcReceiverStatus", false, false, null, "Receiver status method result value")
                ], "NcMethodResult", null, "Method result containing receiver status information as the value")];
            case 'NcIoDirection': 
                return [ new NcDatatypeDescriptorEnum("NcIoDirection", [
                    new NcEnumItemDescriptor("Undefined", 0, "Not defined"),
                    new NcEnumItemDescriptor("Input", 1, "Input direction"),
                    new NcEnumItemDescriptor("Output", 2, "Output direction"),
                    new NcEnumItemDescriptor("Bidirectional", 3, "Bidirectional")
                ], null, "Input and/or output direction")];
            case 'NcConnectionStatus': 
                return [ new NcDatatypeDescriptorEnum("NcConnectionStatus", [
                    new NcEnumItemDescriptor("Undefined", 0, "This is the value when there is no receiver"),
                    new NcEnumItemDescriptor("Connected", 1, "Connected to a stream"),
                    new NcEnumItemDescriptor("Disconnected", 2, "Not connected to a stream"),
                    new NcEnumItemDescriptor("ConnectionError", 3, "A connection error was encountered")
                ], null, "Connection status enum data type")];
            case 'NcPayloadStatus': 
                return [ new NcDatatypeDescriptorEnum("NcPayloadStatus", [
                    new NcEnumItemDescriptor("Undefined", 0, "This is the value when there's no connection."),
                    new NcEnumItemDescriptor("PayloadOK", 1, "Payload is being received without errors and is the correct type"),
                    new NcEnumItemDescriptor("PayloadFormatUnsupported", 2, "Payload is being received but is of an unsupported type"),
                    new NcEnumItemDescriptor("PayloadError", 3, "A payload error was encountered")
                ], null, "Payload status enum data type")];
            case 'NcPort': 
                return [ NcPort.GetTypeDescriptor() ];
            case 'NcPortReference': 
                return [ NcPortReference.GetTypeDescriptor() ];
            case 'NcSignalPath': 
                return [ NcSignalPath.GetTypeDescriptor() ];
            case 'NcTouchpoint': 
                return [ NcTouchpoint.GetTypeDescriptor() ];
            case 'NcTouchpointResource': 
                return [ NcTouchpointResource.GetTypeDescriptor() ];
            case 'NcTouchpointNmos': 
                return [ NcTouchpointNmos.GetTypeDescriptor() ];
            case 'NcTouchpointResourceNmos': 
                return [ NcTouchpointResourceNmos.GetTypeDescriptor() ];
            case 'NcDemoEnum': 
                return [ new NcDatatypeDescriptorEnum("NcDemoEnum", [
                    new NcEnumItemDescriptor("Undefined", 0, "Not defined option"),
                    new NcEnumItemDescriptor("Alpha", 1, "Alpha option"),
                    new NcEnumItemDescriptor("Beta", 2, "Beta option"),
                    new NcEnumItemDescriptor("Gamma", 3, "Gamma option")
                ], null, "Demonstration enum data type")];
            case 'DemoDataType': 
                return [ DemoDataType.GetTypeDescriptor() ];
            default:
                return new Array<NcDatatypeDescriptor>();
        }
    }
}

export class NcSubscriptionManager extends NcManager
{
    public classID: number[] = [ 1, 3, 4 ];
    public classVersion: string = "1.0.0";

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
        super(oid, constantOid, owner, role, userLabel, lockable, lockState, touchpoints, description, notificationContext);
    }

    public override InvokeMethod(socket: WebSocketConnection, oid: number, methodId: NcElementId, args: { [key: string]: any; } | null, handle: number): CommandResponseNoValue 
    {
        if(oid == this.oid)
        {
            let key: string = `${methodId.level}m${methodId.index}`;

            switch(key)
            {
                case '3m1':
                    {
                        if(args != null && 'event' in args)
                        {
                            let eventIdentity = args['event'] as NcEvent;
                            if(eventIdentity)
                            {
                                this.notificationContext.Subscribe(socket, eventIdentity.emitterOid);
                                return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
                            }
                            else
                                return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Event argument is invalid');
                        }
                        else
                            return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'No event argument has been provided');
                    }
                case '3m2':
                    {
                        if(args != null && 'event' in args)
                        {
                            let eventIdentity = args['event'] as NcEvent;
                            if(eventIdentity)
                            {
                                this.notificationContext.UnSubscribe(socket, eventIdentity.emitterOid);
                                return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
                            }
                            else
                                return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Event argument is invalid');
                        }
                        else
                            return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'No event argument has been provided');
                    }
                default:
                    return super.InvokeMethod(socket, oid, methodId, args, handle);
            }
        }

        return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }

    public static override GetClassDescriptor(): NcClassDescriptor 
    {
        let baseDescriptor = super.GetClassDescriptor();

        let currentClassDescriptor = new NcClassDescriptor("NcSubscriptionManager class descriptor",
            [],
            [ 
                new NcMethodDescriptor(new NcElementId(3, 1), "AddSubscription", "NcMethodResult", [
                    new NcParameterDescriptor("event", "NcEvent", false, false, null, "Event identifying information")
                ], "When used to subscribe to the property changed event it will subscribe to changes from all of the properties"),
                new NcMethodDescriptor(new NcElementId(3, 2), "RemoveSubscription", "NcMethodResult", [
                    new NcParameterDescriptor("event", "NcEvent", false, false, null, "Event identifying information")
                ], "When used to unsubscribe to the property changed event it will unsubscribe to changes from all of the properties"),
                new NcMethodDescriptor(new NcElementId(3, 3), "AddPropertyChangeSubscription", "NcMethodResult", [
                    new NcParameterDescriptor("emitter", "NcOid", false, false, null, "ID of object where property is"),
                    new NcParameterDescriptor("property", "NcPropertyID", false, false, null, "ID of the property")
                ], "Subscribe to individual property on an object"),
                new NcMethodDescriptor(new NcElementId(3, 4), "RemovePropertyChangeSubscription", "NcMethodResult", [
                    new NcParameterDescriptor("emitter", "NcOid", false, false, null, "ID of object where property is"),
                    new NcParameterDescriptor("property", "NcPropertyID", false, false, null, "ID of the property")
                ], "Unsubscribe from individual property on an object")
            ],
            []
        );

        currentClassDescriptor.properties = currentClassDescriptor.properties.concat(baseDescriptor.properties);
        currentClassDescriptor.methods = currentClassDescriptor.methods.concat(baseDescriptor.methods);
        currentClassDescriptor.events = currentClassDescriptor.events.concat(baseDescriptor.events);

        return currentClassDescriptor;
    }
}