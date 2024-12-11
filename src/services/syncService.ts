import NetInfo from "@react-native-community/netinfo";
import LocalStorageService from './localStorageServices';
import { Task } from '../types/types';

class SyncService {
    static async syncTasks(): Promise<void> {
        // Verifica conectividade
        const netState = await NetInfo.fetch();
        if (!netState.isConnected) return;

        try {
            const tasks = await LocalStorageService.getTasks();
            const unsyncedTasks = tasks.filter(task => !task.synced);

            // Simulação de envio para backend
            for (let task of unsyncedTasks) {
                const response = await this.sendTaskToServer(task);

                if (response.success) {
                    await LocalStorageService.updateTaskSyncStatus(task.id);
                }
            }
        } catch (error) {
            console.error('Erro durante sincronização', error);
        }
    }

    // Simulação de envio para servidor
    static async sendTaskToServer(task: Task): Promise<{ success: boolean }> {
        // Simula uma requisição de API
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 1000);
        });
    }
}

export default SyncService;