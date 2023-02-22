import { v4 as uuidv4 } from 'uuid';
import { jsonIgnoreReplacer } from 'json-ignore';
const fs = require("fs");
const writeFileAtomic = require('write-file-atomic')

export class Configuration implements IConfiguration
{
    public node_id: string;
    public device_id: string;
    public receiver_id: string;
    public address: string;
    public port: number;
    public base_label: string;
    public registry_address: string;
    public registry_port: string;
    public notify_without_subscriptions: boolean;
    public work_without_registry: boolean;

    public constructor()
    {
        //read configuration
        console.log('Configuration: Reading config.json');
        const jsonString = fs.readFileSync('./dist/server/config.json');
        let config: IConfiguration = JSON.parse(jsonString);

        this.node_id = config.node_id;
        this.device_id = config.device_id;
        this.receiver_id = config.receiver_id;
        this.base_label = config.base_label;
        this.address = config.address;
        this.port = config.port;
        this.registry_address = config.registry_address;
        this.registry_port = config.registry_port;
        this.notify_without_subscriptions = config.notify_without_subscriptions;
        this.work_without_registry = config.work_without_registry;

        this.CheckIdentifiers();
    }

    public CheckIdentifiers()
    {
        console.log('Configuration - CheckIdentifiers()');

        let shouldWriteConfig: boolean = false;

        if(this.node_id == null)
        {
            this.node_id = uuidv4().toString();
            shouldWriteConfig = true;
        }

        if(this.device_id == null)
        {
            this.device_id = uuidv4().toString();
            shouldWriteConfig = true;
        }

        if(this.receiver_id == null)
        {
            this.receiver_id = uuidv4().toString();
            shouldWriteConfig = true;
        }

        if(shouldWriteConfig)
            this.WriteConfig();
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }

    public WriteConfig()
    {
        console.log('Configuration- Writing back config.json');
        
        writeFileAtomic('./dist/server/config.json', this.ToJson(), function (err) {
            if (err)
            {
                console.log('Error writing file', err);
            }
            else
            {
                console.log('Successfully wrote file');
            }
        });
    }
}

export interface IConfiguration
{
    node_id: string;
    device_id: string;
    receiver_id: string;
    address: string;
    port: number;
    base_label: string;
    registry_address: string;
    registry_port: string;
    notify_without_subscriptions: boolean;
    work_without_registry: boolean;
}