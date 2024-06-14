import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "@/constants/Colors";
import DateLabel from "./DateLabel";
import { BottomSheetMethods } from "@devvie/bottom-sheet";
import useDate from "@/hooks/useDate";
import useLocation from "@/hooks/useLocation";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useSession } from "@/context";
import Toast from "react-native-toast-message";

const ClockIn = ({
  bottomSheet
}: {
  bottomSheet: React.RefObject<BottomSheetMethods>;
}) => {
  const [isAbleClockIn, setIsAbleClockIn] = useState(true);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isLate, setIsLate] = useState(false);
  const [isNotAttend, setIsNotAttend] = useState(false);
  const { dayFull, date, monthFull, year, month } = useDate(
    new Date().toISOString()
  );
  const { checkEnableLocation, getLocation } = useLocation();
  const { authId } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const clockInHandler = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const isLocEnabled = await checkEnableLocation();

    if (isLocEnabled) {
      const { isGranted } = await getLocation();

      if (isGranted) {
        try {
          await addDoc(collection(db, "presence"), {
            date: `${year}-${month}-${date}`,
            type: "HADIR",
            user: authId,
            iso: new Date().toISOString()
          });

          setIsLoading(false);
          setIsClockedIn(true);
        } catch (error) {
          Toast.show({
            text1: "Gagal untuk Clock In",
            type: "error"
          });
          setIsLoading(false);
        }
      } else {
        console.log("tidak granted");
        setIsLoading(false);
      }
    } else {
      Toast.show({
        text1: "Lokasi/GPS harus diaktifkan!",
        type: "error"
      });
      console.log("gps mati");
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
          if (snapshots.empty) {
            setIsAbleClockIn(true);
            setIsClockedIn(false);
          } else {
            setIsAbleClockIn(false);

            snapshots.forEach((doc) => {
              if (doc.data().type == "HADIR") {
                setIsClockedIn(true);
              } else {
                setIsNotAttend(true);
                setIsClockedIn(false);
              }
            });
          }
        }
      );
    } catch (error) {
      Toast.show({
        text1: "Gagal mendapat data!",
        type: "error"
      });
    }
  };

  useEffect(() => {
    console.log("user: ", authId);

    if (!authId) return;

    getClockIn();
  }, [authId]);

  return (
    <View style={styles.checkInWrapper}>
      <View style={styles.clockInHeader}>
        <Text>Hari ini</Text>
        <DateLabel date={`${dayFull}, ${date} ${monthFull} ${year}`} />
      </View>

      <View style={{ borderBottomWidth: 1, borderColor: "#aeaeae" }} />

      <View>
        <Text style={styles.clock}>07.30 - 16.00</Text>
      </View>

      {isAbleClockIn && !isClockedIn && (
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
