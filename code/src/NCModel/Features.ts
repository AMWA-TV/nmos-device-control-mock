import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { CommandResponseNoValue, CommandResponseWithValue } from '../NCProtocol/Commands';
import { INotificationContext } from '../SessionManager';
import { BaseType, myIdDecorator, NcClassDescriptor, NcDatatypeDescriptor, NcDatatypeDescriptorStruct, NcElementId, NcFieldDescriptor, NcLockState, NcMethodDescriptor, NcMethodStatus, NcObject, NcParameterConstraintNumber, NcParameterConstraintString, NcPort, NcPropertyDescriptor, NcTouchpoint } from './Core';

export abstract class NcWorker extends NcObject
{
    @myIdDecorator('2p1')
    public enabled: boolean;

    public constructor(
        oid: number,
        constantOid: boolean,
        owner: number | null,
        role: string,
        userLabel: string,
        lockable: boolean,
        lockState: NcLockState,
        touchpoints: NcTouchpoint[],
        enabled: boolean,
        description: string,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, lockable, lockState, touchpoints, description, notificationContext);

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
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.enabled, null);
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
                case '2p1':
                    return new CommandResponseNoValue(handle, NcMethodStatus.ProcessingFailed, 'Property is readonly');
                default:
                    return super.Set(oid, id, value, handle);
            }
        }

        return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }
}

export abstract class NcSignalWorker extends NcWorker
{
    @myIdDecorator('3p1')
    public ports: NcPort[] | null;

    @myIdDecorator('3p2')
    public latency: number | null;

    public constructor(
        oid: number,
        constantOid: boolean,
        owner: number | null,
        role: string,
        userLabel: string,
        lockable: boolean,
        lockState: NcLockState,
        touchpoints: NcTouchpoint[],
        enabled: boolean,
        ports: NcPort[] | null,
        latency: number | null,
        description: string,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, lockable, lockState, touchpoints, enabled, description, notificationContext);

        this.ports = ports;
        this.latency = latency;
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
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.ports, null);
                case '3p2':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.latency, null);
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
                    return new CommandResponseNoValue(handle, NcMethodStatus.ProcessingFailed, 'Property is readonly');
                default:
                    return super.Set(oid, id, value, handle);
            }
        }

        return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }
}

export abstract class NcActuator extends NcSignalWorker
{
    public constructor(
        oid: number,
        constantOid: boolean,
        owner: number | null,
        role: string,
        userLabel: string,
        lockable: boolean,
        lockState: NcLockState,
        touchpoints: NcTouchpoint[],
        enabled: boolean,
        ports: NcPort[] | null,
        latency: number | null,
        description: string,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, lockable, lockState, touchpoints, enabled, ports, latency, description, notificationContext);
    }
}

export class NcGain extends NcActuator
{
    @myIdDecorator('5p1')
    public setPoint: number;

    public classID: number[] = [ 1, 2, 1, 1, 1 ];
    public classVersion: string = "1.0.0";

    public constructor(
        oid: number,
        constantOid: boolean,
        owner: number | null,
        role: string,
        userLabel: string,
        lockable: boolean,
        lockState: NcLockState,
        touchpoints: NcTouchpoint[],
        enabled: boolean,
        ports: NcPort[] | null,
        latency: number | null,
        setPoint: number,
        description: string,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, lockable, lockState, touchpoints, enabled, ports, latency, description, notificationContext);

