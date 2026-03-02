import { jsonIgnoreReplacer } from 'json-ignore';
import { NmosReceiverActive, NmosActivation, TransportParamsSetActive, TransportParamsSetStaged, NmosReceiverStaged } from './NmosReceiver';

export class NmosReceiverActiveMXL extends NmosReceiverActive
{
    public constructor(
        sender_id: string | null,
        master_enable: boolean,
        activation: NmosActivation,
        public transport_params: MXLReceiverTransportParamsSetActive[])
    {
        super(sender_id, master_enable, activation, transport_params);
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NmosReceiverStagedMXL extends NmosReceiverStaged
{
    public constructor(
        sender_id: string | null,
        master_enable: boolean,
        activation: NmosActivation,
        public transport_params: MXLReceiverTransportParamsSetStaged[])
    {
        super(sender_id, master_enable, activation, transport_params);
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class MXLReceiverTransportParamsSetActive extends TransportParamsSetActive
{
    public flow_id: string | null;

    public constructor(
        flow_id: string | null)
    {
        super();

        this.flow_id = flow_id;
    }

    public ProcessStagedTransportParams(stagedSet: MXLReceiverTransportParamsSetStaged) : MXLReceiverTransportParamsSetActive
    {
        return new MXLReceiverTransportParamsSetActive(
            stagedSet.flow_id != "auto" && stagedSet.flow_id !== undefined ? stagedSet.flow_id : this.flow_id
        );
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class MXLReceiverTransportParamsSetStaged extends TransportParamsSetStaged
{
    public flow_id: string | null;

    public constructor(
        flow_id: string | null)
    {
        super();

        this.flow_id = flow_id;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}