import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { INotificationContext } from '../SessionManager';
import { NcaObject, NcaTouchpoint } from './Core';

export class NcaBlock extends NcaObject
{
    public classID: number[] = [ 1, 1 ];
    public classVersion: number = 1;

    public members: number[] | null;

    public memberObjects: NcaObject[] | null;

    public constructor(
        oid: number,
        resources: NcaTouchpoint[] | null,
        memberObjects: NcaObject[] | null,
        constantOid: boolean,
        notificationContext: INotificationContext)
    {
        super(oid, resources, constantOid, notificationContext);

        this.memberObjects = memberObjects;

        if(this.memberObjects != null)
            this.members = this.memberObjects.map(x => x.oid);
        else
            this.members = null;
    }
}