# 🤖 KMRL AI Enhancement with Ollama Gemma 2B

## Overview

This integration adds **Explainable AI** capabilities to your KMRL maintenance optimization system using **Ollama Gemma 2B**. The AI provides clear explanations for maintenance decisions and refines predictions based on contextual analysis.

## 🚀 Features

### ✨ Explainable AI
- **Clear Explanations**: Professional explanations for every maintenance prediction
- **Technical Reasoning**: Details why the AI made specific recommendations
- **Business Impact**: Explains operational implications for KMRL
- **Actionable Recommendations**: Specific next steps for maintenance teams

### 🔬 Prediction Refinement
- **Contextual Analysis**: Adjusts predictions based on historical maintenance patterns
- **Component Health Integration**: Considers current asset health indicators
- **Confidence Scoring**: AI provides confidence levels for its suggestions
- **Multi-factor Assessment**: Combines ML predictions with domain expertise

### 📊 Enhanced API Endpoints
- **AI-Enhanced Scheduling**: `/api/v1/ai-enhanced-schedule`
- **Single Train Analysis**: `/api/v1/single-train-analysis/{asset_id}`
- **Explainable Maintenance**: `/api/v1/explainable-maintenance/{asset_id}`
- **AI Status Check**: `/api/v1/ai-status`

## 🛠️ Installation & Setup

### 1. Install Dependencies
```bash
cd kochi_metro_backend
source venv/bin/activate
pip install aiohttp
```

### 2. Install Ollama & Gemma 2B
```bash
# Make setup script executable
chmod +x setup_ollama.sh

# Run installation (downloads ~1.5GB model)
./setup_ollama.sh
```

### 3. Start Your Server
```bash
source venv/bin/activate
uvicorn main:app --port 8001
```

### 4. Verify AI Integration
```bash
# Check AI status
curl http://127.0.0.1:8001/api/v1/ai-status

# Test fallback mode (without Ollama)
python test_ai_fallback.py

# Test with Ollama (after setup)
python test_ai_demo.py
```

## 🎯 Usage Examples

### Basic AI-Enhanced Schedule
```bash
curl -X POST http://127.0.0.1:8001/api/v1/ai-enhanced-schedule
```

### Single Train Analysis with AI
```bash
curl -X POST http://127.0.0.1:8001/api/v1/single-train-analysis/KMRL_T001
```

### Get Explainable Maintenance Decision
```bash
curl http://127.0.0.1:8001/api/v1/explainable-maintenance/KMRL_T001
```

## 📋 API Response Format

### Enhanced Prediction Response
```json
{
  "asset_id": "KMRL_T001",
  "asset_num": "KMRL_T001",
  "final_risk_score": 0.75,
  "priority_level": "HIGH",
  "risk_factors": ["Maintenance overdue", "High mileage"],
  
  "ai_explanation": {
    "summary": "Train KMRL_T001 requires immediate maintenance attention...",
    "technical_reasoning": "The model identified high risk due to...",
    "business_impact": "Delaying maintenance could result in...",
    "recommended_action": "Schedule preventive maintenance within 48 hours..."
  },
  
  "ai_refinement": {
    "original_risk": 0.70,
    "adjustment_factor": 1.07,
    "confidence": "HIGH",
    "reasoning": "Recent maintenance history indicates...",
    "model_used": "gemma2:2b"
  },
  
  "ml_risk_score": 0.65,
  "rules_risk_score": 0.75,
  "days_since_maint": 185,
  "current_mileage": 125000.0,
  "prediction_timestamp": "2025-09-10T15:30:45.123Z"
}
```

## 🧠 How It Works

### 1. **Base Prediction**
- System generates ML + Rules-based risk assessment
- Identifies technical risk factors and operational constraints

### 2. **AI Explanation Generation**
- Ollama Gemma 2B analyzes the prediction data
- Generates structured explanations for maintenance teams
- Provides business context and actionable recommendations

### 3. **Prediction Refinement**
- AI considers historical maintenance patterns
- Analyzes current asset health indicators
- Adjusts risk scores based on contextual factors
- Provides confidence levels for refinements

### 4. **Fallback Mode**
- System works without Ollama for basic functionality
- Provides rule-based explanations when AI is unavailable
- Graceful degradation ensures system reliability

## 🔧 Configuration

### Ollama Settings
```python
# app/ai/ollama_client.py
class OllamaClient:
    def __init__(self, base_url: str = "http://localhost:11434"):
        self.base_url = base_url
        self.model = "gemma2:2b"
```

### AI Parameters
- **Temperature**: 0.3 (focused explanations)
- **Top-P**: 0.9 (balanced creativity)
- **Max Tokens**: 300 (concise responses)

## 📈 Benefits for KMRL

### 🎯 **Transparency**
- Clear explanations build trust in AI decisions
- Maintenance teams understand reasoning behind recommendations
- Audit trail for regulatory compliance

### ⚡ **Efficiency**
- Faster decision-making with contextual insights
- Reduced time spent analyzing complex data
- Automated explanation generation

### 🛡️ **Risk Management**
- AI refinement improves prediction accuracy
- Multi-factor analysis reduces false positives
- Confidence scoring helps prioritize actions

### 📚 **Knowledge Transfer**
- AI explanations help train new maintenance staff
- Consistent reasoning across all decisions
- Best practices embedded in AI responses

## 🔍 Monitoring & Debugging

### Check AI Status
```bash
curl http://127.0.0.1:8001/api/v1/ai-status
```

### View Server Logs
```bash
# AI enhancement logs
tail -f logs/ai_enhancement.log

# Ollama connection status
curl -s http://localhost:11434/api/tags
```

### Test Individual Components
```bash
# Test without Ollama
python test_ai_fallback.py

# Test with Ollama
python test_ai_demo.py
```

## 🚨 Troubleshooting

### Ollama Not Running
```bash
# Start Ollama service
ollama serve &

# Pull model again
ollama pull gemma2:2b
```

### Import Errors
```bash
# Reinstall dependencies
pip install aiohttp

# Check Python path
python -c "import app.ai.ollama_client; print('AI module loaded successfully')"
```

### Performance Issues
- Gemma 2B requires ~2GB RAM
- Consider using smaller model for development: `ollama pull gemma:2b`
- Enable GPU acceleration if available

## 🔮 Future Enhancements

1. **Multi-Model Support**: Support for different LLMs
2. **Custom Prompts**: Configurable explanation templates
3. **Batch Processing**: Bulk explanation generation
4. **Real-time Monitoring**: Live AI performance dashboards
5. **Integration APIs**: Connect with external systems

---

**🎉 Your KMRL system now has enterprise-grade explainable AI!**

For questions or support, check the logs or run the test scripts to verify functionality.
