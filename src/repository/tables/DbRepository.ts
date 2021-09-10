import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';
import { DatabaseProvider } from '../DatabaseProvider';

export default abstract class DbRepository {
    protected db: Database<sqlite3.Database, sqlite3.Statement>;
    private dbReady: Promise<unknown>;
    public Ready: Promise<void>;

    constructor(dbProvider: DatabaseProvider){
        this.dbReady = dbProvider.getAsync().then(x => this.db = x);
        this.Ready = Promise.resolve();
    }

    protected readyOn(initFunc: () => Promise<void>) {
        this.Ready = new Promise((resolve, reject) => {
            this.dbReady.then(
                () => {
                    initFunc().then(resolve).catch(reject);
                }
            ).catch(reject);
        });
    }
};