import AsyncStorage from "@react-native-community/async-storage";
import React, { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [ordens, setOrdens] = useState([]);
  const [loadingStoragedOrdens, setLoadingStoragedOrdens] = useState(true);

  useEffect(() => {
    async function getStoragedOrdens() {
      const ordens = await AsyncStorage.getItem("@App:Ordens");

      if (ordens) {
        const parsedOrdens = JSON.parse(ordens);

        setOrdens(parsedOrdens);
      }

      setLoadingStoragedOrdens(false);
    }

    getStoragedOrdens();
  }, []);

  function updateOrdem(id, data) {
    const updatedOrdens = ordens.map((ordem) => {
      if (ordem.ORDEM === id) {
        return { ...ordem, ...data };
      }

      return ordem;
    });

    setAllOrdens(updatedOrdens);
  }

  async function persistOrdemPosition(positions) {
    const osPositionsPersisted = await getOrdensPosition();

    const positionsValues = positions.map((position) => position.value);

    const newPositions = positionsValues.filter((pv) => {
      const isAlreadyPersisted = osPositionsPersisted.some(
        (pp) => pp.osId == pv.osId
      );

      return !isAlreadyPersisted;
    });

    const positoinsToPersist = [...osPositionsPersisted, ...newPositions];

    await AsyncStorage.setItem(
      "@App:osPositions",
      JSON.stringify(positoinsToPersist)
    );

    return positoinsToPersist;
  }

  async function getOrdensPosition() {
    const ordensPosition = await AsyncStorage.getItem("@App:osPositions")
      .then(() => {
        if (ordensPosition) {
          return JSON.parse(ordensPosition);
        }

        return [];
      })
      .catch((err) => {
        console.log("Aqui também tem erro " + err);
      });
  }

  async function setAllOrdens(ordens) {
    await AsyncStorage.setItem("@App:Ordens", JSON.stringify(ordens));

    setOrdens(ordens);
  }

  async function clearStorage() {
    await AsyncStorage.multiRemove(["@App:osPositions", "@App:Ordens"]);
    setOrdens([]);
  }

  return (
    <AppContext.Provider
      value={{
        ordens,
        setAllOrdens,
        updateOrdem,
        persistOrdemPosition,
        getOrdensPosition,
        loadingStoragedOrdens,
        clearStorage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
