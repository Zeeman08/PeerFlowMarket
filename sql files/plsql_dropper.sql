-- Drop the procedure

DROP PROCEDURE IF EXISTS process_cart_and_transactions(INT, TEXT);
DROP PROCEDURE IF EXISTS delete_person_procedure(INT);
DROP PROCEDURE IF EXISTS delete_storefront_procedure(INT, INT);
DROP PROCEDURE IF EXISTS delete_product_procedure(INT);
DROP PROCEDURE IF EXISTS clear_cart_procedure(INT);

--Drop the function

DROP FUNCTION IF EXISTS check_credentials_function(TEXT, TEXT);
DROP FUNCTION IF EXISTS add_to_cart_function(INT, INT, INT);
DROP FUNCTION IF EXISTS is_manager_of_product(INT, INT);

-- Drop the trigger
-- Drop the trigger function

DROP TRIGGER IF EXISTS person_insert_trigger ON PERSON;
DROP FUNCTION IF EXISTS person_insert_trigger_function();


DROP TRIGGER IF EXISTS store_insert_trigger ON MANAGES;
DROP FUNCTION IF EXISTS store_insert_trigger_function();


DROP TRIGGER IF EXISTS product_insert_trigger ON PRODUCT;
DROP FUNCTION IF EXISTS product_insert_trigger_function();


DROP TRIGGER IF EXISTS product_purchase_trigger ON ORDERS;
DROP FUNCTION IF EXISTS product_purchase_trigger_function();