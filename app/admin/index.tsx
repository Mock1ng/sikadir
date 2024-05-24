import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "@/constants/Colors";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import AbsenceCard from "@/components/admin/AbsenceCard";
import { router } from "expo-router";

const AdminScreen = () => {
  const anggota = [1, 2, 3, 4, 5];

  return (
    <SafeAreaView>
      <StatusBar style="dark" backgroundColor={COLORS.background} />

      <ScrollView>
        <View style={styles.adminWrapper}>
          <View style={styles.adminHeader}>
            <Text style={styles.logo}>SIKADIR</Text>
            <Pressable onPress={() => router.push("/login")}>
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
            {anggota.map((i) => (
              <AbsenceCard key={i} />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.savePdfWrapper}>
        <TouchableHighlight style={styles.savePdf}>
          <Text style={{ color: "#fff" }}>Simpan Absen ke PDF</Text>
        </TouchableHighlight>
      </View>
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
