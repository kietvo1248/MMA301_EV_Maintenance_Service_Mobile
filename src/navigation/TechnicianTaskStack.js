import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TechnicianTasksScreen from "../screens/Technician/TechnicianTasksScreen";
import TaskDetailScreen from "../screens/Technician/TaskDetailScreen";

const Stack = createNativeStackNavigator();

export default function TechnicianTaskStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TechnicianTasks"
        component={TechnicianTasksScreen}
        options={{
          title: "Công việc của tôi",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={{
          title: "Chi tiết công việc",
          headerBackTitle: "Trở lại",
          headerShown: true,
         
          presentation: "card",
        }}
      />
    </Stack.Navigator>
  );
}
