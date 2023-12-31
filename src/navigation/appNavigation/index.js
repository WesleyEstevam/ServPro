import React, { useContext } from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";
import RootNavigation from "./rootNavigation";
import MapaAtendimento from "../../pages/MapaAtendimento";
import MapNavigation from "./mapNavigation";
import Detalhes from "../../pages/Detalhes";
import Acesso from "../../pages/Acesso";
import CustomDrawer from "../../components/CustomDrawer";
import { AppContext } from "../../context/AppContext";

const DrawerNavigator = createDrawerNavigator();

export default function AppNavigation() {
  return (
    <DrawerNavigator.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      initialRouteName="RootNavigation"
    >
      <DrawerNavigator.Screen
        name="RootNavigation"
        component={RootNavigation}
        options={{ drawerLabel: "Ordens de Serviços", headerShown: false }}
      />

      <DrawerNavigator.Screen
        name="MapNavigation"
        component={MapNavigation}
        options={{ drawerLabel: "Mapa de Atendimento", headerShown: false }}
      />

      <DrawerNavigator.Screen
        name="Detalhes"
        component={Detalhes}
        options={{ drawerLabel: "Detalhes", headerShown: false }}
      />
    </DrawerNavigator.Navigator>
  );
}
