import React, { useEffect, useState } from "react";
import BottomSheet, { BottomSheetMethods } from "@devvie/bottom-sheet";
import DeleteConfirmation from "./DeleteConfirmation";
import FormAnggota from "./FormAnggota";
import { Text, View } from "react-native";
import { DocumentData } from "firebase/firestore";

const AnggotaBottomSheet = ({
  bottomSheet,
  purpose,
  userSelected
}: {
  purpose: "edit" | "delete" | "add";
  bottomSheet: React.RefObject<BottomSheetMethods>;
  userSelected: DocumentData;
}) => {
  const [sheetHeight, setSheetHeight] = useState<string | number>("90%");

  useEffect(() => {
    if (purpose != "edit") return;

    setSheetHeight("90%");
  }, [purpose]);

  return (
    <BottomSheet ref={bottomSheet} height={sheetHeight} hideDragHandle={true}>
      {(purpose == "add" || purpose == "edit") && (
        <FormAnggota
          bottomSheet={bottomSheet}
          purpose={purpose}
          setSheetHeight={setSheetHeight}
          userSelected={userSelected}
        />
      )}
      {purpose == "delete" && (
        <DeleteConfirmation
          bottomSheet={bottomSheet}
          setSheetHeight={setSheetHeight}
          userSelected={userSelected}
        />
      )}
    </BottomSheet>
  );
};

export default AnggotaBottomSheet;
