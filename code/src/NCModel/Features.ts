import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { CommandResponseError, CommandResponseNoValue, CommandResponseWithValue } from '../NCProtocol/Commands';
import { INotificationContext } from '../SessionManager';
import {
    BaseType,
    myIdDecorator,
    NcClassDescriptor,
    NcDatatypeDescriptor,
    NcDatatypeDescriptorStruct,
    NcElementId,
    NcFieldDescriptor,
    NcMethodDescriptor,
    NcMethodStatus,
    NcObject,
    NcObjectPropertiesHolder,
    NcObjectPropertiesSetValidation,
    NcParameterConstraintsNumber,
    NcParameterConstraintsString,
    NcParameterDescriptor,
    NcPropertyChangeType,
    NcPropertyConstraints,
    NcPropertyDescriptor,
    NcPropertyId,
    NcPropertyRestoreNotice,
    NcPropertyRestoreNoticeType,
    NcPropertyValueHolder,
    NcRestoreValidationStatus,
    NcTouchpoint, 
    RestoreArguments} from './Core';

export abstract class NcWorker extends NcObject
{
    public static staticClassID: number[] = [ 1, 2 ];

    @myIdDecorator('1p1')
    public override classID: number[] = NcWorker.staticClassID;

    @myIdDecorator('2p1')
    public enabled: boolean;

    public constructor(
        oid: number,
        constantOid: boolean,
        ownerObject: NcObject | null,
        role: string,
        userLabel: string,
        touchpoints: NcTouchpoint[],
        runtimePropertyConstraints: NcPropertyConstraints[] | null,
        enabled: boolean,
        description: string,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, ownerObject, role, userLabel, touchpoints, runtimePropertyConstraints, description, notificationContext);

        this.enabled = enabled;
    }

    //'1m1'
    public override Get(oid: number, propertyId: NcElementId, handle: number) : CommandResponseNoValue
    {
        if(oid == this.oid)
        {
            let key: string = `${propertyId.level}p${propertyId.index}`;

            switch(key)
            {
                case '2p1':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.enabled);
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
                case '2p1':
                    this.enabled = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.enabled, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                default:
                    return super.Set(oid, id, value, handle);
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.BadOid, 'OID could not be found');
    }

    public static override GetClassDescriptor(includeInherited: boolean): NcClassDescriptor
    {
        let currentClassDescriptor = new NcClassDescriptor(`${NcWorker.name} class descriptor`,
            NcWorker.staticClassID, NcWorker.name, null,
            [
                new NcPropertyDescriptor(new NcElementId(2, 1), "enabled", "NcBoolean", false, false, false, null, "TRUE iff worker is enabled")
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
            new NcObjectPropertiesHolder(this.GetRolePath(), [
                new NcPropertyValueHolder(new NcPropertyId(2, 1), "enabled", this.enabled)
            ], false)
        ];

        properties[0].values = properties[0].values.concat(super.GetAllProperties(recurse)[0].values);

        return properties;
    }
}

export class GainControl extends NcWorker
{
    public static staticClassID: number[] = [ 1, 2, 0, 1 ];

    @myIdDecorator('1p1')
    public override classID: number[] = GainControl.staticClassID;

    @myIdDecorator('3p1')
    public gainValue: number;

    public constructor(
        oid: number,
        constantOid: boolean,
        ownerObject: NcObject | null,
        role: string,
        userLabel: string,
        touchpoints: NcTouchpoint[],
        runtimePropertyConstraints: NcPropertyConstraints[] | null,
        enabled: boolean,
        gainValue: number,
        description: string,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, ownerObject, role, userLabel, touchpoints, runtimePropertyConstraints, enabled, description, notificationContext);

        this.gainValue = gainValue;
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
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.gainValue);
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
                    this.gainValue = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.gainValue, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                default:
                    return super.Set(oid, id, value, handle);
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.BadOid, 'OID could not be found');
    }

    public static override GetClassDescriptor(includeInherited: boolean): NcClassDescriptor 
    {
        let currentClassDescriptor = new NcClassDescriptor(`${GainControl.name} class descriptor`,
            GainControl.staticClassID, GainControl.name, null,
            [
                new NcPropertyDescriptor(new NcElementId(3, 1), "gainValue", "NcFloat32", false, false, false, null, "Gain value")
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
            new NcObjectPropertiesHolder(this.GetRolePath(), [
                new NcPropertyValueHolder(new NcPropertyId(3, 1), "gainValue", this.gainValue)
            ], false)
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
                let propertyId = NcElementId.ToPropertyString(propertyData.propertyId);
                if(propertyId != '1p6' && propertyId != '3p1')
                    myNotices.push(new NcPropertyRestoreNotice(
                        propertyData.propertyId,
                        propertyData.propertyName,
                        NcPropertyRestoreNoticeType.Warning,
                        "Property cannot be changed and will be left untouched"));
                else if(applyChanges)
                {
                    //Perform further validation
                    this.Set(this.oid, propertyData.propertyId, propertyData.value, 0);
                }
            });

            validationEntries.push(new NcObjectPropertiesSetValidation(this.GetRolePath(), NcRestoreValidationStatus.Ok, myNotices, myNotices.length > 0 ? 'Some properties have notices' : null));
        }

        return validationEntries;
    }
}

