// In App.js in a new project
import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { colors } from "./src/styles";

import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "./src/navigation";
import AuthProvider from "./src/context/AuthContext";
import AppProvider from "./src/context/AppContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar
        translucent
        backgroundColor={colors.white}
        animated
        barStyle={"dark-content"}
      />
      <AuthProvider>
        <AppProvider>
          <NavigationContainer>
            <Navigation />
          </NavigationContainer>
        </AppProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
