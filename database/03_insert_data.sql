INSERT INTO GUIDE
(Guide_ID, First_Name, Last_Name, Phone_No, Email, Experience_Years)
VALUES
(101, 'Arjun', 'Menon', '9876543210', 'arjun.menon@gmail.com', 6);

INSERT INTO GUIDE
(Guide_ID, First_Name, Last_Name, Phone_No, Email, Experience_Years)
VALUES
(102, 'Meera', 'Nair', '9876543211', 'meera.nair@gmail.com', 4);

INSERT INTO GUIDE
(Guide_ID, First_Name, Last_Name, Phone_No, Email, Experience_Years)
VALUES
(103, 'Rohan', 'Sharma', '9876543212', 'rohan.sharma@gmail.com', 8);

INSERT INTO GUIDE
(Guide_ID, First_Name, Last_Name, Phone_No, Email, Experience_Years)
VALUES
(104, 'Ananya', 'Iyer', '9876543213', 'ananya.iyer@gmail.com', 3);

INSERT INTO GUIDE
(Guide_ID, First_Name, Last_Name, Phone_No, Email, Experience_Years)
VALUES
(105, 'Kabir', 'Kapoor', '9876543214', 'kabir.kapoor@gmail.com', 10);

INSERT INTO TOUR_PACKAGE
(Package_ID, Package_Name, Destination_City, Destination_State,
 Destination_Country, Duration, Price, Package_Type, Guide_ID)
VALUES
(201, 'Royal Rajasthan Escape', 'Jaipur', 'Rajasthan', 'India',
 5, 25000, 'Cultural', 101);

INSERT INTO TOUR_PACKAGE
(Package_ID, Package_Name, Destination_City, Destination_State,
 Destination_Country, Duration, Price, Package_Type, Guide_ID)
VALUES
(202, 'Kerala Backwaters Retreat', 'Alappuzha', 'Kerala', 'India',
 4, 18000, 'Relaxation', 102);

INSERT INTO TOUR_PACKAGE
(Package_ID, Package_Name, Destination_City, Destination_State,
 Destination_Country, Duration, Price, Package_Type, Guide_ID)
VALUES
(203, 'Himalayan Adventure', 'Manali', 'Himachal Pradesh', 'India',
 6, 32000, 'Adventure', 103);

INSERT INTO TOUR_PACKAGE
(Package_ID, Package_Name, Destination_City, Destination_State,
 Destination_Country, Duration, Price, Package_Type, Guide_ID)
VALUES
(204, 'Goa Beach Getaway', 'Panaji', 'Goa', 'India',
 3, 15000, 'Beach', 104);

INSERT INTO TOUR_PACKAGE
(Package_ID, Package_Name, Destination_City, Destination_State,
 Destination_Country, Duration, Price, Package_Type, Guide_ID)
VALUES
(205, 'Paris Explorer', 'Paris', 'Île-de-France', 'France',
 7, 85000, 'International', 105);

INSERT INTO TOUR_PACKAGE
(Package_ID, Package_Name, Destination_City, Destination_State,
 Destination_Country, Duration, Price, Package_Type, Guide_ID)
VALUES
(206, 'Tokyo Discovery', 'Tokyo', 'Tokyo', 'Japan',
 6, 95000, 'International', 103);

 INSERT INTO TOURIST
(Tourist_ID, First_Name, Middle_Name, Last_Name, Gender,
 Date_of_Birth, Nationality, Email, Street, City, State, PIN, Guide_ID)
VALUES
(301, 'Aarav', NULL, 'Shah', 'Male',
 TO_DATE('15-03-2002', 'DD-MM-YYYY'), 'Indian',
 'aarav.shah@gmail.com', 'MG Road', 'Bengaluru',
 'Karnataka', '560001', 101);

INSERT INTO TOURIST
(Tourist_ID, First_Name, Middle_Name, Last_Name, Gender,
 Date_of_Birth, Nationality, Email, Street, City, State, PIN, Guide_ID)
VALUES
(302, 'Ishita', 'R', 'Patel', 'Female',
 TO_DATE('22-07-2001', 'DD-MM-YYYY'), 'Indian',
 'ishita.patel@gmail.com', 'Banjara Hills', 'Hyderabad',
 'Telangana', '500034', 102);

INSERT INTO TOURIST
(Tourist_ID, First_Name, Middle_Name, Last_Name, Gender,
 Date_of_Birth, Nationality, Email, Street, City, State, PIN, Guide_ID)
VALUES
(303, 'Daniel', NULL, 'Thomas', 'Male',
 TO_DATE('10-11-1999', 'DD-MM-YYYY'), 'Indian',
 'daniel.thomas@gmail.com', 'Kowdiar', 'Thiruvananthapuram',
 'Kerala', '695003', 102);

