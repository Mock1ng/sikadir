import { StyleSheet, Text, View } from "react-native";
import React from "react";
import DateLabel from "./DateLabel";

const HistoryCard = () => {
  return (
    <View style={styles.card}>
      <DateLabel />

      <View>
        <View style={styles.justifyBetween}>
          <Text style={styles.font10}>Waktu Clock In</Text>
          <Text style={styles.font10}>Jam Masuk Keluar</Text>
        </View>

        <View style={styles.justifyBetween}>
          <Text style={styles.fontBold16}>08.33</Text>
          <Text style={styles.fontBold16}>07.30 - 16.00</Text>
        </View>
      </View>
    </View>
  );
};

export default HistoryCard;

const styles = StyleSheet.create({
  card: {
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: "#aeaeae",
    borderRadius: 10
  },
  justifyBetween: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  font10: {
    fontSize: 10
  },
  fontBold16: {
    fontSize: 16,
    fontWeight: "800"
  }
});
