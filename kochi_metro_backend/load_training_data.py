import asyncio
import os
from app.db.client import db
from dotenv import load_dotenv

async def load_training_data():
    """
    This script loads the training data from large_training_data.sql
    into the database. Make sure the database is properly configured 
    via the DATABASE_URL in .env file.
    """
    print("Loading environment variables...")
    load_dotenv()
    
    print("Connecting to database...")
    await db.connect()
    
    # Read SQL file
    sql_file_path = "large_training_data.sql"
    if not os.path.exists(sql_file_path):
        print(f"SQL file not found: {sql_file_path}")
        print("Generating training data...")
        from generate_training_data import generate_sql_data
        generate_sql_data()
    
    print(f"Reading SQL from {sql_file_path}...")
    with open(sql_file_path, 'r') as f:
        sql_content = f.read()
    
    # Split into individual statements
    statements = [stmt.strip() for stmt in sql_content.split(';') if stmt.strip()]
    
    # Execute statements using raw SQL
    total_statements = len(statements)
    inserted_count = 0
    
    print(f"Found {total_statements} SQL statements to execute")
    print("Deleting existing historical outcomes...")
    
    # First delete existing records
    await db.historical_outcomes.delete_many()
    
    print("Inserting new training data...")
    # Then insert new ones (skip the DELETE statement which should be the first one)
    for i, stmt in enumerate(statements[1:], 1):
        if "INSERT INTO historical_outcomes" in stmt:
            # Execute raw SQL directly - a safer approach for bulk loading
            try:
                await db.execute_raw(stmt + ";")
                inserted_count += 1
                
                # Print progress
                if i % 100 == 0:
                    print(f"Progress: {i}/{total_statements-1} records inserted")
            except Exception as e:
                print(f"Error inserting record {i}: {e}")
    
    print(f"✅ Successfully inserted {inserted_count} training records")
    
    # Verify the data was loaded
    count = await db.historical_outcomes.count()
    print(f"Total historical_outcomes in database: {count}")
    
    # Disconnect from DB
    await db.disconnect()
    
    print("Done! You can now train the model with the loaded data.")

if __name__ == "__main__":
    asyncio.run(load_training_data())

if __name__ == "__main__":
    asyncio.run(load_training_data())
