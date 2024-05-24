import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import AnggotaCard from "@/components/admin/AnggotaCard";
import { BottomSheetMethods } from "@devvie/bottom-sheet";
import AnggotaBottomSheet from "@/components/admin/AnggotaBottomSheet";

type bottomSheetPurposeType = "edit" | "delete" | "add";

const AnggotaScreen = () => {
  const bottomSheetRef = useRef<BottomSheetMethods>(null);
  const [bottomSheetPurpose, setBottomSheetPurpose] =
    useState<bottomSheetPurposeType>("add");

  const anggota = [1, 2, 3, 4, 5];

  return (
    <>
      <SafeAreaView>
        <View style={styles.anggotaWrapper}>
          <View style={styles.anggotaHeader}>
            <Text style={styles.headerTitle}>Daftar Anggota</Text>

            <View style={styles.headerIcons}>
              <Pressable
                onPress={() => {
                  bottomSheetRef.current?.open();
                  setBottomSheetPurpose("add");
                }}
              >
                <Ionicons name="person-add-outline" size={24} />
              </Pressable>
              {/* <Ionicons name="filter" size={16} /> */}
            </View>
          </View>

          <View style={styles.listAnggota}>
            {anggota.map((i) => (
              <AnggotaCard
                key={i}
                bottomSheetRef={bottomSheetRef}
                setBottomSheetPurpose={setBottomSheetPurpose}
              />
            ))}
          </View>
        </View>
      </SafeAreaView>

      <AnggotaBottomSheet
        purpose={bottomSheetPurpose}
        bottomSheet={bottomSheetRef}
      />
    </>
  );
};

export default AnggotaScreen;

const styles = StyleSheet.create({
  anggotaWrapper: {
    backgroundColor: COLORS.background,
    minHeight: "100%",
    paddingHorizontal: 10,
    paddingVertical: 24,
    gap: 24
  },
  anggotaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800"
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  listAnggota: {
    gap: 10
  }
});
