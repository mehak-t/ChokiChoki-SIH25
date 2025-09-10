import random
from datetime import datetime, timedelta

def generate_sql_data(num_records=100000, output_filename="historical_data_100k.sql"):
    """
    Generates a large, realistic SQL script of INSERT statements
    for the historical_outcomes table.
    """
    print(f"Starting SQL data generation for {num_records} records...")
    
    sql_statements = []
    
    # Start by clearing existing historical data to ensure a clean slate.
    # TRUNCATE is faster than DELETE for large tables.
    sql_statements.append("TRUNCATE TABLE historical_outcomes RESTART IDENTITY;")
    sql_statements.append("\n-- Generated Realistic Training Data --\n")

    asset_ids = [1, 2, 3, 4, 5] # Corresponds to T01, T02, etc.
    start_date = datetime(2020, 1, 1) # ~5 years of historical data

    for i in range(num_records):
        asset_id = random.choice(asset_ids)
        # Generate a random date over the last ~5 years
        event_date = start_date + timedelta(days=random.randint(0, 1825))
        
        # Generate realistic, correlated data
        mileage = random.randint(5000, 150000)
        days_maint = random.randint(5, 365)
        
        # --- Core Logic: Make failures more probable with bad conditions ---
        failure_prob = (mileage / 150000) * 0.5 + (days_maint / 365) * 0.5
        
        failure_occurred = 'true' if random.random() < failure_prob else 'false'
        
        # Make overall failures rarer to mimic reality (e.g., ~12-15% failure rate)
        if random.random() > 0.15 and failure_occurred == 'true':
            failure_occurred = 'false'

        sql = (
            f"INSERT INTO historical_outcomes (asset_id, event_date, mileage_at_event, days_since_last_maint, failure_occurred) VALUES "
            f"({asset_id}, '{event_date.strftime('%Y-%m-%d')}', {mileage}, {days_maint}, {failure_occurred});"
        )
        sql_statements.append(sql)
        
        if (i + 1) % 10000 == 0:
            print(f"...generated {i + 1}/{num_records} records...")

    with open(output_filename, "w") as f:
        f.write("\n".join(sql_statements))
    
    print(f"✅ Successfully generated {num_records} INSERT statements into {output_filename}")

if __name__ == "__main__":
    generate_sql_data()
