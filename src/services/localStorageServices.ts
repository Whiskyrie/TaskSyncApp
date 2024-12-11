import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../types/types';

class LocalStorageService {
    static async getTasks(): Promise<Task[]> {
        try {
            const tasksJson = await AsyncStorage.getItem('@tasks');
            return tasksJson ? JSON.parse(tasksJson) : [];
        } catch (error) {
            console.error('Erro ao recuperar tarefas', error);
            return [];
        }
    }

    static async addTask(taskData: Omit<Task, 'id' | 'createdAt' | 'synced'>): Promise<Task> {
        try {
            const tasks = await this.getTasks();

            const newTask: Task = {
                id: uuidv4(),
                ...taskData,
                createdAt: new Date().toISOString(),
                synced: false
            };

            const updatedTasks = [...tasks, newTask];
            await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));

            return newTask;
        } catch (error) {
            console.error('Erro ao adicionar tarefa', error);
            throw error;
        }
    }

    static async updateTaskSyncStatus(taskId: string): Promise<void> {
        try {
            const tasks = await this.getTasks();
            const updatedTasks = tasks.map(task =>
                task.id === taskId ? { ...task, synced: true } : task
            );

            await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));
        } catch (error) {
            console.error('Erro ao atualizar status de sincronização', error);
        }
    }
    static async deleteTask(taskId: string): Promise<void> {
        try {
            // Busca tarefas atuais
            const tasks = await this.getTasks();

            // Filtra removendo a tarefa com o ID especificado
            const updatedTasks = tasks.filter(task => task.id !== taskId);

            // Salva a lista atualizada no AsyncStorage
            await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));
        } catch (error) {
            console.error('Erro ao deletar tarefa', error);
            throw error;
        }
    }

    // Método opcional para limpar todas as tarefas
    static async clearAllTasks(): Promise<void> {
        try {
            await AsyncStorage.removeItem('@tasks');
        } catch (error) {
            console.error('Erro ao limpar todas as tarefas', error);
            throw error;
        }
    }
}


export default LocalStorageService;