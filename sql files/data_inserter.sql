INSERT INTO LOCATION (DIVISION, CITY) VALUES 
('Dhaka', 'Dhaka City'), 
('Dhaka', 'Gazipur'), 
('Dhaka', 'Narayanganj'), 
('Dhaka', 'Tangail'), 
('Dhaka', 'Manikganj'), 
('Dhaka', 'Munshiganj'), 
('Dhaka', 'Narsingdi'), 
('Dhaka', 'Kishoreganj'), 
('Dhaka', 'Gopalganj'), 
('Dhaka', 'Faridpur'), 
('Dhaka', 'Rajbari'), 
('Dhaka', 'Madaripur'), 
('Dhaka', 'Shariatpur'), 
('Chittagong', 'Chittagong City'), 
('Chittagong', 'Coxs Bazar'), 
('Chittagong', 'Comilla'), 
('Chittagong', 'Feni'), 
('Chittagong', 'Khagrachari'), 
('Chittagong', 'Rangamati'), 
('Chittagong', 'Bandarban'), 
('Chittagong', 'Brahmanbaria'), 
('Chittagong', 'Chandpur'), 
('Chittagong', 'Lakshmipur'), 
('Chittagong', 'Noakhali'), 
('Rajshahi', 'Rajshahi City'), 
('Rajshahi', 'Bogura'), 
('Rajshahi', 'Joypurhat'), 
('Rajshahi', 'Naogaon'), 
('Rajshahi', 'Natore'), 
('Rajshahi', 'Chapainawabganj'), 
('Rajshahi', 'Pabna'), 
('Rajshahi', 'Sirajganj'), 
('Khulna', 'Khulna City'), 
('Khulna', 'Bagerhat'), 
('Khulna', 'Chuadanga'), 
('Khulna', 'Jessore'), 
('Khulna', 'Jhenaidah'), 
('Khulna', 'Magura'), 
('Khulna', 'Meherpur'), 
('Khulna', 'Narail'), 
('Khulna', 'Satkhira'), 
('Barishal', 'Barishal City'), 
('Barishal', 'Bhola'), 
('Barishal', 'Jhalokati'), 
('Barishal', 'Patuakhali'), 
('Barishal', 'Pirojpur'), 
('Sylhet', 'Sylhet City'), 
('Sylhet', 'Habiganj'), 
('Sylhet', 'Moulvibazar'), 
('Sylhet', 'Sunamganj'), 
('Rangpur', 'Rangpur City'), 
('Rangpur', 'Dinajpur'), 
('Rangpur', 'Gaibandha'), 
('Rangpur', 'Kurigram'), 
('Rangpur', 'Lalmonirhat'), 
('Rangpur', 'Nilphamari'), 
('Rangpur', 'Panchagarh'), 
('Rangpur', 'Thakurgaon'), 
('Mymensingh', 'Jamalpur'), 
('Mymensingh', 'Netrokona'), 
('Mymensingh', 'Sherpur');

INSERT INTO categories (CATEGORY_NAME) VALUES('Clothing'),
('Fashion'), ('Electronics'), ('Gadgets'), ('Home Décor'), ('Furniture'),
('Grocery'), ('Convenience'), ('Health'), ('Beauty'), ('Sporting Goods'),
('Outdoor Equipment'), ('Books'), ('Stationery'), ('Toys'), ('Games'),
('Pet Supplies'), ('Automotive'), ('Tools'), ('Jewelry'), ('Accessories'),
('Art'), ('Craft Supplies'), ('Specialty Foods'), ('Gourmet Items'), ('Home Improvement'),
('DIY'), ('Office Supplies'), ('Equipment'), ('Baby'), ('Maternity'), ('Party Supplies'),
('Decorations'), ('Musical Instruments'), ('Antiques'), ('Collectibles'),
('Travel Gear');




