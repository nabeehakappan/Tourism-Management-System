
-- ============================================================
-- TRAVELIA - TOURISM MANAGEMENT SYSTEM
-- 09_dcl.sql
-- Database: Oracle 11g
-- ============================================================

-- ============================================================
-- DCL = DATA CONTROL LANGUAGE
--
-- GRANT  -> Gives privileges
-- REVOKE -> Removes privileges
--
-- This script demonstrates role-based access control.
-- ============================================================


-- ============================================================
-- STEP 1: CREATE A ROLE
-- ============================================================

CREATE ROLE TRAVELIA_USER;


-- ============================================================
-- STEP 2: GRANT SELECT PRIVILEGES
-- ============================================================

GRANT SELECT
ON GUIDE
TO TRAVELIA_USER;

GRANT SELECT
ON TOUR_PACKAGE
TO TRAVELIA_USER;

GRANT SELECT
ON PACKAGE_HIGHLIGHT
TO TRAVELIA_USER;

GRANT SELECT
ON REVIEW
TO TRAVELIA_USER;

GRANT SELECT
ON TOURIST
TO TRAVELIA_USER;

GRANT SELECT
ON BOOKING
TO TRAVELIA_USER;


-- ============================================================
-- STEP 3: DEMONSTRATE REVOKE
-- ============================================================

-- First give the role access to tourist phone numbers.

GRANT SELECT
ON TOURIST_PHONE
TO TRAVELIA_USER;


-- Now remove that privilege.

REVOKE SELECT
ON TOURIST_PHONE
FROM TRAVELIA_USER;


-- ============================================================
-- STEP 4: VERIFY THE ROLE'S PRIVILEGES
-- ============================================================

SELECT
    ROLE,
    OWNER,
    TABLE_NAME,
    PRIVILEGE
FROM ROLE_TAB_PRIVS
WHERE ROLE = 'TRAVELIA_USER'
ORDER BY TABLE_NAME;


-- ============================================================
-- STEP 5: VERIFY THAT TOURIST_PHONE ACCESS WAS REVOKED
-- ============================================================

SELECT
    ROLE,
    OWNER,
    TABLE_NAME,
    PRIVILEGE
FROM ROLE_TAB_PRIVS
WHERE ROLE = 'TRAVELIA_USER'
AND TABLE_NAME = 'TOURIST_PHONE';


-- ============================================================
-- DCL DEMONSTRATION COMPLETE
-- ============================================================

