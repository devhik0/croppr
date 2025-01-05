import { useVideoStore } from "@/store/store";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { DocumentPickerResult, getDocumentAsync } from "expo-document-picker";
import { cacheDirectory } from "expo-file-system";
import { Link } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { FFmpegKit, FFmpegKitConfig, ReturnCode } from "ffmpeg-kit-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Button, SafeAreaView, Text, TextInput, View } from "react-native";
import * as yup from "yup";

type FormValues = {
  name: string;
  description: string;
};

export default function CropModal() {
  const [file, setFile] = useState<DocumentPickerResult>();

  const findVideos = async () => {
    const data = await getDocumentAsync({ type: "video/*" });
    console.log("data: ", data.assets?.[0]);
    setFile(data);
  };

  const videoSource = file?.assets?.[0].uri as string;

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
  });

  console.log("file", file?.assets?.[0].name);

  const addVideo = useVideoStore((state) => state.addVideo);

  const cropVideos = async () => {
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
        Alert.alert("Warn", "Clip cancelled");
      } else {
        Alert.alert("Error", "Clip failed");
      }
    });
  };

  const mutation = useMutation({
    mutationFn: () => {
      return cropVideos();
    },
  });

  const schema = yup
    .object({
      name: yup.string().required(),
      description: yup.string().required(),
    })
    .required();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    mutation.mutate();
    addVideo({
      id: Math.floor(Math.random() * 1000).toString(),
      name: data.name,
      description: data.description,
      uri: `${cacheDirectory}output-${file?.assets?.[0].name}`,
    });

    console.log(data);
  };

  return (
    <SafeAreaView>
      <View className="m-2 p-2">
        <Text>Select a video to crop</Text>
        <Button onPress={findVideos} title="Find" />
      </View>

      <View className="mx-2">
        <VideoView style={{ width: 350, height: 275 }} player={player} allowsFullscreen allowsPictureInPicture />
        <View className="mb-2">
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput placeholder="Name" onBlur={onBlur} onChangeText={onChange} value={value} />
            )}
            name="name"
          />
          {errors.description && <Text>This is required.</Text>}
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput placeholder="Description" onBlur={onBlur} onChangeText={onChange} value={value} multiline />
            )}
            name="description"
          />
          {errors.description && <Text>This is required.</Text>}

          <Button title="Crop" onPress={handleSubmit(onSubmit)} />
        </View>
      </View>
      <Link href={"/"} className="mt-2 bg-blue-400">
        Back
      </Link>
    </SafeAreaView>
  );
}
