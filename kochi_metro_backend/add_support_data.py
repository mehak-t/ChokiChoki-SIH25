#!/usr/bin/env python3
"""
Add certificates and work orders to existing database.
"""

import asyncio
import random
from datetime import datetime, timedelta
from decimal import Decimal
from app.db.client import db

async def add_supporting_data():
    """Add certificates and work orders to the existing database."""
    print("🚀 Adding certificates and work orders...")
    
    try:
        await db.connect()
        print("✅ Connected to database")
        
        # Get all assets
        assets = await db.assets.find_many()
        print(f"Found {len(assets)} assets")
        
        # Create certificates for better rules engine testing
        print("Creating asset certificates...")
        cert_types = ["FITNESS", "SAFETY", "TELECOM", "SIGNALING", "BRAKING"]
        
        for asset in assets:
            for cert_type in cert_types:
                # Some certificates might be expired for testing
                if random.random() < 0.15:  # 15% chance of expired cert
                    expiry_date = datetime.now() - timedelta(days=random.randint(1, 180))
                else:
                    expiry_date = datetime.now() + timedelta(days=random.randint(30, 730))
                
                await db.asset_certificates.create(data={
                    "asset_id": asset.asset_id,
                    "certificate_type": cert_type,
                    "certificate_number": f"{cert_type}_{asset.asset_num}_{random.randint(1000, 9999)}",
                    "issue_date": expiry_date - timedelta(days=365),
                    "expiry_date": expiry_date,
                    "issuing_authority": f"KMRL_{cert_type}_DEPT",
                    "status": "ACTIVE" if expiry_date > datetime.now() else "EXPIRED"
                })
        
        print(f"✅ Created certificates for {len(assets)} assets")
        
        # Create work orders
        print("Creating work orders...")
        for asset in assets:
            # Each asset gets 1-3 work orders
            num_orders = random.randint(1, 3)
            for _ in range(num_orders):
                scheduled_start = datetime.now() - timedelta(days=random.randint(1, 60))
                
                wo_status = random.choice(["APPROVED", "INPRG", "COMP", "CLOSE"])
                if wo_status in ["COMP", "CLOSE"]:
                    actual_finish = scheduled_start + timedelta(hours=random.randint(2, 48))
                else:
                    actual_finish = None
                
                await db.work_orders.create(data={
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
                        "Bogie inspection",
                        "Pantograph maintenance",
                        "Traction motor service"
                    ]),
                    "scheduled_start": scheduled_start,
                    "actual_finish": actual_finish,
                    "total_cost": Decimal(random.uniform(5000, 35000))
                })
        
        print(f"✅ Created work orders for {len(assets)} assets")
        
        # Create branding campaigns
        print("Creating branding campaigns...")
        advertisers = ["Coca Cola", "Samsung", "HDFC Bank", "Airtel", "Honda", "LG Electronics", "Maruti Suzuki", "Flipkart"]
        
        for asset in assets:
            if random.random() < 0.6:  # 60% of assets have branding
                advertiser = random.choice(advertisers)
                start_date = datetime.now() - timedelta(days=random.randint(0, 200))
                end_date = start_date + timedelta(days=random.randint(120, 400))
                
                required_hours = random.randint(1500, 4000)
                achieved_hours = random.randint(int(required_hours * 0.5), required_hours + 300)
                
                await db.branding_campaigns.create(data={
                    "asset_id": asset.asset_id,
                    "advertiser_name": advertiser,
                    "campaign_name": f"{advertiser} Metro Campaign 2024-25",
                    "start_date": start_date,
                    "end_date": end_date,
                    "contract_value": Decimal(random.uniform(150000, 750000)),
                    "minimum_hours_required": required_hours,
                    "actual_hours_served": achieved_hours,
                    "sla_compliance_percentage": Decimal(min(100, (achieved_hours / required_hours) * 100)),
                })
        
        print("✅ Created branding campaigns")
        
        # Verify data
        total_outcomes = await db.historical_outcomes.count()
        total_certs = await db.asset_certificates.count()
        total_wos = await db.work_orders.count()
        total_campaigns = await db.branding_campaigns.count()
        
        print(f"""
📊 Database Summary:
  - Assets: {len(assets)}
  - Historical Outcomes: {total_outcomes:,}
  - Certificates: {total_certs}
  - Work Orders: {total_wos}  
  - Branding Campaigns: {total_campaigns}
""")
        
        print("🎉 Supporting data creation completed!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        await db.disconnect()
        print("👋 Disconnected from database")

if __name__ == "__main__":
    asyncio.run(add_supporting_data())