INSERT INTO STOREFRONT (CATEGORY_ID, STOREFRONT_NAME, STOREFRONT_DESCRIPTION, IMAGE) VALUES
(1, 'Fashion Hub', 'Trendy clothing for all ages', 'Target.png'),
(2, 'Tech Junction', 'Cutting-edge electronics and gadgets', 'OnlineStore.png'),
(3, 'Home Essentials', 'Décor and furniture for every room', 'OnlineStore2.png'),
(4, 'FreshMart', 'Your one-stop grocery shop', 'OnlineStore3.png'),
(5, 'FitFrenzy', 'Sports gear and fitness equipment', 'OnlineStore4.png'),
(6, 'Book Haven', 'A vast collection of books for all interests', 'Target.png'),
(7, 'Artistic Designs', 'Unique artwork and craft supplies', 'OnlineStore.png'),
(8, 'Healthy Living', 'Natural health and beauty products', 'OnlineStore2.png'),
(9, 'Pet Paradise', 'Supplies for your furry friends', 'OnlineStore3.png'),
(10, 'AutoTech', 'Automotive parts and accessories', 'OnlineStore4.png'),
(11, 'Tool Time', 'Quality tools for every project', 'Target.png'),
(12, 'Jewel World', 'Exquisite jewelry and accessories', 'OnlineStore.png'),
(13, 'Office Oasis', 'Office supplies for productivity', 'OnlineStore2.png'),
(14, 'Tiny Tots', 'Toys and games for children', 'OnlineStore3.png'),
(15, 'Party Palace', 'Supplies for memorable celebrations', 'OnlineStore4.png'),
(16, 'Home Improvement Co.', 'DIY essentials and home improvement', 'Target.png'),
(17, 'Musical Melodies', 'Instruments and accessories for musicians', 'OnlineStore.png'),
(18, 'Vintage Treasures', 'Antiques and collectibles', 'OnlineStore2.png'),
(19, 'Travelers Haven', 'Gear for your next adventure', 'OnlineStore3.png'),
(20, 'Gourmet Delights', 'Specialty foods for discerning tastes', 'OnlineStore4.png'),
(21, 'Outdoor Oasis', 'Equipment for outdoor enthusiasts', 'Target.png'),
(22, 'Maternity Magic', 'Essentials for moms-to-be', 'OnlineStore.png'),
(23, 'Baby Boutique', 'Adorable baby clothes and accessories', 'OnlineStore2.png'),
(24, 'Stationery Stop', 'Quality stationery and office supplies', 'OnlineStore3.png'),
(25, 'Craft Corner', 'Supplies for creative projects', 'OnlineStore4.png'),
(26, 'Convenience Corner', 'Everyday essentials for convenience', 'Target.png'),
(27, 'Health Haven', 'Health products for holistic wellness', 'OnlineStore.png'),
(28, 'Game Galaxy', 'Games and gaming accessories', 'OnlineStore2.png'),
(29, 'Artisan Alley', 'Handcrafted goods and artisanal products', 'OnlineStore3.png'),
(30, 'Beauty Bliss', 'Beauty products for a radiant you', 'OnlineStore4.png'),
(31, 'Specialty Finds', 'Unique items and specialty goods', 'Target.png'),
(32, 'Office Oasis', 'Office supplies for productivity', 'OnlineStore.png'),
(33, 'Equipment Emporium', 'Professional equipment for all needs', 'OnlineStore2.png'),
(34, 'Party Palace', 'Supplies for memorable celebrations', 'OnlineStore3.png'),
(35, 'Decor Delight', 'Décor items to elevate your space', 'OnlineStore4.png'),
(36, 'Antique Avenue', 'Antiques and vintage treasures', 'Target.png'),
(37, 'Collectible Corner', 'Rare collectibles and memorabilia', 'OnlineStore.png');

INSERT INTO MANAGES (PERSON_ID, STOREFRONT_ID) VALUES
(1, 1),
(1, 2),
(2, 3),
(2, 4),
(3, 5),
(3, 6),
(4, 7),
(4, 8),
(5, 9),
(5, 10),
(6, 11),
(6, 12),
(7, 13),
(7, 14),
(1, 15),
(1, 16),
(2, 17),
(2, 18),
(3, 19),
(3, 20),
(4, 21),
(4, 22),
(5, 23),
(5, 24),
(6, 25),
(6, 26),
(7, 27),
(7, 28),
(1, 29),
(1, 30),
(2, 31),
(2, 32),
(3, 33),
(3, 34),
(4, 35),
(4, 36),
(5, 37);


--PRODUCT GENERATOR
DO $$
DECLARE
    v_storefront_id INTEGER;
    v_product_counter INTEGER;
