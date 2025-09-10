// API service for communicating with the Kochi Metro Backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface TrainScheduleResponse {
  asset_id: string;
  asset_num: string;
  final_risk_score: number;
  priority_level: string;
  risk_factors: string[];
  ai_explanation: {
    summary: string;
    technical_reasoning: string;
    business_impact: string;
    recommended_action: string;
  };
  ai_refinement: {
    original_risk: number;
    adjustment_factor: number;
    confidence: string;
    reasoning: string;
    model_used: string;
  };
  ml_risk_score: number;
  rules_risk_score: number;
  days_since_maint: number;
  current_mileage: number;
  prediction_timestamp: string;
  model_version?: string | null; // Optional field that might be returned by backend
}

export interface DailyDataResponse {
  date: string;
  datasets: {
    id: string;
    name: string;
    size: string;
  }[];
}

class ApiService {
  private async fetchWithErrorHandling(url: string, options?: RequestInit) {
    try {
      console.log('🌐 Making request to:', url, 'with options:', options);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // Increased to 20 seconds for AI processing

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);
      
      console.log('📡 Response received:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📦 Data parsed successfully, type:', typeof data, 'length:', Array.isArray(data) ? data.length : 'not array');
      
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('⏰ Request timeout for:', url);
        throw new Error('Request timeout - server took too long to respond');
      }
      console.error(`💥 API Error for ${url}:`, error);
      throw error;
    }
  }

  async getAiEnhancedSchedule(): Promise<TrainScheduleResponse[]> {
    try {
      console.log('🚀 Starting AI enhanced schedule request...');
      console.log('API Base URL:', API_BASE_URL);
      
      // First try the AI-enhanced endpoint
      const result = await this.fetchWithErrorHandling(`${API_BASE_URL}/api/v1/ai-enhanced-schedule`, {
        method: 'POST',
      });
      
      console.log('✅ AI enhanced schedule success! Received:', result.length, 'trains');
      console.log('First train:', result[0]?.asset_id);
      console.log('Full result structure:', Object.keys(result[0] || {}));
      
      // Type check - ensure we have the expected structure
      if (Array.isArray(result) && result.length > 0 && result[0].asset_id) {
        console.log('🎯 Data structure validated, returning', result.length, 'trains');
        return result;
      } else {
        console.warn('⚠️ Unexpected data structure:', result);
        throw new Error('Invalid data structure received from AI endpoint');
      }
    } catch (error) {
      console.error('❌ AI-enhanced schedule failed:', error);
      console.warn('Trying fallback to regular schedule...');
      
      // Fallback to regular schedule endpoint
      try {
        const regularSchedule = await this.generateSchedule(15);
        console.log('📋 Regular schedule fallback succeeded');
        
        // Convert regular schedule to AI format (mock AI data)
        const converted = this.convertRegularToAiFormat(regularSchedule);
        console.log('🔄 Converted to AI format:', converted.length, 'trains');
        
        return converted;
      } catch (fallbackError) {
        console.error('💥 Both AI and regular schedule failed:', fallbackError);
        throw new Error('Failed to load schedule data');
      }
    }
  }

  private convertRegularToAiFormat(regularSchedule: any): TrainScheduleResponse[] {
    // Convert regular schedule response to AI format with mock explanations
    if (!regularSchedule.eligible_trains) return [];
    
    return regularSchedule.eligible_trains.map((train: any, index: number) => ({
      asset_id: train.asset_id,
      asset_num: train.asset_num || train.asset_id,
      final_risk_score: train.risk_score || 0.5,
      priority_level: train.risk_score > 0.7 ? 'HIGH' : train.risk_score > 0.4 ? 'MEDIUM' : 'LOW',
      risk_factors: train.risk_factors || ['Standard maintenance check'],
      ai_explanation: {
        summary: `Train ${train.asset_num || train.asset_id} analysis completed using standard rules-based system.`,
        technical_reasoning: 'Risk assessment based on mileage, maintenance history, and operational requirements.',
        business_impact: 'Maintaining scheduled operations with optimized resource allocation.',
        recommended_action: train.risk_score > 0.7 ? 'Schedule immediate maintenance' : 'Continue monitoring'
      },
      ai_refinement: {
        original_risk: train.risk_score || 0.5,
        adjustment_factor: 1.0,
        confidence: 'MEDIUM',
        reasoning: 'Standard rules-based assessment',
        model_used: 'rules-engine'
      },
      ml_risk_score: train.ml_risk_score || train.risk_score || 0.5,
      rules_risk_score: train.rules_risk_score || train.risk_score || 0.5,
      days_since_maint: train.days_since_maint || 30,
      current_mileage: train.current_mileage || 50000,
      prediction_timestamp: new Date().toISOString()
    }));
  }

  async getExplainableMaintenance(assetId: string): Promise<TrainScheduleResponse> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/api/v1/explainable-maintenance/${assetId}`);
  }

  async getSingleTrainAnalysis(assetId: string): Promise<TrainScheduleResponse> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/api/v1/single-train-analysis/${assetId}`, {
      method: 'POST',
    });
  }

  async getDailyData(): Promise<DailyDataResponse[]> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/api/v1/daily-data`);
  }

  async getAiStatus() {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/api/v1/ai-status`);
  }

  async generateSchedule(numTrains: number = 15) {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/api/v1/generate-schedule`, {
      method: 'POST',
      body: JSON.stringify({ num_trains_for_service: numTrains }),
    });
  }
}

export const apiService = new ApiService();
