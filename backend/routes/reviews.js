const express = require("express");

const connectToDatabase = require("../db");

const router = express.Router();

/*
 * Convert any incoming date value to YYYY-MM-DD.
 *
 * Handles:
 * - "2026-09-08"
 * - "2026-09-08T00:00:00.000Z"
 * - JavaScript Date objects
 */
function normalizeDate(dateValue) {
    if (!dateValue) return null;

    // If Oracle/node-oracledb gives us a JavaScript Date object
    if (dateValue instanceof Date) {
        const year = dateValue.getFullYear();
        const month = String(dateValue.getMonth() + 1).padStart(2, "0");
        const day = String(dateValue.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    const value = String(dateValue).trim();

    // Already YYYY-MM-DD or ISO format
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
        return value.substring(0, 10);
    }

    // Try parsing other date formats
    const parsedDate = new Date(value);

    if (!isNaN(parsedDate.getTime())) {
        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
        const day = String(parsedDate.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    return null;
}


/* =========================================================
   GET REVIEWS FOR A GUIDE
   GET /api/reviews/:guideId
   ========================================================= */

router.get("/:guideId", async (req, res) => {
    let connection;

    try {
        connection = await connectToDatabase();

        const result = await connection.execute(
            `
            SELECT ROWIDTOCHAR(ROWID) AS REVIEW_ROWID,
                   Guide_ID,
                   Review_Text,
                   Review_Date,
                   Rating
            FROM REVIEW
            WHERE Guide_ID = :guideId
            ORDER BY Review_Date DESC
            `,
            {
                guideId: Number(req.params.guideId)
            }
        );

        res.json(result.rows);

    } catch (error) {
        console.error("GET REVIEWS ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch reviews",
            error: error.message
        });

    } finally {
        if (connection) {
            await connection.close();
        }
    }
});


/* =========================================================
   CREATE REVIEW
   POST /api/reviews/:guideId
   ========================================================= */

router.post("/:guideId", async (req, res) => {
    let connection;

    try {
        const {
            reviewText,
            reviewDate,
            rating
        } = req.body;

        const guideId = Number(req.params.guideId);
        const normalizedDate = normalizeDate(reviewDate);
        const numericRating = Number(rating);

        // Basic validation
        if (
            !guideId ||
            !reviewText ||
            !normalizedDate ||
            !numericRating
        ) {
            return res.status(400).json({
                message:
                    "Guide ID, review text, review date and rating are required"
            });
        }

        if (numericRating < 1 || numericRating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            });
        }

        connection = await connectToDatabase();

        await connection.execute(
            `
            INSERT INTO REVIEW (
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
            )
            `,
            {
                guideId,
                reviewText,
                reviewDate: normalizedDate,
                rating: numericRating
            },
            {
                autoCommit: true
            }
        );

        res.status(201).json({
            message: "Review added successfully!"
        });

    } catch (error) {
        console.error("CREATE REVIEW ERROR:", error);

        res.status(500).json({
            message: "Failed to add review",
            error: error.message
        });

    } finally {
        if (connection) {
            await connection.close();
        }
    }
});


/* =========================================================
   UPDATE REVIEW
   PUT /api/reviews/:guideId
   ========================================================= */

router.put("/:guideId", async (req, res) => {
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

        const guideId = Number(req.params.guideId);

        const oldDate = normalizeDate(oldReviewDate);
        const newDate = normalizeDate(reviewDate);

        const numericOldRating = Number(oldRating);
        const numericNewRating = Number(rating);

        if (
            !guideId ||
            !oldReviewText ||
            !oldDate ||
            !numericOldRating ||
            !reviewText ||
            !newDate ||
            !numericNewRating
        ) {
            return res.status(400).json({
                message: "All review fields are required"
            });
        }

        if (
            numericNewRating < 1 ||
            numericNewRating > 5
        ) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            });
        }

        connection = await connectToDatabase();

        const result = await connection.execute(
            `
            UPDATE REVIEW
            SET Review_Text = :reviewText,
                Review_Date = TO_DATE(:reviewDate, 'YYYY-MM-DD'),
                Rating = :rating
            WHERE Guide_ID = :guideId
              AND Review_Text = :oldReviewText
              AND TO_CHAR(Review_Date, 'YYYY-MM-DD') = :oldReviewDate
              AND Rating = :oldRating
            `,
            {
                guideId,
                oldReviewText,
                oldReviewDate: oldDate,
                oldRating: numericOldRating,
                reviewText,
                reviewDate: newDate,
                rating: numericNewRating
            },
            {
                autoCommit: true
            }
        );

        if (result.rowsAffected === 0) {
            return res.status(404).json({
                message: "Review not found"
            });
        }

        res.json({
            message: "Review updated successfully!"
        });

    } catch (error) {
        console.error("UPDATE REVIEW ERROR:", error);

        res.status(500).json({
            message: "Failed to update review",
            error: error.message
        });

    } finally {
        if (connection) {
            await connection.close();
        }
    }
});


/* =========================================================
   DELETE REVIEW
   DELETE /api/reviews/:guideId
   ========================================================= */

router.delete("/:guideId", async (req, res) => {
    let connection;

    try {
        const { reviewRowId } = req.body;

        const guideId = Number(req.params.guideId);

        console.log("DELETE REVIEW REQUEST:", {
            guideId,
            reviewRowId
        });

        if (!reviewRowId) {
            return res.status(400).json({
                message: "Review row ID is required"
            });
        }

        if (!guideId) {
            return res.status(400).json({
                message: "Guide ID is required"
            });
        }

        connection = await connectToDatabase();

        const result = await connection.execute(
            `
            DELETE FROM REVIEW
            WHERE ROWID = CHARTOROWID(:reviewRowId)
              AND Guide_ID = :guideId
            `,
            {
                reviewRowId,
                guideId
            },
            {
                autoCommit: true
            }
        );

        console.log(
            "ROWS DELETED:",
            result.rowsAffected
        );

        if (result.rowsAffected === 0) {
            return res.status(404).json({
                message: "Review not found"
            });
        }

        res.json({
            message: "Review deleted successfully!"
        });

    } catch (error) {
        console.error(
            "DELETE REVIEW ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to delete review",
            error: error.message
        });

    } finally {
        if (connection) {
            await connection.close();
        }
    }
});


module.exports = router;