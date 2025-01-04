import { Link, useLocalSearchParams } from "expo-router";
import { SafeAreaView, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Details() {
  const { name, description } = useLocalSearchParams();
  console.log("params: ", { name, description });

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1">
        <Text>Test</Text>
        <Text>Clip details</Text>
        {/* //todo: video preview here */}
        <Text>{name}</Text>
        <Text>{description}</Text>
        <Link href={"/"} className="bg-blue-300">
          Go back
        </Link>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
