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


--delete person procedure

CREATE OR REPLACE PROCEDURE delete_person_procedure(IN pid INT)
LANGUAGE plpgsql
AS $$
DECLARE
	act_typ INTEGER;
BEGIN
	INSERT INTO DELETED_PERSON (PERSON_ID, PERSON_NAME, DATE_OF_BIRTH, PHONE, EMAIL)
		SELECT PERSON_ID, PERSON_NAME, DATE_OF_BIRTH, PHONE, EMAIL FROM PERSON WHERE PERSON_ID = pid;

	INSERT INTO ACTION_LOG (person_id, action_type) VALUES(pid, 'DELETE');

	DELETE FROM PERSON WHERE PERSON_ID = pid;
END $$;


--delete product procedure

CREATE OR REPLACE PROCEDURE delete_product_procedure(IN pid INT, IN prdid INT)
LANGUAGE plpgsql
AS $$
DECLARE
BEGIN
	INSERT INTO DELETED_PRODUCT (PRODUCT_ID, STOREFRONT_ID, PRODUCT_NAME, PRODUCT_DESCRIPTION, PRICE)
		SELECT PRODUCT_ID, STOREFRONT_ID, PRODUCT_NAME, PRODUCT_DESCRIPTION, PRICE FROM PRODUCT WHERE PRODUCT_ID = prdid;

	INSERT INTO ACTION_LOG (person_id, product_id, action_type) VALUES(pid, prdid, 'DELETE');

	DELETE FROM PRODUCT WHERE PRODUCT_ID = prdid;
END $$;


--delete store procedure

CREATE OR REPLACE PROCEDURE delete_storefront_procedure(IN pid INT, IN strid INT)
LANGUAGE plpgsql
AS $$
DECLARE
BEGIN
	INSERT INTO DELETED_STOREFRONT (STOREFRONT_ID, STOREFRONT_NAME, STOREFRONT_DESCRIPTION)
		SELECT STOREFRONT_ID, STOREFRONT_NAME, STOREFRONT_DESCRIPTION FROM STOREFRONT WHERE STOREFRONT_ID = strid;

	INSERT INTO ACTION_LOG (person_id, storefront_id, action_type) VALUES(pid, strid, 'DELETE');

	FOR i IN (SELECT PRODUCT_ID FROM PRODUCT WHERE STOREFRONT_ID = strid)
	LOOP
		PERFORM delete_product_procedure(pid, i.product_id);
	END LOOP;

	DELETE FROM STOREFRONT WHERE STOREFRONT_ID = pid;
END $$;






--FUNCTIONS

--check reg parameters
CREATE OR REPLACE FUNCTION check_credentials_function(
    IN phone_in TEXT,
	IN email_in TEXT
)
RETURNS BOOLEAN AS
$$
DECLARE
	emailcount INT;
	phonecount INT;
	phonelen INT;
BEGIN
    phonelen := LENGTH(phone);
	SELECT COUNT(*) INTO phonecount FROM PERSON WHERE PHONE = phone_in;
	SELECT COUNT(*) INTO emailcount FROM PERSON WHERE EMAIL = email_in;
	IF phonecount > 0 OR emailcount > 0 OR phonelen != 11 THEN
		RETURN FALSE;
	ELSE
		RETURN TRUE;
	END IF;
END;
$$
LANGUAGE plpgsql;






--TRIGGERS

--person create trigger
CREATE OR REPLACE FUNCTION person_insert_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    -- Inserting data into ACTION_LOG table
    INSERT INTO ACTION_LOG (person_id, action_type)
    VALUES (NEW.person_id, 'CREATE');
    
    -- Returning the NEW row, as this is an INSERT trigger
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Creating the trigger
CREATE OR REPLACE TRIGGER person_insert_trigger
AFTER INSERT ON PERSON
FOR EACH ROW
EXECUTE FUNCTION person_insert_trigger_function();


--store create trigger
CREATE OR REPLACE FUNCTION store_insert_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
		IF (SELECT COUNT(*) FROM manages WHERE storefront_id = NEW.storefront_id) > 1 THEN
			-- Inserting data into ACTION_LOG table
			INSERT INTO ACTION_LOG (person_id, storefront_id, action_type)
			VALUES (NEW.person_id, NEW.storefront_id, 'ADD');
		ELSE
			INSERT INTO ACTION_LOG (person_id, storefront_id, action_type)
			VALUES (NEW.person_id, NEW.storefront_id, 'CREATE');
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
		VALUES (NEW.storefront_id, NEW.product_id, 'CREATE');
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























--person delete trigger
CREATE OR REPLACE FUNCTION person_delete_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    -- Inserting data into ACTION_LOG table
    INSERT INTO ACTION_LOG (person_id, action_type)
    VALUES (OLD.person_id, 'DELETE');
    
    -- Returning the OLD row, as this is a DELETE trigger
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Creating the trigger
CREATE OR REPLACE TRIGGER person_delete_trigger
BEFORE DELETE ON PERSON
FOR EACH ROW
EXECUTE FUNCTION person_delete_trigger_function();