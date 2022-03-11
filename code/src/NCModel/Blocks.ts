import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { CommandMsg, CommandResponseNoValue, CommandResponseWithValue, ProtoCommand, ProtoCommandResponse } from '../NCProtocol/Commands';
import { ProtocolWrapper } from '../NCProtocol/Core';
import { CreateSessionResponse, ProtoCreateSession, ProtoCreateSessionResponse } from '../NCProtocol/Sessions';
import { WebSocketConnection } from '../Server';
import { INotificationContext } from '../SessionManager';
import { myIdDecorator, NcBlockMemberDescriptor, NcClassDescriptor, NcElementID, NcEventDescriptor, NcLockState, NcMethodDescriptor, NcMethodStatus, NcObject, NcParameterDescriptor, NcPort, NcPropertyDescriptor, NcSignalPath, NcTouchpoint } from './Core';

export class NcBlock extends NcObject
{
    @myIdDecorator('1p1')
    public classID: number[] = [ 1, 1 ];

    @myIdDecorator('1p2')
    public classVersion: string = "1.0.0";

    @myIdDecorator('2p1')
    public enabled: boolean;

    @myIdDecorator('2p2')
    public specId: string | null;

    @myIdDecorator('2p3')
    public specVersion: string | null;

    @myIdDecorator('2p4')
    public parentSpecId: string | null;

    @myIdDecorator('2p5')
    public parentSpecVersion: string | null;

    @myIdDecorator('2p6')
    public specDescription: string | null;

    @myIdDecorator('2p7')
    public isDynamic: boolean;

    @myIdDecorator('2p8')
    public isModified: boolean;

    @myIdDecorator('2p9')
    public members: number[] | null;

    @myIdDecorator('2p10')
    public ports: NcPort[] | null;

    @myIdDecorator('2p11')
    public signalPaths: NcSignalPath[] | null;

    public memberObjects: NcObject[] | null;

    public constructor(
        oid: number,
        constantOid: boolean,
        owner: number | null,
        role: string,
        userLabel: string,
        lockable: boolean,
        lockState: NcLockState,
        touchpoints: NcTouchpoint[] | null,
        enabled: boolean,
        specId: string | null,
        specVersion: string | null,
        parentSpecId: string | null,
        parentSpecVersion: string | null,
        specDescription: string | null,
        isDynamic: boolean,
        memberObjects: NcObject[] | null,
        ports: NcPort[] | null,
        signalPaths: NcSignalPath[] | null,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, lockable, lockState, touchpoints, notificationContext);

        this.enabled = enabled;
        this.specId = specId;
        this.specVersion = specVersion;
        this.parentSpecId = parentSpecId;
        this.parentSpecVersion = parentSpecVersion;
        this.specDescription = specDescription;
        this.isDynamic = isDynamic;
        this.isModified = false;
        this.memberObjects = memberObjects;

        if(this.memberObjects != null)
            this.members = this.memberObjects.map(x => x.oid);
        else
            this.members = null;

