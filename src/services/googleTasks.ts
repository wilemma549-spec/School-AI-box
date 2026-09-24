import { GoogleTaskList, GoogleTaskResponse } from '../types';

export const fetchTaskLists = async (accessToken: string): Promise<GoogleTaskList[]> => {
  const response = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to fetch Google Task lists (${response.status})`);
  }

  const data = await response.json();
  return (data.items || []).map((item: any) => ({
    id: item.id,
    title: item.title,
    updated: item.updated,
  }));
};

export const createTaskList = async (accessToken: string, title: string): Promise<GoogleTaskList> => {
  const response = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to create Task List "${title}"`);
  }

  const data = await response.json();
  return {
    id: data.id,
    title: data.title,
    updated: data.updated,
  };
};

export const getOrCreateSchoolTaskList = async (accessToken: string): Promise<GoogleTaskList> => {
  const lists = await fetchTaskLists(accessToken);
  const existing = lists.find((l) => l.title.toLowerCase().includes('school') || l.title === 'School Inbox');
  if (existing) {
    return existing;
  }
  // If no school list exists, create one dedicated for School AI Inbox
  return await createTaskList(accessToken, 'School Inbox 🎒');
};

export interface TaskPayload {
  title: string;
  due_date?: string | null;
  notes?: string;
}

export const createTask = async (
  accessToken: string,
  listId: string,
  task: TaskPayload
): Promise<GoogleTaskResponse> => {
  const body: any = {
    title: task.title,
    notes: task.notes || '',
  };

  // Google Tasks API expects RFC 3339 formatted timestamp e.g. "2026-09-28T00:00:00.000Z"
  if (task.due_date && task.due_date.trim()) {
    try {
      const parsedDate = new Date(`${task.due_date}T09:00:00.000Z`);
      if (!isNaN(parsedDate.getTime())) {
        body.due = parsedDate.toISOString();
      }
    } catch (e) {
      console.warn('Could not parse due date:', task.due_date);
    }
  }

  const response = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${encodeURIComponent(listId)}/tasks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to create task "${task.title}" in Google Tasks`);
  }

  const data = await response.json();
  return {
    id: data.id,
    title: data.title,
    status: data.status,
    due: data.due,
    notes: data.notes,
  };
};
