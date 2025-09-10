#!/usr/bin/env python3
"""
Quick database setup for ML training.
Creates minimal data to test the ML training pipeline.
"""

import asyncio
import random
from datetime import datetime, timedelta
from decimal import Decimal
from app.db.client import db

async def main():
    """Quick setup for testing."""
    print("🚀 Quick database setup for ML training...")
    
    try:
        await db.connect()
        print("✅ Connected to database")
        
        # Clear existing data
        await db.historical_outcomes.delete_many()
        await db.assets.delete_many()
        print("🧹 Cleared existing data")
        
        # Create minimal assets first
        print("Creating 25 train assets...")
        for i in range(1, 26):
            await db.assets.create(data={
                "asset_id": f"KMRL_T{i:03d}",
                "asset_num": f"T{i:03d}",
                "description": f"Train Set {i:03d}",
                "asset_type": "TRAINSET",
                "status": "OPERATING",
                "location": "ALUVA_DEPOT" if i % 2 == 0 else "MUTTOM_DEPOT",
                "manufacturer": "Alstom",
                "model": "Metropolis",
                "total_distance_km": Decimal(random.uniform(50000, 150000)),
                "operating_hours": Decimal(random.uniform(10000, 30000)),
            })
        print("✅ Created 25 train assets")
        
        # Create historical outcomes for ML training
        print("Creating historical outcomes...")
        assets = await db.assets.find_many()
        
        batch_size = 1000
        total_records = 50000  # Increased for better ML performance
        created = 0
        
        for i in range(0, total_records, batch_size):
            batch_data = []
            for j in range(batch_size):
                if created >= total_records:
                    break
                    
                asset = random.choice(assets)
                
                # Generate realistic data with more variety
                days_ago = random.randint(1, 1095)  # Extended to 3 years
                event_date = datetime.now() - timedelta(days=days_ago)
                days_since_maint = random.randint(1, 400)  # Extended range
                
                # More realistic mileage based on asset age and usage
                base_mileage = float(asset.total_distance_km or 75000)
                # Vary mileage based on time and asset
                age_factor = days_ago / 1095  # Age as fraction of 3 years
                mileage = Decimal(base_mileage * (0.3 + age_factor * 0.8) + random.uniform(-20000, 20000))
                mileage = max(Decimal(10000), mileage)  # Minimum realistic mileage
                
                # Enhanced failure probability logic with multiple factors
                failure_risk = 0.03  # Base 3% failure rate
                
                # Maintenance overdue factor
                if days_since_maint > 240:
                    failure_risk += 0.12
                elif days_since_maint > 180:
                    failure_risk += 0.08
                elif days_since_maint > 120:
                    failure_risk += 0.04
                
                # High mileage factor
                if mileage > 150000:
                    failure_risk += 0.20
                elif mileage > 120000:
                    failure_risk += 0.12
                elif mileage > 90000:
                    failure_risk += 0.06
                
                # Combined risk amplification
                if days_since_maint > 200 and mileage > 120000:
                    failure_risk += 0.15  # High risk combination
                
                # Age-related deterioration
                if days_ago > 730:  # Older than 2 years
                    failure_risk += 0.05
                
                # Seasonal patterns (winter months higher failure rate)
                month = event_date.month
                if month in [12, 1, 2]:  # Winter months
                    failure_risk += 0.03
                
                # Cap maximum failure rate
                failure_risk = min(failure_risk, 0.45)
                
                failure_occurred = random.random() < failure_risk
                
                # More diverse maintenance types
                maintenance_types = ["PREVENTIVE", "CORRECTIVE", "INSPECTION", "OVERHAUL", "EMERGENCY"]
                weights = [0.4, 0.25, 0.2, 0.1, 0.05]
                
                batch_data.append({
                    "asset_id": asset.asset_id,
                    "event_date": event_date,
                    "mileage_at_event": mileage,
                    "hours_at_event": Decimal(float(mileage) / random.uniform(35, 85)),  # Variable speed
                    "days_since_last_maint": days_since_maint,
                    "maintenance_type": random.choices(maintenance_types, weights=weights)[0],
                    "failure_occurred": failure_occurred,
                    "failure_severity": random.choices(
                        ["LOW", "MEDIUM", "HIGH", "CRITICAL"], 
                        weights=[0.5, 0.3, 0.15, 0.05]
                    )[0] if failure_occurred else None,
                    "cost_impact": Decimal(random.uniform(2000, 80000)) if failure_occurred else Decimal(0),
                    "downtime_hours": Decimal(random.uniform(1, 72)) if failure_occurred else Decimal(0),
                })
                created += 1
            
            if batch_data:
                await db.historical_outcomes.create_many(data=batch_data)
                print(f"...created {created}/{total_records} records")
        
        print(f"✅ Created {total_records} historical records")
        print("🎉 Quick setup completed successfully!")
        
    except Exception as e:
        print(f"❌ Error during setup: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        await db.disconnect()
        print("👋 Disconnected from database")

if __name__ == "__main__":
    asyncio.run(main())
