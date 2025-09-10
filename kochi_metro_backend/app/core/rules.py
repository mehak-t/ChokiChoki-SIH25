from datetime import datetime, timedelta
from app.db.client import db
from typing import List, Dict, Tuple
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# KMRL Business Rules Constants
class KMRLRules:
    # Maintenance thresholds
    MAX_MILEAGE_WITHOUT_MAINT = 120000  # km
    MAX_DAYS_WITHOUT_MAINT = 180        # days
    CRITICAL_MILEAGE_THRESHOLD = 150000  # km
    
    # Branding SLA thresholds
    BRANDING_SLA_BUFFER_HOURS = 48      # hours buffer before SLA breach
    
    # Location-based shunting costs (energy + time)
    SHUNTING_COSTS = {
        'STAB-A': 1,    # Lowest cost - ready position
        'STAB-B': 2,    # Medium cost
        'STAB-C': 3,    # Higher cost
        'DEPOT': 4,     # Highest cost - needs full shunting
        'MAIN_LINE': 5  # Emergency retrieval needed
    }

def calculate_days_since_maintenance(asset) -> int:
    """Calculate days since last maintenance based on work orders."""
    try:
        # Handle both dictionary and Prisma model formats
        work_orders = asset.work_orders if hasattr(asset, 'work_orders') else asset.get('work_orders', [])
        
        if not work_orders:
            return 30  # Default to 30 days if no maintenance records
        
        # Find the most recent completed work order (status = 'COMP' or 'CLOSE')
        completed_orders = [wo for wo in work_orders if hasattr(wo, 'status') and wo.status in ['COMP', 'CLOSE']]
        
        if not completed_orders:
            return 30  # No completed maintenance found
        
        latest_maintenance = max(
            completed_orders,
            key=lambda x: x.reported_date,
            default=None
        )
        
        if latest_maintenance:
            from datetime import datetime
            # Convert to datetime if it's a string
            reported_date = latest_maintenance.reported_date
            if isinstance(reported_date, str):
                reported_date = datetime.fromisoformat(reported_date.replace('Z', '+00:00'))
            
            days_diff = (datetime.now() - reported_date.replace(tzinfo=None)).days
            return max(0, days_diff)
        
        return 30  # Default if no valid maintenance found
        
    except Exception as e:
        print(f"Error calculating maintenance days: {e}")
        return 30  # Conservative default

def calculate_branding_urgency(asset) -> Dict[str, float]:
    """Calculate branding urgency based on SLA requirements."""
    # Check for branding campaigns (new schema)
    branding_campaigns = asset.branding_campaigns if hasattr(asset, 'branding_campaigns') else asset.get('branding_campaigns', [])
    
    if not branding_campaigns:
        return {"urgency_score": 0.0, "hours_deficit": 0, "sla_risk": "None"}
    
    # Get active campaigns
    today_dt = datetime.now().date()
    active_campaigns = [
        campaign for campaign in branding_campaigns 
        if (campaign.start_date.date() if hasattr(campaign.start_date, 'date') else campaign.start_date) <= today_dt <= (campaign.end_date.date() if hasattr(campaign.end_date, 'date') else campaign.end_date)
    ]
    
    if not active_campaigns:
        return {"urgency_score": 0.0, "hours_deficit": 0, "sla_risk": "None"}
    
    campaign = active_campaigns[0]  # Primary active campaign
    required_hours = campaign.minimum_hours_required or 0
    achieved_hours = campaign.actual_hours_served or 0
    hours_deficit = max(0, required_hours - achieved_hours)
    
    # Calculate urgency based on remaining time and deficit
    if hours_deficit <= KMRLRules.BRANDING_SLA_BUFFER_HOURS:
        urgency_score = 0.2
        sla_risk = "Low"
    elif hours_deficit <= KMRLRules.BRANDING_SLA_BUFFER_HOURS * 2:
        urgency_score = 0.6
        sla_risk = "Medium"
    else:
        urgency_score = 1.0
        sla_risk = "High"
    
    return {
        "urgency_score": urgency_score,
        "hours_deficit": hours_deficit,
        "sla_risk": sla_risk
    }

