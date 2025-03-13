import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { CommandResponseError, CommandResponseNoValue, CommandResponseWithValue } from '../NCProtocol/Commands';
import { NcPropertyChangedEventData } from '../NCProtocol/Notifications';
import { INotificationContext } from '../SessionManager';
import { NcBlock } from './Blocks';
import {
    BaseType,
    myIdDecorator,
    NcBlockMemberDescriptor,
    NcBulkValuesHolder,
    NcClassDescriptor,
    NcDatatypeDescriptor,
    NcDatatypeDescriptorEnum,
    NcDatatypeDescriptorPrimitive,
    NcDatatypeDescriptorStruct,
    NcDatatypeDescriptorTypeDef,
    NcDescriptor,
    NcElementId,
    NcEnumItemDescriptor,
    NcEventDescriptor,
    NcEventId,
    NcFieldDescriptor,
    NcMethodDescriptor,
    NcMethodId,
    NcMethodResult,
    NcMethodResultBlockMemberDescriptors,
    NcMethodResultBulkValuesHolder,
    NcMethodResultClassDescriptor,
    NcMethodResultDatatypeDescriptor,
    NcMethodResultError,
    NcMethodResultId,
    NcMethodResultLength,
    NcMethodResultObjectPropertiesSetValidation,
    NcMethodResultPropertyValue,
    NcMethodStatus,
    NcObject,
    NcObjectPropertiesHolder,
    NcObjectPropertiesSetValidation,
    NcParameterConstraints,
    NcParameterConstraintsNumber,
    NcParameterConstraintsString,
    NcParameterDescriptor,
    NcPropertyChangeType,
    NcPropertyConstraints,
    NcPropertyConstraintsNumber,
    NcPropertyConstraintsString,
    NcPropertyDescriptor,
    NcPropertyId,
    NcPropertyRestoreNotice,
    NcPropertyRestoreNoticeType,
    NcPropertyValueHolder,
    NcRestoreValidationStatus,
    NcTouchpoint,
    NcTouchpointNmos,
    NcTouchpointNmosChannelMapping,
    NcTouchpointResource,
    NcTouchpointResourceNmos,
    NcTouchpointResourceNmosChannelMapping,
    RestoreArguments} from './Core';
import { ExampleDataType, ExampleControl, GainControl, NcIdentBeacon, NcReceiverMonitor, NcWorker, NcStatusMonitor, NcMethodResultCounters, NcCounter, NcSenderMonitor } from './Features';

export abstract class NcManager extends NcObject
{
    public static staticClassID: number[] = [ 1, 3 ];

    @myIdDecorator('1p1')
    public override classID: number[] = NcManager.staticClassID;

