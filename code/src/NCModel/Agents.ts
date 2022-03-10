import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { CommandResponseNoValue, CommandResponseWithValue } from '../NCProtocol/Commands';
import { INotificationContext } from '../SessionManager';
import { myIdDecorator, NcClassDescriptor, NcElementID, NcLockState, NcMethodDescriptor, NcMethodStatus, NcObject, NcParameterDescriptor, NcPropertyDescriptor, NcTouchpoint } from './Core';

export abstract class NcAgent extends NcObject
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
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, lockable, lockState, touchpoints, notificationContext);
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

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementID(3, 1), this.connectionStatus);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementID(3, 3), this.payloadStatus);
    }

    public Disconnected()
    {
        this.connectionStatus = NcConnectionStatus.Undefined;
        this.payloadStatus = NcPayloadStatus.Undefined;

        this.connectionStatusMessage = null;
        this.payloadStatusMessage = null;

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementID(3, 1), this.connectionStatus);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementID(3, 3), this.payloadStatus);
    }

    //'1m1'
    public override Get(oid: number, id: NcElementID, handle: number) : CommandResponseWithValue
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

    //'1m2'
    public override Set(oid: number, id: NcElementID, value: any, handle: number) : CommandResponseNoValue
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

    public static override GetClassDescriptor(): NcClassDescriptor 
    {
        let baseDescriptor = super.GetClassDescriptor();

        let currentClassDescriptor = new NcClassDescriptor("NcReceiverMonitor class descriptor",
            [ 
                new NcPropertyDescriptor(new NcElementID(3, 1), "connectionStatus", "ncConnectionStatus", true, false, true),
                new NcPropertyDescriptor(new NcElementID(3, 2), "connectionStatusMessage", "ncString", true, false, true),
                new NcPropertyDescriptor(new NcElementID(3, 3), "payloadStatus", "ncPayloadStatus", true, false, true),
                new NcPropertyDescriptor(new NcElementID(3, 4), "payloadStatusMessage", "ncString", true, false, true)
            ],
            [ 
                new NcMethodDescriptor(new NcElementID(3, 1), "getStatus", "ncMethodResultReceiverStatus", [])
            ],
            []
        );

        currentClassDescriptor.properties = currentClassDescriptor.properties.concat(baseDescriptor.properties);
        currentClassDescriptor.methods = currentClassDescriptor.methods.concat(baseDescriptor.methods);
        currentClassDescriptor.events = currentClassDescriptor.events.concat(baseDescriptor.events);

        return currentClassDescriptor;
    }
}