import * as Location from "expo-location";
import { useEffect, useState } from "react";
import haversine from "haversine";

const useLocation = () => {
  const getLocation = async ({
    targetLat,
    targetLong
  }: {
    targetLat: number;
    targetLong: number;
  }) => {
    let locationReq = await Location.requestForegroundPermissionsAsync();

    let isAccurate = locationReq.android?.accuracy == "fine";

    if (locationReq.status == "granted") {
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      const userLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };

      const cimbLocation = {
        latitude: -6.273671726315466,
        longitude: 106.72474539199516
      };

      const cikupaBagusLocation = {
        latitude: -6.220969227302027,
        longitude: 106.51927368531342
      };

      const targetLocation = {
        latitude: targetLat,
        longitude: targetLong
      };

      const distanceRes = haversine(userLocation, targetLocation, {
        unit: "meter"
      });

      return { location, isGranted: true, distance: distanceRes, isAccurate };
    } else {
      return { isGranted: false };
    }
  };

  return {
    getLocation
  };
};

export default useLocation;
