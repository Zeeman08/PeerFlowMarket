	
-- procedure for checking out
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
		
		INSERT INTO ORDERS (PRODUCT_ID, QUANTITY, PERSON_ID, TRANSACTION_ID, GROUP_ID)
		SELECT PRODUCT_ID, QUANTITY, PERSON_ID, row_data2.transaction_id, CURR_GROUP
		FROM CART C JOIN PRODUCT P USING(PRODUCT_ID)
		WHERE PERSON_ID = row_data2.person_id AND STOREFRONT_ID = row_data2.storefront_id;
		
			
	END LOOP;
	DELETE 
	FROM CART
	WHERE PERSON_ID = INPUT_PERSON_ID;
END $$;

