import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableHighlight,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { router } from "expo-router";
import { useSession } from "@/context";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";

const LoginScreen = () => {
  const { signIn, authId } = useSession();
  const [isSaveNip, setIsSaveNip] = useState(false);
  const [nip, setNip] = useState("");
  const [password, setPassword] = useState("");
  const [securePassword, setSecurePassword] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getUser = async (nip: string) => {
    setIsSubmitting(true);

    const res = await getDocs(
      query(collection(db, "user"), where("employeeId", "==", nip))
    );

    if (res.empty) {
      console.log("nip atau password salah");
      Toast.show({
        text1: "data anggota tidak ditemukan!",
        type: "error"
      });

      setIsSubmitting(false);
      return;
    }

    res.forEach((doc) => {
      const data = doc.data();

      if (password.trim() === data.password) {
        signIn(doc.id);

        console.log("user: ", data);

        if (data?.role == "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }

        setIsSubmitting(false);
      } else {
        Toast.show({
          text1: "password salah!",
          type: "error"
        });

        setIsSubmitting(false);
      }
    });
  };

  const onSubmit = () => {
    Keyboard.dismiss();
    getUser(nip);
  };

  return (
    <>
      <StatusBar style="dark" backgroundColor={COLORS.background} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView
          style={{
            backgroundColor: COLORS.background,
            flex: 1,
            alignItems: "center",
            paddingTop: 50,
            paddingHorizontal: 20,
            gap: 24
          }}
        >
          <Text style={{ fontSize: 48, fontWeight: "800" }}>SIKADIR</Text>

          <View style={{}}>
            <Text
              style={{ textAlign: "center", fontWeight: "800", fontSize: 24 }}
            >
              Selamat Datang
            </Text>
            <Text style={{ textAlign: "center" }}>
              Silahkan Login untuk dapat melanjutkan proses kehadiran
            </Text>
          </View>

          <View style={{ width: "100%", gap: 16, alignItems: "baseline" }}>
            <View style={{ width: "100%" }}>
              <Text>NIP</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: "#aeaeae",
                  height: 46,
                  padding: 10
                }}
                placeholder="Masukkan NIP Anda"
                keyboardType="number-pad"
                value={nip}
                onChangeText={(text) => setNip(text)}
              />
            </View>

            <View style={{ width: "100%" }}>
              <Text>Password</Text>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: "#aeaeae",
                    height: 46,
                    paddingVertical: 10,
                    paddingLeft: 10,
                    paddingRight: 32,
                    width: "100%"
                  }}
                  placeholder="Masukkan Password Anda"
                  secureTextEntry={securePassword}
                  autoCapitalize="none"
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                />
                <Ionicons
                  name={securePassword ? "eye-off" : "eye"}
                  style={{
                    position: "absolute",
                    right: 10
                  }}
                  size={20}
                  onPress={() => setSecurePassword((prev) => !prev)}
                />
              </View>
            </View>

            <Pressable
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center"
              }}
              onPress={() => setIsSaveNip((prev) => !prev)}
            >
              <View
                style={{
                  width: 14,
                  height: 14,
                  backgroundColor: "#d9d9d9",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                {isSaveNip && <Ionicons name="checkmark" size={14} />}
              </View>
              <Text>Simpan NIP Saya</Text>
            </Pressable>
          </View>

          <TouchableHighlight
            style={{
              width: "100%",
              height: 45,
              backgroundColor: COLORS.primary,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center"
            }}
            onPress={onSubmit}
            underlayColor={COLORS.primaryUnderlay}
          >
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: "#fff"
                }}
              >
                Masuk
              </Text>
            </View>
          </TouchableHighlight>
        </SafeAreaView>
      </TouchableWithoutFeedback>

      <View
        style={{
          display: isSubmitting ? "flex" : "none",
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: "#00000050",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <ActivityIndicator size={"large"} color={COLORS.primary} />
      </View>

      <Toast />
    </>
  );
};

export default LoginScreen;
