/* eslint-disable @typescript-eslint/ban-ts-comment */
import { DocumentPickerResult, getDocumentAsync } from "expo-document-picker";
import { router } from "expo-router";
import { useState } from "react";
import { Button, Text, View } from "react-native";
// @ts-expect-error
import { ProgressStep, ProgressSteps } from "react-native-progress-steps";
import { InfoForm } from "./info-form";
import { VideoPlayerComponent } from "./video-player";

export const Stepper = () => {
  const [file, setFile] = useState<DocumentPickerResult>();

  const findVideos = async () => {
    const data = await getDocumentAsync({ type: "video/*" });
    setFile(data);
  };

  const videoSource = file?.assets?.[0].uri as string;
  const fileName = file?.assets?.[0].name as string;

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
          <Text className="mt-2">Selected file: {fileName}</Text>
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
          <VideoPlayerComponent uri={videoSource as string} />
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
        <InfoForm fileName={fileName} videoSource={videoSource} />
      </ProgressStep>
    </ProgressSteps>
  );
};
