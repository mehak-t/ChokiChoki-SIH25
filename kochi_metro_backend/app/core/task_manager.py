# A simple in-memory dictionary to store the status of background tasks.
# In a production app, you would use a more robust tool like Redis or Celery.
tasks = {}
latest_evaluation = None

def import_time():
    """Helper function to get current time."""
    from datetime import datetime
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def update_task_status(task_id: str, status: str, progress: int, result=None):
    """Updates the status and progress of a task, with optional result data."""
    tasks[task_id] = {"status": status, "progress": progress, "result": result}
    
    # If this is a completed evaluation, store it as the latest
    if progress == 100 and result and "accuracy" in result:
        global latest_evaluation
        latest_evaluation = {
            "task_id": task_id,
            "completed_at": import_time(),
            **result
        }
    
    print(f"Task {task_id}: {status} ({progress}%)")

def get_task_status(task_id: str):
    """Returns the current status of a task, or None if not found."""
    return tasks.get(task_id)

def get_latest_evaluation():
    """Returns the latest model evaluation result."""
    return latest_evaluation

def get_all_completed_tasks():
    """Returns all completed tasks with their results."""
    return {
        task_id: task_data 
        for task_id, task_data in tasks.items() 
        if task_data["progress"] == 100
    }
