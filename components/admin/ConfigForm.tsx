import {
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from "react-native";
import React, { useEffect, useState } from "react";
import { doc, DocumentData, setDoc } from "firebase/firestore";
import { COLORS } from "@/constants/Colors";
import { db } from "@/lib/firebase";
import Toast from "react-native-toast-message";

const ConfigForm = ({ config }: { config: DocumentData }) => {
  const [hourStart, setHourStart] = useState("");
  const [hourEnd, setHourEnd] = useState("");
  const [minuteStart, setMinuteStart] = useState("");
  const [minuteEnd, setMinuteEnd] = useState("");
  const [daysOff, setDaysOff] = useState("");
  const [targetLat, setTargetLat] = useState("");
  const [targetLong, setTargetLong] = useState("");
  const [radius, setRadius] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (Object.keys(config).length > 0) {
      setHourStart(config.hourStart.toString());
      setHourEnd(config.hourEnd.toString());
      setMinuteStart(config.minuteStart.toString());
      setMinuteEnd(config.minuteEnd.toString());
      setDaysOff(config.daysOff.toString());
      setTargetLat(config.targetLat.toString());
      setTargetLong(config.targetLong.toString());
      setRadius(config.radius.toString());
    }
  }, [config]);

  const saveConfigHandler = async () => {
    if (isLoading) return;

    setIsLoading(true);

    const payload = {
      hourStart: parseInt(hourStart),
      hourEnd: parseInt(hourEnd),
      minuteStart: parseInt(minuteStart),
      minuteEnd: parseInt(minuteEnd),
      daysOff: daysOff,
      targetLat: parseFloat(targetLat),
      targetLong: parseFloat(targetLong),
      radius: parseFloat(radius)
    };

    try {
      await setDoc(doc(db, "config", "ORytNa9QHZNNVXVyCwi9"), payload);

      Toast.show({
        text1: "Berhasil mengupdate config!",
        type: "success"
      });
      setIsLoading(false);
    } catch (error) {
      Toast.show({
        text1: "Gagal mengupdate config!",
        type: "error"
      });
      console.log(error);
    }
  };

  return (
    <>
      <View style={styles.formField}>
        <Text style={styles.formTitle}>Jam Mulai</Text>
        <TextInput
          style={styles.formInput}
          placeholder="Silahkan masukkan jam mulai"
          keyboardType="numeric"
          defaultValue={hourStart}
          value={hourStart}
          onChangeText={(value) => setHourStart(value)}
        />
      </View>
      <View style={styles.formField}>
        <Text style={styles.formTitle}>Menit Mulai</Text>
        <TextInput
          style={styles.formInput}
          keyboardType="numeric"
          defaultValue={minuteStart}
          onChangeText={(value) => setMinuteStart(value)}
          value={minuteStart}
          placeholder="Silahkan masukkan menit mulai"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.formTitle}>Jam Selesai</Text>
        <TextInput
          style={styles.formInput}
          keyboardType="numeric"
          value={hourEnd}
          onChangeText={(value) => setHourEnd(value)}
          defaultValue={hourEnd}
          placeholder="Silahkan masukkan jam selesai"
        />
      </View>
      <View style={styles.formField}>
        <Text style={styles.formTitle}>Menit Selesai</Text>
        <TextInput
          style={styles.formInput}
          keyboardType="numeric"
          defaultValue={minuteEnd}
          onChangeText={(value) => setMinuteEnd(value)}
          value={minuteEnd}
          placeholder="Silahkan masukkan menit selesai"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.formTitle}>Latitude</Text>
        <TextInput
          style={styles.formInput}
          keyboardType="numeric"
          defaultValue={targetLat}
          onChangeText={(value) => setTargetLat(value)}
          value={targetLat}
          placeholder="Silahkan masukkan latitude target"
        />
      </View>
      <View style={styles.formField}>
        <Text style={styles.formTitle}>Longitude</Text>
        <TextInput
          style={styles.formInput}
          keyboardType="numeric"
          defaultValue={targetLong}
          onChangeText={(value) => setTargetLong(value)}
          value={targetLong}
          placeholder="Silahkan masukkan longitude target"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.formTitle}>Radius</Text>
        <TextInput
          style={styles.formInput}
          keyboardType="numeric"
          defaultValue={radius}
          onChangeText={(value) => setRadius(value)}
          value={radius}
          placeholder="Silahkan masukkan radius"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.formTitle}>Hari Libur</Text>
        <TextInput
          style={styles.formInput}
          keyboardType="numeric"
          defaultValue={daysOff}
          onChangeText={(value) => setDaysOff(value)}
          value={daysOff}
          placeholder="Silahkan masukkan hari libur"
        />
      </View>

      <TouchableHighlight
        style={styles.saveBtn}
        underlayColor={COLORS.primaryDarker}
        onPress={saveConfigHandler}
      >
        <Text style={{ color: "#fff" }}>
          {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
        </Text>
      </TouchableHighlight>
    </>
  );
};

export default ConfigForm;

const styles = StyleSheet.create({
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
  saveBtn: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: COLORS.primary
  }
});
