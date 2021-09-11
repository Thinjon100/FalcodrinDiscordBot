import { Inject, Service } from "typedi";
import RoleModel from '../models/RoleModel';
import DbRepository from './DbRepository';
import { DatabaseProvider } from "../DatabaseProvider";

@Service()
class RoleRepository extends DbRepository {

    constructor(
        @Inject()
        dbProvider: DatabaseProvider
    ){
        super(dbProvider);
        this.readyOn(this.initAsync);
    }

    private initAsync = async () => {
        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS roles (
                guild_id TEXT NOT NULL,
                role_id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                permissions INTEGER,
                color INTEGER DEFAULT 0 NOT NULL,
                hoist INTEGER DEFAULT 0 NOT NULL,
                managed INTEGER DEFAULT 0 NOT NULL,
                mentionable INTEGER DEFAULT 0 NOT NULL,
                deleted INTEGER DEFAULT 0 NOT NULL,
                rawPosition INTEGER DEFAULT 0 NOT NULL
            );
        `);
    }

    insert = async (role: RoleModel) => await this.db.run(
        'INSERT OR REPLACE INTO roles (guild_id, role_id, name, permissions, color, hoist, managed, mentionable, deleted, rawPosition) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', 
        role.guild_id, 
        role.role_id,
        role.name,
        role.permissions,
        role.color,
        role.hoist,
        role.managed,
        role.mentionable,
        role.deleted,
        role.rawPosition
    );

    select = async(role_id: string) => await this.db.get<RoleModel>('SELECT * FROM roles WHERE role_id = ?;', role_id);
    selectAll = async(guild_id: string) => await this.db.all<RoleModel[]>('SELECT * FROM roles WHERE guild_id = ?;', guild_id);

    update = async (role: RoleModel) => await this.db.run(
        'UPDATE roles SET name = ?, permissions = ?, color = ?, hoist = ?, managed = ?, mentionable = ?, deleted = ?, rawPosition = ? WHERE guild_id = ? AND role_id = ?;',
        role.name,
        role.permissions,
        role.color,
        role.hoist,
        role.managed,
        role.mentionable,
        role.deleted,
        role.rawPosition,
        role.guild_id, 
        role.role_id
    );

    delete = async(guild_id: string, role_id: string) => await this.db.run('DELETE FROM roles WHERE guild_id = ? AND role_id = ?;', guild_id, role_id);
    deleteGuild = async(guild_id: string) => await this.db.run('DELETE FROM roles WHERE guild_id = ?;', guild_id);
};

export default RoleRepository;