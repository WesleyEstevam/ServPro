import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Detalhes from "../../pages/Detalhes";
import { colors } from "../../styles";
import Icon from "react-native-vector-icons/MaterialIcons";
import { TouchableOpacity } from "react-native";
import MapaAtendimento from "../../pages/MapaAtendimento";

const Stack = createStackNavigator();

const DrawerMenu = ({ navigation }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.openDrawer();
      }}
    >
      <Icon
        name="menu"
        size={25}
        color={colors.primary}
        style={{ marginLeft: 15 }}
      />
    </TouchableOpacity>
  );
};

const MapNavigation = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerTintColor: colors.primary,
      }}
    >
      <Stack.Screen
        name="MapaAtendimento"
        component={MapaAtendimento}
        options={{
          title: "Mapa de Atendimento",
          headerLeft: () => <DrawerMenu navigation={navigation} />,
        }}
      />
      <Stack.Screen name="Detalhes" component={Detalhes} />
    </Stack.Navigator>
  );
};

export default MapNavigation;
