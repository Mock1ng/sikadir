import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "@/constants/Colors";
import HistoryCard from "./HistoryCard";
import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  where
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useSession } from "@/context";

const ClockInHistory = () => {
  const { authId } = useSession();
  const [clockInHistory, setClockInHistory] = useState<DocumentData[]>([]);

  const getHistory = () => {
    onSnapshot(
      query(
        collection(db, "presence"),
        where("user", "==", authId),
        orderBy("iso", "desc")
      ),
      (snapshot) => {
        if (snapshot.empty) {
          setClockInHistory([]);
          console.log("history user tidak ada");
        } else {
          const history: DocumentData[] = [];

          snapshot.forEach((doc) => {
            history.push({ ...doc.data(), id: doc.id });
          });

          setClockInHistory(history);
        }
      }
    );
  };

  useEffect(() => {
    if (!authId) return;

    getHistory();
  }, [authId]);

  return (
    <View style={styles.historyWrapper}>
      <View style={styles.historyHeader}>
        <Text>Riwayat Kehadiran</Text>

        {/* <Link href={"/"} style={styles.seeOtherHistory}>
          Lihat Lainnya
        </Link> */}
      </View>

      {clockInHistory.map((item) => (
        <HistoryCard key={item.id} data={item} />
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