        this.setPoint = setPoint;
    }

    //'1m1'
    public override Get(oid: number, propertyId: NcElementId, handle: number) : CommandResponseNoValue
    {
        if(oid == this.oid)
        {
            let key: string = `${propertyId.level}p${propertyId.index}`;

            switch(key)
            {
                case '5p1':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.setPoint, null);
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
                case '5p1':
                    this.setPoint = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, this.setPoint);
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

        let currentClassDescriptor = new NcClassDescriptor("NcGain class descriptor",
            [ 
                new NcPropertyDescriptor(new NcElementId(2, 1), "enabled", "NcBoolean", false, true, false, false, null, "TRUE iff worker is enabled"),
                new NcPropertyDescriptor(new NcElementId(3, 1), "ports", "NcPort", false, true, false, true, null, "The worker's signal ports"),
                new NcPropertyDescriptor(new NcElementId(3, 2), "latency", "NcTimeInterval", true, true, true, false, null, "Processing latency of this object (null if not defined)"),
                new NcPropertyDescriptor(new NcElementId(5, 1), "setPoint", "NcDB", false, false, false, false, null, "Gain set point value")
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

    public static override GetTypeDescriptor(): NcDatatypeDescriptor
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
    @myIdDecorator('1p1')
    public classID: number[] = [ 1, 2, 2 ];

    @myIdDecorator('1p2')
    public classVersion: string = "1.0.0";

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
        owner: number | null,
        role: string,
        userLabel: string,
        lockable: boolean,
        lockState: NcLockState,
        touchpoints: NcTouchpoint[],
        enabled: boolean,
        description: string,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, lockable, lockState, touchpoints, enabled, description, notificationContext);

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

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 1), this.connectionStatus);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 3), this.payloadStatus);
    }

    public Disconnected()
    {
        this.connectionStatus = NcConnectionStatus.Undefined;
        this.payloadStatus = NcPayloadStatus.Undefined;

        this.connectionStatusMessage = null;
        this.payloadStatusMessage = null;

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 1), this.connectionStatus);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 3), this.payloadStatus);
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
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.connectionStatus, null);
                case '3p2':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.connectionStatusMessage, null);
                case '3p3':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.payloadStatus, null);
                case '3p4':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.payloadStatusMessage, null);
                default:
                    return super.Get(oid, id, handle);
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
                    return new CommandResponseNoValue(handle, NcMethodStatus.ProcessingFailed, 'Property is readonly');
                default:
                    return super.Set(oid, id, value, handle);
            }
        }

        return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }

    public override InvokeMethod(oid: number, methodId: NcElementId, args: { [key: string]: any; } | null, handle: number): CommandResponseNoValue 
    {
        if(oid == this.oid)
        {
            let key: string = `${methodId.level}m${methodId.index}`;

            switch(key)
            {
                case '3m1':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, new NcReceiverStatus(this.connectionStatus, this.payloadStatus), null);
                default:
                    return super.InvokeMethod(oid, methodId, args, handle);
            }
        }

        return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }

    public static override GetClassDescriptor(): NcClassDescriptor 
    {
        let baseDescriptor = super.GetClassDescriptor();

        let currentClassDescriptor = new NcClassDescriptor("NcReceiverMonitor class descriptor",
            [
                new NcPropertyDescriptor(new NcElementId(2, 1), "enabled", "NcBoolean", false, true, false, false, null, "TRUE iff worker is enabled"),
                new NcPropertyDescriptor(new NcElementId(3, 1), "connectionStatus", "NcConnectionStatus", true, false, false, false, null, "Connection status property"),
                new NcPropertyDescriptor(new NcElementId(3, 2), "connectionStatusMessage", "NcString", true, false, true, false, null, "Connection status message property"),
                new NcPropertyDescriptor(new NcElementId(3, 3), "payloadStatus", "NcPayloadStatus", true, false, false, false, null, "Payload status property"),
                new NcPropertyDescriptor(new NcElementId(3, 4), "payloadStatusMessage", "NcString", true, false, true, false, null, "Payload status message property")
            ],
            [
                new NcMethodDescriptor(new NcElementId(3, 1), "GetStatus", "NcMethodResultReceiverStatus", [], "Method to retrieve both connection status and payload status in one call")
            ],
            []
        );

        currentClassDescriptor.properties = currentClassDescriptor.properties.concat(baseDescriptor.properties);
        currentClassDescriptor.methods = currentClassDescriptor.methods.concat(baseDescriptor.methods);
        currentClassDescriptor.events = currentClassDescriptor.events.concat(baseDescriptor.events);

        return currentClassDescriptor;
    }
}

enum NcDemoEnum
{
    Undefined = 0,
    Alpha = 1,
    Beta = 2,
    Gamma = 3
}

export class NcDemo extends NcWorker
{
    @myIdDecorator('1p1')
    public classID: number[] = [ 1, 2, 0, 1 ];

    @myIdDecorator('1p2')
    public classVersion: string = "1.0.0";

    @myIdDecorator('3p1')
    public enumProperty: NcDemoEnum;

    @myIdDecorator('3p2')
    public stringProperty: string | null;

    @myIdDecorator('3p3')
    public numberProperty: number;

    @myIdDecorator('3p4')
    public booleanProperty: boolean;

    public constructor(
        oid: number,
        constantOid: boolean,
        owner: number | null,
        role: string,
        userLabel: string,
        lockable: boolean,
        lockState: NcLockState,
        touchpoints: NcTouchpoint[],
        enabled: boolean,
        description: string,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, lockable, lockState, touchpoints, enabled, description, notificationContext);

        this.enumProperty = NcDemoEnum.Undefined;
        this.stringProperty = "test";
        this.numberProperty = 3;
        this.booleanProperty = false;
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
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.enumProperty, null);
                case '3p2':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.stringProperty, null);
                case '3p3':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.numberProperty, null);
                case '3p4':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.booleanProperty, null);
                default:
                    return super.Get(oid, id, handle);
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
                    this.enumProperty = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, this.enumProperty);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
                case '3p2':
                    this.stringProperty = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, this.stringProperty);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
                case '3p3':
                    this.numberProperty = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, this.numberProperty);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
                case '3p4':
                    this.booleanProperty = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, this.booleanProperty);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
                default:
                    return super.Set(oid, id, value, handle);
            }
        }

        return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }

    public override InvokeMethod(oid: number, methodId: NcElementId, args: { [key: string]: any; } | null, handle: number): CommandResponseNoValue 
    {
        if(oid == this.oid)
        {
            let key: string = `${methodId.level}m${methodId.index}`;

            switch(key)
            {
                default:
                    return super.InvokeMethod(oid, methodId, args, handle);
            }
        }

        return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }

    public static override GetClassDescriptor(): NcClassDescriptor 
    {
        let baseDescriptor = super.GetClassDescriptor();

        let currentClassDescriptor = new NcClassDescriptor("NcDemo class descriptor",
            [
                new NcPropertyDescriptor(new NcElementId(2, 1), "enabled", "NcBoolean", false, true, false, false, null, "TRUE iff worker is enabled"),
                new NcPropertyDescriptor(new NcElementId(3, 1), "enumProperty", "NcDemoEnum", false, false, false, false, null, "Demo enum property"),
                new NcPropertyDescriptor(new NcElementId(3, 2), "stringProperty", "NcString", false, false, false, false, new NcParameterConstraintString(10, null),
                    "Demo string property"),
                new NcPropertyDescriptor(new NcElementId(3, 3), "numberProperty", "NcUint64", false, false, false, false, new NcParameterConstraintNumber(1000, 0, 1),
                    "Demo numeric property"),
                new NcPropertyDescriptor(new NcElementId(3, 4), "booleanProperty", "NcBoolean", false, false, false, false, null, "Demo boolean property")
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