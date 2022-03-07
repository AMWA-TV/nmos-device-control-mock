import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';

import { WebSocketConnection } from './Server';
import { NcElementID, NcMethodStatus, NcPropertyChangeType } from './NCModel/Core';
import { NcEventData, NcNotification, ProtoNotification } from './NCProtocol/Notifications';

export interface INotificationContext
{
    NotifyPropertyChanged(oid: number, propertyID: NcElementID, value: any);
    Subscribe(oid: number);
    CreateSession(socket: WebSocketConnection, heartBeatTime: number) : [number | null, string | null]
}

export class SessionManager implements INotificationContext
{
    public sessions: { [key: string]: Session };

    private lastSubId: number;

    public constructor()
    {
        this.lastSubId = 0;
        this.sessions = {};
    }

    public Subscribe(oid: number) {
        throw new Error('Method not implemented.');
    }

    public NotifyPropertyChanged(oid: number, propertyID: NcElementID, value: any)
    {
        console.log(`NotifyPropertyChanged oid: ${oid}, property: ${propertyID.level}p${propertyID.index}, value: ${JSON.stringify(value)}`);

        for (let key in this.sessions) {
            let session = this.sessions[key];
            session.socket.send(
                new ProtoNotification(
                    session.sessionId,
                    [ new NcNotification(oid, new NcElementID(1, 1), new NcEventData(propertyID, NcPropertyChangeType.CurrentChanged, value)) ]
                ).ToJson());
        }
    }

    public CreateSession(socket: WebSocketConnection, heartBeatTime: number) : [number | null, string | null]
    {
        let sub = new Session(socket, ++this.lastSubId, heartBeatTime);
        this.sessions[sub.sessionId] = sub;

        return [sub.sessionId, null];
    }

    public ConnectionClosed(connectionId: string)
    {
        let connectionSubKey: string | null = null;

        for (let key in this.sessions) 
        {
            let value = this.sessions[key];
            if (value.socket.connectionId == connectionId)
                connectionSubKey = key;
        }

        if(connectionSubKey != null)
        {
            console.log(`Cleanup sub - sub id: ${connectionSubKey}, connection id: ${connectionId}`);
            delete this.sessions[connectionSubKey];
        }
    }
}

class Session
{
    public sessionId : number;
    public socket: WebSocketConnection;
    public heartBeatTime: number;

    public subscribedOids: number[];

    public constructor(
        socket: WebSocketConnection,
        sessionId : number,
        heartBeatTime: number)
    {
        this.socket = socket;
        this.sessionId = sessionId;
        this.heartBeatTime = heartBeatTime;
        this.subscribedOids = [];
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}