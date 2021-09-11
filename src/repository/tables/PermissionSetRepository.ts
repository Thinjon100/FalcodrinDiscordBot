import { Inject, Service } from "typedi";
import PermissionSetModel from '../models/PermissionSetModel';
import PermissionSetRoleModel from "../models/PermissionSetRoleModel";
import PermissionSetUserModel from "../models/PermissionSetUserModel";
import { PermissionSetChannelModel } from "../models/PermissionSetChannelModel";
import DbRepository from './DbRepository';
import { DatabaseProvider } from "../DatabaseProvider";

@Service()
class PermissionSetRepository extends DbRepository {

    constructor(
        @Inject()
        dbProvider: DatabaseProvider
    ){
        super(dbProvider);
        this.readyOn(this.initAsync);
    }

    private initAsync = async () => {
        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS permissionSets (
                guild_id TEXT NOT NULL,
                permissionSet_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS permissionSetRoles (
                guild_id TEXT NOT NULL,
                permissionSet_id INTEGER NOT NULL,
                role_id TEXT NOT NULL,
                allow INTEGER DEFAULT 0 NOT NULL,
                PRIMARY KEY(permissionSet_id, role_id)
            );

            CREATE TABLE IF NOT EXISTS permissionSetUsers (
                guild_id TEXT NOT NULL,
                permissionSet_id INTEGER NOT NULL,
                user_id TEXT NOT NULL,
                allow INTEGER DEFAULT 0 NOT NULL,
                PRIMARY KEY(permissionSet_id, user_id)
            );

            CREATE TABLE IF NOT EXISTS permissionSetChannels (
                guild_id TEXT NOT NULL,
                permissionSet_id INTEGER NOT NULL,
                channel_id TEXT NOT NULL,
                allowedUsage INTEGER DEFAULT 0 NOT NULL,
                redirectChannelId TEXT,
                PRIMARY KEY(permissionSet_id, channel_id)
            );
        `);
    }

    insert = async (guild_id: string, name: string) : Promise<number|undefined> => {
        var result = await this.db.run(
            'INSERT OR IGNORE INTO permissionSets (guild_id, name) VALUES (?, ?);', 
            guild_id, 
            name
        );
        return result.lastID
    }

    select = async(guild_id: string, permissionSet_id: number) => await this.db.get<PermissionSetModel>('SELECT * FROM permissionSets WHERE guild_id = ? AND permissionSet_id = ?;', guild_id, permissionSet_id);
    selectAll = async(guild_id: string) => await this.db.all<PermissionSetModel[]>('SELECT * FROM permissionSets WHERE guild_id = ?;', guild_id);
    selectRoles = async(guild_id: string, permissionSet_id: number) => await this.db.all<PermissionSetRoleModel[]>('SELECT * FROM permissionSetRoles WHERE guild_id = ? AND permissionSet_id = ?;', guild_id, permissionSet_id);
    selectUsers = async(guild_id: string, permissionSet_id: number) => await this.db.all<PermissionSetUserModel[]>('SELECT * FROM permissionSetUsers WHERE guild_id = ? AND permissionSet_id = ?;', guild_id, permissionSet_id);
    selectChannels = async(guild_id: string, permissionSet_id: number) => await this.db.all<PermissionSetChannelModel[]>('SELECT * FROM permissionSetChannels WHERE guild_id = ? AND permissionSet_id = ?;', guild_id, permissionSet_id);

    updateName = async (guild_id: string, permissionSet_id: number, name: string) => await this.db.run(
        'UPDATE permissionSets SET name = ? WHERE guild_id = ? AND permissionSet_id = ?;',
        name,
        guild_id, 
        permissionSet_id
    );

    setRoleAccess = async(roleModel: PermissionSetRoleModel) => await this.db.run('INSERT OR REPLACE INTO permissionSetRoles (guild_id, permissionSet_id, role_id, allow) VALUES (?, ?, ?, ?)',roleModel.guild_id, roleModel.permissionSet_id, roleModel.role_id, roleModel.allow);
    setUserAccess = async(userModel: PermissionSetUserModel) => await this.db.run('INSERT OR REPLACE INTO permissionSetUsers (guild_id, permissionSet_id, user_id, allow) VALUES (?, ?, ?, ?)',userModel.guild_id, userModel.permissionSet_id, userModel.user_id, userModel.allow);
    setChannelAccess = async(channelModel: PermissionSetChannelModel) => await this.db.run('INSERT OR REPLACE INTO permissionSetChannels (guild_id, permissionSet_id, channel_id, allowedUsage, redirectChannelId) VALUES (?, ?, ?, ?, ?)',channelModel.guild_id, channelModel.permissionSet_id, channelModel.channel_id, channelModel.allowedUsage, channelModel.redirectChannelId);
    redirectChannel = async(guild_id: string, permissionSet_id: number, channel_id: string, redirectChannelId: string|null) => await this.db.run('UPDATE permissionSetChannels SET redirectChannelId = ? WHERE guild_id = ? AND permissionSet_id = ? AND channel_id = ?', redirectChannelId, guild_id, permissionSet_id, channel_id);

    delete = async(guild_id: string, permissionSet_id: number) => {
        const locator = { ':guildid': guild_id, ':permissionSet_id': permissionSet_id};
        await this.db.run(`DELETE FROM permissionSetRoles WHERE guild_id = :guildid AND permissionset_id = :permissionSet_id;`, locator);
        await this.db.run(`DELETE FROM permissionSetUsers WHERE guild_id = :guildid AND permissionset_id = :permissionSet_id;`, locator);
        await this.db.run(`DELETE FROM permissionSetChannels WHERE guild_id = :guildid AND permissionset_id = :permissionSet_id;`, locator);
        await this.db.run(`DELETE FROM permissionSets WHERE guild_id = :guildid AND set_id = :permissionSet_id;`, locator);
    };
    deleteRoleAccess = async(guild_id: string, permissionSet_id: number, role_id: string) => await this.db.run('DELETE FROM permissionSetRoles WHERE guild_id = ? AND permissionSet_id = ? AND role_id = ?;', guild_id, permissionSet_id, role_id);
    deleteUserAccess = async(guild_id: string, permissionSet_id: number, user_id: string) => await this.db.run('DELETE FROM permissionSetUsers WHERE guild_id = ? AND permissionSet_id = ? AND user_id = ?;', guild_id, permissionSet_id, user_id);
    deleteChannelAccess = async(guild_id: string, permissionSet_id: number, channel_id: string) => await this.db.run('DELETE FROM permissionSetChannels WHERE guild_id = ? AND permissionSet_id = ? AND channel_id = ?;', guild_id, permissionSet_id, channel_id);
    deleteGuild = async(guild_id: string) => {
        const locator = { ':guildid': guild_id };
        await this.db.run('DELETE FROM permissionSetRoles WHERE guild_id = :guildid;', locator);
        await this.db.run('DELETE FROM permissionSetUsers WHERE guild_id = :guildid;', locator);
        await this.db.run('DELETE FROM permissionSetChannels WHERE guild_id = :guildid;', locator);
        await this.db.run('DELETE FROM permissionSets WHERE guild_id = :guildid;', locator);
    }
};

export default PermissionSetRepository;
