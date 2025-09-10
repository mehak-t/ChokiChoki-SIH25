#!/usr/bin/env python
"""
Simple API test to check endpoint availability
"""

import requests

def test_endpoints():
    """Test all API endpoints"""
    base_url = "http://localhost:8000"
    
    # Root endpoint
    try:
        print("Testing root endpoint...")
        resp = requests.get(f"{base_url}/")
        print(f"Status: {resp.status_code}")
        if resp.status_code == 200:
            print(f"Response: {resp.json()}")
    except Exception as e:
        print(f"Error accessing root endpoint: {e}")
    
    # Evaluate model endpoint (POST)
    try:
        print("\nTesting evaluate model endpoint...")
        resp = requests.post(f"{base_url}/api/v1/evaluate-model")
        print(f"Status: {resp.status_code}")
        if resp.status_code == 200:
            print(f"Response: {resp.json()}")
    except Exception as e:
        print(f"Error accessing evaluate model endpoint: {e}")
    
    # Try without /api prefix
    try:
        print("\nTesting evaluate model endpoint without /api prefix...")
        resp = requests.post(f"{base_url}/v1/evaluate-model")
        print(f"Status: {resp.status_code}")
        if resp.status_code == 200:
            print(f"Response: {resp.json()}")
    except Exception as e:
        print(f"Error accessing endpoint: {e}")
    
    print("\nTest completed.")

if __name__ == "__main__":
    test_endpoints()
