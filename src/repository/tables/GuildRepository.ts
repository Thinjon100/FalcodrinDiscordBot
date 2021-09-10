import { Inject, Service } from "typedi";
import GuildModel from '../models/GuildModel';
import DbRepository from './DbRepository';
import { DatabaseProvider } from "../DatabaseProvider";

@Service()
class GuildRepository extends DbRepository {

    constructor(
        @Inject()
        dbProvider: DatabaseProvider
    ){
        super(dbProvider);
        this.readyOn(this.initAsync);
    }

    private initAsync = async () => {
        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS guilds (
                guild_id TEXT PRIMARY KEY,
                name TEXT,
                ownerID TEXT,
                staffLogChannelID TEXT,
                muteRoleID TEXT
            );
        `);
    }

    insert = async (guild: GuildModel) => await this.db.run(
        'INSERT OR IGNORE INTO guilds (guild_id, name, ownerID, staffLogChannelID, muteRoleID) VALUES (?, ?, ?, ?, ?);', 
        guild.guild_id, 
        guild.name, 
        guild.ownerID, 
        guild.staffLogChannelID,
        guild.muteRoleID
    );

    select = async(guild_id: string) => await this.db.get<GuildModel>('SELECT * FROM guilds WHERE guild_id = ?;', guild_id);

    updateName = async(guild_id: string, name: string) => await this.db.run('UPDATE guilds SET name = ? WHERE guild_id = ?;', name, guild_id);
    updateStaffLogChannel = async(guild_id: string, staffLogChannelID: string|null) => await this.db.run('UPDATE guilds SET staffLogChannelID = ? WHERE guild_id = ?;', staffLogChannelID, guild_id);
    updateMuteRole = async(guild_id: string, muteRoleID: string|null) => await this.db.run('UPDATE guilds SET muteRoleID = ? WHERE guild_id = ?;', muteRoleID, guild_id);

    deleteGuild = async(guild_id: string) => await this.db.run('DELETE FROM guilds WHERE guild_id = ?;', guild_id);
}

export default GuildRepository;