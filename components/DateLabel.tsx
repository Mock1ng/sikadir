import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "@/constants/Colors";

const DateLabel = ({ date }: { date: string }) => {
  return (
    <View style={styles.dateWrapper}>
      <Text style={styles.date}>{date}</Text>
    </View>
  );
};

export default DateLabel;

const styles = StyleSheet.create({
  dateWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 5,
    backgroundColor: COLORS.primaryHalf,
    alignSelf: "flex-start"
  },
  date: {
    color: "#fff",
    fontSize: 12
  }
});
