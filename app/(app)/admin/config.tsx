import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/Colors";
import { useSession } from "@/context";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ConfigForm from "@/components/admin/ConfigForm";
import Toast from "react-native-toast-message";

const ConfigScreen = () => {
  const { authId } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<DocumentData>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getConfig = async () => {
    if (!authId) return;
    setIsLoading(true);

    const res = await getDoc(doc(db, "config", "ORytNa9QHZNNVXVyCwi9"));
    setConfig({ ...res.data() });
    setIsLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    getConfig();
  }, []);

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
          />
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={() => {
                  console.log("refresh");

                  getConfig();
                  setIsRefreshing(true);
                }}
              />
            }
          >
            <View style={styles.container}>
              <View style={styles.configHeader}>
                <Text style={styles.headerTitle}>Konfigurasi</Text>
              </View>

              <ConfigForm config={config} />
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
      <Toast />
    </>
  );
};

export default ConfigScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 24,
    backgroundColor: "#F9FAFC",
    flex: 1
  },
  configHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800"
  }
});
