import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {View, Text, Button, Image, PermissionsAndroid} from 'react-native';
import {colors} from '../../styles';
import {iconMap} from '../../assets/icons/marker-100.png';
import MapView, {Marker, Callout} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';

import Geolocation from '@react-native-community/geolocation';
import {AppContext} from '../../context/AppContext';
import allSettled from 'promise.allsettled';
import ButtonDefault from '../../components/ButtonDefault';
import {useFocusEffect} from '@react-navigation/native';
import {
  FetchOsTooltip,
  FetchOsTooltipText,
  MapCard,
  MapCardButton,
  MapCardButtonText,
  MapCardContent,
  MapCardFooter,
  MapCardHeader,
  MapCardHeaderButton,
  MapCardHeaderText,
  MapCardInfo,
  MapCardInfoText,
} from './styles';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import { ActivityIndicator } from 'react-native';

export default function MapaAtendimento({navigation}) {
  const [currentLatitude, setCurrentLatitude] = useState(0);
  const [currentLongitude, setCurrentLongitude] = useState(0);
  const [watchID, setWatchID] = useState(0);
  const [isLoadingOsPosition, setLoadingOsPosition] = useState(false);

  const [points, setPoints] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);

  const {ordens, getOrdensPosition, persistOrdemPosition} =
    useContext(AppContext);

  useEffect(() => {
    callLocation();
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log(`mapa visivel :)`);
      getOrdensLocation();

      return () => removeSelectedPoint();
    }, [ordens])
  );

  const osAbertas = useMemo(() => {
    console.log('ordens modificou');
    return getOSAbertas(ordens)}, [ordens]);

  async function updatePoints(positions) {
    const allPersitstedPositions = await persistOrdemPosition(positions);

    const positionsToShow = allPersitstedPositions.filter((app) => {
      const isToShowPosition = osAbertas.some((osa) => osa.ORDEM == app.osId);

      return isToShowPosition;
    })
    
    // const updatedOs = osAbertas.map(os => {
    //   const ppByOrdem = parsedPositions.find(pp => pp.osId == os.ORDEM);

    //   if (ppByOrdem) {
    //     return {...os, ...ppByOrdem};
    //   }

    //   return positionsToShow;
    // });

    setPoints(positionsToShow);
  }

  function getOSAbertas(os) {
    console.log('getOS:abertas ');
    const osAbertas = os.filter(o =>{ 
      console.log(`${o.ORDEM}-${o.VISITA == null}`);
      return o.VISITA == null});

    return osAbertas;
  }

  async function getOrdensLocation() {
    console.log(`buscando OrdensLocation`);

    const persitstedPositions = await getOrdensPosition();

    // const osAbertas = getOSAbertas(ordens);

    osAbertas.forEach(as => {
      console.log('---', as.ORDEM);
    });

    // const {isPersisted = [], notPersisted = []} = osAbertas.reduce(
    //   (accumulator, current) => {
    //     accumulator.isPersisted = accumulator.isPersisted
    //       ? [...accumulator.isPersisted]
    //       : [];
    //     accumulator.notPersisted = accumulator.notPersisted
    //       ? [...accumulator.notPersisted]
    //       : [];

    //     const isPersisted = persitstedPositions.find(
    //       pp => pp.osId == current.ORDEM,
    //     );

    //     if (isPersisted) {
    //       accumulator.isPersisted = [
    //         ...accumulator.isPersisted,
    //         {...current, ...isPersisted},
    //       ];
    //     } else {
    //       accumulator.notPersisted = [...accumulator.notPersisted, current];
    //     }

    //     return accumulator;
    //   },
    //   {},
    // );

    const osPositionsPersisted = persitstedPositions.filter((pp) => {
      const isOsPositionPeristed = osAbertas.some((os) => os.ORDEM == pp.osId);

      return isOsPositionPeristed;
    })

    const osWithoutPosition = osAbertas.filter((os) => {
      const isOsWithPosition = persitstedPositions.find((pp) => pp.osId == os.ORDEM);

      return !isOsWithPosition;
    })

    // console.log(persitstedPositions.length, osAbertas.length);
    // console.log({persitstedPositions, osAbertas});
    // console.log({isPersisted, notPersisted});

    if (osWithoutPosition.length > 0) {
      Geocoder.init('AIzaSyAzbF5omJWa6k78UaeKTMUNYI0OJyufJew');
      // Geocoder.init('AIzaSyB_HUSC_N68tBB2iYknsXWpopaJrrieNmE');

      const getOsPositionPromisses = osWithoutPosition.map(os => {
        const address = generateAdress(os);

        return fetchOSPosition(address, os.ORDEM);
      });

      setLoadingOsPosition(true);

      allSettled(getOsPositionPromisses)
        .then(results => {
          // console.log(results[0].value);
          setLoadingOsPosition(false);

          const fulfilledPoints = results.filter(result => {
            return result.status === 'fulfilled';
          });

          updatePoints(fulfilledPoints);
        })
        .catch(error => {
          console.log(error);
          setLoadingOsPosition(false);
        });

      // notPersisted.forEach(os => {
      //   // console.log(address);

      //   console.log('fimxxx');
      // });
    }

    setPoints(osPositionsPersisted);
  }

  function fetchOSPosition(address, osId) {
    return new Promise((resolve, rejet) => {
      Geocoder.from(address)
        .then(json => {
          const location = json.results[0].geometry.location;
          // console.log(location);
          resolve({location, osId});
        })
        .catch(rejet);
    });
  }

  function generateAdress(os) {
    const address = `${os.LOGRADOURO}, ${os.BAIRRO} - ${os.CIDADE}`;

    return address;
  }

  function updateSelectedPoint(osId) {
    return function () {

      const osToShow = osAbertas.find((os) => os.ORDEM == osId);
      console.log('clicou' + osId);

      setSelectedPoint(osToShow);
    };
  }

  function removeSelectedPoint() {
    setSelectedPoint(null);
  }

  function navigateToDetalhes(osData) {
    return function () {
      navigation.navigate('Detalhes', osData);
    };
  }

  const callLocation = () => {
    if (Platform.OS === 'ios') {
      getLocation();
    } else {
      const requestLocationPermission = async () => {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permissão de Acesso à Localização',
            message: 'Este aplicativo precisa acessar sua localização.',
            buttonNeutral: 'Pergunte-me depois',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getLocation();
        } else {
          alert('Permissão de Localização negada');
        }
      };
      requestLocationPermission();
    }
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const currentLatitude = position.coords.latitude;
        const currentLongitude = position.coords.longitude;
        setCurrentLatitude(currentLatitude);
        setCurrentLongitude(currentLongitude);
        console.log(currentLatitude);
      },
      error => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  const clearLocation = () => {
    Geolocation.clearWatch(watchID);
  };

  function getPinColor(osId) {

    const os = osAbertas.find((os) => os.ORDEM == osId);
    
    if (os.id_tipo_os == 4 || os.id_tipo_os == 5 || os.id_tipo_os == 6) {
      return 'red';
    } else if (os.id_tipo_os == 1 || os.id_tipo_os == 2 || os.id_tipo_os == 3) {
      return 'yellow';
    } else {
      return 'green';
    }
  }

  const renderMapPins = (item, index) => (
    <Marker
      key={'Marker' + index}
      //icon={(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_AZURE))}
      coordinate={{
        latitude: item.location?.lat || 0,
        longitude: item.location?.lng || 0,
      }}
      image={iconMap}
      title={`${item.ORDEM}`}
      description={
        'item.description + "\n" + item.latitude + "," + item.longitude'
      }
      onPress={updateSelectedPoint(item)}
      pinColor={getPinColor(item.id_tipo_os)}>
      {/*<Image source={require('../../assets/icons/marker-100.png')} style={{width: 40, height: 40, flex: 1, flexDirection: 'column'}} /> */}
      {console.log('pin')}

      <Callout key={'TitleView' + index} tooltip={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            borderRadius: 20,
            padding: 10,
          }}>
          <Text
            key={'TextTitle' + index}
            style={{textAlign: 'center', fontSize: 1}}>
            {' '}
            {'item.stitle'}{' '}
          </Text>
          <Text key={'TextDescription' + index} style={{color: '#a3a3a3'}}>
            {' '}
            {item.ORDEM}{' '}
          </Text>
        </View>
      </Callout>
    </Marker>
  );

  // const memorizedRender = useMemo(() => points.map(renderMapPins), [points])

  const renderItems = useCallback(
    () =>
      points.map(item => (
        <Marker
          key={`marker-${item.osId}`}
          coordinate={{
            latitude: item.location?.lat || 0,
            longitude: item.location?.lng || 0,
          }}
          title={`${item.osId}`}
          description={
            'item.description + "\n" + item.latitude + "," + item.longitude'
          }
          onPress={updateSelectedPoint(item.osId)}
          pinColor={getPinColor(item.osId)}
        >
          <Callout tooltip={true}>
            <View
              style={{
                flex: 1,
                backgroundColor: '#fff',
                borderRadius: 20,
                padding: 10,
              }}>
              <Text style={{color: '#a3a3a3'}}>{item.osId}</Text>
            </View>
          </Callout>
        </Marker>
      )),
    [points],
  );

  return (
    <View style={{flex: 1}}>

      {
        isLoadingOsPosition && (
          <FetchOsTooltip>
            <FetchOsTooltipText>Buscando posição das OS</FetchOsTooltipText>
            <ActivityIndicator color={colors.grey} />
          </FetchOsTooltip>    
        )
      }
      
      <MapView
        style={{flex: 1}}
        initialRegion={{
          latitude: -3.7619037,
          longitude: -38.5574342,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}>
        <Marker
          coordinate={{latitude: currentLatitude, longitude: currentLongitude}}
          title="Você"
          description="Téctnico"
          pinColor="orange">
          {/* <Callout tooltip={true} onPress={() => navigation.navigate('Detalhes')} >
                      <View style={{
                        flex:1,
                        backgroundColor: '#fff',
                        borderRadius: 20,
                        padding:10,
                        }}
                      >
                        <Text style={{textAlign: 'center', fontSize: 1}}>cakdjcnad</Text>
                        <Text style={{color: '#a3a3a3'}}>lasdkmclakmd</Text>
                      </View>
                    </Callout> */}
        </Marker>

        {renderItems()}
      </MapView>

      {selectedPoint && (
        <MapCard>
          <MapCardHeader>
            <MapCardHeaderText>{selectedPoint.ORDEM}</MapCardHeaderText>
            <MapCardHeaderButton onPress={removeSelectedPoint}>
              <Icon size={24} name="close" color="#555" />
            </MapCardHeaderButton>
          </MapCardHeader>
          <MapCardContent>
            <MapCardInfo>
              <Icon name="person" color="#555" style={{marginRight: 3}} />
              <MapCardInfoText>{selectedPoint.NOME}</MapCardInfoText>
            </MapCardInfo>

            <MapCardInfo>
              <Icon name="place" color="#555" style={{marginRight: 3}} />
              <MapCardInfoText>{generateAdress(selectedPoint)}</MapCardInfoText>
            </MapCardInfo>
          </MapCardContent>

          <MapCardFooter>
            <MapCardButton onPress={navigateToDetalhes(selectedPoint)}>
              <MapCardButtonText>Ver Detalhes</MapCardButtonText>
            </MapCardButton>
          </MapCardFooter>
        </MapCard>
      )}
    </View>
  );
}
