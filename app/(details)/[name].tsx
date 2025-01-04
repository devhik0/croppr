import { Link, useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Details() {
  const { name, description, uri } = useLocalSearchParams();

  const player = useVideoPlayer(uri as string, (player) => {
    player.loop = true;
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1">
        <Text>Test</Text>
        <Text>Clip details</Text>
        <Text>{name}</Text>
        <VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture />
        <Text>{description}</Text>
        <Link href={"/"} className="bg-blue-300">
          Go back
        </Link>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 50,
  },
  video: {
    width: 350,
    height: 275,
  },
  controlsContainer: {
    padding: 10,
  },
});
