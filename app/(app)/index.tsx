import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import ClockIn from "@/components/ClockIn";
import ClockInHistory from "@/components/ClockInHistory";
import { StatusBar } from "expo-status-bar";

import { BottomSheetMethods } from "@devvie/bottom-sheet";
import AbsenceForm from "@/components/AbsenceForm";
import { useSession } from "@/context";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Toast from "react-native-toast-message";

const HomeScreen = () => {
  const sheetRef = useRef<BottomSheetMethods>(null);
  const { signOut, authId } = useSession();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [user, setUser] = useState<DocumentData | undefined>({});

  const getUser = async () => {
    if (!authId) return;

    const res = await getDoc(doc(db, "user", authId));
    setUser({ ...res.data(), id: res.id });
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <View style={{ backgroundColor: "#F9FAFC", flex: 1 }}>
        <SafeAreaView>
          <StatusBar style="light" backgroundColor={COLORS.primary} />

          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={() => {
                  console.log("refresh");

                  setIsRefreshing(true);
                }}
              />
            }
          >
            <View style={styles.container}>
              <View style={styles.head}>
                <Text style={styles.logo}>SIKADIR</Text>
                <Pressable onPress={signOut}>
                  <Ionicons name="log-out-outline" size={32} color={"#fff"} />
                </Pressable>
              </View>

              <View>
                <Text style={styles.name}>{user?.name}</Text>
                <Text style={styles.class}>{user?.class}</Text>
              </View>

              <ClockIn
                bottomSheet={sheetRef}
                isRefreshing={isRefreshing}
                setIsRefreshing={setIsRefreshing}
              />
            </View>

            <ClockInHistory />
          </ScrollView>
        </SafeAreaView>

        <AbsenceForm bottomSheet={sheetRef} />
      </View>

      <Toast />
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 24,
    gap: 14,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: COLORS.primary,
    flex: 1
  },
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  logo: {
    fontSize: 48,
    color: "#fff",
    fontWeight: "800"
  },
  name: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff"
  },
  class: {
    color: "#fff",
    fontSize: 12
  },
  sheetContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "grey"
  },
  contentContainer: {
    flex: 1,
    alignItems: "center"
  }
});
