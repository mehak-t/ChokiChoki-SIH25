#!/usr/bin/env python3
"""
KMRL AI Enhancement Demo Script
Tests the Ollama Gemma 2B integration for explainable AI
"""

import asyncio
import json
from app.ai.ollama_client import OllamaClient
from app.ml.enhanced_pipeline import EnhancedMLPipeline

async def test_ai_integration():
    """Test the AI integration components."""
    
    print("🤖 KMRL AI Enhancement Demo")
    print("=" * 50)
    
    # Test Ollama connection
    print("\n1. Testing Ollama Connection...")
    ollama_client = OllamaClient()
    
    is_connected = await ollama_client.health_check()
    if is_connected:
        print("✅ Ollama service is running")
    else:
        print("❌ Ollama service not available")
        print("   Run './setup_ollama.sh' to install and start Ollama")
        return
    
    # Test AI explanation generation
    print("\n2. Testing AI Explanation Generation...")
    
    # Sample prediction data
    sample_prediction = {
        "ml_risk_score": 0.75,
        "rules_risk_score": 0.65,
        "final_risk_score": 0.70,
        "priority_level": "HIGH",
        "days_since_maint": 185
    }
    
    sample_asset = {
        "asset_num": "KMRL_T001",
        "current_mileage": 125000,
        "operating_hours": 8760,
        "location": "STAB-A"
    }
    
    sample_risk_factors = [
        "Maintenance overdue",
        "High mileage",
        "Critical component wear"
    ]
    
    try:
        explanation = await ollama_client.generate_explanation(
            prediction_data=sample_prediction,
            risk_factors=sample_risk_factors,
            asset_details=sample_asset
        )
        
        print("✅ AI Explanation Generated:")
        print(f"   Summary: {explanation['summary'][:80]}...")
        print(f"   Technical Reasoning: {explanation['technical_reasoning'][:80]}...")
        print(f"   Business Impact: {explanation['business_impact'][:80]}...")
        print(f"   Recommended Action: {explanation['recommended_action'][:80]}...")
        
    except Exception as e:
        print(f"❌ Error generating explanation: {e}")
    
    # Test prediction refinement
    print("\n3. Testing AI Prediction Refinement...")
    
    sample_history = [
        {"maintenance_type": "Preventive", "days_ago": 30, "failure_occurred": False},
        {"maintenance_type": "Corrective", "days_ago": 60, "failure_occurred": True}
    ]
    
    sample_specs = [
        {"spec_name": "Brake System", "condition_status": "Good"},
        {"spec_name": "Motor Assembly", "condition_status": "Fair"}
    ]
    
    try:
        refined_prediction = await ollama_client.refine_prediction(
            current_prediction=sample_prediction,
            historical_context=sample_history,
            asset_specifications=sample_specs
        )
        
        print("✅ AI Refinement Applied:")
        print(f"   Original Risk: {sample_prediction['final_risk_score']:.3f}")
        print(f"   Refined Risk: {refined_prediction['final_risk_score']:.3f}")
        
        if 'ai_refinement' in refined_prediction:
            ref = refined_prediction['ai_refinement']
            print(f"   Adjustment Factor: {ref['adjustment_factor']}")
            print(f"   Confidence: {ref['confidence']}")
            print(f"   Reasoning: {ref['reasoning'][:60]}...")
    
    except Exception as e:
        print(f"❌ Error in prediction refinement: {e}")
    
    # Test Enhanced ML Pipeline
    print("\n4. Testing Enhanced ML Pipeline...")
    
    try:
        enhanced_pipeline = EnhancedMLPipeline()
        ai_initialized = await enhanced_pipeline.initialize_ai()
        
        if ai_initialized:
            print("✅ Enhanced ML Pipeline initialized with AI")
        else:
            print("⚠️  Enhanced ML Pipeline running without AI")
        
    except Exception as e:
        print(f"❌ Error initializing enhanced pipeline: {e}")
    
    print("\n" + "=" * 50)
    print("🚀 Demo Complete! Your KMRL system now has:")
    print("   • Explainable AI for maintenance decisions")
    print("   • Contextual prediction refinement")
    print("   • Professional maintenance explanations")
    print("   • AI-powered risk assessment")
    
    print("\n📡 Available API Endpoints:")
    print("   • POST /api/v1/ai-enhanced-schedule")
    print("   • GET  /api/v1/ai-status")
    print("   • POST /api/v1/single-train-analysis/{asset_id}")
    print("   • GET  /api/v1/explainable-maintenance/{asset_id}")

if __name__ == "__main__":
    asyncio.run(test_ai_integration())
