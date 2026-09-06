CREATE TABLE GUIDE (
    Guide_ID NUMBER(5) PRIMARY KEY,
    First_Name VARCHAR2(50) NOT NULL,
    Last_Name VARCHAR2(50) NOT NULL,
    Phone_No VARCHAR2(15),
    Email VARCHAR2(100),
    Experience_Years NUMBER(2)
);
CREATE TABLE TOUR_PACKAGE (
    Package_ID NUMBER(5) PRIMARY KEY,
    Package_Name VARCHAR2(100) NOT NULL,
    Destination_City VARCHAR2(50) NOT NULL,
    Destination_State VARCHAR2(50) NOT NULL,
    Destination_Country VARCHAR2(50) NOT NULL,
    Duration NUMBER(3) NOT NULL,
    Price NUMBER(10,2) NOT NULL,
    Package_Type VARCHAR2(50),
    Guide_ID NUMBER(5),
    
    CONSTRAINT fk_package_guide
        FOREIGN KEY (Guide_ID)
        REFERENCES GUIDE(Guide_ID)
);
CREATE TABLE GUIDE_LANGUAGE (
    Guide_ID NUMBER(5),
    Language_Known VARCHAR2(50),
    CONSTRAINT pk_guide_language
        PRIMARY KEY (Guide_ID, Language_Known),
    CONSTRAINT fk_language_guide
        FOREIGN KEY (Guide_ID)
        REFERENCES GUIDE(Guide_ID)
);
CREATE TABLE TOURIST (
    Tourist_ID NUMBER(5) PRIMARY KEY,
    First_Name VARCHAR2(50) NOT NULL,
    Middle_Name VARCHAR2(50),
    Last_Name VARCHAR2(50) NOT NULL,
    Gender VARCHAR2(10),
    Date_of_Birth DATE,
    Nationality VARCHAR2(50),
    Email VARCHAR2(100),
    Street VARCHAR2(100),
    City VARCHAR2(50),
    State VARCHAR2(50),
    PIN VARCHAR2(10),
    Guide_ID NUMBER(5),
    CONSTRAINT fk_tourist_guide
        FOREIGN KEY (Guide_ID)
        REFERENCES GUIDE(Guide_ID)
);
CREATE TABLE TOURIST_PHONE (
    Tourist_ID NUMBER(5),
    Phone_No VARCHAR2(15),
    CONSTRAINT pk_tourist_phone
        PRIMARY KEY (Tourist_ID, Phone_No),
    CONSTRAINT fk_phone_tourist
        FOREIGN KEY (Tourist_ID)
        REFERENCES TOURIST(Tourist_ID)
);
CREATE TABLE BOOKING (
    Booking_ID NUMBER(5) PRIMARY KEY,
    Tourist_ID NUMBER(5) NOT NULL,
    Package_ID NUMBER(5) NOT NULL,
    Booking_Date DATE NOT NULL,
    Travel_Date DATE NOT NULL,
    Number_of_People NUMBER(3) NOT NULL,
    Payment_Status VARCHAR2(20),
    Total_Amount NUMBER(10,2),
    CONSTRAINT fk_booking_tourist
        FOREIGN KEY (Tourist_ID)
        REFERENCES TOURIST(Tourist_ID),
    CONSTRAINT fk_booking_package
        FOREIGN KEY (Package_ID)
        REFERENCES TOUR_PACKAGE(Package_ID)
);
CREATE TABLE BOOKING_SPECIAL_REQUEST (
    Booking_ID NUMBER(5),
    Special_Request VARCHAR2(500),
    CONSTRAINT pk_booking_request
        PRIMARY KEY (Booking_ID, Special_Request),
    CONSTRAINT fk_request_booking
        FOREIGN KEY (Booking_ID)
        REFERENCES BOOKING(Booking_ID)
);
CREATE TABLE PACKAGE_HIGHLIGHT (
    Package_ID NUMBER(5),
    Highlight VARCHAR2(500),
    CONSTRAINT pk_package_highlight
        PRIMARY KEY (Package_ID, Highlight),
    CONSTRAINT fk_highlight_package
        FOREIGN KEY (Package_ID)
        REFERENCES TOUR_PACKAGE(Package_ID)
);
CREATE TABLE REVIEW (
    Guide_ID NUMBER(5),
    Review_Text VARCHAR2(1000),
    Review_Date DATE,
    Rating NUMBER(1),
    CONSTRAINT pk_review
        PRIMARY KEY (Guide_ID, Review_Text, Review_Date, Rating),
    CONSTRAINT fk_review_guide
        FOREIGN KEY (Guide_ID)
        REFERENCES GUIDE(Guide_ID)
);