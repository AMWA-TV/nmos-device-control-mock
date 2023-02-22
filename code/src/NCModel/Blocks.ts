import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { CommandMsg, CommandResponseError, CommandResponseNoValue, CommandResponseWithValue, ProtocolCommand, ProtocolCommandResponse, ProtocolError } from '../NCProtocol/Commands';
import { MessageType, ProtocolWrapper } from '../NCProtocol/Core';
import { WebSocketConnection } from '../Server';
import { INotificationContext } from '../SessionManager';
import {
    myIdDecorator,
    NcBlockDescriptor,
    NcBlockMemberDescriptor,
    NcClassDescriptor,
    NcElementId,
    NcMethodDescriptor,
    NcMethodStatus,
    NcObject,
    NcParameterDescriptor,
    NcPort,
    NcPropertyConstraints,
    NcPropertyDescriptor,
    NcSignalPath,
    NcTouchpoint } from './Core';

export class NcBlock extends NcObject
{
    public static staticClassID: number[] = [ 1, 1 ];

    @myIdDecorator('1p1')
    public override classID: number[] = NcBlock.staticClassID;

    @myIdDecorator('2p1')
    public isRoot: boolean;

    @myIdDecorator('2p2')
    public specId: string | null;

    @myIdDecorator('2p3')
    public specVersion: string | null;

    @myIdDecorator('2p4')
    public specDescription: string | null;

    @myIdDecorator('2p5')
    public parentSpecId: string | null;

    @myIdDecorator('2p6')
    public parentSpecVersion: string | null;

    @myIdDecorator('2p7')
    public isDynamic: boolean;

    @myIdDecorator('2p8')
    public isModified: boolean;

    @myIdDecorator('2p9')
    public enabled: boolean;

    @myIdDecorator('2p10')
    public members: NcBlockMemberDescriptor[];

    @myIdDecorator('2p11')
    public ports: NcPort[] | null;

    @myIdDecorator('2p12')
    public signalPaths: NcSignalPath[] | null;

    public memberObjects: NcObject[];

    public constructor(
        isRoot: boolean,
        oid: number,
        constantOid: boolean,
        owner: number | null,
        role: string,
        userLabel: string,
        touchpoints: NcTouchpoint[] | null,
        runtimePropertyConstraints: NcPropertyConstraints[] | null,
        enabled: boolean,
        specId: string | null,
        specVersion: string | null,
        parentSpecId: string | null,
        parentSpecVersion: string | null,
        specDescription: string | null,
        isDynamic: boolean,
        memberObjects: NcObject[],
        ports: NcPort[] | null,
        signalPaths: NcSignalPath[] | null,
        description: string,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, touchpoints, runtimePropertyConstraints, description, notificationContext);

        this.isRoot = isRoot;
        this.enabled = enabled;
        this.specId = specId;
        this.specVersion = specVersion;
        this.parentSpecId = parentSpecId;
        this.parentSpecVersion = parentSpecVersion;
        this.specDescription = specDescription;
        this.isDynamic = isDynamic;
        this.isModified = false;
        this.memberObjects = memberObjects;

        this.members = this.memberObjects.map(x => x.GenerateMemberDescriptor());

