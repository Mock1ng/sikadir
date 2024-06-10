import { StyleSheet, Text, View } from "react-native";
import React from "react";
import DateLabel from "../DateLabel";
import useDate from "@/hooks/useDate";
import { DocumentData } from "firebase/firestore";

const AbsenceCard = ({ data }: { data: DocumentData }) => {
  const { dayFull, date, monthFull, year, hours, minutes } = useDate(data.iso);

  return (
    <View style={styles.absenceWrapper}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.name}>{data.user.name}</Text>
          <Text style={styles.class}>{data.user.class}</Text>
        </View>

        <DateLabel date={`${dayFull}, ${date} ${monthFull} ${year}`} />
      </View>

      <View>
        <View style={styles.justifyBetween}>
          <Text style={styles.contentTitle}>Waktu Clock In</Text>
          <Text style={styles.contentTitle}>Jam Keluar Masuk</Text>
        </View>

        <View style={styles.justifyBetween}>
          <Text style={styles.contentValue}>
            {hours}.{minutes}
          </Text>
          <Text style={styles.contentValue}>07.30 - 16.00</Text>
        </View>
      </View>
    </View>
  );
};

export default AbsenceCard;

const styles = StyleSheet.create({
  absenceWrapper: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    height: 98,
    justifyContent: "space-between"
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  name: {
    fontSize: 16,
    fontWeight: "800"
  },
  class: {
    fontSize: 12,
    color: "#6e6e6e"
  },
  justifyBetween: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  contentTitle: {
    fontSize: 10,
    color: "#6e6e6e"
  },
  contentValue: {
    fontSize: 16,
    fontWeight: "800"
  }
});
