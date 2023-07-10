import React, {useCallback} from 'react';
import {
  ActivityIndicator,
  FlatList,
  View,
} from 'react-native';
import {ListItem, Card} from 'react-native-elements';
import {colors} from '../../../styles';
import {useNavigation} from '@react-navigation/native';
import { ItemContainer, ItemContent, ItemSubTitle, ItemTitle, ItemTypeIndicator} from './styles';

export default function OSList({ListaOS, isLoading, isRefreshing, onRefresh}) {
  const navigation = useNavigation();

  async function getClient() {}

  function getOSColor(id_tipo_os) {
    if (id_tipo_os == 4 || id_tipo_os == 5 || id_tipo_os == 6) {
      return '#ff0000';
    } else if (id_tipo_os == 1 || id_tipo_os == 2 || id_tipo_os == 3) {
      return '#ff0';
    } else {
      return '#0f0';
    }
  }

  function exibeDatas(previsao) {
      if (previsao != null) {
        previsao = new Date(previsao);
        let dataFormatada = ((previsao.getDate() + 1 )) + "/" + ((previsao.getMonth() + 1)) + "/" + previsao.getFullYear();         
        return dataFormatada;
    }   
  }

  function navigateToDetalhes(item) {
    return function(){
      navigation.navigate('Detalhes', item);
    }
  }

  const Item = ({item, index}) => (
    <ItemContainer
      onPress={navigateToDetalhes(item)}
    >
      <ItemContent>
        <ItemTitle numberOfLines={1}>{item.NOME}</ItemTitle>
        <ItemSubTitle>

          {item.ORDEM} {'    '} {exibeDatas(item.previsao) || item.competencia}
          
        </ItemSubTitle>
      </ItemContent>

      <ListItem.Chevron style={{marginRight: 15}} />
      <ItemTypeIndicator color={getOSColor(item.id_tipo_os)} />
    </ItemContainer>
  );

  const renderItem = useCallback(({item, index}) => <Item item={item} index={index} />, []);
  const ITEM_HEIGHT = 85;
  const getItemLayout = useCallback((data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);
  const extractKey = useCallback((item) => item.ORDEM, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 10,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 1,
          }}>
          <ActivityIndicator color={colors.primary} size={60} />
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={ListaOS}
      keyExtractor={extractKey}
      onRefresh={onRefresh}
      refreshing={isRefreshing}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      windowSize={3}
    />
  );
}
