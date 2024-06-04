import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { COLORS } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetMethods } from "@devvie/bottom-sheet";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  setDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const FormAnggota = ({
  bottomSheet,
  purpose,
  setSheetHeight,
  userSelected
}: {
  bottomSheet: React.RefObject<BottomSheetMethods>;
  purpose: "add" | "edit";
  setSheetHeight: React.Dispatch<React.SetStateAction<string | number>>;
  userSelected: DocumentData;
}) => {
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [userClass, setUserClass] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    setIsDisabled(false);

    if (purpose == "add") {
      if (name.length == 0 || employeeId.length == 0 || userClass.length == 0) {
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    }

    if (isLoading) {
      setIsDisabled(true);
    }
  }, [purpose, isLoading, name, employeeId, userClass]);

  const onLayout = useCallback(
    (event: { nativeEvent: { layout: { height: number } } }) => {
      const { height } = event.nativeEvent.layout;
      setSheetHeight(height);
    },
    []
  );

  useEffect(() => {
    if (purpose == "edit") {
      setName(userSelected.name);
      setEmployeeId(userSelected.employeeId.toString());
      setUserClass(userSelected.class);
    } else {
      setName("");
      setEmployeeId("");
      setUserClass("");
    }
  }, [purpose, userSelected]);

  const addUser = async () => {
    setIsLoading(true);
    try {
      await addDoc(collection(db, "user"), {
        name: name,
        employeeId: employeeId,
        class: userClass
      });

      setName("");
      setEmployeeId("");
      setUserClass("");
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
    bottomSheet?.current?.close();
  };

  const editUser = async () => {
    setIsLoading(true);

    try {
      await setDoc(doc(db, "user", userSelected.id), {
        name: name,
        employeeId: employeeId,
        class: userClass
      });
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
    bottomSheet?.current?.close();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} onLayout={onLayout}>
      <View style={styles.editWrapper}>
        <View style={styles.editHeader}>
          <Pressable
            onPress={isLoading ? () => {} : bottomSheet?.current?.close}
          >
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
              defaultValue={purpose == "edit" ? name : ""}
              value={name}
              onChangeText={(value) => setName(value)}
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.formTitle}>NIP</Text>

            <TextInput
              style={styles.formInput}
              placeholder="Masukkan nomor induk pegawai"
              keyboardType="numeric"
              defaultValue={purpose == "edit" ? employeeId : ""}
              value={employeeId}
              onChangeText={(value) => setEmployeeId(value)}
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.formTitle}>Golongan</Text>

            <TextInput
              style={styles.formInput}
              placeholder="Masukkan golongan"
              defaultValue={purpose == "edit" ? userClass : ""}
              value={userClass}
              onChangeText={(value) => setUserClass(value)}
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
          style={[
            styles.editBtn,
            isDisabled ? styles.disabledBtn : styles.enabledBtn
          ]}
          underlayColor={COLORS.primaryDarker}
          onPress={purpose == "edit" ? editUser : addUser}
          disabled={isLoading}
        >
          <Text style={{ color: "#fff" }}>
            {isLoading
              ? "Loading..."
              : purpose == "edit"
              ? "Simpan Perubahan"
              : "Tambah Anggota"}
          </Text>
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
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center"
  },
  enabledBtn: {
    backgroundColor: COLORS.primary
  },
  disabledBtn: {
    backgroundColor: "#aeaeae"
  }
});
