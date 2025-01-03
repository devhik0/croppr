import { useEvent } from "expo";
import { DocumentPickerResult, getDocumentAsync } from "expo-document-picker";
import { useVideoPlayer, VideoSource, VideoView } from "expo-video";
import { useState } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const videos: number[] = [];
  // const videos = [1, 2, 3, 4, 5, 6, 7, 8, 10, 9, 0, 11, 12, 13, 14, 15, 16];

  const filePicker = async () => {
    const data = await getDocumentAsync({ type: "video/*", multiple: false });
    setPickedFile(data);
  };

  const [pickedFile, setPickedFile] = useState<DocumentPickerResult>();

  console.log("File data: ", pickedFile?.assets![0].name);

  const videoSource = pickedFile?.assets![0].uri as VideoSource;

  console.log("src: ", videoSource);

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, "playingChange", { isPlaying: player.playing });

  return (
    <SafeAreaView className="m-2 h-[85%] p-2">
      <Text className="m-2">Welcome to Croppr!</Text>
      <Text className="m-2">You can find your previous clips here</Text>
      {videos.length > 0 && (
        <FlatList
          data={videos}
          contentContainerStyle={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            margin: 2,
            padding: 2,
            flexWrap: "wrap",
          }}
          renderItem={({ item }) => <Text className=" size-28 bg-gray-300">{item}</Text>}
          horizontal={false}
          showsVerticalScrollIndicator={false}
        />
      )}
      <View>
        <Text className="m-2">Please import a video to crop</Text>
        <Button title="Find" onPress={() => filePicker()} />
        <Text>{pickedFile?.assets![0].name}</Text>
      </View>
      <View style={styles.contentContainer}>
        <VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture />
        <View style={styles.controlsContainer}>
          <Button
            title={isPlaying ? "Pause" : "Play"}
            onPress={() => {
              if (isPlaying) {
                player.pause();
              } else {
                player.play();
              }
            }}
          />
        </View>
      </View>
    </SafeAreaView>
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
