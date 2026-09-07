const express = require('express');
const connectToDatabase = require('../db');

const router = express.Router();


// GET ALL BOOKINGS
router.get('/', async (req, res) => {
    let connection;

    try {
        connection = await connectToDatabase();

        const result = await connection.execute(
            `SELECT * FROM BOOKING`
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to fetch bookings',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


// GET BOOKING BY ID
router.get('/:id', async (req, res) => {
    let connection;

    try {
        connection = await connectToDatabase();

        const result = await connection.execute(
            `SELECT * FROM BOOKING
             WHERE Booking_ID = :id`,
            {
                id: req.params.id
            }
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Booking not found'
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to fetch booking',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


// CREATE BOOKING
router.post('/', async (req, res) => {
    let connection;

    try {
        const {
            bookingId,
            touristId,
            packageId,
            bookingDate,
            travelDate,
            numberOfPeople,
            paymentStatus,
            totalAmount
        } = req.body;

        connection = await connectToDatabase();

        await connection.execute(
            `INSERT INTO BOOKING (
                Booking_ID,
                Tourist_ID,
                Package_ID,
                Booking_Date,
                Travel_Date,
                Number_of_People,
                Payment_Status,
                Total_Amount
            )
            VALUES (
                :bookingId,
                :touristId,
                :packageId,
                TO_DATE(:bookingDate, 'YYYY-MM-DD'),
                TO_DATE(:travelDate, 'YYYY-MM-DD'),
                :numberOfPeople,
                :paymentStatus,
                :totalAmount
            )`,
            {
                bookingId,
                touristId,
                packageId,
                bookingDate,
                travelDate,
                numberOfPeople,
                paymentStatus,
                totalAmount
            },
            {
                autoCommit: true
            }
        );

        res.status(201).json({
            message: 'Booking added successfully!',
            bookingId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to add booking',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


// UPDATE BOOKING
router.put('/:id', async (req, res) => {
    let connection;

    try {
        const {
            touristId,
            packageId,
            bookingDate,
            travelDate,
            numberOfPeople,
            paymentStatus,
            totalAmount
        } = req.body;

        connection = await connectToDatabase();

        const result = await connection.execute(
            `UPDATE BOOKING
             SET Tourist_ID = :touristId,
                 Package_ID = :packageId,
                 Booking_Date = TO_DATE(:bookingDate, 'YYYY-MM-DD'),
                 Travel_Date = TO_DATE(:travelDate, 'YYYY-MM-DD'),
                 Number_of_People = :numberOfPeople,
                 Payment_Status = :paymentStatus,
                 Total_Amount = :totalAmount
             WHERE Booking_ID = :id`,
            {
                touristId,
                packageId,
                bookingDate,
                travelDate,
                numberOfPeople,
                paymentStatus,
                totalAmount,
                id: req.params.id
            },
            {
                autoCommit: true
            }
        );

        if (result.rowsAffected === 0) {
            return res.status(404).json({
                message: 'Booking not found'
            });
        }

        res.json({
            message: 'Booking updated successfully!'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to update booking',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


// DELETE BOOKING
router.delete('/:id', async (req, res) => {
    let connection;

    try {
        connection = await connectToDatabase();

        const result = await connection.execute(
            `DELETE FROM BOOKING
             WHERE Booking_ID = :id`,
            {
                id: req.params.id
            },
            {
                autoCommit: true
            }
        );

        if (result.rowsAffected === 0) {
            return res.status(404).json({
                message: 'Booking not found'
            });
        }

        res.json({
            message: 'Booking deleted successfully!'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to delete booking',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


// GET SPECIAL REQUESTS
router.get('/:id/requests', async (req, res) => {
    let connection;

    try {
        connection = await connectToDatabase();

        const result = await connection.execute(
            `SELECT * FROM BOOKING_SPECIAL_REQUEST
             WHERE Booking_ID = :id`,
            {
                id: req.params.id
            }
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to fetch special requests',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


// ADD SPECIAL REQUEST
router.post('/:id/requests', async (req, res) => {
    let connection;

    try {
        const { specialRequest } = req.body;

        connection = await connectToDatabase();

        await connection.execute(
            `INSERT INTO BOOKING_SPECIAL_REQUEST
             (Booking_ID, Special_Request)
             VALUES (:id, :specialRequest)`,
            {
                id: req.params.id,
                specialRequest
            },
            {
                autoCommit: true
            }
        );

        res.status(201).json({
            message: 'Special request added successfully!'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to add special request',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


// DELETE SPECIAL REQUEST
router.delete('/:id/requests/:request', async (req, res) => {
    let connection;

    try {
        connection = await connectToDatabase();

        const result = await connection.execute(
            `DELETE FROM BOOKING_SPECIAL_REQUEST
             WHERE Booking_ID = :id
             AND Special_Request = :request`,
            {
                id: req.params.id,
                request: req.params.request
            },
            {
                autoCommit: true
            }
        );

        if (result.rowsAffected === 0) {
            return res.status(404).json({
                message: 'Special request not found'
            });
        }

        res.json({
            message: 'Special request deleted successfully!'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to delete special request',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


module.exports = router;