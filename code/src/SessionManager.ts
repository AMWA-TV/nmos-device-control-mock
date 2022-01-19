import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { v4 as uuidv4 } from 'uuid';

import { WebSocketConnection } from './Server';
import { ProtocolWrapper } from './NCProtocol/Core';
import { ProtoCreateSession, ProtoCreateSessionResponse, CreateSessionResponse } from './NCProtocol/Sessions';
import { NcaElementID, NcaMethodStatus, NcaPropertyChangeType } from './NCModel/Core';
import { NcaEventData, NcaNotification, ProtoNotification } from './NCProtocol/Notifications';

export interface INotificationContext
{
    NotifyPropertyChanged(oid: number, propertyID: NcaElementID, value: any);
}

export class SessionManager implements INotificationContext
{
    public sessions: { [key: string]: Session };

    private lastSubId: number;

    public constructor()
    {
        this.lastSubId = 0;
        this.sessions = {};
        // setInterval(() => {
        //     for (let key in this.sessions) {
        //         let value = this.sessions[key];

        //         value.socket.send(value.sessionId);
        //     }
        // }, 5000);
    }

    public NotifyPropertyChanged(oid: number, propertyID: NcaElementID, value: any)
    {
        console.log(`NotifyPropertyChanged oid: ${oid}, property: ${propertyID.ToJson()}, value: ${JSON.stringify(value)}`);

        for (let key in this.sessions) {
            let session = this.sessions[key];
            session.socket.send(
                new ProtoNotification(
                    session.sessionId,
                    [ new NcaNotification(oid, new NcaElementID(1, 1), new NcaEventData(propertyID, NcaPropertyChangeType.CurrentChanged, value)) ]
                ).ToJson());
        }
    }

    public ProcessMessage(msg: string, socket: WebSocketConnection)
    {
        let message = JSON.parse(msg) as ProtocolWrapper;

        switch(message.messageType)
        {
            case 'CreateSession':
            {
                let msgCreateSession = JSON.parse(msg) as ProtoCreateSession;
                let outcome = this.CreateSession(socket, msgCreateSession.messages[0].arguments['heartBeatTime']);
                if(outcome[0] != 0)
                {
                    socket.send(new ProtoCreateSessionResponse([
                        new CreateSessionResponse(msgCreateSession.messages[0].handle, NcaMethodStatus.OK, outcome[0], null)
                    ]).ToJson());
                }
                else
                {
                    socket.send(new ProtoCreateSessionResponse([
                        new CreateSessionResponse(msgCreateSession.messages[0].handle, NcaMethodStatus.OK, null, outcome[1])
                    ]).ToJson());
                }
                break;
            }
        }
    }

    private CreateSession(socket: WebSocketConnection, heartBeatTime: number) : [number | null, string | null]
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