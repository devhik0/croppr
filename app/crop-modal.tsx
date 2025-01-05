import { Stepper } from "@/components/stepper";
import { SafeAreaView } from "react-native";

export default function CropModal() {
  return (
    <SafeAreaView className="flex-1">
      <Stepper />
    </SafeAreaView>
  );
}
