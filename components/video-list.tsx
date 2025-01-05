import { useVideoStore } from "@/store/store";
import { Link } from "expo-router";
import { FlatList, Pressable, Text } from "react-native";

export const VideoList = () => {
  const videos = useVideoStore((state) => state.videos);

  return (
    <FlatList
      className="mb-2"
      data={videos.toReversed()}
      renderItem={({ item }) => (
        <Link
          href={{
            pathname: "/(details)/[name]",
            params: { name: item.name, description: item.description, uri: item.uri as string },
          }}
          asChild
        >
          <Pressable className="my-1 bg-blue-200 p-2">
            <Text>
              {item.name} {item.description}
            </Text>
          </Pressable>
        </Link>
      )}
    />
  );
};
