const express = require('express');
const connectToDatabase = require('../db');

const router = express.Router();


// GET ALL PACKAGES
router.get('/', async (req, res) => {
    let connection;

    try {
        connection = await connectToDatabase();

        const result = await connection.execute(
            `SELECT * FROM TOUR_PACKAGE`
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to fetch packages',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


// GET PACKAGE BY ID
router.get('/:id', async (req, res) => {
    let connection;

    try {
        connection = await connectToDatabase();

        const result = await connection.execute(
            `SELECT * FROM TOUR_PACKAGE
             WHERE Package_ID = :id`,
            {
                id: req.params.id
            }
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Package not found'
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to fetch package',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


// CREATE PACKAGE
router.post('/', async (req, res) => {
    let connection;

    try {
        const {
            packageId,
            packageName,
            destinationCity,
            destinationState,
            destinationCountry,
            duration,
            price,
            packageType,
            guideId
        } = req.body;

        connection = await connectToDatabase();

        await connection.execute(
            `INSERT INTO TOUR_PACKAGE (
                Package_ID,
                Package_Name,
                Destination_City,
                Destination_State,
                Destination_Country,
                Duration,
                Price,
                Package_Type,
                Guide_ID
            )
            VALUES (
                :packageId,
                :packageName,
                :destinationCity,
                :destinationState,
                :destinationCountry,
                :duration,
                :price,
                :packageType,
                :guideId
            )`,
            {
                packageId,
                packageName,
                destinationCity,
                destinationState,
                destinationCountry,
                duration,
                price,
                packageType,
                guideId
            },
            {
                autoCommit: true
            }
        );

        res.status(201).json({
            message: 'Package added successfully!',
            packageId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to add package',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


// UPDATE PACKAGE
router.put('/:id', async (req, res) => {
    let connection;

    try {
        const {
            packageName,
            destinationCity,
            destinationState,
            destinationCountry,
            duration,
            price,
            packageType,
            guideId
        } = req.body;

        connection = await connectToDatabase();

        const result = await connection.execute(
            `UPDATE TOUR_PACKAGE
             SET Package_Name = :packageName,
                 Destination_City = :destinationCity,
                 Destination_State = :destinationState,
                 Destination_Country = :destinationCountry,
                 Duration = :duration,
                 Price = :price,
                 Package_Type = :packageType,
                 Guide_ID = :guideId
             WHERE Package_ID = :id`,
            {
                packageName,
                destinationCity,
                destinationState,
                destinationCountry,
                duration,
                price,
                packageType,
                guideId,
                id: req.params.id
            },
            {
                autoCommit: true
            }
        );

        if (result.rowsAffected === 0) {
            return res.status(404).json({
                message: 'Package not found'
            });
        }

        res.json({
            message: 'Package updated successfully!'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to update package',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


// DELETE PACKAGE
router.delete('/:id', async (req, res) => {
    let connection;

    try {
        connection = await connectToDatabase();

        const result = await connection.execute(
            `DELETE FROM TOUR_PACKAGE
             WHERE Package_ID = :id`,
            {
                id: req.params.id
            },
            {
                autoCommit: true
            }
        );

        if (result.rowsAffected === 0) {
            return res.status(404).json({
                message: 'Package not found'
            });
        }

        res.json({
            message: 'Package deleted successfully!'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to delete package',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


// GET PACKAGE HIGHLIGHTS
router.get('/:id/highlights', async (req, res) => {
    let connection;

    try {
        connection = await connectToDatabase();

        const result = await connection.execute(
            `SELECT * FROM PACKAGE_HIGHLIGHT
             WHERE Package_ID = :id`,
            {
                id: req.params.id
            }
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to fetch highlights',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


// ADD HIGHLIGHT
router.post('/:id/highlights', async (req, res) => {
    let connection;

    try {
        const { highlight } = req.body;

        connection = await connectToDatabase();

        await connection.execute(
            `INSERT INTO PACKAGE_HIGHLIGHT
             (Package_ID, Highlight)
             VALUES (:id, :highlight)`,
            {
                id: req.params.id,
                highlight
            },
            {
                autoCommit: true
            }
        );

        res.status(201).json({
            message: 'Highlight added successfully!'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to add highlight',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


// DELETE HIGHLIGHT
router.delete('/:id/highlights/:highlight', async (req, res) => {
    let connection;

    try {
        connection = await connectToDatabase();

        const result = await connection.execute(
            `DELETE FROM PACKAGE_HIGHLIGHT
             WHERE Package_ID = :id
             AND Highlight = :highlight`,
            {
                id: req.params.id,
                highlight: req.params.highlight
            },
            {
                autoCommit: true
            }
        );

        if (result.rowsAffected === 0) {
            return res.status(404).json({
                message: 'Highlight not found'
            });
        }

        res.json({
            message: 'Highlight deleted successfully!'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to delete highlight',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


module.exports = router;