    public constructor(
        oid: number,
        constantOid: boolean,
        ownerObject: NcObject | null,
        role: string,
        userLabel: string,
        touchpoints: NcTouchpoint[] | null,
        runtimePropertyConstraints: NcPropertyConstraints[] | null,
        description: string,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, ownerObject, role, userLabel, touchpoints, runtimePropertyConstraints, description, notificationContext);
    }

    public static override GetClassDescriptor(includeInherited: boolean): NcClassDescriptor
    {
        let currentClassDescriptor = new NcClassDescriptor(`${NcManager.name} class descriptor`,
            NcManager.staticClassID, NcManager.name, null,
        [], [], []);

        if(includeInherited)
        {
            let baseDescriptor = super.GetClassDescriptor(includeInherited);

            currentClassDescriptor.properties = currentClassDescriptor.properties.concat(baseDescriptor.properties);
            currentClassDescriptor.methods = currentClassDescriptor.methods.concat(baseDescriptor.methods);
            currentClassDescriptor.events = currentClassDescriptor.events.concat(baseDescriptor.events);
        }

        return currentClassDescriptor;
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

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
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

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("NcProduct", [
            new NcFieldDescriptor("name", "NcString", false, false, null, "Product name"),
            new NcFieldDescriptor("key", "NcString", false, false, null, "Manufacturer's unique key to product - model number, SKU, etc"),
            new NcFieldDescriptor("revisionLevel", "NcString", false, false, null, "Manufacturer's product revision level code"),
            new NcFieldDescriptor("brandName", "NcString", true, false, null, "Brand name under which product is sold"),
            new NcFieldDescriptor("uuid", "NcUuid", true, false, null, "Unique UUID of product (not product instance)"),
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
    public deviceSpecificDetails: string | null;

    constructor(
        generic: NcDeviceGenericState)
    {
        super();

        this.generic = generic;
        this.deviceSpecificDetails = null;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("NcDeviceOperationalState", [
            new NcFieldDescriptor("generic", "NcDeviceGenericState", false, false, null, "Generic operational state"),
            new NcFieldDescriptor("deviceSpecificDetails", "NcString", true, false, null, "Specific device details")
        ], null, null, "Device operational state");
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export enum NcDeviceGenericState
{
    Unknown = 0,
    NormalOperation = 1,
    Initializing = 2,
    Updating = 3,
    LicensingError = 4,
    InternalError = 5
}

export enum NcResetCause
{
    Unknown = 0,
    PowerOn = 1,
    InternalError = 2,
    Upgrade = 3,
    ControllerRequest = 4,
    ManualReset = 5
}

export class NcDeviceManager extends NcManager
{
    public static staticClassID: number[] = [ 1, 3, 1 ];

    @myIdDecorator('1p1')
    public override classID: number[] = NcDeviceManager.staticClassID;

    @myIdDecorator('3p1')
    public ncVersion: string = "v1.0.0";

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

    public static staticRole: string = "DeviceManager";

    public constructor(
        oid: number,
        constantOid: boolean,
        ownerObject: NcObject | null,
        userLabel: string,
        touchpoints: NcTouchpoint[] | null,
        runtimePropertyConstraints: NcPropertyConstraints[] | null,
        description: string,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, ownerObject, NcDeviceManager.staticRole, userLabel, touchpoints, runtimePropertyConstraints, description, notificationContext);

        this.manufacturer = new NcManufacturer("Mock manufacturer", "https://specs.amwa.tv/nmos/");
        this.product = new NcProduct("Mock device", "mock-001", "1.0.0", "Mock brand", "2dcd15f6-aecc-4f01-bf66-b1044c677ef4", "Mock device for testing and prototyping");
        this.serialNumber = "123-mock";
        this.userInventoryCode = null;
        this.deviceName = null;
        this.deviceRole = null;
        this.operationalState = new NcDeviceOperationalState(NcDeviceGenericState.NormalOperation);
        this.resetCause = NcResetCause.Unknown;
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
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.ncVersion);
                case '3p2':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.manufacturer);
                case '3p3':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.product);
                case '3p4':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.serialNumber);
                case '3p5':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.userInventoryCode);
                case '3p6':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.deviceName);
                case '3p7':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.deviceRole);
                case '3p8':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.operationalState);
                case '3p9':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.resetCause);
                case '3p10':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.message);
                default:
                    return super.Get(oid, propertyId, handle);
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.BadOid, 'OID could not be found');
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
                    return new CommandResponseError(handle, NcMethodStatus.Readonly, 'Property is readonly');
                case '3p5':
                    this.userInventoryCode = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.userInventoryCode, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                case '3p6':
                    this.deviceName = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.deviceName, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                case '3p7':
                    this.deviceRole = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.deviceRole, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                default:
                    return super.Set(oid, id, value, handle);
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.BadOid, 'OID could not be found');
    }

    public static override GetClassDescriptor(includeInherited: boolean): NcClassDescriptor
    {
        let currentClassDescriptor = new NcClassDescriptor(`${NcDeviceManager.name} class descriptor`,
            NcDeviceManager.staticClassID, NcDeviceManager.name, NcDeviceManager.staticRole,
            [
                new NcPropertyDescriptor(new NcElementId(3, 1), "ncVersion", "NcVersionCode", true, false, false, null, "Version of nc this dev uses"),
                new NcPropertyDescriptor(new NcElementId(3, 2), "manufacturer", "NcManufacturer", true, false, false, null, "Manufacturer descriptor", false),
                new NcPropertyDescriptor(new NcElementId(3, 3), "product", "NcProduct", true, false, false, null, "Product descriptor", false),
                new NcPropertyDescriptor(new NcElementId(3, 4), "serialNumber", "NcString", true, false, false, null, "Serial number"),
                new NcPropertyDescriptor(new NcElementId(3, 5), "userInventoryCode", "NcString", false, true, false, null, "Asset tracking identifier (user specified)"),
                new NcPropertyDescriptor(new NcElementId(3, 6), "deviceName", "NcString", false, true, false, null, "Name of this device in the application. Instance name, not product name."),
                new NcPropertyDescriptor(new NcElementId(3, 7), "deviceRole", "NcString", false, true, false, null, "Role of this device in the application."),
                new NcPropertyDescriptor(new NcElementId(3, 8), "operationalState", "NcDeviceOperationalState", true, false, false, null, "Device operational state"),
                new NcPropertyDescriptor(new NcElementId(3, 9), "resetCause", "NcResetCause", true, false, false, null, "Reason for most recent reset"),
                new NcPropertyDescriptor(new NcElementId(3, 10), "message", "NcString", true, true, false, null, "Arbitrary message from dev to controller"),
            ],
            [],
            []
        );

        if(includeInherited)
        {
            let baseDescriptor = super.GetClassDescriptor(includeInherited);

            currentClassDescriptor.properties = currentClassDescriptor.properties.concat(baseDescriptor.properties);
            currentClassDescriptor.methods = currentClassDescriptor.methods.concat(baseDescriptor.methods);
            currentClassDescriptor.events = currentClassDescriptor.events.concat(baseDescriptor.events);
        }

        return currentClassDescriptor;
    }

    public override GetAllProperties(recurse: boolean) : NcObjectPropertiesHolder[]
    {
        let properties = [
            new NcObjectPropertiesHolder(this.GetRolePath(), [], [
                new NcPropertyValueHolder(new NcPropertyId(3, 1), "ncVersion", "NcVersionCode", true, this.ncVersion),
                new NcPropertyValueHolder(new NcPropertyId(3, 2), "manufacturer", "NcManufacturer", true, this.manufacturer),
                new NcPropertyValueHolder(new NcPropertyId(3, 3), "product", "NcProduct", true, this.product),
                new NcPropertyValueHolder(new NcPropertyId(3, 4), "serialNumber", "NcString", true, this.serialNumber),
                new NcPropertyValueHolder(new NcPropertyId(3, 5), "userInventoryCode", "NcString", false, this.userInventoryCode),
                new NcPropertyValueHolder(new NcPropertyId(3, 6), "deviceName", "NcString", false, this.deviceName),
                new NcPropertyValueHolder(new NcPropertyId(3, 7), "deviceName", "NcString", false, this.deviceName),
                new NcPropertyValueHolder(new NcPropertyId(3, 8), "operationalState", "NcDeviceOperationalState", true, this.operationalState),
                new NcPropertyValueHolder(new NcPropertyId(3, 9), "resetCause", "NcResetCause", true, this.resetCause),
                new NcPropertyValueHolder(new NcPropertyId(3, 10), "message", "NcString", true, this.message),
            ], [], this.isRebuildable)
        ];

        properties[0].values = properties[0].values.concat(super.GetAllProperties(recurse)[0].values);

        return properties;
    }

    public override Restore(restoreArguments: RestoreArguments, applyChanges: Boolean) : NcObjectPropertiesSetValidation[]
    {
        let validationEntries = new Array<NcObjectPropertiesSetValidation>();

        let myRestoreData = restoreArguments.dataSet.values.find(f => f.path.join('.') == this.GetRolePath().join('.'))
        if(myRestoreData)
        {
            let myNotices = new Array<NcPropertyRestoreNotice>();

            myRestoreData.values.forEach(propertyData => {
                let propertyId = NcElementId.ToPropertyString(propertyData.id);
                if(propertyId != '1p6' && propertyId != '3p5' && propertyId != '3p6' && propertyId != '3p7')
                    myNotices.push(new NcPropertyRestoreNotice(
                        propertyData.id,
                        propertyData.name,
                        NcPropertyRestoreNoticeType.Warning,
                        "Property cannot be changed and will be left untouched"));
                else if(applyChanges)
                {
                    //Perform further validation
                    this.Set(this.oid, propertyData.id, propertyData.value, 0);
                }
            });

            validationEntries.push(new NcObjectPropertiesSetValidation(this.GetRolePath(), NcRestoreValidationStatus.Ok, myNotices, myNotices.length > 0 ? 'Some properties have notices' : null));
        }

        return validationEntries;
    }
}

export class NcClassManager extends NcManager
{
    public static staticClassID: number[] = [ 1, 3, 2 ];

    @myIdDecorator('1p1')
    public override classID: number[] = NcClassManager.staticClassID;

    @myIdDecorator('3p1')
    public controlClasses: NcClassDescriptor[];

    @myIdDecorator('3p2')
    public dataTypes: NcDatatypeDescriptor[];

    public static staticRole: string = "ClassManager";

    private controlClassesRegister: { [key: string]: NcClassDescriptor };
    private dataTypesRegister: { [key: string]: NcDatatypeDescriptor };

    public constructor(
        oid: number,
        constantOid: boolean,
        ownerObject: NcObject | null,
        userLabel: string,
        touchpoints: NcTouchpoint[] | null,
        runtimePropertyConstraints: NcPropertyConstraints[] | null,
        description: string,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, ownerObject, NcClassManager.staticRole, userLabel, touchpoints, runtimePropertyConstraints, description, notificationContext);

        this.controlClassesRegister = this.GenerateClassDescriptors();
        this.controlClasses = Object.values(this.controlClassesRegister);

