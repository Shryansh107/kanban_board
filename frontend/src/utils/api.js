import { API_BASE_URL } from '../constants';

export const fetchTasksFromAPI = async () => {
  const response = await fetch(`${API_BASE_URL}/tasks`);
  if (!response.ok) {
    throw new Error(`Failed to load tasks (HTTP ${response.status})`);
  }
  return response.json();
};

export const createTaskInAPI = async (title) => {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error || `Failed to create task (HTTP ${response.status})`);
  }
  return response.json();
};

export const updateTaskStatusInAPI = async (id, status) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error || `Failed to update task (HTTP ${response.status})`);
  }
  return response.json();
};

export const deleteTaskInAPI = async (id) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error || `Failed to delete task (HTTP ${response.status})`);
  }
  return response.json();
};
