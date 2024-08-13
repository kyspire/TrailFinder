import { withOracleDB } from '../config/db.js';
import oracledb from 'oracledb';
import fs from 'fs';

async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

// Run SQL file to create and populate tables
async function initializeDB() {
    try {
        const script = fs.readFileSync('./config/database.sql', 'utf-8');
        const statements = script.split(';').filter(statement => statement.trim());
        return await withOracleDB(async (connection) => {
            for (const statement of statements) {
                try {
                    await connection.execute(statement);
                } catch (err) {
                    console.log('Failed to run statement:', statement);
                }
            }
            console.log("Database.sql successfully initialized. ");
            return true;
        }).catch(() => {
            return false;
        })
    } catch (err) {
        console.log(`Failed to read or process SQL script: ${err}`);
    }
}

// Run SQL file to clear tables
async function clearDB() {
    try {
        const script = fs.readFileSync('./config/clear.sql', 'utf-8');
        const statements = script.split(';').filter(statement => statement.trim());
        return await withOracleDB(async (connection) => {
            for (const statement of statements) {
                try {
                    await connection.execute(statement);
                } catch (err) {
                    console.error('Failed to run statement:', statement);
                }
            }
            return true;
        }).catch(() => {
            return false;
        })
    } catch (err) {
        console.log('Failed to read or process SQL script');
    }
}

