import {
  Button,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";
import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect
} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { router, useRootNavigationState } from "expo-router";
import ClockIn from "@/components/ClockIn";
import ClockInHistory from "@/components/ClockInHistory";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop
} from "@gorhom/bottom-sheet";

const HomeScreen = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);
  // const rootNavigationState = useRootNavigationState();
  // useEffect(() => {
  //   if (!rootNavigationState?.key) return;

  //   router.push("/absence");
  // }, [rootNavigationState]);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <SafeAreaView>
      <StatusBar backgroundColor={COLORS.primary} />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              setIsRefreshing(true);

              setTimeout(() => {
                setIsRefreshing(false);
                console.log("refresh");
              }, 3000);
            }}
          />
        }
      >
        <View style={styles.container}>
          <View style={styles.head}>
            <Text style={styles.logo}>SIKADIR</Text>
            <Ionicons
              name="log-out-outline"
              size={32}
              color={"#fff"}
              onPress={() => router.push("/login")}
            />
          </View>

          <View>
            <Text style={styles.name}>John Doe</Text>
            <Text style={styles.class}>III/b</Text>
          </View>

          <ClockIn />
        </View>

        <ClockInHistory />
      </ScrollView>

      {/* <BottomSheet
        ref={bottomSheetRef}
        snapPoints={["90%"]}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>
          <Button
            title="dismiss"
            onPress={() => bottomSheetRef.current?.close()}
          />
        </BottomSheetView>
      </BottomSheet> */}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 24,
    gap: 14,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: COLORS.primary
  },
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  logo: {
    fontSize: 48,
    color: "#fff",
    fontWeight: "800"
  },
  name: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff"
  },
  class: {
    color: "#fff",
    fontSize: 12
  },
  sheetContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "grey"
  },
  contentContainer: {
    flex: 1,
    alignItems: "center"
  }
});
