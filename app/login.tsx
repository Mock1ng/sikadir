import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableHighlight,
  Alert,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "@/constants/Colors";

const LoginScreen = () => {
  const [isSaveNim, setIsSaveNim] = useState(false);

  const onSubmit = () => {
    Keyboard.dismiss();
    Alert.alert("Alert Title", "My Alert Msg", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      { text: "OK", onPress: () => console.log("OK Pressed") }
    ]);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView
        style={{
          backgroundColor: "#fff",
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
            />
          </View>

          <View style={{ width: "100%" }}>
            <Text>Password</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderRadius: 10,
                borderColor: "#aeaeae",
                height: 46,
                padding: 10,
                width: "100%"
              }}
              placeholder="Masukkan Password Anda"
            />
          </View>

          <Pressable
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center"
            }}
            onPress={() => setIsSaveNim((prev) => !prev)}
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
              {isSaveNim && <Ionicons name="checkmark" size={14} />}
            </View>
            <Text>Simpan NIM Saya</Text>
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
          underlayColor={"#437599"}
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
  );
};

export default LoginScreen;
