INSERT INTO LOCATION (DIVISION, CITY) VALUES
('North', 'New York'),
('South', 'Miami'),
('East', 'Boston');

INSERT INTO PERSON (PERSON_NAME, PASSWORD, DATE_OF_BIRTH, PHONE, EMAIL) VALUES
('John Doe', 'password123', '1990-05-15', '1234567890', 'john@example.com'),
('Jane Smith', 'pass456', '1985-08-22', '9876543210', 'jane@example.com'),
('Alice Johnson', 'abc123', '1995-03-10', '5551234567', 'alice@example.com');

INSERT INTO ADDRESS (PERSON_ID, LOCATION_ID, STREET_NAME, HOUSE_NUMBER, POST_CODE) VALUES
(1, 1, 'Main Street', '123', 10001),
(2, 2, 'Ocean Avenue', '456', 33101),
(3, 3, 'Elm Street', '789', 22002);

INSERT INTO CATEGORIES (CATEGORY_NAME) VALUES
('Electronics'),
('Clothing'),
('Books');

INSERT INTO STOREFRONT (STOREFRONT_NAME, STOREFRONT_DESCRIPTION, IMAGE) VALUES
('ElectroMart', 'Your one-stop electronics shop', 'electromart.jpg'),
('FashionEmporium', 'Latest trends in clothing', 'fashionemporium.jpg'),
('BookBarn', 'A treasure trove for book lovers', 'bookbarn.jpg');

INSERT INTO CATEGORY_ASSIGNMENT (STOREFRONT_ID, CATEGORY_NAME) VALUES
(1, 'Electronics'),
(2, 'Clothing'),
(3, 'Books');

INSERT INTO MANAGES (PERSON_ID, STOREFRONT_ID) VALUES
(1, 1),
(2, 2),
(3, 3);

INSERT INTO PRODUCT (STOREFRONT_ID, PRODUCT_NAME, PRODUCT_DESCRIPTION, PRICE, IMAGE) VALUES
(1, 'Smartphone', 'High-performance smartphone', 599.99, 'smartphone.jpg'),
(2, 'T-shirt', 'Comfortable cotton t-shirt', 29.99, 'tshirt.jpg'),
(3, 'Novel', 'Bestseller novel', 19.99, 'novel.jpg');

INSERT INTO CART (PERSON_ID, PRODUCT_ID, QUANTITY) VALUES
(1, 1, 2),
(2, 2, 1),
(3, 3, 3);

INSERT INTO TRANSACTIONS (PERSON_ID, STOREFRONT_ID, AMOUNT) VALUES
(1, 1, 1199.98),
(2, 2, 29.99),
(3, 3, 59.97);

INSERT INTO ORDERS (PRODUCT_ID, PERSON_ID, TRANSACTION_ID) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3);

INSERT INTO ANNOUNCEMENTS (STOREFRONT_ID, ANNOUNCEMENT_DESCRIPTION, IMAGE) VALUES
(1, 'New arrivals in smartphones!', 'new_arrivals.jpg'),
(2, 'Summer collection now available!', 'summer_collection.jpg'),
(3, 'Special discount on bestsellers!', 'discount.jpg');

INSERT INTO REVIEW (PRODUCT_ID, PERSON_ID, COMMENTS, RATING) VALUES
(1, 1, 'Great phone!', 4.5),
(2, 2, 'Comfortable and stylish', 5),
(3, 3, 'Loved the story!', 4.8);

INSERT INTO COMPLAINTS (PERSON_ID, STOREFRONT_ID, COMPLAINT_DETAILS) VALUES
(1, 1, 'Delayed delivery'),
(2, 2, 'Wrong size delivered'),
(3, 3, 'Product damaged upon delivery');

INSERT INTO TAGS (TAG_NAME) VALUES
('New'),
('Sale'),
('Bestseller');

INSERT INTO TAG_ASSIGNMENT (PRODUCT_ID, TAG_NAME) VALUES
(1, 'New'),
(2, 'Sale'),
(3, 'Bestseller');