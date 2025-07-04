// Shared types for dashboard
export interface SubTask {
  id: string;
  title: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  userId: string;
  subTasks?: SubTask[];
  subtasks?: SubTask[]; // for backend compatibility
} 