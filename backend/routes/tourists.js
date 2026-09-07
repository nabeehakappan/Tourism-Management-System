const express = require('express');
const connectToDatabase = require('../db');

const router = express.Router();


// GET ALL TOURISTS
router.get('/', async (req, res) => {
    let connection;

    try {
        connection = await connectToDatabase();

        const result = await connection.execute(
            `SELECT * FROM TOURIST`
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to fetch tourists',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


// GET TOURIST BY ID
router.get('/:id', async (req, res) => {
    let connection;

    try {
        connection = await connectToDatabase();

        const result = await connection.execute(
            `SELECT * FROM TOURIST
             WHERE Tourist_ID = :id`,
            {
                id: req.params.id
            }
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Tourist not found'
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to fetch tourist',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


// CREATE TOURIST
router.post('/', async (req, res) => {
    let connection;

    try {
        const {
            touristId,
            firstName,
            middleName,
            lastName,
            gender,
            dateOfBirth,
            nationality,
            email,
            street,
            city,
            state,
            pin,
            guideId
        } = req.body;

        connection = await connectToDatabase();

        await connection.execute(
            `INSERT INTO TOURIST (
                Tourist_ID,
                First_Name,
                Middle_Name,
                Last_Name,
                Gender,
                Date_of_Birth,
                Nationality,
                Email,
                Street,
                City,
                State,
                PIN,
                Guide_ID
            )
            VALUES (
                :touristId,
                :firstName,
                :middleName,
                :lastName,
                :gender,
                TO_DATE(:dateOfBirth, 'YYYY-MM-DD'),
                :nationality,
                :email,
                :street,
                :city,
                :state,
                :pin,
                :guideId
            )`,
            {
                touristId,
                firstName,
                middleName,
                lastName,
                gender,
                dateOfBirth,
                nationality,
                email,
                street,
                city,
                state,
                pin,
                guideId
            },
            {
                autoCommit: true
            }
        );

        res.status(201).json({
            message: 'Tourist added successfully!',
            touristId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to add tourist',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


// UPDATE TOURIST
router.put('/:id', async (req, res) => {
    let connection;

    try {
        const {
            firstName,
            middleName,
            lastName,
            gender,
            dateOfBirth,
            nationality,
            email,
            street,
            city,
            state,
            pin,
            guideId
        } = req.body;

        connection = await connectToDatabase();

        const result = await connection.execute(
            `UPDATE TOURIST
             SET First_Name = :firstName,
                 Middle_Name = :middleName,
                 Last_Name = :lastName,
                 Gender = :gender,
                 Date_of_Birth = TO_DATE(:dateOfBirth, 'YYYY-MM-DD'),
                 Nationality = :nationality,
                 Email = :email,
                 Street = :street,
                 City = :city,
                 State = :state,
                 PIN = :pin,
                 Guide_ID = :guideId
             WHERE Tourist_ID = :id`,
            {
                firstName,
                middleName,
                lastName,
                gender,
                dateOfBirth,
                nationality,
                email,
                street,
                city,
                state,
                pin,
                guideId,
                id: req.params.id
            },
            {
                autoCommit: true
            }
        );

        if (result.rowsAffected === 0) {
            return res.status(404).json({
                message: 'Tourist not found'
            });
        }

        res.json({
            message: 'Tourist updated successfully!',
            touristId: req.params.id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to update tourist',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


// DELETE TOURIST
router.delete('/:id', async (req, res) => {
    let connection;

    try {
        connection = await connectToDatabase();

        const result = await connection.execute(
            `DELETE FROM TOURIST
             WHERE Tourist_ID = :id`,
            {
                id: req.params.id
            },
            {
                autoCommit: true
            }
        );

        if (result.rowsAffected === 0) {
            return res.status(404).json({
                message: 'Tourist not found'
            });
        }

        res.json({
            message: 'Tourist deleted successfully!',
            touristId: req.params.id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to delete tourist',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


// GET TOURIST PHONES
router.get('/:id/phones', async (req, res) => {
    let connection;

    try {
        connection = await connectToDatabase();

        const result = await connection.execute(
            `SELECT * FROM TOURIST_PHONE
             WHERE Tourist_ID = :id`,
            {
                id: req.params.id
            }
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to fetch phone numbers',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


// ADD TOURIST PHONE
router.post('/:id/phones', async (req, res) => {
    let connection;

    try {
        const { phoneNo } = req.body;

        connection = await connectToDatabase();

        await connection.execute(
            `INSERT INTO TOURIST_PHONE
             (Tourist_ID, Phone_No)
             VALUES (:id, :phoneNo)`,
            {
                id: req.params.id,
                phoneNo
            },
            {
                autoCommit: true
            }
        );

        res.status(201).json({
            message: 'Phone number added successfully!'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to add phone number',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


// DELETE TOURIST PHONE
router.delete('/:id/phones/:phone', async (req, res) => {
    let connection;

    try {
        connection = await connectToDatabase();

        const result = await connection.execute(
            `DELETE FROM TOURIST_PHONE
             WHERE Tourist_ID = :id
             AND Phone_No = :phone`,
            {
                id: req.params.id,
                phone: req.params.phone
            },
            {
                autoCommit: true
            }
        );

        if (result.rowsAffected === 0) {
            return res.status(404).json({
                message: 'Phone number not found'
            });
        }

        res.json({
            message: 'Phone number deleted successfully!'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to delete phone number',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


module.exports = router;