import * as Location from "expo-location";
import { useState } from "react";

const location = () => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationPermission, setLocationPermission] =
    useState<Location.LocationPermissionResponse | null>(null);
  const [locationErrorMsg, setLocationErrorMsg] = useState("");

  const getLocation = async () => {
    setIsGettingLocation(true);
    setLocationErrorMsg("");

    let locationRes = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(locationRes);
    setIsGettingLocation(false);

    if (locationRes.status !== "granted") {
      setLocationErrorMsg("Permission to access location was denied");
      return;
    }
  };

  return;
};
