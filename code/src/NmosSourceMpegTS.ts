import { jsonIgnoreReplacer } from "json-ignore";
import { RegistrationClient } from "./RegistrationClient";
import { NmosSource } from "./NmosSource";

export class NmosSourceMpegTS extends NmosSource
{
    public format: string;

    public constructor(
        id: string,
        device_id: string,
        label: string,
        parents: string[],
        clock_name: string,
        format: string,
        registrationClient: RegistrationClient)
    {
        super(id, device_id, label, parents, clock_name, registrationClient);

        this.format = format;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}