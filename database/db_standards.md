1. Every primary table needs to have `created_at`, `updated_at` and `deleted_at` columns
2. If the tables are expected to used during run time then the tables should also have `created_by`and `updated_by`
3. If created_at, updated_at and deleted_at columns are added to the table then a custom DB proc function(update_updated_at_column) needs to be attached to the newly created table
Query for the attaching the method:
```
CREATE TRIGGER set_updated_at_<table_name>
BEFORE UPDATE ON <table_name>
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
``` 
4. If created_by and updated_by columns are added to the table then a custom DB proc function(update_updated_at_column) needs to be attached to the newly created table
```
CREATE TRIGGER audit_<table_name>
BEFORE INSERT OR UPDATE ON <table_name>
FOR EACH ROW
EXECUTE FUNCTION update_audit_columns();
```



----- To Do ------
New tables need a brand id FK