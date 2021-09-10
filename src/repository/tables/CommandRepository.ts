import { Inject, Service } from "typedi";
import CommandModel from '../models/CommandModel';
import DbRepository from './DbRepository';
import { DatabaseProvider } from "../DatabaseProvider";

@Service()
class CommandRepository extends DbRepository {

    constructor(
        @Inject()
        dbProvider: DatabaseProvider
    ){
        super(dbProvider);
        this.readyOn(this.initAsync);
    }

    private initAsync = async () => {
        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS commands (
                guild_id TEXT,
                name TEXT NOT NULL,
                enabled INTEGER DEFAULT 1 NOT NULL,
                logUsage INTEGER DEFAULT 0 NOT NULL,
                suppressOutput INTEGER DEFAULT 0 NOT NULL,
                permissionSet_id INTEGER,
                outputChannelId TEXT,
                PRIMARY KEY(guild_id, name)
            );
        `);
    }

    insert = async (command: CommandModel) => await this.db.run(
        'INSERT OR IGNORE INTO commands (guild_id, name, enabled, logUsage, suppressOutput) VALUES (?, ?, ?, ?, ?);',
        command.guild_id,
        command.name,
        command.enabled,
        command.logUsage,
        command.suppressOutput
    );

    select = async(guild_id: string, name: string) => await this.db.get<CommandModel>('SELECT * FROM commands WHERE guild_id = ? AND name = ?;', guild_id, name);
    selectAll = async(guild_id: string) => await this.db.all<CommandModel[]>('SELECT * FROM commands WHERE guild_id = ?;', guild_id);

    updateEnabled = async(guild_id: string, name: string, enabled: boolean) => await this.db.run('UPDATE commands SET enabled = ? WHERE guild_id = ? AND name = ?;', enabled, guild_id, name);
    updateLogUsage = async(guild_id: string, name: string, logUsage: boolean) => await this.db.run('UPDATE commands SET logUsage = ? WHERE guild_id = ? AND name = ?;', logUsage, guild_id, name);
    updateSuppressOutput = async(guild_id: string, name: string, suppressOutput: boolean) => await this.db.run('UPDATE commands SET suppressOutput = ? WHERE guild_id = ? AND name = ?;', suppressOutput, guild_id, name);    
    updatePermissionSet = async(guild_id: string, name: string, permissionset_id: number|null) => await this.db.run('UPDATE commands SET permissionset_id = ? WHERE guild_id = ? AND name = ?;', permissionset_id, guild_id, name);
    updateOutputChannelId = async(guild_id: string, name: string, outputChannelId: string|null) => await this.db.run('UPDATE commands SET outputChannelId = ? WHERE guild_id = ? AND name = ?;', outputChannelId, guild_id, name);

    delete = async(guild_id: string, name: string) => await this.db.run('DELETE FROM commands WHERE guild_id = ? AND name = ?;', guild_id, name);
    deleteGuild = async(guild_id: string) => await this.db.run('DELETE FROM commands WHERE guild_id = ?;', guild_id);
}

export default CommandRepository;