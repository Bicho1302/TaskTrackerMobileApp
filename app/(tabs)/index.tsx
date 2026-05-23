import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  // Stores all tasks
  const [tasks, setTasks] = useState<string[]>([]);

  // Stores the current text input
  const [task, setTask] = useState("");

  // Load saved tasks when app starts
  useEffect(() => {
    loadTasks();
  }, []);

  // Save tasks to phone storage
  const saveTasks = async (taskList: string[]) => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(taskList));
    } catch (error) {
      console.log(error);
    }
  };

  // Load tasks from phone storage
  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");

      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Add a new task
  const addTask = () => {
    if (task.trim() === "") return;

    const updatedTasks = [...tasks, task];

    setTasks(updatedTasks);

    saveTasks(updatedTasks);

    setTask("");
  };

  // Delete a task
  const deleteTask = (index: number) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);

    setTasks(updatedTasks);

    saveTasks(updatedTasks);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Tracker App</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter a task"
        value={task}
        onChangeText={setTask}
      />

      <Button title="Add Task" onPress={addTask} />

      <FlatList
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.task}
            onPress={() => deleteTask(index)}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#999",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },

  task: {
    backgroundColor: "#dddddd",
    padding: 15,
    marginTop: 10,
    borderRadius: 5,
  },
});
