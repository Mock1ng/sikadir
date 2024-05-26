import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import React, { useState } from "react";
import { COLORS } from "@/constants/Colors";
import DateLabel from "./DateLabel";
import { BottomSheetMethods } from "@devvie/bottom-sheet";
import { router } from "expo-router";
import { useSession } from "@/context";

const ClockIn = ({
  bottomSheet
}: {
  bottomSheet: React.RefObject<BottomSheetMethods>;
}) => {
  const [isAbleClockIn, setIsAbleClockIn] = useState(true);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isLate, setIsLate] = useState(false);
  const { signOut } = useSession();

  return (
    <View style={styles.checkInWrapper}>
      <View style={styles.clockInHeader}>
        <Text>Hari ini</Text>
        <DateLabel />
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
            onPress={() => {
              setIsClockedIn(true);
            }}
          >
            <View>
              <Text style={styles.clockInText}>Clock In</Text>
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
