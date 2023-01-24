import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { CommandResponseNoValue, CommandResponseWithValue } from '../NCProtocol/Commands';
import { WebSocketConnection } from '../Server';
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
    NcParameterConstraintNumber,
    NcParameterConstraintString,
    NcParameterDescriptor,
    NcPort,
    NcPropertyChangeType,
    NcPropertyDescriptor,
    NcTouchpoint } from './Core';

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
        touchpoints: NcTouchpoint[],
        enabled: boolean,
        description: string,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, touchpoints, description, notificationContext);

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
                    return new CommandResponseNoValue(handle, NcMethodStatus.Readonly, 'Property is readonly');
                default:
                    return super.Set(oid, id, value, handle);
            }
        }

        return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }

    public static override GetClassDescriptor(): NcClassDescriptor 
    {
        let baseDescriptor = super.GetClassDescriptor();

        let currentClassDescriptor = new NcClassDescriptor("NcWorker class descriptor",
            [
                new NcPropertyDescriptor(new NcElementId(2, 1), "enabled", "NcBoolean", false, true, false, false, null, "TRUE iff worker is enabled")
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
        touchpoints: NcTouchpoint[],
        enabled: boolean,
        ports: NcPort[] | null,
        latency: number | null,
        description: string,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, touchpoints, enabled, description, notificationContext);

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
                    return new CommandResponseNoValue(handle, NcMethodStatus.Readonly, 'Property is readonly');
                default:
                    return super.Set(oid, id, value, handle);
            }
        }

        return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }

    public static override GetClassDescriptor(): NcClassDescriptor 
    {
        let baseDescriptor = super.GetClassDescriptor();

        let currentClassDescriptor = new NcClassDescriptor("NcSignalWorker class descriptor",
            [
                new NcPropertyDescriptor(new NcElementId(3, 1), "ports", "NcPort", false, true, false, true, null, "The worker's signal ports"),
                new NcPropertyDescriptor(new NcElementId(3, 2), "latency", "NcTimeInterval", true, true, true, false, null, "Processing latency of this object (null if not defined)")
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

export abstract class NcActuator extends NcSignalWorker
{
    public constructor(
        oid: number,
        constantOid: boolean,
        owner: number | null,
        role: string,
        userLabel: string,
        touchpoints: NcTouchpoint[],
        enabled: boolean,
        ports: NcPort[] | null,
        latency: number | null,
        description: string,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, touchpoints, enabled, ports, latency, description, notificationContext);
    }

    public static override GetClassDescriptor(): NcClassDescriptor 
    {
        let baseDescriptor = super.GetClassDescriptor();

        let currentClassDescriptor = new NcClassDescriptor("NcActuator class descriptor", [], [], []);

        currentClassDescriptor.properties = currentClassDescriptor.properties.concat(baseDescriptor.properties);
        currentClassDescriptor.methods = currentClassDescriptor.methods.concat(baseDescriptor.methods);
        currentClassDescriptor.events = currentClassDescriptor.events.concat(baseDescriptor.events);

        return currentClassDescriptor;
    }
}

export class NcGain extends NcActuator
{
    @myIdDecorator('5p1')
    public gainValue: number;

    public classID: number[] = [ 1, 2, 1, 1, 1 ];
    public classVersion: string = "1.0.0";

    public constructor(
        oid: number,
        constantOid: boolean,
        owner: number | null,
        role: string,
        userLabel: string,
        touchpoints: NcTouchpoint[],
        enabled: boolean,
        ports: NcPort[] | null,
        latency: number | null,
        gainValue: number,
        description: string,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, touchpoints, enabled, ports, latency, description, notificationContext);

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
                case '5p1':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.gainValue, null);
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
                    this.gainValue = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.gainValue, null);
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
                new NcPropertyDescriptor(new NcElementId(5, 1), "gainValue", "NcDB", false, false, false, false, null, "Gain value")
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

export class NcIdentBeacon extends NcWorker
{
    @myIdDecorator('3p1')
    public active: boolean;

    public classID: number[] = [ 1, 2, 2 ];
    public classVersion: string = "1.0.0";
    
    public constructor(
        oid: number,
        constantOid: boolean,
        owner: number | null,
        role: string,
        userLabel: string,
        touchpoints: NcTouchpoint[],
        enabled: boolean,
        active: boolean,
        description: string,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, touchpoints, enabled, description, notificationContext);

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
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.active, null);
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
                    this.active = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.active, null);
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

        let currentClassDescriptor = new NcClassDescriptor("NcIdentBeacon class descriptor",
            [
                new NcPropertyDescriptor(new NcElementId(3, 1), "active", "NcBoolean", false, false, false, false, null, "Indicator active state")
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
    public classID: number[] = [ 1, 2, 3 ];

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
        touchpoints: NcTouchpoint[],
        enabled: boolean,
        description: string,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, touchpoints, enabled, description, notificationContext);

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
                    return new CommandResponseNoValue(handle, NcMethodStatus.Readonly, 'Property is readonly');
                default:
                    return super.Set(oid, id, value, handle);
            }
        }

        return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }

    public override InvokeMethod(socket: WebSocketConnection, oid: number, methodId: NcElementId, args: { [key: string]: any; } | null, handle: number): CommandResponseNoValue 
    {
        if(oid == this.oid)
        {
            let key: string = `${methodId.level}m${methodId.index}`;

            switch(key)
            {
                case '3m1':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, new NcReceiverStatus(this.connectionStatus, this.payloadStatus), null);
                default:
                    return super.InvokeMethod(socket, oid, methodId, args, handle);
            }
        }

        return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }

    public static override GetClassDescriptor(): NcClassDescriptor 
    {
        let baseDescriptor = super.GetClassDescriptor();

        let currentClassDescriptor = new NcClassDescriptor("NcReceiverMonitor class descriptor",
            [
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

export class DemoDataType extends BaseType
{
    public enumProperty: NcDemoEnum;
    public stringProperty: string | null;
    public numberProperty: number;
    public booleanProperty: boolean;

    constructor(
        enumProperty: NcDemoEnum,
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

    public static override GetTypeDescriptor(): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("DemoDataType", [
            new NcFieldDescriptor("enumProperty", "NcDemoEnum", false, false, null, "Enum property demo"),
            new NcFieldDescriptor("stringProperty", "NcString", false, false, new NcParameterConstraintString(10, null), "String property demo"),
            new NcFieldDescriptor("numberProperty", "NcUint64", false, false, new NcParameterConstraintNumber(1000, 0, 1), "Number property demo"),
            new NcFieldDescriptor("booleanProperty", "NcBoolean", false, false, null, "Boolean property demo")
        ], null, null, "Demo data type");
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
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

    @myIdDecorator('3p5')
    public objectProperty: DemoDataType;

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
    public enumSequence: NcDemoEnum[];

    @myIdDecorator('3p12')
    public numberSequence: number[];

    @myIdDecorator('3p13')
    public objectSequence: DemoDataType[];

    public constructor(
        oid: number,
        constantOid: boolean,
        owner: number | null,
        role: string,
        userLabel: string,
        touchpoints: NcTouchpoint[],
        enabled: boolean,
        description: string,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, touchpoints, enabled, description, notificationContext);

        this.enumProperty = NcDemoEnum.Undefined;
        this.stringProperty = "test";
        this.numberProperty = 3;
        this.booleanProperty = false;
        this.objectProperty = new DemoDataType(NcDemoEnum.Undefined, "default", 5, false);
        this.methodNoArgsCount = 0;
        this.methodSimpleArgsCount = 0;
        this.methodObjectArgCount = 0;
        this.stringSequence = [ "red", "blue", "green" ];
        this.booleanSequence = [ true, false];
        this.enumSequence = [ NcDemoEnum.Alpha, NcDemoEnum.Gamma ];
        this.numberSequence = [ 0, 50, 88];
        this.objectSequence = [ new DemoDataType(NcDemoEnum.Alpha, "demo", 50, false), new DemoDataType(NcDemoEnum.Gamma, "different", 75, true) ];
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
                case '3p5':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.objectProperty, null);
                case '3p6':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.methodNoArgsCount, null);
                case '3p7':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.methodSimpleArgsCount, null);
                case '3p8':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.methodObjectArgCount, null);
                case '3p9':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.stringSequence, null);
                case '3p10':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.booleanSequence, null);
                case '3p11':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.enumSequence, null);
                case '3p12':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.numberSequence, null);
                case '3p13':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.objectSequence, null);
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
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.enumProperty, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
                case '3p2':
                    this.stringProperty = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.stringProperty, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
                case '3p3':
                    this.numberProperty = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.numberProperty, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
                case '3p4':
                    this.booleanProperty = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.booleanProperty, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
                case '3p5':
                    this.objectProperty = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.objectProperty, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
                case '3p6':
                case '3p7':
                case '3p8':
                        return new CommandResponseNoValue(handle, NcMethodStatus.Readonly, "Property is read only");
                case '3p9':
                    this.stringSequence = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.stringSequence, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
                case '3p10':
                    this.booleanSequence = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.booleanSequence, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
                case '3p11':
                    this.enumSequence = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.enumSequence, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
                case '3p12':
                    this.numberSequence = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.numberSequence, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
                case '3p13':
                    this.objectSequence = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.objectSequence, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
                default:
                    return super.Set(oid, id, value, handle);
            }
        }

        return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }

    public override InvokeMethod(socket: WebSocketConnection, oid: number, methodId: NcElementId, args: { [key: string]: any; } | null, handle: number): CommandResponseNoValue 
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
                                                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, itemValue, null);
                                                else
                                                    return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Index could not be found');
                                            }
                                        case '3p10':
                                            {
                                                let itemValue = this.booleanSequence[index];
                                                if(itemValue)
                                                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, itemValue, null);
                                                else
                                                    return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Index could not be found');
                                            }
                                        case '3p11':
                                            {
                                                let itemValue = this.enumSequence[index];
                                                if(itemValue)
                                                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, itemValue, null);
                                                else
                                                    return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Index could not be found');
                                            }
                                        case '3p12':
                                            {
                                                let itemValue = this.numberSequence[index];
                                                if(itemValue !== undefined)
                                                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, itemValue, null);
                                                else
                                                    return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Index could not be found');
                                            }
                                        case '3p13':
                                            {
                                                let itemValue = this.objectSequence[index];
                                                if(itemValue)
                                                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, itemValue, null);
                                                else
                                                    return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Index could not be found');
                                            }
                                        default:
                                            return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Property could not be found');
                                    }
                                }
                                else
                                    return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Invalid index argument provided');
                            }
                            else
                                return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Invalid id argument provided');
                        }
                        else
                            return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Invalid arguments provided');
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
    
                                                        return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
                                                    }
                                                    else
                                                        return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Invalid value argument provided');
                                                }
                                                else
                                                    return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Index could not be found');
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
    
                                                        return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
                                                    }
                                                    else
                                                        return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Invalid value argument provided');
                                                }
                                                else
                                                    return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Index could not be found');
                                            }
                                        case '3p11':
                                            {
                                                if (this.enumSequence[index] !== undefined) 
                                                {
                                                    let value = args['value'] as NcDemoEnum;
                                                    if(value !== undefined)
                                                    {
                                                        this.enumSequence[index] = value;
                                                        this.notificationContext.NotifyPropertyChanged(this.oid, propertyId, NcPropertyChangeType.SequenceItemChanged, value, index);
    
                                                        return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
                                                    }
                                                    else
                                                        return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Invalid value argument provided');
                                                }
                                                else
                                                    return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Index could not be found');
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
    
                                                        return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
                                                    }
                                                    else
                                                        return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Invalid value argument provided');
                                                }
                                                else
                                                    return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Index could not be found');
                                            }
                                        case '3p13':
                                            {
                                                if (this.objectSequence[index] !== undefined) 
                                                {
                                                    let value = args['value'] as DemoDataType;
                                                    if(value !== undefined)
                                                    {
                                                        this.objectSequence[index] = value;
                                                        this.notificationContext.NotifyPropertyChanged(this.oid, propertyId, NcPropertyChangeType.SequenceItemChanged, value, index);

                                                        return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
                                                    }
                                                    else
                                                        return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Invalid value argument provided');
                                                }
                                                else
                                                    return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Index could not be found');
                                            }
                                        default:
                                            return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Property could not be found');
                                    }
                                }
                                else
                                    return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Invalid index argument provided');
                            }
                            else
                                return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Invalid id argument provided');
                        }
                        else
                            return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Invalid arguments provided');
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

                                                return new CommandResponseWithValue(handle, NcMethodStatus.OK, index, null);
                                            }
                                            else
                                                return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Invalid value argument provided');
                                        }
                                    case '3p10':
                                        {
                                            let value = args['value'] as boolean;
                                            if(value !== undefined)
                                            {
                                                this.booleanSequence.push(value);
                                                let index = this.booleanSequence.length - 1;

                                                this.notificationContext.NotifyPropertyChanged(this.oid, propertyId, NcPropertyChangeType.SequenceItemAdded, value, index);

                                                return new CommandResponseWithValue(handle, NcMethodStatus.OK, index, null);
                                            }
                                            else
                                                return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Invalid value argument provided');
                                        }
                                    case '3p11':
                                        {
                                            let value = args['value'] as NcDemoEnum;
                                            if(value !== undefined)
                                            {
                                                this.enumSequence.push(value);
                                                let index = this.enumSequence.length - 1;

                                                this.notificationContext.NotifyPropertyChanged(this.oid, propertyId, NcPropertyChangeType.SequenceItemAdded, value, index);

                                                return new CommandResponseWithValue(handle, NcMethodStatus.OK, index, null);
                                            }
                                            else
                                                return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Invalid value argument provided');
                                        }
                                    case '3p12':
                                        {
                                            let value = args['value'] as number;
                                            if(value !== undefined)
                                            {
                                                this.numberSequence.push(value);
                                                let index = this.numberSequence.length - 1;

                                                this.notificationContext.NotifyPropertyChanged(this.oid, propertyId, NcPropertyChangeType.SequenceItemAdded, value, index);

                                                return new CommandResponseWithValue(handle, NcMethodStatus.OK, index, null);
                                            }
                                            else
                                                return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Invalid value argument provided');
                                        }
                                    case '3p13':
                                        {
                                            let value = args['value'] as DemoDataType;
                                            if(value !== undefined)
                                            {
                                                this.objectSequence.push(value);
                                                let index = this.objectSequence.length - 1;

                                                this.notificationContext.NotifyPropertyChanged(this.oid, propertyId, NcPropertyChangeType.SequenceItemAdded, value, index);

                                                return new CommandResponseWithValue(handle, NcMethodStatus.OK, index, null);
                                            }
                                            else
                                                return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Invalid value argument provided');
                                        }
                                    default:
                                        return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Property could not be found');
                                }
                            }
                            else
                                return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Invalid id argument provided');
                        }
                        else
                            return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Invalid arguments provided');
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

                                                    return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
                                                }
                                                else
                                                    return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Index could not be found');
                                            }
                                        case '3p10':
                                            {
                                                if (this.booleanSequence[index] !== undefined) 
                                                {
                                                    let oldValue = this.booleanSequence[index];

                                                    this.booleanSequence.splice(index, 1);
                                                    this.notificationContext.NotifyPropertyChanged(this.oid, propertyId, NcPropertyChangeType.SequenceItemRemoved, oldValue, index);

                                                    return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
                                                }
                                                else
                                                    return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Index could not be found');
                                            }
                                        case '3p11':
                                            {
                                                if (this.enumSequence[index] !== undefined) 
                                                {
                                                    let oldValue = this.enumSequence[index];

                                                    this.enumSequence.splice(index, 1);
                                                    this.notificationContext.NotifyPropertyChanged(this.oid, propertyId, NcPropertyChangeType.SequenceItemRemoved, oldValue, index);

                                                    return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
                                                }
                                                else
                                                    return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Index could not be found');
                                            }
                                        case '3p12':
                                            {
                                                if (this.numberSequence[index] !== undefined) 
                                                {
                                                    let oldValue = this.numberSequence[index];

                                                    this.numberSequence.splice(index, 1);
                                                    this.notificationContext.NotifyPropertyChanged(this.oid, propertyId, NcPropertyChangeType.SequenceItemRemoved, oldValue, index);

                                                    return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
                                                }
                                                else
                                                    return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Index could not be found');
                                            }
                                        case '3p13':
                                            {
                                                if (this.objectSequence[index] !== undefined) 
                                                {
                                                    let oldValue = this.objectSequence[index];

                                                    this.objectSequence.splice(index, 1);
                                                    this.notificationContext.NotifyPropertyChanged(this.oid, propertyId, NcPropertyChangeType.SequenceItemRemoved, oldValue, index);

                                                    return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
                                                }
                                                else
                                                    return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Index could not be found');
                                            }
                                        default:
                                            return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Property could not be found');
                                    }
                                }
                                else
                                    return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Invalid index argument provided');
                            }
                            else
                                return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Invalid id argument provided');
                        }
                        else
                            return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Invalid arguments provided');
                    }
                case '3m1':
                    {
                        this.methodNoArgsCount = this.methodNoArgsCount + 1;
                        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 6), NcPropertyChangeType.ValueChanged, this.methodNoArgsCount, null);
                        return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
                    }
                case '3m2':
                    {
                        if(args != null &&
                            'enumArg' in args &&
                            'stringArg' in args &&
                            'numberArg' in args &&
                            'booleanArg' in args)
                        {
                            let enumArg = args['enumArg'] as NcDemoEnum;
                            let stringArg = args['stringArg'] as string;
                            let numberArg = args['numberArg'] as number;
                            let booleanArg = args['booleanArg'] as boolean;

                            if(enumArg in NcDemoEnum)
                            {
                                if(stringArg)
                                {
                                    if(numberArg && numberArg > 0)
                                    {
                                        if(booleanArg !== null)
                                        {
                                            this.methodSimpleArgsCount = this.methodSimpleArgsCount + 1;
                                            this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 7), NcPropertyChangeType.ValueChanged, this.methodSimpleArgsCount, null);
                                            return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
                                        }
                                        else
                                            return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Invalid booleanArg argument provided');
                                    }
                                    else
                                        return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Invalid numberArg argument provided');
                                }
                                else
                                    return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Invalid stringArg argument provided');
                            }
                            else
                                return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Invalid enumArg argument provided');
                        }
                        else
                            return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Invalid arguments provided');
                    }
                case '3m3':
                    {
                        if(args != null &&
                            'objArg' in args)
                        {
                            let objArg = args['objArg'] as DemoDataType;
                            if(objArg)
                            {
                                this.methodObjectArgCount = this.methodObjectArgCount + 1;
                                this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(3, 8), NcPropertyChangeType.ValueChanged, this.methodObjectArgCount, null);
                                return new CommandResponseNoValue(handle, NcMethodStatus.OK, null);
                            }
                            else
                                return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Invalid objArg argument provided');
                        }
                        else
                            return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Invalid arguments provided');
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

        let currentClassDescriptor = new NcClassDescriptor("NcDemo class descriptor",
            [
                new NcPropertyDescriptor(new NcElementId(3, 1), "enumProperty", "NcDemoEnum", false, false, false, false, null, "Demo enum property"),
                new NcPropertyDescriptor(new NcElementId(3, 2), "stringProperty", "NcString", false, false, false, false, new NcParameterConstraintString(10, null),
                    "Demo string property"),
                new NcPropertyDescriptor(new NcElementId(3, 3), "numberProperty", "NcUint64", false, false, false, false, new NcParameterConstraintNumber(1000, 0, 1),
                    "Demo numeric property"),
                new NcPropertyDescriptor(new NcElementId(3, 4), "booleanProperty", "NcBoolean", false, false, false, false, null, "Demo boolean property"),
                new NcPropertyDescriptor(new NcElementId(3, 5), "objectProperty", "DemoDataType", false, false, false, false, null, "Demo object property"),
                new NcPropertyDescriptor(new NcElementId(3, 6), "methodNoArgsCount", "NcUint64", true, false, false, false, null, "Method no args invoke counter"),
                new NcPropertyDescriptor(new NcElementId(3, 7), "methodSimpleArgsCount", "NcUint64", true, false, false, false, null, "Method simple args invoke counter"),
                new NcPropertyDescriptor(new NcElementId(3, 8), "methodObjectArgCount", "NcUint64", true, false, false, false, null, "Method obj arg invoke counter"),
                new NcPropertyDescriptor(new NcElementId(3, 9), "stringSequence", "NcString", false, false, false, true, null, "Demo string sequence property"),
                new NcPropertyDescriptor(new NcElementId(3, 10), "booleanSequence", "NcBoolean", false, false, false, true, null, "Demo boolean sequence property"),
                new NcPropertyDescriptor(new NcElementId(3, 11), "enumSequence", "NcDemoEnum", false, false, false, true, null, "Demo enum sequence property"),
                new NcPropertyDescriptor(new NcElementId(3, 12), "numberSequence", "NcUint64", false, false, false, true, null, "Demo number sequence property"),
                new NcPropertyDescriptor(new NcElementId(3, 13), "objectSequence", "DemoDataType", false, false, false, true, null, "Demo object sequence property")
            ],
            [
                new NcMethodDescriptor(new NcElementId(3, 1), "MethodNoArgs", "NcMethodResult", [], "Demo method with no arguments"),
                new NcMethodDescriptor(new NcElementId(3, 2), "MethodSimpleArgs", "NcMethodResult", [
                    new NcParameterDescriptor("enumArg", "NcDemoEnum", false, false, null, "Enum demo argument"),
                    new NcParameterDescriptor("stringArg", "NcString", false, false, new NcParameterConstraintString(10, null), "String demo argument"),
                    new NcParameterDescriptor("numberArg", "NcUint64", false, false, new NcParameterConstraintNumber(1000, 0, 1),
                    "Number demo argument"),
                    new NcParameterDescriptor("booleanArg", "NcBoolean", false, false, null, "Boolean demo argument")
                ], "Demo method with simple arguments"),
                new NcMethodDescriptor(new NcElementId(3, 3), "MethodObjectArg", "NcMethodResult", [
                    new NcParameterDescriptor("objArg", "DemoDataType", false, false, null, "Object demo argument")
                ], "Demo method with object argument")
            ],
            []
        );

        currentClassDescriptor.properties = currentClassDescriptor.properties.concat(baseDescriptor.properties);
        currentClassDescriptor.methods = currentClassDescriptor.methods.concat(baseDescriptor.methods);
        currentClassDescriptor.events = currentClassDescriptor.events.concat(baseDescriptor.events);

        return currentClassDescriptor;
    }
}