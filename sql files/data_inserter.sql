-- Inserting into COUNTRY table
INSERT INTO COUNTRY (COUNTRY_NAME) VALUES
  ('Country1'),
  ('Country2'),
  ('Country3'),
  ('Country4'),
  ('Country5');

-- Inserting into LOCATION table
INSERT INTO LOCATION (LOCATION_NAME, POST_CODE, COUNTRY_ID) VALUES
  ('Location1', 12345, 1),
  ('Location2', 67890, 2),
  ('Location3', 54321, 1),
  ('Location4', 98765, 3),
  ('Location5', 11111, 2);

-- Inserting into PERSON table
INSERT INTO PERSON (PERSON_NAME, PASSWORD, LOCATION_ID, DATE_OF_BIRTH, PHONE, EMAIL, IMAGE) VALUES
  ('Person1', 'password1', 1, '1990-01-01', '1234567890', 'person1@example.com', 'image1.jpg'),
  ('Person2', 'password2', 2, '1985-05-15', '9876543210', 'person2@example.com', 'image2.jpg'),
  ('Person3', 'password3', 3, '1995-08-20', '5555555555', 'person3@example.com', 'image3.jpg'),
  ('Person4', 'password4', 4, '1980-12-10', '1112223333', 'person4@example.com', 'image4.jpg'),
  ('Person5', 'password5', 5, '1998-04-25', '9998887777', 'person5@example.com', 'image5.jpg');

-- Inserting into STOREFRONT table
INSERT INTO STOREFRONT (STOREFRONT_NAME, STOREFRONT_DESCRIPTION, LAST_UPDATED_ON, IMAGE) VALUES
  ('Storefront1', 'Description1', CURRENT_TIMESTAMP, 'storefront_image1.jpg'),
  ('Storefront2', 'Description2', CURRENT_TIMESTAMP, 'storefront_image2.jpg'),
  ('Storefront3', 'Description3', CURRENT_TIMESTAMP, 'storefront_image3.jpg'),
  ('Storefront4', 'Description4', CURRENT_TIMESTAMP, 'storefront_image4.jpg'),
  ('Storefront5', 'Description5', CURRENT_TIMESTAMP, 'storefront_image5.jpg');

-- Inserting into MANAGES table
INSERT INTO MANAGES (PERSON_ID, STOREFRONT_ID) VALUES
  (1, 1),
  (2, 2),
  (3, 3),
  (4, 4),
  (5, 5);

-- Inserting into PRODUCT table
INSERT INTO PRODUCT (PRODUCT_NAME, PRODUCT_DESCRIPTION, PRICE, IMAGE, STOREFRONT_ID) VALUES
  ('Product1', 'Description1', 19.99, 'product_image1.jpg', 1),
  ('Product2', 'Description2', 29.99, 'product_image2.jpg', 2),
  ('Product3', 'Description3', 39.99, 'product_image3.jpg', 3),
  ('Product4', 'Description4', 49.99, 'product_image4.jpg', 4),
  ('Product5', 'Description5', 59.99, 'product_image5.jpg', 5);

-- Inserting into CART table
INSERT INTO CART (PERSON_ID, PRODUCT_ID) VALUES
  (1, 1),
  (2, 2),
  (3, 3),
  (4, 4),
  (5, 5);

-- Inserting into ORDERS table
INSERT INTO ORDERS (PERSON_ID, ORDER_DATE, COMMENTS) VALUES
  (1, CURRENT_DATE, 'Order comments 1'),
  (2, CURRENT_DATE, 'Order comments 2'),
  (3, CURRENT_DATE, 'Order comments 3'),
  (4, CURRENT_DATE, 'Order comments 4'),
  (5, CURRENT_DATE, 'Order comments 5');

-- Inserting into TRANSACTIONS table
INSERT INTO TRANSACTIONS (PERSON_ID, STOREFRONT_ID, ORDER_ID) VALUES
  (1, 1, 1),
  (2, 2, 2),
  (3, 3, 3),
  (4, 4, 4),
  (5, 5, 5);

-- Inserting into ANNOUNCEMENTS table
INSERT INTO ANNOUNCEMENTS (STOREFRONT_ID, ANNOUNCEMENT_DESCRIPTION, POSTED_ON, IMAGE) VALUES
  (1, 'Announcement 1', CURRENT_TIMESTAMP, 'announcement_image1.jpg'),
  (2, 'Announcement 2', CURRENT_TIMESTAMP, 'announcement_image2.jpg'),
  (3, 'Announcement 3', CURRENT_TIMESTAMP, 'announcement_image3.jpg'),
  (4, 'Announcement 4', CURRENT_TIMESTAMP, 'announcement_image4.jpg'),
  (5, 'Announcement 5', CURRENT_TIMESTAMP, 'announcement_image5.jpg');

-- Inserting into REVIEW table
INSERT INTO REVIEW (PRODUCT_ID, PERSON_ID, POSTED_ON, COMMENTS, RATING) VALUES
  (1, 1, CURRENT_TIMESTAMP, 'Great product!', 4.5),
  (2, 2, CURRENT_TIMESTAMP, 'Not satisfied.', 2.0),
  (3, 3, CURRENT_TIMESTAMP, 'Excellent service!', 5.0),
  (4, 4, CURRENT_TIMESTAMP, 'Average experience.', 3.0),
  (5, 5, CURRENT_TIMESTAMP, 'Highly recommended!', 4.8);

-- Inserting into COMPLAINTS table
INSERT INTO COMPLAINTS (PERSON_ID, STOREFRONT_ID, POSTED_ON, COMPLAINT_DETAILS) VALUES
  (1, 1, CURRENT_TIMESTAMP, 'Complaint details 1'),
  (2, 2, CURRENT_TIMESTAMP, 'Complaint details 2'),
  (3, 3, CURRENT_TIMESTAMP, 'Complaint details 3'),
  (4, 4, CURRENT_TIMESTAMP, 'Complaint details 4'),
  (5, 5, CURRENT_TIMESTAMP, 'Complaint details 5');

-- Inserting into TAGS table
INSERT INTO TAGS (TAG_NAME) VALUES
  ('Tag1'),
  ('Tag2'),
  ('Tag3'),
  ('Tag4'),
  ('Tag5');

-- Inserting into TAG_ASSIGNMENT table
INSERT INTO TAG_ASSIGNMENT (PRODUCT_ID, TAG_NAME) VALUES
  (1, 'Tag1'),
  (2, 'Tag2'),
  (3, 'Tag3'),
  (4, 'Tag4'),
  (5, 'Tag5');

-- Inserting into CATEGORIES table
INSERT INTO CATEGORIES (STOREFRONT_ID, CATEGORY_NAME, PRODUCT_ID) VALUES
  (1, 'Category1', 1),
  (2, 'Category2', 2),
  (3, 'Category3', 3),
  (4, 'Category4', 4),
  (5, 'Category5', 5);
