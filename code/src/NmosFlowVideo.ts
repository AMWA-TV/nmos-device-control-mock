import { jsonIgnoreReplacer } from "json-ignore";
import { RegistrationClient } from "./RegistrationClient";
import { NmosFlow } from "./NmosFlow";

export class NmosFlowVideo extends NmosFlow
{
    public format: string;
    public frame_width: number;
    public frame_height: number;
    public colorspace: string;
    public interlace_mode: string;
    public transfer_characteristic: string;
    public media_type: string;
    public components: object[];

    public constructor(
        id: string,
        source_id: string,
        device_id: string,
        label: string,
        parents: string[],
        grain_rate_numerator: number,
        grain_rate_denominator: number,
        format: string,
        frame_width: number,
        frame_height: number,
        colorspace: string,
        interlace_mode: string,
        transfer_characteristic: string,
        media_type: string,
        components: object[],
        registrationClient: RegistrationClient)
    {
        super(id, source_id, device_id, label, parents, grain_rate_numerator, grain_rate_denominator, registrationClient);

        this.format = format;
        this.frame_width = frame_width;
        this.frame_height = frame_height;
        this.colorspace = colorspace;
        this.interlace_mode = interlace_mode;
        this.transfer_characteristic = transfer_characteristic;
        this.media_type = media_type;
        this.components = components;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}