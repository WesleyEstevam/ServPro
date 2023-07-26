import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import OrdemServico from "../../pages/OrdemServico";
import Detalhes from "../../pages/Detalhes";
import { colors } from "../../styles";
// import { useNavigation } from "@react-navigation/core";
import Icon from "react-native-vector-icons/MaterialIcons";
import { TouchableOpacity } from "react-native";

const Stack = createStackNavigator();

// const navigation = useNavigation();

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

const FilterIcon = () => {
  return (
    <TouchableOpacity>
      <Icon
        name="filter-list-alt"
        size={25}
        color={colors.primary}
        style={{ marginRight: 15 }}
      />
    </TouchableOpacity>
  );
};

const StackHome = ({ navigation }) => {
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
        name="OrdemServico"
        component={OrdemServico}
        options={{
          title: "Ordens de Serviço",
          headerLeft: () => <DrawerMenu navigation={navigation} />,
        }}
      />
      <Stack.Screen name="Detalhes" component={Detalhes} />
    </Stack.Navigator>
  );
};

export default StackHome;