        this.ports = ports;
        this.signalPaths = signalPaths;
    }

    //'1m1'
    public override Get(oid: number, propertyId: NcElementId, handle: number) : CommandResponseNoValue
    {
        if(oid == this.oid)
        {
            let key: string = `${propertyId.level}p${propertyId.index}`;

            switch(key)
            {
                case '2p1':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.isRoot);
                case '2p2':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.specId);
                case '2p3':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.specVersion);
                case '2p4':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.specDescription);
                case '2p5':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.parentSpecId);
                case '2p6':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.parentSpecVersion);
                case '2p7':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.isDynamic);
                case '2p8':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.isModified);
                case '2p9':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.enabled);
                case '2p10':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.members);
                case '2p11':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.ports);
                case '2p12':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.signalPaths);
                default:
                    return super.Get(oid, propertyId, handle);
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }

    //'1m2'
    public override Set(oid: number, id: NcElementId, value: any, handle: number) : CommandResponseNoValue
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
                case '2p12':
                    return new CommandResponseError(handle, NcMethodStatus.Readonly, 'Property is readonly');
                default:
                    return super.Set(oid, id, value, handle);
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }

    public override InvokeMethod(socket: WebSocketConnection, oid: number, methodId: NcElementId, args: { [key: string]: any; } | null, handle: number): CommandResponseNoValue 
    {
        if(oid == this.oid)
        {
            let key: string = `${methodId.level}m${methodId.index}`;

            switch(key)
            {
                case '2m1':
                    {
                        if(args != null)
                        {
                            let recurse = args['recurse'] as boolean;

                            if(recurse)
                                return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.GenerateMemberDescriptors(true));
                            else
                                return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.GenerateMemberDescriptors(false));
                        }
                        else
                            return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid arguments provided');
                    }
                case '2m2':
                    {
                        if(args != null)
                        {
                            let rolePath = args['path'] as string[];

                            return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.GenerateMemberDescriptorsForRolePath(rolePath));
                        }
                        else
                            return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid arguments provided');
                    }
                case '2m3':
                    {
                        if(args != null)
                        {
                            if('role' in args)
                            {
                                if('caseSensitive' in args)
                                {
                                    if('matchWholeString' in args)
                                    {
                                        let role = args['role'] as string;
                                        let caseSensitive = args['caseSensitive'] as boolean;
                                        let matchWholeString = args['matchWholeString'] as boolean;
                                        let recurse = args['recurse'] as boolean;

                                        if(recurse)
                                            return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.GenerateMemberDescriptorsByRole(role, caseSensitive, matchWholeString, true));
                                        else
                                            return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.GenerateMemberDescriptorsByRole(role, caseSensitive, matchWholeString, false));
                                    }
                                    else
                                        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'No matchWholeString argument provided');
                                }
                                else
                                    return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'No caseSensitive argument provided');
                            }
                            else
                                return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'No role argument provided');
                        }
                        else
                            return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid arguments provided');
                    }
                case '2m4':
                    {
                        if(args != null)
                        {
                            if('id' in args)
                            {
                                if('includeDerived' in args)
                                {
                                    let id = args['id'] as number[];
                                    let includeDerived = args['includeDerived'] as boolean;
                                    let recurse = args['recurse'] as boolean;

                                    if(recurse)
                                        return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.GenerateMemberDescriptorsByClassId(id, includeDerived, true));
                                    else
                                        return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.GenerateMemberDescriptorsByClassId(id, includeDerived, false));
                                }
                                else
                                    return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'No includeDerived argument provided');
                            }
                            else
                                return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'No id argument provided');
                        }
                        else
                            return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid arguments provided');
                    }
                default:
                    return super.InvokeMethod(socket, oid, methodId, args, handle);
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }

    public override GenerateMemberDescriptor() : NcBlockMemberDescriptor
    {
        return new NcBlockDescriptor(this.specId, this.role, this.oid, this.constantOid, this.classID, this.userLabel, this.owner, this.description, null);
    }

    public FindNestedMember(oid: number): NcObject | null
    {
        let memberToReturn : NcObject | null = null;

        if(this.memberObjects != null)
        {
            let member = this.memberObjects.find(e => e.oid === oid);
            if(member)
                memberToReturn = member;
            else
            {
                let blocks = this.memberObjects.filter(e => e instanceof NcBlock);

                for(let obj of blocks) 
                {
                    let block = obj as NcBlock;
                    if(block)
                    {
                        let nestedMember = block.FindNestedMember(oid);
                        if(nestedMember)
                        {
                            memberToReturn = nestedMember;
                            break;
                        }
                    }
                }
            }
        }
        
        return memberToReturn;
    }

    public static override GetClassDescriptor(includeInherited: boolean): NcClassDescriptor 
    {
        let currentClassDescriptor = new NcClassDescriptor(`${NcBlock.name} class descriptor`,
            NcBlock.staticClassID, NcBlock.name, null,
            [
                new NcPropertyDescriptor(new NcElementId(2, 1), "isRoot", "NcBoolean", true, true, false, false, null, "TRUE if block is the root block"),
                new NcPropertyDescriptor(new NcElementId(2, 2), "specId", "NcString", true, true, true, false, null, "Global ID of blockSpec that defines this block"),
                new NcPropertyDescriptor(new NcElementId(2, 3), "specVersion", "NcVersionCode", true, true, true, false, null, "Version code of blockSpec that defines this block"),
                new NcPropertyDescriptor(new NcElementId(2, 4), "specDescription", "NcString", true, true, true, false, null, "Description of blockSpec that defines this block"),
                new NcPropertyDescriptor(new NcElementId(2, 5), "parentSpecId", "NcString", true, true, true, false, null, "Global ID of parent of blockSpec that defines this block"),
                new NcPropertyDescriptor(new NcElementId(2, 6), "parentSpecVersion", "NcVersionCode", true, true, true, false, null, "Version code of parent of blockSpec that defines this block"),
                new NcPropertyDescriptor(new NcElementId(2, 7), "isDynamic", "NcBoolean", true, true, false, false, null, "TRUE if dynamic block"),
                new NcPropertyDescriptor(new NcElementId(2, 8), "isModified", "NcBoolean", true, false, false, false, null, "TRUE if block contents modified since last reset"),
                new NcPropertyDescriptor(new NcElementId(2, 9), "enabled", "NcBoolean", true, true, false, false, null, "TRUE if block is functional"),
                new NcPropertyDescriptor(new NcElementId(2, 10), "members", "NcBlockMemberDescriptor", true, true, false, true, null, "Descriptors of this block's members"),
                new NcPropertyDescriptor(new NcElementId(2, 11), "ports", "NcPort", true, true, true, true, null, "this block's ports"),
                new NcPropertyDescriptor(new NcElementId(2, 12), "signalPaths", "NcSignalPath", true, true, true, true, null, "this block's signal paths"),
            ],
            [ 
                new NcMethodDescriptor(new NcElementId(2, 1), "GetMemberDescriptors", "NcMethodResultBlockMemberDescriptors",
                    [new NcParameterDescriptor("recurse", "NcBoolean", false, false, null, "If recurse is set to true, nested members can be retrieved")], "gets descriptors of members of the block"),
                new NcMethodDescriptor(new NcElementId(2, 2), "FindMembersByPath", "NcMethodResultBlockMemberDescriptors", [
                    new NcParameterDescriptor("path", "NcRolePath", false, false, null, "path to search for")
                ], "finds member(s) by path"),
                new NcMethodDescriptor(new NcElementId(2, 3), "FindMembersByRole", "NcMethodResultBlockMemberDescriptors", [
                    new NcParameterDescriptor("role", "NcString", false, false, null, "role text to search for"),
                    new NcParameterDescriptor("caseSensitive", "NcBoolean", false,  false, null, "signals if the comparison should be case sensitive"),
                    new NcParameterDescriptor("matchWholeString", "NcBoolean", false,  false, null, "TRUE to only return exact matches"),
                    new NcParameterDescriptor("recurse", "NcBoolean", false,  false, null, "TRUE to search nested blocks")
                ], "finds members with given role name or fragment"),
                new NcMethodDescriptor(new NcElementId(2, 4), "FindMembersByClassId", "NcMethodResultBlockMemberDescriptors", [
                    new NcParameterDescriptor("id", "NcClassId", false, false, null, "class id to search for"),
                    new NcParameterDescriptor("includeDerived", "NcBoolean", false,  false, null, "If TRUE it will also include derived class descriptors"),
                    new NcParameterDescriptor("recurse", "NcBoolean", false,  false, null, "TRUE to search nested blocks")
                ], "finds members with given class id")
            ],
            []
        );

        if(includeInherited)
        {
            let baseDescriptor = super.GetClassDescriptor(includeInherited);

            currentClassDescriptor.properties = currentClassDescriptor.properties.concat(baseDescriptor.properties);
            currentClassDescriptor.methods = currentClassDescriptor.methods.concat(baseDescriptor.methods);
            currentClassDescriptor.events = currentClassDescriptor.events.concat(baseDescriptor.events);
        }

        return currentClassDescriptor;
    }

    public GenerateMemberDescriptors(recurse: boolean) : NcBlockMemberDescriptor[]
    {
        if(this.memberObjects != null)
        {
            let descriptors = new Array<NcBlockMemberDescriptor>();

            this.memberObjects.forEach(member => {
                descriptors.push(member.GenerateMemberDescriptor());
                if(recurse && member instanceof NcBlock)
                    descriptors = descriptors.concat(member.GenerateMemberDescriptors(recurse));
            });

            return descriptors;
        }
        else
            return new Array<NcBlockMemberDescriptor>()
    }

    public GenerateMemberDescriptorsForRolePath(rolePath: string[]) : NcBlockMemberDescriptor[]
    {
        if(rolePath.length == 1 && rolePath[0] == this.role)
        {
            return [ this.GenerateMemberDescriptor() ];
        }
        else if(rolePath.length > 1 && rolePath[0] == this.role)
        {
            let childRole = rolePath[1];
            if(this.memberObjects != null)
            {
                let member = this.memberObjects.find(e => e.role === childRole);
                if(member)
                {
                    if(rolePath.length == 2)
                    {
                        return [ member.GenerateMemberDescriptor() ];
                    }
                    else if(member instanceof NcBlock)
                    {
                        let furtherPath = rolePath.splice(1);
                        return member.GenerateMemberDescriptorsForRolePath(furtherPath);
                    }
                    else
                        return new Array<NcBlockMemberDescriptor>()
                }
                else
                    return new Array<NcBlockMemberDescriptor>()
            }
            else
                return new Array<NcBlockMemberDescriptor>()
        }
        else
            return new Array<NcBlockMemberDescriptor>()
    }

    public GenerateMemberDescriptorsByRole(role: string, caseSensitive: boolean, matchWholeString: boolean, recurse: boolean) : NcBlockMemberDescriptor[]
    {
        if(this.memberObjects != null)
        {
            let descriptors = new Array<NcBlockMemberDescriptor>();

            this.memberObjects.forEach(member => {
                if(caseSensitive && matchWholeString)
                {
                    if(member.role === role)
                        descriptors.push(member.GenerateMemberDescriptor());
                }
                else if(caseSensitive && matchWholeString == false)
                {
                    if(member.role.includes(role))
                        descriptors.push(member.GenerateMemberDescriptor());
                }
                else if(caseSensitive == false && matchWholeString)
                {
                    if(member.role.toUpperCase() === role.toUpperCase())
                        descriptors.push(member.GenerateMemberDescriptor());
                }
                else if(caseSensitive == false && matchWholeString == false)
                {
                    if(member.role.toUpperCase().includes(role.toUpperCase()))
                        descriptors.push(member.GenerateMemberDescriptor());
                }

                if(recurse && member instanceof NcBlock)
                    descriptors = descriptors.concat(member.GenerateMemberDescriptorsByRole(role, caseSensitive, matchWholeString, recurse));
            });

            return descriptors;
        }
        else
            return new Array<NcBlockMemberDescriptor>()
    }

    public GenerateMemberDescriptorsByClassId(classId: number[], includeDerived: boolean, recurse: boolean) : NcBlockMemberDescriptor[]
    {
        if(this.memberObjects != null)
        {
            let descriptors = new Array<NcBlockMemberDescriptor>();

            this.memberObjects.forEach(member => {
                if(includeDerived)
                {
                    if(member.classID.join().includes(classId.join()))
                        descriptors.push(member.GenerateMemberDescriptor());
                }
                else
                {
                    if(member.classID.join() === classId.join())
                        descriptors.push(member.GenerateMemberDescriptor());
                }

                if(recurse && member instanceof NcBlock)
                    descriptors = descriptors.concat(member.GenerateMemberDescriptorsByClassId(classId, includeDerived, recurse));
            });

            return descriptors;
        }
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
        touchpoints: NcTouchpoint[] | null,
        runtimePropertyConstraints: NcPropertyConstraints[] | null,
        enabled: boolean,
        specId: string | null,
        specVersion: string | null,
        parentSpecId: string | null,
        parentSpecVersion: string | null,
        specDescription: string | null,
        isDynamic: boolean,
        memberObjects: NcObject[],
        ports: NcPort[] | null,
        signalPaths: NcSignalPath[] | null,
        description: string,
        notificationContext: INotificationContext)
    {
        super(
            true,
            oid,
            constantOid,
            owner,
            role,
            userLabel,
            touchpoints,
            runtimePropertyConstraints,
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
            description,
            notificationContext);
    }

    public ProcessMessage(msg: string, socket: WebSocketConnection)
    {
        let isMessageValid = false;
        let errorMessage = ``;
        let status: NcMethodStatus = NcMethodStatus.BadCommandFormat;

        try
        {
            let message = JSON.parse(msg) as ProtocolWrapper;

            switch(message.messageType)
            {
                case MessageType.Command:
                {
                    let msgCommand = JSON.parse(msg) as ProtocolCommand;
                    socket.send(this.ProcessCommand(msgCommand, socket).ToJson());
                    isMessageValid = true;
                }
                break;
                default:
                {
                    isMessageValid = false;
                    errorMessage = `Invalid message type received: ${message.messageType}`;
                }
                break;
            }
        }
        catch (err)
        {
            console.log(err);
            isMessageValid = false;
            errorMessage = `Could not parse JSON message: ${msg}`;
        }

        if(isMessageValid == false)
        {
            console.log(errorMessage);
            let error = new ProtocolError(status, errorMessage);
            socket.send(error.ToJson());
        }
    }

    public ProcessCommand(command: ProtocolCommand, socket: WebSocketConnection) : ProtocolCommandResponse
    {
        let responses = new ProtocolCommandResponse([]);

        for (var i = 0; i < command.commands.length; i++) {
            let msg = command.commands[i];
            responses.AddCommandResponse(this.ProcessCommandMessage(msg, socket));
        }

        return responses;
    }

    public ProcessCommandMessage(commandMsg: CommandMsg, socket: WebSocketConnection) : CommandResponseNoValue
    {
        if (this.IsGenericGetter(commandMsg.methodId))
        {
            if(commandMsg.arguments != null && 'id' in commandMsg.arguments)
            {
                let propertyId = commandMsg.arguments['id'] as NcElementId;

                if(commandMsg.oid == this.oid)
                    return this.Get(commandMsg.oid, propertyId, commandMsg.handle);
                else if(this.memberObjects != null)
                {
                    let member = this.FindNestedMember(commandMsg.oid);
                    if(member)
                        return member.Get(commandMsg.oid, propertyId, commandMsg.handle);
                    else
                        return new CommandResponseError(commandMsg.handle, NcMethodStatus.InvalidRequest, "OID could not be found");
                }
            }
            else
                return new CommandResponseError(commandMsg.handle, NcMethodStatus.InvalidRequest, "OID could not be found");
        }
        else if (this.IsGenericSetter(commandMsg.methodId))
        {
            if(commandMsg.arguments != null && 'id' in commandMsg.arguments)
            {
                let propertyId = commandMsg.arguments['id'] as NcElementId;
                let propertyValue = commandMsg.arguments['value'];

                if(commandMsg.oid == this.oid)
                    return this.Set(commandMsg.oid, propertyId, propertyValue, commandMsg.handle);
                else if(this.memberObjects != null)
                {
                    let member = this.FindNestedMember(commandMsg.oid);
                    if(member)
                        return member.Set(commandMsg.oid, propertyId, propertyValue, commandMsg.handle);
                    else
                        return new CommandResponseError(commandMsg.handle, NcMethodStatus.InvalidRequest, "OID could not be found");
                }
            }
            else
                return new CommandResponseError(commandMsg.handle, NcMethodStatus.InvalidRequest, "OID could not be found");
        }
        else
        {
            if(commandMsg.oid == this.oid)
                return this.InvokeMethod(socket, commandMsg.oid, commandMsg.methodId, commandMsg.arguments, commandMsg.handle);
            else if(this.memberObjects != null)
            {
                let member = this.FindNestedMember(commandMsg.oid);
                if(member)
                    return member.InvokeMethod(socket, commandMsg.oid, commandMsg.methodId, commandMsg.arguments, commandMsg.handle);
                else
                    return new CommandResponseError(commandMsg.handle, NcMethodStatus.InvalidRequest, "OID could not be found");
            }
        }

        return new CommandResponseError(commandMsg.handle, NcMethodStatus.InvalidRequest, "OID could not be found");
    }

    public IsGenericGetter(propertyId: NcElementId) : boolean
    {
        if(propertyId.level == 1 && propertyId.index == 1)
            return true;
        return false;
    }

    public IsGenericSetter(propertyId: NcElementId) : boolean
    {
        if(propertyId.level == 1 && propertyId.index == 2)
            return true;
        return false;
    }
}