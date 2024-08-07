import {
  Button,
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
import { startActivityAsync, ActivityAction } from "expo-intent-launcher";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";

const BACKGROUND_PRESENCE_TASK = "background-presence";

// const absenceFunc = async () => {
//   const now = Date.now();

//   console.log(
//     `Got background fetch call at date: ${new Date(now).toISOString()} at userID`
//   );

//   try {
//     await addDoc(collection(db, "presence"), {
//       date: `2999-12-30`,
//       type: "TANPA KETERANGAN",
//       detail: "",
//       user: "authId",
//       iso: new Date().toISOString()
//     });

//     return BackgroundFetch.BackgroundFetchResult.NewData;
//   } catch (error) {
//     return BackgroundFetch.BackgroundFetchResult.Failed;
//   }
// };

// TaskManager.defineTask(BACKGROUND_PRESENCE_TASK, absenceFunc);

// async function registerBackgroundFetchAsync() {
//   return BackgroundFetch.registerTaskAsync(BACKGROUND_PRESENCE_TASK, {
//     minimumInterval: 10, // 1 jam
//     stopOnTerminate: false, // android only,
//     startOnBoot: true // android only
//   });
// }

// async function unregisterBackgroundFetchAsync() {
//   return BackgroundFetch.unregisterTaskAsync(BACKGROUND_PRESENCE_TASK);
// }

const ClockIn = ({
  bottomSheet,
  isRefreshing,
  setIsRefreshing,
  config,
  getConfig
}: {
  bottomSheet: React.RefObject<BottomSheetMethods>;
  isRefreshing: boolean;
  setIsRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
  config: DocumentData;
  getConfig: () => Promise<void>;
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
  const { hourStart, hourEnd, minuteStart, minuteEnd } = useTimeFormatter({
    hourStart: config.hourStart,
    hourEnd: config.hourEnd,
    minuteStart: config.minuteStart,
    minuteEnd: config.minuteEnd
  });
  const [isRegistered, setIsRegistered] = React.useState(false);
  const [status, setStatus] =
    useState<BackgroundFetch.BackgroundFetchStatus | null>(null);
  const [isWeekend, setIsWeekend] = useState(false);

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

      if (distance > config.radius) {
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
        Toast.show({
          text1: "Berhasil Clock In",
          type: "success"
        });
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
        onPress: () =>
          startActivityAsync(ActivityAction.LOCATION_SOURCE_SETTINGS),
        // onPress: Linking.openSettings,
        // onPress: () => startActivityAsync(ActivityAction.LOCATION_SOURCE_SETTINGS)
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
              setIsAbleClockIn(false);
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

  // const getConfig = async () => {
  //   try {
  //     const res = await getDocs(collection(db, "config"));
  //     res.forEach((doc) => {
  //       doc.data;
  //       setConfig({ ...doc.data(), id: doc.id });
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   setIsRefreshing(false);
  // };

  useEffect(() => {
    console.log("user: ", authId);
    if (!authId) return;

    getClockIn();
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
      if (isClockedIn) return;

      setIsLate(true);
      setIsAbleClockIn(false);
    }
  }, [config]);

  const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_PRESENCE_TASK
    );
    setStatus(status);
    setIsRegistered(isRegistered);
  };

  // useEffect(() => {
  //   checkStatusAsync();
  //   registerBackgroundFetchAsync();
  // }, []);

  // const toggleFetchTask = async () => {
  //   if (isRegistered) {
  //     await unregisterBackgroundFetchAsync();
  //   } else {
  //     await registerBackgroundFetchAsync();
  //   }

  //   checkStatusAsync();
  // };

  useEffect(() => {
    if (dayFull == "Sabtu" || dayFull == "Minggu") {
      setIsWeekend(true);
    }
  }, [dayFull]);

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

      {Object.keys(config).length > 0 &&
        isAbleClockIn &&
        !isClockedIn &&
        !isWeekend && (
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

      {isClockedIn && !isWeekend && (
        <View style={styles.isClockedInWrapper}>
          <Text style={styles.isClockedInText}>
            Kamu sudah Clock In hari ini
          </Text>
        </View>
      )}

      {isLate && !isWeekend && (
        <View style={styles.isLateWrapper}>
          <Text style={styles.isLateText}>
            Kamu terlambat Clock In hari ini
          </Text>
        </View>
      )}

      {isNotAttend && !isWeekend && (
        <View style={styles.isLateWrapper}>
          <Text style={styles.isLateText}>Kamu tidak hadir hari ini</Text>
        </View>
      )}

      {/* <View>
        <Text>
          Background fetch status:{" "}
          <Text>{status && BackgroundFetch.BackgroundFetchStatus[status]}</Text>
        </Text>
        <Text>
          Background fetch task name:{" "}
          <Text>
            {isRegistered ? BACKGROUND_PRESENCE_TASK : "Not registered yet!"}
          </Text>
        </Text>
      </View>

      <Button
        title={
          isRegistered
            ? "Unregister BackgroundFetch task"
            : "Register BackgroundFetch task"
        }
        onPress={toggleFetchTask}
      /> */}
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
