const express = require('express');
const connectToDatabase = require('../db');

const router = express.Router();


// GET ALL GUIDES
router.get('/', async (req, res) => {
    let connection;

    try {
        connection = await connectToDatabase();

        const result = await connection.execute(
            `SELECT * FROM GUIDE`
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to fetch guides',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


// GET GUIDE BY ID
router.get('/:id', async (req, res) => {
    let connection;

    try {
        connection = await connectToDatabase();

        const result = await connection.execute(
            `SELECT * FROM GUIDE
             WHERE Guide_ID = :id`,
            {
                id: req.params.id
            }
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Guide not found'
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to fetch guide',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


// CREATE GUIDE
router.post('/', async (req, res) => {
    let connection;

    try {
        const {
            guideId,
            firstName,
            lastName,
            phoneNo,
            email,
            experienceYears
        } = req.body;

        connection = await connectToDatabase();

        await connection.execute(
            `INSERT INTO GUIDE (
                Guide_ID,
                First_Name,
                Last_Name,
                Phone_No,
                Email,
                Experience_Years
            )
            VALUES (
                :guideId,
                :firstName,
                :lastName,
                :phoneNo,
                :email,
                :experienceYears
            )`,
            {
                guideId,
                firstName,
                lastName,
                phoneNo,
                email,
                experienceYears
            },
            {
                autoCommit: true
            }
        );

        res.status(201).json({
            message: 'Guide added successfully!',
            guideId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to add guide',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


// UPDATE GUIDE
router.put('/:id', async (req, res) => {
    let connection;

    try {
        const {
            firstName,
            lastName,
            phoneNo,
            email,
            experienceYears
        } = req.body;

        connection = await connectToDatabase();

        const result = await connection.execute(
            `UPDATE GUIDE
             SET First_Name = :firstName,
                 Last_Name = :lastName,
                 Phone_No = :phoneNo,
                 Email = :email,
                 Experience_Years = :experienceYears
             WHERE Guide_ID = :id`,
            {
                firstName,
                lastName,
                phoneNo,
                email,
                experienceYears,
                id: req.params.id
            },
            {
                autoCommit: true
            }
        );

        if (result.rowsAffected === 0) {
            return res.status(404).json({
                message: 'Guide not found'
            });
        }

        res.json({
            message: 'Guide updated successfully!'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to update guide',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


// DELETE GUIDE
router.delete('/:id', async (req, res) => {
    let connection;

    try {
        connection = await connectToDatabase();

        const result = await connection.execute(
            `DELETE FROM GUIDE
             WHERE Guide_ID = :id`,
            {
                id: req.params.id
            },
            {
                autoCommit: true
            }
        );

        if (result.rowsAffected === 0) {
            return res.status(404).json({
                message: 'Guide not found'
            });
        }

        res.json({
            message: 'Guide deleted successfully!'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to delete guide',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


// GET GUIDE LANGUAGES
router.get('/:id/languages', async (req, res) => {
    let connection;

    try {
        connection = await connectToDatabase();

        const result = await connection.execute(
            `SELECT * FROM GUIDE_LANGUAGE
             WHERE Guide_ID = :id`,
            {
                id: req.params.id
            }
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to fetch languages',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


// ADD LANGUAGE
router.post('/:id/languages', async (req, res) => {
    let connection;

    try {
        const { language } = req.body;

        connection = await connectToDatabase();

        await connection.execute(
            `INSERT INTO GUIDE_LANGUAGE
             (Guide_ID, Language_Known)
             VALUES (:id, :language)`,
            {
                id: req.params.id,
                language
            },
            {
                autoCommit: true
            }
        );

        res.status(201).json({
            message: 'Language added successfully!'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to add language',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


// DELETE LANGUAGE
router.delete('/:id/languages/:language', async (req, res) => {
    let connection;

    try {
        connection = await connectToDatabase();

        const result = await connection.execute(
            `DELETE FROM GUIDE_LANGUAGE
             WHERE Guide_ID = :id
             AND Language_Known = :language`,
            {
                id: req.params.id,
                language: req.params.language
            },
            {
                autoCommit: true
            }
        );

        if (result.rowsAffected === 0) {
            return res.status(404).json({
                message: 'Language not found'
            });
        }

        res.json({
            message: 'Language deleted successfully!'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to delete language',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


module.exports = router;