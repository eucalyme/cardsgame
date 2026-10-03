import { SERVER_PORT } from '@cardgame/shared/src/config'
import { WebSocketServer } from 'ws'
import Connection from './Connection'
import Logger from './Logger'
import RoomManager from './RoomManager'
import SessionManager from './SessionManager'

const sessionManager = new SessionManager()
const roomManager = new RoomManager()

const wss = new WebSocketServer({ port: SERVER_PORT })
wss.on('connection', (ws) => new Connection({ws, sessionManager, roomManager}))
Logger.info(`Server started on ${SERVER_PORT}`);