import {
  ActivityIndicator,
  Button,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "@/constants/Colors";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import AbsenceCard from "@/components/admin/AbsenceCard";
import { useSession } from "@/context";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import useDate from "@/hooks/useDate";
import * as Print from "expo-print";
import usePresence from "@/hooks/usePresence";

const AdminScreen = () => {
  const { signOut } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [clockInList, setClockInList] = useState<DocumentData[]>([]);
  const [orderedList, setOrderedList] = useState<DocumentData[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<Print.Printer>();
  const { year, month, monthZero } = useDate(new Date().toISOString());
  const html = usePresence(month, year);

  const getClockIn = () => {
    setIsLoading(true);
    setClockInList([]);

    onSnapshot(
      query(
        collection(db, "presence"),
        where("iso", ">=", `${year}-${monthZero}-01T17:00:00.000Z`),
        orderBy("iso", "desc")
      ),
      (snapshot) => {
        if (snapshot.empty) {
          console.log("no history");

          setClockInList([]);
        } else {
          snapshot.forEach(async (item) => {
            const res = await getDoc(doc(db, "user", item.data().user));

            setClockInList((prev) => [
              ...prev,
              {
                ...item.data(),
                id: item.id,
                user: { ...res.data(), id: res.id }
              }
            ]);
          });
        }
      }
    );
  };

  useEffect(() => {
    getClockIn();
  }, []);

  const print = async () => {
    try {
      const res = await Print.printAsync({
        html,
        printerUrl: selectedPrinter?.url, // iOS only
        orientation: Print.Orientation.landscape
      });

      console.log("ready to print");
    } catch (error) {
      console.log(error);
    }
  };

  const selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync(); // iOS only
    setSelectedPrinter(printer);
  };

  useEffect(() => {
    const orderedHistory = clockInList.sort(
      (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf()
    );

    const timeout = setTimeout(() => {
      setOrderedList(orderedHistory);
      setIsLoading(false);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [clockInList]);

  return (
    <SafeAreaView>
      <StatusBar style="dark" backgroundColor={COLORS.background} />

      <ScrollView>
        <View style={styles.adminWrapper}>
          <View style={styles.adminHeader}>
            <Text style={styles.logo}>SIKADIR</Text>
            <Pressable onPress={signOut}>
              <Ionicons name="log-out-outline" size={32} color={"#000"} />
            </Pressable>
          </View>

          <Text style={styles.adminWelcome}>Selamat Datang, Admin</Text>

          <View style={styles.absenceHeader}>
            <Text style={styles.absenceHeaderTitle}>Daftar Absen</Text>

            <View style={styles.absenceIcons}>
              {/* <FontAwesome
                color={"#6E6E6E"}
                name="sort-amount-desc"
                size={12}
              />
              <Ionicons color={"#6E6E6E"} name="filter" size={16} /> */}
            </View>
          </View>

          <View style={styles.absencesWrapper}>
            {isLoading && (
              <ActivityIndicator size={"large"} color={COLORS.primary} />
            )}
            {!isLoading &&
              orderedList.map((data) => (
                <AbsenceCard key={data.id} data={data} />
              ))}
          </View>
        </View>
      </ScrollView>

      {!isLoading && (
        <View style={styles.savePdfWrapper}>
          <TouchableHighlight style={styles.savePdf} onPress={print}>
            <Text style={{ color: "#fff" }}>Simpan Absen ke PDF</Text>
          </TouchableHighlight>
        </View>
      )}

      {!isLoading && Platform.OS === "ios" && (
        <>
          <Button title="Select printer" onPress={selectPrinter} />
          {selectedPrinter ? (
            <Text>{`Selected printer: ${selectedPrinter.name}`}</Text>
          ) : undefined}
        </>
      )}
    </SafeAreaView>
  );
};

export default AdminScreen;

const styles = StyleSheet.create({
  adminWrapper: {
    gap: 24,
    paddingHorizontal: 12,
    paddingVertical: 24,
    backgroundColor: COLORS.background,
    height: "100%",
    marginBottom: 30
  },
  adminHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  logo: {
    fontSize: 48,
    fontWeight: "800"
  },
  adminWelcome: {
    fontSize: 12,
    color: COLORS.primary
  },
  absenceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  absenceHeaderTitle: {
    fontSize: 18,
    fontWeight: "800"
  },
  absenceIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  absencesWrapper: {
    gap: 12
  },
  savePdfWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  savePdf: {
    width: "auto",
    paddingHorizontal: 10,
    paddingVertical: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    position: "absolute",
    bottom: 15
  }
});
