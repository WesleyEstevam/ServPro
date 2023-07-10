import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import OSList from './OSList';
import {CloseModalButton, Container, ModalHeader} from './styles';
import {getOSDoMes} from '../../data/services/OrdemServicosServices.js';
import {AuthContext} from '../../context/AuthContext';
import {colors} from '../../styles';
import {Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Modalize} from 'react-native-modalize';
import {Platform} from 'react-native';
import {TouchableOpacity} from 'react-native';
import ControlledInput from '../../components/ControlledInput';
import { useForm } from 'react-hook-form';
import ButtonDefault from '../../components/ButtonDefault';
import { Title } from '../Detalhes/AcoesPage/styles';
import ControlledDateTimePicker from '../../components/ControlledDateTimePicker';
import { AppContext } from '../../context/AppContext';

const TabNavigator = createMaterialTopTabNavigator();

export default function OrdemServico({navigation, osData}) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [preventivaOS, setPreventiva] = useState([]);
  const { ordens, setAllOrdens, loadingStoragedOrdens } = useContext(AppContext);

  const { control, handleSubmit } = useForm();

  const [index, setIndex] = useState(0);

  const modalizeRef = useRef(null);

  const {userCode} = useContext(AuthContext);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={openModal}>
          <Icon
            name="search"
            size={25}
            color={colors.primary}
            style={{marginRight: 15}}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    let canceld = false;

    async function getOS() {
      try {
        const os = await getOSDoMes({tecnicoId: userCode});
        // console.log('hmoe', os);
        if (!canceld) {
          setLoading(false);
          await setAllOrdens(os);
          if (!os.length > 0 && navigation.isFocused()) {
            Alert.alert('Não encontramos nenhum registro.')
          }
        }
      } catch (error) {
        console.log('error:home - ', error.message);
        if (!canceld) {
          setLoading(false);
          navigation.isFocused() && Alert.alert('Deu um erro!');
        }
      }
    }

    if(!loadingStoragedOrdens) {
      if(ordens.length == 0) {
        console.log('buscou');
        getOS();
      } else {
        console.log('cheia');
        setLoading(false);
      }
    }

    return () => {
      canceld = true;
    };
  }, [loadingStoragedOrdens]);

  function openModal() {
    modalizeRef.current?.open();
  }

  function closeModal() {
    modalizeRef.current?.close();
  }

  function getOSAbertas(os) {
    console.log('getOS:abertas ');
    const osAbertas = os.filter(o => o.VISITA == null);

    const sortedOsAbertas = sortByPriority(osAbertas);
    
    return sortedOsAbertas;
  }
  function getOSFechadas(os) {
    console.log('getOS:fechadas ');
    const osFechadas = os.filter(o => o.VISITA != null);

    console.log(osFechadas.length);
    
    const sortedOsFechadas = sortByPriority(osFechadas);
    
    return sortedOsFechadas;
  }

  function sortByPriority(os) {
    const priority1 = os.filter(o => o.id_tipo_os == 4 || o.id_tipo_os == 5 || o.id_tipo_os == 6);
    const priority2 = os.filter(o => o.id_tipo_os == 1 || o.id_tipo_os == 2 || o.id_tipo_os == 3);
    const priority3 = os.filter(o => o.id_tipo_os == 7);

    const sortedOs = [...priority1, ...priority2, ...priority3];

    return sortedOs;
  }

  async function refreshSearch() {
    try {
      setRefreshing(true);
      
      const result = await getOSDoMes({tecnicoId: userCode});

      await setAllOrdens(result);
      setRefreshing(false);

      if (!result.length > 0) {
        Alert.alert('Não encontramos nenhum registro.')
      }
    } catch (error) {
      Alert.alert('A busca falhou.');
      setRefreshing(false);
    }
  }

  async function searchOs(data) {
    console.log(data);
    try {
      setRefreshing(true);
      closeModal();
      
      const result = await getOSDoMes({
        tecnicoId: userCode,
        periodo: data.periodo,
        numOs: data.numero_os,
        cliente: data.cliente,
      });

      await setAllOrdens(result);
      setRefreshing(false);

      if (!result.length > 0) {
        Alert.alert('Não encontramos nenhum registro. Revise os dados e tente novamente!')
      }

    } catch (error) {
      Alert.alert('A busca falhou.');
      console.log('searchos:erro ', error);
      setRefreshing(false);
    }
  };

  const {osAbertas, osFechadas} = useMemo(() => ({osAbertas: getOSAbertas(ordens), osFechadas: getOSFechadas(ordens)}), [ordens]);

  const renderOsAbertas = useCallback(() => <OSList onRefresh={refreshSearch} isRefreshing={refreshing} isLoading={loading} ListaOS={osAbertas} />, [osAbertas, loading, refreshing]);
  const renderOsFechadas = useCallback(() => <OSList onRefresh={refreshSearch} isRefreshing={refreshing} isLoading={loading} ListaOS={osFechadas} />, [osFechadas, loading, refreshing]);

  // const memorizedOsAbertasRender = useMemo(() => renderOsAbertas, [osAbertas, loading, refreshing])
  // const memorizedOsFechadasRender = useMemo(() => renderOsFechadas, [osFechadas, loading, refreshing])
  
  return (
    <Container>
      <TabNavigator.Navigator backBehavior="none" tabBarOptions={{indicatorStyle : {backgroundColor: colors.primary}}}>
        <TabNavigator.Screen name="Abertas" options={{title: `ABERTAS - ${osAbertas.length}`}}>
          {renderOsAbertas}
        </TabNavigator.Screen>
        <TabNavigator.Screen name="Fechadas" options={{title: `FECHADAS - ${osFechadas.length}`}}>
          {renderOsFechadas}
        </TabNavigator.Screen>
        
      </TabNavigator.Navigator>

      {/*<Button title="cadc" onPress={() => navigation.navigate('Detalhes')} /> */}

      <Modalize
        ref={modalizeRef}
        adjustToContentHeight
        keyboardAvoidingBehavior={Platform.OS === 'ios' ? 'padding' : 'heigth'}
        HeaderComponent={
          <ModalHeader>
            <Title>Faça sua pesquisa</Title>
            <CloseModalButton onPress={closeModal}>
              <Icon size={24} name="close" color="#555" />
            </CloseModalButton>
          </ModalHeader>
        }
      >
        <View>
          
          <ControlledInput
            control={control}
            name="cliente"
            label="Busque pelo nome do cliente"
          />

          <ControlledInput
            control={control}
            name="numero_os"
            label="Busque pelo número da OS"
            type="numeric"
          />

          <ControlledDateTimePicker
            control={control}
            name="periodo"
            label="Busque pelo período"
            mode="month"
          />

          <ButtonDefault
            fullWidth
            style={{marginBottom: 5}}
            onPress={handleSubmit(searchOs)}
          >
            Pesquisar
          </ButtonDefault>
          
        </View>
      </Modalize>
    </Container>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    margin: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.secondary,
  },
  loadingContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