export class NcIdentBeacon extends NcWorker
{
    public static staticClassID: number[] = [ 1, 2, 2 ];

    @myIdDecorator('1p1')
    public override classID: number[] = NcIdentBeacon.staticClassID;

    @myIdDecorator('3p1')
    public active: boolean;

    public constructor(
        oid: number,
        constantOid: boolean,
        ownerObject: NcObject | null,
        role: string,
        userLabel: string,
        touchpoints: NcTouchpoint[],
        runtimePropertyConstraints: NcPropertyConstraints[] | null,
        enabled: boolean,
        active: boolean,
        description: string,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, ownerObject, role, userLabel, touchpoints, runtimePropertyConstraints, enabled, description, notificationContext);

        this.active = active;
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
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.active);
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
                    this.active = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.active, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                default:
                    return super.Set(oid, id, value, handle);
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.BadOid, 'OID could not be found');
    }

    public static override GetClassDescriptor(includeInherited: boolean): NcClassDescriptor 
    {
        let currentClassDescriptor = new NcClassDescriptor(`${NcIdentBeacon.name} class descriptor`,
            NcIdentBeacon.staticClassID, NcIdentBeacon.name, null,
            [
                new NcPropertyDescriptor(new NcElementId(3, 1), "active", "NcBoolean", false, false, false, null, "Indicator active state")
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
            new NcObjectPropertiesHolder(this.GetRolePath(), [
                new NcPropertyValueHolder(new NcPropertyId(3, 1), "active", this.active)
            ], false)
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
                let propertyId = NcElementId.ToPropertyString(propertyData.propertyId);
                if(propertyId != '1p6' && propertyId != '3p1')
                    myNotices.push(new NcPropertyRestoreNotice(
                        propertyData.propertyId,
                        propertyData.propertyName,
                        NcPropertyRestoreNoticeType.Warning,
                        "Property cannot be changed and will be left untouched"));
                else if(applyChanges)
                {
                    //Perform further validation
                    this.Set(this.oid, propertyData.propertyId, propertyData.value, 0);
                }
            });

            validationEntries.push(new NcObjectPropertiesSetValidation(this.GetRolePath(), NcRestoreValidationStatus.Ok, myNotices, myNotices.length > 0 ? 'Some properties have notices' : null));
        }

        return validationEntries;
    }
}

enum NcConnectionStatus
{
    Undefined = 0,
    Connected = 1,
    Disconnected = 2,
    ConnectionError = 3
}

enum NcPayloadStatus
{
    Undefined = 0,
    PayloadOK = 1,
    PayloadFormatUnsupported = 2,
    PayloadError = 3
}

export class NcReceiverStatus extends BaseType
{
    public connectionStatus: NcConnectionStatus;
    public payloadStatus: NcPayloadStatus;

