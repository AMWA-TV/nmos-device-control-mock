import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { NcaElementID, NcaMethodStatus } from '../NCModel/Core';

import { ProtocolWrapper, ProtoMsg } from './Core';

export class CommandMsg extends ProtoMsg
{
    public oid: number;

    public methodID: NcaElementID;

    constructor(
        handle: number,
        oid: number,
        methodID: NcaElementID)
    {
        super(handle);

        this.oid = oid;
        this.methodID = methodID;
    }
}

export class CommandResponseNoValue extends ProtoMsg
{
    public result: { [key: string]: any };

    constructor(
        handle: number,
        status: NcaMethodStatus,
        errorMessage: string | null)
    {
        super(handle);

        this.result = {};
        this.result['status'] = status;
        if(errorMessage != null)
            this.result['errorMessage'] = errorMessage;
    }
}

export class EventSubscriptionData
{
    public emitterOid: number;

    public eventID: NcaElementID;

    constructor(
        emitterOid: number,
        eventID: NcaElementID)
    {
        this.emitterOid = emitterOid;
        this.eventID = eventID;
    }
}

export class AddSubscriptionMsg extends CommandMsg
{
    public arguments: { [key: string]: any };

    constructor(
        handle: number,
        oid: number,
        methodID: NcaElementID,
        eventSubData: EventSubscriptionData)
    {
        super(handle, oid, methodID);

        this.arguments = {};
        this.arguments['event'] = eventSubData;
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
        super('1.0', 'Command');

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
        super('1.0', 'Command');

        this.sessionId = sessionId;
        this.messages = messages;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}