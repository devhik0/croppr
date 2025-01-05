import { useVideoStore } from "@/store/store";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { cacheDirectory } from "expo-file-system";
import { FFmpegKit, FFmpegKitConfig, ReturnCode } from "ffmpeg-kit-react-native";
import { Controller, useForm } from "react-hook-form";
import { Alert, Button, Text, TextInput, View } from "react-native";
import * as yup from "yup";

type FormValues = {
  name: string;
  description: string;
};

export const InfoForm = ({ fileName, videoSource }: { fileName: string; videoSource: string }) => {
  const cropVideos = async () => {
    FFmpegKit.execute(
      `-y -i ${videoSource} -ss 00:00:05 -to 00:00:10 -c copy ${cacheDirectory}output-${fileName}.mp4`
    ).then(async (session) => {
      const returnCode = await session.getReturnCode();

      if (ReturnCode.isSuccess(returnCode)) {
        FFmpegKitConfig.selectDocumentForWrite(videoSource, "video/*").then((uri) => {
          FFmpegKitConfig.getSafParameterForWrite(uri).then((safUrl) => {
            FFmpegKit.executeAsync(`-y -i ${cacheDirectory}output-${fileName}.mp4 -c:v mpeg4 ${safUrl}`);
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

  const addVideo = useVideoStore((state) => state.addVideo);

  const mutation = useMutation({
    mutationFn: () => {
      return cropVideos();
    },
  });

  const onSubmit = async (data: FormValues) => {
    mutation.mutate();
    addVideo({
      id: Math.floor(Math.random() * 1000).toString(),
      name: data.name,
      description: data.description,
      uri: `${cacheDirectory}output-${fileName}`,
    });
  };

  return (
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
      <Text className="mt-2">Cropped file: {fileName}</Text>
    </View>
  );
};
