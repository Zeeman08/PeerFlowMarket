-- Drop the trigger
DROP TRIGGER IF EXISTS person_insert_trigger ON PERSON;

-- Drop the trigger function
DROP FUNCTION IF EXISTS person_insert_trigger_function();

-- Drop the trigger
DROP TRIGGER IF EXISTS person_delete_trigger ON PERSON;

-- Drop the trigger function
DROP FUNCTION IF EXISTS person_delete_trigger_function();