import React, {useContext} from 'react';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import {Text} from 'react-native-elements';
import {Image, View} from 'react-native';
import {colors} from '../../styles';
import {AuthContext} from '../../context/AuthContext';
import {AppContext} from '../../context/AppContext';

export default function CustomDrawer(props) {
  const {logout, userName} = useContext(AuthContext);
  const { clearStorage } = useContext(AppContext);
  // console.log(Object.keys(props));

  async function doLogout() {
    await clearStorage();
    logout();
  }
  return (
    <DrawerContentScrollView {...props}>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 15,
          marginBottom: 25,
        }}>
        <Image
          source={require('../../assets/img/servmobi_1.png')}
          style={{marginTop: 22, width: 130, height:130 }}
        />
        <Text style={{fontSize: 17, marginTop: 15, fontWeight: 'bold', textAlign: 'center'}}>
          Bem-vindo! {'\n'}
          {userName}
        </Text>
      </View>

      <DrawerItemList {...props} activeTintColor='#f38916' />
      <DrawerItem label="Sair" onPress={doLogout} />

      </DrawerContentScrollView>
  );
}
