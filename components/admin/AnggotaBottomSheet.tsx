import React, { useEffect, useState } from "react";
import BottomSheet, { BottomSheetMethods } from "@devvie/bottom-sheet";
import DeleteConfirmation from "./DeleteConfirmation";
import FormAnggota from "./FormAnggota";
import { Text, View } from "react-native";

const AnggotaBottomSheet = ({
  bottomSheet,
  purpose
}: {
  purpose: "edit" | "delete" | "add";
  bottomSheet: React.RefObject<BottomSheetMethods>;
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
        />
      )}
      {purpose == "delete" && (
        <DeleteConfirmation
          bottomSheet={bottomSheet}
          setSheetHeight={setSheetHeight}
        />
      )}
    </BottomSheet>
  );
};

export default AnggotaBottomSheet;
