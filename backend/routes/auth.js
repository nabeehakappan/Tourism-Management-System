const express = require('express');
const router = express.Router();
const connectToDatabase = require('../db');


// ============================================================
// LOGIN
// POST /api/auth/login
// ============================================================

router.post('/login', async (req, res) => {
    let connection;

    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: 'Username and password are required.'
            });
        }

        connection = await connectToDatabase();

        const result = await connection.execute(
            `
            SELECT
                User_ID,
                Username,
                User_Role,
                Tourist_ID
            FROM USER_ACCOUNT
            WHERE Username = :username
            AND User_Password = :password
            `,
            {
                username,
                password
            },
            {
                outFormat: require('oracledb').OUT_FORMAT_OBJECT
            }
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: 'Invalid username or password.'
            });
        }

        const user = result.rows[0];

        res.json({
            message: 'Login successful.',
            user: {
                id: user.USER_ID,
                username: user.USERNAME,
                role: user.USER_ROLE,
                touristId: user.TOURIST_ID
            }
        });

    } catch (error) {
        console.error('Login error:', error);

        res.status(500).json({
            message: 'Server error during login.'
        });

    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.error('Error closing connection:', error);
            }
        }
    }
});

module.exports = router;

