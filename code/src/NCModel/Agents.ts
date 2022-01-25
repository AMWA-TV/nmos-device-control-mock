import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { CommandResponseNoValue, CommandResponseWithValue } from '../NCProtocol/Commands';
import { INotificationContext } from '../SessionManager';
import { myIdDecorator, NcaElementID, NcaLockState, NcaMethodStatus, NcaObject, NcaTouchpoint } from './Core';

export abstract class NcaAgent extends NcaObject
{
    public constructor(
        oid: number,
        constantOid: boolean,
        owner: number | null,
        role: string,
        userLabel: string,
        lockable: boolean,
        lockState: NcaLockState,
        touchpoints: NcaTouchpoint[],
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, lockable, lockState, touchpoints, notificationContext);
    }
}

enum NcaConnectionStatus
{
    Undefined = 0,
    Connected = 1,
    Disconnected = 2,
    ConnectionError = 3
}

enum NcaPayloadStatus
{
    Undefined = 0,
    PayloadOK = 1,
    PayloadFormatUnsupported = 2,
    PayloadError = 3
}

export class NcaReceiverMonitor extends NcaAgent
{
    @myIdDecorator('1p1')
    public classID: number[] = [ 1, 4, 1 ];

    @myIdDecorator('1p2')
    public classVersion: number = 1;

    @myIdDecorator('3p1')
    public connectionStatus: NcaConnectionStatus;

    @myIdDecorator('3p2')
    public connectionStatusMessage: string | null;

    @myIdDecorator('3p3')
    public payloadStatus: NcaPayloadStatus;

    @myIdDecorator('3p4')
    public payloadStatusMessage: string | null;

    public constructor(
        oid: number,
        constantOid: boolean,
        owner: number | null,
        role: string,
        userLabel: string,
        lockable: boolean,
        lockState: NcaLockState,
        touchpoints: NcaTouchpoint[],
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, lockable, lockState, touchpoints, notificationContext);

        this.connectionStatus = NcaConnectionStatus.Undefined;
        this.connectionStatusMessage = null;
        
        this.payloadStatus = NcaPayloadStatus.Undefined;
        this.payloadStatusMessage = null;
    }

    public Connected()
    {
        this.connectionStatus = NcaConnectionStatus.Connected;
        this.payloadStatus = NcaPayloadStatus.PayloadOK;

        this.connectionStatusMessage = null;
        this.payloadStatusMessage = null;

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcaElementID(3, 1), this.connectionStatus);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcaElementID(3, 3), this.payloadStatus);
    }

    public Disconnected()
    {
        this.connectionStatus = NcaConnectionStatus.Undefined;
        this.payloadStatus = NcaPayloadStatus.Undefined;

        this.connectionStatusMessage = null;
        this.payloadStatusMessage = null;

        this.notificationContext.NotifyPropertyChanged(this.oid, new NcaElementID(3, 1), this.connectionStatus);
        this.notificationContext.NotifyPropertyChanged(this.oid, new NcaElementID(3, 3), this.payloadStatus);
    }

    //'1m1'
    public override Get(oid: number, id: NcaElementID, handle: number) : CommandResponseWithValue
    {
        let key: string = `${id.level}p${id.index}`;

        switch(key)
        {
            case '3p1':
                return new CommandResponseWithValue(handle, NcaMethodStatus.OK, this.connectionStatus, null);
            case '3p2':
                return new CommandResponseWithValue(handle, NcaMethodStatus.OK, this.connectionStatusMessage, null);
            case '3p3':
                return new CommandResponseWithValue(handle, NcaMethodStatus.OK, this.payloadStatus, null);
            case '3p4':
                return new CommandResponseWithValue(handle, NcaMethodStatus.OK, this.payloadStatusMessage, null);
            default:
                return super.Get(oid, id, handle);
        }
    }

    //'1m2'
    public override Set(oid: number, id: NcaElementID, value: any, handle: number) : CommandResponseNoValue
    {
        let key: string = `${id.level}p${id.index}`;

        switch(key)
        {
            case '3p1':
            case '3p2':
            case '3p3':
            case '3p4':
                return new CommandResponseNoValue(handle, NcaMethodStatus.ProcessingFailed, 'Property is readonly');
            default:
                return super.Set(oid, id, value, handle);
        }
    }
}