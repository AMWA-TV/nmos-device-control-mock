import application from 'express';
import http from 'http';
import { AddressInfo, Socket } from 'net';
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';

import { Configuration } from './Configuration';
import { NmosNode } from './NmosNode';
import { NmosDevice } from './NmosDevice';
import { RegistrationClient } from './RegistrationClient';
import { NmosReceiverVideo } from './NmosReceiverVideo';
import { NmosReceiverActiveRtp } from './NmosReceiverActiveRtp';
import { SessionManager } from './SessionManager';
import { NcBlock, RootBlock } from './NCModel/Blocks';
import { NcClassManager, NcSubscriptionManager } from './NCModel/Managers';
import { NcReceiverMonitor } from './NCModel/Agents';
import { NcLockState, NcTouchpointNmos, NcTouchpointResourceNmos } from './NCModel/Core';

export interface WebSocketConnection extends WebSocket {
    isAlive: boolean;
    connectionId: string;
}

try
{
    console.log('App started');
    const config = new Configuration();

    const registrationClient = new RegistrationClient(config.registry_address, config.registry_port);

    const myNode = new NmosNode(
        config.node_id,
        config.base_label,
        config.address,
        config.port,
        registrationClient);

    const myDevice = new NmosDevice(
        config.device_id,
        config.node_id,
        config.base_label,
        config.address,
        config.port,
        registrationClient);

    const myVideoReceiver = new NmosReceiverVideo(
        config.receiver_id,
        config.device_id,
        config.base_label,
        'urn:x-nmos:transport:rtp.mcast',
        registrationClient)

    myDevice.AddReceiver(myVideoReceiver);

    const sessionManager = new SessionManager();

    const classManager = new NcClassManager(
        3,
        true,
        1,
        'ClassManager',
        'Class manager',
        false,
        NcLockState.NoLock,
        null,
        sessionManager);

    const subscriptionManager = new NcSubscriptionManager(
        5,
        true,
        1,
        'SubscriptionManager',
        'Subscription manager',
        false,
        NcLockState.NoLock,
        null,
        sessionManager);

    const receiverMonitorAgent = new NcReceiverMonitor(
        11,
        true,
        1,
        'ReceiverMonitor_01',
        'Receiver monitor 01',
        false,
        NcLockState.NoLock,
        [ new NcTouchpointNmos(`is-04`, [ new NcTouchpointResourceNmos('receiver', myVideoReceiver.id)]) ],
        sessionManager);

    myVideoReceiver.AttachMonitoringAgent(receiverMonitorAgent);

    const rootBlock = new RootBlock(
        1,
        true,
        null,
        'Root',
        'Root',
        false,
        NcLockState.NoLock,
        null,
        true,
        null,
        null,
        null,
        null,
        null,
        false,
        [ classManager, subscriptionManager, receiverMonitorAgent ],
        null,
        null,
        sessionManager);

    registrationClient.RegisterOrUpdateResource('node', myNode);
    registrationClient.RegisterOrUpdateResource('device', myDevice);
    registrationClient.RegisterOrUpdateResource('receiver', myVideoReceiver);

    registrationClient.StartHeatbeats(myNode.id);
    
    //initialize the Express HTTP listener
    const app = application();
    app.use(application.json());
    
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
            rootBlock.ProcessMessage(msg, extWs);
        });
    
        ws.on('error', (err) => {
            console.warn(`Client disconnected with error - reason: ${err}, connection id: ${extWs.connectionId}`);
            sessionManager.ConnectionClosed(extWs.connectionId);
        })
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
        if(request.url !== undefined)
        {
            console.log(`Request url ${request.url})`);
            if (request.url === '/x-nmos/ncp/v1.0/connect')
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
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify([ 'x-nmos/' ]));
    })

    app.get('/x-nmos', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify([ 
            'node/',
            'connection/'
        ]));
    })

    //IS-04 paths

    app.get('/x-nmos/node', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify([ 'v1.3/' ]));
    })

    app.get('/x-nmos/node/v1.3', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify([ 
            'self/',
            'devices/',
            'sources/',
            'flows/',
            'senders/',
            'receivers/',
        ]));
    })

    app.get('/x-nmos/node/v1.3/self', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(myNode.ToJson());
    })

    app.get('/x-nmos/node/v1.3/devices', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify([ `${myDevice.id}/` ]));
    })

    app.get('/x-nmos/node/v1.3/devices/:id', function (req, res) {
        res.setHeader('Content-Type', 'application/json');

        if(req.params.id === myDevice.id)
            res.send(myDevice.ToJson());
        else
            res.sendStatus(404);
    })

    app.get('/x-nmos/node/v1.3/sources', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify([]));
    })

    app.get('/x-nmos/node/v1.3/flows', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify([]));
    })

    app.get('/x-nmos/node/v1.3/senders', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify([]));
    })

    app.get('/x-nmos/node/v1.3/receivers', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(myDevice.FetchReceiversUris()))
    })

    app.get('/x-nmos/node/v1.3/receivers/:id', function (req, res) {
        res.setHeader('Content-Type', 'application/json');

        if(myDevice.FindReceiver(req.params.id))
            res.send(myDevice.FetchReceiver(req.params.id)?.ToJson());
        else
            res.sendStatus(404);
    })

    //IS-05 paths
    app.get('/x-nmos/connection', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify([ 'v1.1/' ]));
    })

    app.get('/x-nmos/connection/:version', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify([ 
            'single/'
        ]));
    })

    app.get('/x-nmos/connection/:version/single', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify([ 
            'senders/',
            'receivers/'
        ]));
    })

    app.get('/x-nmos/connection/:version/single/senders', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify([]));
    })

    app.get('/x-nmos/connection/:version/single/receivers', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(myDevice.FetchReceiversUris()));
    })

    app.get('/x-nmos/connection/:version/single/receivers/:id', function (req, res) {
        res.setHeader('Content-Type', 'application/json');

        if(myDevice.FindReceiver(req.params.id))
            res.send(JSON.stringify([ 
                'constrains/',
                'staged/',
                'active/',
                'transporttype'
            ]));
        else
            res.sendStatus(404);
    })

    app.get('/x-nmos/connection/:version/single/receivers/:id/constraints', function (req, res) {
        res.setHeader('Content-Type', 'application/json');

        if(myDevice.FindReceiver(req.params.id))
            res.send(JSON.stringify(myDevice.FetchReceiver(req.params.id)?.FetchConstraints()));
        else
            res.sendStatus(404);
    })

    app.get('/x-nmos/connection/:version/single/receivers/:id/active', function (req, res) {
        res.setHeader('Content-Type', 'application/json');

        if(myDevice.FindReceiver(req.params.id))
            res.send((myDevice.FetchReceiver(req.params.id)?.FetchActive()?.ToJson()));
        else
            res.sendStatus(404);
    })

    app.get('/x-nmos/connection/:version/single/receivers/:id/staged', function (req, res) {
        res.setHeader('Content-Type', 'application/json');

        if(myDevice.FindReceiver(req.params.id))
            res.send((myDevice.FetchReceiver(req.params.id)?.FetchStaged()?.ToJson()));
        else
            res.sendStatus(404);
    })

    app.get('/x-nmos/connection/:version/single/receivers/:id/transporttype', function (req, res) {
        res.setHeader('Content-Type', 'application/json');

        if(myDevice.FindReceiver(req.params.id))
            res.send(JSON.stringify(myDevice.FetchReceiver(req.params.id)?.FetchTransportType()));
        else
            res.sendStatus(404);
    })

    app.patch('/x-nmos/connection/:version/single/receivers/:id/staged', function (req, res) {
        res.setHeader('Content-Type', 'application/json');

        let settings = req.body as NmosReceiverActiveRtp;

        if(myDevice.FindReceiver(req.params.id))
        {
            myDevice.ChangeReceiverSettings(req.params.id, settings);
            res.send((myDevice.FetchReceiver(req.params.id)?.FetchActive()?.ToJson()));
        }
        else
            res.sendStatus(404);
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