def apply_hard_rules_risk_assessment(asset) -> Dict[str, any]:
    """Apply KMRL hard rules for risk assessment."""
    risk_factors = []
    risk_score = 0.0
    
    # Get current mileage from meter readings or total distance
    current_mileage = 0
    if hasattr(asset, 'meter_readings') and asset.meter_readings:
        # Get latest distance reading
        for reading in asset.meter_readings:
            if reading.meter_type == "DISTANCE_KM":
                current_mileage = float(reading.reading_value)
                break
    elif hasattr(asset, 'total_distance_km') and asset.total_distance_km:
        current_mileage = float(asset.total_distance_km)
    
    days_since_maint = calculate_days_since_maintenance(asset)
    
    # Rule 1: Critical mileage threshold
    if current_mileage > KMRLRules.CRITICAL_MILEAGE_THRESHOLD:
        risk_score += 0.8
        risk_factors.append("Critical mileage exceeded")
    elif current_mileage > KMRLRules.MAX_MILEAGE_WITHOUT_MAINT:
        risk_score += 0.5
        risk_factors.append("High mileage")
    
    # Rule 2: Maintenance overdue
    if days_since_maint > KMRLRules.MAX_DAYS_WITHOUT_MAINT:
        risk_score += 0.7
        risk_factors.append("Maintenance overdue")
    elif days_since_maint > KMRLRules.MAX_DAYS_WITHOUT_MAINT * 0.8:
        risk_score += 0.3
        risk_factors.append("Maintenance due soon")
    
    # Rule 3: Combined high-risk scenario
    if (current_mileage > KMRLRules.MAX_MILEAGE_WITHOUT_MAINT and 
        days_since_maint > KMRLRules.MAX_DAYS_WITHOUT_MAINT * 0.7):
        risk_score += 0.4  # Additional penalty for combined factors
        risk_factors.append("High mileage + overdue maintenance")
    
    # Normalize risk score to 0-1 range
    rules_based_risk = min(risk_score, 1.0)
    
    return {
        "rules_risk_score": rules_based_risk,
        "risk_factors": risk_factors,
        "mileage": current_mileage,
        "days_since_maint": days_since_maint
    }

