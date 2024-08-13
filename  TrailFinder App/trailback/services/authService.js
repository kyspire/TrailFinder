import { withOracleDB } from '../config/db.js';
import oracledb from 'oracledb';
import loadEnvFile from '../utils/envUtil.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { foreignKeyUpdates as userqueries } from "../config/db.js";

const envVariables = loadEnvFile('./.env');

// User registration
async function registerUser(name, email, password) {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `SELECT * FROM userprofile WHERE email = :email`,
                { email },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );

            if (result.rows.length > 0) {
                const user = result.rows[0];
                if (user.PASSWORD) {
                    // User already exists with password
                    return;
                } else if (password) {
                    // User exists without password, update with new password
                    await connection.execute(
                        `UPDATE userprofile SET password = :hashedPassword WHERE email = :email`,
                        { hashedPassword, email },
                        { autoCommit: true }
                    );
                    return { message: "Password added to existing account" };
                }
            } else {
                // New user, create account
                await connection.execute(
                    `INSERT INTO userprofile (userID, name, email, password)
                     VALUES (user_id_seq.NEXTVAL, :name, :email, :hashedPassword)`,
                    [name, email, hashedPassword],
                    { autoCommit: true }
                );
                return { message: "User registered successfully" };
            }
        } catch (err) {
            console.error(err.message);
        }
    });
}

// User login
async function loginUser(email, password) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT TO_CHAR(userID) AS userID, 
            name, email, password, trailshiked, experiencelevel, profilepicture, numberoffriends 
            FROM userprofile WHERE email = :email`,
            { email },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows.length > 0) {
            const user = result.rows[0];
            if (!user["PASSWORD"]) {
                return;
            }
            if (await bcrypt.compare(password, user["PASSWORD"])) {
                return jwt.sign({ userId: user["USERID"] }, envVariables["JWT_SECRET"], { expiresIn: '1h' });
            }
        }
        console.error("Invalid credentials");
    });
}

// User login with Google
async function googleLogin(token) {
    const googleResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const { email, name, sub: googleId, picture } = googleResponse.data;

    const imageBuffer = (await axios.get(picture, { responseType: 'arraybuffer' })).data;
    return await withOracleDB(async (connection) => {
        let result = await connection.execute(
            `SELECT * FROM userprofile WHERE email = :email`,
            { email },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows.length === 0) {
            // Create new user
            await connection.execute(
                `INSERT INTO userprofile (userID, name, email, profilepicture)
                 VALUES (:googleId, :name, :email, :image)`,
                { googleId, name, email, image: { val: imageBuffer, type: oracledb.BLOB } },
                { autoCommit: true }
            );
        } else {
            const user = result.rows[0];
            if (user.USERID !== googleId) {
                // Update existing user with Google ID
                await connection.execute(
                    `UPDATE userprofile SET userID = :googleId WHERE email = :email`,
                    { googleId, email },
                    { autoCommit: true }
                );
            }
        }

        return jwt.sign({ userId: googleId }, envVariables["JWT_SECRET"], { expiresIn: '1h' });
    });
}

export {
    registerUser,
    loginUser,
    googleLogin
}