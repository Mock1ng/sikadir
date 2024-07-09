import {
  Linking,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "@/constants/Colors";
import DateLabel from "./DateLabel";
import { BottomSheetMethods } from "@devvie/bottom-sheet";
import useDate from "@/hooks/useDate";
import useLocation from "@/hooks/useLocation";
import {
  addDoc,
  collection,
  DocumentData,
  getDocs,
  onSnapshot,
  query,
  where
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useSession } from "@/context";
import Toast from "react-native-toast-message";
import useTimeFormatter from "@/hooks/useTimeFormatter";
// import { startActivityAsync, ActivityAction } from "expo-intent-launcher";

const ClockIn = ({
  bottomSheet,
  isRefreshing,
  setIsRefreshing
}: {
  bottomSheet: React.RefObject<BottomSheetMethods>;
  isRefreshing: boolean;
  setIsRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isAbleClockIn, setIsAbleClockIn] = useState(true);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isLate, setIsLate] = useState(false);
  const [isNotAttend, setIsNotAttend] = useState(false);
  const { dayFull, date, monthFull, year, month, hours, minutes } = useDate(
    new Date().toISOString()
  );
  const { getLocation } = useLocation();
  const { authId } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<DocumentData>({});
  const { hourStart, hourEnd, minuteStart, minuteEnd } = useTimeFormatter({
    hourStart: config.hourStart,
    hourEnd: config.hourEnd,
    minuteStart: config.minuteStart,
    minuteEnd: config.minuteEnd
  });

  const clockInHandler = async () => {
    setIsLoading(true);

    if (
      hours < config.hourStart ||
      (hours == config.hourStart && minutes < config.minuteStart)
    ) {
      Toast.show({
        text1: "Belum masuk waktu absen!",
        type: "error"
      });

      setIsLoading(false);
      return;
    }

    try {
      const { isGranted, distance, isAccurate } = await getLocation({
        targetLat: config.targetLat,
        targetLong: config.targetLong
      });
      console.log("distance: ", distance);
      console.log("isAccurate: ", isAccurate);

      if (!isGranted) {
        Toast.show({
          text1: "Lokasi/GPS harus diizinkan!",
          text2: "Klik untuk masuk ke Pengaturan/Settings",
          visibilityTime: 6000,
          onPress: Linking.openSettings,
          type: "error"
        });

        setIsLoading(false);
        return;
      }

      if (!isAccurate) {
        Toast.show({
          text1: "Izinkan Lokasi/GPS untuk selalu akurat/precise!",
          text2: "Klik untuk masuk ke Pengaturan/Settings",
          visibilityTime: 8000,
          onPress: Linking.openSettings,
          type: "error"
        });

        setIsLoading(false);
        return;
      }

      if (distance > 100) {
        Toast.show({
          text1: "Anda berada di luar jangkauan kantor!",
          type: "error"
        });

        setIsLoading(false);
        return;
      }

      try {
        await addDoc(collection(db, "presence"), {
          date: `${year}-${month}-${date}`,
          type: "HADIR",
          user: authId,
          iso: new Date().toISOString(),
          timeConfig: `${hourStart}.${minuteStart} - ${hourEnd}.${minuteEnd}`
        });

        setIsLoading(false);
        setIsClockedIn(true);
        setIsAbleClockIn(false);
      } catch (error) {
        Toast.show({
          text1: "Gagal untuk Clock In",
          type: "error"
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.log("gps mati");

      Toast.show({
        text1: "Lokasi/GPS harus diaktifkan!",
        text2: "Klik untuk masuk ke Pengaturan/Settings",
        visibilityTime: 6000,
        onPress: Linking.openSettings,
        // startActivityAsync(ActivityAction.LOCATION_SOURCE_SETTINGS),
        type: "error"
      });

      setIsLoading(false);
    }
  };

  const getClockIn = () => {
    if (!authId) return;

    try {
      const res = onSnapshot(
        query(
          collection(db, "presence"),
          where("user", "==", authId),
          where("date", "==", `${year}-${month}-${date}`)
        ),
        (snapshots) => {
          if (snapshots.empty) return;

          snapshots.forEach((doc) => {
            if (doc.data().type == "HADIR") {
              setIsClockedIn(true);
              setIsAbleClockIn(false);
            } else {
              setIsNotAttend(true);
              setIsClockedIn(false);
            }
          });
        }
      );
    } catch (error) {
      Toast.show({
        text1: "Gagal mendapat data!",
        type: "error"
      });
    }

    setIsRefreshing(false);
  };

  const getConfig = async () => {
    try {
      const res = await getDocs(collection(db, "config"));
      res.forEach((doc) => {
        doc.data;
        setConfig({ ...doc.data(), id: doc.id });
      });
    } catch (error) {
      console.log(error);
    }
    setIsRefreshing(false);
  };

  const absenceFunc = async () => {
    await addDoc(collection(db, "presence"), {
      date: `${year}-${month}-${date}`,
      type: "TANPA KETERANGAN",
      detail: "",
      user: authId,
      iso: new Date().toISOString()
    });
  };

  useEffect(() => {
    console.log("user: ", authId);
    if (!authId) return;

    getClockIn();
    getConfig();
  }, [authId]);

  useEffect(() => {
    if (!isRefreshing) return;
    setIsClockedIn(false);
    setIsLate(false);
    setIsNotAttend(false);

    getClockIn();
    getConfig();
  }, [isRefreshing]);

  useEffect(() => {
    if (Object.keys(config).length == 0) return;

    if (
      hours > config.hourEnd ||
      (hours == config.hourEnd && minutes > config.minuteEnd)
    ) {
      setIsLate(false);
      setIsAbleClockIn(false);

      absenceFunc();
    }
  }, [config]);

  return (
    <View style={styles.checkInWrapper}>
      <View style={styles.clockInHeader}>
        <Text>Hari ini</Text>
        <DateLabel date={`${dayFull}, ${date} ${monthFull} ${year}`} />
      </View>

      <View style={{ borderBottomWidth: 1, borderColor: "#aeaeae" }} />

      <View>
        <Text style={styles.clock}>
          {Object.keys(config).length == 0 && "Loading..."}
          {Object.keys(config).length > 0 &&
            `${hourStart}.${minuteStart} - ${hourEnd}.${minuteEnd}`}
        </Text>
      </View>

      {Object.keys(config).length > 0 && isAbleClockIn && !isClockedIn && (
        <View>
          <TouchableHighlight
            style={styles.clockInBtn}
            underlayColor={COLORS.primaryUnderlay}
            onPress={clockInHandler}
          >
            <View>
              <Text style={styles.clockInText}>
                {isLoading ? "Loading..." : "Clock In"}
              </Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.absenceBtn}
            underlayColor={"#fff"}
            onPress={() => {
              bottomSheet?.current?.open();
            }}
          >
            <View>
              <Text style={styles.absenceText}>Tidak Hadir</Text>
            </View>
          </TouchableHighlight>
        </View>
      )}

      {isClockedIn && (
        <View style={styles.isClockedInWrapper}>
          <Text style={styles.isClockedInText}>
            Kamu sudah Clock In hari ini
          </Text>
        </View>
      )}

      {isLate && (
        <View style={styles.isLateWrapper}>
          <Text style={styles.isLateText}>
            Kamu terlambat Clock In hari ini
          </Text>
        </View>
      )}

      {isNotAttend && (
        <View style={styles.isLateWrapper}>
          <Text style={styles.isLateText}>Kamu tidak hadir hari ini</Text>
        </View>
      )}
    </View>
  );
};

export default ClockIn;

const styles = StyleSheet.create({
  checkInWrapper: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 10
  },
  clockInHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  clock: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "500"
  },
  clockInBtn: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: "center"
  },
  clockInText: {
    color: "#fff"
  },
  absenceBtn: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "transparent",
    alignItems: "center"
  },
  absenceText: {
    color: COLORS.danger
  },
  isClockedInWrapper: {
    alignItems: "center"
  },
  isClockedInText: {
    color: "#6e6e6e",
    fontSize: 12
  },
  isLateWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    backgroundColor: COLORS.danger70,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginHorizontal: "auto"
  },
  isLateText: {
    color: "#fff"
  }
});
