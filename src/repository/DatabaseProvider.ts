import { Service, Inject } from "typedi";
import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import { SQLITE_FILENAME } from "../config/config";

@Service()
class DatabaseProvider{
    private readonly initialized!: Promise<unknown>;
    private _db: Database<sqlite3.Database, sqlite3.Statement>;

    constructor( 
        @Inject(SQLITE_FILENAME)
        private readonly _sqliteFilename: string
    )
    {
        this.initialized = this.initializeAsync();
    }

    private initializeAsync = async() => {
        this._db = await open({
            filename: this._sqliteFilename,
            driver: sqlite3.cached.Database
        });
    }

    public getAsync = async() : Promise<Database<sqlite3.Database, sqlite3.Statement>> => {
        await this.initialized;
        return this._db;
    }
}

export { DatabaseProvider };