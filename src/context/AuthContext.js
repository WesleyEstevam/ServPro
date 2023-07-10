import React, {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

export const AuthContext = createContext();

export default function AuthProvider({children}) {
  const [isLoged, setIsLoged] = useState(false);
  const [userCode, setUserCode] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    async function loadStoragedData() {
      const userData = await AsyncStorage.getItem('@Auth:user');

      if (userData) {
        const parserdUserData = JSON.parse(userData);
        setUserCode(parserdUserData.userCode);
        setUserName(parserdUserData.name);
        console.log('sync', JSON.parse(userData));
        setIsLoged(true);
      }
    }

    loadStoragedData();
  }, []);

  async function setUserData(userData) {
    console.log(userData);
    setUserCode(userData.Codigotecnico);
    setUserName(userData.Nome);
    setIsLoged(true);

    await AsyncStorage.setItem(
      '@Auth:user',
      JSON.stringify({userCode: userData.Codigotecnico, name: userData.Nome}),
    );
  }

  async function logout() {
    await AsyncStorage.multiRemove([
      '@Auth:user',
    ]);

    setUserCode(null);
    setIsLoged(false);
    setUserName('');
  }

  return (
    <AuthContext.Provider
      value={{
        isLoged,
        userCode,
        userName,
        setUserData,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
