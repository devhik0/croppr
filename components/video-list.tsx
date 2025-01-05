import { useVideoStore } from "@/store/store";
import { Link } from "expo-router";
import { FlatList, Pressable, Text } from "react-native";

export const VideoList = () => {
  const videos = useVideoStore((state) => state.videos);

  return (
    <FlatList
      style={{ marginBottom: 8 }}
      data={videos.toReversed()}
      renderItem={({ item }) => (
        <Link
          href={{
            pathname: "/(details)/[name]",
            params: { name: item.name, description: item.description, uri: item.uri as string },
          }}
          asChild
        >
          <Pressable style={{ marginVertical: 4, padding: 8, backgroundColor: "#bfdbfe" }}>
            <Text>
              {item.name} {item.description}
            </Text>
          </Pressable>
        </Link>
      )}
    />
  );
};
