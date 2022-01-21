import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { CommandResponseNoValue, CommandResponseWithValue } from '../NCProtocol/Commands';
import { INotificationContext } from '../SessionManager';
import { myIdDecorator, NcaElementID, NcaLockState, NcaMethodStatus, NcaObject, NcaPort, NcaSignalPath, NcaTouchpoint } from './Core';

export class NcaBlock extends NcaObject
{
    @myIdDecorator('1p1')
    public classID: number[] = [ 1, 1 ];

    @myIdDecorator('1p2')
    public classVersion: number = 1;

    @myIdDecorator('2p1')
    public enabled: boolean;

    @myIdDecorator('2p2')
    public specId: string | null;

    @myIdDecorator('2p3')
    public specVersion: number | null;

    @myIdDecorator('2p4')
    public parentSpecId: string | null;

    @myIdDecorator('2p5')
    public parentSpecVersion: number | null;

    @myIdDecorator('2p6')
    public specDescription: string | null;

    @myIdDecorator('2p7')
    public isDynamic: boolean;

    @myIdDecorator('2p8')
    public isModified: boolean;

    @myIdDecorator('2p9')
    public members: number[] | null;

    @myIdDecorator('2p10')
    public ports: NcaPort[] | null;

    @myIdDecorator('2p11')
    public signalPaths: NcaSignalPath[] | null;

    public memberObjects: NcaObject[] | null;

    public constructor(
        oid: number,
        constantOid: boolean,
        owner: number | null,
        role: string,
        userLabel: string,
        lockable: boolean,
        lockState: NcaLockState,
        touchpoints: NcaTouchpoint[] | null,
        enabled: boolean,
        specId: string | null,
        specVersion: number | null,
        parentSpecId: string | null,
        parentSpecVersion: number | null,
        specDescription: string | null,
        isDynamic: boolean,
        memberObjects: NcaObject[] | null,
        ports: NcaPort[] | null,
        signalPaths: NcaSignalPath[] | null,
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
    public override Get(id: NcaElementID, handle: number) : CommandResponseWithValue
    {
        let key: string = `${id.level}p${id.index}`;

        switch(key)
        {
            case '2p1':
                return new CommandResponseWithValue(handle, NcaMethodStatus.OK, this.enabled, null);
            case '2p2':
                return new CommandResponseWithValue(handle, NcaMethodStatus.OK, this.specId, null);
            case '2p3':
                return new CommandResponseWithValue(handle, NcaMethodStatus.OK, this.specVersion, null);
            case '2p4':
                return new CommandResponseWithValue(handle, NcaMethodStatus.OK, this.parentSpecId, null);
            case '2p5':
                return new CommandResponseWithValue(handle, NcaMethodStatus.OK, this.parentSpecVersion, null);
            case '2p6':
                return new CommandResponseWithValue(handle, NcaMethodStatus.OK, this.specDescription, null);
            case '2p7':
                return new CommandResponseWithValue(handle, NcaMethodStatus.OK, this.isDynamic, null);
            case '2p8':
                return new CommandResponseWithValue(handle, NcaMethodStatus.OK, this.isModified, null);
            case '2p9':
                return new CommandResponseWithValue(handle, NcaMethodStatus.OK, this.members, null);
            case '2p10':
                return new CommandResponseWithValue(handle, NcaMethodStatus.OK, this.ports, null);
            case '2p11':
                return new CommandResponseWithValue(handle, NcaMethodStatus.OK, this.signalPaths, null);
            default:
                return super.Get(id, handle);
        }
    }

    //'1m2'
    public override Set(id: NcaElementID, value: any, handle: number) : CommandResponseNoValue
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
                return new CommandResponseNoValue(handle, NcaMethodStatus.ProcessingFailed, 'Property is readonly');
            default:
                return super.Set(id, value, handle);
        }
    }
}