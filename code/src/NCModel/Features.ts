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
    NcMethodResult,
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
        notificationContext: INotificationContext,
        isRebuildable: boolean = false)
    {
        super(oid, constantOid, ownerObject, role, userLabel, touchpoints, runtimePropertyConstraints, description, notificationContext, isRebuildable);

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
            ], this.isRebuildable)
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
            ], this.isRebuildable)
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
    public static staticClassID: number[] = [ 1, 2, 1 ];

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
            ], this.isRebuildable)
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

enum NcOverallStatus
{
    Inactive = 0,
    Healthy = 1,
    PartiallyHealthy = 2,
    Unhealthy = 3
}

export class NcStatusMonitor extends NcWorker
{
    public static staticClassID: number[] = [ 1, 2, 2 ];

    @myIdDecorator('1p1')
    public override classID: number[] = NcStatusMonitor.staticClassID;

    @myIdDecorator('3p1')
    public overallStatus: NcOverallStatus;

    @myIdDecorator('3p2')
    public overallStatusMessage: string | null;

    @myIdDecorator('3p3')
    public statusReportingDelay: number;

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

        this.overallStatus = NcOverallStatus.Inactive;
        this.overallStatusMessage = "Receiver is inactive";
        this.statusReportingDelay = 3;
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
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.overallStatus);
                case '3p2':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.overallStatusMessage);
                case '3p3':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.statusReportingDelay);
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
                    return new CommandResponseError(handle, NcMethodStatus.Readonly, 'Property is readonly');
                case '3p3':
                    this.statusReportingDelay = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.statusReportingDelay, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK);
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
                new NcPropertyDescriptor(new NcElementId(3, 1), "overallStatus", "NcOverallStatus", true, false, false, null, "Overall status property"),
                new NcPropertyDescriptor(new NcElementId(3, 2), "overallStatusMessage", "NcString", true, true, false, null, "Overall status message property"),
                new NcPropertyDescriptor(new NcElementId(3, 3), "statusReportingDelay", "NcUint32", false, false, false, null, "Status reporting delay property (in seconds, default is 3s and 0 means no delay)"),
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
                new NcPropertyValueHolder(new NcPropertyId(3, 1), "overallStatus", this.overallStatus),
                new NcPropertyValueHolder(new NcPropertyId(3, 2), "overallStatusMessage", this.overallStatusMessage),
                new NcPropertyValueHolder(new NcPropertyId(3, 3), "statusReportingDelay", this.statusReportingDelay)
            ], this.isRebuildable)
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

enum NcLinkStatus
{
    AllUp = 1,
    SomeDown = 2,
    AllDown = 3
}

enum NcConnectionStatus
{
    Inactive = 0,
    Healthy = 1,
    PartiallyHealthy = 2,
    Unhealthy = 3
}

enum NcSynchronizationStatus
{
    NotUsed = 0,
    Healthy = 1,
    PartiallyHealthy = 2,
    Unhealthy = 3
}

enum NcStreamStatus
{
    Inactive = 0,
    Healthy = 1,
    PartiallyHealthy = 2,
    Unhealthy = 3
}

function DelayTask(timeMs: number | undefined) 
{
    return new Promise(resolve => setTimeout(resolve, timeMs));
}

export class NcCounter extends BaseType
{
    public name: string;
    public value: number;
    public description: string | null;

    constructor(
        name: string,
        value: number,
        description: string | null) 
    {
        super();

        this.name = name;
        this.value = value;
        this.description = description;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("NcCounter", [
            new NcFieldDescriptor("name", "NcString", false, false, null, "Counter name"),
            new NcFieldDescriptor("value", "NcUint64", false, false, null, "Counter value"),
            new NcFieldDescriptor("description", "NcString", true, false, null, "Optional counter description")
        ], null, null, "Counter data type");
    }

    public Increment()
    {
        this.value++;
    }

