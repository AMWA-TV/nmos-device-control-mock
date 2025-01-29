import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { CommandMsg, CommandResponseError, CommandResponseNoValue, CommandResponseWithValue, ProtocolCommand, ProtocolCommandResponse, ProtocolError } from '../NCProtocol/Commands';
import { MessageType, ProtocolWrapper } from '../NCProtocol/Core';
import { WebSocketConnection } from '../Server';
import { INotificationContext } from '../SessionManager';
import {
    myIdDecorator,
    NcBlockMemberDescriptor,
    NcBulkValuesHolder,
    NcClassDescriptor,
    NcElementId,
    NcMethodDescriptor,
    NcMethodStatus,
    NcObject,
    NcObjectPropertiesHolder,
    NcObjectPropertiesSetValidation,
    NcParameterDescriptor,
    NcPropertyChangeType,
    NcPropertyConstraints,
    NcPropertyDescriptor,
    NcPropertyId,
    NcPropertyRestoreNotice,
    NcPropertyRestoreNoticeType,
    NcPropertyValueHolder,
    NcRestoreMode,
    NcRestoreValidationStatus,
    NcTouchpoint, 
    RestoreArguments } from './Core';
import { ExampleControl } from './Features';

export class NcBlock extends NcObject
{
    public static staticClassID: number[] = [ 1, 1 ];

    public static readonly RootOid: number = 1;

    @myIdDecorator('1p1')
    public override classID: number[] = NcBlock.staticClassID;

    @myIdDecorator('2p1')
    public enabled: boolean;

    @myIdDecorator('2p2')
    public members: NcBlockMemberDescriptor[];

    public memberObjects: NcObject[];

    protected maxMembers: number | null;

    protected rootContext: IRootContext | null;

