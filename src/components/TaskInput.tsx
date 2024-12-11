import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from "react-native";
import LocalStorageService from "../services/localStorageServices";
import { TaskInputProps } from "../types/types";
import { Ionicons } from "@expo/vector-icons";

const TaskInput: React.FC<TaskInputProps> = ({ onTaskAdded }) => {
  const [taskTitle, setTaskTitle] = useState("");

  const handleAddTask = async () => {
    if (taskTitle.trim()) {
      const newTask = await LocalStorageService.addTask({
        title: taskTitle,
        completed: false,
      });

      onTaskAdded(newTask);
      setTaskTitle("");
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Ionicons
          name="add-circle-outline"
          size={24}
          color="#4b0000"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          value={taskTitle}
          onChangeText={setTaskTitle}
          placeholder="Adicionar nova tarefa"
          placeholderTextColor="#9E9E9E"
        />
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddTask}
        disabled={!taskTitle.trim()}
      >
        <Ionicons
          name="send"
          size={24}
          color={taskTitle.trim() ? "#6200EE" : "#9E9E9E"}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "white",
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
  },
  addButton: {
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TaskInput;
