import { StyleSheet, Text, View } from "react-native";
import React from "react";
import DateLabel from "../DateLabel";
import useDate from "@/hooks/useDate";
import { DocumentData } from "firebase/firestore";
import useTimeFormatter from "@/hooks/useTimeFormatter";

const AbsenceCard = ({ data }: { data: DocumentData }) => {
  const { dayFull, date, monthFull, year, hours, minutes } = useDate(data.iso);
  const { hourStart, minuteStart } = useTimeFormatter({
    hourStart: hours,
    minuteStart: minutes
  });

  return (
    <View style={styles.absenceWrapper}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.name}>{data.user.name}</Text>
          <Text style={styles.class}>{data.user.class}</Text>
        </View>

        <DateLabel
          date={`${dayFull}, ${date} ${monthFull} ${year}`}
          type={data.type}
        />
      </View>

      <View>
        <View style={styles.justifyBetween}>
          <Text style={styles.contentTitle}>
            {data.type == "HADIR" ? "Waktu Clock In" : "Alasan"}
          </Text>
          {data.timeConfig && (
            <Text style={styles.contentTitle}>Jam Masuk Keluar</Text>
          )}
        </View>

        <View style={styles.justifyBetween}>
          <Text style={styles.contentValue}>
            {data.type == "HADIR" ? hourStart + "." + minuteStart : data.type}
          </Text>
          {data.timeConfig && (
            <Text style={styles.contentValue}>{data.timeConfig}</Text>
          )}
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
