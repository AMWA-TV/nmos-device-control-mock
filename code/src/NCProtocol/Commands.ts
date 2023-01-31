import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { NcElementId, NcMethodStatus } from '../NCModel/Core';
import { MessageType, ProtocolWrapper, ProtoMsg } from './Core';

export class CommandMsg extends ProtoMsg
{
    public oid: number;

    public methodId: NcElementId;

    public arguments: { [key: string]: any } | null;

    constructor(
        handle: number,
        oid: number,
        methodId: NcElementId,
        commandArguments: { [key: string]: any } | null)
    {
        super(handle);

        this.oid = oid;
        this.methodId = methodId;
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

    public eventId: NcElementId;

    constructor(
        emitterOid: number,
        eventId: NcElementId)
    {
        this.emitterOid = emitterOid;
        this.eventId = eventId;
    }
}

export class ProtoCommand extends ProtocolWrapper
{
    public commands: CommandMsg[];

    public constructor(
        commands: CommandMsg[])
    {
        super('1.0.0', MessageType.Command);

        this.commands = commands;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class ProtoCommandResponse extends ProtocolWrapper
{
    public responses: CommandResponseNoValue[];

    public constructor(
        responses: CommandResponseNoValue[])
    {
        super('1.0.0', MessageType.CommandResponse);

        this.responses = responses;
    }

    public AddCommandResponse(response: CommandResponseNoValue)
    {
        this.responses.push(response);
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}