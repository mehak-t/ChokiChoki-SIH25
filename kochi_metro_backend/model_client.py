#!/usr/bin/env python
"""
Model Metrics REST Client

This script provides simple command-line access to the model evaluation API endpoints.
"""

import argparse
import json
import requests
from datetime import datetime

# Define server URL
API_URL = "http://localhost:8000"

def pretty_print_json(data):
    """Format and print JSON data with colors if possible"""
    try:
        from pygments import highlight
        from pygments.lexers import JsonLexer
        from pygments.formatters import TerminalFormatter
        formatted = json.dumps(data, indent=2)
        print(highlight(formatted, JsonLexer(), TerminalFormatter()))
    except ImportError:
        print(json.dumps(data, indent=2))

def train_model():
    """Start model training in the background"""
    try:
        response = requests.post(f"{API_URL}/api/v1/train-model")
        if response.status_code == 200:
            result = response.json()
            print(f"Training started successfully! Task ID: {result['task_id']}")
            print(f"You can check status with: python model_client.py status {result['task_id']}")
            return result
        else:
            print(f"Error: Server returned status code {response.status_code}")
            print(response.text)
    except requests.RequestException as e:
        print(f"Error connecting to server: {e}")

def evaluate_model():
    """Start model evaluation in the background"""
    try:
        response = requests.post(f"{API_URL}/api/v1/evaluate-model")
        if response.status_code == 200:
            result = response.json()
            print(f"Evaluation started successfully! Task ID: {result['task_id']}")
            print(f"You can check status with: python model_client.py status {result['task_id']}")
            return result
        else:
            print(f"Error: Server returned status code {response.status_code}")
            print(response.text)
    except requests.RequestException as e:
        print(f"Error connecting to server: {e}")

def get_task_status(task_id):
    """Get the status of a specific task"""
    try:
        response = requests.get(f"{API_URL}/api/v1/model-status/{task_id}")
        if response.status_code == 200:
            result = response.json()
            print(f"Task Status: {result['status']}")
            print(f"Progress: {result['progress']}%")
            
            if result['progress'] == 100 and result.get('result'):
                print("\nTask completed! Results:")
                pretty_print_json(result['result'])
            return result
        elif response.status_code == 404:
            print(f"Task with ID {task_id} not found.")
        else:
            print(f"Error: Server returned status code {response.status_code}")
            print(response.text)
    except requests.RequestException as e:
        print(f"Error connecting to server: {e}")

def get_latest_evaluation():
    """Get the latest model evaluation"""
    try:
        response = requests.get(f"{API_URL}/api/v1/model-evaluation/latest")
        if response.status_code == 200:
            result = response.json()
            print("Latest Model Evaluation Results:")
            pretty_print_json(result)
            return result
        elif response.status_code == 404:
            print("No evaluation results found. Run an evaluation first.")
        else:
            print(f"Error: Server returned status code {response.status_code}")
            print(response.text)
    except requests.RequestException as e:
        print(f"Error connecting to server: {e}")

def get_all_evaluations():
    """Get all model evaluations"""
    try:
        response = requests.get(f"{API_URL}/api/v1/model-evaluation/all")
        if response.status_code == 200:
            result = response.json()
            
            if result.get('latest_evaluation'):
                print("Latest Evaluation:")
                pretty_print_json(result['latest_evaluation'])
            else:
                print("No evaluations have been completed yet.")
                
            if result.get('completed_tasks'):
                print("\nAll Completed Tasks:")
                for task_id, task in result['completed_tasks'].items():
                    print(f"\nTask ID: {task_id}")
                    print(f"Status: {task['status']}")
                    print(f"Progress: {task['progress']}%")
                    if task.get('result') and 'accuracy' in task['result']:
                        print(f"Accuracy: {task['result']['accuracy']:.4f}")
                        print(f"F1 Score: {task['result']['f1_score']:.4f}")
            else:
                print("\nNo tasks have been completed yet.")
                
            return result
        else:
            print(f"Error: Server returned status code {response.status_code}")
            print(response.text)
    except requests.RequestException as e:
        print(f"Error connecting to server: {e}")

def main():
    """Parse arguments and execute commands"""
    parser = argparse.ArgumentParser(
        description="Command-line client for Kochi Metro AI Model API",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python model_client.py train         # Start model training
  python model_client.py evaluate      # Start model evaluation
  python model_client.py status <id>   # Check status of a task
  python model_client.py latest        # Get latest evaluation results
  python model_client.py all           # Get all evaluation results
        """
    )
    
    subparsers = parser.add_subparsers(dest="command", help="Command to execute")
    
    # Train command
    train_parser = subparsers.add_parser("train", help="Start model training")
    
    # Evaluate command
    evaluate_parser = subparsers.add_parser("evaluate", help="Start model evaluation")
    
    # Status command
    status_parser = subparsers.add_parser("status", help="Check status of a task")
    status_parser.add_argument("task_id", help="Task ID to check")
    
    # Latest command
    latest_parser = subparsers.add_parser("latest", help="Get latest evaluation results")
    
    # All command
    all_parser = subparsers.add_parser("all", help="Get all evaluation results")
    
    args = parser.parse_args()
    
    if args.command == "train":
        train_model()
    elif args.command == "evaluate":
        evaluate_model()
    elif args.command == "status" and args.task_id:
        get_task_status(args.task_id)
    elif args.command == "latest":
        get_latest_evaluation()
    elif args.command == "all":
        get_all_evaluations()
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
