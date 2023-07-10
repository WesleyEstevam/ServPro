import {createStackNavigator} from '@react-navigation/stack';
import React, {useContext} from 'react';
import {AuthContext} from '../context/AuthContext';
import AppNavigation from './appNavigation';
import AuthNavigation from './authNavigation';

const MainNavigation = createStackNavigator();

export default function Navigation() {
  const {isLoged} = useContext(AuthContext);

  return (
    <MainNavigation.Navigator>
      {isLoged ? (
        <MainNavigation.Screen
          name="Main"
          component={AppNavigation}
          options={{headerShown: false}}
        />
      ) : (
        <MainNavigation.Screen
          name="SignIn"
          component={AuthNavigation}
          options={{headerShown: false}}
        />
      )}
    </MainNavigation.Navigator>
  );
}