        this.ports = ports;
        this.signalPaths = signalPaths;
    }

    //'1m1'
    public override Get(oid: number, propertyId: NcElementID, handle: number) : CommandResponseWithValue
    {
        if(oid == this.oid)
        {
            let key: string = `${propertyId.level}p${propertyId.index}`;

            switch(key)
            {
                case '2p1':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.enabled, null);
                case '2p2':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.specId, null);
                case '2p3':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.specVersion, null);
                case '2p4':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.parentSpecId, null);
                case '2p5':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.parentSpecVersion, null);
                case '2p6':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.specDescription, null);
                case '2p7':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.isDynamic, null);
                case '2p8':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.isModified, null);
                case '2p9':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.members, null);
                case '2p10':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.ports, null);
                case '2p11':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.signalPaths, null);
                default:
                    return super.Get(oid, propertyId, handle);
            }
        }
        else if(this.memberObjects != null)
        {
            let member = this.memberObjects.find(e => e.oid === oid);
            if(member !== undefined)
                return member.Get(oid, propertyId, handle);
            else
                return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
        }

        return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }

    //'1m2'
    public override Set(oid: number, id: NcElementID, value: any, handle: number) : CommandResponseNoValue
    {
        if(oid == this.oid)
        {
            let key: string = `${id.level}p${id.index}`;

            switch(key)
            {
                case '2p1':
                case '2p2':
                case '2p3':
                case '2p4':
                case '2p5':
                case '2p6':
                case '2p7':
                case '2p8':
                case '2p9':
                case '2p10':
                case '2p11':
                    return new CommandResponseNoValue(handle, NcMethodStatus.ProcessingFailed, 'Property is readonly');
                default:
                    return super.Set(oid, id, value, handle);
            }
        }
        else if(this.memberObjects != null)
        {
            let member = this.memberObjects.find(e => e.oid === oid);
            if(member !== undefined)
                return member.Set(oid, id, value, handle);
            else
                return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
        }

        return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }

    public override InvokeMethod(oid: number, methodID: NcElementID, args: { [key: string]: any; } | null, handle: number): CommandResponseNoValue 
    {
        if(oid == this.oid)
        {
            let key: string = `${methodID.level}m${methodID.index}`;

            switch(key)
            {
                case '2m1':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.GenerateMemberDescriptors(), null);
                default:
                    return super.InvokeMethod(oid, methodID, args, handle);
            }
        }
        else if(this.memberObjects != null)
        {
            let member = this.memberObjects.find(e => e.oid === oid);
            if(member !== undefined)
                return member.InvokeMethod(oid, methodID, args, handle);
            else
                return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
        }

        return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }

    public static override GetClassDescriptor(): NcClassDescriptor 
    {
        let baseDescriptor = super.GetClassDescriptor();

        let currentClassDescriptor = new NcClassDescriptor("NcBlock class descriptor",
            [ 
                new NcPropertyDescriptor(new NcElementID(2, 1), "enabled", "ncBoolean", true, true, true),
                new NcPropertyDescriptor(new NcElementID(2, 2), "specId", "ncString", true, true, true),
                new NcPropertyDescriptor(new NcElementID(2, 3), "specVersion", "ncVersionCode", true, true, true),
                new NcPropertyDescriptor(new NcElementID(2, 4), "parentSpecId", "ncString", true, true, true),
                new NcPropertyDescriptor(new NcElementID(2, 5), "parentSpecVersion", "ncVersionCode", true, true, true),
                new NcPropertyDescriptor(new NcElementID(2, 6), "specDescription", "ncString", true, true, true),
                new NcPropertyDescriptor(new NcElementID(2, 7), "isDynamic", "ncBoolean", true, true, true),
                new NcPropertyDescriptor(new NcElementID(2, 8), "isModified", "ncBoolean", true, false, true),
                new NcPropertyDescriptor(new NcElementID(2, 9), "members", "ncOid", true, true, true),
                new NcPropertyDescriptor(new NcElementID(2, 10), "ports", "ncPort", true, true, true),
                new NcPropertyDescriptor(new NcElementID(2, 11), "signalPaths", "ncSignalPath", true, true, true),
            ],
            [ 
                new NcMethodDescriptor(new NcElementID(2, 1), "getMemberDescriptors", "ncMethodResultBlockMemberDescriptors", [new NcParameterDescriptor("recurse", "ncBoolean", true)]),
                new NcMethodDescriptor(new NcElementID(2, 2), "getNestedBlocks", "ncMethodResultBlockDescriptors", []),
                new NcMethodDescriptor(new NcElementID(2, 3), "findMembersByRole", "ncMethodResultBlockMemberDescriptors", [
                    new NcParameterDescriptor("role", "ncRole", true),
                    new NcParameterDescriptor("nameComparisonType", "ncStringComparisonType", true),
                    new NcParameterDescriptor("classId", "ncClassId", true),
                    new NcParameterDescriptor("recurse", "ncBoolean", true),
                ]),
                new NcMethodDescriptor(new NcElementID(2, 4), "findMembersByUserLabel", "ncMethodResultBlockMemberDescriptors", [
                    new NcParameterDescriptor("userLabel", "ncString", true),
                    new NcParameterDescriptor("nameComparisonType", "ncStringComparisonType", true),
                    new NcParameterDescriptor("classId", "ncClassId", true),
                    new NcParameterDescriptor("recurse", "ncBoolean", true),
                ]),
                new NcMethodDescriptor(new NcElementID(2, 5), "findMembersByPath", "ncMethodResultBlockMemberDescriptors", [
                    new NcParameterDescriptor("path", "ncRolePath", true)
                ])
            ],
            []
        );

        currentClassDescriptor.properties = currentClassDescriptor.properties.concat(baseDescriptor.properties);
        currentClassDescriptor.methods = currentClassDescriptor.methods.concat(baseDescriptor.methods);
        currentClassDescriptor.events = currentClassDescriptor.events.concat(baseDescriptor.events);

        return currentClassDescriptor;
    }

    private GenerateMemberDescriptors() : NcBlockMemberDescriptor[]
    {
        if(this.memberObjects != null)
            return this.memberObjects.map(x => x.GenerateMemberDescriptor());
        else
            return new Array<NcBlockMemberDescriptor>()
    }
}

export class RootBlock extends NcBlock
{
    public constructor(
        oid: number,
        constantOid: boolean,
        owner: number | null,
        role: string,
        userLabel: string,
        lockable: boolean,
        lockState: NcLockState,
        touchpoints: NcTouchpoint[] | null,
        enabled: boolean,
        specId: string | null,
        specVersion: string | null,
        parentSpecId: string | null,
        parentSpecVersion: string | null,
        specDescription: string | null,
        isDynamic: boolean,
        memberObjects: NcObject[] | null,
        ports: NcPort[] | null,
        signalPaths: NcSignalPath[] | null,
        notificationContext: INotificationContext)
    {
        super(oid,
            constantOid,
            owner,
            role,
            userLabel,
            lockable,
            lockState,
            touchpoints,
            enabled,
            specId,
            specVersion,
            parentSpecId,
            parentSpecVersion,
            specDescription,
            isDynamic,
            memberObjects,
            ports,
            signalPaths,
            notificationContext);
    }

