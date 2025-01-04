import { DocumentPickerResult, getDocumentAsync } from "expo-document-picker";
import { cacheDirectory } from "expo-file-system";
import { useVideoPlayer, VideoView } from "expo-video";
import { FFmpegKit, FFmpegKitConfig, ReturnCode } from "ffmpeg-kit-react-native";
import { useState } from "react";
import { Alert, Button, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function CropModal() {
  const videos = [1, 2, 3, 4];

  const [file, setFile] = useState<DocumentPickerResult>();

  const findVideos = async () => {
    const data = await getDocumentAsync({ type: "video/*" });
    console.log("data: ", data.assets?.[0].name);
    setFile(data);
  };

  const videoSource = file?.assets?.[0].uri as string;

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
  });

  console.log("asf", file?.assets?.[0].name);

  const cropVideos = async () => {
    // todo: make here with slider ui
    FFmpegKit.execute(
      `-y -i ${videoSource} -ss 00:00:05 -to 00:00:10 -c copy ${cacheDirectory}output-${file?.assets?.[0].name}.mp4`
    ).then(async (session) => {
      const returnCode = await session.getReturnCode();

      if (ReturnCode.isSuccess(returnCode)) {
        FFmpegKitConfig.selectDocumentForWrite(videoSource, "video/*").then((uri) => {
          FFmpegKitConfig.getSafParameterForWrite(uri).then((safUrl) => {
            FFmpegKit.executeAsync(`-y -i ${cacheDirectory}output-${file?.assets?.[0].name}.mp4 -c:v mpeg4 ${safUrl}`);
          });
        });
        Alert.alert("Info", "Clip success");
      } else if (ReturnCode.isCancel(returnCode)) {
        // CANCEL
      } else {
        Alert.alert("Error", "Clip fail");
      }
    });
  };

  return (
    <SafeAreaView>
      <View className="m-2 p-2">
        <Text>Select a video to crop</Text>
        <Button onPress={findVideos} title="Find" />
      </View>

      <View className="mx-2">
        <VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture />
        <Text>{videoSource}</Text>
        <Button title="Crop" onPress={cropVideos} />
      </View>
    </SafeAreaView>
  );
}

// todo: convert here to tailwind
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