INSERT INTO TOURIST
(Tourist_ID, First_Name, Middle_Name, Last_Name, Gender,
 Date_of_Birth, Nationality, Email, Street, City, State, PIN, Guide_ID)
VALUES
(304, 'Sara', 'M', 'Joseph', 'Female',
 TO_DATE('05-01-2003', 'DD-MM-YYYY'), 'Indian',
 'sara.joseph@gmail.com', 'Fort Kochi', 'Kochi',
 'Kerala', '682001', 103);

INSERT INTO TOURIST
(Tourist_ID, First_Name, Middle_Name, Last_Name, Gender,
 Date_of_Birth, Nationality, Email, Street, City, State, PIN, Guide_ID)
VALUES
(305, 'Rahul', NULL, 'Verma', 'Male',
 TO_DATE('18-09-2000', 'DD-MM-YYYY'), 'Indian',
 'rahul.verma@gmail.com', 'Sector 17', 'Chandigarh',
 'Chandigarh', '160017', 103);

INSERT INTO TOURIST
(Tourist_ID, First_Name, Middle_Name, Last_Name, Gender,
 Date_of_Birth, Nationality, Email, Street, City, State, PIN, Guide_ID)
VALUES
(306, 'Emma', NULL, 'Wilson', 'Female',
 TO_DATE('30-04-1998', 'DD-MM-YYYY'), 'British',
 'emma.wilson@gmail.com', 'Baker Street', 'London',
 'England', 'NW16XE', 104);

INSERT INTO TOURIST
(Tourist_ID, First_Name, Middle_Name, Last_Name, Gender,
 Date_of_Birth, Nationality, Email, Street, City, State, PIN, Guide_ID)
VALUES
(307, 'Karan', 'A', 'Mehta', 'Male',
 TO_DATE('12-12-2002', 'DD-MM-YYYY'), 'Indian',
 'karan.mehta@gmail.com', 'Andheri West', 'Mumbai',
 'Maharashtra', '400058', 105);

INSERT INTO TOURIST
(Tourist_ID, First_Name, Middle_Name, Last_Name, Gender,
 Date_of_Birth, Nationality, Email, Street, City, State, PIN, Guide_ID)
VALUES
(308, 'Nisha', NULL, 'Rao', 'Female',
 TO_DATE('25-06-2001', 'DD-MM-YYYY'), 'Indian',
 'nisha.rao@gmail.com', 'Indiranagar', 'Bengaluru',
 'Karnataka', '560038', 101);
 INSERT INTO TOURIST_PHONE (Tourist_ID, Phone_No)
VALUES (301, '9876500001');

INSERT INTO TOURIST_PHONE (Tourist_ID, Phone_No)
VALUES (301, '9123400001');

INSERT INTO TOURIST_PHONE (Tourist_ID, Phone_No)
VALUES (302, '9876500002');

INSERT INTO TOURIST_PHONE (Tourist_ID, Phone_No)
VALUES (303, '9876500003');

INSERT INTO TOURIST_PHONE (Tourist_ID, Phone_No)
VALUES (304, '9876500004');

INSERT INTO TOURIST_PHONE (Tourist_ID, Phone_No)
VALUES (305, '9876500005');

INSERT INTO TOURIST_PHONE (Tourist_ID, Phone_No)
VALUES (306, '447700900006');

INSERT INTO TOURIST_PHONE (Tourist_ID, Phone_No)
VALUES (307, '9876500007');

INSERT INTO TOURIST_PHONE (Tourist_ID, Phone_No)
VALUES (308, '9876500008');

INSERT INTO TOURIST_PHONE (Tourist_ID, Phone_No)
VALUES (308, '9123400008');

INSERT INTO PACKAGE_HIGHLIGHT (Package_ID, Highlight)
VALUES (201, 'Amber Fort');

INSERT INTO PACKAGE_HIGHLIGHT (Package_ID, Highlight)
VALUES (201, 'City Palace');

INSERT INTO PACKAGE_HIGHLIGHT (Package_ID, Highlight)
VALUES (201, 'Local cuisine');

INSERT INTO PACKAGE_HIGHLIGHT (Package_ID, Highlight)
VALUES (202, 'Alleppey backwaters');

INSERT INTO PACKAGE_HIGHLIGHT (Package_ID, Highlight)
VALUES (202, 'Houseboat stay');

INSERT INTO PACKAGE_HIGHLIGHT (Package_ID, Highlight)
VALUES (202, 'Kerala cuisine');

INSERT INTO PACKAGE_HIGHLIGHT (Package_ID, Highlight)
VALUES (203, 'Himalayan trekking');

INSERT INTO PACKAGE_HIGHLIGHT (Package_ID, Highlight)
VALUES (203, 'Solang Valley');

