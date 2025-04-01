import { jsonIgnoreReplacer } from "json-ignore";
import { RegistrationClient } from "./RegistrationClient";
import { NmosFlow } from "./NmosFlow";

export class NmosFlowMpegTS extends NmosFlow
{
    public format: string;
    public media_type: string;

    public constructor(
        id: string,
        source_id: string,
        device_id: string,
        label: string,
        parents: string[],
        format: string,
        media_type: string,
        registrationClient: RegistrationClient)
    {
        super(id, source_id, device_id, label, parents, registrationClient);

        this.format = format;
        this.media_type = media_type;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}