import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import AnggotaCard from "@/components/admin/AnggotaCard";
import { BottomSheetMethods } from "@devvie/bottom-sheet";
import AnggotaBottomSheet from "@/components/admin/AnggotaBottomSheet";
import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  where
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Toast from "react-native-toast-message";
import GorhomBottomSheet from "@/components/admin/GorhomBottomSheet";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type bottomSheetPurposeType = "edit" | "delete" | "add";

const AnggotaScreen = () => {
  const bottomSheetRef = useRef<BottomSheetMethods>(null);
  const [bottomSheetPurpose, setBottomSheetPurpose] =
    useState<bottomSheetPurposeType>("add");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [users, setUsers] = useState<DocumentData[]>([]);
  const [userSelected, setUserSelected] = useState<DocumentData>({});
  const [isLoading, setIsLoading] = useState(false);
  const gorhomRef = useRef<BottomSheet>(null);

  const getUser = async () => {
    console.log("get user called");
    setIsRefreshing(true);
    setIsLoading(true);

    try {
      const unsubGetUser = onSnapshot(
        query(
          collection(db, "user"),
          orderBy("name"),
          where("role", "==", "anggota")
        ),
        (snapshots) => {
          setUsers([]);
          const tempUsers: DocumentData[] = [];

          snapshots.forEach((doc) => {
            const user = doc.data();
            tempUsers.push({ ...user, id: doc.id });
          });

          setUsers(tempUsers);
        }
      );
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.anggotaWrapper}>
          <View style={styles.anggotaHeader}>
            <Text style={styles.headerTitle}>Daftar Anggota</Text>

            <View style={styles.headerIcons}>
              <Pressable
                onPress={() => {
                  gorhomRef.current?.expand();
                  setBottomSheetPurpose("add");
                  setUserSelected({});
                }}
              >
                <Ionicons name="person-add-outline" size={24} />
              </Pressable>
            </View>
          </View>

          {users.length == 0 && (
            <View>
              <Text>Belum ada anggota</Text>
            </View>
          )}

          <View style={styles.listAnggota}>
            {isLoading && (
              <ActivityIndicator size={"large"} color={COLORS.primary} />
            )}

            {!isLoading && users.length > 0 && (
              <FlatList
                data={users}
                renderItem={({ item }) => (
                  <AnggotaCard
                    bottomSheetRef={bottomSheetRef}
                    setBottomSheetPurpose={setBottomSheetPurpose}
                    user={item}
                    setUserSelected={setUserSelected}
                  />
                )}
                onRefresh={getUser}
                refreshing={isRefreshing}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                nestedScrollEnabled
              />
            )}
          </View>
        </View>

        <AnggotaBottomSheet
          purpose={bottomSheetPurpose}
          bottomSheet={bottomSheetRef}
          userSelected={userSelected}
        />

        <GorhomBottomSheet
          ref={gorhomRef}
          purpose={bottomSheetPurpose}
          userSelected={userSelected}
        />
      </SafeAreaView>
      <Toast />
    </GestureHandlerRootView>
  );
};

export default AnggotaScreen;

const styles = StyleSheet.create({
  anggotaWrapper: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingTop: 24,
    gap: 24,
    flex: 1
  },
  anggotaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800"
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  listAnggota: {
    gap: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    paddingBottom: 0
  }
});
