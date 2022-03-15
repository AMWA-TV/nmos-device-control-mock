import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { INotificationContext } from '../SessionManager';
import { NcLockState, NcObject, NcTouchpoint } from './Core';

export abstract class NcAgent extends NcObject
{
    public constructor(
        oid: number,
        constantOid: boolean,
        owner: number | null,
        role: string,
        userLabel: string,
        lockable: boolean,
        lockState: NcLockState,
        touchpoints: NcTouchpoint[],
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, lockable, lockState, touchpoints, notificationContext);
    }
}
