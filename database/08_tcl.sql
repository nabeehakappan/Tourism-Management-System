-- ============================================================
-- TRAVELIA - TOURISM MANAGEMENT SYSTEM
-- 08_tcl.sql
-- Database: Oracle 11g
-- ============================================================

-- ============================================================
-- TCL = TRANSACTION CONTROL LANGUAGE
--
-- COMMIT       -> Permanently saves changes
-- ROLLBACK     -> Undoes changes
-- SAVEPOINT    -> Creates a point within a transaction
--                  to which we can roll back.
-- ============================================================


-- ============================================================
-- STEP 1: UPDATE A BOOKING
-- ============================================================

UPDATE BOOKING
SET Total_Amount = Total_Amount + 100
WHERE Booking_ID = (
    SELECT MIN(Booking_ID)
    FROM BOOKING
);

-- The change currently exists only in the transaction.
-- It has NOT been permanently saved yet.


-- ============================================================
-- STEP 2: CREATE A SAVEPOINT
-- ============================================================

SAVEPOINT before_second_update;


-- ============================================================
-- STEP 3: MAKE ANOTHER CHANGE
-- ============================================================

UPDATE BOOKING
SET Total_Amount = Total_Amount + 200
WHERE Booking_ID = (
    SELECT MIN(Booking_ID)
    FROM BOOKING
);


-- ============================================================
-- STEP 4: ROLLBACK TO SAVEPOINT
-- ============================================================

-- This removes ONLY the second update (+200).
-- The first update (+100) remains.

ROLLBACK TO before_second_update;


-- ============================================================
-- STEP 5: ROLLBACK THE ENTIRE TRANSACTION
-- ============================================================

-- This removes the first update (+100) as well.
-- Therefore, the database returns to its original state.

ROLLBACK;


-- ============================================================
-- STEP 6: VERIFY
-- ============================================================

SELECT
    Booking_ID,
    Total_Amount
FROM BOOKING
WHERE Booking_ID = (
    SELECT MIN(Booking_ID)
    FROM BOOKING
);


-- ============================================================
-- TCL DEMONSTRATION COMPLETE
-- ============================================================

