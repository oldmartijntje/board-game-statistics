import { GameInterface } from "../dto/BG_Stats/game/game.interface";
import { LocationInterface } from "../dto/BG_Stats/location/location.interface";
import { PlayerInterface } from "../dto/BG_Stats/player/player.interface";
import { TagInterface } from "../dto/BG_Stats/tags/tags.interface";
import { gameTable, locationTable, playerTable, tagTable } from "../mainDatabase";

interface changedIdentifiers {
    originalId: number;
    newId: number;
}

interface EntityWithIdUuid {
    id: number;
    uuid: string;
    tags?: { tagRefId: number }[];
}

type ChangedIdentifiersMap = Map<number, number>;

export class ModelRedesigner {
    renamedTags: changedIdentifiers[] = [];
    renamedPlayers: changedIdentifiers[] = [];
    renamedGames: changedIdentifiers[] = [];
    renamedLocations: changedIdentifiers[] = [];

    private updateTagRefs(
        items: { tags?: { tagRefId: number }[] }[],
        tagIdMap: ChangedIdentifiersMap
    ) {
        items.forEach(item => {
            item.tags?.forEach(tag => {
                const newId = tagIdMap.get(tag.tagRefId);
                if (newId !== undefined) {
                    tag.tagRefId = newId;
                }
            });
        });
    }

    private async redesignEntities<T extends EntityWithIdUuid>(
        items: T[],
        table: { find: Function }, // e.g., playerTable
        renamedList: changedIdentifiers[],
        tagMap?: ChangedIdentifiersMap,
        getIdKey = (x: T) => x.id,
        getUuidKey = (x: T) => x.uuid
    ): Promise<T[]> {
        if (tagMap) this.updateTagRefs(items, tagMap);

        const incomingIds = items.map(getIdKey);
        const processedDocs = await table.find({ id: { $in: incomingIds } }).lean().exec();
        const processedById = new Map<number, T>(
            processedDocs.map((d: T) => [getIdKey(d), d])
        );

        const result: T[] = [];
        for (const item of items) {
            const processed = processedById.get(getIdKey(item));
            if (!processed) {
                result.push(item);
            } else if (getUuidKey(processed) !== getUuidKey(item)) {
                // UUID mismatch: make new item
                const originalId = item.id;
                item.id *= -1;
                renamedList.push({ originalId, newId: item.id });
                result.push(item);
            } else {
                // exact match — keep as-is
                result.push(item);
            }
        }

        return result;
    }

    public PlayerRedesigner(players: PlayerInterface[]): Promise<PlayerInterface[]> {
        return this.redesignEntities(
            players,
            playerTable,
            this.renamedPlayers,
            new Map(this.renamedTags.map(tag => [tag.originalId, tag.newId]))
        );
    }

    public GameRedesigner(games: GameInterface[]): Promise<GameInterface[]> {
        const playerIdMap = new Map(this.renamedPlayers.map(p => [p.originalId, p.newId]));

        games.forEach(g => {
            try {
                const meta = JSON.parse(g.metaData);
                const newId = playerIdMap.get(meta?.playerRefId);
                if (newId !== undefined) {
                    meta.playerRefId = newId;
                    g.metaData = JSON.stringify(meta);
                }
            } catch { }
        });

        return this.redesignEntities(
            games,
            gameTable,
            this.renamedGames
        );
    }

    public LocationRedesigner(locations: LocationInterface[]): Promise<LocationInterface[]> {
        return this.redesignEntities(
            locations,
            locationTable,
            this.renamedLocations,
            new Map(this.renamedTags.map(tag => [tag.originalId, tag.newId]))
        );
    }

    public TagsRedesigner(tags: TagInterface[]): Promise<TagInterface[]> {
        return this.redesignEntities(
            tags,
            tagTable,
            this.renamedTags
        );
    }
}