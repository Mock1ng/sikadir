import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { COLORS } from "@/constants/Colors";
import HistoryCard from "./HistoryCard";

const ClockInHistory = () => {
  const arr = [1, 2, 3, 4, 5];
  return (
    <View style={styles.historyWrapper}>
      <View style={styles.historyHeader}>
        <Text>Riwayat Kehadiran</Text>

        {/* <Link href={"/"} style={styles.seeOtherHistory}>
          Lihat Lainnya
        </Link> */}
      </View>

      {arr.map((item) => (
        <HistoryCard key={item} />
      ))}
    </View>
  );
};

export default ClockInHistory;

const styles = StyleSheet.create({
  historyWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 14,
    backgroundColor: "#F9FAFC",
    zIndex: 2
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeftWidth: 6,
    borderColor: COLORS.primary,
    height: 28,
    paddingLeft: 8
  },
  seeOtherHistory: {
    color: COLORS.primaryDarker,
    fontSize: 12
  }
});