    public constructor(
        oid: number,
        constantOid: boolean,
        ownerObject: NcObject | null,
        role: string,
        userLabel: string,
        touchpoints: NcTouchpoint[] | null,
        runtimePropertyConstraints: NcPropertyConstraints[] | null,
        enabled: boolean,
        memberObjects: NcObject[],
        description: string,
        notificationContext: INotificationContext,
        rootContext: IRootContext | null,
        maxMembers: number | null = null,
        isRebuildable: boolean = false)
    {
        super(oid, constantOid, ownerObject, role, userLabel, touchpoints, runtimePropertyConstraints, description, notificationContext, isRebuildable);

        this.maxMembers = maxMembers;

        this.rootContext = rootContext;

        this.enabled = enabled;
        this.memberObjects = memberObjects;

        this.members = this.memberObjects.map(x => x.GenerateMemberDescriptor());
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
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.enabled);
                case '2p2':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.members);
                default:
                    return super.Get(oid, propertyId, handle);
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.BadOid, 'OID could not be found');
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
                    return new CommandResponseError(handle, NcMethodStatus.Readonly, 'Property is readonly');
                default:
                    return super.Set(oid, id, value, handle);
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.BadOid, 'OID could not be found');
    }

    public override InvokeMethod(oid: number, methodId: NcElementId, args: { [key: string]: any; } | null, handle: number): CommandResponseNoValue 
    {
        if(oid == this.oid)
        {
            let key: string = `${methodId.level}m${methodId.index}`;
            switch(key)
            {
                case '1m3': //GetSequenceItem
                    {
                        if(args != null &&
                            'id' in args &&
                            'index' in args)
                        {
                            let propertyId = args['id'] as NcElementId;
                            let index = args['index'] as number;

                            if(propertyId)
                            {
                                if(index >= 0)
                                {
                                    let propertyKey: string = `${propertyId.level}p${propertyId.index}`;
                                    switch(propertyKey)
                                    {
                                        case '2p2':
                                            {
                                                let itemValue = this.members[index];
                                                if(itemValue)
                                                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, itemValue);
                                                else
                                                    return new CommandResponseError(handle, NcMethodStatus.IndexOutOfBounds, 'Index could not be found');
                                            }
                                        default:
                                            return new CommandResponseError(handle, NcMethodStatus.PropertyNotImplemented, 'Property could not be found');
                                    }
                                }
                                else
                                    return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid index argument provided');
                            }
                            else
                                return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid id argument provided');
                        }
                        else
                            return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid arguments provided');
                    }
                case '1m4': //SetSequenceItem
                    {
                        if(args != null &&
                            'id' in args &&
                            'index' in args &&
                            'value' in args)
                        {
                            let propertyId = args['id'] as NcElementId;
                            if(propertyId)
                            {
                                let propertyKey: string = `${propertyId.level}p${propertyId.index}`;
                                return new CommandResponseError(handle, NcMethodStatus.Readonly, `Property ${propertyKey} is readonly`);
                            }
                            else
                                return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid id argument provided');
                        }
                        else
                            return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid arguments provided');
                    }
                case '1m5': //AddSequenceItem
                    {
                        if(args != null &&
                            'id' in args &&
                            'value' in args)
                        {
                            let propertyId = args['id'] as NcElementId;
                            if(propertyId)
                            {
                                let propertyKey: string = `${propertyId.level}p${propertyId.index}`;
                                return new CommandResponseError(handle, NcMethodStatus.Readonly, `Property ${propertyKey} is readonly`);
                            }
                            else
                                return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid id argument provided');
                        }
                        else
                            return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid arguments provided');
                    }
                case '1m6': //RemoveSequenceItem
                    {
                        if(args != null &&
                            'id' in args &&
                            'index' in args)
                        {
                            let propertyId = args['id'] as NcElementId;
                            if(propertyId)
                            {
                                let propertyKey: string = `${propertyId.level}p${propertyId.index}`;
                                return new CommandResponseError(handle, NcMethodStatus.Readonly, `Property ${propertyKey} is readonly`);
                            }
                            else
                                return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid id argument provided');
                        }
                        else
                            return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid arguments provided');
                    }
                case '1m7': //GetSequenceLength
                    {
                        if(args != null &&
                            'id' in args)
                        {
                            let propertyId = args['id'] as NcElementId;
                            if(propertyId)
                            {
                                let propertyKey: string = `${propertyId.level}p${propertyId.index}`;
                                switch(propertyKey)
                                {
                                    case '2p2':
                                        {
                                            let length = this.members.length;

                                            return new CommandResponseWithValue(handle, NcMethodStatus.OK, length);
                                        }
                                    default:
                                        return new CommandResponseError(handle, NcMethodStatus.PropertyNotImplemented, 'Property could not be found');
                                }
                            }
                            else
                                return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid id argument provided');
                        }
                        else
                            return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'Invalid arguments provided');
                    }
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
                            if('classId' in args)
                            {
                                if('includeDerived' in args)
                                {
                                    let classId = args['classId'] as number[];
                                    let includeDerived = args['includeDerived'] as boolean;
                                    let recurse = args['recurse'] as boolean;

                                    if(recurse)
                                        return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.GenerateMemberDescriptorsByClassId(classId, includeDerived, true));
                                    else
                                        return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.GenerateMemberDescriptorsByClassId(classId, includeDerived, false));
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
                    return super.InvokeMethod(oid, methodId, args, handle);
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.BadOid, 'OID could not be found');
    }

    public override GenerateMemberDescriptor() : NcBlockMemberDescriptor
    {
        return new NcBlockMemberDescriptor(this.role, this.oid, this.constantOid, this.classID, this.userLabel, this.owner, this.description);
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
                new NcPropertyDescriptor(new NcElementId(2, 1), "enabled", "NcBoolean", true, false, false, null, "TRUE if block is functional"),
                new NcPropertyDescriptor(new NcElementId(2, 2), "members", "NcBlockMemberDescriptor", true, false, true, null, "Descriptors of this block's members"),
            ],
            [ 
                new NcMethodDescriptor(new NcElementId(2, 1), "GetMemberDescriptors", "NcMethodResultBlockMemberDescriptors",
                    [new NcParameterDescriptor("recurse", "NcBoolean", false, false, null, "If recurse is set to true, nested members can be retrieved")], "Gets descriptors of members of the block"),
                new NcMethodDescriptor(new NcElementId(2, 2), "FindMembersByPath", "NcMethodResultBlockMemberDescriptors", [
                    new NcParameterDescriptor("path", "NcRolePath", false, false, null, "Relative path to search for (MUST not include the role of the block targeted by oid)")
                ], "Finds member(s) by path"),
                new NcMethodDescriptor(new NcElementId(2, 3), "FindMembersByRole", "NcMethodResultBlockMemberDescriptors", [
                    new NcParameterDescriptor("role", "NcString", false, false, null, "Role text to search for"),
                    new NcParameterDescriptor("caseSensitive", "NcBoolean", false,  false, null, "Signals if the comparison should be case sensitive"),
                    new NcParameterDescriptor("matchWholeString", "NcBoolean", false,  false, null, "TRUE to only return exact matches"),
                    new NcParameterDescriptor("recurse", "NcBoolean", false,  false, null, "TRUE to search nested blocks")
                ], "Finds members with given role name or fragment"),
                new NcMethodDescriptor(new NcElementId(2, 4), "FindMembersByClassId", "NcMethodResultBlockMemberDescriptors", [
                    new NcParameterDescriptor("classId", "NcClassId", false, false, null, "Class id to search for"),
                    new NcParameterDescriptor("includeDerived", "NcBoolean", false,  false, null, "If TRUE it will also include derived class descriptors"),
                    new NcParameterDescriptor("recurse", "NcBoolean", false,  false, null, "TRUE to search nested blocks")
                ], "Finds members with given class id")
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

    public UpdateMembers(memberObjects: NcObject[], notify: boolean = false)
    {
        this.memberObjects = memberObjects;
        this.members = this.memberObjects.map(x => x.GenerateMemberDescriptor());

        if(notify)
            this.notificationContext.NotifyPropertyChanged(this.oid, new NcElementId(2, 2), NcPropertyChangeType.ValueChanged, this.members, null);
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
        if(rolePath.length == 1)
        {
            if(rolePath[0] == this.role)
                return [ this.GenerateMemberDescriptor() ];
            else
            {
                let childRole = rolePath[0];
                if(this.memberObjects != null)
                {
                    let member = this.memberObjects.find(e => e.role === childRole);
                    if(member)
                        return [ member.GenerateMemberDescriptor() ];
                    else
                        return new Array<NcBlockMemberDescriptor>();
                }
                else
                    return new Array<NcBlockMemberDescriptor>();
            }
        }
        else if(rolePath.length > 1)
        {
            let childRole = rolePath[0];
            if(this.memberObjects != null)
            {
                let member = this.memberObjects.find(e => e.role === childRole);
                if(member)
                {
                    if(rolePath.length == 1)
                    {
                        return [ member.GenerateMemberDescriptor() ];
                    }
                    else if(member instanceof NcBlock)
                    {
                        let furtherPath = rolePath.splice(1);
                        return member.GenerateMemberDescriptorsForRolePath(furtherPath);
                    }
                    else
                        return new Array<NcBlockMemberDescriptor>();
                }
                else
                    return new Array<NcBlockMemberDescriptor>();
            }
            else
                return new Array<NcBlockMemberDescriptor>();
        }
        else
            return new Array<NcBlockMemberDescriptor>();
    }

    public FindMemberByRolePath(rolePath: string[]) : NcObject | null
    {
        if(rolePath.length == 1 && rolePath[0] == this.role)
        {
            return this;
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
                        return member;
                    }
                    else if(member instanceof NcBlock)
                    {
                        let furtherPath = rolePath.splice(1);
                        return member.FindMemberByRolePath(furtherPath);
                    }
                    else
                        return null;
                }
                else
                return null;
            }
            else
                return null;
        }
        else
            return null;
    }

    public override GetAllProperties(recurse: boolean) : NcObjectPropertiesHolder[]
    {
        let holders = [
            new NcObjectPropertiesHolder(this.GetRolePath(), [], [
                new NcPropertyValueHolder(new NcPropertyId(2, 1), "enabled", "NcBoolean", true, this.enabled),
                new NcPropertyValueHolder(new NcPropertyId(2, 2), "members", "NcBlockMemberDescriptor", true, this.members)
            ], this.isRebuildable)
        ];

        holders[0].values = holders[0].values.concat(super.GetAllProperties(recurse)[0].values);

        if(recurse)
        {
            this.memberObjects.forEach(member => {
                holders = holders.concat(member.GetAllProperties(recurse));
            });
        }

        return holders
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

    public GetRolePathUrls(): string[]
    {
        let urls = new Array<string>();

        urls = urls.concat(this.GetRolePathUrl());

        this.memberObjects.forEach(member => {
            if(member instanceof NcBlock)
                urls = urls.concat(member.GetRolePathUrls());
            else
                urls = urls.concat(member.GetRolePathUrl());
        });

        return urls;
    }

    public GetRolePathForMember(role: string): string[]
    {
        return this.GetRolePath().concat(role);
    }

    public ReconstructMembers(members: NcBlockMemberDescriptor[], dataSet: NcBulkValuesHolder, applyChanges: Boolean = true) : [NcPropertyRestoreNotice | null, NcObjectPropertiesSetValidation[]]
    {
        //Left intentionally empty as "virtual" so that rebuildable blocks override this with the desired behaviour
        return [null, []];
    }

    public override Restore(restoreArguments: RestoreArguments, applyChanges: Boolean) : NcObjectPropertiesSetValidation[]
    {
        let validationEntries = new Array<NcObjectPropertiesSetValidation>();

        let myRestoreData = restoreArguments.dataSet.values.find(f => f.path.join('.') == this.GetRolePath().join('.'))
        if(myRestoreData)
        {
            let myNotices = new Array<NcPropertyRestoreNotice>();

            myRestoreData.values.forEach(propertyData => 
            {
                let propertyId = NcElementId.ToPropertyString(propertyData.id);

                if(restoreArguments.restoreMode == NcRestoreMode.Rebuild)
                {
                    if(propertyId != '1p6' && propertyId != '2p2')
                        myNotices.push(new NcPropertyRestoreNotice(
                            propertyData.id,
                            propertyData.name,
                            NcPropertyRestoreNoticeType.Warning,
                            "Property cannot be changed and will be left untouched"));
                    else
                    {
                        //Perform further validation
                        if(propertyId == '2p2')
                        {
                            //Structural changes to the members
                            let membersData = propertyData.value as NcBlockMemberDescriptor[];
                            if(membersData)
                            {
                                //TODO: Might need to include the list of members in the outcomes of ReconstructMembers so that we can skip them from further restore actions because they would have already been applied when creating the member objects

                                let outcomes = this.ReconstructMembers(membersData, restoreArguments.dataSet, applyChanges);
                                if(outcomes[0] != null)
                                    myNotices.push(outcomes[0]);

                                validationEntries = validationEntries.concat(outcomes[1]);
                            }
                            else
                            {
                                myNotices.push(new NcPropertyRestoreNotice(
                                    propertyData.id,
                                    propertyData.name,
                                    NcPropertyRestoreNoticeType.Warning,
                                    `Cannot reconstruct members because the members data is null`));
                                console.log(`Cannot reconstruct members because the members data is null`);
                            }
                        }
                        else if(applyChanges)
                        {
                            //Perform further validations
                            this.Set(this.oid, propertyData.id, propertyData.value, 0);
                        }
                    }
                }
                else
                {
                    if(propertyId == '2p2')
                    {
                        if(this.isRebuildable)
                            myNotices.push(new NcPropertyRestoreNotice(
                                propertyData.id,
                                propertyData.name,
                                NcPropertyRestoreNoticeType.Warning,
                                "Property cannot be changed and will be left untouched unless restoreMode is changed to Rebuild"));
                        else
                            myNotices.push(new NcPropertyRestoreNotice(
                                propertyData.id,
                                propertyData.name,
                                NcPropertyRestoreNoticeType.Warning,
                                "Property cannot be changed and will be left untouched"));
                    }
                    else if(propertyId != '1p6')
                        myNotices.push(new NcPropertyRestoreNotice(
                            propertyData.id,
                            propertyData.name,
                            NcPropertyRestoreNoticeType.Warning,
                            "Property cannot be changed and will be left untouched"));
                    else if(applyChanges)
                    {
                        //Perform further validations
                        this.Set(this.oid, propertyData.id, propertyData.value, 0);
                    }
                }
            });

            validationEntries.push(new NcObjectPropertiesSetValidation(this.GetRolePath(), NcRestoreValidationStatus.Ok, myNotices, myNotices.length > 0 ? 'Some properties have notices' : null));
        }

        if(restoreArguments.recurse)
        {
            this.memberObjects.forEach(member => {
                validationEntries = validationEntries.concat(member.Restore(restoreArguments, applyChanges));
            });
        }

        return validationEntries;
    }
}

