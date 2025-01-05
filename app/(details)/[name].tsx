import { VideoPlayerComponent } from "@/components/video-player";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Details() {
  const { name, description, uri } = useLocalSearchParams();

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1">
        <Text className="text-xl">Clip details</Text>
        <Text>Clip name: {name}</Text>
        <VideoPlayerComponent uri={uri as string} />
        <Text>Clip description: {description}</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