    constructor(
        connectionStatus: NcConnectionStatus,
        payloadStatus: NcPayloadStatus) 
    {
        super();

        this.connectionStatus = connectionStatus;
        this.payloadStatus = payloadStatus;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("NcReceiverStatus", [
            new NcFieldDescriptor("connectionStatus", "NcConnectionStatus", false, false, null, "Receiver connection status field"),
            new NcFieldDescriptor("payloadStatus", "NcPayloadStatus", false, false, null, "Receiver payload status field")
        ], null, null, "Receiver status data type");
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcReceiverMonitor extends NcWorker
{
    public static staticClassID: number[] = [ 1, 2, 3 ];

    @myIdDecorator('1p1')
    public override classID: number[] = NcReceiverMonitor.staticClassID;

    @myIdDecorator('3p1')
    public connectionStatus: NcConnectionStatus;

    @myIdDecorator('3p2')
    public connectionStatusMessage: string | null;

    @myIdDecorator('3p3')
    public payloadStatus: NcPayloadStatus;

    @myIdDecorator('3p4')
    public payloadStatusMessage: string | null;

    public constructor(
        oid: number,
        constantOid: boolean,
        ownerObject: NcObject | null,
        role: string,
        userLabel: string,
        touchpoints: NcTouchpoint[],
        runtimePropertyConstraints: NcPropertyConstraints[] | null,
        enabled: boolean,
        description: string,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, ownerObject, role, userLabel, touchpoints, runtimePropertyConstraints, enabled, description, notificationContext);

        this.connectionStatus = NcConnectionStatus.Undefined;
        this.connectionStatusMessage = null;
        
        this.payloadStatus = NcPayloadStatus.Undefined;
        this.payloadStatusMessage = null;
    }

    public Connected()
    {
        this.connectionStatus = NcConnectionStatus.Connected;
        this.payloadStatus = NcPayloadStatus.PayloadOK;

        this.connectionStatusMessage = null;
        this.payloadStatusMessage = null;

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 1), NcPropertyChangeType.ValueChanged, this.connectionStatus, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 3), NcPropertyChangeType.ValueChanged, this.payloadStatus, null);
    }

    public Disconnected()
    {
        this.connectionStatus = NcConnectionStatus.Undefined;
        this.payloadStatus = NcPayloadStatus.Undefined;

        this.connectionStatusMessage = null;
        this.payloadStatusMessage = null;

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 1), NcPropertyChangeType.ValueChanged, this.connectionStatus, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 3), NcPropertyChangeType.ValueChanged, this.payloadStatus, null);
    }

    //'1m1'
    public override Get(oid: number, id: NcElementId, handle: number) : CommandResponseNoValue
    {
        if(oid == this.oid)
        {
            let key: string = `${id.level}p${id.index}`;

            switch(key)
            {
                case '3p1':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.connectionStatus);
                case '3p2':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.connectionStatusMessage);
                case '3p3':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.payloadStatus);
                case '3p4':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.payloadStatusMessage);
                default:
                    return super.Get(oid, id, handle);
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
                    return new CommandResponseError(handle, NcMethodStatus.Readonly, 'Property is readonly');
                default:
                    return super.Set(oid, id, value, handle);
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.BadOid, 'OID could not be found');
    }

    public static override GetClassDescriptor(includeInherited: boolean): NcClassDescriptor 
    {
        let currentClassDescriptor = new NcClassDescriptor(`${NcReceiverMonitor.name} class descriptor`,
            NcReceiverMonitor.staticClassID, NcReceiverMonitor.name, null,
            [
                new NcPropertyDescriptor(new NcElementId(3, 1), "connectionStatus", "NcConnectionStatus", true, false, false, null, "Connection status property"),
                new NcPropertyDescriptor(new NcElementId(3, 2), "connectionStatusMessage", "NcString", true, true, false, null, "Connection status message property"),
                new NcPropertyDescriptor(new NcElementId(3, 3), "payloadStatus", "NcPayloadStatus", true, false, false, null, "Payload status property"),
                new NcPropertyDescriptor(new NcElementId(3, 4), "payloadStatusMessage", "NcString", true, true, false, null, "Payload status message property")
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
            new NcObjectPropertiesHolder(this.GetRolePath(), [
                new NcPropertyValueHolder(new NcPropertyId(3, 1), "connectionStatus", this.connectionStatus),
                new NcPropertyValueHolder(new NcPropertyId(3, 2), "connectionStatusMessage", this.connectionStatusMessage),
                new NcPropertyValueHolder(new NcPropertyId(3, 3), "payloadStatus", this.payloadStatus),
                new NcPropertyValueHolder(new NcPropertyId(3, 4), "payloadStatusMessage", this.payloadStatusMessage),
            ], false)
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
                if(NcElementId.ToPropertyString(propertyData.propertyId) != '1p6')
                    myNotices.push(new NcPropertyRestoreNotice(
                        propertyData.propertyId,
                        propertyData.propertyName,
                        NcPropertyRestoreNoticeType.Warning,
                        "Property cannot be changed and will be left untouched"));
                else if(applyChanges)
                {
                    //Perform further validation
                    this.Set(this.oid, propertyData.propertyId, propertyData.value, 0);
                }
            });

            validationEntries.push(new NcObjectPropertiesSetValidation(this.GetRolePath(), NcRestoreValidationStatus.Ok, myNotices, myNotices.length > 0 ? 'Some properties have notices' : null));
        }

        return validationEntries;
    }
}

export class NcReceiverMonitorProtected extends NcReceiverMonitor
{
    public static staticClassID: number[] = [ 1, 2, 3, 1 ];

    @myIdDecorator('1p1')
    public override classID: number[] = NcReceiverMonitorProtected.staticClassID;

    @myIdDecorator('4p1')
    public signalProtectionStatus: boolean;

    public constructor(
        oid: number,
        constantOid: boolean,
        ownerObject: NcObject | null,
        role: string,
        userLabel: string,
        touchpoints: NcTouchpoint[],
        runtimePropertyConstraints: NcPropertyConstraints[] | null,
        enabled: boolean,
        description: string,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, ownerObject, role, userLabel, touchpoints, runtimePropertyConstraints, enabled, description, notificationContext);

        this.connectionStatus = NcConnectionStatus.Undefined;
        this.connectionStatusMessage = null;
        
        this.payloadStatus = NcPayloadStatus.Undefined;
        this.payloadStatusMessage = null;

