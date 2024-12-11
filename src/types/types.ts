export interface Task {
    id: string;
    title: string;
    completed: boolean;
    createdAt: string;
    synced: boolean;
}

export interface TaskInputProps {
    onTaskAdded: (task: Task) => void;
}