BEGIN
    FOR v_storefront_id IN 43..79 LOOP
        FOR v_product_counter IN 1..40 LOOP
            INSERT INTO PRODUCT (STOREFRONT_ID, PRODUCT_NAME, PRODUCT_DESCRIPTION, STOCK_COUNT, PRICE, IMAGE)
            VALUES (
                v_storefront_id,
                'Product ' || v_product_counter || ' for Storefront ' || v_storefront_id,
                'Description for Product ' || v_product_counter || ' in Storefront ' || v_storefront_id,
                50, -- Initial stock count
                60 + (2 * MOD(v_product_counter, 100)),
                CASE (v_product_counter % 4)
                    WHEN 0 THEN 'Product4.png'
                    WHEN 1 THEN 'Product1.png'
                    WHEN 2 THEN 'Product2.png'
                    ELSE 'Product3.png'
                END
            );
        END LOOP;
    END LOOP;
    RAISE NOTICE 'Products inserted successfully.';
END $$;

INSERT INTO ANNOUNCEMENTS (STOREFRONT_ID, ANNOUNCEMENT_DESCRIPTION, IMAGE, PERSON_ID) VALUES
(1, 'New arrivals! Check out our latest collection.', 'Deal.png', 1),
(2, 'Special discount on selected items. Limited time offer!', 'Deal.png', 2),
(3, 'Get ready for summer with our new tech gadgets.', 'Deal.png', 3),
(4, 'Home makeover sale! Up to 50% off on furniture.', 'Deal.png', 4),
(5, 'Fresh produce just in! Visit us for the best groceries.', 'Deal.png', 5),
(6, 'Gear up for your next adventure with our sports equipment.', 'Deal.png', 6),
(7, 'Exciting book launch event happening this weekend!', 'Deal.png', 7),
(8, 'Artisanal crafts for a unique touch to your home.', 'Deal.png', 1),
(9, 'Discover your beauty essentials at unbeatable prices.', 'Deal.png', 2),
(10, 'Join us for our pet adoption drive and find your new furry friend!', 'Deal.png', 3);

--REVIEW GENERATOR
DO $$
DECLARE
    v_product_id INTEGER;
    v_person_id INTEGER;
BEGIN
    -- Loop through each product
    FOR v_product_id IN (SELECT PRODUCT_ID FROM PRODUCT) LOOP
        -- Generate 3 reviews for each product
        FOR i IN 1..7 LOOP
            -- Select a random person ID for the review
            SELECT i INTO v_person_id;
            
            -- Insert review for the product
            INSERT INTO REVIEW (PRODUCT_ID, PERSON_ID, COMMENTS, RATING)
            VALUES (
                v_product_id,
                v_person_id,
                'This is a great product!',
                MOD(i, 5) -- Random rating between 0 and 5 rounded to 1 decimal place
            );
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Reviews inserted successfully.';
END $$;

INSERT INTO COMPLAINTS (PERSON_ID, STOREFRONT_ID, COMPLAINT_DETAILS) VALUES
(1, 1, 'Delayed delivery'),
(2, 2, 'Wrong size delivered'),
(3, 3, 'Product damaged upon delivery');


--TAG ASSIGNMENT
DO $$
DECLARE
    v_product_id INTEGER;
		tnum INTEGER;
		tag TEXT;
BEGIN
    FOR v_product_id IN (SELECT PRODUCT_ID FROM PRODUCT) LOOP
				tnum := 1;
				FOR tag IN (SELECT TAG_NAME FROM TAGS) LOOP
						IF MOD(tnum, 21) = MOD(v_product_id, 21) THEN
								INSERT INTO TAG_ASSIGNMENT (PRODUCT_ID, TAG_NAME) VALUES (v_product_id, tag);
						END IF;
						tnum := tnum + 1;
				END LOOP;
    END LOOP;
    RAISE NOTICE 'Tags assigned to products successfully.';
END $$;

INSERT INTO TAGS (TAG_NAME) VALUES
('NewArrivals'), ('SpecialOffer'), ('TechTuesday'), ('HomeDecor'),('FashionTrends'), ('BestSeller'), 
('HealthyLiving'), ('OutdoorAdventure'), ('DIYProjects'), ('GourmetDelights'), ('FitnessGoals'), 
('BookLovers'), ('ArtisticExpressions'), ('BeautyEssentials'), ('PetCare'), ('TravelInspiration'), 
('GamingCommunity'), ('MusicLovers'), ('VintageFinds'), ('WorkFromHome'), ('GiftIdeas');