export interface IRootContext
{
    AllocateOid(path: string) : number
}

export class RootBlock extends NcBlock implements IRootContext
{
    private oidAllocations: { [id: number] : string; } = {};

    public constructor(
        constantOid: boolean,
        ownerObject: NcObject | null,
        role: string,
        userLabel: string,
        touchpoints: NcTouchpoint[] | null,
        runtimePropertyConstraints: NcPropertyConstraints[] | null,
        enabled: boolean,
        memberObjects: NcObject[],
        description: string,
        notificationContext: INotificationContext,
        maxMembers: number | null = null)
    {
        super(
            NcBlock.RootOid,
            constantOid,
            ownerObject,
            role,
            userLabel,
            touchpoints,
            runtimePropertyConstraints,
            enabled,
            memberObjects,
            description,
            notificationContext,
            null,
            maxMembers);

        this.oidAllocations[NcBlock.RootOid] = this.GetRolePathUrl();
    }

    public AllocateOid(path: string) : number
    {
        //Generate new oid
        let newOid = Object.keys(this.oidAllocations).length + 1;
        this.oidAllocations[newOid] = path;
        return newOid;
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

                    let invalidCommands = msgCommand.commands.filter(x => isNaN(+x.handle));
                    if(invalidCommands.length > 0)
                    {
                        isMessageValid = false;
                        errorMessage = `One of the commands has an invalid handle`;
                    }
                    else
                    {
                        let invalidCommands = msgCommand.commands.filter(x => x.handle <= 0 || x.handle > 65535);
                        if(invalidCommands.length > 0)
                        {
                            isMessageValid = false;
                            errorMessage = `One of the commands has an invalid handle`;
                        }
                        else
                        {
                            socket.send(this.ProcessCommand(msgCommand, socket).ToJson());
                            isMessageValid = true;
                        }
                    }
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
                        return new CommandResponseError(commandMsg.handle, NcMethodStatus.BadOid, "OID could not be found");
                }
            }
            else
                return new CommandResponseError(commandMsg.handle, NcMethodStatus.BadOid, "OID could not be found");
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
                        return new CommandResponseError(commandMsg.handle, NcMethodStatus.BadOid, "OID could not be found");
                }
            }
            else
                return new CommandResponseError(commandMsg.handle, NcMethodStatus.BadOid, "OID could not be found");
        }
        else
        {
            if(commandMsg.oid == this.oid)
                return this.InvokeMethod(commandMsg.oid, commandMsg.methodId, commandMsg.arguments, commandMsg.handle);
            else if(this.memberObjects != null)
            {
                let member = this.FindNestedMember(commandMsg.oid);
                if(member)
                    return member.InvokeMethod(commandMsg.oid, commandMsg.methodId, commandMsg.arguments, commandMsg.handle);
                else
                    return new CommandResponseError(commandMsg.handle, NcMethodStatus.BadOid, "OID could not be found");
            }
        }

        return new CommandResponseError(commandMsg.handle, NcMethodStatus.BadOid, "OID could not be found");
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