        this.signalProtectionStatus = false;
    }

    public Connected()
    {
        this.connectionStatus = NcConnectionStatus.Connected;
        this.payloadStatus = NcPayloadStatus.PayloadOK;

        this.connectionStatusMessage = null;
        this.payloadStatusMessage = null;

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 1), NcPropertyChangeType.ValueChanged, this.connectionStatus, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 3), NcPropertyChangeType.ValueChanged, this.payloadStatus, null);
    }

    public Disconnected()
    {
        this.connectionStatus = NcConnectionStatus.Undefined;
        this.payloadStatus = NcPayloadStatus.Undefined;

        this.connectionStatusMessage = null;
        this.payloadStatusMessage = null;

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 1), NcPropertyChangeType.ValueChanged, this.connectionStatus, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 3), NcPropertyChangeType.ValueChanged, this.payloadStatus, null);
    }

    //'1m1'
    public override Get(oid: number, id: NcElementId, handle: number) : CommandResponseNoValue
    {
        if(oid == this.oid)
        {
            let key: string = `${id.level}p${id.index}`;

            switch(key)
            {
                case '4p1':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.signalProtectionStatus);
                default:
                    return super.Get(oid, id, handle);
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
                case '4p1':
                    return new CommandResponseError(handle, NcMethodStatus.Readonly, 'Property is readonly');
                default:
                    return super.Set(oid, id, value, handle);
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.BadOid, 'OID could not be found');
    }

    public static override GetClassDescriptor(includeInherited: boolean): NcClassDescriptor 
    {
        let currentClassDescriptor = new NcClassDescriptor(`${NcReceiverMonitorProtected.name} class descriptor`,
            NcReceiverMonitorProtected.staticClassID, NcReceiverMonitorProtected.name, null,
            [
                new NcPropertyDescriptor(new NcElementId(4, 1), "signalProtectionStatus", "NcBoolean", true, false, false, null, "Indicates if signal protection is active"),
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
            new NcObjectPropertiesHolder(this.GetRolePath(), [
                new NcPropertyValueHolder(new NcPropertyId(4, 1), "signalProtectionStatus", this.signalProtectionStatus)
            ], false)
        ];

        properties[0].values = properties[0].values.concat(super.GetAllProperties(recurse)[0].values);

        return properties;
    }
}

enum ExampleEnum
{
    Undefined = 0,
    Alpha = 1,
    Beta = 2,
    Gamma = 3
}

export class ExampleDataType extends BaseType
{
    public enumProperty: ExampleEnum;
    public stringProperty: string | null;
    public numberProperty: number;
    public booleanProperty: boolean;

