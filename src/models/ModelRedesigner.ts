import { GameInterface } from "../dto/BG_Stats/game/game.interface";
import { PlayerInterface } from "../dto/BG_Stats/player/player.interface";
import { gameTable, playerTable } from "../mainDatabase";

class changedIdentifiers {
    originalId: number;
    newId: number;
}

export class ModelRedesigner {
    renamedPlayers: changedIdentifiers[] = [];
    renamedGames: changedIdentifiers[] = [];

    public async PlayerRedesigner(players: PlayerInterface[]): Promise<PlayerInterface[]> {
        const incomingIds = players.map(u => u.id);
        const processedDocs = await playerTable
            .find({ id: { $in: incomingIds } })
            .lean()
            .exec();

        const processedById = new Map<number, typeof processedDocs[0]>(
            processedDocs.map(d => [d.id, d])
        );

        const alreadySeen: PlayerInterface[] = [];
        const brandNew: PlayerInterface[] = [];
        for (const user of players) {
            if (processedById.has(user.id)) {
                alreadySeen.push(user);
            } else {
                brandNew.push(user);
            }
        }
        alreadySeen.forEach(queueUser => {
            const processedUser = processedById.get(queueUser.id)!;

            if (processedUser.uuid === queueUser.uuid) {
                // ✅ exactly the same user (ID+UUID match)
                // we can ignore these.
            } else {
                // ⚠️ ID matches but UUID differs -> create new
                queueUser.id = queueUser.id * -1;
                this.renamedPlayers.push({
                    originalId: Math.abs(queueUser.id),
                    newId: queueUser.id
                })
            }
        });
        return [...alreadySeen, ...brandNew]
    }

    public async GameRedesigner(games: GameInterface[]): Promise<GameInterface[]> {
        games.forEach(queueGame => {
            var meta = JSON.parse(queueGame.metaData)
            if (meta.playerRefId != undefined) {
                const hasOriginalId = this.renamedPlayers.some(player => player.originalId === meta.playerRefId);
                if (hasOriginalId) {
                    const playerWithOriginalId = this.renamedPlayers.find(player => player.originalId === meta.playerRefId);
                    meta.playerRefId = playerWithOriginalId.newId;
                    queueGame.metaData = JSON.stringify(meta);
                }
            }
        });
        const incomingIds = games.map(u => u.id);
        const processedDocs = await gameTable
            .find({ id: { $in: incomingIds } })
            .lean()
            .exec();

        const processedById = new Map<number, typeof processedDocs[0]>(
            processedDocs.map(d => [d.id, d])
        );

        const alreadySeen: GameInterface[] = [];
        const brandNew: GameInterface[] = [];
        for (const game of games) {
            if (processedById.has(game.id)) {
                alreadySeen.push(game);
            } else {
                brandNew.push(game);
            }
        }
        alreadySeen.forEach(queueGame => {
            const processedGame = processedById.get(queueGame.id)!;

            if (processedGame.uuid === queueGame.uuid) {
                // ✅ exactly the same user (ID+UUID match)
                // we can ignore these.
            } else {
                // ⚠️ ID matches but UUID differs -> create new
                queueGame.id = queueGame.id * -1;
                this.renamedGames.push({
                    originalId: Math.abs(queueGame.id),
                    newId: queueGame.id
                })
            }
        });

        return [...alreadySeen, ...brandNew]
    }
}