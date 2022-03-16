import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { CommandResponseNoValue } from './Commands';

import { ProtocolWrapper } from './Core';

export class ProtoHeartbeat extends ProtocolWrapper
{
    public sessionId: number;

    public constructor(
        sessionId: number)
    {
        super('1.0.0', 'Heartbeat');

        this.sessionId = sessionId;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class ProtoHeartbeatResponse extends ProtocolWrapper
{
    public messages: CommandResponseNoValue[];

    public sessionId: number;

    public constructor(
        sessionId: number,
        messages: CommandResponseNoValue[])
    {
        super('1.0.0', 'HeartbeatResponse');

        this.sessionId = sessionId;
        this.messages = messages;
    }

    public AddCommandResponse(response: CommandResponseNoValue)
    {
        this.messages.push(response);
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}