    constructor(
        enumProperty: ExampleEnum,
        stringProperty: string | null,
        numberProperty: number,
        booleanProperty: boolean) 
    {
        super();

        this.enumProperty = enumProperty;
        this.stringProperty = stringProperty;
        this.numberProperty = numberProperty;
        this.booleanProperty = booleanProperty;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("ExampleDataType", [
            new NcFieldDescriptor("enumProperty", "ExampleEnum", false, false, null, "Enum property example"),
            new NcFieldDescriptor("stringProperty", "NcString", false, false, new NcParameterConstraintsString(10, null), "String property example"),
            new NcFieldDescriptor("numberProperty", "NcUint64", false, false, new NcParameterConstraintsNumber(1000, 0, 1), "Number property example"),
            new NcFieldDescriptor("booleanProperty", "NcBoolean", false, false, null, "Boolean property example")
        ], null, null, "Example data type");
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class ExampleControl extends NcWorker
{
    public static staticClassID: number[] = [ 1, 2, 0, 2 ];

    @myIdDecorator('1p1')
    public override classID: number[] = ExampleControl.staticClassID;

    @myIdDecorator('3p1')
    public enumProperty: ExampleEnum;

    @myIdDecorator('3p2')
    public stringProperty: string | null;

    @myIdDecorator('3p3')
    public numberProperty: number;

    @myIdDecorator('3p4')
    public booleanProperty: boolean;

    @myIdDecorator('3p5')
    public objectProperty: ExampleDataType;

    @myIdDecorator('3p6')
    public methodNoArgsCount: number;

    @myIdDecorator('3p7')
    public methodSimpleArgsCount: number;

    @myIdDecorator('3p8')
    public methodObjectArgCount: number;

    @myIdDecorator('3p9')
    public stringSequence: string[];

    @myIdDecorator('3p10')
    public booleanSequence: boolean[];

    @myIdDecorator('3p11')
    public enumSequence: ExampleEnum[];

    @myIdDecorator('3p12')
    public numberSequence: number[];

    @myIdDecorator('3p13')
    public objectSequence: ExampleDataType[];

    public constructor(
        oid: number,
        constantOid: boolean,
        ownerObject: NcObject | null,
        role: string,
        userLabel: string,
        touchpoints: NcTouchpoint[],
        runtimePropertyConstraints: NcPropertyConstraints[] | null,
        enabled: boolean,
        description: string,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, ownerObject, role, userLabel, touchpoints, runtimePropertyConstraints, enabled, description, notificationContext);

        this.enumProperty = ExampleEnum.Undefined;
        this.stringProperty = "test";
        this.numberProperty = 3;
        this.booleanProperty = false;
        this.objectProperty = new ExampleDataType(ExampleEnum.Undefined, "default", 5, false);
        this.methodNoArgsCount = 0;
        this.methodSimpleArgsCount = 0;
        this.methodObjectArgCount = 0;
        this.stringSequence = [ "red", "blue", "green" ];
        this.booleanSequence = [ true, false];
        this.enumSequence = [ ExampleEnum.Alpha, ExampleEnum.Gamma ];
        this.numberSequence = [ 0, 50, 88];
        this.objectSequence = [ new ExampleDataType(ExampleEnum.Alpha, "example", 50, false), new ExampleDataType(ExampleEnum.Gamma, "different", 75, true) ];
    }

    //'1m1'
    public override Get(oid: number, id: NcElementId, handle: number) : CommandResponseNoValue
    {
        if(oid == this.oid)
        {
            let key: string = `${id.level}p${id.index}`;

            switch(key)
            {
                case '3p1':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.enumProperty);
                case '3p2':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.stringProperty);
                case '3p3':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.numberProperty);
                case '3p4':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.booleanProperty);
                case '3p5':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.objectProperty);
                case '3p6':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.methodNoArgsCount);
                case '3p7':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.methodSimpleArgsCount);
                case '3p8':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.methodObjectArgCount);
                case '3p9':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.stringSequence);
                case '3p10':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.booleanSequence);
                case '3p11':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.enumSequence);
                case '3p12':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.numberSequence);
                case '3p13':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.objectSequence);
                default:
                    return super.Get(oid, id, handle);
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
                    this.enumProperty = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.enumProperty, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                case '3p2':
                    this.stringProperty = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.stringProperty, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                case '3p3':
                    this.numberProperty = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.numberProperty, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                case '3p4':
                    this.booleanProperty = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.booleanProperty, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                case '3p5':
                    this.objectProperty = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.objectProperty, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                case '3p6':
                case '3p7':
                case '3p8':
                        return new CommandResponseError(handle, NcMethodStatus.Readonly, "Property is read only");
                case '3p9':
                    this.stringSequence = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.stringSequence, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                case '3p10':
                    this.booleanSequence = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.booleanSequence, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                case '3p11':
                    this.enumSequence = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.enumSequence, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                case '3p12':
                    this.numberSequence = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.numberSequence, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                case '3p13':
                    this.objectSequence = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.objectSequence, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                default:
                    return super.Set(oid, id, value, handle);
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
                                        case '3p9':
                                            {
                                                let itemValue = this.stringSequence[index];
                                                if(itemValue)
                                                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, itemValue);
                                                else
                                                    return new CommandResponseError(handle, NcMethodStatus.IndexOutOfBounds, 'Index could not be found');
                                            }
                                        case '3p10':
                                            {
                                                let itemValue = this.booleanSequence[index];
                                                if( typeof itemValue === 'undefined' || itemValue === null )
                                                    return new CommandResponseError(handle, NcMethodStatus.IndexOutOfBounds, 'Index could not be found');
                                                else
                                                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, itemValue);
                                            }
                                        case '3p11':
                                            {
                                                let itemValue = this.enumSequence[index];
                                                if(itemValue)
                                                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, itemValue);
                                                else
                                                    return new CommandResponseError(handle, NcMethodStatus.IndexOutOfBounds, 'Index could not be found');
                                            }
                                        case '3p12':
                                            {
                                                let itemValue = this.numberSequence[index];
                                                if(itemValue !== undefined)
                                                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, itemValue);
                                                else
                                                    return new CommandResponseError(handle, NcMethodStatus.IndexOutOfBounds, 'Index could not be found');
                                            }
                                        case '3p13':
                                            {
                                                let itemValue = this.objectSequence[index];
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
                            let index = args['index'] as number;

                            if(propertyId)
                            {
                                if(index >= 0)
                                {
                                    let propertyKey: string = `${propertyId.level}p${propertyId.index}`;

                                    switch(propertyKey)
                                    {
                                        case '3p9':
                                            {
                                                if (this.stringSequence[index] !== undefined) 
                                                {
                                                    let value = args['value'] as string;
                                                    if(value !== undefined)
                                                    {
                                                        this.stringSequence[index] = value;
                                                        this.notificationContext.NotifyPropertyChanged(this.oid, propertyId, NcPropertyChangeType.SequenceItemChanged, value, index);
    
                                                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                                                    }
                                                    else
                                                        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid value argument provided');
                                                }
                                                else
                                                    return new CommandResponseError(handle, NcMethodStatus.IndexOutOfBounds, 'Index could not be found');
                                            }
                                        case '3p10':
                                            {
                                                if (this.booleanSequence[index] !== undefined) 
                                                {
                                                    let value = args['value'] as boolean;
                                                    if(value !== undefined)
                                                    {
                                                        this.booleanSequence[index] = value;
                                                        this.notificationContext.NotifyPropertyChanged(this.oid, propertyId, NcPropertyChangeType.SequenceItemChanged, value, index);
    
                                                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                                                    }
                                                    else
                                                        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid value argument provided');
                                                }
                                                else
                                                    return new CommandResponseError(handle, NcMethodStatus.IndexOutOfBounds, 'Index could not be found');
                                            }
                                        case '3p11':
                                            {
                                                if (this.enumSequence[index] !== undefined) 
                                                {
                                                    let value = args['value'] as ExampleEnum;
                                                    if(value !== undefined)
                                                    {
                                                        this.enumSequence[index] = value;
                                                        this.notificationContext.NotifyPropertyChanged(this.oid, propertyId, NcPropertyChangeType.SequenceItemChanged, value, index);
    
                                                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                                                    }
                                                    else
                                                        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid value argument provided');
                                                }
                                                else
                                                    return new CommandResponseError(handle, NcMethodStatus.IndexOutOfBounds, 'Index could not be found');
                                            }
                                        case '3p12':
                                            {
                                                if (this.numberSequence[index] !== undefined) 
                                                {
                                                    let value = args['value'] as number;
                                                    if(value !== undefined)
                                                    {
                                                        this.numberSequence[index] = value;
                                                        this.notificationContext.NotifyPropertyChanged(this.oid, propertyId, NcPropertyChangeType.SequenceItemChanged, value, index);
    
                                                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                                                    }
                                                    else
                                                        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid value argument provided');
                                                }
                                                else
                                                    return new CommandResponseError(handle, NcMethodStatus.IndexOutOfBounds, 'Index could not be found');
                                            }
                                        case '3p13':
                                            {
                                                if (this.objectSequence[index] !== undefined) 
                                                {
                                                    let value = args['value'] as ExampleDataType;
                                                    if(value !== undefined)
                                                    {
                                                        this.objectSequence[index] = value;
                                                        this.notificationContext.NotifyPropertyChanged(this.oid, propertyId, NcPropertyChangeType.SequenceItemChanged, value, index);

                                                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                                                    }
                                                    else
                                                        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid value argument provided');
                                                }
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

                                switch(propertyKey)
                                {
                                    case '3p9':
                                        {
                                            let value = args['value'] as string;
                                            if(value !== undefined)
                                            {
                                                this.stringSequence.push(value);
                                                let index = this.stringSequence.length - 1;

                                                this.notificationContext.NotifyPropertyChanged(this.oid, propertyId, NcPropertyChangeType.SequenceItemAdded, value, index);

                                                return new CommandResponseWithValue(handle, NcMethodStatus.OK, index);
                                            }
                                            else
                                                return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid value argument provided');
                                        }
                                    case '3p10':
                                        {
                                            let value = args['value'] as boolean;
                                            if(value !== undefined)
                                            {
                                                this.booleanSequence.push(value);
                                                let index = this.booleanSequence.length - 1;

                                                this.notificationContext.NotifyPropertyChanged(this.oid, propertyId, NcPropertyChangeType.SequenceItemAdded, value, index);

                                                return new CommandResponseWithValue(handle, NcMethodStatus.OK, index);
                                            }
                                            else
                                                return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid value argument provided');
                                        }
                                    case '3p11':
                                        {
                                            let value = args['value'] as ExampleEnum;
                                            if(value !== undefined)
                                            {
                                                this.enumSequence.push(value);
                                                let index = this.enumSequence.length - 1;

                                                this.notificationContext.NotifyPropertyChanged(this.oid, propertyId, NcPropertyChangeType.SequenceItemAdded, value, index);

                                                return new CommandResponseWithValue(handle, NcMethodStatus.OK, index);
                                            }
                                            else
                                                return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid value argument provided');
                                        }
                                    case '3p12':
                                        {
                                            let value = args['value'] as number;
                                            if(value !== undefined)
                                            {
                                                this.numberSequence.push(value);
                                                let index = this.numberSequence.length - 1;

                                                this.notificationContext.NotifyPropertyChanged(this.oid, propertyId, NcPropertyChangeType.SequenceItemAdded, value, index);

                                                return new CommandResponseWithValue(handle, NcMethodStatus.OK, index);
                                            }
                                            else
                                                return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid value argument provided');
                                        }
                                    case '3p13':
                                        {
                                            let value = args['value'] as ExampleDataType;
                                            if(value !== undefined)
                                            {
                                                this.objectSequence.push(value);
                                                let index = this.objectSequence.length - 1;

                                                this.notificationContext.NotifyPropertyChanged(this.oid, propertyId, NcPropertyChangeType.SequenceItemAdded, value, index);

                                                return new CommandResponseWithValue(handle, NcMethodStatus.OK, index);
                                            }
                                            else
                                                return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid value argument provided');
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
                case '1m6': //RemoveSequenceItem
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
                                        case '3p9':
                                            {
                                                if (this.stringSequence[index] !== undefined) 
                                                {
                                                    let oldValue = this.stringSequence[index];

                                                    this.stringSequence.splice(index, 1);
                                                    this.notificationContext.NotifyPropertyChanged(this.oid, propertyId, NcPropertyChangeType.SequenceItemRemoved, oldValue, index);

                                                    return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                                                }
                                                else
                                                    return new CommandResponseError(handle, NcMethodStatus.IndexOutOfBounds, 'Index could not be found');
                                            }
                                        case '3p10':
                                            {
                                                if (this.booleanSequence[index] !== undefined) 
                                                {
                                                    let oldValue = this.booleanSequence[index];

                                                    this.booleanSequence.splice(index, 1);
                                                    this.notificationContext.NotifyPropertyChanged(this.oid, propertyId, NcPropertyChangeType.SequenceItemRemoved, oldValue, index);

                                                    return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                                                }
                                                else
                                                    return new CommandResponseError(handle, NcMethodStatus.IndexOutOfBounds, 'Index could not be found');
                                            }
                                        case '3p11':
                                            {
                                                if (this.enumSequence[index] !== undefined) 
                                                {
                                                    let oldValue = this.enumSequence[index];

                                                    this.enumSequence.splice(index, 1);
                                                    this.notificationContext.NotifyPropertyChanged(this.oid, propertyId, NcPropertyChangeType.SequenceItemRemoved, oldValue, index);

                                                    return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                                                }
                                                else
                                                    return new CommandResponseError(handle, NcMethodStatus.IndexOutOfBounds, 'Index could not be found');
                                            }
                                        case '3p12':
                                            {
                                                if (this.numberSequence[index] !== undefined) 
                                                {
                                                    let oldValue = this.numberSequence[index];

                                                    this.numberSequence.splice(index, 1);
                                                    this.notificationContext.NotifyPropertyChanged(this.oid, propertyId, NcPropertyChangeType.SequenceItemRemoved, oldValue, index);

                                                    return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                                                }
                                                else
                                                    return new CommandResponseError(handle, NcMethodStatus.IndexOutOfBounds, 'Index could not be found');
                                            }
                                        case '3p13':
                                            {
                                                if (this.objectSequence[index] !== undefined) 
                                                {
                                                    let oldValue = this.objectSequence[index];

                                                    this.objectSequence.splice(index, 1);
                                                    this.notificationContext.NotifyPropertyChanged(this.oid, propertyId, NcPropertyChangeType.SequenceItemRemoved, oldValue, index);

                                                    return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                                                }
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
                                    case '3p9':
                                        {
                                            let length = this.stringSequence.length;

                                            return new CommandResponseWithValue(handle, NcMethodStatus.OK, length);
                                        }
                                    case '3p10':
                                        {
                                            let length = this.booleanSequence.length;

                                            return new CommandResponseWithValue(handle, NcMethodStatus.OK, length);
                                        }
                                    case '3p11':
                                        {
                                            let length = this.enumSequence.length;

                                            return new CommandResponseWithValue(handle, NcMethodStatus.OK, length);
                                        }
                                    case '3p12':
                                        {
                                            let length = this.numberSequence.length;

                                            return new CommandResponseWithValue(handle, NcMethodStatus.OK, length);
                                        }
                                    case '3p13':
                                        {
                                            let length = this.objectSequence.length;

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
                        this.methodNoArgsCount = this.methodNoArgsCount + 1;
                        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 6), NcPropertyChangeType.ValueChanged, this.methodNoArgsCount, null);
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    }
                case '3m2':
                    {
                        if(args != null &&
                            'enumArg' in args &&
                            'stringArg' in args &&
                            'numberArg' in args &&
                            'booleanArg' in args)
                        {
                            let enumArg = args['enumArg'] as ExampleEnum;
                            let stringArg = args['stringArg'] as string;
                            let numberArg = args['numberArg'] as number;
                            let booleanArg = args['booleanArg'] as boolean;

                            if(enumArg in ExampleEnum)
                            {
                                if(stringArg)
                                {
                                    if(numberArg && numberArg > 0)
                                    {
                                        if(booleanArg !== null)
                                        {
                                            this.methodSimpleArgsCount = this.methodSimpleArgsCount + 1;
                                            this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 7), NcPropertyChangeType.ValueChanged, this.methodSimpleArgsCount, null);
                                            return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                                        }
                                        else
                                            return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid booleanArg argument provided');
                                    }
                                    else
                                        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid numberArg argument provided');
                                }
                                else
                                    return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid stringArg argument provided');
                            }
                            else
                                return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid enumArg argument provided');
                        }
                        else
                            return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid arguments provided');
                    }
                case '3m3':
                    {
                        if(args != null &&
                            'objArg' in args)
                        {
                            let objArg = args['objArg'] as ExampleDataType;
                            if(objArg)
                            {
                                this.methodObjectArgCount = this.methodObjectArgCount + 1;
                                this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 8), NcPropertyChangeType.ValueChanged, this.methodObjectArgCount, null);
                                return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                            }
                            else
                                return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid objArg argument provided');
                        }
                        else
                            return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid arguments provided');
                    }
                default:
                    return super.InvokeMethod(oid, methodId, args, handle);
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.BadOid, 'OID could not be found');
    }

    public static override GetClassDescriptor(includeInherited: boolean): NcClassDescriptor 
    {
        let currentClassDescriptor = new NcClassDescriptor(`${ExampleControl.name} class descriptor`,
            ExampleControl.staticClassID, ExampleControl.name, null,
            [
                new NcPropertyDescriptor(new NcElementId(3, 1), "enumProperty", "ExampleEnum", false, false, false, null, "Example enum property"),
                new NcPropertyDescriptor(new NcElementId(3, 2), "stringProperty", "NcString", false, false, false, new NcParameterConstraintsString(10, null),
                    "Example string property"),
                new NcPropertyDescriptor(new NcElementId(3, 3), "numberProperty", "NcUint64", false, false, false, new NcParameterConstraintsNumber(1000, 0, 1, 3),
                    "Example numeric property"),
                new NcPropertyDescriptor(new NcElementId(3, 4), "booleanProperty", "NcBoolean", false, false, false, null, "Example boolean property"),
                new NcPropertyDescriptor(new NcElementId(3, 5), "objectProperty", "ExampleDataType", false, false, false, null, "Example object property"),
                new NcPropertyDescriptor(new NcElementId(3, 6), "methodNoArgsCount", "NcUint64", true, false, false, null, "Method no args invoke counter"),
                new NcPropertyDescriptor(new NcElementId(3, 7), "methodSimpleArgsCount", "NcUint64", true, false, false, null, "Method simple args invoke counter"),
                new NcPropertyDescriptor(new NcElementId(3, 8), "methodObjectArgCount", "NcUint64", true, false, false, null, "Method obj arg invoke counter"),
                new NcPropertyDescriptor(new NcElementId(3, 9), "stringSequence", "NcString", false, false, true, null, "Example string sequence property"),
                new NcPropertyDescriptor(new NcElementId(3, 10), "booleanSequence", "NcBoolean", false, false, true, null, "Example boolean sequence property"),
                new NcPropertyDescriptor(new NcElementId(3, 11), "enumSequence", "ExampleEnum", false, false, true, null, "Example enum sequence property"),
                new NcPropertyDescriptor(new NcElementId(3, 12), "numberSequence", "NcUint64", false, false, true, null, "Example number sequence property"),
                new NcPropertyDescriptor(new NcElementId(3, 13), "objectSequence", "ExampleDataType", false, false, true, null, "Example object sequence property")
            ],
            [
                new NcMethodDescriptor(new NcElementId(3, 1), "MethodNoArgs", "NcMethodResult", [], "Example method with no arguments"),
                new NcMethodDescriptor(new NcElementId(3, 2), "MethodSimpleArgs", "NcMethodResult", [
                    new NcParameterDescriptor("enumArg", "ExampleEnum", false, false, null, "Enum example argument"),
                    new NcParameterDescriptor("stringArg", "NcString", false, false, new NcParameterConstraintsString(10, null), "String example argument"),
                    new NcParameterDescriptor("numberArg", "NcUint64", false, false, new NcParameterConstraintsNumber(1000, 0, 1),
                    "Number example argument"),
                    new NcParameterDescriptor("booleanArg", "NcBoolean", false, false, null, "Boolean example argument")
                ], "Example method with simple arguments"),
                new NcMethodDescriptor(new NcElementId(3, 3), "MethodObjectArg", "NcMethodResult", [
                    new NcParameterDescriptor("objArg", "ExampleDataType", false, false, null, "Object example argument")
                ], "Example method with object argument")
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
            new NcObjectPropertiesHolder(this.GetRolePath(), [
                new NcPropertyValueHolder(new NcPropertyId(3, 1), "enumProperty", this.enumProperty),
                new NcPropertyValueHolder(new NcPropertyId(3, 2), "stringProperty", this.stringProperty),
                new NcPropertyValueHolder(new NcPropertyId(3, 3), "numberProperty", this.numberProperty),
                new NcPropertyValueHolder(new NcPropertyId(3, 4), "booleanProperty", this.booleanProperty),
                new NcPropertyValueHolder(new NcPropertyId(3, 5), "objectProperty", this.objectProperty),
                new NcPropertyValueHolder(new NcPropertyId(3, 6), "methodNoArgsCount", this.methodNoArgsCount),
                new NcPropertyValueHolder(new NcPropertyId(3, 7), "methodSimpleArgsCount", this.methodSimpleArgsCount),
                new NcPropertyValueHolder(new NcPropertyId(3, 8), "methodObjectArgCount", this.methodObjectArgCount),
                new NcPropertyValueHolder(new NcPropertyId(3, 9), "stringSequence", this.stringSequence),
                new NcPropertyValueHolder(new NcPropertyId(3, 10), "booleanSequence", this.booleanSequence),
                new NcPropertyValueHolder(new NcPropertyId(3, 11), "enumSequence", this.enumSequence),
                new NcPropertyValueHolder(new NcPropertyId(3, 12), "numberSequence", this.numberSequence),
                new NcPropertyValueHolder(new NcPropertyId(3, 13), "objectSequence", this.objectSequence),
            ], false)
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
                let propertyId = NcElementId.ToPropertyString(propertyData.propertyId);
                if(propertyId != '1p6' && propertyId != '3p1' && propertyId != '3p2' && propertyId != '3p3' && propertyId != '3p4' && propertyId != '3p5' &&
                    propertyId != '3p9' && propertyId != '3p10' && propertyId != '3p11' && propertyId != '3p12' && propertyId != '3p13')
                    myNotices.push(new NcPropertyRestoreNotice(
                        propertyData.propertyId,
                        propertyData.propertyName,
                        NcPropertyRestoreNoticeType.Warning,
                        "Property cannot be changed and will be left untouched"));
                else if(applyChanges)
                {
                    //Perform further validation
                    this.Set(this.oid, propertyData.propertyId, propertyData.value, 0);
                }
            });

            validationEntries.push(new NcObjectPropertiesSetValidation(this.GetRolePath(), NcRestoreValidationStatus.Ok, myNotices, myNotices.length > 0 ? 'Some properties have notices' : null));
        }

        return validationEntries;
    }
}