// Fetch table
async function fetchDB(relations, attributes, predicates) {
    return await withOracleDB(async (connection) => {
        const attributesStr = Array.isArray(attributes) ? attributes.join(', ') : attributes;
        const relationsStr = Array.isArray(relations) ? relations.join(', ') : relations;
        const predicatesStr = Array.isArray(predicates) ? predicates.join(' AND ') : predicates;
        const result = await connection.execute(
            `SELECT ${attributesStr} FROM ${relationsStr} WHERE ${predicatesStr}`,
            [],
            { autoCommit: true }
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

// Insert data into table
async function insertDB(relation, data) {
    return await withOracleDB(async (connection) => {
        const placeholders = data.map((_, index) => `:${index + 1}`).join(', ');
        const result = await connection.execute(
            `INSERT INTO ${relation} VALUES (${placeholders})`,
            data,
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// Delete data in table
async function deleteDB(relation, predicates) {
    return await withOracleDB(async (connection) => {
        const predicatesStr = Array.isArray(predicates) ? predicates.join(' AND ') : predicates;
        const result = await connection.execute(
            `DELETE FROM ${relation} WHERE ${predicatesStr}`,
            [],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// Count data in table
async function countDB(relation) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT COUNT (*) FROM ${relation}`);
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

// Get all trail information
async function getTrails() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT locationname, latitude, longitude, trailname,
                    EXTRACT(HOUR FROM timetocomplete) AS hours,
                    EXTRACT(MINUTE FROM timetocomplete) AS minutes,
                    description, hazards, difficulty
            FROM trail`,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows.length > 0) {
            return result.rows;
        } else {
            console.log("Trails not found");
            return [];
        }
    });
}

// Get specific trail information
async function getTrail(locationname, latitude, longitude, trailname) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT locationname, latitude, longitude, trailname,
                    EXTRACT(HOUR FROM timetocomplete) AS hours,
                    EXTRACT(MINUTE FROM timetocomplete) AS minutes,
                    description, hazards, difficulty
            FROM trail
            WHERE locationname = :locationname AND latitude = :latitude AND longitude = :longitude AND trailname = :trailname`,
            { locationname: locationname, latitude: latitude, longitude: longitude, trailname: trailname },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows.length > 0) {
            return result.rows;
        } else {
            console.log("Trail not found");
            return [];
        }
    });
}


function buildWhereClause(conditions) {
    let whereClause = '';
    let params = {};
    let paramIndex = 1;

    conditions.forEach((condition, index) => {
        if (condition === '&&' || condition === '||') {
            whereClause += ` ${(condition === '&&') ? "AND" : "OR"} `;
        } else {
            let { field, operator, value } = condition;
            let dbField = field;

            if (field === 'hours') {
                dbField = 'EXTRACT(HOUR FROM timetocomplete)';
            } else if (field === 'minutes') {
                dbField = 'EXTRACT(MINUTE FROM timetocomplete)';
            }

            if (operator === 'LIKE') {
                whereClause += `${dbField} LIKE :p${paramIndex}`;
                params[`p${paramIndex}`] = `%${value}%`;
            } else {
                whereClause += `${dbField} ${operator} :p${paramIndex}`;
                params[`p${paramIndex}`] = value;
            }
            paramIndex++;
        }
    });

    return { whereClause, params };
}

// Select tuples from trail with specific name
async function selectionTrails(predicates) {
    return await withOracleDB(async (connection) => {
        const {whereClause, params} = buildWhereClause(predicates);
        const result = await connection.execute(
            `SELECT locationname, latitude, longitude, trailname, difficulty,
                 EXTRACT(HOUR FROM timetocomplete) AS hours,
                 EXTRACT(MINUTE FROM timetocomplete) AS minutes,
                 description, hazards
             FROM trail
             WHERE ${whereClause}`,
            params,
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows && result.rows.length > 0) {
            return result.rows;
        } else {
            throw new Error("Trails not found");
        }
    })
}

// Get trail preview information
async function getPreviews(locationname, latitude, longitude, trailname) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT t.locationname, t.latitude, t.longitude, t.trailname,
                    EXTRACT(HOUR FROM t.timetocomplete) AS hours,
                    EXTRACT(MINUTE FROM t.timetocomplete) AS minutes,
                    t.description, t.hazards, t.difficulty,
                    pa.previewid, pa.image
            FROM trail t
            JOIN preview2 pb ON t.locationname = pb.locationname AND t.latitude = pb.latitude AND t.longitude = pb.longitude AND t.trailname = pb.trailname
            JOIN preview1 pa ON pa.previewid = pb.previewid
            WHERE t.locationname = :locationname AND t.latitude = :latitude AND t.longitude = :longitude AND t.trailname = :trailname`,
            { locationname: locationname, latitude: latitude, longitude: longitude, trailname: trailname },
            { outFormat: oracledb.OUT_FORMAT_OBJECT, fetchInfo: { "IMAGE": { type: oracledb.BUFFER } } }
        );

        if (result.rows.length > 0) {
            return result.rows;
        } else {
            console.log("Previews not found");
            return [];
        }
    });
}

// Get transportation to location information
async function getTransportationToLocation(locationname, latitude, longitude) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT t.transportid, t.type, t.transportcost,
                    l.locationname, l.latitude, l.longitude, l.weather,
                    TO_CHAR(ttl.duration, 'DD HH24:MI:SS') AS duration, ttl.tripcost
            FROM transportation t
            JOIN transportationtolocation ttl ON t.transportid = ttl.transportid
            JOIN location l ON l.locationname = ttl.locationname
            WHERE l.locationname = :locationname AND l.latitude = :latitude AND l.longitude = :longitude`,
            { locationname: locationname, latitude: latitude, longitude: longitude },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows.length > 0) {
            return result.rows;
        } else {
            console.log("Transportation not found");
            return [];
        }
    });
}

// Get gear information
async function getRetailerGear(locationname, latitude, longitude, trailname) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT *
            FROM gear g
            JOIN retailerfeaturesgear rfg ON g.gearname = rfg.gearname
            JOIN retailer2 rb ON rb.retailerid = rfg.retailerid
            JOIN retailer1 ra ON ra.retailername = rb.retailername
            WHERE g.locationname = :locationname AND g.latitude = :latitude AND g.longitude = :longitude AND g.trailname = :trailname`,
            { locationname: locationname, latitude: latitude, longitude: longitude, trailname: trailname },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows.length > 0) {
            return result.rows;
        } else {
            console.log("Retailer or Gear not found");
            return [];
        }
    });
}

// Get user-generated content information
async function getUGC(locationname, latitude, longitude, trailname) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT *
            FROM ugc
            JOIN review r ON ugc.ugcid = r.ugcid
            JOIN photo p ON ugc.ugcid = p.ugcid
            JOIN userprofile u ON ugc.userid = u.userid
            WHERE ugc.locationname = :locationname AND ugc.latitude = :latitude AND ugc.longitude = :longitude AND ugc.trailname = :trailname`,
            { locationname: locationname, latitude: latitude, longitude: longitude, trailname: trailname },
            { outFormat: oracledb.OUT_FORMAT_OBJECT, fetchInfo: { "IMAGE": { type: oracledb.BUFFER }, "PROFILEPICTURE": { type: oracledb.BUFFER } } }
        );

        if (result.rows.length > 0) {
            return result.rows;
        } else {
            console.log("UGC not found");
            return [];
        }
    });
}

// Select to see what equipment people are bringing
async function selectionEquipment(whereClause) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT * 
            FROM equipment 
            WHERE :whereClause`,
            { whereClause: whereClause },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    }).catch(() => {
        return -1;
    });
}

