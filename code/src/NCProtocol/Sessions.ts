import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { NcMethodStatus } from '../NCModel/Core';

import { MessageType, ProtocolWrapper, ProtoMsg } from './Core';

export class CreateSessionMsg extends ProtoMsg
{
    public arguments: { [key: string]: any };

    constructor(
        handle: number,
        heartbeatTime: number)
    {
        super(handle);

        this.arguments = {};
        this.arguments['heartBeatTime'] = heartbeatTime;
    }
}

export class CreateSessionResponse extends ProtoMsg
{
    public result: { [key: string]: any };

    constructor(
        handle: number,
        status: NcMethodStatus,
        value: number | null,
        errorMessage: string | null)
    {
        super(handle);

        this.result = {};
        this.result['status'] = status;
        if(value != null)
            this.result['value'] = value;
        if(errorMessage != null)
            this.result['errorMessage'] = errorMessage;
    }
}

export class ProtoCreateSession extends ProtocolWrapper
{
    public messages: CreateSessionMsg[];

    public constructor(
        messages: CreateSessionMsg[])
    {
        super('1.0.0', MessageType.CreateSession);

        this.messages = messages;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class ProtoCreateSessionResponse extends ProtocolWrapper
{
    public messages: CreateSessionResponse[];

    public constructor(
        messages: CreateSessionResponse[])
    {
        super('1.0.0', MessageType.CreateSessionResponse);

        this.messages = messages;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

