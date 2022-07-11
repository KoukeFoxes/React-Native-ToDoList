import { StatusBar } from "expo-status-bar";
import React from "react";
import storage from "./storage";

import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  Keyboard,
  Alert,
  ToastAndroid
} from "react-native";

import Task from "./components/Task";

export default function App() {
  const [task, setTask] = React.useState();
  const [taskItems, setTaskItems] = React.useState([]);

  const handleAddTask = () => {
    Keyboard.dismiss();
    setTaskItems([...taskItems, task]);
    setTask(null);
  };

  React.useEffect(() => {
    storage
      .load({
        key: "task",
        id: "task",
      })
      .then((ret) => {
        // 如果找到数据，则在then方法中返回
        setTaskItems(JSON.parse(ret))
        console.log(ret)
      })
      .catch((err) => {
        // 如果没有找到数据且没有sync方法，
        // 或者有其他异常，则在catch中返回
        console.warn(err.message);
        switch (err.name) {
          case "NotFoundError":
            // TODO;
            break;
          case "ExpiredError":
            // TODO
            break;
        }
      });
  }, []);

  React.useEffect(() => {
    storage.save({
      key: 'task', // 注意:请不要在key中使用_下划线符号!
      id: 'task', // 注意:请不要在id中使用_下划线符号!
      data: JSON.stringify(taskItems), // 这是要存储的数据
    });
  },[taskItems]);

  const handleRemoveTask = (index) => {
    setTaskItems(taskItems.filter((item, i) => i !== index));
    Platform.OS === "android"
      ? ToastAndroid.show("Task removed", ToastAndroid.SHORT)
      : Alert.alert("Task removed");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#E8EAED",
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    noTasks: {
      color: "darkgrey",
    },
    taskWapper: {
      paddingTop: 80,
      paddingHorizontal: 20,
    },
    selectionTitle: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 10,
    },
    items: {
      marginTop: 30,
    },
    writeTaskWarpper: {
      position: "absolute",
      bottom: 60,
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-around",
      alignContent: "center",
    },
    input: {
      paddingVertical: 15,
      paddingHorizontal: 15,
      backgroundColor: "white",
      borderRadius: 60,
      borderColor: "#C0C0C0",
      borderWidth: 1,
      width: 250,
    },
    addWapper: {
      width: 60,
      height: 60,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
      borderRadius: 60,
    },
    addText: {},
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* SafeAreaView only works on iOS */}
      <View style={styles.taskWapper}>
        <Text style={styles.selectionTitle}>Today's tasks</Text>

        <View style={styles.items}>
          {taskItems.length == 0 ? (
            <Text style={styles.noTasks}>No tasks yet</Text>
          ) : (
            taskItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleRemoveTask(index)}
              >
                <Task text={item} />
              </TouchableOpacity>
            ))
          )}
          {}
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWarpper}
      >
        <TextInput
          style={styles.input}
          placeholder="Write a task..."
          onChangeText={(text) => setTask(text)}
          value={task}
        ></TextInput>
        <TouchableOpacity onPress={() => handleAddTask()}>
          <View style={styles.addWapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