INSERT INTO PACKAGE_HIGHLIGHT (Package_ID, Highlight)
VALUES (204, 'Baga Beach');

INSERT INTO PACKAGE_HIGHLIGHT (Package_ID, Highlight)
VALUES (204, 'Water sports');

INSERT INTO PACKAGE_HIGHLIGHT (Package_ID, Highlight)
VALUES (205, 'Eiffel Tower');

INSERT INTO PACKAGE_HIGHLIGHT (Package_ID, Highlight)
VALUES (205, 'Louvre Museum');

INSERT INTO PACKAGE_HIGHLIGHT (Package_ID, Highlight)
VALUES (206, 'Shibuya Crossing');

INSERT INTO PACKAGE_HIGHLIGHT (Package_ID, Highlight)
VALUES (206, 'Mount Fuji');

INSERT INTO PACKAGE_HIGHLIGHT (Package_ID, Highlight)
VALUES (206, 'Tokyo food tour');

INSERT INTO BOOKING
(Booking_ID, Tourist_ID, Package_ID, Booking_Date,
 Travel_Date, Number_of_People, Payment_Status, Total_Amount)
VALUES
(401, 301, 201,
 TO_DATE('01-08-2026', 'DD-MM-YYYY'),
 TO_DATE('15-09-2026', 'DD-MM-YYYY'),
 2, 'Paid', 50000);

INSERT INTO BOOKING
(Booking_ID, Tourist_ID, Package_ID, Booking_Date,
 Travel_Date, Number_of_People, Payment_Status, Total_Amount)
VALUES
(402, 302, 202,
 TO_DATE('05-08-2026', 'DD-MM-YYYY'),
 TO_DATE('20-09-2026', 'DD-MM-YYYY'),
 2, 'Paid', 36000);

INSERT INTO BOOKING
(Booking_ID, Tourist_ID, Package_ID, Booking_Date,
 Travel_Date, Number_of_People, Payment_Status, Total_Amount)
VALUES
(403, 303, 203,
 TO_DATE('10-08-2026', 'DD-MM-YYYY'),
 TO_DATE('05-10-2026', 'DD-MM-YYYY'),
 3, 'Pending', 96000);

INSERT INTO BOOKING
(Booking_ID, Tourist_ID, Package_ID, Booking_Date,
 Travel_Date, Number_of_People, Payment_Status, Total_Amount)
VALUES
(404, 304, 204,
 TO_DATE('12-08-2026', 'DD-MM-YYYY'),
 TO_DATE('25-09-2026', 'DD-MM-YYYY'),
 2, 'Paid', 30000);

INSERT INTO BOOKING
(Booking_ID, Tourist_ID, Package_ID, Booking_Date,
 Travel_Date, Number_of_People, Payment_Status, Total_Amount)
VALUES
(405, 305, 203,
 TO_DATE('15-08-2026', 'DD-MM-YYYY'),
 TO_DATE('12-10-2026', 'DD-MM-YYYY'),
 2, 'Partial', 64000);

INSERT INTO BOOKING
(Booking_ID, Tourist_ID, Package_ID, Booking_Date,
 Travel_Date, Number_of_People, Payment_Status, Total_Amount)
VALUES
(406, 306, 205,
 TO_DATE('18-08-2026', 'DD-MM-YYYY'),
 TO_DATE('10-11-2026', 'DD-MM-YYYY'),
 2, 'Paid', 170000);

INSERT INTO BOOKING
(Booking_ID, Tourist_ID, Package_ID, Booking_Date,
 Travel_Date, Number_of_People, Payment_Status, Total_Amount)
VALUES
(407, 307, 206,
 TO_DATE('20-08-2026', 'DD-MM-YYYY'),
 TO_DATE('15-11-2026', 'DD-MM-YYYY'),
 1, 'Pending', 95000);

INSERT INTO BOOKING
(Booking_ID, Tourist_ID, Package_ID, Booking_Date,
 Travel_Date, Number_of_People, Payment_Status, Total_Amount)
VALUES
(408, 308, 201,
 TO_DATE('22-08-2026', 'DD-MM-YYYY'),
 TO_DATE('01-10-2026', 'DD-MM-YYYY'),
 4, 'Paid', 100000);

INSERT INTO BOOKING
(Booking_ID, Tourist_ID, Package_ID, Booking_Date,
 Travel_Date, Number_of_People, Payment_Status, Total_Amount)
VALUES
(409, 301, 204,
 TO_DATE('25-08-2026', 'DD-MM-YYYY'),
 TO_DATE('18-09-2026', 'DD-MM-YYYY'),
 2, 'Cancelled', 30000);

