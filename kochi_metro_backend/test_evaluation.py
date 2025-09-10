#!/usr/bin/env python
"""
Test script to run model evaluation and check results
"""

import requests
import time
import json
import sys

# Define the API URL
API_URL = "http://localhost:8000"

def pretty_print_json(data):
    print(json.dumps(data, indent=2))

def run_test():
    print("=== Testing Model Evaluation API ===")
    
    # Step 1: Start model evaluation
    print("\nStep 1: Starting model evaluation...")
    try:
        response = requests.post(f"{API_URL}/api/v1/evaluate-model")
        if response.status_code != 200:
            print(f"Error: Got status code {response.status_code}")
            print(response.text)
            return False
        
        result = response.json()
        task_id = result["task_id"]
        print(f"Evaluation started with task ID: {task_id}")
    except Exception as e:
        print(f"Error starting evaluation: {e}")
        return False
    
    # Step 2: Wait for evaluation to complete
    print("\nStep 2: Waiting for evaluation to complete...")
    max_wait_time = 60  # seconds
    start_time = time.time()
    task_completed = False
    
    while time.time() - start_time < max_wait_time:
        try:
            response = requests.get(f"{API_URL}/api/v1/model-status/{task_id}")
            if response.status_code != 200:
                print(f"Error checking status: {response.status_code}")
                time.sleep(2)
                continue
            
            status_data = response.json()
            print(f"Status: {status_data['status']} ({status_data['progress']}%)")
            
            if status_data['progress'] == 100:
                task_completed = True
                break
            
            time.sleep(2)
        except Exception as e:
            print(f"Error checking task status: {e}")
            time.sleep(2)
    
    if not task_completed:
        print("Error: Task did not complete in the allotted time")
        return False
    
    # Step 3: Get the latest evaluation results
    print("\nStep 3: Getting latest evaluation results...")
    try:
        response = requests.get(f"{API_URL}/api/v1/model-evaluation/latest")
        if response.status_code != 200:
            print(f"Error getting evaluation results: {response.status_code}")
            print(response.text)
            return False
        
        eval_results = response.json()
        print("Evaluation Results:")
        pretty_print_json(eval_results)
    except Exception as e:
        print(f"Error getting evaluation results: {e}")
        return False
    
    # Step 4: Get all evaluations
    print("\nStep 4: Getting all evaluations...")
    try:
        response = requests.get(f"{API_URL}/api/v1/model-evaluation/all")
        if response.status_code != 200:
            print(f"Error getting all evaluations: {response.status_code}")
            print(response.text)
            return False
        
        all_evals = response.json()
        if all_evals.get('latest_evaluation'):
            print("Latest evaluation found in 'all' results!")
        else:
            print("Warning: No latest evaluation found in 'all' results")
    except Exception as e:
        print(f"Error getting all evaluations: {e}")
        return False
    
    print("\nAll tests completed successfully!")
    return True

if __name__ == "__main__":
    success = run_test()
    sys.exit(0 if success else 1)
