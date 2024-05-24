import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View
} from "react-native";
import React, { useCallback, useState } from "react";
import { BottomSheetMethods } from "@devvie/bottom-sheet";
import { COLORS } from "@/constants/Colors";

const DeleteConfirmation = ({
  bottomSheet,
  setSheetHeight
}: {
  bottomSheet: React.RefObject<BottomSheetMethods>;
  setSheetHeight: React.Dispatch<React.SetStateAction<string | number>>;
}) => {
  const onLayout = useCallback(
    (event: { nativeEvent: { layout: { height: number } } }) => {
      const { height } = event.nativeEvent.layout;
      setSheetHeight(height);
    },
    []
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} onLayout={onLayout}>
      <View style={styles.deleteWrapper}>
        <Text style={{ fontSize: 20 }}>
          Apa Anda yakin ingin menghapus data?
        </Text>

        <View style={styles.btnsWrapper}>
          <TouchableHighlight
            style={styles.cancelBtn}
            onPress={bottomSheet.current?.close}
            underlayColor={"#d1d1d1"}
          >
            <Text>Batal</Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.deleteBtn}
            underlayColor={COLORS.danger70}
          >
            <Text style={{ color: "#fff" }}>Hapus</Text>
          </TouchableHighlight>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default DeleteConfirmation;

const styles = StyleSheet.create({
  deleteWrapper: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    gap: 24,
    backgroundColor: "#F9FAFC",
    alignItems: "center"
  },
  btnsWrapper: {
    flexDirection: "row",
    gap: 16
  },
  cancelBtn: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#aeaeae",
    paddingVertical: 12,
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center"
  },
  deleteBtn: {
    borderRadius: 10,
    paddingVertical: 12,
    backgroundColor: COLORS.danger,
    flex: 1,
    alignItems: "center"
  }
});
