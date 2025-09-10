import pandas as pd
import numpy as np
from typing import List, Dict, Tuple
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# KMRL Multi-Objective Optimization Weights
# Adjusted based on KMRL's operational priorities
WEIGHTS = {
    "reliability": 0.35,    # Primary: Service readiness & reliability
    "risk": 0.25,          # Secondary: Risk mitigation
    "branding": 0.20,      # Important: SLA compliance
    "efficiency": 0.20     # Operational: Mileage balance + shunting cost
}

class KMRLOptimizer:
    """
    Enhanced optimizer implementing KMRL's multi-objective decision framework.
    Addresses: service readiness, reliability, cost optimization, and branding exposure.
    """
    
    @staticmethod
    def calculate_reliability_score(asset: Dict) -> Tuple[float, str]:
        """
        Calculate reliability score based on maintenance status and operational history.
        """
        # Base reliability from maintenance status
        days_since_maint = asset.get('days_since_maint', 0)
        mileage = asset.get('current_mileage', 0)
        
        # Reliability decreases with time and mileage
        time_factor = max(0, 1 - (days_since_maint / 365))  # Degrades over a year
        mileage_factor = max(0, 1 - (mileage / 200000))     # Degrades over 200k km
        
        # Combine factors
        base_reliability = (time_factor * 0.6) + (mileage_factor * 0.4)
        
        # Penalties for warnings
        warnings = asset.get('warnings', [])
        open_wos = asset.get('open_work_orders', 0)
        
        penalty = 0
        penalty += len(warnings) * 0.1
        penalty += open_wos * 0.15
        
        reliability_score = max(0, base_reliability - penalty)
        
        # Generate explanation
        if reliability_score > 0.8:
            explanation = "Excellent operational condition"
        elif reliability_score > 0.6:
            explanation = "Good condition with minor considerations"
        elif reliability_score > 0.4:
            explanation = "Acceptable with some maintenance needs"
        else:
            explanation = "Requires attention before service"
            
        return reliability_score, explanation
    
    @staticmethod
    def calculate_efficiency_score(asset: Dict, fleet_stats: Dict) -> Tuple[float, str]:
        """
        Calculate efficiency score considering mileage balancing and shunting costs.
        """
        mileage = asset.get('current_mileage', 0)
        shunting_cost = asset.get('shunting_cost', 5)
        
        # Mileage balancing - prefer lower mileage trains to balance fleet wear
        if fleet_stats.get('max_mileage', 0) > 0:
            mileage_balance_score = 1 - (mileage / fleet_stats['max_mileage'])
        else:
            mileage_balance_score = 0.5
        
        # Shunting efficiency - prefer trains requiring less movement
        max_shunting = 5  # Maximum shunting cost
        shunting_efficiency = 1 - (shunting_cost / max_shunting)
        
        # Combine with weights
        efficiency_score = (mileage_balance_score * 0.7) + (shunting_efficiency * 0.3)
        
        # Generate explanation
        explanations = []
        if mileage_balance_score > 0.7:
            explanations.append("lower mileage helps fleet balancing")
        if shunting_efficiency > 0.7:
            explanations.append("minimal shunting required")
        
        explanation = "; ".join(explanations) if explanations else "standard efficiency"
        
        return efficiency_score, explanation
    
    @staticmethod
    def calculate_branding_priority(asset: Dict) -> Tuple[float, str]:
        """
        Calculate branding priority based on SLA requirements and risk of penalties.
        """
        urgency_score = asset.get('branding_urgency_score', 0.0)
        hours_deficit = asset.get('branding_hours_deficit', 0)
        sla_risk = asset.get('branding_sla_risk', 'None')
        
        # Convert to priority score
        branding_score = urgency_score
        
        # Generate explanation
        if sla_risk == 'High':
            explanation = f"Critical: {hours_deficit}h needed to avoid SLA breach"
        elif sla_risk == 'Medium':
            explanation = f"Important: {hours_deficit}h deficit approaching SLA limit"
        elif sla_risk == 'Low':
            explanation = "On track with branding requirements"
        else:
            explanation = "No active branding requirements"
            
        return branding_score, explanation

def calculate_shunting_cost(location: str) -> int:
    """Enhanced shunting cost calculation."""
    if not location: 
        return 5  # Default high cost if no location
    
    location_upper = location.upper()
    
    if 'STAB-A' in location_upper: 
        return 1
    elif 'STAB-B' in location_upper: 
        return 2
    elif 'STAB-C' in location_upper: 
        return 3
    elif 'DEPOT' in location_upper:
        return 4
    else:
        return 5  # Farthest/unknown locations

