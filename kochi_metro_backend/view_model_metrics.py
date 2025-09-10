#!/usr/bin/env python
"""
View Model Metrics

This script displays the latest model evaluation results
without needing to access the API directly.
"""

import asyncio
import os
import json
from datetime import datetime
import os.path
import sys

# Try importing tabulate and colorama, use fallback if not available
try:
    from tabulate import tabulate
    from colorama import init, Fore, Style
    init()  # Initialize colorama
    HAS_FANCY_OUTPUT = True
except ImportError:
    HAS_FANCY_OUTPUT = False
    # Define fallback versions of colorama's Fore and Style classes
    class DummyColorama:
        def __getattr__(self, name):
            return ""
    Fore = Style = DummyColorama()
    
    def tabulate(data, headers=None, tablefmt=None):
        """Simple fallback for tabulate"""
        result = []
        if headers:
            result.append(" | ".join(str(h) for h in headers))
            result.append("-" * (len(result[0])))
        for row in data:
            result.append(" | ".join(str(cell) for cell in row))
        return "\n".join(result)

# Try importing from app modules
try:
    from app.db.client import db
    from app.core.task_manager import get_latest_evaluation, get_all_completed_tasks
except ImportError:
    print("Error: Could not import required modules.")
    print("Make sure you're running this script from the project root directory.")
    print("Try: cd /path/to/kochi_metro_backend && ./view_model_metrics.py")
    sys.exit(1)

# Path to the model file
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "app/ml/models/risk_model.joblib")

def color_metric(value, thresholds):
    """Add color to metrics based on thresholds."""
    if value >= thresholds[0]:
        return f"{Fore.GREEN}{value:.3f}{Style.RESET_ALL}"
    elif value >= thresholds[1]:
        return f"{Fore.YELLOW}{value:.3f}{Style.RESET_ALL}"
    else:
        return f"{Fore.RED}{value:.3f}{Style.RESET_ALL}"

async def view_model_metrics():
    """Display all model metrics in a formatted table."""
    print(f"{Fore.CYAN}=== Kochi Metro AI Risk Model Metrics ==={Style.RESET_ALL}")
    
    # Connect to DB to ensure we have access to data
    try:
        await db.connect()
    except Exception as e:
        print(f"{Fore.RED}Error connecting to database: {e}{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}Make sure the server is running and the database is accessible.{Style.RESET_ALL}")
        return
    
    # Get the latest evaluation
    latest_eval = get_latest_evaluation()
    
    if latest_eval:
        # Create a formatted table for metrics
        headers = ["Metric", "Value", "Description"]
        rows = [
            ["Records (Test Set)", latest_eval["records_used_for_test"], "Number of records used for testing"],
            ["Accuracy", color_metric(latest_eval["accuracy"], [0.9, 0.8]), "Overall percentage of correct predictions"],
            ["Precision", color_metric(latest_eval["precision"], [0.9, 0.8]), "Of all trains predicted to fail, how many actually failed"],
            ["Recall", color_metric(latest_eval["recall"], [0.85, 0.7]), "Of all trains that actually failed, how many were identified"],
            ["F1 Score", color_metric(latest_eval["f1_score"], [0.9, 0.8]), "Balanced metric between precision and recall"]
        ]
        
        print(tabulate(rows, headers=headers, tablefmt="fancy_grid"))
        print(f"\nEvaluation completed at: {latest_eval.get('completed_at', 'Unknown')}")
        print(f"Task ID: {latest_eval.get('task_id', 'Unknown')}")
    else:
        print(f"{Fore.YELLOW}No evaluation results found. Run an evaluation first.{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}To run evaluation: curl -X POST http://localhost:8000/api/v1/evaluate-model{Style.RESET_ALL}")
        
    # Get model info
    if os.path.exists(MODEL_PATH):
        model_size = os.path.getsize(MODEL_PATH) / (1024 * 1024)  # Size in MB
        model_modified = datetime.fromtimestamp(os.path.getmtime(MODEL_PATH))
        
        print(f"\n{Fore.CYAN}Model Information:{Style.RESET_ALL}")
        print(f"Model Path: {MODEL_PATH}")
        print(f"Model Size: {model_size:.2f} MB")
        print(f"Last Modified: {model_modified}")
    else:
        print(f"\n{Fore.YELLOW}No model file found at {MODEL_PATH}{Style.RESET_ALL}")
    
    # List completed tasks
    completed_tasks = get_all_completed_tasks()
    if completed_tasks:
        print(f"\n{Fore.CYAN}Recent Completed Tasks:{Style.RESET_ALL}")
        task_table = []
        for task_id, task_data in list(completed_tasks.items())[-5:]:  # Last 5 tasks
            task_type = "Evaluation" if task_data.get("result") and "accuracy" in task_data["result"] else "Training"
            result = task_data.get("result", {})
            summary = f"Accuracy: {result.get('accuracy', 'N/A')}" if "accuracy" in result else "No metrics"
            task_table.append([task_id[:8] + "...", task_type, task_data["status"], summary])
        
        print(tabulate(task_table, headers=["Task ID", "Type", "Status", "Summary"], tablefmt="simple"))
    
    # Disconnect from DB
    try:
        await db.disconnect()
    except Exception as e:
        # Don't show the error as we're already done with DB operations
        pass
    
    print(f"\n{Fore.CYAN}For more commands, try:{Style.RESET_ALL}")
    print("  ./model_client.py evaluate   # Start a new evaluation")
    print("  ./model_client.py latest     # Show latest evaluation via API")

if __name__ == "__main__":
    # No need to check for imports here as we already import them at the top of the file
    # If they're missing, the script will fail immediately with a clear ImportError
    
    # Run the async function
    asyncio.run(view_model_metrics())
