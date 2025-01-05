/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useVideoStore } from "@/store/store";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { DocumentPickerResult, getDocumentAsync } from "expo-document-picker";
import { cacheDirectory } from "expo-file-system";
import { router } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { FFmpegKit, FFmpegKitConfig, ReturnCode } from "ffmpeg-kit-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Button, SafeAreaView, Text, TextInput, View } from "react-native";
// @ts-expect-error
import { ProgressStep, ProgressSteps } from "react-native-progress-steps";
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
        Alert.alert("Info", "Clip created successfully");
      } else if (ReturnCode.isCancel(returnCode)) {
        Alert.alert("Warn", "Clip creation cancelled");
      } else {
        Alert.alert("Error", "Clip creation failed");
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

  const onSubmitSteps = () => {
    router.push("/");
  };

  // bg-blue-400
  const themeColor = "#3b82f6";
  const textColor = "#ffffffdd";

  const progressSteps = {
    borderWidth: 3,
    activeStepIconBorderColor: themeColor,
    completedProgressBarColor: themeColor,
    activeStepIconColor: themeColor,
    activeLabelColor: themeColor,
    completedStepNumColor: themeColor,
    completedStepIconColor: themeColor,
    activeStepNumColor: textColor,
  };

  return (
    <SafeAreaView className="flex-1">
      {/* stepper */}
      <ProgressSteps {...progressSteps}>
        <ProgressStep
          nextBtnTextStyle={{
            color: "#393939",
          }}
          previousBtnTextStyle={{
            color: "#393939",
          }}
          label="Find video"
        >
          <View className="m-2 p-2">
            <Text className="mb-4 text-center">Select a video to crop</Text>
            <Button onPress={findVideos} title="Find" />
            <Text className="mt-2">Selected file: {file?.assets?.[0].name}</Text>
          </View>
        </ProgressStep>
        <ProgressStep
          nextBtnTextStyle={{
            color: "#393939",
          }}
          previousBtnTextStyle={{
            color: "#393939",
          }}
          label="Crop video"
        >
          <View className="items-center">
            <VideoView style={{ width: 350, height: 275 }} player={player} allowsFullscreen allowsPictureInPicture />
          </View>
        </ProgressStep>
        <ProgressStep
          nextBtnTextStyle={{
            color: "#393939",
          }}
          previousBtnTextStyle={{
            color: "#393939",
          }}
          label="Add information"
          onSubmit={onSubmitSteps}
        >
          <View className="mb-2 p-2">
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="my-2 bg-gray-200 p-2"
                  placeholder="Name"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
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
                <TextInput
                  className="my-2 bg-gray-200 p-2"
                  placeholder="Description"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  multiline
                />
              )}
              name="description"
            />
            {errors.description && <Text>This is required.</Text>}

            <Button title="Crop" onPress={handleSubmit(onSubmit)} />
            <Text className="mt-2">Cropped file: {file?.assets?.[0].name}</Text>
          </View>
        </ProgressStep>
      </ProgressSteps>
    </SafeAreaView>
  );
}
