import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "@/constants/Colors";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";

const AdminScreen = () => {
  return (
    <SafeAreaView>
      <StatusBar style="dark" />
      <View style={styles.adminWrapper}>
        <Text style={styles.logo}>SIKADIR</Text>

        <Text style={styles.adminWelcome}>Selamat Datang, Admin</Text>

        <View style={styles.absenceHeader}>
          <Text style={styles.absenceHeaderTitle}>Daftar Absen</Text>

          <View style={styles.absenceIcons}>
            <FontAwesome color={"#6E6E6E"} name="sort-amount-desc" size={12} />
            <Ionicons color={"#6E6E6E"} name="filter" size={16} />
          </View>
        </View>
      </View>

      <Link href={"/admin"}>go to admin</Link>
    </SafeAreaView>
  );
};

export default AdminScreen;

const styles = StyleSheet.create({
  adminWrapper: {
    gap: 24,
    paddingHorizontal: 12,
    paddingVertical: 24
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
  }
});
