import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View
} from "react-native";
import React, { useCallback } from "react";
import { COLORS } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetMethods } from "@devvie/bottom-sheet";

const FormAnggota = ({
  bottomSheet,
  purpose,
  setSheetHeight
}: {
  bottomSheet: React.RefObject<BottomSheetMethods>;
  purpose: "add" | "edit";
  setSheetHeight: React.Dispatch<React.SetStateAction<string | number>>;
}) => {
  const dummyData = {
    name: "John Doe",
    NIP: "123234345456567",
    class: "III/b"
  };

  const onLayout = useCallback(
    (event: { nativeEvent: { layout: { height: number } } }) => {
      const { height } = event.nativeEvent.layout;
      setSheetHeight(height);
    },
    []
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} onLayout={onLayout}>
      <View style={styles.editWrapper}>
        <View style={styles.editHeader}>
          <Pressable onPress={bottomSheet?.current?.close}>
            <Ionicons name="close" size={22} />
          </Pressable>
          <Text style={styles.editHeaderText}>
            {purpose == "edit" ? "Ubah Data" : "Tambah Anggota"}
          </Text>
        </View>

        <View style={styles.formWrapper}>
          <View style={styles.formField}>
            <Text style={styles.formTitle}>Nama Lengkap</Text>

            <TextInput
              style={styles.formInput}
              placeholder="Masukkan nama lengkap"
              defaultValue={purpose == "edit" ? dummyData.name : ""}
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.formTitle}>NIP</Text>

            <TextInput
              style={styles.formInput}
              placeholder="Masukkan nomor induk pegawai"
              keyboardType="numeric"
              defaultValue={purpose == "edit" ? dummyData.NIP : ""}
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.formTitle}>Golongan</Text>

            <TextInput
              style={styles.formInput}
              placeholder="Masukkan golongan"
              defaultValue={purpose == "edit" ? dummyData.class : ""}
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.formTitle}>Password Baru</Text>

            <TextInput
              style={styles.formInput}
              placeholder="Masukkan password baru"
              keyboardType="visible-password"
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.formTitle}>Ulangi Password Baru</Text>

            <TextInput
              style={styles.formInput}
              placeholder="Ulangi password baru"
            />
          </View>
        </View>

        <TouchableHighlight
          style={styles.editBtn}
          underlayColor={COLORS.primaryDarker}
          onPress={() => console.log("edit")}
        >
          <Text style={{ color: "#fff" }}>Simpan Perubahan</Text>
        </TouchableHighlight>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default FormAnggota;

const styles = StyleSheet.create({
  editWrapper: {
    padding: 16,
    gap: 24,
    backgroundColor: "#F9FAFC"
  },
  editHeader: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center"
  },
  editHeaderText: {
    fontSize: 18,
    fontWeight: "800"
  },
  formWrapper: {
    gap: 16
  },
  formField: {
    gap: 4
  },
  formTitle: {
    fontWeight: "800",
    fontSize: 16
  },
  formInput: {
    borderColor: "#aeaeae",
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 40
  },
  editBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center"
  }
});