export class ExampleControlsBlock extends NcBlock
{
    public constructor(
        oid: number,
        constantOid: boolean,
        ownerObject: NcObject | null,
        role: string,
        userLabel: string,
        touchpoints: NcTouchpoint[] | null,
        runtimePropertyConstraints: NcPropertyConstraints[] | null,
        enabled: boolean,
        memberObjects: NcObject[],
        description: string,
        notificationContext: INotificationContext,
        rootContext: IRootContext | null,
        maxMembers: number | null = null,
        isRebuildable: boolean)
    {
        super(
            oid,
            constantOid,
            ownerObject,
            role,
            userLabel,
            touchpoints,
            runtimePropertyConstraints,
            enabled,
            memberObjects,
            description,
            notificationContext,
            rootContext,
            maxMembers,
            isRebuildable);
    }

    public override ReconstructMembers(members: NcBlockMemberDescriptor[], dataSet: NcBulkValuesHolder, applyChanges: Boolean = true) : [NcPropertyRestoreNotice | null, NcObjectPropertiesSetValidation[]]
    {
        let blockMembersNotice: NcPropertyRestoreNotice | null = null;

        let validationEntries = new Array<NcObjectPropertiesSetValidation>();

        console.log(`Reconstructing members, count: ${members.length}, applyChanges: ${applyChanges}`);

        let controlMembers: ExampleControl[] = [];

        members.forEach(member => {
            if(member.classId.join() == ExampleControl.staticClassID.join())
            {
                if(this.maxMembers != null)
                {
                    if(controlMembers.length < this.maxMembers)
                    {
                        if(this.rootContext != null)
                        {
                            let memberRolepath = this.GetRolePathForMember(member.role);
    
                            let setValidation: NcObjectPropertiesSetValidation;
    
                            let memberRestoreData = dataSet.values.find(f => f.path.join('.') == memberRolepath.join('.'))
                            if(memberRestoreData)
                                setValidation = this.ValidateMemberDatasetChunk(memberRestoreData);
                            else
                                setValidation = new NcObjectPropertiesSetValidation(memberRolepath, NcRestoreValidationStatus.Ok, [], "No dataset information passed but object was created successfully with defaults")
    
                            validationEntries = validationEntries.concat(setValidation);

                            if(applyChanges)
                            {
                                const exampleControl = new ExampleControl(
                                    this.rootContext.AllocateOid(memberRolepath.join('.')),
                                    true,
                                    this,
                                    member.role,
                                    member.userLabel ?? member.role,
                                    [],
                                    null,
                                    true,
                                    "Example control worker",
                                    this.notificationContext,
                                    true,
                                    memberRestoreData);
        
                                controlMembers.push(exampleControl);
                            }
                        }
                    }
                    else
                    {
                        blockMembersNotice = new NcPropertyRestoreNotice(new NcPropertyId(2, 2), "members", NcPropertyRestoreNoticeType.Warning, `Member [${member.role}] can't be constructed because it goes over the maximum block members limit of ${this.maxMembers}`);
                        console.log(`Member [${member.role}] can't be constructed because it goes over the maximum block members limit of ${this.maxMembers}`);
                    }
                }
                else
                {
                    if(this.rootContext != null)
                    {
                        let memberRolepath = this.GetRolePathForMember(member.role);

                        let setValidation: NcObjectPropertiesSetValidation;

                        let memberRestoreData = dataSet.values.find(f => f.path.join('.') == memberRolepath.join('.'))
                        if(memberRestoreData)
                            setValidation = this.ValidateMemberDatasetChunk(memberRestoreData);
                        else
                            setValidation = new NcObjectPropertiesSetValidation(memberRolepath, NcRestoreValidationStatus.Ok, [], "No dataset information passed but object was created successfully with defaults")

                        validationEntries = validationEntries.concat(setValidation);

                        if(applyChanges)
                        {
                            const exampleControl = new ExampleControl(
                                this.rootContext.AllocateOid(memberRolepath.join('.')),
                                true,
                                this,
                                member.role,
                                member.userLabel ?? member.role,
                                [],
                                null,
                                true,
                                "Example control worker",
                                this.notificationContext,
                                true,
                                memberRestoreData);
    
                            controlMembers.push(exampleControl);
                        }
                    }
                }
            }
            else
            {
                blockMembersNotice = new NcPropertyRestoreNotice(new NcPropertyId(2, 2), "members", NcPropertyRestoreNoticeType.Warning, `Member [${member.role}] can't be constructed because it has an invalid classId of ${member.classId.join('.')}`);
                console.log(`Member [${member.role}] can't be constructed because it has an invalid classId of ${member.classId.join('.')}`);
            }
        });
        
        if(applyChanges)
            this.UpdateMembers(controlMembers, true);

        return [blockMembersNotice, validationEntries];
    }

    public ValidateMemberDatasetChunk(holder: NcObjectPropertiesHolder) : NcObjectPropertiesSetValidation
    {
        let myNotices = new Array<NcPropertyRestoreNotice>();

        holder.values.forEach(propertyData => 
        {
            let propertyId = NcElementId.ToPropertyString(propertyData.id);
            switch(propertyId)
            {
                case '1p6':
                case '2p1':
                case '3p1':
                case '3p2':
                case '3p3':
                case '3p4':
                case '3p5':
                case '3p9':
                case '3p10':
                case '3p11':
                case '3p12':
                case '3p13':
                    {
                        //TODO: Perform further validations
                    }
                    break;
                default:
                    myNotices.push(new NcPropertyRestoreNotice(propertyData.id, propertyData.name, NcPropertyRestoreNoticeType.Warning, "Property can't be changed and will receive a default value"));
            }
        });

        return new NcObjectPropertiesSetValidation(holder.path, NcRestoreValidationStatus.Ok, myNotices, null)
    }
}