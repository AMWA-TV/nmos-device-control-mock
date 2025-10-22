import { jsonIgnoreReplacer } from 'json-ignore';
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
    NcPropertyHolder,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public override Set(oid: number, id: NcElementId, value: any, handle: number) : CommandResponseNoValue
    {
        //NcWorker

        if(oid == this.oid)
        {
            let key: string = `${id.level}p${id.index}`;

            switch(key)
            {
                case '2p1':
                    if(value != null && value != undefined && typeof value === 'boolean')
                    {
                        this.enabled = value;
                        this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.enabled, null);
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    }
                    else
                        return new CommandResponseError(handle, NcMethodStatus.ParameterError, "Invalid property value");
                default:
                    return super.Set(oid, id, value, handle);
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.BadOid, 'OID could not be found');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public override SetValidate(oid: number, id: NcElementId, value: any, handle: number) : CommandResponseNoValue
    {
        //NcWorker

        if(oid == this.oid)
        {
            let key: string = `${id.level}p${id.index}`;

            switch(key)
            {
                case '2p1':
                    if(value != null && value != undefined && typeof value === 'boolean')
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    else
                        return new CommandResponseError(handle, NcMethodStatus.ParameterError, "Invalid property value");
                default:
                    return super.SetValidate(oid, id, value, handle);
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

    public override GetAllProperties(recurse: boolean, includeDescriptors: boolean) : NcObjectPropertiesHolder[]
    {
        let descriptor = NcWorker.GetClassDescriptor(false);
        var propDescriptors: { [id: string] : NcPropertyDescriptor; } = {};

        descriptor.properties.forEach(p => {
            propDescriptors[NcElementId.ToPropertyString(p.id)] = p;
        });

        let properties = [
            new NcObjectPropertiesHolder(this.GetRolePath(), [], [
                new NcPropertyHolder(new NcPropertyId(2, 1), includeDescriptors ? propDescriptors['2p1'] : null, this.enabled)
            ], [], this.isRebuildable)
        ];

        properties[0].values = properties[0].values.concat(super.GetAllProperties(recurse, includeDescriptors)[0].values);

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public override Set(oid: number, id: NcElementId, value: any, handle: number) : CommandResponseNoValue
    {
        //GainControl

        if(oid == this.oid)
        {
            let key: string = `${id.level}p${id.index}`;

            switch(key)
            {
                case '3p1':
                    if(value != null && value != undefined && typeof value === 'number')
                    {
                        this.gainValue = value;
                        this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.gainValue, null);
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    }
                    else
                        return new CommandResponseError(handle, NcMethodStatus.ParameterError, "Invalid property value");
                default:
                    return super.Set(oid, id, value, handle);
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.BadOid, 'OID could not be found');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public override SetValidate(oid: number, id: NcElementId, value: any, handle: number) : CommandResponseNoValue
    {
        //GainControl

        if(oid == this.oid)
        {
            let key: string = `${id.level}p${id.index}`;

            switch(key)
            {
                case '3p1':
                    if(value != null && value != undefined && typeof value === 'number')
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    else
                        return new CommandResponseError(handle, NcMethodStatus.ParameterError, "Invalid property value");
                default:
                    return super.SetValidate(oid, id, value, handle);
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

    public override GetAllProperties(recurse: boolean, includeDescriptors: boolean) : NcObjectPropertiesHolder[]
    {
        let descriptor = GainControl.GetClassDescriptor(false);
        var propDescriptors: { [id: string] : NcPropertyDescriptor; } = {};

        descriptor.properties.forEach(p => {
            propDescriptors[NcElementId.ToPropertyString(p.id)] = p;
        });

        let properties = [
            new NcObjectPropertiesHolder(this.GetRolePath(), [], [
                new NcPropertyHolder(new NcPropertyId(3, 1), includeDescriptors ? propDescriptors['3p1'] : null, this.gainValue)
            ], [], this.isRebuildable)
        ];

        properties[0].values = properties[0].values.concat(super.GetAllProperties(recurse, includeDescriptors)[0].values);

        return properties;
    }

    public override Restore(restoreArguments: RestoreArguments, applyChanges: boolean) : NcObjectPropertiesSetValidation[]
    {
        let validationEntries = new Array<NcObjectPropertiesSetValidation>();

        let localRolePath = this.GetRolePath().join('.');

        let myRestoreData = restoreArguments.dataSet.values.find(f => f.path.join('.') == localRolePath);
        if(myRestoreData)
        {
            console.log(`Found restore data for path: ${localRolePath}, applyChanges: ${applyChanges}`);

            let myNotices = new Array<NcPropertyRestoreNotice>();

            let descriptor = GainControl.GetClassDescriptor(true);
            var propDescriptors: { [id: string] : NcPropertyDescriptor; } = {};

            descriptor.properties.forEach(p => {
                propDescriptors[NcElementId.ToPropertyString(p.id)] = p;
            });

            myRestoreData.values.forEach(propertyData => {
                let propertyId = NcElementId.ToPropertyString(propertyData.id);

                //Perform further validation
                let response : CommandResponseNoValue | null = null;

                if(applyChanges)
                    response = this.Set(this.oid, propertyData.id, propertyData.value, 0);
                else
                    response = this.SetValidate(this.oid, propertyData.id, propertyData.value, 0);

                console.log(`Restore response for path: ${localRolePath}, id: ${propertyId}, name: ${propDescriptors[propertyId].name}, status: ${response.result['status']}, requested value: ${propertyData.value}`);

                if(response.result['status'] != NcMethodStatus.OK)
                {
                    let noticeMessage = "Property could not be changed due to internal error";

                    if(response.result['errorMessage'])
                        noticeMessage = response.result['errorMessage']

                    console.log(`Internal error notice for path: ${localRolePath}, id: ${propertyId}, name: ${propDescriptors[propertyId].name}, notice: ${noticeMessage}, requested value: ${propertyData.value}`);

                    myNotices.push(new NcPropertyRestoreNotice(
                        propertyData.id,
                        propDescriptors[propertyId].name,
                        NcPropertyRestoreNoticeType.Warning,
                        noticeMessage));
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public override Set(oid: number, id: NcElementId, value: any, handle: number) : CommandResponseNoValue
    {
        //NcIdentBeacon

        if(oid == this.oid)
        {
            let key: string = `${id.level}p${id.index}`;

            switch(key)
            {
                case '3p1':
                    if(value != null && value != undefined && typeof value === 'boolean')
                    {
                        this.active = value;
                        this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.active, null);
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    }
                    else
                        return new CommandResponseError(handle, NcMethodStatus.ParameterError, "Invalid property value");
                default:
                    return super.Set(oid, id, value, handle);
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.BadOid, 'OID could not be found');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public override SetValidate(oid: number, id: NcElementId, value: any, handle: number) : CommandResponseNoValue
    {
        //NcIdentBeacon

        if(oid == this.oid)
        {
            let key: string = `${id.level}p${id.index}`;

            switch(key)
            {
                case '3p1':
                    if(value != null && value != undefined && typeof value === 'boolean')
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    else
                        return new CommandResponseError(handle, NcMethodStatus.ParameterError, "Invalid property value");
                default:
                    return super.SetValidate(oid, id, value, handle);
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

    public override GetAllProperties(recurse: boolean, includeDescriptors: boolean) : NcObjectPropertiesHolder[]
    {
        let descriptor = NcIdentBeacon.GetClassDescriptor(false);
        var propDescriptors: { [id: string] : NcPropertyDescriptor; } = {};

        descriptor.properties.forEach(p => {
            propDescriptors[NcElementId.ToPropertyString(p.id)] = p;
        });

        let properties = [
            new NcObjectPropertiesHolder(this.GetRolePath(), [], [
                new NcPropertyHolder(new NcPropertyId(3, 1), includeDescriptors ? propDescriptors['3p1'] : null, this.active)
            ], [], this.isRebuildable)
        ];

        properties[0].values = properties[0].values.concat(super.GetAllProperties(recurse, includeDescriptors)[0].values);
        return properties;
    }

    public override Restore(restoreArguments: RestoreArguments, applyChanges: boolean) : NcObjectPropertiesSetValidation[]
    {
        let validationEntries = new Array<NcObjectPropertiesSetValidation>();

        let localRolePath = this.GetRolePath().join('.');

        let myRestoreData = restoreArguments.dataSet.values.find(f => f.path.join('.') == localRolePath);
        if(myRestoreData)
        {
            console.log(`Found restore data for path: ${localRolePath}, applyChanges: ${applyChanges}`);

            let myNotices = new Array<NcPropertyRestoreNotice>();

            let descriptor = NcIdentBeacon.GetClassDescriptor(true);
            var propDescriptors: { [id: string] : NcPropertyDescriptor; } = {};

            descriptor.properties.forEach(p => {
                propDescriptors[NcElementId.ToPropertyString(p.id)] = p;
            });

            myRestoreData.values.forEach(propertyData => {
                let propertyId = NcElementId.ToPropertyString(propertyData.id);

                //Perform further validation
                let response : CommandResponseNoValue | null = null;

                if(applyChanges)
                    response = this.Set(this.oid, propertyData.id, propertyData.value, 0);
                else
                    response = this.SetValidate(this.oid, propertyData.id, propertyData.value, 0);

                console.log(`Restore response for path: ${localRolePath}, id: ${propertyId}, name: ${propDescriptors[propertyId].name}, status: ${response.result['status']}, requested value: ${propertyData.value}`);

                if(response.result['status'] != NcMethodStatus.OK)
                {
                    let noticeMessage = "Property could not be changed due to internal error";

                    if(response.result['errorMessage'])
                        noticeMessage = response.result['errorMessage']

                    console.log(`Internal error notice for path: ${localRolePath}, id: ${propertyId}, name: ${propDescriptors[propertyId].name}, notice: ${noticeMessage}, requested value: ${propertyData.value}`);

                    myNotices.push(new NcPropertyRestoreNotice(
                        propertyData.id,
                        propDescriptors[propertyId].name,
                        NcPropertyRestoreNoticeType.Warning,
                        noticeMessage));
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public override Set(oid: number, id: NcElementId, value: any, handle: number) : CommandResponseNoValue
    {
        //NcStatusMonitor

        if(oid == this.oid)
        {
            let key: string = `${id.level}p${id.index}`;

            switch(key)
            {
                case '3p1':
                case '3p2':
                    return new CommandResponseError(handle, NcMethodStatus.Readonly, 'Property is readonly');
                case '3p3':
                    if(value != null && value != undefined && typeof value === 'number' && value >= 0)
                    {
                        this.statusReportingDelay = value;
                        this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.statusReportingDelay, null);
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    }
                    else
                        return new CommandResponseError(handle, NcMethodStatus.ParameterError, "Invalid property value");
                default:
                    return super.Set(oid, id, value, handle);
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.BadOid, 'OID could not be found');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public override SetValidate(oid: number, id: NcElementId, value: any, handle: number) : CommandResponseNoValue
    {
        //NcStatusMonitor

        if(oid == this.oid)
        {
            let key: string = `${id.level}p${id.index}`;

            switch(key)
            {
                case '3p1':
                case '3p2':
                    return new CommandResponseError(handle, NcMethodStatus.Readonly, 'Property is readonly');
                case '3p3':
                    if(value != null && value != undefined && typeof value === 'number' && value >= 0)
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    else
                        return new CommandResponseError(handle, NcMethodStatus.ParameterError, "Invalid property value");
                default:
                    return super.SetValidate(oid, id, value, handle);
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.BadOid, 'OID could not be found');
    }

    public static override GetClassDescriptor(includeInherited: boolean): NcClassDescriptor 
    {
        let currentClassDescriptor = new NcClassDescriptor(`${NcStatusMonitor.name} class descriptor`,
            NcStatusMonitor.staticClassID, NcStatusMonitor.name, null,
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

    public override GetAllProperties(recurse: boolean, includeDescriptors: boolean) : NcObjectPropertiesHolder[]
    {
        let descriptor = NcStatusMonitor.GetClassDescriptor(false);
        var propDescriptors: { [id: string] : NcPropertyDescriptor; } = {};

        descriptor.properties.forEach(p => {
            propDescriptors[NcElementId.ToPropertyString(p.id)] = p;
        });

        let properties = [
            new NcObjectPropertiesHolder(this.GetRolePath(), [], [
                new NcPropertyHolder(new NcPropertyId(3, 1), includeDescriptors ? propDescriptors['3p1'] : null, this.overallStatus),
                new NcPropertyHolder(new NcPropertyId(3, 2), includeDescriptors ? propDescriptors['3p2'] : null, this.overallStatusMessage),
                new NcPropertyHolder(new NcPropertyId(3, 3), includeDescriptors ? propDescriptors['3p3'] : null, this.statusReportingDelay)
            ], [], this.isRebuildable)
        ];

        properties[0].values = properties[0].values.concat(super.GetAllProperties(recurse, includeDescriptors)[0].values);

        return properties;
    }

    public override Restore(restoreArguments: RestoreArguments, applyChanges: boolean) : NcObjectPropertiesSetValidation[]
    {
        let validationEntries = new Array<NcObjectPropertiesSetValidation>();

        let localRolePath = this.GetRolePath().join('.');

        let myRestoreData = restoreArguments.dataSet.values.find(f => f.path.join('.') == localRolePath);
        if(myRestoreData)
        {
            console.log(`Found restore data for path: ${localRolePath}, applyChanges: ${applyChanges}`);

            let myNotices = new Array<NcPropertyRestoreNotice>();

            let descriptor = NcStatusMonitor.GetClassDescriptor(true);
            var propDescriptors: { [id: string] : NcPropertyDescriptor; } = {};

            descriptor.properties.forEach(p => {
                propDescriptors[NcElementId.ToPropertyString(p.id)] = p;
            });

            myRestoreData.values.forEach(propertyData => {
                let propertyId = NcElementId.ToPropertyString(propertyData.id);

                //Perform further validation
                let response : CommandResponseNoValue | null = null;

                if(applyChanges)
                    response = this.Set(this.oid, propertyData.id, propertyData.value, 0);
                else
                    response = this.SetValidate(this.oid, propertyData.id, propertyData.value, 0);

                console.log(`Restore response for path: ${localRolePath}, id: ${propertyId}, name: ${propDescriptors[propertyId].name}, status: ${response.result['status']}, requested value: ${propertyData.value}`);

                if(response.result['status'] != NcMethodStatus.OK)
                {
                    let noticeMessage = "Property could not be changed due to internal error";

                    if(response.result['errorMessage'])
                        noticeMessage = response.result['errorMessage']

                    console.log(`Internal error notice for path: ${localRolePath}, id: ${propertyId}, name: ${propDescriptors[propertyId].name}, notice: ${noticeMessage}, requested value: ${propertyData.value}`);

                    myNotices.push(new NcPropertyRestoreNotice(
                        propertyData.id,
                        propDescriptors[propertyId].name,
                        NcPropertyRestoreNoticeType.Warning,
                        noticeMessage));
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

enum NcTransmissionStatus
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

enum NcEssenceStatus
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

    public static override GetTypeDescriptor(_includeInherited: boolean): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("NcCounter", [
            new NcFieldDescriptor("name", "NcString", false, false, null, "Counter name"),
            new NcFieldDescriptor("value", "NcUint64", false, false, null, "Counter value"),
            new NcFieldDescriptor("description", "NcString", true, false, null, "Optional counter description")
        ], null, null, "Counter data type");
    }

    public Increment(incrementValue: number | null = null)
    {
        if(incrementValue != null)
            this.value = this.value + incrementValue;
        else
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

export interface IReceiverMonitoring
{
    SimulateNic1Down(): void;

    SimulateAllNicsDown(): void;

    SimulateFaultFixed(): void;

    SimulateGrandMasterChange(): void;

    activated: boolean;
}

export class NcReceiverMonitor extends NcStatusMonitor implements IReceiverMonitoring
{
    public static staticClassID: number[] = [ 1, 2, 2, 1 ];

    @myIdDecorator('1p1')
    public override classID: number[] = NcReceiverMonitor.staticClassID;

    @myIdDecorator('4p1')
    public linkStatus: NcLinkStatus;

    @myIdDecorator('4p2')
    public linkStatusMessage: string | null;

    @myIdDecorator('4p3')
    public linkStatusTransitionCounter: number;

    @myIdDecorator('4p4')
    public connectionStatus: NcConnectionStatus;

    @myIdDecorator('4p5')
    public connectionStatusMessage: string | null;

    @myIdDecorator('4p6')
    public connectionStatusTransitionCounter: number;

    @myIdDecorator('4p7')
    public externalSynchronizationStatus: NcSynchronizationStatus;

    @myIdDecorator('4p8')
    public externalSynchronizationStatusMessage: string | null;

    @myIdDecorator('4p9')
    public externalSynchronizationStatusTransitionCounter: number;

    @myIdDecorator('4p10')
    public synchronizationSourceId: string | null;

    @myIdDecorator('4p11')
    public streamStatus: NcStreamStatus;

    @myIdDecorator('4p12')
    public streamStatusMessage: string | null;

    @myIdDecorator('4p13')
    public streamStatusTransitionCounter: number;

    @myIdDecorator('4p14')
    public autoResetCountersAndMessages: boolean;

    private lostPacketCounters: NcCounter[];
    private latePacketCounters: NcCounter[];

    public activated: boolean;

    private readonly emulatedGM1 = "00:0c:ec:ff:fe:0a:2b:a1";
    private readonly emulatedGM2 = "ec:46:70:ff:fe:00:ff:a9";

    private monitorManager: IMonitorManager | null;

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

        this.activated = false;

        this.overallStatus = NcOverallStatus.Inactive;
        this.overallStatusMessage = null;

        this.linkStatus = NcLinkStatus.AllUp;
        this.linkStatusMessage = null;

        this.connectionStatus = NcConnectionStatus.Inactive;
        this.connectionStatusMessage = null;

        this.lostPacketCounters = [
            new NcCounter("Nic_1", 0, "Lost packets on Nic 1"),
            new NcCounter("Nic_2", 0, "Lost packets on Nic 2"),
        ];

        this.latePacketCounters = [
            new NcCounter("Nic_1", 0, "Late packets on Nic 1"),
            new NcCounter("Nic_2", 0, "Late packets on Nic 2"),
        ];
        
        this.externalSynchronizationStatus = NcSynchronizationStatus.Healthy;
        this.synchronizationSourceId = `${this.emulatedGM1} on NIC1`; //4p10
        this.externalSynchronizationStatusMessage = null; //4p8

        this.streamStatus = NcStreamStatus.Inactive;
        this.streamStatusMessage = null;

        this.linkStatusTransitionCounter = 0;
        this.connectionStatusTransitionCounter = 0;
        this.externalSynchronizationStatusTransitionCounter = 0;
        this.streamStatusTransitionCounter = 0;

        this.autoResetCountersAndMessages = true;

        this.monitorManager = null;
    }

    public SetMonitorManager(manager: IMonitorManager)
    {
        this.monitorManager = manager;
    }

    public Connected()
    {
        this.activated = true;

        this.overallStatus = NcOverallStatus.Healthy; //3p1

        this.connectionStatus = NcConnectionStatus.Healthy; //4p4

        this.streamStatus = NcStreamStatus.Healthy; //4p11
        
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 1), NcPropertyChangeType.ValueChanged, this.overallStatus, null);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 4), NcPropertyChangeType.ValueChanged, this.connectionStatus, null);
        
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 11), NcPropertyChangeType.ValueChanged, this.streamStatus, null);
        
        if(this.autoResetCountersAndMessages)
            this.ResetCountersAndMessages();
    }

    public Nic1Down(transitionFromUnhealthy: boolean = false)
    {
        this.overallStatus = NcOverallStatus.PartiallyHealthy; //3p1

        this.linkStatus = NcLinkStatus.SomeDown; //4p1
        this.linkStatusMessage = "NIC1 down"; //4p2
        if(!transitionFromUnhealthy)
            this.linkStatusTransitionCounter++; //4p3

        this.overallStatusMessage = this.linkStatusMessage; //3p2

        this.connectionStatus = NcConnectionStatus.PartiallyHealthy; //4p4
        this.connectionStatusMessage = "Packet loss detected on NIC1"; //4p5
        if(!transitionFromUnhealthy)
            this.connectionStatusTransitionCounter++; //4p6

        this.externalSynchronizationStatus = NcSynchronizationStatus.PartiallyHealthy; //4p7
        if(!transitionFromUnhealthy)
        {
            // Transition from Healthy
            this.externalSynchronizationStatusMessage = `No sync on NIC1`; //4p8

            if(this.synchronizationSourceId?.includes(this.emulatedGM1) == true)
                this.synchronizationSourceId = `${this.emulatedGM1} on NIC2`; //4p10
            else if(this.synchronizationSourceId?.includes(this.emulatedGM2) == true)
                this.synchronizationSourceId = `${this.emulatedGM2} on NIC2`; //4p10

            this.externalSynchronizationStatusTransitionCounter++; //4p9
        }
        else
        {
            // Transition from Unhealthy
            this.synchronizationSourceId = `${this.emulatedGM1} on NIC2`; //4p10
            this.externalSynchronizationStatusMessage = `No sync on NIC1`; //4p8
        }

        this.streamStatus = NcStreamStatus.Healthy; //4p11
        this.streamStatusMessage = null; //4p12

        this.lostPacketCounters.find(c => c.name === 'Nic_1')?.Increment(5159);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 1), NcPropertyChangeType.ValueChanged, this.overallStatus, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 2), NcPropertyChangeType.ValueChanged, this.overallStatusMessage, null);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 1), NcPropertyChangeType.ValueChanged, this.linkStatus, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 2), NcPropertyChangeType.ValueChanged, this.linkStatusMessage, null);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 4), NcPropertyChangeType.ValueChanged, this.connectionStatus, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 5), NcPropertyChangeType.ValueChanged, this.connectionStatusMessage, null);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 7), NcPropertyChangeType.ValueChanged, this.externalSynchronizationStatus, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 8), NcPropertyChangeType.ValueChanged, this.externalSynchronizationStatusMessage, null);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 11), NcPropertyChangeType.ValueChanged, this.streamStatus, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 12), NcPropertyChangeType.ValueChanged, this.streamStatusMessage, null);

        if(!transitionFromUnhealthy)
        {
            this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 3), NcPropertyChangeType.ValueChanged, this.linkStatusTransitionCounter, null);
            this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 6), NcPropertyChangeType.ValueChanged, this.connectionStatusTransitionCounter, null);
            this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 9), NcPropertyChangeType.ValueChanged, this.externalSynchronizationStatusTransitionCounter, null);
        }

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 10), NcPropertyChangeType.ValueChanged, this.synchronizationSourceId, null);
    }

    public SimulateAllNicsDown()
    {
        this.overallStatus = NcOverallStatus.Unhealthy; //3p1

        this.linkStatus = NcLinkStatus.AllDown; //4p1
        this.linkStatusMessage = "All interfaces down"; //4p2
        this.linkStatusTransitionCounter++; //4p3

        this.overallStatusMessage = this.linkStatusMessage; //3p2

        this.connectionStatus = NcConnectionStatus.Unhealthy; //4p4
        this.connectionStatusMessage = "Unrecoverable packet loss"; //4p5
        this.connectionStatusTransitionCounter++; //4p6

        this.externalSynchronizationStatus = NcSynchronizationStatus.Unhealthy; //4p7
        this.externalSynchronizationStatusMessage = `No sync`; //4p8
        this.externalSynchronizationStatusTransitionCounter++; //4p9
        this.synchronizationSourceId = null; //4p10

        this.streamStatus = NcStreamStatus.Unhealthy; //4p11
        this.streamStatusMessage = "Stream cannot be decoded"; //4p12
        this.streamStatusTransitionCounter++; //4p13

        this.lostPacketCounters.find(c => c.name === 'Nic_1')?.Increment(12159);
        this.lostPacketCounters.find(c => c.name === 'Nic_2')?.Increment(8983);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 1), NcPropertyChangeType.ValueChanged, this.overallStatus, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 2), NcPropertyChangeType.ValueChanged, this.overallStatusMessage, null);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 1), NcPropertyChangeType.ValueChanged, this.linkStatus, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 2), NcPropertyChangeType.ValueChanged, this.linkStatusMessage, null);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 4), NcPropertyChangeType.ValueChanged, this.connectionStatus, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 5), NcPropertyChangeType.ValueChanged, this.connectionStatusMessage, null);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 7), NcPropertyChangeType.ValueChanged, this.externalSynchronizationStatus, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 8), NcPropertyChangeType.ValueChanged, this.externalSynchronizationStatusMessage, null);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 11), NcPropertyChangeType.ValueChanged, this.streamStatus, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 12), NcPropertyChangeType.ValueChanged, this.streamStatusMessage, null);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 3), NcPropertyChangeType.ValueChanged, this.linkStatusTransitionCounter, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 6), NcPropertyChangeType.ValueChanged, this.connectionStatusTransitionCounter, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 9), NcPropertyChangeType.ValueChanged, this.externalSynchronizationStatusTransitionCounter, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 10), NcPropertyChangeType.ValueChanged, this.synchronizationSourceId, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 13), NcPropertyChangeType.ValueChanged, this.streamStatusTransitionCounter, null);
    }

    public SimulateNic1Down()
    {
        if(this.overallStatus != NcOverallStatus.Inactive)
        {
            if(this.overallStatus == NcOverallStatus.Unhealthy)
                DelayTask(1000 * this.statusReportingDelay).then(() => this.Nic1Down(true));
            else
                this.Nic1Down();
        }
    }

    public FaultFixed()
    {
        this.linkStatus = NcLinkStatus.AllUp; //4p1
        this.linkStatusMessage = this.linkStatusMessage != null ? `Previously: ${this.linkStatusMessage}` : null; //4p2

        this.connectionStatus = NcConnectionStatus.Healthy; //4p4
        this.connectionStatusMessage = this.connectionStatusMessage != null ? `Previously: ${this.connectionStatusMessage}` : null; //4p5

        this.externalSynchronizationStatus = NcSynchronizationStatus.Healthy; //4p7
        
        if(this.synchronizationSourceId == null)
        {
            this.synchronizationSourceId = `${this.emulatedGM1} on NIC1`; //4p10
            this.externalSynchronizationStatusMessage = `Previously: No sync`; //4p8
        }
        else
            this.externalSynchronizationStatusMessage = this.externalSynchronizationStatusMessage != null ? `Previously: ${this.externalSynchronizationStatusMessage}` : null; //4p8

        this.streamStatus = NcStreamStatus.Healthy; //4p11
        this.streamStatusMessage = this.streamStatusMessage != null ? `Previously: ${this.streamStatusMessage}` : null; //4p12

        this.overallStatus = NcOverallStatus.Healthy; //3p1
        this.overallStatusMessage = this.linkStatusMessage?.startsWith("Previously:") ? this.linkStatusMessage : `Previously: ${this.linkStatusMessage}`; //3p2

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 1), NcPropertyChangeType.ValueChanged, this.overallStatus, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 2), NcPropertyChangeType.ValueChanged, this.overallStatusMessage, null);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 1), NcPropertyChangeType.ValueChanged, this.linkStatus, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 2), NcPropertyChangeType.ValueChanged, this.linkStatusMessage, null);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 4), NcPropertyChangeType.ValueChanged, this.connectionStatus, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 5), NcPropertyChangeType.ValueChanged, this.connectionStatusMessage, null);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 7), NcPropertyChangeType.ValueChanged, this.externalSynchronizationStatus, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 8), NcPropertyChangeType.ValueChanged, this.externalSynchronizationStatusMessage, null);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 10), NcPropertyChangeType.ValueChanged, this.synchronizationSourceId, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 11), NcPropertyChangeType.ValueChanged, this.streamStatus, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 12), NcPropertyChangeType.ValueChanged, this.streamStatusMessage, null);
    }

    public SimulateFaultFixed()
    {
        if(this.overallStatus != NcOverallStatus.Inactive)
            DelayTask(1000 * this.statusReportingDelay).then(() => this.FaultFixed());
    }

    public SimulateGrandMasterChange()
    {
        if(this.overallStatus == NcOverallStatus.Healthy)
            this.GrandMasterChange();
    }

    public GrandMasterChange()
    {
        this.overallStatus = NcOverallStatus.PartiallyHealthy; //3p1

        let previousGM = this.emulatedGM1;
        let previousNic = "NIC1";

        if(this.synchronizationSourceId?.includes(this.emulatedGM2) == true)
            previousGM = this.emulatedGM2;

        if(this.synchronizationSourceId?.includes("NIC2") == true)
            previousNic = "NIC2";

        if(previousGM == this.emulatedGM1)
            this.synchronizationSourceId = `${this.emulatedGM2} on NIC1`; //4p10
        else
            this.synchronizationSourceId = `${this.emulatedGM1} on NIC1`; //4p10

        this.externalSynchronizationStatus = NcSynchronizationStatus.PartiallyHealthy; //4p7
        this.externalSynchronizationStatusMessage = `Source change from: ${previousGM} on ${previousNic}`; //4p8;
        this.externalSynchronizationStatusTransitionCounter++; //4p9

        this.overallStatusMessage = this.externalSynchronizationStatusMessage; //3p2

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 1), NcPropertyChangeType.ValueChanged, this.overallStatus, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 2), NcPropertyChangeType.ValueChanged, this.overallStatusMessage, null);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 7), NcPropertyChangeType.ValueChanged, this.externalSynchronizationStatus, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 8), NcPropertyChangeType.ValueChanged, this.externalSynchronizationStatusMessage, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 9), NcPropertyChangeType.ValueChanged, this.externalSynchronizationStatusTransitionCounter, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 10), NcPropertyChangeType.ValueChanged, this.synchronizationSourceId, null);

        DelayTask(1000 * this.statusReportingDelay).then(() => this.GrandMasterChangeRecovery());
    }

    public GrandMasterChangeRecovery()
    {
        this.overallStatus = NcOverallStatus.Healthy; //3p1

        this.externalSynchronizationStatus = NcSynchronizationStatus.Healthy; //4p7

        this.externalSynchronizationStatusMessage = this.externalSynchronizationStatusMessage != null ? `Previously: ${this.externalSynchronizationStatusMessage}` : null; //4p8

        this.overallStatusMessage = this.externalSynchronizationStatusMessage?.startsWith("Previously:") ? this.externalSynchronizationStatusMessage : `Previously: ${this.externalSynchronizationStatusMessage}`; //3p2

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 1), NcPropertyChangeType.ValueChanged, this.overallStatus, null);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 2), NcPropertyChangeType.ValueChanged, this.overallStatusMessage, null);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 7), NcPropertyChangeType.ValueChanged, this.externalSynchronizationStatus, null);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 8), NcPropertyChangeType.ValueChanged, this.externalSynchronizationStatusMessage, null);
    }

    public Disconnected()
    {
        this.activated = false;

        this.overallStatus = NcOverallStatus.Inactive; //3p1

        this.linkStatus = NcLinkStatus.AllUp; //4p1

        this.connectionStatus = NcConnectionStatus.Inactive; //4p4

        this.streamStatus = NcStreamStatus.Inactive; //4p11

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 1), NcPropertyChangeType.ValueChanged, this.overallStatus, null);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 1), NcPropertyChangeType.ValueChanged, this.linkStatus, null);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 4), NcPropertyChangeType.ValueChanged, this.connectionStatus, null);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 11), NcPropertyChangeType.ValueChanged, this.streamStatus, null);

        this.monitorManager?.ReceiverDisconnected();
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
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.linkStatusTransitionCounter);
                case '4p4':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.connectionStatus);
                case '4p5':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.connectionStatusMessage);
                case '4p6':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.connectionStatusTransitionCounter);
                case '4p7':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.externalSynchronizationStatus);
                case '4p8':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.externalSynchronizationStatusMessage);
                case '4p9':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.externalSynchronizationStatusTransitionCounter);
                case '4p10':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.synchronizationSourceId);
                case '4p11':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.streamStatus);
                case '4p12':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.streamStatusMessage);
                case '4p13':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.streamStatusTransitionCounter);
                case '4p14':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.autoResetCountersAndMessages);
                default:
                    return super.Get(oid, id, handle);
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.BadOid, 'OID could not be found');
    }

    //'1m2'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public override Set(oid: number, id: NcElementId, value: any, handle: number) : CommandResponseNoValue
    {
        //NcReceiverMonitor

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
                case '4p11':
                case '4p12':
                case '4p13':
                    return new CommandResponseError(handle, NcMethodStatus.Readonly, 'Property is readonly');
                case '4p14':
                    if(value != null && value != undefined && typeof value === 'boolean')
                    {
                        this.autoResetCountersAndMessages = value;
                        this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.autoResetCountersAndMessages, null);
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    }
                    else
                        return new CommandResponseError(handle, NcMethodStatus.ParameterError, "Invalid property value");
                default:
                    return super.Set(oid, id, value, handle);
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.BadOid, 'OID could not be found');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public override SetValidate(oid: number, id: NcElementId, value: any, handle: number) : CommandResponseNoValue
    {
        //NcReceiverMonitor

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
                case '4p11':
                case '4p12':
                case '4p13':
                    return new CommandResponseError(handle, NcMethodStatus.Readonly, 'Property is readonly');
                case '4p14':
                    if(value != null && value != undefined && typeof value === 'boolean')
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    else
                        return new CommandResponseError(handle, NcMethodStatus.ParameterError, "Invalid property value");
                default:
                    return super.SetValidate(oid, id, value, handle);
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.BadOid, 'OID could not be found');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                    this.ResetCountersAndMessages();
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                default:
                    return super.InvokeMethod(oid, methodId, args, handle);

            }
        }

        return new CommandResponseError(handle, NcMethodStatus.BadOid, 'OID could not be found');
    }

    private ResetCountersAndMessages()
    {
        this.lostPacketCounters.forEach(counter => {
            counter.Reset();
        });

        this.latePacketCounters.forEach(counter => {
            counter.Reset();
        });

        this.linkStatusTransitionCounter = 0; //4p3
        this.connectionStatusTransitionCounter = 0; //4p6
        this.externalSynchronizationStatusTransitionCounter = 0; //4p9
        this.streamStatusTransitionCounter = 0; //4p13

        this.overallStatusMessage = null; //3p2
        this.linkStatusMessage = null; //4p2
        this.connectionStatusMessage = null; //4p5
        this.externalSynchronizationStatusMessage = null; //4p8
        this.streamStatusMessage = null; //4p12

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 3), NcPropertyChangeType.ValueChanged, this.linkStatusTransitionCounter, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 6), NcPropertyChangeType.ValueChanged, this.connectionStatusTransitionCounter, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 9), NcPropertyChangeType.ValueChanged, this.externalSynchronizationStatusTransitionCounter, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 13), NcPropertyChangeType.ValueChanged, this.streamStatusTransitionCounter, null);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 2), NcPropertyChangeType.ValueChanged, this.overallStatusMessage, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 2), NcPropertyChangeType.ValueChanged, this.linkStatusMessage, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 5), NcPropertyChangeType.ValueChanged, this.connectionStatusMessage, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 8), NcPropertyChangeType.ValueChanged, this.externalSynchronizationStatusMessage, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 12), NcPropertyChangeType.ValueChanged, this.streamStatusMessage, null);
    }

    public static override GetClassDescriptor(includeInherited: boolean): NcClassDescriptor 
    {
        let currentClassDescriptor = new NcClassDescriptor(`${NcReceiverMonitor.name} class descriptor`,
            NcReceiverMonitor.staticClassID, NcReceiverMonitor.name, null,
            [
                new NcPropertyDescriptor(new NcElementId(4, 1), "linkStatus", "NcLinkStatus", true, false, false, null, "Link status property"),
                new NcPropertyDescriptor(new NcElementId(4, 2), "linkStatusMessage", "NcString", true, true, false, null, "Link status message property"),
                new NcPropertyDescriptor(new NcElementId(4, 3), "linkStatusTransitionCounter", "NcUint64", true, false, false, null, "Link status transition counter property"),
                new NcPropertyDescriptor(new NcElementId(4, 4), "connectionStatus", "NcConnectionStatus", true, false, false, null, "Connection status property"),
                new NcPropertyDescriptor(new NcElementId(4, 5), "connectionStatusMessage", "NcString", true, true, false, null, "Connection status message property"),
                new NcPropertyDescriptor(new NcElementId(4, 6), "connectionStatusTransitionCounter", "NcUint64", true, false, false, null, "Connection status transition counter property"),
                new NcPropertyDescriptor(new NcElementId(4, 7), "externalSynchronizationStatus", "NcSynchronizationStatus", true, false, false, null, "External synchronization status property"),
                new NcPropertyDescriptor(new NcElementId(4, 8), "externalSynchronizationStatusMessage", "NcString", true, true, false, null, "External synchronization status message property"),
                new NcPropertyDescriptor(new NcElementId(4, 9), "externalSynchronizationStatusTransitionCounter", "NcUint64", true, false, false, null, "External synchronization status transition counter property"),
                new NcPropertyDescriptor(new NcElementId(4, 10), "synchronizationSourceId", "NcString", true, true, false, null, "Synchronization source id property"),
                new NcPropertyDescriptor(new NcElementId(4, 11), "streamStatus", "NcStreamStatus", true, false, false, null, "Stream status property"),
                new NcPropertyDescriptor(new NcElementId(4, 12), "streamStatusMessage", "NcString", true, true, false, null, "Stream status message property"),
                new NcPropertyDescriptor(new NcElementId(4, 13), "streamStatusTransitionCounter", "NcUint64", true, false, false, null, "Stream status transition counter property"),
                new NcPropertyDescriptor(new NcElementId(4, 14), "autoResetCountersAndMessages", "NcBoolean", false, false, false, null, "Automatic reset counters and status messages property (default: true)")
            ],
            [
                new NcMethodDescriptor(new NcElementId(4, 1), "GetLostPacketCounters", "NcMethodResultCounters", [], "Gets the lost packet counters"),
                new NcMethodDescriptor(new NcElementId(4, 2), "GetLatePacketCounters", "NcMethodResultCounters", [], "Gets the late packet counters"),
                new NcMethodDescriptor(new NcElementId(4, 3), "ResetCountersAndMessages", "NcMethodResult", [], "Resets ALL counters and status messages")
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

    public override GetAllProperties(recurse: boolean, includeDescriptors: boolean) : NcObjectPropertiesHolder[]
    {
        let descriptor = NcReceiverMonitor.GetClassDescriptor(false);
        var propDescriptors: { [id: string] : NcPropertyDescriptor; } = {};

        descriptor.properties.forEach(p => {
            propDescriptors[NcElementId.ToPropertyString(p.id)] = p;
        });

        let properties = [
            new NcObjectPropertiesHolder(this.GetRolePath(), [], [
                new NcPropertyHolder(new NcPropertyId(4, 1), includeDescriptors ? propDescriptors['4p1'] : null, this.linkStatus),
                new NcPropertyHolder(new NcPropertyId(4, 2), includeDescriptors ? propDescriptors['4p2'] : null, this.linkStatusMessage),
                new NcPropertyHolder(new NcPropertyId(4, 3), includeDescriptors ? propDescriptors['4p3'] : null, this.linkStatusTransitionCounter),
                new NcPropertyHolder(new NcPropertyId(4, 4), includeDescriptors ? propDescriptors['4p4'] : null, this.connectionStatus),
                new NcPropertyHolder(new NcPropertyId(4, 5), includeDescriptors ? propDescriptors['4p5'] : null, this.connectionStatusMessage),
                new NcPropertyHolder(new NcPropertyId(4, 6), includeDescriptors ? propDescriptors['4p6'] : null, this.connectionStatusTransitionCounter),
                new NcPropertyHolder(new NcPropertyId(4, 7), includeDescriptors ? propDescriptors['4p7'] : null, this.externalSynchronizationStatus),
                new NcPropertyHolder(new NcPropertyId(4, 8), includeDescriptors ? propDescriptors['4p8'] : null, this.externalSynchronizationStatusMessage),
                new NcPropertyHolder(new NcPropertyId(4, 9), includeDescriptors ? propDescriptors['4p9'] : null, this.externalSynchronizationStatusTransitionCounter),
                new NcPropertyHolder(new NcPropertyId(4, 10), includeDescriptors ? propDescriptors['4p10'] : null, this.synchronizationSourceId),
                new NcPropertyHolder(new NcPropertyId(4, 11), includeDescriptors ? propDescriptors['4p11'] : null, this.streamStatus),
                new NcPropertyHolder(new NcPropertyId(4, 12), includeDescriptors ? propDescriptors['4p12'] : null, this.streamStatusMessage),
                new NcPropertyHolder(new NcPropertyId(4, 13), includeDescriptors ? propDescriptors['4p13'] : null, this.streamStatusTransitionCounter),
                new NcPropertyHolder(new NcPropertyId(4, 14), includeDescriptors ? propDescriptors['4p14'] : null, this.autoResetCountersAndMessages)
            ], [], this.isRebuildable)
        ];

        properties[0].values = properties[0].values.concat(super.GetAllProperties(recurse, includeDescriptors)[0].values);

        return properties;
    }

    public override Restore(restoreArguments: RestoreArguments, applyChanges: boolean) : NcObjectPropertiesSetValidation[]
    {
        let validationEntries = new Array<NcObjectPropertiesSetValidation>();

        let localRolePath = this.GetRolePath().join('.');

        let myRestoreData = restoreArguments.dataSet.values.find(f => f.path.join('.') == localRolePath);
        if(myRestoreData)
        {
            console.log(`Found restore data for path: ${localRolePath}, applyChanges: ${applyChanges}`);

            let myNotices = new Array<NcPropertyRestoreNotice>();

            let descriptor = NcReceiverMonitor.GetClassDescriptor(true);
            var propDescriptors: { [id: string] : NcPropertyDescriptor; } = {};

            descriptor.properties.forEach(p => {
                propDescriptors[NcElementId.ToPropertyString(p.id)] = p;
            });

            myRestoreData.values.forEach(propertyData => {
                let propertyId = NcElementId.ToPropertyString(propertyData.id);

                //Perform further validation
                let response : CommandResponseNoValue | null = null;

                if(applyChanges)
                    response = this.Set(this.oid, propertyData.id, propertyData.value, 0);
                else
                    response = this.SetValidate(this.oid, propertyData.id, propertyData.value, 0);

                console.log(`Restore response for path: ${localRolePath}, id: ${propertyId}, name: ${propDescriptors[propertyId].name}, status: ${response.result['status']}, requested value: ${propertyData.value}`);

                if(response.result['status'] != NcMethodStatus.OK)
                {
                    let noticeMessage = "Property could not be changed due to internal error";

                    if(response.result['errorMessage'])
                        noticeMessage = response.result['errorMessage']

                    console.log(`Internal error notice for path: ${localRolePath}, id: ${propertyId}, name: ${propDescriptors[propertyId].name}, notice: ${noticeMessage}, requested value: ${propertyData.value}`);

                    myNotices.push(new NcPropertyRestoreNotice(
                        propertyData.id,
                        propDescriptors[propertyId].name,
                        NcPropertyRestoreNoticeType.Warning,
                        noticeMessage));
                }
            });

            validationEntries.push(new NcObjectPropertiesSetValidation(this.GetRolePath(), NcRestoreValidationStatus.Ok, myNotices, myNotices.length > 0 ? 'Some properties have notices' : null));
        }

        return validationEntries;
    }
}

export interface ISenderMonitoring
{
    SimulateSignalLost(): void;

    SimulateFaultFixed(): void;

    activated: boolean;
}

export class NcSenderMonitor extends NcStatusMonitor implements ISenderMonitoring
{
    public static staticClassID: number[] = [ 1, 2, 2, 2 ];

    @myIdDecorator('1p1')
    public override classID: number[] = NcSenderMonitor.staticClassID;

    @myIdDecorator('4p1')
    public linkStatus: NcLinkStatus;

    @myIdDecorator('4p2')
    public linkStatusMessage: string | null;

    @myIdDecorator('4p3')
    public linkStatusTransitionCounter: number;

    @myIdDecorator('4p4')
    public transmissionStatus: NcTransmissionStatus;

    @myIdDecorator('4p5')
    public transmissionStatusMessage: string | null;

    @myIdDecorator('4p6')
    public transmissionStatusTransitionCounter: number;

    @myIdDecorator('4p7')
    public externalSynchronizationStatus: NcSynchronizationStatus;

    @myIdDecorator('4p8')
    public externalSynchronizationStatusMessage: string | null;

    @myIdDecorator('4p9')
    public externalSynchronizationStatusTransitionCounter: number;

    @myIdDecorator('4p10')
    public synchronizationSourceId: string | null;

    @myIdDecorator('4p11')
    public essenceStatus: NcEssenceStatus;

    @myIdDecorator('4p12')
    public essenceStatusMessage: string | null;

    @myIdDecorator('4p13')
    public essenceStatusTransitionCounter: number;

    @myIdDecorator('4p14')
    public autoResetCountersAndMessages: boolean;

    private errorCounters: NcCounter[];

    public activated: boolean;

    private monitorManager: IMonitorManager | null;

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

        this.activated = false;

        this.overallStatus = NcOverallStatus.Inactive;
        this.overallStatusMessage = null;

        this.linkStatus = NcLinkStatus.AllUp;
        this.linkStatusMessage = null;

        this.transmissionStatus = NcTransmissionStatus.Inactive;
        this.transmissionStatusMessage = null;

        this.errorCounters = [
            new NcCounter("Main", 0, "Main transmission errors")
        ];
        
        this.externalSynchronizationStatus = NcSynchronizationStatus.Healthy;
        this.synchronizationSourceId = "00:0c:ec:ff:fe:0a:2b:a1 on NIC1";
        this.externalSynchronizationStatusMessage = null; //4p8

        this.essenceStatus = NcEssenceStatus.Inactive;
        this.essenceStatusMessage = null;

        this.linkStatusTransitionCounter = 0;
        this.transmissionStatusTransitionCounter = 0;
        this.externalSynchronizationStatusTransitionCounter = 0;
        this.essenceStatusTransitionCounter = 0;

        this.autoResetCountersAndMessages = true;

        this.Activated();

        this.monitorManager = null;
    }

    public SetMonitorManager(manager: IMonitorManager)
    {
        this.monitorManager = manager;
    }

    public Activated()
    {
        this.activated = true;

        this.overallStatus = NcOverallStatus.Healthy; //3p1

        this.transmissionStatus = NcTransmissionStatus.Healthy; //4p4

        this.essenceStatus = NcEssenceStatus.Healthy; //4p11

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 1), NcPropertyChangeType.ValueChanged, this.overallStatus, null);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 4), NcPropertyChangeType.ValueChanged, this.transmissionStatus, null);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 11), NcPropertyChangeType.ValueChanged, this.essenceStatus, null);

        if(this.autoResetCountersAndMessages)
            this.ResetCountersAndMessages();
    }

    public SimulateSignalLost()
    {
        if(this.overallStatus != NcOverallStatus.Inactive)
        {
            this.overallStatus = NcOverallStatus.Unhealthy; //3p1
    
            this.essenceStatus = NcEssenceStatus.Unhealthy; //4p11
            this.essenceStatusMessage = "No signal on SDI IN3"; //4p12
            this.essenceStatusTransitionCounter++; //4p13

            this.overallStatusMessage = this.essenceStatusMessage; //3p2

            this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 1), NcPropertyChangeType.ValueChanged, this.overallStatus, null);
            this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 2), NcPropertyChangeType.ValueChanged, this.overallStatusMessage, null);

            this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 11), NcPropertyChangeType.ValueChanged, this.essenceStatus, null);
            this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 12), NcPropertyChangeType.ValueChanged, this.essenceStatusMessage, null);

            this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 13), NcPropertyChangeType.ValueChanged, this.essenceStatusTransitionCounter, null);
        }
    }

    public SimulateFaultFixed()
    {
        if(this.overallStatus != NcOverallStatus.Inactive)
            DelayTask(1000 * this.statusReportingDelay).then(() => this.FaultFixed());
    }

    public FaultFixed()
    {
        this.overallStatus = NcOverallStatus.Healthy; //3p1

        this.essenceStatus = NcEssenceStatus.Healthy; //4p11
        this.essenceStatusMessage = this.essenceStatusMessage != null ? `Previously: ${this.essenceStatusMessage}` : null; //4p12

        this.overallStatusMessage = this.essenceStatusMessage?.startsWith("Previously:") ? this.essenceStatusMessage : `Previously: ${this.essenceStatusMessage}`; //3p2

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 1), NcPropertyChangeType.ValueChanged, this.overallStatus, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 2), NcPropertyChangeType.ValueChanged, this.overallStatusMessage, null);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 11), NcPropertyChangeType.ValueChanged, this.essenceStatus, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 12), NcPropertyChangeType.ValueChanged, this.essenceStatusMessage, null);
    }

    public Deactivated()
    {
        this.activated = false;

        this.overallStatus = NcOverallStatus.Inactive; //3p1

        this.transmissionStatus = NcTransmissionStatus.Inactive; //4p4

        this.essenceStatus = NcEssenceStatus.Inactive; //4p11

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 1), NcPropertyChangeType.ValueChanged, this.overallStatus, null);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 4), NcPropertyChangeType.ValueChanged, this.transmissionStatus, null);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 11), NcPropertyChangeType.ValueChanged, this.essenceStatus, null);

        this.monitorManager?.SenderDeactivated();
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
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.linkStatusTransitionCounter);
                case '4p4':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.transmissionStatus);
                case '4p5':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.transmissionStatusMessage);
                case '4p6':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.transmissionStatusTransitionCounter);
                case '4p7':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.externalSynchronizationStatus);
                case '4p8':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.externalSynchronizationStatusMessage);
                case '4p9':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.externalSynchronizationStatusTransitionCounter);
                case '4p10':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.synchronizationSourceId);
                case '4p11':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.essenceStatus);
                case '4p12':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.essenceStatusMessage);
                case '4p13':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.essenceStatusTransitionCounter);
                case '4p14':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.autoResetCountersAndMessages);
                default:
                    return super.Get(oid, id, handle);
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.BadOid, 'OID could not be found');
    }

    //'1m2'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public override Set(oid: number, id: NcElementId, value: any, handle: number) : CommandResponseNoValue
    {
        //NcSenderMonitor

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
                case '4p11':
                case '4p12':
                case '4p13':
                    return new CommandResponseError(handle, NcMethodStatus.Readonly, 'Property is readonly');
                case '4p14':
                    if(value != null && value != undefined && typeof value === 'boolean')
                    {
                        this.autoResetCountersAndMessages = value;
                        this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.autoResetCountersAndMessages, null);
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    }
                    else
                        return new CommandResponseError(handle, NcMethodStatus.ParameterError, "Invalid property value");
                default:
                    return super.Set(oid, id, value, handle);
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.BadOid, 'OID could not be found');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public override SetValidate(oid: number, id: NcElementId, value: any, handle: number) : CommandResponseNoValue
    {
        //NcSenderMonitor

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
                case '4p11':
                case '4p12':
                case '4p13':
                    return new CommandResponseError(handle, NcMethodStatus.Readonly, 'Property is readonly');
                case '4p14':
                    if(value != null && value != undefined && typeof value === 'boolean')
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    else
                        return new CommandResponseError(handle, NcMethodStatus.ParameterError, "Invalid property value");
                default:
                    return super.SetValidate(oid, id, value, handle);
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.BadOid, 'OID could not be found');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public override InvokeMethod(oid: number, methodId: NcElementId, args: { [key: string]: any; } | null, handle: number): CommandResponseNoValue 
    {
        if(oid == this.oid)
        {
            let key: string = `${methodId.level}m${methodId.index}`;

            switch(key)
            {
                case '4m1':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.errorCounters);
                case '4m2':
                    this.ResetCountersAndMessages();
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                default:
                    return super.InvokeMethod(oid, methodId, args, handle);
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.BadOid, 'OID could not be found');
    }

    private ResetCountersAndMessages()
    {
        this.errorCounters.forEach(counter => {
            counter.Reset();
        });

        this.linkStatusTransitionCounter = 0; //4p3
        this.transmissionStatusTransitionCounter = 0; //4p6
        this.externalSynchronizationStatusTransitionCounter = 0; //4p9
        this.essenceStatusTransitionCounter = 0; //4p13

        this.overallStatusMessage = null; //3p2
        this.linkStatusMessage = null; //4p2
        this.transmissionStatusMessage = null; //4p5
        this.externalSynchronizationStatusMessage = null; //4p8
        this.essenceStatusMessage = null; //4p12

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 3), NcPropertyChangeType.ValueChanged, this.linkStatusTransitionCounter, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 6), NcPropertyChangeType.ValueChanged, this.transmissionStatusTransitionCounter, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 9), NcPropertyChangeType.ValueChanged, this.externalSynchronizationStatusTransitionCounter, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 13), NcPropertyChangeType.ValueChanged, this.essenceStatusTransitionCounter, null);

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 2), NcPropertyChangeType.ValueChanged, this.overallStatusMessage, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 2), NcPropertyChangeType.ValueChanged, this.linkStatusMessage, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 5), NcPropertyChangeType.ValueChanged, this.transmissionStatusMessage, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 8), NcPropertyChangeType.ValueChanged, this.externalSynchronizationStatusMessage, null);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(4, 12), NcPropertyChangeType.ValueChanged, this.essenceStatusMessage, null);
    }

    public static override GetClassDescriptor(includeInherited: boolean): NcClassDescriptor 
    {
        let currentClassDescriptor = new NcClassDescriptor(`${NcSenderMonitor.name} class descriptor`,
            NcSenderMonitor.staticClassID, NcSenderMonitor.name, null,
            [
                new NcPropertyDescriptor(new NcElementId(4, 1), "linkStatus", "NcLinkStatus", true, false, false, null, "Link status property"),
                new NcPropertyDescriptor(new NcElementId(4, 2), "linkStatusMessage", "NcString", true, true, false, null, "Link status message property"),
                new NcPropertyDescriptor(new NcElementId(4, 3), "linkStatusTransitionCounter", "NcUint64", true, false, false, null, "Link status transition counter property"),
                new NcPropertyDescriptor(new NcElementId(4, 4), "transmissionStatus", "NcTransmissionStatus", true, false, false, null, "Transmission status property"),
                new NcPropertyDescriptor(new NcElementId(4, 5), "transmissionStatusMessage", "NcString", true, true, false, null, "Transmission status message property"),
                new NcPropertyDescriptor(new NcElementId(4, 6), "transmissionStatusTransitionCounter", "NcUint64", true, false, false, null, "Transmission status transition counter property"),
                new NcPropertyDescriptor(new NcElementId(4, 7), "externalSynchronizationStatus", "NcSynchronizationStatus", true, false, false, null, "External synchronization status property"),
                new NcPropertyDescriptor(new NcElementId(4, 8), "externalSynchronizationStatusMessage", "NcString", true, true, false, null, "External synchronization status message property"),
                new NcPropertyDescriptor(new NcElementId(4, 9), "externalSynchronizationStatusTransitionCounter", "NcUint64", true, false, false, null, "External synchronization status transition counter property"),
                new NcPropertyDescriptor(new NcElementId(4, 10), "synchronizationSourceId", "NcString", true, true, false, null, "Synchronization source id property"),
                new NcPropertyDescriptor(new NcElementId(4, 11), "essenceStatus", "NcEssenceStatus", true, false, false, null, "Essence status property"),
                new NcPropertyDescriptor(new NcElementId(4, 12), "essenceStatusMessage", "NcString", true, true, false, null, "Essence status message property"),
                new NcPropertyDescriptor(new NcElementId(4, 13), "essenceStatusTransitionCounter", "NcUint64", true, false, false, null, "Essence status transition counter property"),
                new NcPropertyDescriptor(new NcElementId(4, 14), "autoResetCountersAndMessages", "NcBoolean", false, false, false, null, "Automatic reset counters and status messages property (default: true)")
            ],
            [
                new NcMethodDescriptor(new NcElementId(4, 1), "GetTransmissionErrorCounters", "NcMethodResultCounters", [], "Gets the transmission error counters"),
                new NcMethodDescriptor(new NcElementId(4, 2), "ResetCountersAndMessages", "NcMethodResult", [], "Resets ALL counters and status messages")
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

    public override GetAllProperties(recurse: boolean, includeDescriptors: boolean) : NcObjectPropertiesHolder[]
    {
        let descriptor = NcSenderMonitor.GetClassDescriptor(false);
        var propDescriptors: { [id: string] : NcPropertyDescriptor; } = {};

        descriptor.properties.forEach(p => {
            propDescriptors[NcElementId.ToPropertyString(p.id)] = p;
        });

        let properties = [
            new NcObjectPropertiesHolder(this.GetRolePath(), [], [
                new NcPropertyHolder(new NcPropertyId(4, 1), includeDescriptors ? propDescriptors['4p1'] : null, this.linkStatus),
                new NcPropertyHolder(new NcPropertyId(4, 2), includeDescriptors ? propDescriptors['4p2'] : null, this.linkStatusMessage),
                new NcPropertyHolder(new NcPropertyId(4, 3), includeDescriptors ? propDescriptors['4p3'] : null, this.linkStatusTransitionCounter),
                new NcPropertyHolder(new NcPropertyId(4, 4), includeDescriptors ? propDescriptors['4p4'] : null, this.transmissionStatus),
                new NcPropertyHolder(new NcPropertyId(4, 5), includeDescriptors ? propDescriptors['4p5'] : null, this.transmissionStatusMessage),
                new NcPropertyHolder(new NcPropertyId(4, 6), includeDescriptors ? propDescriptors['4p6'] : null, this.transmissionStatusTransitionCounter),
                new NcPropertyHolder(new NcPropertyId(4, 7), includeDescriptors ? propDescriptors['4p7'] : null, this.externalSynchronizationStatus),
                new NcPropertyHolder(new NcPropertyId(4, 8), includeDescriptors ? propDescriptors['4p8'] : null, this.externalSynchronizationStatusMessage),
                new NcPropertyHolder(new NcPropertyId(4, 9), includeDescriptors ? propDescriptors['4p9'] : null, this.externalSynchronizationStatusTransitionCounter),
                new NcPropertyHolder(new NcPropertyId(4, 10), includeDescriptors ? propDescriptors['4p10'] : null, this.synchronizationSourceId),
                new NcPropertyHolder(new NcPropertyId(4, 11), includeDescriptors ? propDescriptors['4p11'] : null, this.essenceStatus),
                new NcPropertyHolder(new NcPropertyId(4, 12), includeDescriptors ? propDescriptors['4p12'] : null, this.essenceStatusMessage),
                new NcPropertyHolder(new NcPropertyId(4, 13), includeDescriptors ? propDescriptors['4p13'] : null, this.essenceStatusTransitionCounter),
                new NcPropertyHolder(new NcPropertyId(4, 14), includeDescriptors ? propDescriptors['4p14'] : null, this.autoResetCountersAndMessages)
            ], [], this.isRebuildable)
        ];

        properties[0].values = properties[0].values.concat(super.GetAllProperties(recurse, includeDescriptors)[0].values);

        return properties;
    }

    public override Restore(restoreArguments: RestoreArguments, applyChanges: boolean) : NcObjectPropertiesSetValidation[]
    {
        let validationEntries = new Array<NcObjectPropertiesSetValidation>();

        let localRolePath = this.GetRolePath().join('.');

        let myRestoreData = restoreArguments.dataSet.values.find(f => f.path.join('.') == localRolePath);
        if(myRestoreData)
        {
            console.log(`Found restore data for path: ${localRolePath}, applyChanges: ${applyChanges}`);

            let myNotices = new Array<NcPropertyRestoreNotice>();

            let descriptor = NcSenderMonitor.GetClassDescriptor(true);
            var propDescriptors: { [id: string] : NcPropertyDescriptor; } = {};

            descriptor.properties.forEach(p => {
                propDescriptors[NcElementId.ToPropertyString(p.id)] = p;
            });

            myRestoreData.values.forEach(propertyData => {
                let propertyId = NcElementId.ToPropertyString(propertyData.id);

                //Perform further validation
                let response : CommandResponseNoValue | null = null;

                if(applyChanges)
                    response = this.Set(this.oid, propertyData.id, propertyData.value, 0);
                else
                    response = this.SetValidate(this.oid, propertyData.id, propertyData.value, 0);

                console.log(`Restore response for path: ${localRolePath}, id: ${propertyId}, name: ${propDescriptors[propertyId].name}, status: ${response.result['status']}, requested value: ${propertyData.value}`);

                if(response.result['status'] != NcMethodStatus.OK)
                {
                    let noticeMessage = "Property could not be changed due to internal error";

                    if(response.result['errorMessage'])
                        noticeMessage = response.result['errorMessage']

                    console.log(`Internal error notice for path: ${localRolePath}, id: ${propertyId}, name: ${propDescriptors[propertyId].name}, notice: ${noticeMessage}, requested value: ${propertyData.value}`);

                    myNotices.push(new NcPropertyRestoreNotice(
                        propertyData.id,
                        propDescriptors[propertyId].name,
                        NcPropertyRestoreNoticeType.Warning,
                        noticeMessage));
                }
            });

            validationEntries.push(new NcObjectPropertiesSetValidation(this.GetRolePath(), NcRestoreValidationStatus.Ok, myNotices, myNotices.length > 0 ? 'Some properties have notices' : null));
        }

        return validationEntries;
    }
}

enum ExampleEnum
{
    Undefined = 0,
    Alpha = 1,
    Beta = 2,
    Gamma = 3
}

enum ReceiverMonitorFaultEmulation
{
    Healthy = 1,
    Nic1Down = 2,
    AllNicsDown = 3
}

enum SenderMonitorFaultEmulation
{
    Healthy = 1,
    SignalLost = 2
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

    public static override GetTypeDescriptor(_includeInherited: boolean): NcDatatypeDescriptor
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

export interface IMonitorManager
{
    ReceiverDisconnected(): void;

    SenderDeactivated(): void;
}

export class ExampleControl extends NcWorker implements IMonitorManager
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

    @myIdDecorator('3p14')
    public receiverMonitorFaultEmulation: ReceiverMonitorFaultEmulation;

    @myIdDecorator('3p15')
    public senderMonitorFaultEmulation: SenderMonitorFaultEmulation;

    private receiverMonitoringContext: IReceiverMonitoring | null;
    private senderMonitoringContext: ISenderMonitoring | null;

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
        isRebuildable: boolean = false,
        dataSet: NcObjectPropertiesHolder | null = null,
        receiverMonitoringContext: IReceiverMonitoring | null = null,
        senderMonitoringContext: ISenderMonitoring | null = null)
    {
        super(oid, constantOid, ownerObject, role, userLabel, touchpoints, runtimePropertyConstraints, enabled, description, notificationContext, isRebuildable);

        this.receiverMonitoringContext = receiverMonitoringContext;
        this.senderMonitoringContext = senderMonitoringContext;

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
        this.receiverMonitorFaultEmulation = ReceiverMonitorFaultEmulation.Healthy;
        this.senderMonitorFaultEmulation = SenderMonitorFaultEmulation.Healthy;

        if(dataSet != null)
        {
            this.InitialiseFromDataset(dataSet);
            console.log(`ExampleControl object [${this.role}] constructed from a dataSet`);
        }
        else
            console.log(`ExampleControl object [${this.role}] constructed with defaults`);
    }

    private InitialiseFromDataset(dataSet: NcObjectPropertiesHolder)
    {
        dataSet.values.forEach(propertyData => 
        {
            let propertyId = NcElementId.ToPropertyString(propertyData.id);
            switch(propertyId)
            {
                case '3p1':
                    this.enumProperty = propertyData.value;
                case '3p2':
                    this.stringProperty = propertyData.value;
                case '3p3':
                    this.numberProperty = propertyData.value;
                case '3p4':
                    this.booleanProperty = propertyData.value;
                case '3p5':
                    this.objectProperty = propertyData.value;
                case '3p9':
                    this.stringSequence = propertyData.value;
                case '3p10':
                    this.booleanSequence = propertyData.value;
                case '3p11':
                    this.enumSequence = propertyData.value;
                case '3p12':
                    this.numberSequence = propertyData.value;
                case '3p13':
                    this.objectSequence = propertyData.value;
                case '3p14':
                    this.receiverMonitorFaultEmulation = propertyData.value;
                case '3p15':
                    this.senderMonitorFaultEmulation = propertyData.value;
            }
        });
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
                case '3p14':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.receiverMonitorFaultEmulation);
                case '3p15':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.senderMonitorFaultEmulation);
                default:
                    return super.Get(oid, id, handle);
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.BadOid, 'OID could not be found');
    }

    //'1m2'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public override Set(oid: number, id: NcElementId, value: any, handle: number) : CommandResponseNoValue
    {
        //ExampleControl

        if(oid == this.oid)
        {
            let key: string = `${id.level}p${id.index}`;

            switch(key)
            {
                case '3p1':
                    let valueEnum = value as ExampleEnum;
                    if(valueEnum !== undefined && ExampleEnum.hasOwnProperty(valueEnum))
                    {
                        this.enumProperty = valueEnum;
                        this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.enumProperty, null);
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    }
                    else
                        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid property value');
                case '3p2':
                    if(value != null && value != undefined && typeof value === 'string')
                    {
                        if(value.length > 0 && value.length <= 10)
                        {
                            this.stringProperty = value;
                            this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.stringProperty, null);
                            return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                        }
                        else
                            return new CommandResponseError(handle, NcMethodStatus.ParameterError, "Value does not respect constraints");
                    }
                    else
                        return new CommandResponseError(handle, NcMethodStatus.ParameterError, "Invalid property value");
                case '3p3':
                    if(value != null && value != undefined && typeof value === 'number')
                    {
                        if(value >= 0 && value <= 1000)
                        {
                            this.numberProperty = value;
                            this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.numberProperty, null);
                            return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                        }
                        else
                            return new CommandResponseError(handle, NcMethodStatus.ParameterError, "Value does not respect constraints");
                    }
                    else
                        return new CommandResponseError(handle, NcMethodStatus.ParameterError, "Invalid property value");
                case '3p4':
                    if(value != null && value != undefined && typeof value === 'boolean')
                    {
                        this.booleanProperty = value;
                        this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.booleanProperty, null);
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    }
                    else
                        return new CommandResponseError(handle, NcMethodStatus.ParameterError, "Invalid property value");
                case '3p5':
                    let valueObj = value as ExampleDataType;
                    if(valueObj != null && valueObj !== undefined)
                    {
                        this.objectProperty = valueObj;
                        this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.objectProperty, null);
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    }
                    else
                        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid property value');
                case '3p6':
                case '3p7':
                case '3p8':
                        return new CommandResponseError(handle, NcMethodStatus.Readonly, "Property is read only");
                case '3p9':
                    let stringSequence = value as string[];
                    if(stringSequence != null && stringSequence !== undefined)
                    {
                        this.stringSequence = stringSequence;
                        this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.stringSequence, null);
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    }
                    else
                        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid property value');
                case '3p10':
                    let booleanSequence = value as boolean[];
                    if(booleanSequence != null && booleanSequence !== undefined)
                    {
                        this.booleanSequence = booleanSequence;
                        this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.booleanSequence, null);
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    }
                    else
                        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid property value');
                case '3p11':
                    let enumSequence = value as ExampleEnum[];
                    if(enumSequence != null && enumSequence !== undefined)
                    {
                        this.enumSequence = enumSequence;
                        this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.enumSequence, null);
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    }
                    else
                        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid property value');
                case '3p12':
                    let numberSequence = value as number[];
                    if(numberSequence != null && numberSequence !== undefined)
                    {
                        this.numberSequence = numberSequence;
                        this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.numberSequence, null);
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    }
                    else
                        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid property value');
                case '3p13':
                    let objectSequence = value as ExampleDataType[];
                    if(objectSequence != null && objectSequence !== undefined)
                    {
                        this.objectSequence = value;
                        this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.objectSequence, null);
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    }
                    else
                        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid property value');
                case '3p14':
                    let enumValueReceiverEmulation = value as ReceiverMonitorFaultEmulation;
                    if(enumValueReceiverEmulation != null && enumValueReceiverEmulation !== undefined)
                    {
                        if(this.receiverMonitoringContext != null)
                        {
                            if(this.receiverMonitoringContext.activated)
                            {
                                if(enumValueReceiverEmulation == ReceiverMonitorFaultEmulation.Nic1Down)
                                    this.receiverMonitoringContext.SimulateNic1Down();
                                else if(enumValueReceiverEmulation == ReceiverMonitorFaultEmulation.AllNicsDown)
                                    this.receiverMonitoringContext.SimulateAllNicsDown();
                                else
                                    this.receiverMonitoringContext.SimulateFaultFixed();
    
                                this.receiverMonitorFaultEmulation = enumValueReceiverEmulation;
                                this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.receiverMonitorFaultEmulation, null);
                            }
                            else
                            {
                                this.receiverMonitorFaultEmulation = ReceiverMonitorFaultEmulation.Healthy;
                                this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.receiverMonitorFaultEmulation, null);

                                return new CommandResponseError(handle, NcMethodStatus.DeviceError, "Property can only be changed when associated receiver has been Activated");
                            }
                        }
                        else
                        {
                            this.receiverMonitorFaultEmulation = enumValueReceiverEmulation;
                            this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.receiverMonitorFaultEmulation, null);
                        }
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    }
                case '3p15':
                    let enumValueSenderEmulation = value as SenderMonitorFaultEmulation;
                    if(enumValueSenderEmulation != null && enumValueSenderEmulation !== undefined)
                    {
                        if(this.senderMonitoringContext != null)
                        {
                            if(this.senderMonitoringContext.activated)
                            {
                                if(enumValueSenderEmulation == SenderMonitorFaultEmulation.SignalLost)
                                    this.senderMonitoringContext.SimulateSignalLost();
                                else
                                    this.senderMonitoringContext.SimulateFaultFixed();
    
                                this.senderMonitorFaultEmulation = enumValueSenderEmulation;
                                this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.senderMonitorFaultEmulation, null);
                            }
                            else
                            {
                                this.senderMonitorFaultEmulation = SenderMonitorFaultEmulation.Healthy;
                                this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.senderMonitorFaultEmulation, null);

                                return new CommandResponseError(handle, NcMethodStatus.DeviceError, "Property can only be changed when associated sender has been Activated");
                            }
                        }
                        else
                        {
                            this.senderMonitorFaultEmulation = enumValueSenderEmulation;
                            this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.senderMonitorFaultEmulation, null);
                        }
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    }
                default:
                    return super.Set(oid, id, value, handle);
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.BadOid, 'OID could not be found');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public override SetValidate(oid: number, id: NcElementId, value: any, handle: number) : CommandResponseNoValue
    {
        //ExampleControl

        if(oid == this.oid)
        {
            let key: string = `${id.level}p${id.index}`;

            switch(key)
            {
                case '3p1':
                    let valueEnum = value as ExampleEnum;
                    if(valueEnum !== undefined && ExampleEnum.hasOwnProperty(valueEnum))
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    else
                        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid property value');
                case '3p2':
                    if(value != null && value != undefined && typeof value === 'string')
                    {
                        if(value.length > 0 && value.length <= 10)
                            return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                        else
                            return new CommandResponseError(handle, NcMethodStatus.ParameterError, "Value does not respect constraints");
                    }
                    else
                        return new CommandResponseError(handle, NcMethodStatus.ParameterError, "Invalid property value");
                case '3p3':
                    if(value != null && value != undefined && typeof value === 'number')
                    {
                        if(value >= 0 && value <= 1000)
                            return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                        else
                            return new CommandResponseError(handle, NcMethodStatus.ParameterError, "Value does not respect constraints");
                    }
                    else
                        return new CommandResponseError(handle, NcMethodStatus.ParameterError, "Invalid property value");
                case '3p4':
                    if(value != null && value != undefined && typeof value === 'boolean')
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    else
                        return new CommandResponseError(handle, NcMethodStatus.ParameterError, "Invalid property value");
                case '3p5':
                    let valueObj = value as ExampleDataType;
                    if(valueObj != null && valueObj !== undefined)
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    else
                        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid property value');
                case '3p6':
                case '3p7':
                case '3p8':
                    return new CommandResponseError(handle, NcMethodStatus.Readonly, "Property is read only");
                case '3p9':
                    let stringSequence = value as string[];
                    if(stringSequence != null && stringSequence !== undefined)
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    else
                        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid property value');
                case '3p10':
                    let booleanSequence = value as boolean[];
                    if(booleanSequence != null && booleanSequence !== undefined)
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    else
                        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid property value');
                case '3p11':
                    let enumSequence = value as ExampleEnum[];
                    if(enumSequence != null && enumSequence !== undefined)
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    else
                        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid property value');
                case '3p12':
                    let numberSequence = value as number[];
                    if(numberSequence != null && numberSequence !== undefined)
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    else
                        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid property value');
                case '3p13':
                    let objectSequence = value as ExampleDataType[];
                    if(objectSequence != null && objectSequence !== undefined)
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    else
                        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid property value');
                case '3p14':
                    let enumValueReceiverEmulation = value as ReceiverMonitorFaultEmulation;
                    if(enumValueReceiverEmulation != null && enumValueReceiverEmulation !== undefined)
                    {
                        if(this.receiverMonitoringContext != null && !this.receiverMonitoringContext.activated)
                            return new CommandResponseError(handle, NcMethodStatus.DeviceError, "Property can only be changed when associated receiver has been Activated");
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    }
                    else
                        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, "Invalid property value");
                case '3p15':
                    let enumValueSenderEmulation = value as SenderMonitorFaultEmulation;
                    if(enumValueSenderEmulation != null && enumValueSenderEmulation !== undefined)
                    {
                        if(this.senderMonitoringContext != null && !this.senderMonitoringContext.activated)
                            return new CommandResponseError(handle, NcMethodStatus.DeviceError, "Property can only be changed when associated receiver has been Activated");
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    }
                    else
                        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, "Invalid property value");
                default:
                    return super.SetValidate(oid, id, value, handle);
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.BadOid, 'OID could not be found');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                                    if(stringArg.length < 0 || stringArg.length > 10)
                                        return new CommandResponseError(handle, NcMethodStatus.OK, "stringArg does not respect defined constraints");

                                    if(numberArg && numberArg > 0)
                                    {
                                        if(numberArg < 0 || numberArg > 1000)
                                            return new CommandResponseError(handle, NcMethodStatus.ParameterError, "Value does not respect constraints");

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
                case '3m4':
                    {
                        if(this.receiverMonitoringContext != null && this.receiverMonitoringContext.activated)
                            this.receiverMonitoringContext.SimulateGrandMasterChange();
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                    }
                default:
                    return super.InvokeMethod(oid, methodId, args, handle);
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.BadOid, 'OID could not be found');
    }

    public ReceiverDisconnected()
    {
        this.receiverMonitorFaultEmulation = ReceiverMonitorFaultEmulation.Healthy;
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 14), NcPropertyChangeType.ValueChanged, this.receiverMonitorFaultEmulation, null);
    }

    public SenderDeactivated()
    {
        this.senderMonitorFaultEmulation = SenderMonitorFaultEmulation.Healthy;
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 15), NcPropertyChangeType.ValueChanged, this.senderMonitorFaultEmulation, null);
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
                new NcPropertyDescriptor(new NcElementId(3, 13), "objectSequence", "ExampleDataType", false, false, true, null, "Example object sequence property"),
                new NcPropertyDescriptor(new NcElementId(3, 14), "receiverMonitorFaultEmulation", "ReceiverMonitorFaultEmulation", false, false, false, null, "Receiver monitor fault emulation property"),
                new NcPropertyDescriptor(new NcElementId(3, 15), "senderMonitorFaultEmulation", "SenderMonitorFaultEmulation", false, false, false, null, "Sender monitor fault emulation property"),
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
                ], "Example method with object argument"),
                new NcMethodDescriptor(new NcElementId(3, 4), "SimulateReceiverGrandMasterChange", "NcMethodResult", [], "Triggers the associated receiver to simulate a grand master change")
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

    public override GetAllProperties(recurse: boolean, includeDescriptors: boolean) : NcObjectPropertiesHolder[]
    {
        let descriptor = ExampleControl.GetClassDescriptor(false);
        var propDescriptors: { [id: string] : NcPropertyDescriptor; } = {};

        descriptor.properties.forEach(p => {
            propDescriptors[NcElementId.ToPropertyString(p.id)] = p;
        });

        let properties = [
            new NcObjectPropertiesHolder(this.GetRolePath(),
            [
                this.ownerObject?.GetRolePath() ?? []
            ], 
            [
                new NcPropertyHolder(new NcPropertyId(3, 1), includeDescriptors ? propDescriptors['3p1'] : null, this.enumProperty),
                new NcPropertyHolder(new NcPropertyId(3, 2), includeDescriptors ? propDescriptors['3p2'] : null, this.stringProperty),
                new NcPropertyHolder(new NcPropertyId(3, 3), includeDescriptors ? propDescriptors['3p3'] : null, this.numberProperty),
                new NcPropertyHolder(new NcPropertyId(3, 4), includeDescriptors ? propDescriptors['3p4'] : null, this.booleanProperty),
                new NcPropertyHolder(new NcPropertyId(3, 5), includeDescriptors ? propDescriptors['3p5'] : null, this.objectProperty),
                new NcPropertyHolder(new NcPropertyId(3, 6), includeDescriptors ? propDescriptors['3p6'] : null, this.methodNoArgsCount),
                new NcPropertyHolder(new NcPropertyId(3, 7), includeDescriptors ? propDescriptors['3p7'] : null, this.methodSimpleArgsCount),
                new NcPropertyHolder(new NcPropertyId(3, 8), includeDescriptors ? propDescriptors['3p8'] : null, this.methodObjectArgCount),
                new NcPropertyHolder(new NcPropertyId(3, 9), includeDescriptors ? propDescriptors['3p9'] : null, this.stringSequence),
                new NcPropertyHolder(new NcPropertyId(3, 10), includeDescriptors ? propDescriptors['3p10'] : null, this.booleanSequence),
                new NcPropertyHolder(new NcPropertyId(3, 11), includeDescriptors ? propDescriptors['3p11'] : null, this.enumSequence),
                new NcPropertyHolder(new NcPropertyId(3, 12), includeDescriptors ? propDescriptors['3p12'] : null, this.numberSequence),
                new NcPropertyHolder(new NcPropertyId(3, 13), includeDescriptors ? propDescriptors['3p13'] : null, this.objectSequence),
                new NcPropertyHolder(new NcPropertyId(3, 14), includeDescriptors ? propDescriptors['3p14'] : null, this.receiverMonitorFaultEmulation),
                new NcPropertyHolder(new NcPropertyId(3, 15), includeDescriptors ? propDescriptors['3p15'] : null, this.senderMonitorFaultEmulation)
            ], [], this.isRebuildable)
        ];

        properties[0].values = properties[0].values.concat(super.GetAllProperties(recurse, includeDescriptors)[0].values);

        return properties;
    }

    public override Restore(restoreArguments: RestoreArguments, applyChanges: boolean) : NcObjectPropertiesSetValidation[]
    {
        let validationEntries = new Array<NcObjectPropertiesSetValidation>();

        let localRolePath = this.GetRolePath().join('.');

        let myRestoreData = restoreArguments.dataSet.values.find(f => f.path.join('.') == localRolePath);
        if(myRestoreData)
        {
            console.log(`Found restore data for path: ${localRolePath}, applyChanges: ${applyChanges}`);

            let myNotices = new Array<NcPropertyRestoreNotice>();

            let descriptor = ExampleControl.GetClassDescriptor(true);
            var propDescriptors: { [id: string] : NcPropertyDescriptor; } = {};

            descriptor.properties.forEach(p => {
                propDescriptors[NcElementId.ToPropertyString(p.id)] = p;
            });

            myRestoreData.values.forEach(propertyData => {
                let propertyId = NcElementId.ToPropertyString(propertyData.id);

                //Perform further validation
                let response : CommandResponseNoValue | null = null;

                if(applyChanges)
                    response = this.Set(this.oid, propertyData.id, propertyData.value, 0);
                else
                    response = this.SetValidate(this.oid, propertyData.id, propertyData.value, 0);

                console.log(`Restore response for path: ${localRolePath}, id: ${propertyId}, name: ${propDescriptors[propertyId].name}, status: ${response.result['status']}, requested value: ${propertyData.value}`);

                if(response.result['status'] != NcMethodStatus.OK)
                {
                    let noticeMessage = "Property could not be changed due to internal error";

                    if(response.result['errorMessage'])
                        noticeMessage = response.result['errorMessage']

                    console.log(`Internal error notice for path: ${localRolePath}, id: ${propertyId}, name: ${propDescriptors[propertyId].name}, notice: ${noticeMessage}, requested value: ${propertyData.value}`);

                    myNotices.push(new NcPropertyRestoreNotice(
                        propertyData.id,
                        propDescriptors[propertyId].name,
                        NcPropertyRestoreNoticeType.Warning,
                        noticeMessage));
                }
            });

            validationEntries.push(new NcObjectPropertiesSetValidation(this.GetRolePath(), NcRestoreValidationStatus.Ok, myNotices, myNotices.length > 0 ? 'Some properties have notices' : null));
        }

        return validationEntries;
    }
}