async def get_eligible_trains() -> Tuple[List[Dict], List[Dict]]:
    """
    Enhanced eligibility assessment with integrated hard rules and risk calculation.
    Returns eligible trains with comprehensive risk and operational data.
    """
    today = datetime.now().date()
    eligible_assets = []
    ineligible_assets = []

    try:
        # Fetch all train assets with their related data in a single query
        assets_raw = await db.assets.find_many(
            where={
                "asset_type": "TRAINSET"  # Only get train sets
            },
            include={
                "work_orders": True,
                "asset_certificates": True,
                "branding_campaigns": True,
                "asset_specifications": True,
                "meter_readings": {
                    "where": {
                        "meter_type": "DISTANCE_KM"
                    },
                    "order_by": {
                        "reading_date": "desc"
                    },
                    "take": 1
                }
            }
        )

        logger.info(f"Processing {len(assets_raw)} assets for eligibility")

        for asset in assets_raw:
            is_eligible = True
            reasons = []

            # Rule 1: Asset Certificates - CRITICAL
            for cert in asset.asset_certificates:
                if cert.expiry_date:
                    expiry_date = cert.expiry_date.date() if hasattr(cert.expiry_date, 'date') else cert.expiry_date
                    if expiry_date < today:
                        is_eligible = False
                        reasons.append(f"Expired {cert.certificate_type} Certificate")
                    elif (expiry_date - today).days <= 7:
                        reasons.append(f"{cert.certificate_type} expires in {(expiry_date - today).days} days")

            # Rule 2: Work Orders - CRITICAL
            open_work_orders = []
            for wo in asset.work_orders:
                if wo.wo_status not in ['CLOSE', 'COMP']:
                    # Status APPROVED, INPRG should make asset ineligible for critical work
                    if wo.wo_status in ['APPROVED', 'INPRG'] and wo.priority and wo.priority <= 2:
                        is_eligible = False
                        status_desc = 'Approved' if wo.wo_status == 'APPROVED' else 'In Progress'
                        reasons.append(f"Critical Work Order ({status_desc}): {wo.description or 'Maintenance Required'}")
                    else:
                        open_work_orders.append(wo)

            # If critical issues found, mark as ineligible
            if not is_eligible:
                ineligible_assets.append({
                    "asset_num": asset.asset_num,
                    "asset_id": asset.asset_id,
                    "reason": "; ".join(reasons),
                    "risk_score": 1.0,
                    "category": "Critical Issues"
                })
                continue

            # For eligible assets, perform hard rules assessment
            try:
                hard_rules_assessment = apply_hard_rules_risk_assessment(asset)
                
                # Get current mileage from latest meter reading
                current_mileage = 0
                if asset.meter_readings:
                    current_mileage = float(asset.meter_readings[0].reading_value)
                elif asset.total_distance_km:
                    current_mileage = float(asset.total_distance_km)

                # Get active campaigns
                today_dt = datetime.now().date()
                active_campaigns = []
                for campaign in asset.branding_campaigns:
                    start_date = campaign.start_date.date() if hasattr(campaign.start_date, 'date') else campaign.start_date
                    end_date = campaign.end_date.date() if hasattr(campaign.end_date, 'date') else campaign.end_date
                    if (start_date <= today_dt <= end_date):
                        active_campaigns.append({
                            "required_hours": campaign.minimum_hours_required or 0,
                            "achieved_hours": campaign.actual_hours_served or 0,
                            "advertiser": campaign.advertiser_name or "Unknown"
                        })

                # Build comprehensive asset data
                asset_data = {
                    "asset_num": asset.asset_num,
                    "asset_id": asset.asset_id,
                    "description": asset.description or "",
                    "location": asset.location or "UNKNOWN",
                    "current_mileage": current_mileage,
                    "operating_hours": float(asset.operating_hours or 0),
                    "status": asset.status or "OPERATING",
                    "manufacturer": asset.manufacturer or "",
                    "model": asset.model or "",
                    "installation_date": asset.installation_date,
                    "work_orders": asset.work_orders,
                    "asset_certificates": asset.asset_certificates,
                    "branding_campaigns": active_campaigns,
                    "asset_specifications": asset.asset_specifications,
                    
                    # Risk assessment data
                    "rules_risk_score": hard_rules_assessment["rules_risk_score"],
                    "risk_factors": hard_rules_assessment["risk_factors"],
                    "days_since_maint": hard_rules_assessment["days_since_maint"],
                    
                    # Required for branding calculations
                    "required_hours": active_campaigns[0]["required_hours"] if active_campaigns else 0,
                    "achieved_hours": active_campaigns[0]["achieved_hours"] if active_campaigns else 0,
                    
                    # Location data for shunting costs
                    "current_location_id": asset.location or "DEPOT"
                }

                eligible_assets.append(asset_data)

            except Exception as e:
                logger.error(f"Error processing asset {asset.asset_num}: {e}")
                # On error, mark as ineligible with conservative approach
                ineligible_assets.append({
                    "asset_num": asset.asset_num,
                    "asset_id": asset.asset_id,
                    "reason": "Processing Error - Requires Manual Review",
                    "risk_score": 1.0,
                    "category": "System Error"
                })

        logger.info(f"Assessment complete: {len(eligible_assets)} eligible, {len(ineligible_assets)} ineligible")

    except Exception as e:
        logger.error(f"Error in get_eligible_trains: {e}")
        raise

    return eligible_assets, ineligible_assets

