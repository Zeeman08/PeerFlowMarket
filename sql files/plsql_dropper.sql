-- Drop the trigger
DROP TRIGGER IF EXISTS person_insert_trigger ON PERSON;

-- Drop the trigger function
DROP FUNCTION IF EXISTS person_insert_trigger_function();

-- Drop the trigger
DROP TRIGGER IF EXISTS person_delete_trigger ON PERSON;

-- Drop the trigger function
DROP FUNCTION IF EXISTS person_delete_trigger_function();

-- Drop the trigger
DROP TRIGGER IF EXISTS store_insert_trigger ON MANAGES;

-- Drop the trigger function
DROP FUNCTION IF EXISTS store_insert_trigger_function();

-- Drop the trigger
DROP TRIGGER IF EXISTS product_insert_trigger ON PRODUCT;

-- Drop the trigger function
DROP FUNCTION IF EXISTS product_insert_trigger_function();