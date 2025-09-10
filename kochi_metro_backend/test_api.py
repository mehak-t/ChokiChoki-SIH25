import requests
import json
import time

# Configuration
API_BASE_URL = "http://127.0.0.1:8000/api"

def print_section(title):
    print(f"\n{'='*40}")
    print(f"{title}")
    print(f"{'='*40}")

def print_json(data):
    print(json.dumps(data, indent=2))

def test_train_model():
    print_section("Training Model")
    url = f"{API_BASE_URL}/v1/train-model"
    
    response = requests.post(url)
    if response.status_code == 200:
        task_data = response.json()
        print("Training started successfully!")
        print_json(task_data)
        return task_data["task_id"]
    else:
        print(f"Error starting training: {response.status_code}")
        print(response.text)
        return None

def test_evaluate_model():
    print_section("Evaluating Model")
    url = f"{API_BASE_URL}/v1/evaluate-model"
    
    response = requests.post(url)
    if response.status_code == 200:
        task_data = response.json()
        print("Evaluation started successfully!")
        print_json(task_data)
        return task_data["task_id"]
    else:
        print(f"Error starting evaluation: {response.status_code}")
        print(response.text)
        return None

def check_task_status(task_id):
    print_section(f"Checking Task Status: {task_id}")
    url = f"{API_BASE_URL}/v1/model-status/{task_id}"
    
    max_checks = 30
    for i in range(max_checks):
        response = requests.get(url)
        if response.status_code == 200:
            status_data = response.json()
            print(f"Status Check #{i+1}: {status_data['status']} - {status_data['progress']}%")
            
            if status_data["progress"] == 100:
                print("\nTask completed!")
                if "result" in status_data and status_data["result"]:
                    print("Result:")
                    print_json(status_data["result"])
                return status_data
            
            time.sleep(2)  # Wait before checking again
        else:
            print(f"Error checking status: {response.status_code}")
            print(response.text)
            return None
    
    print("Maximum status checks reached without completion")
    return None

def test_generate_schedule():
    print_section("Generating Schedule")
    url = f"{API_BASE_URL}/v1/generate-schedule"
    data = {"num_trains_for_service": 5}
    
    response = requests.post(url, json=data)
    if response.status_code == 200:
        schedule_data = response.json()
        print("Schedule generated successfully!")
        print("\nService Trains:")
        print_json(schedule_data["service"])
        print("\nStandby Trains:")
        print_json(schedule_data["standby"])
        print("\nMaintenance Trains:")
        print_json(schedule_data["maintenance"])
    else:
        print(f"Error generating schedule: {response.status_code}")
        print(response.text)

def run_all_tests():
    # First train the model
    train_task_id = test_train_model()
    if train_task_id:
        train_result = check_task_status(train_task_id)
        
        # Then evaluate the model
        if train_result and train_result["progress"] == 100:
            eval_task_id = test_evaluate_model()
            if eval_task_id:
                eval_result = check_task_status(eval_task_id)
                
                # Finally generate a schedule using the trained model
                if eval_result and eval_result["progress"] == 100:
                    test_generate_schedule()

if __name__ == "__main__":
    run_all_tests()
