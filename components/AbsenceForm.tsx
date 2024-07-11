import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import { COLORS } from "@/constants/Colors";
import BottomSheet, { BottomSheetMethods } from "@devvie/bottom-sheet";
import { addDoc, collection, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useSession } from "@/context";
import useDate from "@/hooks/useDate";
import Toast from "react-native-toast-message";
import useTimeFormatter from "@/hooks/useTimeFormatter";

const AbsenceForm = ({
  bottomSheet,
  config
}: {
  bottomSheet: React.RefObject<BottomSheetMethods>;
  config: DocumentData;
}) => {
  const [value, setValue] = useState("");
  const [details, setDetails] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sheetHeight, setSheetHeight] = useState(0);
  const { authId } = useSession();
  const { date, year, month } = useDate(new Date().toISOString());
  const { hourStart, hourEnd, minuteStart, minuteEnd } = useTimeFormatter({
    hourStart: config.hourStart,
    hourEnd: config.hourEnd,
    minuteStart: config.minuteStart,
    minuteEnd: config.minuteEnd
  });

  const onLayout = useCallback(
    (event: { nativeEvent: { layout: { height: number } } }) => {
      const { height } = event.nativeEvent.layout;
      setSheetHeight(height);
    },
    []
  );

  const absenceDetail = [
    { label: "DINAS LUAR", value: "1" },
    { label: "PENDIDIKAN", value: "2" },
    { label: "CUTI", value: "3" },
    { label: "SAKIT", value: "4" },
    { label: "IJIN", value: "5" },
    { label: "TANPA KETERANGAN", value: "6" }
  ];

  const absenceHandler = async () => {
    Keyboard.dismiss();

    if (isLoading) return;

    setIsLoading(true);
    const type = absenceDetail.find((detail) => detail.value == value)?.label;

    try {
      await addDoc(collection(db, "presence"), {
        date: `${year}-${month}-${date}`,
        type: type,
        detail: details,
        user: authId,
        iso: new Date().toISOString(),
        timeConfig: `${hourStart}.${minuteStart} - ${hourEnd}.${minuteEnd}`
      });

      bottomSheet?.current?.close();
      setValue("");
      setDetails("");
      setIsLoading(false);
    } catch (error) {
      console.log(error);

      Toast.show({
        text1: "Gagal untuk mengupdate data!",
        type: "error"
      });

      setIsLoading(false);
    }
  };

  return (
    <BottomSheet ref={bottomSheet} height={"90%"} hideDragHandle={true}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} onLayout={onLayout}>
        <View style={styles.absenceWrapper}>
          <View style={styles.absenceHeader}>
            <Ionicons
              name="close"
              size={22}
              onPress={() => {
                bottomSheet?.current?.close();
                setDetails("");
              }}
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
                  data={absenceDetail}
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
                  onChangeText={(e) => setDetails(e)}
                  value={details}
                />
              </View>
            </View>
          </View>

          <View style={styles.btnWrapper}>
            <TouchableHighlight
              style={styles.cancelBtn}
              underlayColor={"#fff"}
              onPress={() => {
                if (isLoading) return;

                bottomSheet?.current?.close();
                Keyboard.dismiss();
                setDetails("");
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Text>Batal</Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              style={styles.absenceBtn}
              underlayColor={COLORS.primaryUnderlay}
              onPress={absenceHandler}
            >
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: "#fff" }}>
                  {isLoading ? "Loading..." : "Tidak Hadir"}
                </Text>
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
    backgroundColor: "#F9FAFC",
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
