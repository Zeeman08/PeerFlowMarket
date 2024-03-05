--PROCEDURES

--procedure for checkout
CREATE OR REPLACE PROCEDURE process_cart_and_transactions(input_person_id INT, X TEXT)
LANGUAGE plpgsql
AS $$
DECLARE
    row_data RECORD;
		row_data2 RECORD;
		row_data3 RECORD;
		CURR_GROUP INT;
BEGIN
	SELECT MAX(GROUP_ID)+1 INTO CURR_GROUP FROM ORDERS;
	FOR row_data IN (
		SELECT STOREFRONT_ID, person_id, SUM(quantity * price) AS total_amount
		FROM CART C JOIN PRODUCT P USING (PRODUCT_ID)
		WHERE person_id = input_person_id
		GROUP BY storefront_id, PERSON_ID
	)
	LOOP
		--RAISE NOTICE 'HELLO';
		INSERT INTO TRANSACTIONS (PERSON_ID, STOREFRONT_ID, AMOUNT, TRANSACTION_TYPE) VALUES (
			row_data.person_id, row_data.storefront_id, row_data.total_amount, X
		) returning * into row_data2;
		
		INSERT INTO ORDERS (PRODUCT_ID, QUANTITY, PERSON_ID, TRANSACTION_ID, GROUP_ID, PRICE)
		SELECT PRODUCT_ID, QUANTITY, PERSON_ID, row_data2.transaction_id, CURR_GROUP, P.PRICE
		FROM CART C JOIN PRODUCT P USING(PRODUCT_ID)
		WHERE PERSON_ID = row_data2.person_id AND STOREFRONT_ID = row_data2.storefront_id;
		
			
	END LOOP;
	DELETE 
	FROM CART
	WHERE PERSON_ID = INPUT_PERSON_ID;
END $$;






--TRIGGERS

--person create trigger
CREATE OR REPLACE FUNCTION person_insert_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    -- Inserting data into ACTION_LOG table
    INSERT INTO ACTION_LOG (person_id, action_type)
    VALUES (NEW.person_id, 'CREATED');
    
    -- Returning the NEW row, as this is an INSERT trigger
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Creating the trigger
CREATE OR REPLACE TRIGGER person_insert_trigger
AFTER INSERT ON PERSON
FOR EACH ROW
EXECUTE FUNCTION person_insert_trigger_function();



--person delete trigger
CREATE OR REPLACE FUNCTION person_delete_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    -- Inserting data into ACTION_LOG table
    INSERT INTO ACTION_LOG (person_id, action_type)
    VALUES (OLD.person_id, 'DELETED');
    
    -- Returning the OLD row, as this is a DELETE trigger
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Creating the trigger
CREATE OR REPLACE TRIGGER person_delete_trigger
BEFORE DELETE ON PERSON
FOR EACH ROW
EXECUTE FUNCTION person_delete_trigger_function();






--store create trigger
CREATE OR REPLACE FUNCTION store_insert_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
		IF (SELECT COUNT(*) FROM manages WHERE storefront_id = NEW.storefront_id) > 1 THEN
			-- Inserting data into ACTION_LOG table
			INSERT INTO ACTION_LOG (person_id, storefront_id, action_type)
			VALUES (NEW.person_id, NEW.storefront_id, 'ADDED');
		ELSE
			INSERT INTO ACTION_LOG (person_id, storefront_id, action_type)
			VALUES (NEW.person_id, NEW.storefront_id, 'CREATED');
		END IF;
    -- Returning the NEW row, as this is an INSERT trigger
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Creating the trigger
CREATE OR REPLACE TRIGGER store_insert_trigger
AFTER INSERT ON manages
FOR EACH ROW
EXECUTE FUNCTION store_insert_trigger_function();





--product create trigger
CREATE OR REPLACE FUNCTION product_insert_trigger_function()
RETURNS TRIGGER AS $$
BEGIN

		-- Inserting data into ACTION_LOG table
		INSERT INTO ACTION_LOG (storefront_id, product_id, action_type)
		VALUES (NEW.storefront_id, NEW.product_id, 'CREATED');
		-- Returning the NEW row, as this is an INSERT trigger
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Creating the trigger
CREATE OR REPLACE TRIGGER product_insert_trigger
AFTER INSERT ON product
FOR EACH ROW
EXECUTE FUNCTION product_insert_trigger_function();






--product purchase trigger
CREATE OR REPLACE FUNCTION product_purchase_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    -- Updating data in product table
	UPDATE PRODUCT SET items_sold = (SELECT items_sold FROM PRODUCT WHERE product_id = NEW.product_id) + NEW.quantity WHERE product_id = NEW.product_id;
    
    -- Returning the NEW row, as this is an UPDATE trigger
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Creating the trigger
CREATE OR REPLACE TRIGGER product_purchase_trigger
AFTER INSERT ON ORDERS
FOR EACH ROW
EXECUTE FUNCTION product_purchase_trigger_function();