// Get transportation information
async function getTransportation() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT *
            FROM transportation`,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows.length > 0) {
            return result.rows;
        } else {
            console.log("Transportation not found");
            return [];
        }
    });
}

// Find cheapest transport cost that costs money // group by 
async function findCheapestTransportPerType() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT type, MIN(transportcost) AS transportcost
            FROM transportation 
            WHERE transportcost > 0 GROUP BY type`,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    }).catch(() => {
        return -1; 
    })
}

// Get equipment information
async function getEquipment() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT *
            FROM equipment`,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows.length > 0) {
            return result.rows;
        } else {
            console.log("Equipment not found");
            return [];
        }
    });
}

// Find heaviest equipment for each type // group by
async function findHeaviestEquipmentType() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT type, MAX(weight) AS weight
            FROM equipment 
            WHERE weight > 1 
            GROUP BY type
            HAVING COUNT(*) > 1`,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    }).catch(() => {
        return -1; 
    })
}

// Find users without equipment
async function findUsersWithoutEquipment() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT userprofile.name, userprofile.email 
            FROM userprofile MINUS (SELECT DISTINCT userprofile.name, userprofile.email 
                                    FROM userprofile, equipment 
                                    WHERE userprofile.userid = equipment.userid)`);
        return result.rows;
    }).catch(() => {
        return -1; 
    })
}

//Get all Tables
async function getAllTables() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT table_name FROM user_tables`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows.map(row => row.TABLE_NAME);
    }).catch(() => {
        return -1;
    });
}

//Get all table attributes
async function getTableAttributes(tableName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT column_name FROM user_tab_columns WHERE table_name = :tableName`,
            { tableName: tableName.toUpperCase() },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows.map(row => row.COLUMN_NAME);
    }).catch(() => {
        return -1;
    });
}

// Project arbitrary tables and attributes
async function projectAttributesAndTables(table, attributes) {
    return await withOracleDB(async (connection) => {
        const attributeString = attributes.join(', ');
        const modifiedAttributeString = attributeString
            .replace("TIMETOCOMPLETE", "TO_CHAR(TIMETOCOMPLETE, 'DD HH24:MI:SS') AS TIMETOCOMPLETE")
            .replace("DURATION", "TO_CHAR(DURATION, 'DD HH24:MI:SS') AS DURATION");
        const result = await connection.execute(
            `SELECT ${modifiedAttributeString} FROM ${table}`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT,
                fetchInfo: { "IMAGE": { type: oracledb.BUFFER }, "PROFILEPICTURE": { type: oracledb.BUFFER } } }
        );
        return result.rows;
    }).catch(() => {
        return -1;
    });
}


// Nested aggregation 
async function findMaxTransportCostBelowAverageCost() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT type, MAX(transportcost) AS transportcost
            FROM transportation 
            WHERE transportcost < (SELECT AVG(transportcost) AS transportcost
                                    FROM transportation 
                                    WHERE transportcost > 0) 
                                    GROUP BY type`,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    }).catch(() => {
        return -1; 
    })
}

async function divideForUserAtEveryLocation() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT DISTINCT ua.userid 
            FROM userhikestrail ua 
            WHERE NOT EXISTS 
                (SELECT t.locationname 
                FROM trail t 
                WHERE NOT EXISTS 
                    (SELECT ub.locationname 
                    FROM userhikestrail ub 
                    WHERE ub.userid = ua.userid AND ub.locationname = t.locationname))`,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows && result.rows.length > 0) {
            return result.rows[0]["USERID"];
        } else {
            return -1;
        }
    }).catch(() => {
        return -1; 
    })
}

export {
    testOracleConnection,
    initializeDB,
    clearDB,
    fetchDB,
    insertDB,
    deleteDB,
    countDB,
    getTrails,
    getTrail,
    selectionTrails,
    getPreviews,
    getTransportationToLocation,
    getRetailerGear,
    getUGC,
    selectionEquipment,
    getTransportation,
    findCheapestTransportPerType,
    getEquipment,
    findHeaviestEquipmentType,
    findUsersWithoutEquipment,
    getAllTables,
    getTableAttributes,
    projectAttributesAndTables,
    findMaxTransportCostBelowAverageCost, 
    divideForUserAtEveryLocation
};