INSERT INTO BOOKING
(Booking_ID, Tourist_ID, Package_ID, Booking_Date,
 Travel_Date, Number_of_People, Payment_Status, Total_Amount)
VALUES
(410, 303, 202,
 TO_DATE('28-08-2026', 'DD-MM-YYYY'),
 TO_DATE('15-10-2026', 'DD-MM-YYYY'),
 2, 'Partial', 36000);

 INSERT INTO BOOKING_SPECIAL_REQUEST (Booking_ID, Special_Request)
VALUES (401, 'Airport pickup');

INSERT INTO BOOKING_SPECIAL_REQUEST (Booking_ID, Special_Request)
VALUES (401, 'Vegetarian meals');

INSERT INTO BOOKING_SPECIAL_REQUEST (Booking_ID, Special_Request)
VALUES (402, 'Houseboat room with balcony');

INSERT INTO BOOKING_SPECIAL_REQUEST (Booking_ID, Special_Request)
VALUES (403, 'Trekking equipment');

INSERT INTO BOOKING_SPECIAL_REQUEST (Booking_ID, Special_Request)
VALUES (403, 'Airport transfer');

INSERT INTO BOOKING_SPECIAL_REQUEST (Booking_ID, Special_Request)
VALUES (404, 'Sea-facing room');

INSERT INTO BOOKING_SPECIAL_REQUEST (Booking_ID, Special_Request)
VALUES (405, 'Extra luggage allowance');

INSERT INTO BOOKING_SPECIAL_REQUEST (Booking_ID, Special_Request)
VALUES (406, 'Airport pickup');

INSERT INTO BOOKING_SPECIAL_REQUEST (Booking_ID, Special_Request)
VALUES (407, 'Japanese-speaking assistance');

INSERT INTO BOOKING_SPECIAL_REQUEST (Booking_ID, Special_Request)
VALUES (408, 'Vegetarian meals');

INSERT INTO BOOKING_SPECIAL_REQUEST (Booking_ID, Special_Request)
VALUES (410, 'Late check-in');

INSERT INTO GUIDE_LANGUAGE (Guide_ID, Language_Known)
VALUES (101, 'English');

INSERT INTO GUIDE_LANGUAGE (Guide_ID, Language_Known)
VALUES (101, 'Hindi');

INSERT INTO GUIDE_LANGUAGE (Guide_ID, Language_Known)
VALUES (101, 'Malayalam');

INSERT INTO GUIDE_LANGUAGE (Guide_ID, Language_Known)
VALUES (102, 'English');

INSERT INTO GUIDE_LANGUAGE (Guide_ID, Language_Known)
VALUES (102, 'Malayalam');

INSERT INTO GUIDE_LANGUAGE (Guide_ID, Language_Known)
VALUES (102, 'Tamil');

INSERT INTO GUIDE_LANGUAGE (Guide_ID, Language_Known)
VALUES (103, 'English');

INSERT INTO GUIDE_LANGUAGE (Guide_ID, Language_Known)
VALUES (103, 'Hindi');

INSERT INTO GUIDE_LANGUAGE (Guide_ID, Language_Known)
VALUES (103, 'Punjabi');

INSERT INTO GUIDE_LANGUAGE (Guide_ID, Language_Known)
VALUES (104, 'English');

INSERT INTO GUIDE_LANGUAGE (Guide_ID, Language_Known)
VALUES (104, 'Konkani');

INSERT INTO GUIDE_LANGUAGE (Guide_ID, Language_Known)
VALUES (105, 'English');

INSERT INTO GUIDE_LANGUAGE (Guide_ID, Language_Known)
VALUES (105, 'Hindi');

INSERT INTO GUIDE_LANGUAGE (Guide_ID, Language_Known)
VALUES (105, 'French');

INSERT INTO GUIDE_LANGUAGE (Guide_ID, Language_Known)
VALUES (105, 'Japanese');

INSERT INTO REVIEW
(Guide_ID, Review_Text, Review_Date, Rating)
VALUES
(101, 'Excellent guide with great knowledge of Jaipur.', 
 TO_DATE('20-08-2026', 'DD-MM-YYYY'), 5);

INSERT INTO REVIEW
(102, 'Very friendly and helpful throughout the trip.', TO_DATE('25-08-2026', 'DD-MM-YYYY'), 5);

INSERT INTO REVIEW
(103, 'Made the Himalayan trek safe and enjoyable.',  TO_DATE('28-08-2026', 'DD-MM-YYYY'), 5);

INSERT INTO REVIEW
(104, 'Great local knowledge and very professional.', TO_DATE('30-08-2026', 'DD-MM-YYYY'), 4);

INSERT INTO REVIEW
(105, 'Excellent international guide with good language skills.', TO_DATE('02-09-2026', 'DD-MM-YYYY'), 5);