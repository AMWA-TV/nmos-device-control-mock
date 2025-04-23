import application from 'express';
import http from 'http';
import { AddressInfo, Socket } from 'net';
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { jsonIgnoreReplacer } from 'json-ignore';

import { Configuration, StreamingProfile } from './Configuration';
import { NmosNode } from './NmosNode';
import { NmosDevice } from './NmosDevice';
import { RegistrationClient } from './RegistrationClient';
import { SessionManager } from './SessionManager';
import { ExampleControlsBlock, NcBlock, RootBlock } from './NCModel/Blocks';
import { NcClassManager, NcDeviceManager } from './NCModel/Managers';
import { ConfigApiArguments, ConfigApiValue, NcBulkValuesHolder, NcMethodResultBulkValuesHolder, NcMethodResultObjectPropertiesSetValidation, NcMethodStatus, NcTouchpointNmos, NcTouchpointResourceNmos, RestoreBody } from './NCModel/Core';
import { ExampleControl, GainControl, NcIdentBeacon, NcReceiverMonitor, NcSenderMonitor } from './NCModel/Features';
import { ProtocolError, ProtocolSubscription } from './NCProtocol/Commands';
import { MessageType, ProtocolWrapper } from './NCProtocol/Core';
import { NmosSource } from './NmosSource';
import { NmosSourceVideoRaw } from './NmosSourceVideoRaw';
import { NmosSourceMpegTS } from './NmosSourceMpegTS';
import { NmosFlow } from './NmosFlow';
import { NmosFlowVideoRaw } from './NmosFlowVideoRaw';
import { NmosFlowMpegTS } from './NmosFlowMpegTS';
import { NmosSender } from './NmosSender';
import { NmosSenderVideoRaw } from './NmosSenderVideoRaw';
import { NmosSenderMpegTS } from './NmosSenderMpegTS';
import { NmosSenderActiveRtp } from './NmosSenderActiveRtp';
import { NmosReceiver } from './NmosReceiver';
import { NmosReceiverVideoRaw } from './NmosReceiverVideoRaw';
import { NmosReceiverMpegTS } from './NmosReceiverMpegTS';
import { NmosReceiverActiveRtp } from './NmosReceiverActiveRtp';

export interface WebSocketConnection extends WebSocket {
    isAlive: boolean;
    connectionId: string;
}

export class ApiError
{
    public code: Number;

    public error: string;

    public debug: string;

    public constructor(
        code: Number,
        error: string,
        debug: string)
    {
        this.code = code;
        this.error = error;
        this.debug = debug;
    }
}

function DelayTask(timeMs: number | undefined) 
{
    return new Promise(resolve => setTimeout(resolve, timeMs));
}

