import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { NmosReceiverActive, NmosActivation, TransportParamsSetActive, TransportParamsSetStaged, NmosReceiverStaged } from './NmosReceiver';

export class NmosReceiverActiveRtp extends NmosReceiverActive
{
    public transport_file: NmosReceiverTransportFile | null;

    public constructor(
        sender_id: string | null,
        master_enable: boolean,
        activation: NmosActivation,
        transport_file: NmosReceiverTransportFile | null,
        public transport_params: RtpReceiverTransportParamsSetActive[])
    {
        super(sender_id, master_enable, activation, transport_params);

        if(transport_file != null)
            this.transport_file = transport_file;
        else
            this.transport_file = new NmosReceiverTransportFile(null, null);
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NmosReceiverStagedRtp extends NmosReceiverStaged
{
    public transport_file: NmosReceiverTransportFile | null;

    public constructor(
        sender_id: string | null,
        master_enable: boolean,
        activation: NmosActivation,
        transport_file: NmosReceiverTransportFile | null,
        public transport_params: RtpReceiverTransportParamsSetStaged[])
    {
        super(sender_id, master_enable, activation, transport_params);

        if(transport_file != null)
            this.transport_file = transport_file;
        else
            this.transport_file = new NmosReceiverTransportFile(null, null);
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NmosReceiverTransportFile
{
    public data: string | null;
    public type: string | null;

    public constructor(
        data: string | null,
        type: string | null)
    {
        this.data = data;
        this.type = type;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class RtpReceiverTransportParamsSetActive extends TransportParamsSetActive
{
    public multicast_ip: string | null;
    public source_ip: string | null;
    public destination_port: number;
    public interface_ip: string;
    public rtcp_enabled: boolean;
    public fec_enabled: boolean;
    public fec_destination_ip: string;
    public fec_mode: string;
    public fec1D_destination_port: number;
    public fec2D_destination_port: number;
    public rtcp_destination_ip: string;
    public rtcp_destination_port: number;
    public rtp_enabled: boolean;

    public constructor(
        multicast_ip: string | null,
        source_ip: string | null,
        destination_port: number)
    {
        super();

        this.multicast_ip = multicast_ip;
        this.source_ip = source_ip;
        this.destination_port = destination_port;
        this.interface_ip = '192.168.10.101';
        this.rtcp_enabled = false;
        this.fec_enabled = false;
        this.fec_destination_ip = '192.168.10.101';
        this.fec_mode = '1D';
        this.fec1D_destination_port = 5001;
        this.fec2D_destination_port = 5002;
        this.rtcp_destination_ip = '192.168.10.101';
        this.rtcp_destination_port = 5003;
        this.rtp_enabled = true;
    }

    public ProcessStagedTransportParams(stagedSet: RtpReceiverTransportParamsSetStaged) : RtpReceiverTransportParamsSetActive
    {
        return new RtpReceiverTransportParamsSetActive(
            stagedSet.multicast_ip != "auto" && stagedSet.multicast_ip !== undefined ? stagedSet.multicast_ip : this.multicast_ip,
            stagedSet.source_ip != "auto" && stagedSet.source_ip !== undefined ? stagedSet.source_ip : this.source_ip,
            stagedSet.destination_port != "auto" && stagedSet.destination_port !== undefined ? stagedSet.destination_port : this.destination_port
        );
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class RtpReceiverTransportParamsSetStaged extends TransportParamsSetStaged
{
    public multicast_ip: string | null;
    public source_ip: string | null;
    public destination_port: any | null;
    public interface_ip: string;
    public rtcp_enabled: boolean | null;
    public fec_enabled: boolean;
    public fec_destination_ip: string | null;
    public fec_mode: string | null;
    public fec1D_destination_port: any | null;
    public fec2D_destination_port: any | null;
    public rtcp_destination_ip: string | null;
    public rtcp_destination_port: any | null;
    public rtp_enabled: boolean;

    public constructor(
        multicast_ip: string | null,
        source_ip: string | null,
        destination_port: any | null)
    {
        super();

        this.multicast_ip = multicast_ip;
        this.source_ip = source_ip;
        this.destination_port = destination_port;
        this.interface_ip = '192.168.10.101';
        this.rtcp_enabled = false;
        this.fec_enabled = false;
        this.fec_destination_ip = '192.168.10.101';
        this.fec_mode = '1D';
        this.fec1D_destination_port = 5001;
        this.fec2D_destination_port = 5002;
        this.rtcp_destination_ip = '192.168.10.101';
        this.rtcp_destination_port = 5003;
        this.rtp_enabled = true;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}