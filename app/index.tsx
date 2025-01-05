import { VideoList } from "@/components/video-list";
import { Link } from "expo-router";
import { Button, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="m-3 flex-1">
        <Text className="mb-2 text-lg">Here is your current clips</Text>
        <Text className="mb-2 text-sm">Pick a clip to see its details</Text>
        <VideoList />
        <Text className="mb-2">Or find a video to crop</Text>
        <Link href={"/crop-modal"} asChild>
          <Button title="Find" />
        </Link>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
