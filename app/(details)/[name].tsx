import { useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { SafeAreaView, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Details() {
  const { name, description, uri } = useLocalSearchParams();

  const player = useVideoPlayer(uri as string, (player) => {
    player.loop = true;
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1">
        <Text className="text-xl">Clip details</Text>
        <Text>Clip name: {name}</Text>
        <VideoView style={{ width: 350, height: 275 }} player={player} allowsFullscreen allowsPictureInPicture />
        <Text>Clip description: {description}</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
