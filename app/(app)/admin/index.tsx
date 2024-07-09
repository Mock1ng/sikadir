import {
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
import { shareAsync } from "expo-sharing";

const html = `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  </head>
  <body style="text-align: center;">
    <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
      Hello Expo!
    </h1>
    <img
      src="https://d30j33t1r58ioz.cloudfront.net/static/guides/sdk.png"
      style="width: 90vw;" />
  </body>
</html>
`;

const AdminScreen = () => {
  const { signOut } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [clockInList, setClockInList] = useState<DocumentData[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<Print.Printer>();

  const getClockIn = () => {
    setIsLoading(true);

    const { year, month, date } = useDate(new Date().toISOString());

    onSnapshot(
      query(
        collection(db, "presence"),
        where("date", ">=", `${year}-${month}-1`),
        where("date", "<=", `${year}-${month}-31`),
        orderBy("iso", "desc")
      ),
      (snapshot) => {
        if (snapshot.empty) {
          console.log("no history");

          setClockInList([]);
        } else {
          const history: DocumentData[] = [];

          snapshot.forEach(async (item) => {
            const res = await getDoc(doc(db, "user", item.data().user));
            history.push({
              ...item.data(),
              id: item.id,
              user: { ...res.data(), id: res.id }
            });

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
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      html,
      printerUrl: selectedPrinter?.url // iOS only
    });
  };

  const printToFile = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({ html });
    console.log("File has been saved to:", uri);
    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };

  const selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync(); // iOS only
    setSelectedPrinter(printer);
  };

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
            {clockInList.map((data) => (
              <AbsenceCard key={data.id} data={data} />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.savePdfWrapper}>
        <TouchableHighlight style={styles.savePdf} onPress={print}>
          <Text style={{ color: "#fff" }}>Simpan Absen ke PDF</Text>
        </TouchableHighlight>
      </View>

      {Platform.OS === "ios" && (
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
