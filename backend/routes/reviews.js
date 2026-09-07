const express = require('express');
const connectToDatabase = require('../db');

const router = express.Router();


// GET REVIEWS FOR A GUIDE
router.get('/:guideId', async (req, res) => {
    let connection;

    try {
        connection = await connectToDatabase();

        const result = await connection.execute(
            `SELECT *
             FROM REVIEW
             WHERE Guide_ID = :guideId`,
            {
                guideId: req.params.guideId
            }
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to fetch reviews',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


// CREATE REVIEW
router.post('/:guideId', async (req, res) => {
    let connection;

    try {
        const {
            reviewText,
            reviewDate,
            rating
        } = req.body;

        connection = await connectToDatabase();

        await connection.execute(
            `INSERT INTO REVIEW (
                Guide_ID,
                Review_Text,
                Review_Date,
                Rating
            )
            VALUES (
                :guideId,
                :reviewText,
                TO_DATE(:reviewDate, 'YYYY-MM-DD'),
                :rating
            )`,
            {
                guideId: req.params.guideId,
                reviewText,
                reviewDate,
                rating
            },
            {
                autoCommit: true
            }
        );

        res.status(201).json({
            message: 'Review added successfully!'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to add review',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


// UPDATE REVIEW
router.put('/:guideId', async (req, res) => {
    let connection;

    try {
        const {
            oldReviewText,
            oldReviewDate,
            oldRating,
            reviewText,
            reviewDate,
            rating
        } = req.body;

        connection = await connectToDatabase();

        const result = await connection.execute(
            `UPDATE REVIEW
             SET Review_Text = :reviewText,
                 Review_Date = TO_DATE(:reviewDate, 'YYYY-MM-DD'),
                 Rating = :rating
             WHERE Guide_ID = :guideId
             AND Review_Text = :oldReviewText
             AND Review_Date = TO_DATE(:oldReviewDate, 'YYYY-MM-DD')
             AND Rating = :oldRating`,
            {
                guideId: req.params.guideId,
                oldReviewText,
                oldReviewDate,
                oldRating,
                reviewText,
                reviewDate,
                rating
            },
            {
                autoCommit: true
            }
        );

        if (result.rowsAffected === 0) {
            return res.status(404).json({
                message: 'Review not found'
            });
        }

        res.json({
            message: 'Review updated successfully!'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to update review',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


// DELETE REVIEW
router.delete('/:guideId', async (req, res) => {
    let connection;

    try {
        const {
            reviewText,
            reviewDate,
            rating
        } = req.body;

        connection = await connectToDatabase();

        const result = await connection.execute(
            `DELETE FROM REVIEW
             WHERE Guide_ID = :guideId
             AND Review_Text = :reviewText
             AND Review_Date = TO_DATE(:reviewDate, 'YYYY-MM-DD')
             AND Rating = :rating`,
            {
                guideId: req.params.guideId,
                reviewText,
                reviewDate,
                rating
            },
            {
                autoCommit: true
            }
        );

        if (result.rowsAffected === 0) {
            return res.status(404).json({
                message: 'Review not found'
            });
        }

        res.json({
            message: 'Review deleted successfully!'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to delete review',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
});


module.exports = router;