def get_optimized_schedule(
    eligible_assets: List[Dict],
    ineligible_assets: List[Dict],
    num_for_service: int
) -> Dict:
    """
    Enhanced KMRL multi-objective optimization for train induction planning.
    
    Implements:
    - Service readiness prioritization
    - Risk-based reliability assessment  
    - Branding SLA compliance
    - Operational efficiency (mileage balancing + shunting costs)
    - Explainable decision reasoning
    """
    
    # 1. Handle ineligible assets with enhanced categorization
    maintenance_list = []
    for asset in ineligible_assets:
        maintenance_item = {
            "asset_num": asset.get('asset_num'),
            "reason": asset.get('reason', 'Ineligible'),
            "risk_score": asset.get('risk_score', 1.0),
            "category": asset.get('category', 'Maintenance Required'),
            "priority": "High" if asset.get('risk_score', 0) > 0.8 else "Medium"
        }
        maintenance_list.append(maintenance_item)

    if not eligible_assets:
        logger.warning("No eligible assets available for optimization")
        return {
            "service": [],
            "standby": [],
            "maintenance": maintenance_list,
            "optimization_summary": {
                "total_evaluated": 0,
                "optimization_method": "N/A - No eligible assets",
                "decision_criteria": "Safety and compliance rules only"
            }
        }

    # 2. Calculate fleet statistics for relative scoring
    fleet_stats = {
        'max_mileage': max(asset.get('current_mileage', 0) for asset in eligible_assets),
        'avg_mileage': np.mean([asset.get('current_mileage', 0) for asset in eligible_assets]),
        'total_assets': len(eligible_assets)
    }
    
    logger.info(f"Optimizing {fleet_stats['total_assets']} eligible assets")

    # 3. Multi-objective scoring for each asset
    optimizer = KMRLOptimizer()
    
    for asset in eligible_assets:
        # Calculate individual objective scores
        reliability_score, reliability_reason = optimizer.calculate_reliability_score(asset)
        risk_score = 1 - asset.get('combined_risk_score', 0.5)  # Invert risk (lower risk = higher score)
        branding_score, branding_reason = optimizer.calculate_branding_priority(asset)
        efficiency_score, efficiency_reason = optimizer.calculate_efficiency_score(asset, fleet_stats)
        
        # Calculate weighted composite score
        composite_score = (
            WEIGHTS['reliability'] * reliability_score +
            WEIGHTS['risk'] * risk_score +
            WEIGHTS['branding'] * branding_score +
            WEIGHTS['efficiency'] * efficiency_score
        )
        
        # Store scores and explanations
        asset['scores'] = {
            'reliability': round(reliability_score, 3),
            'risk': round(risk_score, 3),
            'branding': round(branding_score, 3),
            'efficiency': round(efficiency_score, 3),
            'composite': round(composite_score, 3)
        }
        
        # Generate comprehensive decision explanation
        explanations = []
        explanations.append(f"Reliability: {reliability_reason}")
        explanations.append(f"Risk: {asset.get('risk_explanation', 'Standard assessment')}")
        if branding_score > 0.1:
            explanations.append(f"Branding: {branding_reason}")
        explanations.append(f"Efficiency: {efficiency_reason}")
        
        asset['decision_explanation'] = " | ".join(explanations)
        asset['composite_score'] = composite_score

    # 4. Sort by composite score and select trains
    sorted_assets = sorted(eligible_assets, key=lambda x: x['composite_score'], reverse=True)
    
    # 5. Generate final recommendations
    service_trains = sorted_assets[:num_for_service]
    standby_trains = sorted_assets[num_for_service:]
    
    # 6. Format output with enhanced information
    service_list = []
    for asset in service_trains:
        service_list.append({
            "asset_num": asset['asset_num'],
            "reason": f"Selected for service - {asset['decision_explanation']}",
            "risk_score": asset.get('combined_risk_score', 0.0),
            "risk_category": asset.get('risk_category', 'Unknown'),
            "composite_score": asset['composite_score'],
            "scores_breakdown": asset['scores']
        })
    
    standby_list = []
    for asset in standby_trains:
        standby_list.append({
            "asset_num": asset['asset_num'],
            "reason": f"Standby - {asset['decision_explanation']}",
            "risk_score": asset.get('combined_risk_score', 0.0),
            "risk_category": asset.get('risk_category', 'Unknown'),
            "composite_score": asset['composite_score']
        })
    
    # 7. Generate optimization summary
    optimization_summary = {
        "total_evaluated": len(eligible_assets),
        "selected_for_service": len(service_list),
        "standby_count": len(standby_list),
        "maintenance_required": len(maintenance_list),
        "optimization_method": "KMRL Multi-Objective Weighted Scoring",
        "weights_used": WEIGHTS,
        "fleet_statistics": fleet_stats,
        "decision_criteria": [
            "Service readiness and reliability",
            "Risk mitigation and safety",
            "Branding SLA compliance", 
            "Operational efficiency and cost"
        ]
    }

    return {
        "service": service_list,
        "standby": standby_list,
        "maintenance": maintenance_list,
        "optimization_summary": optimization_summary
    }

