import { TAI64 } from "tai64";

import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';

import { Axios } from 'axios';
import { NmosNode } from './NmosNode';
const axios = require('axios').default as Axios;

export class RegistrationClient
{
    public registry_address: string;
    public registry_port: string;
    public node_id: string | null;

    public constructor(
        registry_address: string,
        registry_port: string)
    {
        this.registry_address = registry_address;
        this.registry_port = registry_port;
        this.node_id = null;
    }

    StartHeatbeats(node_id: string)
    {
        this.node_id = node_id;

        this.SendHeartbeat(this.node_id);

        setInterval(() => {
            this.SendHeartbeat(this.node_id);
        }, 4000);
    }

    public RegisterOrUpdateResource<NmosResource>(resourceType: string, resource: NmosResource) : boolean
    {
        try 
        {
            console.log(`RegistrationClient - RegisterOrUpdateResource(resourceType:${resourceType})`);

            let payload = new RegisterResourceMsg(resourceType, resource);

            axios.post<NmosResource>(
                `http://${this.registry_address}:${this.registry_port}/x-nmos/registration/v1.3/resource`,
                payload.ToJson(), 
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => { 
                    return true;
                });
        }
        catch (error) 
        {
            console.log(error);
                return false;
        }

        return false;
    }

    SendHeartbeat(nodeId: string | null) : boolean
    {
        if(nodeId != null)
        {
            try 
            {
                let payload = new Health();

                axios.post(
                    `http://${this.registry_address}:${this.registry_port}/x-nmos/registration/v1.3/health/nodes/${nodeId}`,
                    payload.ToJson(),
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response => { 
                        return true;
                    });
            }
            catch (error) 
            {
                console.log(error);
                    return false;
            }
        }

        return false;
    }
}

class RegisterResourceMsg<Type>
{
    public type: string;
    public data: Type;

    public constructor(
        type: string,
        data: Type)
    {
        this.type = type;
        this.data = data;
    }

    public ToJson() {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

class Health
{
    public health: string;

    public constructor()
    {
        this.health = TAI64.now().toUnix().toString();
    }

    public ToJson() {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}