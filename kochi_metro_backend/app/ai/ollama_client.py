import aiohttp
import json
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime

logger = logging.getLogger(__name__)

class OllamaClient:
    def __init__(self, base_url: str = "http://localhost:11434"):
        self.base_url = base_url
        self.model = "gemma2:2b"
        
    async def generate_explanation(self, 
                                 prediction_data: Dict,
                                 risk_factors: List[str],
                                 asset_details: Dict) -> Dict[str, str]:
        """Generate explainable AI commentary for maintenance predictions."""
        
        prompt = self._create_explanation_prompt(prediction_data, risk_factors, asset_details)
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": prompt,
                        "stream": False,
                        "options": {
                            "temperature": 0.3,  # Lower temperature for more focused explanations
                            "top_p": 0.9,
                            "max_tokens": 300
                        }
                    }
                ) as response:
                    result = await response.json()
                    explanation = result.get("response", "").strip()
                    
                    return self._parse_explanation(explanation)
                    
        except Exception as e:
            logger.error(f"Error generating Ollama explanation: {e}")
            return self._fallback_explanation(prediction_data, risk_factors)
    
    def _create_explanation_prompt(self, prediction_data: Dict, risk_factors: List[str], asset_details: Dict) -> str:
        """Create structured prompt for Gemma 2B to generate explanations."""
        
        return f"""
You are an AI assistant for KMRL (Kochi Metro Rail Limited) maintenance optimization system. 
Analyze the following train maintenance prediction and provide a clear, professional explanation.

TRAIN DETAILS:
- Train ID: {asset_details.get('asset_num', 'Unknown')}
- Current Mileage: {asset_details.get('current_mileage', 0):,.0f} km
- Operating Hours: {asset_details.get('operating_hours', 0):,.0f} hours
- Days Since Last Maintenance: {prediction_data.get('days_since_maint', 0)} days
- Location: {asset_details.get('location', 'Unknown')}

PREDICTION RESULTS:
- ML Risk Score: {prediction_data.get('ml_risk_score', 0):.3f}
- Rules-Based Risk Score: {prediction_data.get('rules_risk_score', 0):.3f}
- Final Risk Score: {prediction_data.get('final_risk_score', 0):.3f}
- Maintenance Priority: {prediction_data.get('priority_level', 'Unknown')}

IDENTIFIED RISK FACTORS:
{chr(10).join(f"- {factor}" for factor in risk_factors) if risk_factors else "- No specific risk factors identified"}

Please provide:
1. SUMMARY: A brief 2-3 sentence explanation of the maintenance recommendation
2. TECHNICAL_REASONING: Why the AI model made this prediction (focus on key factors)
3. BUSINESS_IMPACT: What this means for KMRL operations
4. RECOMMENDED_ACTION: Specific next steps for maintenance team

Format your response as:
SUMMARY: [your summary]
TECHNICAL_REASONING: [your technical explanation]
BUSINESS_IMPACT: [operational impact]
RECOMMENDED_ACTION: [specific actions]
"""

    def _parse_explanation(self, raw_explanation: str) -> Dict[str, str]:
        """Parse the structured explanation from Gemma 2B response."""
        
        sections = {
            "summary": "",
            "technical_reasoning": "",
            "business_impact": "",
            "recommended_action": ""
        }
        
        lines = raw_explanation.split('\n')
        current_section = None
        
        for line in lines:
            line = line.strip()
            if line.startswith("SUMMARY:"):
                current_section = "summary"
                sections[current_section] = line.replace("SUMMARY:", "").strip()
            elif line.startswith("TECHNICAL_REASONING:"):
                current_section = "technical_reasoning"
                sections[current_section] = line.replace("TECHNICAL_REASONING:", "").strip()
            elif line.startswith("BUSINESS_IMPACT:"):
                current_section = "business_impact"
                sections[current_section] = line.replace("BUSINESS_IMPACT:", "").strip()
            elif line.startswith("RECOMMENDED_ACTION:"):
                current_section = "recommended_action"
                sections[current_section] = line.replace("RECOMMENDED_ACTION:", "").strip()
            elif current_section and line:
                sections[current_section] += " " + line
        
        return sections

    def _fallback_explanation(self, prediction_data: Dict, risk_factors: List[str]) -> Dict[str, str]:
        """Provide fallback explanation if Ollama is unavailable."""
        
        risk_level = "HIGH" if prediction_data.get('final_risk_score', 0) > 0.7 else "MEDIUM" if prediction_data.get('final_risk_score', 0) > 0.4 else "LOW"
        
        return {
            "summary": f"Train shows {risk_level} maintenance risk based on operational data analysis.",
            "technical_reasoning": f"Risk assessment based on {len(risk_factors)} identified factors including mileage and maintenance history.",
            "business_impact": f"Maintenance scheduling recommended to ensure service reliability and passenger safety.",
            "recommended_action": "Schedule preventive maintenance during next available service window."
        }

    async def refine_prediction(self, 
                              current_prediction: Dict,
                              historical_context: List[Dict],
                              asset_specifications: List[Dict]) -> Dict[str, Any]:
        """Use Gemma 2B to refine predictions based on contextual analysis."""
        
        prompt = self._create_refinement_prompt(current_prediction, historical_context, asset_specifications)
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": prompt,
                        "stream": False,
                        "options": {
                            "temperature": 0.2,  # Very focused for refinement
                            "top_p": 0.8
                        }
                    }
                ) as response:
                    result = await response.json()
                    refinement = result.get("response", "").strip()
                    
                    return self._parse_refinement(refinement, current_prediction)
                    
        except Exception as e:
            logger.error(f"Error in prediction refinement: {e}")
            return current_prediction

    def _create_refinement_prompt(self, prediction: Dict, history: List[Dict], specs: List[Dict]) -> str:
        """Create prompt for prediction refinement."""
        
        return f"""
As a KMRL maintenance AI specialist, analyze this prediction and suggest refinements:

CURRENT PREDICTION:
- Risk Score: {prediction.get('final_risk_score', 0):.3f}
- Priority: {prediction.get('priority_level', 'Unknown')}

RECENT MAINTENANCE HISTORY:
{self._format_history(history[:3])}  # Last 3 events

CURRENT ASSET HEALTH:
{self._format_specifications(specs)}

Consider:
1. Are there patterns in the maintenance history that affect current risk?
2. Do asset health indicators suggest higher/lower risk than predicted?
3. Should the risk score be adjusted based on component-specific data?

Respond with:
ADJUSTMENT: [INCREASE/DECREASE/MAINTAIN] risk score
FACTOR: [0.8-1.2] adjustment factor
REASONING: [brief explanation]
CONFIDENCE: [LOW/MEDIUM/HIGH]
"""

    def _format_history(self, history: List[Dict]) -> str:
        """Format maintenance history for prompt."""
        if not history:
            return "No recent maintenance history available"
        
        formatted = []
        for event in history:
            formatted.append(f"- {event.get('maintenance_type', 'Unknown')}: {event.get('days_ago', 0)} days ago")
        return '\n'.join(formatted)

    def _format_specifications(self, specs: List[Dict]) -> str:
        """Format asset specifications for prompt."""
        if not specs:
            return "No current health data available"
        
        formatted = []
        for spec in specs:
            status = spec.get('condition_status', 'Unknown')
            formatted.append(f"- {spec.get('spec_name', 'Component')}: {status}")
        return '\n'.join(formatted)

    def _parse_refinement(self, refinement: str, original_prediction: Dict) -> Dict[str, Any]:
        """Parse refinement suggestions and apply to prediction."""
        
        lines = refinement.upper().split('\n')
        adjustment_factor = 1.0
        confidence = "MEDIUM"
        reasoning = "No specific refinement applied"
        
        for line in lines:
            if "FACTOR:" in line:
                try:
                    factor_str = line.split("FACTOR:")[1].strip()
                    adjustment_factor = float(factor_str)
                except:
                    adjustment_factor = 1.0
            elif "CONFIDENCE:" in line:
                confidence = line.split("CONFIDENCE:")[1].strip()
            elif "REASONING:" in line:
                reasoning = line.split("REASONING:")[1].strip()
        
        # Apply refinement
        refined_prediction = original_prediction.copy()
        original_risk = refined_prediction.get('final_risk_score', 0.5)
        refined_risk = min(1.0, max(0.0, original_risk * adjustment_factor))
        
        refined_prediction.update({
            'final_risk_score': refined_risk,
            'ai_refinement': {
                'original_risk': original_risk,
                'adjustment_factor': adjustment_factor,
                'confidence': confidence,
                'reasoning': reasoning,
                'model_used': 'gemma2:2b'
            }
        })
        
        return refined_prediction

    async def health_check(self) -> bool:
        """Check if Ollama service is available."""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.base_url}/api/tags") as response:
                    return response.status == 200
        except:
            return False
