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

export class CommandResponseError extends ProtoMsg
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

export class CommandResponseNoValue extends ProtoMsg
{
    public result: { [key: string]: any };

    constructor(
        handle: number,
        status: NcMethodStatus)
    {
        super(handle);

        this.result = {};
        this.result['status'] = status;
    }
}

export class CommandResponseWithValue extends CommandResponseNoValue
{
    constructor(
        handle: number,
        status: NcMethodStatus,
        value: any | null)
    {
        super(handle, status);
        this.result['value'] = value;
    }
}

export class ProtocolCommand extends ProtocolWrapper
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

export class ProtocolCommandResponse extends ProtocolWrapper
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

export class ProtocolSubscription extends ProtocolWrapper
{
    public subscriptions: number[];

    public constructor(
        subscriptions: number[])
    {
        super('1.0.0', MessageType.Subscription);

        this.subscriptions = subscriptions;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class ProtocolSubscriptionResponse extends ProtocolWrapper
{
    public subscriptions: number[];

    public constructor(
        subscriptions: number[])
    {
        super('1.0.0', MessageType.SubscriptionResponse);

        this.subscriptions = subscriptions;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class ProtocolError extends ProtocolWrapper
{
    public status: NcMethodStatus;

    public errorMessage: string;

    public constructor(
        status: NcMethodStatus,
        errorMessage: string)
    {
        super('1.0.0', MessageType.Error);

        this.status = status;
        this.errorMessage = errorMessage;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}