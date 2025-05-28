import { GameInterface } from "../dto/BG_Stats/game/game.interface";
import { LocationInterface } from "../dto/BG_Stats/location/location.interface";
import { PlayerInterface } from "../dto/BG_Stats/player/player.interface";
import { TagInterface } from "../dto/BG_Stats/tags/tags.interface";
import { gameTable, locationTable, playerTable, tagTable } from "../mainDatabase";

class changedIdentifiers {
    originalId: number;
    newId: number;
}

export class ModelRedesigner {
    renamedTags: changedIdentifiers[] = [];
    renamedPlayers: changedIdentifiers[] = [];
    renamedGames: changedIdentifiers[] = [];
    renamedLocations: changedIdentifiers[] = [];

    public async PlayerRedesigner(players: PlayerInterface[]): Promise<PlayerInterface[]> {
        const tagIdMap = new Map(
            this.renamedTags.map(tag => [tag.originalId, tag.newId])
        );
        players.forEach(queueItem => {
            if (queueItem.tags !== undefined) {
                queueItem.tags.forEach(appliedTag => {
                    const newId = tagIdMap.get(appliedTag.tagRefId);
                    if (newId !== undefined) {
                        appliedTag.tagRefId = newId;
                    }
                });
            }
        });

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
        const playerIdMap = new Map(
            this.renamedPlayers.map(player => [player.originalId, player.newId])
        );
        games.forEach(queueGame => {
            try {
                const meta = JSON.parse(queueGame?.metaData);
                const newId = playerIdMap.get(meta?.playerRefId);

                if (newId !== undefined) {
                    meta.playerRefId = newId;
                    queueGame.metaData = JSON.stringify(meta);
                }
            } catch {

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

    public async LocationRedesigner(items: LocationInterface[]): Promise<LocationInterface[]> {
        const tagIdMap = new Map(
            this.renamedTags.map(tag => [tag.originalId, tag.newId])
        );
        items.forEach(queueItem => {
            if (queueItem.tags !== undefined) {
                queueItem.tags.forEach(appliedTag => {
                    const newId = tagIdMap.get(appliedTag.tagRefId);
                    if (newId !== undefined) {
                        appliedTag.tagRefId = newId;
                    }
                });
            }
        });

        const incomingIds = items.map(u => u.id);
        const processedDocs = await locationTable
            .find({ id: { $in: incomingIds } })
            .lean()
            .exec();

        const processedById = new Map<number, typeof processedDocs[0]>(
            processedDocs.map(d => [d.id, d])
        );

        const alreadySeen: LocationInterface[] = [];
        const brandNew: LocationInterface[] = [];
        for (const item of items) {
            if (processedById.has(item.id)) {
                alreadySeen.push(item);
            } else {
                brandNew.push(item);
            }
        }
        alreadySeen.forEach(queueItem => {
            const processed = processedById.get(queueItem.id)!;

            if (processed.uuid === queueItem.uuid) {
                // ✅ exactly the same user (ID+UUID match)
                // we can ignore these.
            } else {
                // ⚠️ ID matches but UUID differs -> create new
                queueItem.id = queueItem.id * -1;
                this.renamedLocations.push({
                    originalId: Math.abs(queueItem.id),
                    newId: queueItem.id
                })
            }
        });

        return [...alreadySeen, ...brandNew]
    }

    public async TagsRedesigner(items: TagInterface[]): Promise<TagInterface[]> {
        const incomingIds = items.map(u => u.id);
        const processedDocs = await tagTable
            .find({ id: { $in: incomingIds } })
            .lean()
            .exec();

        const processedById = new Map<number, typeof processedDocs[0]>(
            processedDocs.map(d => [d.id, d])
        );

        const alreadySeen: TagInterface[] = [];
        const brandNew: TagInterface[] = [];
        for (const item of items) {
            if (processedById.has(item.id)) {
                alreadySeen.push(item);
            } else {
                brandNew.push(item);
            }
        }
        alreadySeen.forEach(queueItem => {
            const processed = processedById.get(queueItem.id)!;

            if (processed.uuid === queueItem.uuid) {
                // ✅ exactly the same user (ID+UUID match)
                // we can ignore these.
            } else {
                // ⚠️ ID matches but UUID differs -> create new
                queueItem.id = queueItem.id * -1;
                this.renamedTags.push({
                    originalId: Math.abs(queueItem.id),
                    newId: queueItem.id
                })
            }
        });

        return [...alreadySeen, ...brandNew]
    }
}