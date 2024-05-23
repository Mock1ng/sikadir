import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import { COLORS } from "@/constants/Colors";
import { router } from "expo-router";
import BottomSheet, { BottomSheetMethods } from "@devvie/bottom-sheet";

const AbsenceForm = ({
  bottomSheet
}: {
  bottomSheet: React.RefObject<BottomSheetMethods>;
}) => {
  const [value, setValue] = useState("");
  const [isFocus, setIsFocus] = useState(false);

  const data = [
    { label: "Pendidikan", value: "1" },
    { label: "Dinas Luar", value: "2" },
    { label: "Sakit", value: "3" },
    { label: "Malas", value: "4" }
  ];

  return (
    <BottomSheet ref={bottomSheet} height={"90%"} hideDragHandle={true}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.absenceWrapper}>
          <View style={styles.absenceHeader}>
            <Ionicons
              name="close"
              size={22}
              onPress={bottomSheet?.current?.close}
            />
            <Text style={styles.absenceHeaderText}>Tidak Hadir</Text>
          </View>

          <View style={{ gap: 16 }}>
            <View>
              <View style={styles.dropdownWrapper}>
                <Text style={styles.dropdownTitle}>Alasan</Text>

                <Dropdown
                  style={[
                    styles.dropdown,
                    isFocus && { borderColor: COLORS.primary }
                  ]}
                  iconStyle={styles.iconStyle}
                  data={data}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus ? "Pilih alasan" : "..."}
                  searchPlaceholder="Search..."
                  value={value}
                  onFocus={() => {
                    setIsFocus(true);
                    Keyboard.dismiss();
                  }}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item) => {
                    setValue(item.value);
                    setIsFocus(false);
                  }}
                />
              </View>
            </View>

            <View>
              <View style={styles.dropdownWrapper}>
                <Text style={styles.dropdownTitle}>Keterangan</Text>

                <TextInput
                  style={styles.dropdown}
                  placeholder="Masukkan keterangan"
                />
              </View>
            </View>
          </View>

          <View style={styles.btnWrapper}>
            <TouchableHighlight
              style={styles.cancelBtn}
              underlayColor={"#fff"}
              onPress={() => router.back()}
            >
              <View style={{ alignItems: "center" }}>
                <Text style={{}}>Batal</Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              style={styles.absenceBtn}
              underlayColor={COLORS.primaryUnderlay}
              onPress={() => {
                console.log("tidak hadir");
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: "#fff" }}>Tidak Hadir</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </BottomSheet>
  );
};

export default AbsenceForm;

const styles = StyleSheet.create({
  absenceWrapper: {
    padding: 16,
    gap: 24,
    backgroundColor: "#fff",
    height: "100%"
  },
  absenceHeader: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center"
  },
  absenceHeaderText: {
    fontSize: 18,
    fontWeight: "800"
  },
  dropdownWrapper: {
    gap: 4
  },
  dropdownTitle: {
    fontWeight: "800",
    fontSize: 16
  },
  container: {
    backgroundColor: "white",
    padding: 16
  },
  dropdown: {
    borderColor: "#aeaeae",
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 40
  },
  icon: {
    marginRight: 5
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 12
  },
  iconStyle: {
    width: 20,
    height: 20
  },
  btnWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: "#aeaeae",
    borderRadius: 10,
    backgroundColor: "#fff",
    flexGrow: 1,
    paddingVertical: 12
  },
  absenceBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    flexGrow: 1,
    paddingVertical: 12
  }
});
