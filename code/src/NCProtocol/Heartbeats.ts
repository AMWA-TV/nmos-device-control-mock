import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { NcMethodStatus } from '../NCModel/Core';
import { CommandResponseNoValue } from './Commands';

import { MessageType, ProtocolWrapper } from './Core';

export class ProtoHeartbeat extends ProtocolWrapper
{
    public sessionId: number;

    public constructor(
        sessionId: number)
    {
        super('1.0.0', MessageType.Heartbeat);

        this.sessionId = sessionId;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class CommandResponseHeartbeat
{
    public result: { [key: string]: any };

    constructor(
        status: NcMethodStatus,
        errorMessage: string | null)
    {
        this.result = {};
        this.result['status'] = status;
        if(errorMessage != null)
            this.result['errorMessage'] = errorMessage;
    }
}

export class ProtoHeartbeatResponse extends ProtocolWrapper
{
    public messages: CommandResponseHeartbeat[];

    public sessionId: number;

    public constructor(
        sessionId: number,
        messages: CommandResponseHeartbeat[])
    {
        super('1.0.0', MessageType.HeartbeatResponse);

        this.sessionId = sessionId;
        this.messages = messages;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}