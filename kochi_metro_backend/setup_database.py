#!/usr/bin/env python3
"""
Database setup script for KMRL Metro Backend.
Creates assets, historical outcomes, and other necessary data.
"""

import asyncio
import random
from datetime import datetime, timedelta, date
from decimal import Decimal
from app.db.client import db

async def create_assets():
    """Create 25 KMRL train assets."""
    print("Creating train assets...")
    
    assets_data = []
    for i in range(1, 26):
        asset_id = f"KMRL_T{i:03d}"
        asset_num = f"T{i:03d}"
        
        # Vary installation dates over past 5 years
        install_date = datetime.now() - timedelta(days=random.randint(365, 1825))
        
        # Realistic operating hours and distance
        days_in_service = (datetime.now() - install_date).days
        operating_hours = Decimal(days_in_service * random.uniform(8, 16))  # 8-16 hours/day
        total_distance = Decimal(days_in_service * random.uniform(200, 800))  # 200-800 km/day
        
        assets_data.append({
            "asset_id": asset_id,
            "asset_num": asset_num,
            "description": f"Alstom Metropolis Train Set {asset_num}",
            "asset_type": "TRAINSET",
            "classification": "PASSENGER",
            "status": "OPERATING",
            "location": random.choice(["ALUVA_DEPOT", "MUTTOM_DEPOT"]),
            "manufacturer": "Alstom",
            "model": "Metropolis",
            "serial_number": f"ALS_{i:04d}_{random.randint(1000, 9999)}",
            "installation_date": install_date,
            "operating_hours": operating_hours,
            "total_distance_km": total_distance,
            "criticality": random.choice(["HIGH", "MEDIUM", "MEDIUM", "LOW"]),  # Weighted
        })
    
    # Batch create assets
    await db.assets.create_many(data=assets_data)
    print(f"✅ Created {len(assets_data)} train assets")

async def create_historical_outcomes():
    """Create realistic historical outcomes for ML training."""
    print("Creating historical outcomes...")
    
    # Get all assets
    assets = await db.assets.find_many()
    if not assets:
        print("❌ No assets found. Please create assets first.")
        return
    
    outcomes_data = []
    batch_size = 1000
    total_records = 20000  # Reduced for faster testing
    
    for i in range(total_records):
        asset = random.choice(assets)
        
        # Generate realistic event date (past 2 years)
        days_ago = random.randint(1, 730)
        event_date = datetime.now() - timedelta(days=days_ago)
        
        # Generate realistic maintenance intervals
        days_since_maint = random.randint(1, 365)
        
        # Base mileage from asset's total distance, adjusted for event date
        base_mileage = float(asset.total_distance_km or 50000)
        # Adjust for when the event occurred
        mileage_at_event = Decimal(base_mileage * random.uniform(0.3, 1.2))
        
        # Failure probability based on days since maintenance and mileage
        failure_risk = 0.02  # Base 2% failure rate
        if days_since_maint > 180:
            failure_risk += 0.05
        if days_since_maint > 300:
            failure_risk += 0.15
        if mileage_at_event > 100000:
            failure_risk += 0.08
        if mileage_at_event > 150000:
            failure_risk += 0.20
        
        failure_occurred = random.random() < failure_risk
        
        outcomes_data.append({
            "asset_id": asset.asset_id,
            "event_date": event_date,
            "mileage_at_event": mileage_at_event,
            "hours_at_event": Decimal(float(mileage_at_event) / random.uniform(40, 80)),  # Speed variation
            "days_since_last_maint": days_since_maint,
            "maintenance_type": random.choice(["PREVENTIVE", "CORRECTIVE", "INSPECTION"]),
            "failure_occurred": failure_occurred,
            "failure_severity": random.choice(["LOW", "MEDIUM", "HIGH"]) if failure_occurred else None,
            "cost_impact": Decimal(random.uniform(1000, 50000)) if failure_occurred else Decimal(0),
            "downtime_hours": Decimal(random.uniform(2, 48)) if failure_occurred else Decimal(0),
        })
        
        # Batch insert every 1000 records
        if len(outcomes_data) >= batch_size:
            await db.historical_outcomes.create_many(data=outcomes_data)
            outcomes_data = []
            print(f"...inserted {i+1}/{total_records} records")
    
    # Insert remaining records
    if outcomes_data:
        await db.historical_outcomes.create_many(data=outcomes_data)
    
    print(f"✅ Created {total_records} historical outcome records")

