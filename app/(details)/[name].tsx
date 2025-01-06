import { VideoPlayerComponent } from "@/components/video-player";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Details() {
  const { name, description, uri } = useLocalSearchParams();

  return (
    <SafeAreaProvider>
      <SafeAreaView className="m-2 flex-1">
        <Text className="mb-2 text-xl">Clip details</Text>
        <Text className="mb-2">Clip name: {name}</Text>
        <View style={{ alignItems: "center" }}>
          <VideoPlayerComponent uri={uri as string} />
        </View>
        <Text className="mt-2">Clip description: {description}</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
