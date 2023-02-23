import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { CommandResponseError, CommandResponseNoValue, CommandResponseWithValue } from '../NCProtocol/Commands';
import { WebSocketConnection } from '../Server';
import { INotificationContext } from '../SessionManager';
import {
    BaseType,
    myIdDecorator,
    NcClassDescriptor,
    NcDatatypeDescriptor,
    NcDatatypeDescriptorStruct,
    NcElementId,
    NcFieldDescriptor,
    NcMethodDescriptor,
    NcMethodStatus,
    NcObject,
    NcParameterConstraintsNumber,
    NcParameterConstraintsString,
    NcParameterDescriptor,
    NcPort,
    NcPropertyChangeType,
    NcPropertyConstraints,
    NcPropertyDescriptor,
    NcTouchpoint } from './Core';
import { NcWorker } from './Features';

export class UMDTally extends BaseType
{
    public active: boolean;

    constructor(
        active: boolean) 
    {
        super();

        this.active = active;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("UMDTally", [
            new NcFieldDescriptor("active", "NcBoolean", false, false, null, "UMD tally active state")
        ], null, null, "UMDTally data type");
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcUMD extends NcWorker
{
    public static staticClassID: number[] = [ 1, 2, 0, 11 ];

    @myIdDecorator('1p1')
    public override classID: number[] = NcUMD.staticClassID;

    @myIdDecorator('3p1')
    public tallyLeft: UMDTally;

    @myIdDecorator('3p2')
    public tallyRight: UMDTally;

    @myIdDecorator('3p3')
    public text: string | null;

    public constructor(
        oid: number,
        constantOid: boolean,
        owner: number | null,
        role: string,
        userLabel: string,
        touchpoints: NcTouchpoint[],
        runtimePropertyConstraints: NcPropertyConstraints[] | null,
        enabled: boolean,
        description: string,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, touchpoints, runtimePropertyConstraints, enabled, description, notificationContext);

        this.tallyLeft = new UMDTally(false);
        this.tallyRight = new UMDTally(false);
        this.text = null;
    }

    //'1m1'
    public override Get(oid: number, id: NcElementId, handle: number) : CommandResponseNoValue
    {
        if(oid == this.oid)
        {
            let key: string = `${id.level}p${id.index}`;

            switch(key)
            {
                case '3p1':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.tallyLeft);
                case '3p2':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.tallyRight);
                case '3p3':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.text);
                default:
                    return super.Get(oid, id, handle);
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
                case '3p1':
                    this.tallyLeft = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.tallyLeft, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                case '3p2':
                    this.tallyRight = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.tallyRight, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                case '3p3':
                    this.text = value;
                    this.notificationContext.NotifyPropertyChanged(this.oid, id, NcPropertyChangeType.ValueChanged, this.text, null);
                    return new CommandResponseNoValue(handle, NcMethodStatus.OK);
                default:
                    return super.Set(oid, id, value, handle);
            }
        }

        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }

    public override InvokeMethod(socket: WebSocketConnection, oid: number, methodId: NcElementId, args: { [key: string]: any; } | null, handle: number): CommandResponseNoValue 
    {
        if(oid == this.oid)
            return super.InvokeMethod(socket, oid, methodId, args, handle);

        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }

    public static override GetClassDescriptor(includeInherited: boolean): NcClassDescriptor 
    {
        let currentClassDescriptor = new NcClassDescriptor(`${NcUMD.name} class descriptor`,
            NcUMD.staticClassID, NcUMD.name, null,
            [
                new NcPropertyDescriptor(new NcElementId(3, 1), "tallyLeft", "UMDTally", false, false, false, false, null, "UMD tally left"),
                new NcPropertyDescriptor(new NcElementId(3, 2), "tallyRight", "UMDTally", false, false, false, false, null, "UMD tally right"),
                new NcPropertyDescriptor(new NcElementId(3, 3), "text", "NcString", true, false, true, false, null, "UMD text"),
            ],
            [], []
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
}

export class NcMultiviewerTile extends NcWorker
{
    public static staticClassID: number[] = [ 1, 2, 0, 12 ];

    @myIdDecorator('1p1')
    public override classID: number[] = NcMultiviewerTile.staticClassID;

    @myIdDecorator('3p1')
    public receiverMonitorOid: number | null;

    @myIdDecorator('3p2')
    public umdOid: number | null;

    public constructor(
        oid: number,
        constantOid: boolean,
        owner: number | null,
        role: string,
        userLabel: string,
        touchpoints: NcTouchpoint[],
        runtimePropertyConstraints: NcPropertyConstraints[] | null,
        enabled: boolean,
        description: string,
        receiverMonitorOid: number | null,
        umdOid: number | null,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, touchpoints, runtimePropertyConstraints, enabled, description, notificationContext);

        this.receiverMonitorOid = receiverMonitorOid;
        this.umdOid = umdOid;
    }

    //'1m1'
    public override Get(oid: number, id: NcElementId, handle: number) : CommandResponseNoValue
    {
        if(oid == this.oid)
        {
            let key: string = `${id.level}p${id.index}`;

            switch(key)
            {
                case '3p1':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.receiverMonitorOid);
                case '3p2':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.umdOid);
                default:
                    return super.Get(oid, id, handle);
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
                case '3p1':
                case '3p2':
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
            return super.InvokeMethod(socket, oid, methodId, args, handle);

        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }

    public static override GetClassDescriptor(includeInherited: boolean): NcClassDescriptor 
    {
        let currentClassDescriptor = new NcClassDescriptor(`${NcMultiviewerTile.name} class descriptor`,
            NcMultiviewerTile.staticClassID, NcMultiviewerTile.name, null,
            [
                new NcPropertyDescriptor(new NcElementId(3, 1), "receiverMonitorOid", "NcOid", true, true, false, false, null, "Receiver monitor oid"),
                new NcPropertyDescriptor(new NcElementId(3, 2), "umdOid", "NcOid", true, true, false, false, null, "UMD oid")
            ],
            [], []
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
}

export class MultiviewerLayoutElement extends BaseType
{
    public xPosition: number;

    public yPosition: number;

    public width: number;

    public height: number;

    public tileOid: number | null;

    constructor(
        xPosition: number,
        yPosition: number,
        width: number,
        height: number,
        tileOid: number | null)
    {
        super();

        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.width = width;
        this.height = height;
        this.tileOid = tileOid;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("MultiviewerLayoutElement", [
            new NcFieldDescriptor("xPosition", "NcInt32", false, false, null, "Element X position"),
            new NcFieldDescriptor("yPosition", "NcInt32", false, false, null, "Element y position"),
            new NcFieldDescriptor("width", "NcInt32", false, false, null, "Element width"),
            new NcFieldDescriptor("height", "NcInt32", false, false, null, "Element height"),
            new NcFieldDescriptor("tileOid", "NcOid", false, false, null, "Associated tile oid"),
        ], null, null, "MultiviewerLayoutElement data type");
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcMultiviewerLayout extends NcWorker
{
    public static staticClassID: number[] = [ 1, 2, 0, 13 ];

    @myIdDecorator('1p1')
    public override classID: number[] = NcMultiviewerLayout.staticClassID;

    @myIdDecorator('3p1')
    public label: string;

    @myIdDecorator('3p2')
    public width: number;

    @myIdDecorator('3p3')
    public height: number;

    @myIdDecorator('3p4')
    public elements: MultiviewerLayoutElement[];

    public constructor(
        oid: number,
        constantOid: boolean,
        owner: number | null,
        role: string,
        userLabel: string,
        touchpoints: NcTouchpoint[],
        runtimePropertyConstraints: NcPropertyConstraints[] | null,
        enabled: boolean,
        description: string,
        width: number,
        height: number,
        elements: MultiviewerLayoutElement[],
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, touchpoints, runtimePropertyConstraints, enabled, description, notificationContext);

        this.label = userLabel;
        this.width = width;
        this.height = height;
        this.elements = elements;
    }

    //'1m1'
    public override Get(oid: number, id: NcElementId, handle: number) : CommandResponseNoValue
    {
        if(oid == this.oid)
        {
            let key: string = `${id.level}p${id.index}`;

            switch(key)
            {
                case '3p1':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.label);
                case '3p2':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.width);
                case '3p3':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.height);
                case '3p4':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.elements);
                default:
                    return super.Get(oid, id, handle);
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
                case '3p1':
                case '3p2':
                case '3p3':
                case '3p4':
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
            return super.InvokeMethod(socket, oid, methodId, args, handle);

        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }

    public static override GetClassDescriptor(includeInherited: boolean): NcClassDescriptor 
    {
        let currentClassDescriptor = new NcClassDescriptor(`${NcMultiviewerLayout.name} class descriptor`,
            NcMultiviewerLayout.staticClassID, NcMultiviewerLayout.name, null,
            [
                new NcPropertyDescriptor(new NcElementId(3, 1), "label", "NcString", true, true, false, false, null, "Layout label"),
                new NcPropertyDescriptor(new NcElementId(3, 2), "width", "NcInt32", true, true, false, false, null, "Layout width"),
                new NcPropertyDescriptor(new NcElementId(3, 3), "height", "NcInt32", true, true, false, false, null, "Layout height"),
                new NcPropertyDescriptor(new NcElementId(3, 4), "elements", "MultiviewerLayoutElement", true, true, false, true, null, "Layout elements")
            ],
            [], []
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
}

export class NcMultiviewerDisplay extends NcWorker
{
    public static staticClassID: number[] = [ 1, 2, 0, 14 ];

    @myIdDecorator('1p1')
    public override classID: number[] = NcMultiviewerDisplay.staticClassID;

    @myIdDecorator('3p1')
    public layoutOid: number;

    public constructor(
        oid: number,
        constantOid: boolean,
        owner: number,
        role: string,
        userLabel: string,
        touchpoints: NcTouchpoint[],
        runtimePropertyConstraints: NcPropertyConstraints[] | null,
        enabled: boolean,
        description: string,
        layoutOid: number,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, touchpoints, runtimePropertyConstraints, enabled, description, notificationContext);

        this.layoutOid = layoutOid;
    }

    //'1m1'
    public override Get(oid: number, id: NcElementId, handle: number) : CommandResponseNoValue
    {
        if(oid == this.oid)
        {
            let key: string = `${id.level}p${id.index}`;

            switch(key)
            {
                case '3p1':
                    return new CommandResponseWithValue(handle, NcMethodStatus.OK, this.layoutOid);
                default:
                    return super.Get(oid, id, handle);
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
                case '3p1':
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
            return super.InvokeMethod(socket, oid, methodId, args, handle);

        return new CommandResponseError(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }

    public static override GetClassDescriptor(includeInherited: boolean): NcClassDescriptor 
    {
        let currentClassDescriptor = new NcClassDescriptor(`${NcMultiviewerDisplay.name} class descriptor`,
            NcMultiviewerDisplay.staticClassID, NcMultiviewerDisplay.name, null,
            [
                new NcPropertyDescriptor(new NcElementId(3, 1), "layoutOid", "NcOid", true, true, false, false, null, "Associated layout oid"),
            ],
            [], []
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
}