async def create_certificates():
    """Create asset certificates."""
    print("Creating asset certificates...")
    
    assets = await db.assets.find_many()
    cert_types = ["FITNESS", "SAFETY", "TELECOM", "SIGNALING", "BRAKING"]
    
    certificates_data = []
    for asset in assets:
        for cert_type in cert_types:
            # Some certificates might be expired for testing
            if random.random() < 0.1:  # 10% chance of expired cert
                expiry_date = datetime.now() - timedelta(days=random.randint(1, 365))
            else:
                expiry_date = datetime.now() + timedelta(days=random.randint(30, 730))
            
            certificates_data.append({
                "asset_id": asset.asset_id,
                "certificate_type": cert_type,
                "certificate_number": f"{cert_type}_{asset.asset_num}_{random.randint(1000, 9999)}",
                "issue_date": expiry_date - timedelta(days=365),
                "expiry_date": expiry_date,
                "issuing_authority": f"KMRL_{cert_type}_DEPT",
                "status": "ACTIVE" if expiry_date > datetime.now() else "EXPIRED"
            })
    
    # Use individual creates instead of create_many for auto-generated IDs
    for cert_data in certificates_data:
        await db.asset_certificates.create(data=cert_data)
    print(f"✅ Created {len(certificates_data)} certificates")

async def create_work_orders():
    """Create work orders."""
    print("Creating work orders...")
    
    assets = await db.assets.find_many()
    work_orders_data = []
    
    for asset in assets:
        # Each asset gets 1-3 work orders
        num_orders = random.randint(1, 3)
        for _ in range(num_orders):
            scheduled_start = datetime.now() - timedelta(days=random.randint(1, 30))
            
            wo_status = random.choice(["APPROVED", "INPRG", "COMP", "CLOSE"])
            if wo_status in ["COMP", "CLOSE"]:
                actual_finish = scheduled_start + timedelta(hours=random.randint(2, 24))
            else:
                actual_finish = None
            
            work_orders_data.append({
                "wo_num": f"WO_{asset.asset_num}_{random.randint(1000, 9999)}",
                "asset_id": asset.asset_id,
                "wo_type": random.choice(["PM", "CM", "INSPECTION"]),
                "wo_status": wo_status,
                "priority": random.randint(1, 5),
                "description": random.choice([
                    "Routine maintenance check",
                    "HVAC system malfunction - cooling not adequate",
                    "Door mechanism inspection",
                    "Brake system service",
                    "Electrical system check",
                    "Bogie inspection"
                ]),
                "scheduled_start": scheduled_start,
                "actual_finish": actual_finish,
                "total_cost": Decimal(random.uniform(5000, 25000))
            })
    
    await db.work_orders.create_many(data=work_orders_data)
    print(f"✅ Created {len(work_orders_data)} work orders")

async def create_branding_campaigns():
    """Create branding campaigns."""
    print("Creating branding campaigns...")
    
    assets = await db.assets.find_many()
    campaigns_data = []
    
    advertisers = ["Coca Cola", "Samsung", "HDFC Bank", "Airtel", "Honda", "LG Electronics"]
    
    for asset in assets:
        if random.random() < 0.7:  # 70% of assets have branding
            advertiser = random.choice(advertisers)
            start_date = datetime.now() - timedelta(days=random.randint(0, 180))
            end_date = start_date + timedelta(days=random.randint(90, 365))
            
            required_hours = random.randint(1000, 3000)
            achieved_hours = random.randint(int(required_hours * 0.6), required_hours + 200)
            
            campaigns_data.append({
                "asset_id": asset.asset_id,
                "advertiser_name": advertiser,
                "campaign_name": f"{advertiser} Metro Campaign 2024",
                "start_date": start_date,
                "end_date": end_date,
                "contract_value": Decimal(random.uniform(100000, 500000)),
                "minimum_hours_required": required_hours,
                "actual_hours_served": achieved_hours,
                "sla_compliance_percentage": Decimal(min(100, (achieved_hours / required_hours) * 100)),
            })
    
    await db.branding_campaigns.create_many(data=campaigns_data)
    print(f"✅ Created {len(campaigns_data)} branding campaigns")

async def main():
    """Main setup function."""
    print("🚀 Starting KMRL database setup...")
    
    try:
        await db.connect()
        print("✅ Connected to database")
        
        # Clear existing data (optional)
        await db.historical_outcomes.delete_many()
        await db.branding_campaigns.delete_many()
        await db.work_orders.delete_many()
        await db.asset_certificates.delete_many()
        await db.assets.delete_many()
        print("🧹 Cleared existing data")
        
        # Create data in proper order
        await create_assets()
        await create_certificates()
        await create_work_orders()
        await create_branding_campaigns()
        await create_historical_outcomes()
        
        print("🎉 Database setup completed successfully!")
        
    except Exception as e:
        print(f"❌ Error during setup: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        await db.disconnect()
        print("👋 Disconnected from database")

if __name__ == "__main__":
    asyncio.run(main())
