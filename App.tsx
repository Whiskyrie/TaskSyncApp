import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Platform,
  Alert,
  RefreshControl,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import "react-native-get-random-values";
import LocalStorageService from "./src/services/localStorageServices";
import SyncService from "./src/services/syncService";
import TaskInput from "./src/components/TaskInput";
import { Task } from "./src/types/types";
import { Ionicons } from "@expo/vector-icons";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const synchronizeTasks = async () => {
    try {
      setIsRefreshing(true);
      // Verifica a conexão de internet
      const netState = await NetInfo.fetch();

      if (netState.isConnected) {
        // Sincroniza as tarefas
        await SyncService.syncTasks();

        // Recarrega as tarefas do armazenamento local após sincronização
        const updatedTasks = await LocalStorageService.getTasks();
        setTasks(updatedTasks);
      } else {
        Alert.alert("Erro", "Sem conexão com a internet");
      }
    } catch (error) {
      console.error("Erro ao sincronizar tarefas", error);
      Alert.alert("Erro", "Não foi possível sincronizar as tarefas");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const loadTasks = async () => {
      const savedTasks = await LocalStorageService.getTasks();
      setTasks(savedTasks);
    };
    loadTasks();

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? false);
      if (state.isConnected) {
        SyncService.syncTasks();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleTaskAdded = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleDeleteTask = async (taskId: string) => {
    Alert.alert(
      "Excluir Tarefa",
      "Tem certeza que deseja excluir esta tarefa?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await LocalStorageService.deleteTask(taskId);

              const updatedTasks = tasks.filter((task) => task.id !== taskId);
              setTasks(updatedTasks);
            } catch (error) {
              console.error("Falha ao deletar tarefa", error);
              Alert.alert(
                "Erro",
                "Não foi possível excluir a tarefa. Tente novamente."
              );
            }
          },
        },
      ]
    );
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <View style={styles.taskItemContainer}>
      <View style={styles.taskItem}>
        <View style={styles.taskContent}>
          <Text style={styles.taskText}>{item.title}</Text>
          <Text
            style={[
              styles.syncStatus,
              {
                color: item.synced ? "#4CAF50" : "#FF5722",
                backgroundColor: item.synced ? "#E8F5E9" : "#FFEBEE",
              },
            ]}
          >
            {item.synced ? "Sincronizado" : "Pendente"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteTask(item.id)}
        >
          <Ionicons name="trash-outline" size={24} color="#FF5722" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4b0000" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tarefas</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.statusContainer}
            onPress={synchronizeTasks}
            disabled={isRefreshing}
          >
            <Ionicons
              name={isRefreshing ? "sync" : "sync-outline"}
              size={20}
              color="white"
            />
          </TouchableOpacity>
          <View style={styles.statusContainer}>
            <Text style={styles.status}>
              {isOnline ? "🟢 Online" : "🔴 Offline"}
            </Text>
          </View>
        </View>
      </View>

      <TaskInput onTaskAdded={handleTaskAdded} />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTaskItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={synchronizeTasks}
            colors={["#4b0000"]} // Cor do indicador de refresh no Android
            tintColor="#4b0000" // Cor do indicador de refresh no iOS
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyListContainer}>
            <Ionicons name="list-outline" size={64} color="#9E9E9E" />
            <Text style={styles.emptyList}>Nenhuma tarefa adicionada</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#4b0000",
    paddingTop: Platform.OS === "android" ? 25 : 20, // Remove a margem no Android
    paddingBottom: 20,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  statusContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 10, // Adicione isso
  },
  status: {
    color: "white",
    fontSize: 14,
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  taskItemContainer: {
    marginVertical: 8,
  },
  taskItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  taskContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  syncStatus: {
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  deleteButton: {
    marginLeft: 10,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyList: {
    marginTop: 16,
    color: "#9E9E9E",
    fontSize: 16,
  },
});
