-- 1. Guide experience cannot be negative
ALTER TABLE GUIDE
ADD CONSTRAINT chk_guide_experience
CHECK (Experience_Years >= 0);


-- 2. Package duration must be positive
ALTER TABLE TOUR_PACKAGE
ADD CONSTRAINT chk_package_duration
CHECK (Duration > 0);


-- 3. Package price cannot be negative
ALTER TABLE TOUR_PACKAGE
ADD CONSTRAINT chk_package_price
CHECK (Price >= 0);


-- 4. Tourist gender
ALTER TABLE TOURIST
ADD CONSTRAINT chk_tourist_gender
CHECK (Gender IN ('Male', 'Female', 'Other'));


-- 5. Number of people must be positive
ALTER TABLE BOOKING
ADD CONSTRAINT chk_booking_people
CHECK (Number_of_People > 0);


-- 6. Total amount cannot be negative
ALTER TABLE BOOKING
ADD CONSTRAINT chk_booking_amount
CHECK (Total_Amount >= 0);


-- 7. Payment status
ALTER TABLE BOOKING
ADD CONSTRAINT chk_payment_status
CHECK (Payment_Status IN ('Paid', 'Pending', 'Partial', 'Cancelled'));


-- 8. Travel date cannot be before booking date
ALTER TABLE BOOKING
ADD CONSTRAINT chk_travel_date
CHECK (Travel_Date >= Booking_Date);


-- 9. Review rating must be between 1 and 5
ALTER TABLE REVIEW
ADD CONSTRAINT chk_review_rating
CHECK (Rating BETWEEN 1 AND 5);
