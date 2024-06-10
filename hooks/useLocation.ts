import * as Location from "expo-location";
import { useEffect, useState } from "react";
import haversine from "haversine";
import { Linking } from "react-native";
import Toast from "react-native-toast-message";

const useLocation = () => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationPermission, setLocationPermission] =
    useState<Location.LocationPermissionResponse | null>(null);
  const [locationErrorMsg, setLocationErrorMsg] = useState("");
  const [location, setLocation] = useState<Location.LocationObject>();
  const [distance, setDistance] = useState<number>();
  const [isLocationGranted, setIsLocationGranted] = useState<boolean | null>(
    null
  );
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);

  const getLocation = async () => {
    setIsGettingLocation(true);
    setLocationErrorMsg("");

    let locationReq = await Location.requestForegroundPermissionsAsync();

    setLocationPermission(locationReq);
    setIsGettingLocation(false);

    if (locationReq.status !== "granted") {
      setLocationErrorMsg("Permission to access location was denied");
      setIsLocationGranted(false);
      return;
    }

    setIsLocationGranted(true);

    let location = await Location.getCurrentPositionAsync();
    setLocation(location);
  };

  // useEffect(() => {
  //   console.log("location permition: ", locationPermission);
  //   if (!locationPermission) return;
  //   // if (status.granted) return;

  //   getLocation();
  // }, [locationPermission]);

  const checkEnableLocation = async () => {
    const isLocEnabled = await Location.hasServicesEnabledAsync();
    console.log("location enabled: ", isLocEnabled);

    if (isLocEnabled) {
      getLocation();
    } else {
      try {
        await Location.getCurrentPositionAsync();
        setIsLocationEnabled(true);
      } catch (e) {
        setIsLocationEnabled(false);
        Toast.show({
          text1: "Lokasi/GPS harus dihidupkan!",
          type: "error"
        });
      }
    }
  };

  useEffect(() => {
    if (locationPermission?.android?.accuracy == "fine") return;
  }, [locationPermission]);

  useEffect(() => {
    if (!location) return;

    // -6.273671726315466, 106.72474539199516
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

    const distanceRes = haversine(userLocation, cikupaBagusLocation, {
      unit: "meter"
    });
    setDistance(distanceRes);
  }, [location]);

  const askPermissionHandler = () => {
    console.log(locationPermission);

    if (!locationPermission) return;

    if (locationPermission) {
      getLocation();
    } else {
      Linking.openSettings();
    }
  };

  return {
    isGettingLocation,
    location,
    distance,
    locationPermission,
    askPermissionHandler,
    isLocationGranted,
    isLocationEnabled,
    checkEnableLocation
  };
};

export default useLocation;
