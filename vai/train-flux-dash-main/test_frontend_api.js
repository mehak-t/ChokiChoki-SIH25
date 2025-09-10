// Test frontend API connectivity
import { apiService } from './src/services/api.js';

async function testFrontendAPI() {
  try {
    console.log('Testing frontend API service...');
    const data = await apiService.getAiEnhancedSchedule();
    console.log('Frontend API test success:', data.length, 'trains received');
    return data;
  } catch (error) {
    console.error('Frontend API test failed:', error);
    throw error;
  }
}

window.testFrontendAPI = testFrontendAPI;