        this.dataTypesRegister = this.GenerateTypeDescriptors();
        this.dataTypes = Object.values(this.dataTypesRegister);
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
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.controlClasses);
                case '3p2':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.dataTypes);
                default:
                    return super.Get(oid, propertyId, handle);
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.BadOid, 'OID could not be found');
    }

    public override InvokeMethod(oid: number, methodId: NcElementId, args: { [key: string]: any; } | null, handle: number): CommandResponseNoValue 
    {
        if(oid == this.oid)
        {
            let key: string = `${methodId.level}m${methodId.index}`;

            switch(key)
            {
                case '1m3': //GetSequenceItem
                    {
                        if(args != null &&
                            'id' in args &&
                            'index' in args)
                        {
                            let propertyId = args['id'] as NcElementId;
                            let index = args['index'] as number;

                            if(propertyId)
                            {
                                if(index >= 0)
                                {
                                    let propertyKey: string = `${propertyId.level}p${propertyId.index}`;
                                    switch(propertyKey)
                                    {
                                        case '3p1':
                                            {
                                                let itemValue = this.controlClasses[index];
                                                if(itemValue)
                                                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, itemValue);
                                                else
                                                    return new CommandResponseError(handle, NcMethodStatus.IndexOutOfBounds, 'Index could not be found');
                                            }
                                        case '3p2':
                                            {
                                                let itemValue = this.dataTypes[index];
                                                if(itemValue)
                                                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, itemValue);
                                                else
                                                    return new CommandResponseError(handle, NcMethodStatus.IndexOutOfBounds, 'Index could not be found');
                                            }
                                        default:
                                            return new CommandResponseError(handle, NcMethodStatus.PropertyNotImplemented, 'Property could not be found');
                                    }
                                }
                                else
                                    return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid index argument provided');
                            }
                            else
                                return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid id argument provided');
                        }
                        else
                            return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid arguments provided');
                    }
                case '1m4': //SetSequenceItem
                    {
                        if(args != null &&
                            'id' in args &&
                            'index' in args &&
                            'value' in args)
                        {
                            let propertyId = args['id'] as NcElementId;
                            if(propertyId)
                            {
                                let propertyKey: string = `${propertyId.level}p${propertyId.index}`;
                                return new CommandResponseError(handle, NcMethodStatus.Readonly, `Property ${propertyKey} is readonly`);
                            }
                            else
                                return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid id argument provided');
                        }
                        else
                            return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid arguments provided');
                    }
                case '1m5': //AddSequenceItem
                    {
                        if(args != null &&
                            'id' in args &&
                            'value' in args)
                        {
                            let propertyId = args['id'] as NcElementId;
                            if(propertyId)
                            {
                                let propertyKey: string = `${propertyId.level}p${propertyId.index}`;
                                return new CommandResponseError(handle, NcMethodStatus.Readonly, `Property ${propertyKey} is readonly`);
                            }
                            else
                                return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid id argument provided');
                        }
                        else
                            return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid arguments provided');
                    }
                case '1m6': //RemoveSequenceItem
                    {
                        if(args != null &&
                            'id' in args &&
                            'index' in args)
                        {
                            let propertyId = args['id'] as NcElementId;
                            if(propertyId)
                            {
                                let propertyKey: string = `${propertyId.level}p${propertyId.index}`;
                                return new CommandResponseError(handle, NcMethodStatus.Readonly, `Property ${propertyKey} is readonly`);
                            }
                            else
                                return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid id argument provided');
                        }
                        else
                            return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid arguments provided');
                    }
                case '1m7': //GetSequenceLength
                    {
                        if(args != null &&
                            'id' in args)
                        {
                            let propertyId = args['id'] as NcElementId;
                            if(propertyId)
                            {
                                let propertyKey: string = `${propertyId.level}p${propertyId.index}`;
                                switch(propertyKey)
                                {
                                    case '3p1':
                                        {
                                            let length = this.controlClasses.length;

                                            return new CommandResponseWithValue(handle, NcMethodStatus.OK, length);
                                        }
                                    case '3p2':
                                        {
                                            let length = this.dataTypes.length;

                                            return new CommandResponseWithValue(handle, NcMethodStatus.OK, length);
                                        }
                                    default:
                                        return new CommandResponseError(handle, NcMethodStatus.PropertyNotImplemented, 'Property could not be found');
                                }
                            }
                            else
                                return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid id argument provided');
                        }
                        else
                            return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid arguments provided');
                    }
                case '3m1':
                    {
                        if(args != null && 'classId' in args)
                        {
                            if('includeInherited' in args)
                            {
                                let classId = args['classId'] as number[];
                                let includeInherited = args['includeInherited'] as boolean;

                                if(includeInherited)
                                {
                                    let descriptor = this.GetClassDescriptor(classId, true);
                                    if(descriptor)
                                        return new CommandResponseWithValue(handle, NcMethodStatus.OK, descriptor);
                                    else
                                        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Descriptor for class could not be found');
                                }
                                else
                                {
                                    let descriptor = this.GetClassDescriptor(classId, false);
                                    if(descriptor)
                                        return new CommandResponseWithValue(handle, NcMethodStatus.OK, descriptor);
                                    else
                                        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Descriptor for class could not be found');
                                }
                            }
                            else
                                return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'No includeInherited argument provided');
                        }
                        else
                            return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'No class identity has been provided');
                    }
                case '3m2':
                    {
                        if(args != null && 'name' in args)
                        {
                            if('includeInherited' in args)
                            {
                                let name = args['name'] as string;
                                let includeInherited = args['includeInherited'] as boolean;

                                if(includeInherited)
                                {
                                    let descriptor = this.GetTypeDescriptor(name, true);
                                    if(descriptor)
                                        return new CommandResponseWithValue(handle, NcMethodStatus.OK, descriptor);
                                    else
                                        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Descriptor for type could not be found');
                                }
                                else
                                {
                                    let descriptor = this.GetTypeDescriptor(name, false);
                                    if(descriptor)
                                        return new CommandResponseWithValue(handle, NcMethodStatus.OK, descriptor);
                                    else
                                        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Descriptor for type could not be found');
                                }
                            }
                            else
                                return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'No includeInherited argument provided');
                        }
                        else
                            return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'No type name has been provided');
                    }
                default:
                    return super.InvokeMethod(oid, methodId, args, handle);
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.BadOid, 'OID could not be found');
    }

    public static override GetClassDescriptor(includeInherited: boolean): NcClassDescriptor 
    {
        let currentClassDescriptor = new NcClassDescriptor(`${NcClassManager.name} class descriptor`,
            NcClassManager.staticClassID, NcClassManager.name, NcClassManager.staticRole,
            [ 
                new NcPropertyDescriptor(new NcElementId(3, 1), "controlClasses", "NcClassDescriptor", true, false, true, null, "Descriptions of all control classes in the device (descriptors do not contain inherited elements)"),
                new NcPropertyDescriptor(new NcElementId(3, 2), "datatypes", "NcDatatypeDescriptor", true, false, true, null, "Descriptions of all data types in the device (descriptors do not contain inherited elements)")
            ],
            [ 
                new NcMethodDescriptor(new NcElementId(3, 1), "GetControlClass", "NcMethodResultClassDescriptor", [
                    new NcParameterDescriptor("classId", "NcClassId", false, false, null, "class ID"),
                    new NcParameterDescriptor("includeInherited", "NcBoolean", false, false, null, "if set the descriptor would contain all inherited elements")
                ], "Get a single class descriptor"),
                new NcMethodDescriptor(new NcElementId(3, 2), "GetDatatype", "NcMethodResultDatatypeDescriptor", [
                    new NcParameterDescriptor("name", "NcName", false, false, null, "name of datatype"),
                    new NcParameterDescriptor("includeInherited", "NcBoolean", false, false, null, "if set the descriptor would contain all inherited elements")
                ], "Get a single datatype descriptor")
            ],
            []
        );

        if(includeInherited)
        {
            let baseDescriptor = super.GetClassDescriptor(includeInherited);

            currentClassDescriptor.properties = currentClassDescriptor.properties.concat(baseDescriptor.properties);
            currentClassDescriptor.methods = currentClassDescriptor.methods.concat(baseDescriptor.methods);
            currentClassDescriptor.events = currentClassDescriptor.events.concat(baseDescriptor.events);
        }

        return currentClassDescriptor;
    }

    private GenerateClassDescriptors() : { [key: string]: NcClassDescriptor }
    {
        let register = {
            '1': NcObject.GetClassDescriptor(false),
            '1.1': NcBlock.GetClassDescriptor(false),
            '1.2': NcWorker.GetClassDescriptor(false),
            '1.2.0.1': GainControl.GetClassDescriptor(false),
            '1.2.0.2': ExampleControl.GetClassDescriptor(false),
            '1.2.1': NcIdentBeacon.GetClassDescriptor(false),
            '1.2.2': NcStatusMonitor.GetClassDescriptor(false),
            '1.2.2.1': NcReceiverMonitor.GetClassDescriptor(false),
            '1.2.2.2': NcSenderMonitor.GetClassDescriptor(false),
            '1.3': NcManager.GetClassDescriptor(false),
            '1.3.1': NcDeviceManager.GetClassDescriptor(false),
            '1.3.2': NcClassManager.GetClassDescriptor(false),
            '1.3.3': NcBulkPropertiesManager.GetClassDescriptor(false)
        };

        return register;
    }

    private GenerateClassDescriptorWithInheritedElements(identity: number[]) : NcClassDescriptor | null
    {
        let key: string = identity.join('.');

        switch (key)
        {
            case '1': return NcObject.GetClassDescriptor(true);
            case '1.1': return NcBlock.GetClassDescriptor(true);
            case '1.2': return NcWorker.GetClassDescriptor(true);
            case '1.2.0.1': return GainControl.GetClassDescriptor(true);
            case '1.2.0.2': return ExampleControl.GetClassDescriptor(true);
            case '1.2.1': return NcIdentBeacon.GetClassDescriptor(true);
            case '1.2.2': return NcStatusMonitor.GetClassDescriptor(true);
            case '1.2.2.1': return NcReceiverMonitor.GetClassDescriptor(true);
            case '1.2.2.2': return NcSenderMonitor.GetClassDescriptor(true);
            case '1.3': return NcManager.GetClassDescriptor(true);
            case '1.3.1': return NcDeviceManager.GetClassDescriptor(true);
            case '1.3.2': return NcClassManager.GetClassDescriptor(true);
            case '1.3.3': return NcBulkPropertiesManager.GetClassDescriptor(true);
            default: return null;
        }
    }

    private GenerateTypeDescriptors() : { [key: string]: NcDatatypeDescriptor }
    {
        let register = {
            'NcBoolean': new NcDatatypeDescriptorPrimitive("NcBoolean", null, "Boolean primitive type"),
            'NcInt16': new NcDatatypeDescriptorPrimitive("NcInt16", null, "short"),
            'NcInt32': new NcDatatypeDescriptorPrimitive("NcInt32", null, "long"),
            'NcInt64': new NcDatatypeDescriptorPrimitive("NcInt64", null, "longlong"),
            'NcUint16': new NcDatatypeDescriptorPrimitive("NcUint16", null, "unsignedshort"),
            'NcUint32': new NcDatatypeDescriptorPrimitive("NcUint32", null, "unsignedlong"),
            'NcUint64': new NcDatatypeDescriptorPrimitive("NcUint64", null, "unsignedlonglong"),
            'NcFloat32': new NcDatatypeDescriptorPrimitive("NcFloat32", null, "unrestrictedfloat"),
            'NcFloat64': new NcDatatypeDescriptorPrimitive("NcFloat64", null, "unrestricteddouble"),
            'NcString': new NcDatatypeDescriptorPrimitive("NcString", null, "UTF-8 string"),
            'NcClassId': new NcDatatypeDescriptorTypeDef("NcClassId", "NcInt32", true, null, "Sequence of class ID fields."),
            'NcVersionCode': new NcDatatypeDescriptorTypeDef("NcVersionCode", "NcString", false, null, "Version code in semantic versioning format"),
            'NcUri': new NcDatatypeDescriptorTypeDef("NcUri", "NcString", false, null, "Uniform resource identifier"),
            'NcOrganizationId': new NcDatatypeDescriptorTypeDef("NcOrganizationId", "NcInt32", false, null, "Unique 24-bit organization ID"),
            'NcManufacturer': NcManufacturer.GetTypeDescriptor(false),
            'NcProduct': NcProduct.GetTypeDescriptor(false),
            'NcDeviceGenericState': new NcDatatypeDescriptorEnum("NcDeviceGenericState", [
                new NcEnumItemDescriptor("Unknown", 0, "Unknown"),
                new NcEnumItemDescriptor("NormalOperation", 1, "Normal operation"),
                new NcEnumItemDescriptor("Initializing", 2, "Device is initializing"),
                new NcEnumItemDescriptor("Updating", 3, "Device is performing a software or firmware update"),
                new NcEnumItemDescriptor("LicensingError", 4, "Device is experiencing a licensing error"),
                new NcEnumItemDescriptor("InternalError", 5, "Device is experiencing an internal error")
            ], null, "Device generic operational state"),
            'NcResetCause': new NcDatatypeDescriptorEnum("NcResetCause", [
                new NcEnumItemDescriptor("Unknown", 0, "Unknown"),
                new NcEnumItemDescriptor("PowerOn", 1, "Power on"),
                new NcEnumItemDescriptor("InternalError", 2, "Internal error"),
                new NcEnumItemDescriptor("Upgrade", 3, "Upgrade"),
                new NcEnumItemDescriptor("ControllerRequest", 4, "Controller request"),
                new NcEnumItemDescriptor("ManualReset", 5, "Manual request from the front panel")
            ], null, "Reset cause enum"),
            'NcDeviceOperationalState': NcDeviceOperationalState.GetTypeDescriptor(false),
            'NcOid': new NcDatatypeDescriptorTypeDef("NcOid", "NcUint32", false, null, "Object id"),
            'NcName': new NcDatatypeDescriptorTypeDef("NcName", "NcString", false, null, "Programmatically significant name, alphanumerics + underscore, no spaces"),
            'NcUuid': new NcDatatypeDescriptorTypeDef("NcUuid", "NcString", false, null, "UUID"),
            'NcRolePath': new NcDatatypeDescriptorTypeDef("NcRolePath", "NcString", true, null, "Role path"),
            'NcId': new NcDatatypeDescriptorTypeDef("NcId", "NcUint32", false, null, "Identity handler"),
            'NcTimeInterval': new NcDatatypeDescriptorTypeDef("NcTimeInterval", "NcInt64", false, null, "Time interval described in nanoseconds"),
            'NcElementId': NcElementId.GetTypeDescriptor(false),
            'NcPropertyId': NcPropertyId.GetTypeDescriptor(false),
            'NcMethodId': NcMethodId.GetTypeDescriptor(false),
            'NcEventId': NcEventId.GetTypeDescriptor(false),
            'NcDescriptor': NcDescriptor.GetTypeDescriptor(false),
            'NcDatatypeDescriptor': NcDatatypeDescriptor.GetTypeDescriptor(false),
            'NcDatatypeDescriptorPrimitive': NcDatatypeDescriptorPrimitive.GetTypeDescriptor(false),
            'NcDatatypeDescriptorTypeDef': NcDatatypeDescriptorTypeDef.GetTypeDescriptor(false),
            'NcDatatypeDescriptorStruct': NcDatatypeDescriptorStruct.GetTypeDescriptor(false),
            'NcDatatypeDescriptorEnum': NcDatatypeDescriptorEnum.GetTypeDescriptor(false),
            'NcPropertyDescriptor': NcPropertyDescriptor.GetTypeDescriptor(false),
            'NcFieldDescriptor': NcFieldDescriptor.GetTypeDescriptor(false),
            'NcEnumItemDescriptor': NcEnumItemDescriptor.GetTypeDescriptor(false),
            'NcParameterDescriptor': NcParameterDescriptor.GetTypeDescriptor(false),
            'NcMethodDescriptor': NcMethodDescriptor.GetTypeDescriptor(false),
            'NcEventDescriptor': NcEventDescriptor.GetTypeDescriptor(false),
            'NcClassDescriptor': NcClassDescriptor.GetTypeDescriptor(false),
            'NcParameterConstraints': NcParameterConstraints.GetTypeDescriptor(false),
            'NcParameterConstraintsNumber': NcParameterConstraintsNumber.GetTypeDescriptor(false),
            'NcParameterConstraintsString': NcParameterConstraintsString.GetTypeDescriptor(false),
            'NcCounter': NcCounter.GetTypeDescriptor(false),
            'NcPropertyChangeType': new NcDatatypeDescriptorEnum("NcPropertyChangeType", [
                new NcEnumItemDescriptor("ValueChanged", 0, "Current value changed"),
                new NcEnumItemDescriptor("SequenceItemAdded", 1, "Sequence item added"),
                new NcEnumItemDescriptor("SequenceItemChanged", 2, "Sequence item changed"),
                new NcEnumItemDescriptor("SequenceItemRemoved", 3, "Sequence item removed")
            ], null, "Type of property change"),
            'NcDatatypeType': new NcDatatypeDescriptorEnum("NcDatatypeType", [
                new NcEnumItemDescriptor("Primitive", 0, "Primitive datatype"),
                new NcEnumItemDescriptor("Typedef", 1, "Simple alias of another datatype"),
                new NcEnumItemDescriptor("Struct", 2, "Data structure"),
                new NcEnumItemDescriptor("Enum", 3, "Enum datatype")
            ], null, "Datatype type"),
            'NcPropertyChangedEventData': NcPropertyChangedEventData.GetTypeDescriptor(false),
            'NcMethodStatus': new NcDatatypeDescriptorEnum("NcMethodStatus", [
                new NcEnumItemDescriptor("Ok", 200, "Method call was successful"),
                new NcEnumItemDescriptor("PropertyDeprecated", 298, "Method call was successful but targeted property is deprecated"),
                new NcEnumItemDescriptor("MethodDeprecated", 299, "Method call was successful but method is deprecated"),
                new NcEnumItemDescriptor("BadCommandFormat", 400, "Badly-formed command"),
                new NcEnumItemDescriptor("Unauthorized", 401, "Client is not authorized"),
                new NcEnumItemDescriptor("BadOid", 404, "Command addresses a nonexistent object"),
                new NcEnumItemDescriptor("Readonly", 405, "Attempt to change read-only state"),
                new NcEnumItemDescriptor("InvalidRequest", 406, "Method call is invalid in current operating context"),
                new NcEnumItemDescriptor("Conflict", 409, "There is a conflict with the current state of the device"),
                new NcEnumItemDescriptor("BufferOverflow", 413, "Something was too big"),
                new NcEnumItemDescriptor("IndexOutOfBounds", 414, "Index is outside the available range"),
                new NcEnumItemDescriptor("ParameterError", 417, "Method parameter does not meet expectations"),
                new NcEnumItemDescriptor("Locked", 423, "Addressed object is locked"),
                new NcEnumItemDescriptor("DeviceError", 500, "Internal device error"),
                new NcEnumItemDescriptor("MethodNotImplemented", 501, "Addressed method is not implemented by the addressed object"),
                new NcEnumItemDescriptor("PropertyNotImplemented", 502, "Addressed property is not implemented by the addressed object"),
                new NcEnumItemDescriptor("NotReady", 503, "The device is not ready to handle any commands"),
                new NcEnumItemDescriptor("Timeout", 504, "Method call did not finish within the allotted time")
            ], null, "Method invokation status"),
            'NcMethodResult': NcMethodResult.GetTypeDescriptor(false),
            'NcMethodResultError': NcMethodResultError.GetTypeDescriptor(false),
            'NcMethodResultPropertyValue': NcMethodResultPropertyValue.GetTypeDescriptor(false),
            'NcMethodResultId': NcMethodResultId.GetTypeDescriptor(false),
            'NcMethodResultLength': NcMethodResultLength.GetTypeDescriptor(false),
            'NcBlockMemberDescriptor': NcBlockMemberDescriptor.GetTypeDescriptor(false),
            'NcMethodResultBlockMemberDescriptors': NcMethodResultBlockMemberDescriptors.GetTypeDescriptor(false),
            'NcMethodResultClassDescriptor': NcMethodResultClassDescriptor.GetTypeDescriptor(false),
            'NcMethodResultDatatypeDescriptor': NcMethodResultDatatypeDescriptor.GetTypeDescriptor(false),
            'NcMethodResultCounters': NcMethodResultCounters.GetTypeDescriptor(false),
            'NcOverallStatus': new NcDatatypeDescriptorEnum("NcOverallStatus", [
                new NcEnumItemDescriptor("Inactive", 0, "Inactive"),
                new NcEnumItemDescriptor("Healthy", 1, "Active and healthy"),
                new NcEnumItemDescriptor("PartiallyHealthy", 2, "Active and partially healthy"),
                new NcEnumItemDescriptor("Unhealthy", 3, "Active and unhealthy")
            ], null, "Overall monitor status enum data type"),
            'NcLinkStatus': new NcDatatypeDescriptorEnum("NcLinkStatus", [
                new NcEnumItemDescriptor("AllUp", 1, "All the associated network interfaces are down"),
                new NcEnumItemDescriptor("SomeDown", 2, "Some of the associated network interfaces are down"),
                new NcEnumItemDescriptor("AllDown", 3, "All the associated network interfaces are up")
            ], null, "Link status enum data type"),
            'NcConnectionStatus': new NcDatatypeDescriptorEnum("NcConnectionStatus", [
                new NcEnumItemDescriptor("Inactive", 0, "Inactive"),
                new NcEnumItemDescriptor("Healthy", 1, "Active and healthy"),
                new NcEnumItemDescriptor("PartiallyHealthy", 2, "Active and partially healthy"),
                new NcEnumItemDescriptor("Unhealthy", 3, "Active and unhealthy")
            ], null, "Connection status enum data type"),
            'NcTransmissionStatus': new NcDatatypeDescriptorEnum("NcTransmissionStatus", [
                new NcEnumItemDescriptor("Inactive", 0, "Inactive"),
                new NcEnumItemDescriptor("Healthy", 1, "Active and healthy"),
                new NcEnumItemDescriptor("PartiallyHealthy", 2, "Active and partially healthy"),
                new NcEnumItemDescriptor("Unhealthy", 3, "Active and unhealthy")
            ], null, "Transmission status enum data type"),
            'NcSynchronizationStatus': new NcDatatypeDescriptorEnum("NcSynchronizationStatus", [
                new NcEnumItemDescriptor("NotUsed", 0, "Feature not in use"),
                new NcEnumItemDescriptor("Healthy", 1, "Locked to a synchronization source"),
                new NcEnumItemDescriptor("PartiallyHealthy", 2, "Partially locked to a synchronization source"),
                new NcEnumItemDescriptor("Unhealthy", 3, "Not locked to a synchronization source")
            ], null, "Synchronization status enum data type"),
            'NcStreamStatus': new NcDatatypeDescriptorEnum("NcStreamStatus", [
                new NcEnumItemDescriptor("Inactive", 0, "Inactive"),
                new NcEnumItemDescriptor("Healthy", 1, "Active and healthy"),
                new NcEnumItemDescriptor("PartiallyHealthy", 2, "Active and partially healthy"),
                new NcEnumItemDescriptor("Unhealthy", 3, "Active and unhealthy")
            ], null, "Stream status enum data type"),
            'NcEssenceStatus': new NcDatatypeDescriptorEnum("NcEssenceStatus", [
                new NcEnumItemDescriptor("Inactive", 0, "Inactive"),
                new NcEnumItemDescriptor("Healthy", 1, "Active and healthy"),
                new NcEnumItemDescriptor("PartiallyHealthy", 2, "Active and partially healthy"),
                new NcEnumItemDescriptor("Unhealthy", 3, "Active and unhealthy")
            ], null, "Essence status enum data type"),
            'NcTouchpoint': NcTouchpoint.GetTypeDescriptor(false),
            'NcTouchpointResource': NcTouchpointResource.GetTypeDescriptor(false),
            'NcTouchpointNmos': NcTouchpointNmos.GetTypeDescriptor(false),
            'NcTouchpointResourceNmos': NcTouchpointResourceNmos.GetTypeDescriptor(false),
            'NcTouchpointNmosChannelMapping': NcTouchpointNmosChannelMapping.GetTypeDescriptor(false),
            'NcTouchpointResourceNmosChannelMapping': NcTouchpointResourceNmosChannelMapping.GetTypeDescriptor(false),
            'ExampleEnum': new NcDatatypeDescriptorEnum("ExampleEnum", [
                new NcEnumItemDescriptor("Undefined", 0, "Not defined option"),
                new NcEnumItemDescriptor("Alpha", 1, "Alpha option"),
                new NcEnumItemDescriptor("Beta", 2, "Beta option"),
                new NcEnumItemDescriptor("Gamma", 3, "Gamma option")
            ], null, "Example enum data type"),
            'ReceiverMonitorFaultEmulation': new NcDatatypeDescriptorEnum("ReceiverMonitorFaultEmulation", [
                new NcEnumItemDescriptor("Healthy", 1, "Receiver monitor is healthy"),
                new NcEnumItemDescriptor("NIC 1 down", 2, "Network interface 1 is down"),
                new NcEnumItemDescriptor("All NICs down", 3, "All network interfaces are down")
            ], null, "Receiver monitor fault emulation enum data type"),
            'ExampleDataType': ExampleDataType.GetTypeDescriptor(false),
            'NcRegex': new NcDatatypeDescriptorTypeDef("NcRegex", "NcString", false, null, "Regex pattern"),
            'NcPropertyConstraints': NcPropertyConstraints.GetTypeDescriptor(false),
            'NcPropertyConstraintsNumber': NcPropertyConstraintsNumber.GetTypeDescriptor(false),
            'NcPropertyConstraintsString': NcPropertyConstraintsString.GetTypeDescriptor(false),
            'NcBulkValuesHolder': NcBulkValuesHolder.GetTypeDescriptor(false),
            'NcMethodResultBulkValuesHolder': NcMethodResultBulkValuesHolder.GetTypeDescriptor(false),
            'NcMethodResultObjectPropertiesSetValidation': NcMethodResultObjectPropertiesSetValidation.GetTypeDescriptor(false),
            'NcObjectPropertiesHolder': NcObjectPropertiesHolder.GetTypeDescriptor(false),
            'NcObjectPropertiesSetValidation': NcObjectPropertiesSetValidation.GetTypeDescriptor(false),
            'NcPropertyRestoreNotice': NcPropertyRestoreNotice.GetTypeDescriptor(false),
            'NcPropertyValueHolder': NcPropertyValueHolder.GetTypeDescriptor(false),
            'NcPropertyRestoreNoticeType': new NcDatatypeDescriptorEnum("NcPropertyRestoreNoticeType", [
                new NcEnumItemDescriptor("Warning", 300, "Warning property restore notice"),
                new NcEnumItemDescriptor("Error", 400, "Error property restore notice")
            ], null, "Property restore notice type enumeration"),
            'NcRestoreMode': new NcDatatypeDescriptorEnum("NcRestoreMode", [
                new NcEnumItemDescriptor("Modify", 0, "Restore mode is Modify"),
                new NcEnumItemDescriptor("Rebuild", 1, "Restore mode is Rebuild")
            ], null, "Restore mode enumeration"),
            'NcRestoreValidationStatus': new NcDatatypeDescriptorEnum("NcRestoreValidationStatus", [
                new NcEnumItemDescriptor("Ok", 200, "Restore was successful"),
                new NcEnumItemDescriptor("Failed", 400, "Restore failed"),
                new NcEnumItemDescriptor("NotFound", 404, "Restore failed because the role path is not found in the device model or the device cannot create the role path from the data set"),
                new NcEnumItemDescriptor("DeviceError", 500, "Restore failed due to an internal device error preventing the restore from happening"),
            ], null, "Restore validation status enumeration"),
        };

        return register;
    }

    private GenerateTypeDescriptorWithInheritedElements(name: string) : NcDatatypeDescriptor | null
    {
        switch (name)
        {
            case 'NcPropertyId': return NcPropertyId.GetTypeDescriptor(true);
            case 'NcMethodId': return NcMethodId.GetTypeDescriptor(true);
            case 'NcEventId': return NcEventId.GetTypeDescriptor(true);
            case 'NcDatatypeDescriptor': return NcDatatypeDescriptor.GetTypeDescriptor(true);
            case 'NcDatatypeDescriptorPrimitive': return NcDatatypeDescriptorPrimitive.GetTypeDescriptor(true);
            case 'NcDatatypeDescriptorTypeDef': return NcDatatypeDescriptorTypeDef.GetTypeDescriptor(true);
            case 'NcDatatypeDescriptorStruct': return NcDatatypeDescriptorStruct.GetTypeDescriptor(true);
            case 'NcDatatypeDescriptorEnum': return NcDatatypeDescriptorEnum.GetTypeDescriptor(true);
            case 'NcPropertyDescriptor': return NcPropertyDescriptor.GetTypeDescriptor(true);
            case 'NcFieldDescriptor': return NcFieldDescriptor.GetTypeDescriptor(true);
            case 'NcEnumItemDescriptor': return NcEnumItemDescriptor.GetTypeDescriptor(true);
            case 'NcParameterDescriptor': return NcParameterDescriptor.GetTypeDescriptor(true);
            case 'NcMethodDescriptor': return NcMethodDescriptor.GetTypeDescriptor(true);
            case 'NcEventDescriptor': return NcEventDescriptor.GetTypeDescriptor(true);
            case 'NcClassDescriptor': return NcClassDescriptor.GetTypeDescriptor(true);
            case 'NcParameterConstraintsNumber': return NcParameterConstraintsNumber.GetTypeDescriptor(true);
            case 'NcParameterConstraintsString': return NcParameterConstraintsString.GetTypeDescriptor(true);
            case 'NcCounter': return NcCounter.GetTypeDescriptor(true);
            case 'NcBlockMemberDescriptor': return NcBlockMemberDescriptor.GetTypeDescriptor(true);
            case 'NcTouchpointNmos': return NcTouchpointNmos.GetTypeDescriptor(true);
            case 'NcTouchpointNmosChannelMapping': return NcTouchpointNmosChannelMapping.GetTypeDescriptor(true);
            case 'NcTouchpointResourceNmos': return NcTouchpointResourceNmos.GetTypeDescriptor(true);
            case 'NcTouchpointResourceNmosChannelMapping': return NcTouchpointResourceNmosChannelMapping.GetTypeDescriptor(true);
            case 'NcPropertyConstraintsNumber': return NcPropertyConstraintsNumber.GetTypeDescriptor(true);
            case 'NcPropertyConstraintsString': return NcPropertyConstraintsString.GetTypeDescriptor(true);
            case 'NcMethodResultError': return NcMethodResultError.GetTypeDescriptor(true);
            case 'NcMethodResultPropertyValue': return NcMethodResultPropertyValue.GetTypeDescriptor(true);
            case 'NcMethodResultBlockMemberDescriptors': return NcMethodResultBlockMemberDescriptors.GetTypeDescriptor(true);
            case 'NcMethodResultClassDescriptor': return NcMethodResultClassDescriptor.GetTypeDescriptor(true);
            case 'NcMethodResultDatatypeDescriptor': return NcMethodResultDatatypeDescriptor.GetTypeDescriptor(true);
            case 'NcMethodResultId': return NcMethodResultId.GetTypeDescriptor(true);
            case 'NcMethodResultLength': return NcMethodResultLength.GetTypeDescriptor(true);
            case 'NcMethodResultCounters': return NcMethodResultCounters.GetTypeDescriptor(true);
            case 'NcBulkValuesHolder': return NcBulkValuesHolder.GetTypeDescriptor(true);
            case 'NcMethodResultBulkValuesHolder': return NcMethodResultBulkValuesHolder.GetTypeDescriptor(true);
            case 'NcMethodResultObjectPropertiesSetValidation': return NcMethodResultObjectPropertiesSetValidation.GetTypeDescriptor(true);
            case 'NcObjectPropertiesHolder': return NcObjectPropertiesHolder.GetTypeDescriptor(true);
            case 'NcObjectPropertiesSetValidation': return NcObjectPropertiesSetValidation.GetTypeDescriptor(true);
            case 'NcPropertyRestoreNotice': return NcPropertyRestoreNotice.GetTypeDescriptor(true);
            case 'NcPropertyValueHolder': return NcPropertyValueHolder.GetTypeDescriptor(true);
            default: return this.dataTypesRegister[name];
        }
    }

    public GetClassDescriptor(identity: number[], includeInherited: boolean) : NcClassDescriptor | null
    {
        if(includeInherited)
            return this.GenerateClassDescriptorWithInheritedElements(identity);
        else
        {
            let key: string = identity.join('.');

            return this.controlClassesRegister[key];
        }
    }

    public GetTypeDescriptor(name: string, includeInherited: boolean) : NcDatatypeDescriptor | null
    {
        if(includeInherited)
            return this.GenerateTypeDescriptorWithInheritedElements(name);
        else
            return this.dataTypesRegister[name];
    }

    public override GetAllProperties(recurse: boolean) : NcObjectPropertiesHolder[]
    {
        let properties = [
            new NcObjectPropertiesHolder(this.GetRolePath(), [], [
                new NcPropertyValueHolder(new NcPropertyId(3, 1), "controlClasses", "NcClassDescriptor", true, this.controlClasses),
                new NcPropertyValueHolder(new NcPropertyId(3, 2), "dataTypes", "NcDatatypeDescriptor", true, this.dataTypes)
            ], [], this.isRebuildable)
        ];

        properties[0].values = properties[0].values.concat(super.GetAllProperties(recurse)[0].values);

        return properties;
    }

    public override Restore(restoreArguments: RestoreArguments, applyChanges: Boolean) : NcObjectPropertiesSetValidation[]
    {
        let validationEntries = new Array<NcObjectPropertiesSetValidation>();

        let myRestoreData = restoreArguments.dataSet.values.find(f => f.path.join('.') == this.GetRolePath().join('.'))
        if(myRestoreData)
        {
            let myNotices = new Array<NcPropertyRestoreNotice>();

            myRestoreData.values.forEach(propertyData => {
                if(NcElementId.ToPropertyString(propertyData.id) != '1p6')
                    myNotices.push(new NcPropertyRestoreNotice(
                        propertyData.id,
                        propertyData.name,
                        NcPropertyRestoreNoticeType.Warning,
                        "Property cannot be changed and will be left untouched"));
                else if(applyChanges)
                {
                    //Perform further validation
                    this.Set(this.oid, propertyData.id, propertyData.value, 0);
                }
            });

            validationEntries.push(new NcObjectPropertiesSetValidation(this.GetRolePath(), NcRestoreValidationStatus.Ok, myNotices, myNotices.length > 0 ? 'Some properties have notices' : null));
        }

        return validationEntries;
    }
}

