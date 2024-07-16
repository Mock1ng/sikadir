import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "@/constants/Colors";

const DateLabel = ({
  date,
  type = "HADIR",
  from = "ANGGOTA"
}: {
  date: string;
  type?: string;
  from?: string;
}) => {
  return (
    <View
      style={[
        styles.dateWrapper,
        type == "HADIR" ? styles.backgroundPrimary : styles.backgroundDanger,
        from == "ADMIN" ? styles.labelAdmin : {}
      ]}
    >
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
    alignSelf: "flex-start"
  },
  date: {
    color: "#fff",
    fontSize: 12
  },
  backgroundPrimary: {
    backgroundColor: COLORS.primaryHalf
  },
  backgroundDanger: {
    backgroundColor: COLORS.danger70
  },
  labelAdmin: {
    position: "absolute",
    right: 0,
    zIndex: 99
  }
});
