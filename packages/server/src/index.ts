import { SERVER_PORT } from '@cardgame/shared/src/config'
import { WebSocketServer } from 'ws'
import Connection from './Connection'
import Logger from './Logger'
import SessionManager from './SessionManager'

const sessionManager = new SessionManager()

const wss = new WebSocketServer({ port: SERVER_PORT })
wss.on('connection', (ws) => new Connection({ws, sessionManager}))
Logger.info(`Server started on ${SERVER_PORT}`);