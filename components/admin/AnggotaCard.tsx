import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetMethods } from "@devvie/bottom-sheet";

type bottomSheetPurposeType = "edit" | "delete" | "add";

const AnggotaCard = ({
  bottomSheetRef,
  setBottomSheetPurpose
}: {
  bottomSheetRef: React.RefObject<BottomSheetMethods>;
  setBottomSheetPurpose: React.Dispatch<
    React.SetStateAction<bottomSheetPurposeType>
  >;
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={styles.cardLeftTop}>
          <Text style={styles.name}>Jogn Doe</Text>
          <Text style={styles.class}>III/b</Text>
        </View>

        <Text>123234345456456</Text>
      </View>

      <View style={styles.cardRight}>
        <Pressable
          onPress={() => {
            setBottomSheetPurpose("edit");
            bottomSheetRef?.current?.open();
          }}
        >
          <Ionicons name="pencil" size={20} />
        </Pressable>

        <Pressable
          onPress={() => {
            setBottomSheetPurpose("delete");
            bottomSheetRef?.current?.open();
          }}
        >
          <Ionicons name="trash" size={20} color={COLORS.danger} />
        </Pressable>
      </View>
    </View>
  );
};

export default AnggotaCard;

const styles = StyleSheet.create({
  card: {
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  cardLeft: {
    gap: 10
  },
  cardLeftTop: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center"
  },
  name: {
    fontSize: 16,
    fontWeight: "800"
  },
  class: {
    color: "#6e6e6e"
  },
  cardRight: {
    flexDirection: "row",
    gap: 14
  }
});
