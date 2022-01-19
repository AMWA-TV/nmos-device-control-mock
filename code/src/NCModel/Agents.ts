import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { INotificationContext } from '../SessionManager';
import { NcaElementID, NcaObject, NcaTouchpoint } from './Core';

export abstract class NcaAgent extends NcaObject
{
    public constructor(
        oid: number,
        resources: NcaTouchpoint[],
        constantOid: boolean,
        notificationContext: INotificationContext)
    {
        super(oid, resources, constantOid, notificationContext);
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
    public classID: number[] = [ 1, 4, 1 ];
    public classVersion: number = 1;

    public connectionStatus: NcaConnectionStatus;
    public connectionStatusMessage: string | null;

    public payloadStatus: NcaPayloadStatus;
    public payloadStatusMessage: string | null;

    public constructor(
        oid: number,
        resources: NcaTouchpoint[],
        constantOid: boolean,
        notificationContext: INotificationContext)
    {
        super(oid, resources, constantOid, notificationContext);

        this.connectionStatus = NcaConnectionStatus.Undefined;
        this.connectionStatusMessage = null;
        
        this.payloadStatus = NcaPayloadStatus.Undefined;
        this.payloadStatusMessage = null;

        this.notificationContext = notificationContext;
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
}