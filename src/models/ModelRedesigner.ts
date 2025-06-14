import { GameInterface } from "../dto/BG_Stats/game/game.interface";
import { LocationInterface } from "../dto/BG_Stats/location/location.interface";
import { PlayerInterface } from "../dto/BG_Stats/player/player.interface";
import { TagInterface } from "../dto/BG_Stats/tags/tags.interface";
import {gameTable, locationTable, playerTable, tagTable, challengeTable, groupTable} from "../mainDatabase";
import {ChallengeInterface} from "../dto/BG_Stats/challenges/challenges.interface";
import { v4 as uuidv4 } from 'uuid';
import {GroupInterface} from "../dto/BG_Stats/group/group.interface";

interface changedIdentifiers {
    originalId: number;
    newId: number;
    subscribes: boolean;
}

interface EntityWithIdUuid {
    id: number;
    uuid: string;
    tags?: { tagRefId: number }[];
}

type ChangedIdentifiersMap = Map<number, number>;

// Main utility class to handle redesign (ID reassignment) of imported data entities
export class ModelRedesigner {
    renamedTags: changedIdentifiers[] = [];
    renamedPlayers: changedIdentifiers[] = [];
    renamedGames: changedIdentifiers[] = [];
    renamedLocations: changedIdentifiers[] = [];

    /**
     * Update the tag reference IDs in the provided entity list using the given ID map.
     * Used to propagate ID changes in tags to referencing entities.
     */
    private updateTagRefs(
        items: { tags?: { tagRefId: number }[] }[],
        tagIdMap: ChangedIdentifiersMap,
        renamedList: changedIdentifiers[]
    ) {
        items.forEach(item => {
            item.tags?.forEach(tag => {
                const newId = tagIdMap.get(tag.tagRefId);
                if (newId !== undefined) {
                    const originalId = tag.tagRefId;
                    tag.tagRefId = newId;

                    // this way we later on only need to check for mongoDB ID's if it was true, or it didn't have a tagrename in the first place
                    const change = renamedList.find(r => r.originalId === originalId && r.newId === newId);
                    if (change) {
                        change.subscribes = true;
                    }
                }
            });
        });
    }


    /**
     * Generic method to process and redesign any type of entity based on ID/UUID.
     * If UUIDs differ from existing DB entries, the entity is considered a new version and its ID is negated.
     *
     * @param items - List of incoming entities to process.
     * @param table - Corresponding database table to check existing entries.
     * @param renamedList - Array to track entities whose IDs have changed.
     * @param tagMap - Optional map of old-to-new tag IDs for tag propagation.
     * @param getIdKey - Function to extract the ID from an entity.
     * @param getUuidKey - Function to extract the UUID from an entity.
     * @returns A promise that resolves to a new array of processed entities.
     */
    private async redesignEntities<T extends EntityWithIdUuid>(
        items: T[],
        table: { find: Function },
        renamedList: changedIdentifiers[],
        tagMap?: ChangedIdentifiersMap,
        getIdKey = (x: T) => x.id,
        getUuidKey = (x: T) => x.uuid
    ): Promise<T[]> {
        if (tagMap) this.updateTagRefs(items, tagMap, renamedList);

        // Fetch existing entries from the DB by their IDs
        const incomingIds = items.map(getIdKey);
        const processedDocs = await table.find({ id: { $in: incomingIds } }).lean().exec();
        const processedById = new Map<number, T>(
            processedDocs.map((d: T) => [getIdKey(d), d])
        );

        const result: T[] = [];

        // Compare each item with DB entry to determine if it's new, updated, or unchanged
        for (const item of items) {
            const processed = processedById.get(getIdKey(item));
            if (!processed) {
                // No matching record: treat as new
                result.push(item);
            } else if (getUuidKey(processed) !== getUuidKey(item)) {
                // UUID mismatch: ID conflict, make new ID by negating the existing one
                const originalId = item.id;
                item.id *= -1;
                renamedList.push({ originalId, newId: item.id, subscribes: false });
                result.push(item);
            } else {
                // UUID match: exact duplicate, reuse as-is
                result.push(item);
            }
        }

        return result;
    }

    /**
     * Redesigns the players. Updates tag references and resolves ID conflicts.
     */
    public PlayerRedesigner(players: PlayerInterface[]): Promise<PlayerInterface[]> {
        return this.redesignEntities(
            players,
            playerTable,
            this.renamedPlayers,
            new Map(this.renamedTags.map(tag => [tag.originalId, tag.newId]))
        );
    }

    /**
     * Redesigns the games. Adjusts references to player IDs in metadata and resolves UUID conflicts.
     */
    public GameRedesigner(games: GameInterface[]): Promise<GameInterface[]> {
        const playerIdMap = new Map(this.renamedPlayers.map(p => [p.originalId, p.newId]));

        // Update playerRefId in the game's metadata JSON if applicable
        games.forEach(g => {
            try {
                const meta = JSON.parse(g.metaData);
                const newId = playerIdMap.get(meta?.playerRefId);
                if (newId !== undefined) {
                    meta.playerRefId = newId;
                    g.metaData = JSON.stringify(meta);
                }
            } catch {
                // Malformed metadata JSON: ignore
            }
        });

        return this.redesignEntities(
            games,
            gameTable,
            this.renamedGames
        );
    }

    /**
     * Redesigns the locations, updating tag references and checking for UUID-based updates.
     */
    public LocationRedesigner(locations: LocationInterface[]): Promise<LocationInterface[]> {
        return this.redesignEntities(
            locations,
            locationTable,
            this.renamedLocations,
            new Map(this.renamedTags.map(tag => [tag.originalId, tag.newId]))
        );
    }

    /**
     * Redesigns the tags, checking for existing UUID matches.
     */
    public TagsRedesigner(tags: TagInterface[]): Promise<TagInterface[]> {
        return this.redesignEntities(
            tags,
            tagTable,
            this.renamedTags
        );
    }

    /**
     * Redesigns the groups, checking for existing UUID matches.
     */
    public GroupRedesigner(groups: GroupInterface[]): Promise<GroupInterface[]> {
        return this.redesignEntities(
            groups,
            groupTable,
            this.renamedTags
        );
    }

    /**
     * Redesigns challenges by checking for UUID and name conflicts.
     * If UUID exists and name is unchanged, keep the existing UUID.
     * If UUID exists but name has changed, generate a new UUID.
     */
    public async ChallengeRedesigner(challenges: ChallengeInterface[]): Promise<ChallengeInterface[]> {
        const uuids = challenges.map(c => c.uuid);

        const existingChallenges = await challengeTable.find({ uuid: { $in: uuids } }).lean().exec();
        const existingByUuid = new Map<string, ChallengeInterface>(
            existingChallenges.map((c: ChallengeInterface) => [c.uuid, c])
        );

        const result: ChallengeInterface[] = [];

        for (const challenge of challenges) {
            const existing = existingByUuid.get(challenge.uuid);

            if (!existing) {
                // No UUID conflict, safe to insert
                result.push(challenge);
            } else if (existing.name === challenge.name) {
                // UUID exists and name matches — treat as same
                result.push(challenge);
            } else {
                // UUID exists but name differs — regenerate UUID
                // in theory I should recheck the uuid here for accidental doubles. but this is practiccally impossible, so nahh.
                challenge.uuid = uuidv4();
                result.push(challenge);
            }
        }
        return result;
    }

}
