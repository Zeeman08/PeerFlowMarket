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
	IF CURR_GROUP IS NULL THEN
		CURR_GROUP := 1;
	END IF;
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

	--inserting into PLSQ_LOG
	INSERT INTO PLSQL_LOG (PERSON_ID, FUNCTION_NAME, PARAMETERS)
	VALUES (input_person_id, 'process_cart_and_transactions', 'PARAMETERS {input_person_id: ' || input_person_id || ' X: ' || X || '}');
END $$;


--delete product procedure

CREATE OR REPLACE PROCEDURE delete_product_procedure(IN prdid INT, IN pid INT)
LANGUAGE plpgsql
AS $$
DECLARE
	storeid INTEGER;
BEGIN
	INSERT INTO DELETED_PRODUCT (PRODUCT_ID, STOREFRONT_ID, PRODUCT_NAME, PRODUCT_DESCRIPTION, PRICE)
		SELECT PRODUCT_ID, STOREFRONT_ID, PRODUCT_NAME, PRODUCT_DESCRIPTION, PRICE FROM PRODUCT WHERE PRODUCT_ID = prdid;

	SELECT STOREFRONT_ID INTO storeid FROM PRODUCT WHERE PRODUCT_ID = prdid;

	INSERT INTO ACTION_LOG (storefront_id, product_id, action_type) VALUES(storeid, prdid, 'DELETE');

	DELETE FROM PRODUCT WHERE PRODUCT_ID = prdid;
	
	DELETE FROM tag_assignment WHERE PRODUCT_ID = prdid;

	--inserting into PLSQ_LOG
	INSERT INTO PLSQL_LOG (PERSON_ID, FUNCTION_NAME, PARAMETERS)
	VALUES (pid, 'delete_product_procedure', 'PARAMETERS {prdid: ' || prdid || ' pid: ' || pid || '}');
END $$;


--delete store procedure

CREATE OR REPLACE PROCEDURE delete_storefront_procedure(IN pid INT, IN strid INT)
LANGUAGE plpgsql
AS $$
DECLARE
	i PRODUCT%ROWTYPE;
BEGIN
	INSERT INTO DELETED_STOREFRONT (STOREFRONT_ID, STOREFRONT_NAME, STOREFRONT_DESCRIPTION)
		SELECT STOREFRONT_ID, STOREFRONT_NAME, STOREFRONT_DESCRIPTION FROM STOREFRONT WHERE STOREFRONT_ID = strid;

	INSERT INTO ACTION_LOG (person_id, storefront_id, action_type) VALUES(pid, strid, 'DELETE');

	FOR i IN (SELECT * FROM PRODUCT WHERE STOREFRONT_ID = strid)
	LOOP
		CALL delete_product_procedure(i.product_id, pid);
	END LOOP;

	DELETE FROM STOREFRONT WHERE STOREFRONT_ID = strid;

	
	--inserting into PLSQ_LOG
	INSERT INTO PLSQL_LOG (PERSON_ID, FUNCTION_NAME, PARAMETERS)
	VALUES (pid, 'delete_storefront_procedure', 'PARAMETERS {pid: ' || pid || ' strid: ' || strid || '}');
END $$;


--delete person procedure

CREATE OR REPLACE PROCEDURE delete_person_procedure(IN pid INT)
LANGUAGE plpgsql
AS $$
DECLARE
	R MANAGES%ROWTYPE;
	managercount INT;
BEGIN
	INSERT INTO DELETED_PERSON (PERSON_ID, PERSON_NAME, DATE_OF_BIRTH, PHONE, EMAIL)
		SELECT PERSON_ID, PERSON_NAME, DATE_OF_BIRTH, PHONE, EMAIL FROM PERSON WHERE PERSON_ID = pid;

	INSERT INTO ACTION_LOG (person_id, action_type) VALUES(pid, 'DELETE');

	CALL clear_cart_procedure(pid);

	FOR R in (SELECT * FROM MANAGES WHERE PERSON_ID = pid)
	LOOP
		SELECT COUNT(*) INTO managercount FROM MANAGES WHERE STOREFRONT_ID = R.STOREFRONT_ID;
		IF managercount = 1 THEN
			CALL delete_storefront_procedure(pid, R.STOREFRONT_ID);
		END IF;
	END LOOP;


	DELETE FROM PERSON WHERE PERSON_ID = pid;

	--inserting into PLSQ_LOG
	INSERT INTO PLSQL_LOG (PERSON_ID, FUNCTION_NAME, PARAMETERS)
	VALUES (pid, 'delete_person_procedure', 'PARAMETERS {pid: ' || pid || '}');
