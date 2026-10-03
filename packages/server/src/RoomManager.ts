import { CODE_ALPHABET, CODE_LENGTH } from "@cardgame/shared/src/config";
import { ServToCli } from "@cardgame/shared/src/protocol";
import Room from "./Room";
import type Session from "./Session";

/**
 * Class gerrant les salons
 */
class RoomManager {
    /** Map entre le code et son salon */
    private byCode = new Map<string, Room>();
    /** Map entre l'id de chaque joueur et le salon auquel il est connecté */
    private byPlayer = new Map<string, string>()

    /**
     * Suppression d'un joueur de son salon
     * -> Appel la destruction de la room si vidé
     * -> Change le propriétaire si supprimé
     * @param player à supprimer
     */
    removePlayer(player: Session)
    {
        let code = this.byPlayer.get(player.playerId); 
        if(!code)
            return;
        this.byPlayer.delete(player.playerId);

        let room = this.byCode.get(code);
        if(!room)
            return; 

        if(!room.remove(player))
            return;

        if(room.players.length === 0)
            this.delete(code);
        else if(player.playerId === room.owner.playerId)
            room.owner = room.players[0];

        room.broadcast({
            type: ServToCli.RoomUpdated,
            id: code,
            owner: room.owner.playerId,
            players: room.players.map((p) => ({
                pseudo: p.pseudo,
                id: p.playerId,
            }))
        });
    }

    /**
     * Ajout d'un joueur dans un salon
     * -> Le supprime de son ancien salon
     * @param code du salon
     * @param player à ajouter
     */
    addPlayer(code: string, player: Session) : boolean
    {
        let room = this.byCode.get(code)
        if(!room) 
            return false;
        if(code === this.byPlayer.get(player.playerId))
            return false;

        this.removePlayer(player);
        if(!room.add(player))
            return false;
        this.byPlayer.set(player.playerId, code);
        room.broadcast({
            type: ServToCli.RoomUpdated,
            id: code,
            owner: room.owner.playerId,
            players: room.players.map((p) => ({
                pseudo: p.pseudo,
                id: p.playerId,
            }))
        });
        return true;
    }

    /** 
     * Méthode de création d'un salon
     * -> Le supprime de son ancien salon
     */
    create(player: Session)
    {
        this.removePlayer(player);

        let code = this.createNewCode();
        let room = new Room({player});
        this.byCode.set(code, room)
        this.byPlayer.set(player.playerId, code);

        room.broadcast({
            type: ServToCli.RoomUpdated,
            id: code,
            owner: room.owner.playerId,
            players: room.players.map((p) => ({
                pseudo: p.pseudo,
                id: p.playerId,
            }))
        });
    }

    /** 
     * Méthode de suppression d'un salon
     */
    delete(code: string)
    {
        let room = this.byCode.get(code)
        if(!room)
            return;
        for(let player of room.players)
        {
            this.byPlayer.delete(player.playerId);
        }
        this.byCode.delete(code);
    }

    /** Kick un joueur de la room si l'éméteur est bien propriétaire */
    kick(owner: Session, playerId: string)
    {
        let ownerCode = this.byPlayer.get(owner.playerId);
        let playerCode = this.byPlayer.get(playerId);
        if(!ownerCode || ownerCode !== playerCode)
            return;
        let room = this.byCode.get(ownerCode);
        if(owner.playerId !== room?.owner.playerId)
            return;

        let player = room.players.find(p => p.playerId === playerId);
        if(!player)
            return;

        this.removePlayer(player);
    }

    /** Méthode pour créer un nouveau code de salon */
    createNewCode()
    {
        let code;
        do {
            code = Array.from({ length: CODE_LENGTH }, () =>
                    CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)].toLocaleUpperCase()
                ).join("");
        } while (this.byCode.has(code));
        return code;
    }

}

/**
 * Exports
 */
export default RoomManager;