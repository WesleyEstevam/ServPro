import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Acesso from '../../pages/Acesso';

const AuthStack = createStackNavigator();

export default function AuthNavigation() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="Login"
        component={Acesso}
        options={{headerShown: false}}
      />
    </AuthStack.Navigator>
  );
}
