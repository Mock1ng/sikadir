import { Pressable, StyleSheet, Text, TouchableHighlight } from "react-native";
import React, { ForwardedRef, useCallback, useEffect, useState } from "react";
import { COLORS } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  setDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Toast from "react-native-toast-message";
import {
  BottomSheetScrollView,
  BottomSheetView,
  BottomSheetTextInput,
  useBottomSheet
} from "@gorhom/bottom-sheet";

const FormAnggota = ({
  purpose,
  setSheetHeight,
  userSelected
}: {
  purpose: "add" | "edit";
  setSheetHeight?: React.Dispatch<React.SetStateAction<string | number>>;
  userSelected: DocumentData;
}) => {
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [userClass, setUserClass] = useState("");
  const [password, setPassword] = useState("");
  const [securePassword, setSecurePassword] = useState(true);
  const [secureRepassword, setSecureRepassword] = useState(true);
  const [repassword, setRepassword] = useState("");
  const [role, _] = useState("anggota");
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const { close } = useBottomSheet();

  useEffect(() => {
    setIsDisabled(false);

    if (purpose == "add") {
      if (
        name.length == 0 ||
        employeeId.length == 0 ||
        userClass.length == 0 ||
        password.length == 0 ||
        repassword.length == 0
      ) {
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    }

    if (isLoading) {
      setIsDisabled(true);
    }
  }, [purpose, isLoading, name, employeeId, userClass, password, repassword]);

  const onLayout = useCallback(
    (event: { nativeEvent: { layout: { height: number } } }) => {
      const { height } = event.nativeEvent.layout;
      if (setSheetHeight) setSheetHeight(height);
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
    if (password !== repassword) {
      console.log("password tidak sama");

      Toast.show({
        text1: "Password tidak sama!",
        type: "error"
      });

      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      await addDoc(collection(db, "user"), {
        name: name,
        employeeId: employeeId,
        class: userClass,
        password: password,
        role: role
      });

      Toast.show({
        text1: "Berhasil menambah user baru",
        type: "success"
      });

      setName("");
      setEmployeeId("");
      setUserClass("");
      setPassword("");
      setRepassword("");
      setSecurePassword(true);
      setSecureRepassword(true);
      // setIsBottomSheetOpen(false);
      setIsLoading(false);
      close();
    } catch (error) {
      console.log(error);

      setIsLoading(false);
      Toast.show({
        text1: "Gagal menambah user baru!",
        type: "error"
      });
    }
  };

  const editUser = async () => {
    setIsLoading(true);

    type dynamicType = {
      [key: string]: any;
    };

    const payload: dynamicType = {
      name: name,
      employeeId: employeeId,
      class: userClass,
      password: userSelected.password,
      role: role
    };

    if (password.length > 0) {
      if (password !== repassword) {
        console.log("password tidak sama");

        Toast.show({
          text1: "Password tidak sama!",
          type: "error"
        });

        setIsLoading(false);
        return;
      }

      payload.password = password;
    }

    try {
      await setDoc(doc(db, "user", userSelected.id), payload);

      setName("");
      setEmployeeId("");
      setUserClass("");
      setPassword("");
      setRepassword("");
      setSecurePassword(true);
      setSecureRepassword(true);

      Toast.show({
        text1: "Berhasil mengubah data user",
        type: "success"
      });

      // setIsBottomSheetOpen(false);
      setIsLoading(false);
      close();
    } catch (error) {
      console.log(error);

      setIsLoading(false);
      Toast.show({
        text1: "Gagal mengubah data user!",
        type: "error"
      });
    }
  };

  return (
    <BottomSheetScrollView>
      <BottomSheetView style={styles.editWrapper}>
        <BottomSheetView style={styles.editHeader}>
          <Pressable
            onPress={() => {
              close();
              console.log("clossee");
            }}
          >
            <Ionicons name="close" size={22} />
          </Pressable>
          <Text style={styles.editHeaderText}>
            {purpose == "edit" ? "Ubah Data" : "Tambah Anggota"}
          </Text>
        </BottomSheetView>

        <BottomSheetView style={styles.formWrapper}>
          <BottomSheetView style={styles.formField}>
            <Text style={styles.formTitle}>Nama Lengkap</Text>

            <BottomSheetTextInput
              style={styles.formInput}
              placeholder="Masukkan nama lengkap"
              defaultValue={purpose == "edit" ? name : ""}
              value={name}
              onChangeText={setName}
            />
          </BottomSheetView>

          <BottomSheetView style={styles.formField}>
            <Text style={styles.formTitle}>NIP</Text>

            <BottomSheetTextInput
              style={styles.formInput}
              placeholder="Masukkan nomor induk pegawai"
              keyboardType="numeric"
              defaultValue={purpose == "edit" ? employeeId : ""}
              value={employeeId}
              onChangeText={(value) => setEmployeeId(value)}
            />
          </BottomSheetView>

          <BottomSheetView style={styles.formField}>
            <Text style={styles.formTitle}>Golongan</Text>

            <BottomSheetTextInput
              style={styles.formInput}
              placeholder="Masukkan golongan"
              defaultValue={purpose == "edit" ? userClass : ""}
              value={userClass}
              onChangeText={(value) => setUserClass(value)}
            />
          </BottomSheetView>

          <BottomSheetView style={styles.formField}>
            <Text style={styles.formTitle}>Password Baru</Text>

            <BottomSheetView
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <BottomSheetTextInput
                style={styles.formInput}
                placeholder="Masukkan password baru"
                value={password}
                onChangeText={(value) => setPassword(value)}
                secureTextEntry={securePassword}
                autoCapitalize="none"
              />
              <Ionicons
                name={securePassword ? "eye-off" : "eye"}
                style={{ position: "absolute", right: 10 }}
                size={16}
                onPress={() => setSecurePassword((prev) => !prev)}
              />
            </BottomSheetView>
          </BottomSheetView>

          <BottomSheetView style={styles.formField}>
            <Text style={styles.formTitle}>Ulangi Password Baru</Text>

            <BottomSheetView
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <BottomSheetTextInput
                style={styles.formInput}
                placeholder="Ulangi password baru"
                value={repassword}
                onChangeText={(value) => setRepassword(value)}
                secureTextEntry={secureRepassword}
                autoCapitalize="none"
              />

              <Ionicons
                name={secureRepassword ? "eye-off" : "eye"}
                style={{ position: "absolute", right: 10 }}
                size={16}
                onPress={() => setSecureRepassword((prev) => !prev)}
              />
            </BottomSheetView>
          </BottomSheetView>
        </BottomSheetView>

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
      </BottomSheetView>
    </BottomSheetScrollView>
  );
};

export default FormAnggota;

const styles = StyleSheet.create({
  editWrapper: {
    padding: 16,
    gap: 24,
    marginBottom: 24
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
    height: 40,
    width: "100%"
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
