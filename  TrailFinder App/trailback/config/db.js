import oracledb from 'oracledb';
import loadEnvFile from '../utils/envUtil.js';
import fs from 'fs';
import {clearDB, initializeDB} from "../services/dataService.js";

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables["ORACLE_USER"],
    password: envVariables["ORACLE_PASS"],
    connectString: `${envVariables["ORACLE_HOST"]}:${envVariables["ORACLE_PORT"]}/${envVariables["ORACLE_DBNAME"]}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// Initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
        // await initializeDB();
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);

// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

export const foreignKeyUpdates = {
    disableConstraints: [
        { sql: 'ALTER TABLE equipment DISABLE CONSTRAINT equipment_userid_fk' },
        { sql: 'ALTER TABLE ugc DISABLE CONSTRAINT ugc_userid_fk' },
        { sql: 'ALTER TABLE friends DISABLE CONSTRAINT friends_userid_fk' },
        { sql: 'ALTER TABLE friends DISABLE CONSTRAINT friends_friendid_fk'},
        { sql: 'ALTER TABLE userhikestrail DISABLE CONSTRAINT userhikestrail_userid_fk' }
    ],
    updates: [
        { sql: 'UPDATE userprofile SET userid = :newUserId WHERE userid = :oldUserId' },
        { sql: 'UPDATE equipment SET userid = :newUserId WHERE userid = :oldUserId' },
        { sql: 'UPDATE ugc SET userid = :newUserId WHERE userid = :oldUserId' },
        { sql: 'UPDATE friends SET userid = :newUserId WHERE userid = :oldUserId' },
        { sql: 'UPDATE friends SET friendid = :newUserId WHERE friendid = :oldUserId' },
        { sql: 'UPDATE userhikestrail SET userid = :newUserId WHERE userid = :oldUserId' }
    ],
    enableConstraints: [
        { sql: 'ALTER TABLE equipment ENABLE CONSTRAINT equipment_userid_fk' },
        { sql: 'ALTER TABLE ugc ENABLE CONSTRAINT ugc_userid_fk' },
        { sql: 'ALTER TABLE friends ENABLE CONSTRAINT friends_userid_fk' },
        { sql: 'ALTER TABLE friends ENABLE CONSTRAINT friends_friendid_fk'},
        { sql: 'ALTER TABLE userhikestrail ENABLE CONSTRAINT userhikestrail_userid_fk' }
    ]
};

export {
    initializeConnectionPool,
    closePoolAndExit,
    withOracleDB
};
