import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';

import { WebSocketConnection } from './Server';
import { NcElementId, NcMethodStatus, NcPropertyChangeType } from './NCModel/Core';
import { NcPropertyChangedEventData, NcNotification, ProtoNotification } from './NCProtocol/Notifications';

export interface INotificationContext
{
    NotifyPropertyChanged(oid: number, propertyId: NcElementId, changeType: NcPropertyChangeType, value: any | null, sequenceItemIndex: number | null);
    Subscribe(sessionId: number, oid: number);
    UnSubscribe(sessionId: number, oid: number);
    CreateSession(socket: WebSocketConnection, heartBeatTime: number) : [number | null, string | null]
}

export class SessionManager implements INotificationContext
{
    public sessions: { [key: string]: Session };

    private lastSubId: number;

    private notifyWithoutSubscriptions: boolean;

    public constructor(notifyWithoutSubscriptions: boolean)
    {
        this.notifyWithoutSubscriptions = notifyWithoutSubscriptions;
        this.lastSubId = 0;
        this.sessions = {};
    }

    public Subscribe(sessionId: number, oid: number)
    {
        let sub = this.sessions[sessionId];
        if(sub)
            sub.Subscribe(oid);
    }

    public UnSubscribe(sessionId: number, oid: number)
    {
        let sub = this.sessions[sessionId];
        if(sub)
            sub.UnSubscribe(oid);
    }

    public NotifyPropertyChanged(oid: number, propertyId: NcElementId, changeType: NcPropertyChangeType, value: any | null, sequenceItemIndex: number | null)
    {
        console.log(`NotifyPropertyChanged oid: ${oid}, property: ${propertyId.level}p${propertyId.index}, value: ${JSON.stringify(value)}`);

        for (let key in this.sessions) {
            let session = this.sessions[key];

            if(this.notifyWithoutSubscriptions || session.ShouldNotify(oid))
            {
                session.socket.send(
                    new ProtoNotification(
                        session.sessionId,
                        [ new NcNotification(oid, new NcElementId(1, 1), new NcPropertyChangedEventData(propertyId, changeType, value, sequenceItemIndex)) ]
                    ).ToJson());
            }
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

    public subscribedOids: Set<number>;

    public constructor(
        socket: WebSocketConnection,
        sessionId : number,
        heartBeatTime: number)
    {
        this.socket = socket;
        this.sessionId = sessionId;
        this.heartBeatTime = heartBeatTime;
        this.subscribedOids = new Set<number>();
    }

    public Subscribe(oid: number)
    {
        if(!this.subscribedOids.has(oid))
            this.subscribedOids.add(oid);
    }

    public UnSubscribe(oid: number)
    {
        if(this.subscribedOids.has(oid))
            this.subscribedOids.delete(oid);
    }

    public DropSession()
    {
        this.subscribedOids.clear();
    }

    public ShouldNotify(oid: number): boolean
    {
        if(this.subscribedOids.has(oid))
            return true;
        else
            return false;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}