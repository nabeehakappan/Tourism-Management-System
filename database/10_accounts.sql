-- ============================================================
-- TRAVELIA - USER ACCOUNTS
-- 10_user_accounts.sql
-- ============================================================

CREATE TABLE USER_ACCOUNT (
    User_ID NUMBER PRIMARY KEY,
    Username VARCHAR2(50) UNIQUE NOT NULL,
    User_Password VARCHAR2(100) NOT NULL,
    User_Role VARCHAR2(20) DEFAULT 'USER' NOT NULL,
    Tourist_ID NUMBER,
        CONSTRAINT fk_user_tourist
        FOREIGN KEY (Tourist_ID)
        REFERENCES TOURIST(Tourist_ID),
    CONSTRAINT chk_user_role
        CHECK (User_Role IN ('ADMIN', 'USER'))
);


-- ============================================================
-- DEMO ACCOUNTS
-- ============================================================

INSERT INTO USER_ACCOUNT
    (User_ID, Username, User_Password, User_Role, Tourist_ID)
VALUES
    (1, 'admin', 'admin123', 'ADMIN', NULL);

INSERT INTO USER_ACCOUNT
    (User_ID, Username, User_Password, User_Role, Tourist_ID)
VALUES
    (2, 'aarav', 'aarav123', 'USER', 301);

INSERT INTO USER_ACCOUNT
    (User_ID, Username, User_Password, User_Role, Tourist_ID)
VALUES
    (3, 'ishita', 'ishita123', 'USER', 302);


COMMIT;


-- ============================================================
-- VERIFY
-- ============================================================

SELECT
    User_ID,
    Username,
    User_Role,
    Tourist_ID
FROM USER_ACCOUNT
ORDER BY User_ID;