END $$;


--clear cart
CREATE OR REPLACE PROCEDURE clear_cart_procedure(
	IN pid INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
	i CART%ROWTYPE;
BEGIN
	FOR i IN (SELECT * FROM CART WHERE PERSON_ID = pid)
	LOOP
		UPDATE PRODUCT SET STOCK_COUNT = STOCK_COUNT + i.quantity WHERE PRODUCT_ID = i.product_id;
	END LOOP;
	DELETE FROM CART WHERE PERSON_ID = pid;

	--inserting into PLSQ_LOG
	INSERT INTO PLSQL_LOG (PERSON_ID, FUNCTION_NAME, PARAMETERS)
	VALUES (pid, 'clear_cart_procedure', 'PARAMETERS {pid: ' || pid || '}');
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
	--inserting into PLSQ_LOG
	INSERT INTO PLSQL_LOG (PERSON_ID, FUNCTION_NAME, PARAMETERS)
	VALUES (NULL, 'check_credentials_function', 'PARAMETERS {phone_in: ' || phone_in || ' email_in: ' || email_in || '}');

    phonelen := LENGTH(phone_in);
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



--check add to cart
CREATE OR REPLACE FUNCTION add_to_cart_function(
	IN pid INTEGER,
	IN prdid INTEGER,
	IN qty INTEGER
)
RETURNS BOOLEAN AS
$$
DECLARE
	currstock INTEGER;
BEGIN
	--inserting into PLSQ_LOG
	INSERT INTO PLSQL_LOG (PERSON_ID, FUNCTION_NAME, PARAMETERS)
	VALUES (pid, 'add_to_cart_function', 'PARAMETERS {pid: ' || pid || ' prdid: ' || prdid || ' qty: ' || qty || '}');

	SELECT STOCK_COUNT INTO currstock FROM PRODUCT WHERE PRODUCT_ID = prdid;
	IF qty > currstock THEN
		RETURN FALSE;
	ELSE
		INSERT INTO CART (PERSON_ID, PRODUCT_ID, QUANTITY) VALUES (pid, prdid, qty) ON CONFLICT (PERSON_ID, PRODUCT_ID) DO UPDATE SET QUANTITY = CART.QUANTITY + EXCLUDED.QUANTITY;
		UPDATE PRODUCT SET STOCK_COUNT = STOCK_COUNT - qty WHERE PRODUCT_ID = prdid;
		RETURN TRUE;
	END IF;
END;
$$
LANGUAGE plpgsql;



--find manager function
CREATE OR REPLACE FUNCTION is_manager_of_product(per_id INT, prod_id INT)
RETURNS INT AS $$
DECLARE
	RES INT;
BEGIN
	--inserting into PLSQ_LOG
	INSERT INTO PLSQL_LOG (PERSON_ID, FUNCTION_NAME, PARAMETERS)
	VALUES (per_id, 'is_manager_of_product', 'PARAMETERS {per_id: ' || pid || ' prod_id: ' || prod_id || '}');

	SELECT M.PERSON_ID INTO RES
	FROM PRODUCT P JOIN STOREFRONT S ON(S.STOREFRONT_ID = P.STOREFRONT_ID) JOIN MANAGES M ON (S.STOREFRONT_ID = M.STOREFRONT_ID)
	WHERE P.PRODUCT_ID = prod_id and M.PERSON_ID = per_id;
	if RES IS NULL THEN
		RETURN 0;
	ELSE 
		RETURN 1;
	END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION is_manager_of_storefront(per_id int, s_id int)
  RETURNS int
AS $$
DECLARE
    RES INT;
BEGIN
	--inserting into PLSQ_LOG
	INSERT INTO PLSQL_LOG (PERSON_ID, FUNCTION_NAME, PARAMETERS)
	VALUES (per_id, 'is_manager_of_storefront', 'PARAMETERS {per_id: ' || per_id || ' s_id: ' || s_id || '}');

    SELECT COUNT(*) INTO RES 
    FROM MANAGES 
    WHERE PERSON_ID = per_id AND STOREFRONT_ID = s_id;
    RETURN RES;
END;
$$ LANGUAGE plpgsql;


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