    public ProcessMessage(msg: string, socket: WebSocketConnection)
    {
        let message = JSON.parse(msg) as ProtocolWrapper;

        switch(message.messageType)
        {
            case 'CreateSession':
            {
                let msgCreateSession = JSON.parse(msg) as ProtoCreateSession;
                let outcome = this.notificationContext.CreateSession(socket, msgCreateSession.messages[0].arguments['heartBeatTime']);
                if(outcome[0] != 0)
                {
                    socket.send(new ProtoCreateSessionResponse([
                        new CreateSessionResponse(msgCreateSession.messages[0].handle, NcMethodStatus.OK, outcome[0], null)
                    ]).ToJson());
                }
                else
                {
                    socket.send(new ProtoCreateSessionResponse([
                        new CreateSessionResponse(msgCreateSession.messages[0].handle, NcMethodStatus.OK, null, outcome[1])
                    ]).ToJson());
                }
            }
            break;

            case 'Command':
            {
                let msgCommand = JSON.parse(msg) as ProtoCommand;
                socket.send(this.ProcessCommand(msgCommand).ToJson());
            }
            break;
        }
    }

    public ProcessCommand(command: ProtoCommand) : ProtoCommandResponse
    {
        let responses = new ProtoCommandResponse(command.sessionId, []);

        for (var i = 0; i < command.messages.length; i++) {
            let msg = command.messages[i];
            responses.AddCommandResponse(this.ProcessCommandMessage(msg));
        }

        return responses;
    }

    public ProcessCommandMessage(commandMsg: CommandMsg) : CommandResponseNoValue
    {
        if (this.IsGenericGetter(commandMsg.methodID))
        {
            if(commandMsg.arguments != null && 'id' in commandMsg.arguments)
            {
                let propertyId = commandMsg.arguments['id'] as NcElementID;

                if(commandMsg.oid == this.oid)
                    return this.Get(commandMsg.oid, propertyId, commandMsg.handle);
                else if(this.memberObjects != null)
                {
                    let member = this.memberObjects.find(e => e.oid === commandMsg.oid);
                    if(member !== undefined)
                        return member.Get(commandMsg.oid, propertyId, commandMsg.handle);
                    else
                        return new CommandResponseNoValue(commandMsg.handle, NcMethodStatus.InvalidRequest, "OID could not be found");
                }
            }
            else
                return new CommandResponseNoValue(commandMsg.handle, NcMethodStatus.InvalidRequest, "OID could not be found");
        }
        else if (this.IsGenericSetter(commandMsg.methodID))
        {
            if(commandMsg.arguments != null && 'id' in commandMsg.arguments)
            {
                let propertyId = commandMsg.arguments['id'] as NcElementID;
                let propertyValue = commandMsg.arguments['value'];

                if(commandMsg.oid == this.oid)
                    return this.Set(commandMsg.oid, propertyId, propertyValue, commandMsg.handle);
                else if(this.memberObjects != null)
                {
                    let member = this.memberObjects.find(e => e.oid === commandMsg.oid);
                    if(member !== undefined)
                        return member.Set(commandMsg.oid, propertyId, propertyValue, commandMsg.handle);
                    else
                        return new CommandResponseNoValue(commandMsg.handle, NcMethodStatus.InvalidRequest, "OID could not be found");
                }
            }
            else
                return new CommandResponseNoValue(commandMsg.handle, NcMethodStatus.InvalidRequest, "OID could not be found");
        }
        else
        {
            if(commandMsg.oid == this.oid)
                return this.InvokeMethod(commandMsg.oid, commandMsg.methodID, commandMsg.arguments, commandMsg.handle);
            else if(this.memberObjects != null)
            {
                let member = this.memberObjects.find(e => e.oid === commandMsg.oid);
                if(member !== undefined)
                    return member.InvokeMethod(commandMsg.oid, commandMsg.methodID, commandMsg.arguments, commandMsg.handle);
                else
                return new CommandResponseNoValue(commandMsg.handle, NcMethodStatus.InvalidRequest, "OID could not be found");
            }
        }

        return new CommandResponseNoValue(commandMsg.handle, NcMethodStatus.InvalidRequest, "OID could not be found");
    }

    public IsGenericGetter(propertyId: NcElementID) : boolean
    {
        if(propertyId.level == 1 && propertyId.index == 1)
            return true;
        return false;
    }

    public IsGenericSetter(propertyId: NcElementID) : boolean
    {
        if(propertyId.level == 1 && propertyId.index == 2)
            return true;
        return false;
    }
}