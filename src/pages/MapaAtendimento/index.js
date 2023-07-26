import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { View, Text, PermissionsAndroid } from "react-native";
import { colors } from "../../styles";
import { iconMap } from "../../assets/icons/marker-100.png";
import MapView, { Marker, Callout } from "react-native-maps";
import { AppContext } from "../../context/AppContext";
import allSettled from "promise.allsettled";
import { useFocusEffect } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import { ActivityIndicator } from "react-native";

import * as Location from "expo-location"; // Importe o módulo expo-location

export default function MapaAtendimento({ navigation }) {
  const [currentLatitude, setCurrentLatitude] = useState(0);
  const [currentLongitude, setCurrentLongitude] = useState(0);
  const [isLoadingOsPosition, setLoadingOsPosition] = useState(false);
  const [points, setPoints] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);

  const { ordens, getOrdensPosition, persistOrdemPosition } =
    useContext(AppContext);

  useEffect(() => {
    getLocationAsync();
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log(`mapa visivel :)`);
      getOrdensLocation();

      return () => removeSelectedPoint();
    }, [ordens])
  );

  const osAbertas = useMemo(() => {
    console.log("ordens modificou");
    return getOSAbertas(ordens);
  }, [ordens]);

  async function updatePoints(positions) {
    const allPersitstedPositions = await persistOrdemPosition(positions);

    const positionsToShow = allPersitstedPositions.filter((app) => {
      const isToShowPosition = osAbertas.some((osa) => osa.ORDEM == app.osId);

      return isToShowPosition;
    });

    setPoints(positionsToShow);
  }

  function getOSAbertas(os) {
    console.log("getOS:abertas ");
    const osAbertas = os.filter((o) => {
      console.log(`${o.ORDEM}-${o.VISITA == null}`);
      return o.VISITA == null;
    });

    return osAbertas;
  }

  async function getOrdensLocation() {
    console.log(`buscando OrdensLocation`);

    const persitstedPositions = await getOrdensPosition()
      .then(() => {
        const osPositionsPersisted = persitstedPositions.filter((pp) => {
          const isOsPositionPeristed = osAbertas.some(
            (os) => os.ORDEM == pp.osId
          );

          console.log(osPositionsPersisted);

          return isOsPositionPeristed;
        });

        const osWithoutPosition = osAbertas.filter((os) => {
          const isOsWithPosition = persitstedPositions.find(
            (pp) => pp.osId == os.ORDEM
          );

          return !isOsWithPosition;
        });

        if (osWithoutPosition.length > 0) {
          const getOsPositionPromisses = osWithoutPosition.map((os) => {
            const address = generateAdress(os);
            return fetchOSPosition(address, os.ORDEM);
          });

          setLoadingOsPosition(true);

          allSettled(getOsPositionPromisses)
            .then((results) => {
              setLoadingOsPosition(false);

              const fulfilledPoints = results.filter((result) => {
                return result.status === "fulfilled";
              });

              updatePoints(fulfilledPoints);
            })
            .catch((error) => {
              console.log(error);
              setLoadingOsPosition(false);
            });
        }

        setPoints(osPositionsPersisted);
      })
      .catch((error) => {
        console.log("Ops, ocorreu um erro " + error);
        console.log(typeof persitstedPositions);
      });
  }

  function fetchOSPosition(address, osId) {
    return new Promise((resolve, reject) => {
      Location.geocodeAsync(address)
        .then((location) => {
          if (location && location.length > 0) {
            const { latitude, longitude } = location[0];
            resolve({ location: { lat: latitude, lng: longitude }, osId });
          } else {
            reject(new Error("Localização não encontrada."));
          }
        })
        .catch(reject);
    });
  }

  function generateAdress(os) {
    const address = `${os.LOGRADOURO}, ${os.BAIRRO} - ${os.CIDADE}`;
    return address;
  }

  function updateSelectedPoint(osId) {
    return function () {
      const osToShow = osAbertas.find((os) => os.ORDEM == osId);
      console.log("clicou" + osId);
      setSelectedPoint(osToShow);
    };
  }

  function removeSelectedPoint() {
    setSelectedPoint(null);
  }

  function navigateToDetalhes(osData) {
    return function () {
      navigation.navigate("Detalhes", osData);
    };
  }

  const getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permissão de localização negada");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setCurrentLatitude(location.coords.latitude);
    setCurrentLongitude(location.coords.longitude);
  };

  function getPinColor(osId) {
    // Implementação da função getPinColor
    // ...
  }

  const renderItems = useCallback(
    () =>
      points.map((item) => (
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
                backgroundColor: "#fff",
                borderRadius: 20,
                padding: 10,
              }}
            >
              <Text style={{ color: "#a3a3a3" }}>{item.osId}</Text>
            </View>
          </Callout>
        </Marker>
      )),
    [points]
  );

  return (
    <View style={{ flex: 1 }}>
      {isLoadingOsPosition && (
        <FetchOsTooltip>
          <FetchOsTooltipText>Buscando posição das OS</FetchOsTooltipText>
          <ActivityIndicator color={colors.grey} />
        </FetchOsTooltip>
      )}

      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: -3.8185452,
          longitude: -38.4665652,
          latitudeDelta: 0,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{
            latitude: currentLatitude,
            longitude: currentLongitude,
          }}
          title="Você"
          description="Téctnico"
          pinColor="orange"
        />

        {renderItems()}
      </MapView>

      {selectedPoint && (
        <MapCard>
          {/* Restante do código continua igual */}
          {/* ... */}
        </MapCard>
      )}
    </View>
  );
}
