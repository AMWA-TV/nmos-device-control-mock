import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { NcElementId, NcMethodStatus } from '../NCModel/Core';

import { ProtocolWrapper, ProtoMsg } from './Core';

export class CommandMsg extends ProtoMsg
{
    public oid: number;

    public methodID: NcElementId;

    public arguments: { [key: string]: any } | null;

    constructor(
        handle: number,
        oid: number,
        methodID: NcElementId,
        commandArguments: { [key: string]: any } | null)
    {
        super(handle);

        this.oid = oid;
        this.methodID = methodID;
        this.arguments = commandArguments;
    }
}

export class CommandResponseNoValue extends ProtoMsg
{
    public result: { [key: string]: any };

    constructor(
        handle: number,
        status: NcMethodStatus,
        errorMessage: string | null)
    {
        super(handle);

        this.result = {};
        this.result['status'] = status;
        if(errorMessage != null)
            this.result['errorMessage'] = errorMessage;
    }
}

export class CommandResponseWithValue extends CommandResponseNoValue
{
    constructor(
        handle: number,
        status: NcMethodStatus,
        value: any | null,
        errorMessage: string | null)
    {
        super(handle, status, errorMessage);
        this.result['value'] = value;
    }
}

export class EventSubscriptionData
{
    public emitterOid: number;

    public eventID: NcElementId;

    constructor(
        emitterOid: number,
        eventID: NcElementId)
    {
        this.emitterOid = emitterOid;
        this.eventID = eventID;
    }
}

export class ProtoCommand extends ProtocolWrapper
{
    public messages: CommandMsg[];

    public sessionId: number;

    public constructor(
        sessionId: number,
        messages: CommandMsg[])
    {
        super('1.0.0', 'Command');

        this.sessionId = sessionId;
        this.messages = messages;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class ProtoCommandResponse extends ProtocolWrapper
{
    public messages: CommandResponseNoValue[];

    public sessionId: number;

    public constructor(
        sessionId: number,
        messages: CommandResponseNoValue[])
    {
        super('1.0.0', 'CommandResponse');

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