export class NcBulkPropertiesManager extends NcManager
{
    public static staticClassID: number[] = [ 1, 3, 3 ];

    @myIdDecorator('1p1')
    public override classID: number[] = NcBulkPropertiesManager.staticClassID;

    public static staticRole: string = "BulkPropertiesManager";

    public constructor(
        oid: number,
        constantOid: boolean,
        ownerObject: NcObject | null,
        userLabel: string,
        touchpoints: NcTouchpoint[] | null,
        runtimePropertyConstraints: NcPropertyConstraints[] | null,
        description: string,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, ownerObject, NcBulkPropertiesManager.staticRole, userLabel, touchpoints, runtimePropertyConstraints, description, notificationContext);
    }

    //'1m1'
    public override Get(oid: number, propertyId: NcElementId, handle: number) : CommandResponseNoValue
    {
        if(oid == this.oid)
        {
            let key: string = `${propertyId.level}p${propertyId.index}`;

            return super.Get(oid, propertyId, handle);
        }

        return new CommandResponseError(handle, NcMethodStatus.BadOid, 'OID could not be found');
    }

    //'1m2'
    public override Set(oid: number, id: NcElementId, value: any, handle: number) : CommandResponseNoValue
    {
        if(oid == this.oid)
        {
            let key: string = `${id.level}p${id.index}`;

            return super.Set(oid, id, value, handle);
        }

        return new CommandResponseError(handle, NcMethodStatus.BadOid, 'OID could not be found');
    }

    public static override GetClassDescriptor(includeInherited: boolean): NcClassDescriptor
    {
        let currentClassDescriptor = new NcClassDescriptor(`${NcBulkPropertiesManager.name} class descriptor`,
            NcBulkPropertiesManager.staticClassID, NcBulkPropertiesManager.name, NcBulkPropertiesManager.staticRole,
            [],
            [ 
                new NcMethodDescriptor(new NcElementId(3, 1), "GetPropertiesByPath", "NcMethodResultBulkValuesHolder", [
                    new NcParameterDescriptor("path", "NcRolePath", false, false, null, "The target role path"),
                    new NcParameterDescriptor("recurse", "NcBoolean", false, false, null, "If true will return properties on specified path and all the nested paths")
                ], "Get bulk object properties by given path"),
                new NcMethodDescriptor(new NcElementId(3, 2), "ValidateSetPropertiesByPath", "NcMethodResultObjectPropertiesSetValidation", [
                    new NcParameterDescriptor("dataSet", "NcBulkValuesHolder", false, false, null, "The values offered (this may include read-only values and also paths which are not the target role path)"),
                    new NcParameterDescriptor("path", "NcRolePath", false, false, null, "The target role path"),
                    new NcParameterDescriptor("recurse", "NcBoolean", false, false, null, "If true will validate properties on target path and all the nested paths"),
                    new NcParameterDescriptor("restoreMode", "NcRestoreMode", false, false, null, "Defines the restore mode to be applied")
                ], "Validate bulk properties for setting by given paths"),
                new NcMethodDescriptor(new NcElementId(3, 3), "SetPropertiesByPath", "NcMethodResultObjectPropertiesSetValidation", [
                    new NcParameterDescriptor("dataSet", "NcBulkValuesHolder", false, false, null, "The values offered (this may include read-only values and also paths which are not the target role path)"),
                    new NcParameterDescriptor("path", "NcRolePath", false, false, null, "The target role path"),
                    new NcParameterDescriptor("recurse", "NcBoolean", false, false, null, "If true will set properties on target path and all the nested paths"),
                    new NcParameterDescriptor("restoreMode", "NcRestoreMode", false, false, null, "Defines the restore mode to be applied")
                ], "Set bulk properties by given paths"),
            ],
            []
        );

        if(includeInherited)
        {
            let baseDescriptor = super.GetClassDescriptor(includeInherited);

            currentClassDescriptor.properties = currentClassDescriptor.properties.concat(baseDescriptor.properties);
            currentClassDescriptor.methods = currentClassDescriptor.methods.concat(baseDescriptor.methods);
            currentClassDescriptor.events = currentClassDescriptor.events.concat(baseDescriptor.events);
        }

        return currentClassDescriptor;
    }

    public override GetAllProperties(recurse: boolean) : NcObjectPropertiesHolder[]
    {
        let properties = [
            new NcObjectPropertiesHolder(this.GetRolePath(), [], [], [], this.isRebuildable)
        ];

        properties[0].values = properties[0].values.concat(super.GetAllProperties(recurse)[0].values);

        return properties;
    }

    public override Restore(restoreArguments: RestoreArguments, applyChanges: Boolean) : NcObjectPropertiesSetValidation[]
    {
        let validationEntries = new Array<NcObjectPropertiesSetValidation>();

        let myRestoreData = restoreArguments.dataSet.values.find(f => f.path.join('.') == this.GetRolePath().join('.'))
        if(myRestoreData)
        {
            let myNotices = new Array<NcPropertyRestoreNotice>();

            myRestoreData.values.forEach(propertyData => {
                let propertyId = NcElementId.ToPropertyString(propertyData.id);
                if(propertyId != '1p6')
                    myNotices.push(new NcPropertyRestoreNotice(
                        propertyData.id,
                        propertyData.name,
                        NcPropertyRestoreNoticeType.Warning,
                        "Property cannot be changed and will be left untouched"));
                else if(applyChanges)
                {
                    //Perform further validation
                    this.Set(this.oid, propertyData.id, propertyData.value, 0);
                }
            });

            validationEntries.push(new NcObjectPropertiesSetValidation(this.GetRolePath(), NcRestoreValidationStatus.Ok, myNotices, myNotices.length > 0 ? 'Some properties have notices' : null));
        }

        return validationEntries;
    }
}
