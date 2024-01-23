
  ('London', 34234, 3);

-- Insert into PERSON table
INSERT INTO PERSON (PERSON_NAME, PASSWORD, LOCATION_ID, DATE_OF_BIRTH, PHONE, EMAIL, IMAGE) VALUES
  ('John Doe', 'password123', 1, '1990-01-15', '123-456-7890', 'john.doe@example.com', 'image_url1'),
  ('Jane Smith', 'securepass', 2, '1985-05-20', '987-654-3210', 'jane.smith@example.com', 'image_url2'),
  ('Alice Johnson', 'pass123', 3, '1992-09-03', '555-123-4567', 'alice.j@example.com', 'image_url3');

-- Insert into CATEGORIES table
INSERT INTO CATEGORIES (CATEGORY_NAME) VALUES
  ('electronics'),
  ('clothing'),
  ('books');

-- Insert into STOREFRONT table
INSERT INTO STOREFRONT (STOREFRONT_NAME, STOREFRONT_DESCRIPTION, IMAGE) VALUES
  ('Electronics Emporium', 'The best in gadgets', 'storefront_image1'),
  ('Fashion Haven', 'Latest trends in clothing', 'storefront_image2'),
  ('Book Paradise', 'A haven for book lovers', 'storefront_image3');

-- Insert into CATEGORY_STOREFRONT_RELATION table
INSERT INTO CATEGORY_STOREFRONT_RELATION (STOREFRONT_ID, CATEGORY_NAME) VALUES
  (1, 'electronics'),
  (2, 'clothing'),
  (3, 'books');

-- Insert into MANAGES table
INSERT INTO MANAGES (PERSON_ID, STOREFRONT_ID) VALUES
  (1, 1),
  (2, 2),
  (3, 3);

-- Insert into PRODUCT table
INSERT INTO PRODUCT (PRODUCT_NAME, PRODUCT_DESCRIPTION, PRICE, IMAGE, STOREFRONT_ID) VALUES
  ('Smartphone', 'High-end mobile device', 799.99, 'product_image1', 1),
  ('Designer Dress', 'Fashionable evening gown', 149.99, 'product_image2', 2),
  ('Bestseller Book', 'Popular novel', 19.99, 'product_image3', 3);

-- Insert into CART table
INSERT INTO CART (PERSON_ID, PRODUCT_ID, QUANTITY) VALUES
  (1, 1, 2),
  (2, 3, 1),
  (3, 2, 3);

-- Insert into ORDERS table
INSERT INTO ORDERS (PERSON_ID, ORDER_DATE, COMMENTS) VALUES
  (1, '2023-01-15', 'Order for smartphones and accessories'),
  (2, '2023-02-20', 'Order for new fashion arrivals'),
  (3, '2023-03-03', 'Order for favorite books');

-- Insert into TRANSACTIONS table
INSERT INTO TRANSACTIONS (PERSON_ID, STOREFRONT_ID, ORDER_ID) VALUES
  (1, 1, 1),
  (2, 2, 2),
  (3, 3, 3);

-- Insert into ANNOUNCEMENTS table
INSERT INTO ANNOUNCEMENTS (STOREFRONT_ID, ANNOUNCEMENT_DESCRIPTION, IMAGE) VALUES
  (1, 'New arrivals in smartphones', 'announcement_image1'),
  (2, 'Exclusive fashion discounts', 'announcement_image2'),
  (3, 'Book signing event this weekend', 'announcement_image3');

-- Insert into REVIEW table
INSERT INTO REVIEW (PRODUCT_ID, PERSON_ID, COMMENTS, RATING) VALUES
  (1, 1, 'Great phone!', 4.5),
  (2, 2, 'Beautiful dress, perfect fit', 5),
  (3, 3, 'Captivating story', 4.2);

-- Insert into COMPLAINTS table
INSERT INTO COMPLAINTS (PERSON_ID, STOREFRONT_ID, COMPLAINT_DETAILS) VALUES
  (1, 1, 'Issue with smartphone delivery'),
  (2, 2, 'Received wrong dress size'),
  (3, 3, 'Book not delivered as expected');

-- Insert into TAGS table
INSERT INTO TAGS (TAG_NAME) VALUES
  ('Popular'),
  ('Sale'),
  ('New Arrival');

-- Insert into TAG_ASSIGNMENT table
INSERT INTO TAG_ASSIGNMENT (PRODUCT_ID, TAG_NAME) VALUES
  (1, 'Popular'),
  (2, 'Sale'),
  (3, 'New Arrival');
