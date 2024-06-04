import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View
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
  limit,
  onSnapshot,
  orderBy,
  query,
  where
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Toast from "react-native-toast-message";

type bottomSheetPurposeType = "edit" | "delete" | "add";

const AnggotaScreen = () => {
  const bottomSheetRef = useRef<BottomSheetMethods>(null);
  const [bottomSheetPurpose, setBottomSheetPurpose] =
    useState<bottomSheetPurposeType>("add");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [users, setUsers] = useState<DocumentData[]>([]);
  const [userSelected, setUserSelected] = useState<DocumentData>({});

  const getUser = async () => {
    console.log("get user called");
    setIsRefreshing(true);

    try {
      const unsubGetUser = onSnapshot(
        query(collection(db, "user"), orderBy("name")),
        (snapshots) => {
          setUsers([]);
          snapshots.forEach((doc) => {
            const user = doc.data();
            setUsers((prev) => [...prev, { ...user, id: doc.id }]);
          });
        }
      );
    } catch (error) {
      console.log(error);
    }

    setIsRefreshing(false);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.anggotaWrapper}>
          <View style={styles.anggotaHeader}>
            <TouchableWithoutFeedback onPress={getUser}>
              <Text style={styles.headerTitle}>Daftar Anggota</Text>
            </TouchableWithoutFeedback>

            <View style={styles.headerIcons}>
              <Pressable
                onPress={() => {
                  bottomSheetRef.current?.open();
                  setBottomSheetPurpose("add");
                  setUserSelected({});
                }}
              >
                <Ionicons name="person-add-outline" size={24} />
              </Pressable>
              {/* <Ionicons name="filter" size={16} /> */}
            </View>
          </View>

          <View style={styles.listAnggota}>
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
          </View>
        </View>

        <AnggotaBottomSheet
          purpose={bottomSheetPurpose}
          bottomSheet={bottomSheetRef}
          userSelected={userSelected}
        />
      </SafeAreaView>
      <Toast />
    </>
  );
};

export default AnggotaScreen;

const styles = StyleSheet.create({
  anggotaWrapper: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 24,
    gap: 24,
    minHeight: "100%"
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
    gap: 10
  }
});
