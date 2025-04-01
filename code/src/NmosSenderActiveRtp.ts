import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { NmosActivation, TransportParamsSet } from './NmosReceiver';
import { NmosSenderActive } from './NmosSender';

export class NmosSenderActiveRtp extends NmosSenderActive
{
    public constructor(
        receiver_id: string | null,
        master_enable: boolean,
        activation: NmosActivation,
        public transport_params: RtpSenderTransportParamsSet[])
    {
        super(receiver_id, master_enable, activation, transport_params);
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class RtpSenderTransportParamsSet extends TransportParamsSet
{
    public destination_ip: string | null;
    public source_ip: string | null;
    public source_port: number;
    public destination_port: number;
    public rtcp_enabled: boolean;
    public fec_enabled: boolean;
    public fec_destination_ip: string;
    public fec_type: string;
    public fec_mode: string;
    public fec_block_width: number;
    public fec_block_height: number;
    public fec1D_destination_port: number;
    public fec2D_destination_port: number;
    public fec1D_source_port: number;
    public fec2D_source_port: number;
    public rtcp_destination_ip: string;
    public rtcp_destination_port: number;
    public rtcp_source_port: number;
    public rtp_enabled: boolean;

    public constructor(
        destination_ip: string | null,
        source_ip: string | null,
        source_port: number,
        destination_port: number)
    {
        super();

        this.destination_ip = destination_ip;
        this.source_ip = source_ip;
        this.source_port = source_port;
        this.destination_port = destination_port;
        this.rtcp_enabled = false;
        this.fec_enabled = false;
        this.fec_destination_ip = '239.100.20.0';
        this.fec_type = 'XOR';
        this.fec_mode = '1D';
        this.fec_block_width = 4;
        this.fec_block_height = 4;
        this.fec1D_destination_port = 5001;
        this.fec2D_destination_port = 5002;
        this.fec1D_source_port = 5001;
        this.fec2D_source_port = 5002;
        this.rtcp_destination_ip = '192.168.10.101';
        this.rtcp_destination_port = 5003;
        this.rtcp_source_port = 5003;
        this.rtp_enabled = true;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}