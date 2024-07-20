import React, { forwardRef, useCallback, useMemo } from "react";
import FormAnggotaAdd from "./FormAnggotaAdd";
import { DocumentData } from "firebase/firestore";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";

type BottomSheetType = {
  purpose: "edit" | "delete" | "add";
  userSelected: DocumentData;
};

type RefType = BottomSheet;

const GorhomBottomSheet = forwardRef<RefType, BottomSheetType>(
  ({ purpose, userSelected }, ref) => {
    const snapPoints = useMemo(() => ["90%"], []);

    const renderBackdrop = useCallback(
      (
        props: React.JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps
      ) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      ),
      []
    );

    return (
      <BottomSheet
        ref={ref}
        snapPoints={snapPoints}
        index={-1}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: "#F9FAFC" }}
        keyboardBehavior="interactive"
        handleIndicatorStyle={{ backgroundColor: "#F9FAFC" }}
      >
        {purpose == "add" && (
          <FormAnggotaAdd purpose={purpose} userSelected={userSelected} />
        )}
      </BottomSheet>
    );
  }
);

export default GorhomBottomSheet;
