import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';

import { WebSocketConnection } from './Server';
import { NcElementId, NcMethodStatus, NcPropertyChangeType } from './NCModel/Core';
import { NcPropertyChangedEventData, NcNotification, ProtocolNotification } from './NCProtocol/Notifications';
import { ProtocolError, ProtocolSubscription, ProtocolSubscriptionResponse } from './NCProtocol/Commands';

export interface INotificationContext
{
    NotifyPropertyChanged(oid: number, propertyId: NcElementId, changeType: NcPropertyChangeType, value: any | null, sequenceItemIndex: number | null);
}

export class SessionManager implements INotificationContext
{
    public sessions: { [key: string]: Session };

    private notifyWithoutSubscriptions: boolean;

    public constructor(notifyWithoutSubscriptions: boolean)
    {
        this.notifyWithoutSubscriptions = notifyWithoutSubscriptions;
        this.sessions = {};
    }

    public ModifySubscription(socket: WebSocketConnection, subscription: ProtocolSubscription)
    {
        if(subscription.subscriptions)
        {
            let sub = this.sessions[socket.connectionId];
            if(sub)
            {
                sub.DropSession();

                subscription.subscriptions.forEach(function (oid) {
                    sub.Subscribe(oid);
                });

                let response = new ProtocolSubscriptionResponse(subscription.subscriptions);
                socket.send(response.ToJson());
            }
        }
        else
        {
            let errorMessage = `Invalid subscription message received.`
            console.log(errorMessage);
            let error = new ProtocolError(NcMethodStatus.BadCommandFormat, errorMessage);
            socket.send(error.ToJson());
        }
    }

    public NotifyPropertyChanged(oid: number, propertyId: NcElementId, changeType: NcPropertyChangeType, value: any | null, sequenceItemIndex: number | null)
    {
        console.log(`NotifyPropertyChanged oid: ${oid}, property: ${propertyId.level}p${propertyId.index}, value: ${JSON.stringify(value)}`);

        for (let key in this.sessions) {
            let session = this.sessions[key];

            if(this.notifyWithoutSubscriptions || session.ShouldNotify(oid))
            {
                session.socket.send(
                    new ProtocolNotification(
                        [ new NcNotification(oid, new NcElementId(1, 1), new NcPropertyChangedEventData(propertyId, changeType, value, sequenceItemIndex)) ]
                    ).ToJson());
            }
        }
    }

    public CreateSession(socket: WebSocketConnection)
    {
        let sub = new Session(socket);
        this.sessions[socket.connectionId] = sub;
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
    public socket: WebSocketConnection;
    public subscribedOids: Set<number>;

    public constructor(
        socket: WebSocketConnection)
    {
        this.socket = socket;
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