    public Reset()
    {
        this.value = 0;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcMethodResultCounters extends NcMethodResult
{
    public value: NcCounter[];

    public constructor(
        status: NcMethodStatus,
        value: NcCounter[])
    {
        super(status);

        this.value = value;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        let currentClassDescriptor = new NcDatatypeDescriptorStruct("NcMethodResultCounters", [
            new NcFieldDescriptor("value", "NcCounter", false, true, null, "Counters")
        ], "NcMethodResult", null, "Counters method result")

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

export class NcReceiverMonitor extends NcStatusMonitor
{
    public static staticClassID: number[] = [ 1, 2, 2, 1 ];

    @myIdDecorator('1p1')
    public override classID: number[] = NcReceiverMonitor.staticClassID;

    @myIdDecorator('4p1')
    public linkStatus: NcLinkStatus;

    @myIdDecorator('4p2')
    public linkStatusMessage: string | null;

    @myIdDecorator('4p3')
    public connectionStatus: NcConnectionStatus;

    @myIdDecorator('4p4')
    public connectionStatusMessage: string | null;

    @myIdDecorator('4p5')
    public externalSynchronizationStatus: NcSynchronizationStatus;

    @myIdDecorator('4p6')
    public externalSynchronizationStatusMessage: string | null;

    @myIdDecorator('4p7')
    public synchronizationSourceId: string | null;

    @myIdDecorator('4p8')
    public synchronizationSourceChanges: number;

    @myIdDecorator('4p9')
    public streamStatus: NcStreamStatus;

    @myIdDecorator('4p10')
    public streamStatusMessage: string | null;

    @myIdDecorator('4p11')
    public autoResetPacketCounters: boolean;

    private lostPacketCounters: NcCounter[];
    private latePacketCounters: NcCounter[];

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

        this.linkStatus = NcLinkStatus.AllUp;
        this.linkStatusMessage = "All interfaces are up";

        this.connectionStatus = NcConnectionStatus.Inactive;
        this.connectionStatusMessage = "Receiver is inactive";

        this.lostPacketCounters = [
            new NcCounter("Nic_1", 0, "Lost packets on Nic 1"),
            new NcCounter("Nic_2", 0, "Lost packets on Nic 2"),
        ];

        this.latePacketCounters = [
            new NcCounter("Nic_1", 0, "Late packets on Nic 1"),
            new NcCounter("Nic_2", 0, "Late packets on Nic 2"),
        ];
        
        this.externalSynchronizationStatus = NcSynchronizationStatus.Healthy;
        this.externalSynchronizationStatusMessage = "Locked to grandmaster";
        this.synchronizationSourceId = "0xD4:AD:71:FF:FE:6F:E2:80";
        this.synchronizationSourceChanges = 0;

        this.streamStatus = NcStreamStatus.Inactive;
        this.streamStatusMessage = "Receiver is inactive";

        this.autoResetPacketCounters = true;
    }

    public Connected()
    {
        this.overallStatus = NcOverallStatus.Healthy;
        this.overallStatusMessage = "Receiver is connected and healthy";

        this.connectionStatus = NcConnectionStatus.Healthy;
        this.connectionStatusMessage = "Receiver is connected and connection is healthy";

        this.streamStatus = NcStreamStatus.Healthy;
        this.streamStatusMessage = "Receiver is connected and stream is healthy";

        if(this.autoResetPacketCounters)
        {
            this.lostPacketCounters.forEach(counter => {
                counter.Reset();
            });

            this.latePacketCounters.forEach(counter => {
                counter.Reset();
            });
        }

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 1), NcPropertyChangeType.ValueChanged, this.overallStatus, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 2), NcPropertyChangeType.ValueChanged, this.overallStatusMessage, null);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 3), NcPropertyChangeType.ValueChanged, this.connectionStatus, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 4), NcPropertyChangeType.ValueChanged, this.connectionStatusMessage, null);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 9), NcPropertyChangeType.ValueChanged, this.streamStatus, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 10), NcPropertyChangeType.ValueChanged, this.streamStatusMessage, null);

        DelayTask(1000 * this.statusReportingDelay).then(() => this.StreamBroken());
    }

    public StreamBroken()
    {
        if(this.overallStatus != NcOverallStatus.Inactive)
        {
            this.overallStatus = NcOverallStatus.Unhealthy;
            this.overallStatusMessage = "Receiver connectivity is experiencing severe issues";
    
            this.connectionStatus = NcConnectionStatus.Unhealthy;
            this.connectionStatusMessage = "Significant packet loss detected";

            this.streamStatus = NcStreamStatus.Unhealthy;
            this.streamStatusMessage = "Stream cannot be decoded";

            this.lostPacketCounters.find(c => c.name === 'Nic_1')?.Increment();
            this.latePacketCounters.find(c => c.name === 'Nic_2')?.Increment();
    
            this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 1), NcPropertyChangeType.ValueChanged, this.overallStatus, null);
            this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 2), NcPropertyChangeType.ValueChanged, this.overallStatusMessage, null);

            this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 3), NcPropertyChangeType.ValueChanged, this.connectionStatus, null);
            this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 4), NcPropertyChangeType.ValueChanged, this.connectionStatusMessage, null);
    
            this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 9), NcPropertyChangeType.ValueChanged, this.streamStatus, null);
            this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 10), NcPropertyChangeType.ValueChanged, this.streamStatusMessage, null);

            DelayTask(1000 * this.statusReportingDelay).then(() => this.StreamFixed());
        }
    }

    public StreamFixed()
    {
        if(this.overallStatus != NcOverallStatus.Inactive)
        {
            this.overallStatus = NcOverallStatus.Healthy;
            this.overallStatusMessage = "Receiver is connected and healthy";

            this.connectionStatus = NcConnectionStatus.Healthy;
            this.connectionStatusMessage = "Receiver is connected and connection is healthy";
    
            this.streamStatus = NcStreamStatus.Healthy;
            this.streamStatusMessage = "Receiver is connected and stream is healthy";
    
            this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 1), NcPropertyChangeType.ValueChanged, this.overallStatus, null);
            this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 2), NcPropertyChangeType.ValueChanged, this.overallStatusMessage, null);
    
            this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 3), NcPropertyChangeType.ValueChanged, this.connectionStatus, null);
            this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 4), NcPropertyChangeType.ValueChanged, this.connectionStatusMessage, null);

            this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 9), NcPropertyChangeType.ValueChanged, this.streamStatus, null);
            this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 10), NcPropertyChangeType.ValueChanged, this.streamStatusMessage, null);
        }
    }

    public Disconnected()
    {
        this.overallStatus = NcOverallStatus.Inactive;
        this.overallStatusMessage = "Receiver is inactive";

        this.connectionStatus = NcConnectionStatus.Inactive;
        this.connectionStatusMessage = "Receiver is inactive";

        this.streamStatus = NcStreamStatus.Inactive;
        this.streamStatusMessage = "Receiver is inactive";

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 1), NcPropertyChangeType.ValueChanged, this.overallStatus, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 2), NcPropertyChangeType.ValueChanged, this.overallStatusMessage, null);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 3), NcPropertyChangeType.ValueChanged, this.connectionStatus, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 4), NcPropertyChangeType.ValueChanged, this.connectionStatusMessage, null);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 9), NcPropertyChangeType.ValueChanged, this.streamStatus, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 10), NcPropertyChangeType.ValueChanged, this.streamStatusMessage, null);
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
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.linkStatus);
                case '4p2':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.linkStatusMessage);
                case '4p3':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.connectionStatus);
                case '4p4':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.connectionStatusMessage);
                case '4p5':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.externalSynchronizationStatus);
                case '4p6':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.externalSynchronizationStatusMessage);
                case '4p7':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.synchronizationSourceId);
                case '4p8':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.synchronizationSourceChanges);
                case '4p9':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.streamStatus);
                case '4p10':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.streamStatusMessage);
                case '4p11':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.autoResetPacketCounters);
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
                case '2p1':
                    if(value === true)
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    else
                        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, "Receiver monitors cannot be disabled");
                case '4p1':
                case '4p2':
                case '4p3':
                case '4p4':
                case '4p5':
                case '4p6':
                case '4p7':
                case '4p8':
                case '4p9':
                case '4p10':
                    return new CommandResponseError(handle, NcMethodStatus.Readonly, 'Property is readonly');
                case '4p11':
                    this.autoResetPacketCounters = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.autoResetPacketCounters, null);
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
                case '4m1':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.lostPacketCounters);
                case '4m2':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.latePacketCounters);
                case '4m3':
                    this.ResetPacketCounters();
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                case '4m4':
                    this.ResetSynchronizationSourceChanges();
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                default:
                    return super.InvokeMethod(oid, methodId, args, handle);

            }
        }

        return new CommandResponseError(handle, NcMethodStatus.BadOid, 'OID could not be found');
    }

    private ResetPacketCounters()
    {
        this.lostPacketCounters.forEach(counter => {
            counter.Reset();
        });

        this.latePacketCounters.forEach(counter => {
            counter.Reset();
        });
    }

    private ResetSynchronizationSourceChanges()
    {
        this.synchronizationSourceChanges = 0;
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 8), NcPropertyChangeType.ValueChanged, this.synchronizationSourceChanges, null);
    }

    public static override GetClassDescriptor(includeInherited: boolean): NcClassDescriptor 
    {
        let currentClassDescriptor = new NcClassDescriptor(`${NcReceiverMonitor.name} class descriptor`,
            NcReceiverMonitor.staticClassID, NcReceiverMonitor.name, null,
            [
                new NcPropertyDescriptor(new NcElementId(4, 1), "linkStatus", "NcLinkStatus", true, false, false, null, "Link status property"),
                new NcPropertyDescriptor(new NcElementId(4, 2), "linkStatusMessage", "NcString", true, true, false, null, "Link status message property"),
                new NcPropertyDescriptor(new NcElementId(4, 3), "connectionStatus", "NcConnectionStatus", true, false, false, null, "Connection status property"),
                new NcPropertyDescriptor(new NcElementId(4, 4), "connectionStatusMessage", "NcString", true, true, false, null, "Connection status message property"),
                new NcPropertyDescriptor(new NcElementId(4, 5), "externalSynchronizationStatus", "NcSynchronizationStatus", true, false, false, null, "External synchronization status property"),
                new NcPropertyDescriptor(new NcElementId(4, 6), "externalSynchronizationStatusMessage", "NcString", true, true, false, null, "External synchronization status message property"),
                new NcPropertyDescriptor(new NcElementId(4, 7), "synchronizationSourceId", "NcString", true, true, false, null, "Synchronization source id property"),
                new NcPropertyDescriptor(new NcElementId(4, 8), "synchronizationSourceChanges", "NcUint64", true, false, false, null, "Synchronization source changes counter"),
                new NcPropertyDescriptor(new NcElementId(4, 9), "streamStatus", "NcStreamStatus", true, false, false, null, "Stream status property"),
                new NcPropertyDescriptor(new NcElementId(4, 10), "streamStatusMessage", "NcString", true, true, false, null, "Stream status message property"),
                new NcPropertyDescriptor(new NcElementId(4, 11), "autoResetPacketCounters", "NcBoolean", false, false, false, null, "Automatic reset packet counters property (default: true)")
            ],
            [
                new NcMethodDescriptor(new NcElementId(4, 1), "GetLostPacketCounters", "NcMethodResultCounters", [], "Gets the lost packet counters"),
                new NcMethodDescriptor(new NcElementId(4, 2), "GetLatePacketCounters", "NcMethodResultCounters", [], "Gets the late packet counters"),
                new NcMethodDescriptor(new NcElementId(4, 3), "ResetPacketCounters", "NcMethodResult", [], "Resets the packet counters"),
                new NcMethodDescriptor(new NcElementId(4, 4), "ResetSynchronizationSourceChanges", "NcMethodResult", [], "Resets the synchronization source changes counter property")
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
                new NcPropertyValueHolder(new NcPropertyId(4, 1), "linkStatus", this.linkStatus),
                new NcPropertyValueHolder(new NcPropertyId(4, 2), "linkStatusMessage", this.linkStatusMessage),
                new NcPropertyValueHolder(new NcPropertyId(4, 3), "connectionStatus", this.connectionStatus),
                new NcPropertyValueHolder(new NcPropertyId(4, 4), "connectionStatusMessage", this.connectionStatusMessage),
                new NcPropertyValueHolder(new NcPropertyId(4, 5), "externalSynchronizationStatus", this.externalSynchronizationStatus),
                new NcPropertyValueHolder(new NcPropertyId(4, 6), "externalSynchronizationStatusMessage", this.externalSynchronizationStatusMessage),
                new NcPropertyValueHolder(new NcPropertyId(4, 7), "synchronizationSourceId", this.synchronizationSourceId),
                new NcPropertyValueHolder(new NcPropertyId(4, 8), "synchronizationSourceChanges", this.synchronizationSourceChanges),
                new NcPropertyValueHolder(new NcPropertyId(4, 9), "streamStatus", this.streamStatus),
                new NcPropertyValueHolder(new NcPropertyId(4, 10), "streamStatusMessage", this.streamStatusMessage),
                new NcPropertyValueHolder(new NcPropertyId(4, 11), "autoResetPacketCounters", this.autoResetPacketCounters)
            ], this.isRebuildable)
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
        notificationContext: INotificationContext,
        isRebuildable: boolean = false)
    {
        super(oid, constantOid, ownerObject, role, userLabel, touchpoints, runtimePropertyConstraints, enabled, description, notificationContext, isRebuildable);

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
            ], this.isRebuildable)
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