try
{
    console.log('App started');
    const config = new Configuration();

    const registrationClient = new RegistrationClient(config.registry_address, config.registry_port, config.work_without_registry);

    const myNode = new NmosNode(
        config.node_id,
        config.base_label,
        config.address,
        config.port,
        config.manufacturer,
        config.product,
        config.instance,
        registrationClient);

    const myDevice = new NmosDevice(
        config.device_id,
        config.node_id,
        config.base_label,
        config.address,
        config.port,
        config.manufacturer,
        config.product,
        config.instance,
        config.function,
        registrationClient);

    let mySource: NmosSource | null = null;
    
    switch(config.streaming_profile)
    {
        case StreamingProfile.RTP_RAW:
        {
            mySource = new NmosSourceVideoRaw(
                config.source_id,
                config.device_id,
                config.base_label,
                [],
                myNode.clocks[0].name,
                25,
                1,
                "urn:x-nmos:format:video",
                registrationClient);
        }
        break;

        case StreamingProfile.RTP_MPEG_TS:
        {
            mySource = new NmosSourceMpegTS(
                config.source_id,
                config.device_id,
                config.base_label,
                [],
                myNode.clocks[0].name,
                "urn:x-nmos:format:mux",
                registrationClient);
        }
        break;
    }

    let myFlow: NmosFlow | null = null;

    switch(config.streaming_profile)
    {
        case StreamingProfile.RTP_RAW:
        {
            myFlow = new NmosFlowVideoRaw(
                config.flow_id,
                config.source_id,
                config.device_id,
                config.base_label,
                [],
                25,
                1,
                "urn:x-nmos:format:video",
                1920,
                1080,
                "BT709",
                "interlaced_tff",
                "SDR",
                "video/raw",
                [
                    {
                        "name": "Y",
                        "width": 1920,
                        "height": 1080,
                        "bit_depth": 10
                    },
                    {
                        "name": "Cb",
                        "width": 960,
                        "height": 1080,
                        "bit_depth": 10
                    },
                    {
                        "name": "Cr",
                        "width": 960,
                        "height": 1080,
                        "bit_depth": 10
                    }
                ],
                registrationClient);
        }
        break;

        case StreamingProfile.RTP_MPEG_TS:
        {
            myFlow = new NmosFlowMpegTS(
                config.flow_id,
                config.source_id,
                config.device_id,
                config.base_label,
                [],
                "urn:x-nmos:format:mux",
                "video/MP2T",
                registrationClient);
        }
        break;
    }

    let mySender: NmosSender | null = null;

    switch(config.streaming_profile)
    {
        case StreamingProfile.RTP_RAW:
        {
            mySender = new NmosSenderVideoRaw(
                config.sender_id,
                config.flow_id,
                config.device_id,
                config.base_label,
                "urn:x-nmos:transport:rtp.mcast",
                `http://${config.address}:${config.port}/x-nmos/node/v1.2/senders/${config.sender_id}/sdp`,
                registrationClient);
        }
        break;

        case StreamingProfile.RTP_MPEG_TS:
        {
            mySender = new NmosSenderMpegTS(
                config.sender_id,
                config.flow_id,
                config.device_id,
                config.base_label,
                "urn:x-nmos:transport:rtp.mcast",
                100000,
                `http://${config.address}:${config.port}/x-nmos/node/v1.2/senders/${config.sender_id}/sdp`,
                registrationClient);
        }
        break;
    }

    let myReceiver: NmosReceiver | null = null;

    switch(config.streaming_profile)
    {
        case StreamingProfile.RTP_RAW:
        {
            myReceiver = new NmosReceiverVideoRaw(
                config.receiver_id,
                config.device_id,
                config.base_label,
                'urn:x-nmos:transport:rtp.mcast',
                registrationClient);
        }
        break;

        case StreamingProfile.RTP_MPEG_TS:
        {
            myReceiver = new NmosReceiverMpegTS(
                config.receiver_id,
                config.device_id,
                config.base_label,
                'urn:x-nmos:transport:rtp.mcast',
                registrationClient);
        }
        break;
    }

    if(myReceiver != null)
        myDevice.AddReceiver(myReceiver);
    if(mySender != null)
        myDevice.AddSender(mySender);

    const sessionManager = new SessionManager(config.notify_without_subscriptions);

    const rootBlock = new RootBlock(
        true,
        null,
        'root',
        'Root',
        null,
        null,
        true,
        [],
        "Root block",
        sessionManager);

    const deviceManager = new NcDeviceManager(
        rootBlock.AllocateOid(rootBlock.GetRolePathForMember(NcDeviceManager.staticRole).join('.')),
        true,
        rootBlock,
        'Device manager',
        null,
        null,
        "The device manager offers information about the product this device is representing",
        sessionManager);

    const classManager = new NcClassManager(
        rootBlock.AllocateOid(rootBlock.GetRolePathForMember(NcClassManager.staticRole).join('.')),
        true,
        rootBlock,
        'Class manager',
        null,
        null,
        "The class manager offers access to control class and data type descriptors",
        sessionManager);

    const stereoGainBlock = new NcBlock(
        rootBlock.AllocateOid(rootBlock.GetRolePathForMember('stereo-gain').join('.')),
        true,
        rootBlock,
        'stereo-gain',
        'Stereo gain',
        null,
        null,
        true,
        [],
        "Stereo gain block",
        sessionManager,
        rootBlock);

    const channelGainBlock = new NcBlock(
        rootBlock.AllocateOid(stereoGainBlock.GetRolePathForMember('channel-gain').join('.')),
        true,
        stereoGainBlock,
        'channel-gain',
        'Channel gain',
        null,
        null,
        true,
        [],
        "Channel gain block",
        sessionManager,
        rootBlock);

    let leftGain = new GainControl(rootBlock.AllocateOid(channelGainBlock.GetRolePathForMember('left-gain').join('.')), true, channelGainBlock, 'left-gain', 'Left gain', [], null, true, 0, 'Left channel gain', sessionManager);
    let rightGain = new GainControl(rootBlock.AllocateOid(channelGainBlock.GetRolePathForMember('right-gain').join('.')), true, channelGainBlock, 'right-gain', 'Right gain', [], null, true, 0, 'Right channel gain', sessionManager);

    channelGainBlock.UpdateMembers([ leftGain, rightGain ]);

    let masterGain = new GainControl(rootBlock.AllocateOid(stereoGainBlock.GetRolePathForMember('master-gain').join('.')), true, stereoGainBlock, 'master-gain', 'Master gain', [], null, true, 0, 'Master gain', sessionManager);

    stereoGainBlock.UpdateMembers([ channelGainBlock, masterGain ]);

    const receiversBlock = new NcBlock(
        rootBlock.AllocateOid(rootBlock.GetRolePathForMember('receivers').join('.')),
        true,
        rootBlock,
        'receivers',
        'Receivers',
        null,
        null,
        true,
        [],
        "Receivers block",
        sessionManager,
        rootBlock);
    
    const receiverMonitor = new NcReceiverMonitor(
        rootBlock.AllocateOid(receiversBlock.GetRolePathForMember('monitor-01').join('.')),
        true,
        receiversBlock,
        'monitor-01',
        'Receiver monitor 01',
        myReceiver != null ? [ new NcTouchpointNmos('x-nmos', new NcTouchpointResourceNmos('receiver', myReceiver.id)) ] : [],
        null,
        true,
        "Receiver monitor worker",
        sessionManager);

    myReceiver?.AttachMonitoringAgent(receiverMonitor);

    receiversBlock.UpdateMembers([ receiverMonitor ]);

    const sendersBlock = new NcBlock(
        rootBlock.AllocateOid(rootBlock.GetRolePathForMember('senders').join('.')),
        true,
        rootBlock,
        'senders',
        'Senders',
        null,
        null,
        true,
        [],
        "Senders block",
        sessionManager,
        rootBlock);
    
    const senderMonitor = new NcSenderMonitor(
        rootBlock.AllocateOid(sendersBlock.GetRolePathForMember('monitor-01').join('.')),
        true,
        sendersBlock,
        'monitor-01',
        'Sender monitor 01',
        mySender != null ? [ new NcTouchpointNmos('x-nmos', new NcTouchpointResourceNmos('sender', mySender.id)) ] : [],
        null,
        true,
        "Sender monitor worker",
        sessionManager);

    mySender?.AttachMonitoringAgent(senderMonitor);

    sendersBlock.UpdateMembers([ senderMonitor ]);

    const identBeacon = new NcIdentBeacon(rootBlock.AllocateOid(rootBlock.GetRolePathForMember('IdentBeacon').join('.')), true, rootBlock, 'IdentBeacon', 'Identification beacon', [], null, true, false, 'Identification beacon', sessionManager);

    const exampleControlsBlock = new ExampleControlsBlock(
        rootBlock.AllocateOid(rootBlock.GetRolePathForMember('example-controls').join('.')),
        true,
        rootBlock,
        'example-controls',
        'Example controls',
        null,
        null,
        true,
        [],
        "Example controls block",
        sessionManager,
        rootBlock,
        2,
        true);

    const exampleControl = new ExampleControl(
        rootBlock.AllocateOid(exampleControlsBlock.GetRolePathForMember('example-control-01').join('.')),
        true,
        exampleControlsBlock,
        'example-control-01',
        'Example control worker 01',
        [],
        null,
        true,
        "Example control worker",
        sessionManager,
        true);

    exampleControlsBlock.UpdateMembers([ exampleControl ]);

    rootBlock.UpdateMembers([ deviceManager, classManager, receiversBlock, sendersBlock, stereoGainBlock, exampleControlsBlock, identBeacon ]);

    async function doAsync () {
        await registrationClient.RegisterOrUpdateResource('node', myNode);
        registrationClient.StartHeatbeats(myNode.id);
        await registrationClient.RegisterOrUpdateResource('device', myDevice);
        if(myReceiver != null)
            await registrationClient.RegisterOrUpdateResource('receiver', myReceiver);
        if(mySource != null)
            await registrationClient.RegisterOrUpdateResource('source', mySource);
        if(myFlow != null)
            await registrationClient.RegisterOrUpdateResource('flow', myFlow);
        if(mySender != null)
            await registrationClient.RegisterOrUpdateResource('sender', mySender);
    };

    doAsync();

    //initialize the Express HTTP listener
    const app = application();
    const corsOptions = { optionsSuccessStatus: 200 };
    var cors = require('cors');
    app.use(cors(corsOptions));
    app.use(application.json({ limit: '50mb' }));
    app.use(application.urlencoded({ extended: true }));
    
    //initialize server
    const server = http.createServer(application);
    
    //initialize the WebSocket server instance
    const webSocketServer = new WebSocket.Server({ noServer: true });

    webSocketServer.on('connection', (ws: WebSocket) => {
        let extWs = ws as WebSocketConnection;
    
        extWs.isAlive = true;
        extWs.connectionId = uuidv4().toString();

        ws.on('close', () => {
            console.log(`Client disconnected - connection id: ${extWs.connectionId}`);
            sessionManager.ConnectionClosed(extWs.connectionId);
        });
    
        ws.on('pong', () => {
            extWs.isAlive = true;
        });
    
        //subscribe to messages
        ws.on('message', (msg: string) => {
            console.log(`WS msg received - connection id: ${extWs.connectionId}, msg: ${msg}`);
            
            let isMessageValid = false;
            let errorMessage = ``;
            let status: NcMethodStatus = NcMethodStatus.BadCommandFormat;

            try
            {
                let message = JSON.parse(msg) as ProtocolWrapper;

                if(message)
                {
                    switch(message.messageType)
                    {
                        case MessageType.Command:
                        {
                            rootBlock.ProcessMessage(msg, extWs);
                            isMessageValid = true;
                        }
                        break;
                        case MessageType.Subscription:
                        {
                            let message = JSON.parse(msg) as ProtocolSubscription;
                            sessionManager.ModifySubscription(extWs, message);
                            isMessageValid = true;
                        }
                        break;
                        default:
                        {
                            isMessageValid = false;
                            errorMessage = `Invalid message type received: ${message.messageType}`;
                        }
                        break;
                    }
                }
                else
                {
                    isMessageValid = false;
                    errorMessage = `Could not parse JSON message: ${msg}`;
                }
            }
            catch (err)
            {
                console.log(err);
                isMessageValid = false;
                errorMessage = `Could not parse JSON message: ${msg}`;
            }

            if(isMessageValid == false)
            {
                console.log(errorMessage);
                let error = new ProtocolError(status, errorMessage);
                extWs.send(error.ToJson());
            }
        });
    
        ws.on('error', (err) => {
            console.warn(`Client disconnected with error - reason: ${err}, connection id: ${extWs.connectionId}`);
            sessionManager.ConnectionClosed(extWs.connectionId);
        })

        sessionManager.CreateSession(extWs);
    });

    setInterval(() => {
        webSocketServer.clients.forEach((ws: WebSocket) => {
            const extWs = ws as WebSocketConnection;
    
            if (!extWs.isAlive) return ws.terminate();
    
            extWs.isAlive = false;
            ws.ping(null, undefined);
        });
    }, 10000);
    
    //forward normal HTTP requests to Express
    server.on('request', app);
    
    //forward WS upgrades to the webSocketServer
    server.on('upgrade', function upgrade(request, socket, head) {
        if(request.url)
        {
            console.log(`Request url ${request.url}`);
            if (request.url.trim().replace(/\/+$/, '') === '/x-nmos/ncp/v1.0/connect')
            {
                webSocketServer.handleUpgrade(request, socket as Socket, head, function done(ws) {
                    webSocketServer.emit('connection', ws, request);
                });
            }
            else 
            {
                socket.destroy();
            }
        }
        else 
        {
            socket.destroy();
        }
    });

    //General paths

    app.get('/', function (req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify([ 'x-nmos/' ]));
        res.end();
    })

    app.get('/x-nmos', function (req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify([ 
            'node/',
            'connection/',
            'configuration/'
        ]));
        res.end();
    })

    //IS-04 paths

    app.get('/x-nmos/node', function (req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify([ 'v1.3/' ]));
        res.end();
    })

    app.get('/x-nmos/node/v1.3', function (req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify([ 
            'self/',
            'devices/',
            'sources/',
            'flows/',
            'senders/',
            'receivers/',
        ]));
        res.end();
    })

    app.get('/x-nmos/node/v1.3/self', function (req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(myNode.ToJson());
        res.end();
    })

    app.get('/x-nmos/node/v1.3/devices', function (req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(myDevice.ToJsonArray());
        res.end();
    })

    app.get('/x-nmos/node/v1.3/devices/:id', function (req, res) {
        if(req.params.id === myDevice.id)
        {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(myDevice.ToJson());
            res.end();
        }
        else
            res.sendStatus(404);
    })

    app.get('/x-nmos/node/v1.3/sources', function (req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(mySource?.ToJsonArray());
        res.end();
    })

    app.get('/x-nmos/node/v1.3/sources/:id', function (req, res) {
        if(req.params.id === mySource?.id)
        {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(mySource.ToJson());
            res.end();
        }
        else
            res.sendStatus(404);
    })

    app.get('/x-nmos/node/v1.3/flows', function (req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(myFlow?.ToJsonArray());
        res.end();
    })

    app.get('/x-nmos/node/v1.3/flows/:id', function (req, res) {
        if(req.params.id === myFlow?.id)
        {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(myFlow.ToJson());
            res.end();
        }
        else
            res.sendStatus(404);
    })

    app.get('/x-nmos/node/v1.3/senders', function (req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(myDevice.FetchSenders(), jsonIgnoreReplacer));
        res.end();
    })

    app.get('/x-nmos/node/v1.3/senders/:id', function (req, res) {
        if(myDevice.FindSender(req.params.id))
        {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(myDevice.FetchSender(req.params.id)?.ToJson());
            res.end();
        }
        else
            res.sendStatus(404);
    })

    app.get('/x-nmos/node/v1.2/senders/:id/sdp', function (req, res) {
        res.setHeader('Content-Type', 'application/sdp');

        if(myDevice.FindSender(req.params.id))
            res.send(myDevice.FetchSender(req.params.id)?.FetchSdp());
        else
            res.sendStatus(404);
    })

    app.get('/x-nmos/node/v1.3/senders/:id/sdp', function (req, res) {
        res.setHeader('Content-Type', 'application/sdp');

        if(myDevice.FindSender(req.params.id))
            res.send(myDevice.FetchSender(req.params.id)?.FetchSdp());
        else
            res.sendStatus(404);
    })

    app.get('/x-nmos/node/v1.3/receivers', function (req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(myDevice.FetchReceivers(), jsonIgnoreReplacer));
        res.end();
    }) 

    app.get('/x-nmos/node/v1.3/receivers/:id', function (req, res) {
        if(myDevice.FindReceiver(req.params.id))
        {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(myDevice.FetchReceiver(req.params.id)?.ToJson());
            res.end();
        }
        else
            res.sendStatus(404);
    })

    //IS-05 paths
    app.get('/x-nmos/connection', function (req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify([ 'v1.1/' ]));
        res.end();
    })

    app.get('/x-nmos/connection/:version', function (req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify([ 
            'single/'
        ]));
        res.end();
    })

    app.get('/x-nmos/connection/:version/single', function (req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify([ 
            'senders/',
            'receivers/'
        ]));
        res.end();
    })

    app.get('/x-nmos/connection/:version/single/senders', function (req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(myDevice.FetchSendersUris()));
        res.end();
    })

    app.get('/x-nmos/connection/:version/single/senders/:id', function (req, res) {
        if(myDevice.FindSender(req.params.id))
        {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify([ 
                'constraints/',
                'staged/',
                'active/',
                'transportfile/',
                'transporttype/'
            ]));
            res.end();
        }
        else
            res.sendStatus(404);
    })

    app.get('/x-nmos/connection/:version/single/senders/:id/constraints', function (req, res) {
        if(myDevice.FindSender(req.params.id))
        {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(myDevice.FetchSender(req.params.id)?.FetchConstraints()));
            res.end();
        }
        else
            res.sendStatus(404);
    })

    app.get('/x-nmos/connection/:version/single/senders/:id/active', function (req, res) {
        if(myDevice.FindSender(req.params.id))
        {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(myDevice.FetchSender(req.params.id)?.FetchActive()?.ToJson());
            res.end();
        }
        else
            res.sendStatus(404);
    })

    app.get('/x-nmos/connection/:version/single/senders/:id/staged', function (req, res) {
        if(myDevice.FindSender(req.params.id))
        {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(myDevice.FetchSender(req.params.id)?.FetchStaged()?.ToJson());
            res.end();
        }
        else
            res.sendStatus(404);
    })

    app.patch('/x-nmos/connection/:version/single/senders/:id/staged', function (req, res) {
        let settings = req.body as NmosSenderActiveRtp;

        if(myDevice.FindSender(req.params.id))
        {
            myDevice.ChangeSenderSettings(req.params.id, settings);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(myDevice.FetchSender(req.params.id)?.FetchActive()?.ToJson());
            res.end();
        }
        else
            res.sendStatus(404);
    })

    app.get('/x-nmos/connection/:version/single/senders/:id/transportfile', function (req, res) {
        res.setHeader('Content-Type', 'application/sdp');

        if(myDevice.FindSender(req.params.id))
            res.send(myDevice.FetchSender(req.params.id)?.FetchSdp());
        else
            res.sendStatus(404);
    })

    app.get('/x-nmos/connection/:version/single/senders/:id/transporttype', function (req, res) {
        if(myDevice.FindSender(req.params.id))
        {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(myDevice.FetchSender(req.params.id)?.FetchTransportType()));
            res.end();
        }
        else
            res.sendStatus(404);
    })

    app.get('/x-nmos/connection/:version/single/receivers', function (req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(myDevice.FetchReceiversUris()));
        res.end();
    })

    app.get('/x-nmos/connection/:version/single/receivers/:id', function (req, res) {
        if(myDevice.FindReceiver(req.params.id))
        {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify([ 
                'constraints/',
                'staged/',
                'active/',
                'transporttype/'
            ]));
            res.end();
        }
        else
            res.sendStatus(404);
    })

    app.get('/x-nmos/connection/:version/single/receivers/:id/constraints', function (req, res) {
        if(myDevice.FindReceiver(req.params.id))
        {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(myDevice.FetchReceiver(req.params.id)?.FetchConstraints()));
            res.end();
        }
        else
            res.sendStatus(404);
    })

    app.get('/x-nmos/connection/:version/single/receivers/:id/active', function (req, res) {
        if(myDevice.FindReceiver(req.params.id))
        {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(myDevice.FetchReceiver(req.params.id)?.FetchActive()?.ToJson());
            res.end();
        }
        else
            res.sendStatus(404);
    })

    app.get('/x-nmos/connection/:version/single/receivers/:id/staged', function (req, res) {
        if(myDevice.FindReceiver(req.params.id))
        {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(myDevice.FetchReceiver(req.params.id)?.FetchStaged()?.ToJson());
            res.end();
        }
        else
            res.sendStatus(404);
    })

    app.get('/x-nmos/connection/:version/single/receivers/:id/transporttype', function (req, res) {
        if(myDevice.FindReceiver(req.params.id))
        {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(myDevice.FetchReceiver(req.params.id)?.FetchTransportType()));
            res.end();
        }
        else
            res.sendStatus(404);
    })

    app.patch('/x-nmos/connection/:version/single/receivers/:id/staged', function (req, res) {
        let settings = req.body as NmosReceiverActiveRtp;

        if(myDevice.FindReceiver(req.params.id))
        {
            myDevice.ChangeReceiverSettings(req.params.id, settings);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(myDevice.FetchReceiver(req.params.id)?.FetchActive()?.ToJson());
            res.end();
        }
        else
            res.sendStatus(404);
    })

    //IS-14 paths

    app.get('/x-nmos/configuration', function (req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify([ 'v1.0/' ]));
        res.end();
    })

    app.get('/x-nmos/configuration/:version', function (req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify([ 
            'rolePaths/'
        ]));
        res.end();
    })

    app.get('/x-nmos/configuration/:version/rolePaths', function (req, res) {
        let response = rootBlock.GetRolePathUrls();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(response.sort((a, b) => (a > b ? -1 : 1))));
        res.end();
    })

    app.get('/x-nmos/configuration/:version/rolePaths/:rolePath', function (req, res) {
        let rolePath = req.params.rolePath.split('.');

        let member = rootBlock.FindMemberByRolePath(rolePath);
        if(member)
        {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify([ 
                'bulkProperties/',
                'descriptor/',
                'methods/',
                'properties/'
            ]));
            res.end();
        }
        else
            res.sendStatus(404);
    })

    app.get('/x-nmos/configuration/:version/rolePaths/:rolePath/descriptor/', function (req, res) {
        let rolePath = req.params.rolePath.split('.');

        let member = rootBlock.FindMemberByRolePath(rolePath);
        if(member)
        {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(classManager.GetClassDescriptor(member.classID, true), jsonIgnoreReplacer));
            res.end();
        }
        else
            res.sendStatus(404);
    })

    app.get('/x-nmos/configuration/:version/rolePaths/:rolePath/methods/', function (req, res) {
        let rolePath = req.params.rolePath.split('.');

        let member = rootBlock.FindMemberByRolePath(rolePath);
        if(member)
        {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(classManager.GetClassDescriptor(member.classID, true)?.methods.map(({ id }) => `${id.level}m${id.index}/`).sort((a, b) => (a > b ? 1 : -1)), jsonIgnoreReplacer));
            res.end();
        }
        else
            res.sendStatus(404);
    })

    app.get('/x-nmos/configuration/:version/rolePaths/:rolePath/properties/', function (req, res) {
        let rolePath = req.params.rolePath.split('.');

        let member = rootBlock.FindMemberByRolePath(rolePath);
        if(member)
        {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(classManager.GetClassDescriptor(member.classID, true)?.properties.map(({ id }) => `${id.level}p${id.index}/`).sort((a, b) => (a > b ? 1 : -1)), jsonIgnoreReplacer));
            res.end();
        }
        else
            res.sendStatus(404);
    })

    app.get('/x-nmos/configuration/:version/rolePaths/:rolePath/properties/:propertyId', function (req, res) {
        let rolePath = req.params.rolePath.split('.');

        let member = rootBlock.FindMemberByRolePath(rolePath);
        if(member)
        {
            let property = classManager.GetClassDescriptor(member.classID, true)?.properties.find(f => req.params.propertyId == `${f.id.level}p${f.id.index}`);
            if(property)
            {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify([ 
                    'descriptor/',
                    'value/'
                ]));
                res.end();
            }
            else
                res.sendStatus(404);
        }
        else
            res.sendStatus(404);
    })

    app.get('/x-nmos/configuration/:version/rolePaths/:rolePath/properties/:propertyId/descriptor', function (req, res) {
        let rolePath = req.params.rolePath.split('.');

        let member = rootBlock.FindMemberByRolePath(rolePath);
        if(member)
        {
            let property = classManager.GetClassDescriptor(member.classID, true)?.properties.find(f => req.params.propertyId == `${f.id.level}p${f.id.index}`);
            if(property?.typeName)
            {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(classManager.GetTypeDescriptor(property.typeName, true), jsonIgnoreReplacer));
                res.end();
            }
            else
                res.sendStatus(404);
        }
        else
            res.sendStatus(404);
    })

    app.get('/x-nmos/configuration/:version/rolePaths/:rolePath/properties/:propertyId/value', function (req, res) {
        let rolePath = req.params.rolePath.split('.');

        let member = rootBlock.FindMemberByRolePath(rolePath);
        if(member)
        {
            let property = classManager.GetClassDescriptor(member.classID, true)?.properties.find(f => req.params.propertyId == `${f.id.level}p${f.id.index}`);
            if(property)
            {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(member.Get(member.oid, property.id, 0).result, jsonIgnoreReplacer));
                res.end();
            }
            else
                res.sendStatus(404);
        }
        else
            res.sendStatus(404);
    })

    app.put('/x-nmos/configuration/:version/rolePaths/:rolePath/properties/:propertyId/value', function (req, res) {
        let apiValue = req.body as ConfigApiValue;

        console.log(`Property PUT ${req.url}`);

        let rolePath = req.params.rolePath.split('.');

        let member = rootBlock.FindMemberByRolePath(rolePath);
        if(member)
        {
            let property = classManager.GetClassDescriptor(member.classID, true)?.properties.find(f => req.params.propertyId == `${f.id.level}p${f.id.index}`);
            if(property)
            {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(member.Set(member.oid, property.id, apiValue.value, 0).result, jsonIgnoreReplacer));
                res.end();
            }
            else
                res.sendStatus(404);
        }
        else
            res.sendStatus(404);
    });

    app.patch('/x-nmos/configuration/:version/rolePaths/:rolePath/methods/:methodId', function (req, res) {
        let apiArguments = req.body as ConfigApiArguments;

        console.log(`Method PATCH ${req.url}`);

        let rolePath = req.params.rolePath.split('.');

        let member = rootBlock.FindMemberByRolePath(rolePath);
        if(member)
        {
            let method = classManager.GetClassDescriptor(member.classID, true)?.methods.find(f => req.params.methodId == `${f.id.level}m${f.id.index}`);
            if(method)
            {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(member.InvokeMethod(member.oid, method.id, apiArguments.arguments, 0).result, jsonIgnoreReplacer));
                res.end();
            }
            else
                res.sendStatus(404);
        }
        else
            res.sendStatus(404);
    })

    app.get('/x-nmos/configuration/:version/rolePaths/:rolePath/bulkProperties', function (req, res) {
        let recurse: boolean = req.query.recurse === 'false' ? false : true;

        console.log(`BulkProperties GET ${req.url}, recurse: ${recurse}`);

        let rolePath = req.params.rolePath.split('.');

        let member = rootBlock.FindMemberByRolePath(rolePath);
        if(member)
        {
            let response = new NcMethodResultBulkValuesHolder(
                NcMethodStatus.OK, new NcBulkValuesHolder("AMWA NMOS Device Control Mock Application|v1.0",
                member.GetAllProperties(recurse)));

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(response, jsonIgnoreReplacer));
            res.end();
        }
        else
            res.sendStatus(404);
    })

    app.patch('/x-nmos/configuration/:version/rolePaths/:rolePath/bulkProperties', function (req, res) {
        let restore = req.body as RestoreBody;

        console.log(`BulkProperties PATCH ${req.url}`);

        let rolePath = req.params.rolePath.split('.');

        let member = rootBlock.FindMemberByRolePath(rolePath);
        if(member)
        {
            let response = new NcMethodResultObjectPropertiesSetValidation(
                NcMethodStatus.OK,
                member.Restore(restore.arguments, false));

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(response, jsonIgnoreReplacer));
            res.end();
        }
        else
            res.sendStatus(404);
    })

    app.put('/x-nmos/configuration/:version/rolePaths/:rolePath/bulkProperties', function (req, res) {
        let restore = req.body as RestoreBody;

        console.log(`BulkProperties PUT ${req.url}`);

        let rolePath = req.params.rolePath.split('.');

        let member = rootBlock.FindMemberByRolePath(rolePath);
        if(member)
        {
            let response = new NcMethodResultObjectPropertiesSetValidation(
                NcMethodStatus.OK,
                member.Restore(restore.arguments, true));

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(response, jsonIgnoreReplacer));
            res.end();
        }
        else
            res.sendStatus(404);
    })

    app.use((req, res, next) => {
        //This applied to any invalid path

        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(new ApiError(404, "Invalid path", "Invalid API path")));
        res.end();
    })
    
    //start our server
    server.listen(config.port, () => {
        console.log(`Server started on port ${(server.address() as AddressInfo).port}`);
    });
}
catch (err) 
{
    console.log(err);
}