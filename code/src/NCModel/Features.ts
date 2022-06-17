import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { CommandResponseNoValue, CommandResponseWithValue } from '../NCProtocol/Commands';
import { INotificationContext } from '../SessionManager';
import { NcAgent } from './Agents';
import { BaseType, myIdDecorator, NcClassDescriptor, NcDatatypeDescriptor, NcDatatypeDescriptorStruct, NcElementId, NcLockState, NcMethodDescriptor, NcMethodStatus, NcObject, NcPort, NcPropertyDescriptor, NcTouchpoint } from './Core';

export abstract class NcWorker extends NcObject
{
    @myIdDecorator('2p1')
    public enabled: boolean;

    @myIdDecorator('2p2')
    public ports: NcPort[] | null;

    @myIdDecorator('2p3')
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
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, lockable, lockState, touchpoints, notificationContext);

        this.enabled = enabled;
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
                case '2p1':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.enabled, null);
                case '2p2':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.ports, null);
                case '2p3':
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
                case '2p1':
                case '2p2':
                case '2p3':
                    return new CommandResponseNoValue(handle, NcMethodStatus.ProcessingFailed, 'Property is readonly');
                default:
                    return super.Set(oid, id, value, handle);
            }
        }

        return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }
}

export abstract class NcActuator extends NcWorker
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
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, lockable, lockState, touchpoints, enabled, ports, latency, notificationContext);
    }
}

export class NcGain extends NcActuator
{
    @myIdDecorator('4p1')
    public setPoint: number;

    public classID: number[] = [ 1, 2, 1, 1 ];
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
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, lockable, lockState, touchpoints, enabled, ports, latency, notificationContext);

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
                case '4p1':
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
                case '4p1':
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
                new NcPropertyDescriptor(new NcElementId(2, 1), "enabled", "ncBoolean", true, false, true),
                new NcPropertyDescriptor(new NcElementId(2, 2), "ports", "ncPort", true, false, true),
                new NcPropertyDescriptor(new NcElementId(2, 3), "latency", "ncTimeInterval", true, false, true),
                new NcPropertyDescriptor(new NcElementId(4, 1), "setPoint", "ncDB", true, false, true)
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
        return new NcDatatypeDescriptorStruct("ncReceiverStatus", [
            new NcPropertyDescriptor(new NcElementId(1, 1), "connectionStatus", "ncConnectionStatus", true, true, true),
            new NcPropertyDescriptor(new NcElementId(1, 2), "payloadStatus", "ncPayloadStatus", true, true, true)
        ]);
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcReceiverMonitor extends NcAgent
{
    @myIdDecorator('1p1')
    public classID: number[] = [ 1, 4, 1 ];

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
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, lockable, lockState, touchpoints, notificationContext);

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

    public override InvokeMethod(oid: number, methodID: NcElementId, args: { [key: string]: any; } | null, handle: number): CommandResponseNoValue 
    {
        if(oid == this.oid)
        {
            let key: string = `${methodID.level}m${methodID.index}`;

            switch(key)
            {
                case '3m1':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, new NcReceiverStatus(this.connectionStatus, this.payloadStatus), null);
                default:
                    return super.InvokeMethod(oid, methodID, args, handle);
            }
        }

        return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }

    public static override GetClassDescriptor(): NcClassDescriptor 
    {
        let baseDescriptor = super.GetClassDescriptor();

        let currentClassDescriptor = new NcClassDescriptor("NcReceiverMonitor class descriptor",
            [ 
                new NcPropertyDescriptor(new NcElementId(3, 1), "connectionStatus", "ncConnectionStatus", true, false, true),
                new NcPropertyDescriptor(new NcElementId(3, 2), "connectionStatusMessage", "ncString", true, false, true),
                new NcPropertyDescriptor(new NcElementId(3, 3), "payloadStatus", "ncPayloadStatus", true, false, true),
                new NcPropertyDescriptor(new NcElementId(3, 4), "payloadStatusMessage", "ncString", true, false, true)
            ],
            [ 
                new NcMethodDescriptor(new NcElementId(3, 1), "getStatus", "ncMethodResultReceiverStatus", [])
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
    public classID: number[] = [ 1, 2, 2 ];

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
        ports: NcPort[] | null,
        latency: number | null,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, lockable, lockState, touchpoints, enabled, ports, latency, notificationContext);

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

    public override InvokeMethod(oid: number, methodID: NcElementId, args: { [key: string]: any; } | null, handle: number): CommandResponseNoValue 
    {
        if(oid == this.oid)
        {
            let key: string = `${methodID.level}m${methodID.index}`;

            switch(key)
            {
                default:
                    return super.InvokeMethod(oid, methodID, args, handle);
            }
        }

        return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }

    public static override GetClassDescriptor(): NcClassDescriptor 
    {
        let baseDescriptor = super.GetClassDescriptor();

        let currentClassDescriptor = new NcClassDescriptor("NcDemo class descriptor",
            [ 
                new NcPropertyDescriptor(new NcElementId(3, 1), "enumProperty", "ncDemoEnum", true, false, true),
                new NcPropertyDescriptor(new NcElementId(3, 2), "stringProperty", "ncString", true, false, true),
                new NcPropertyDescriptor(new NcElementId(3, 3), "numberProperty", "ncUint64", true, false, true),
                new NcPropertyDescriptor(new NcElementId(3, 4), "booleanProperty", "ncBoolean", true, false, true)
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