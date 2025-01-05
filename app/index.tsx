import { useVideoStore } from "@/store/store";
import { Link } from "expo-router";
import { Button, FlatList, Pressable, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const videos = useVideoStore((state) => state.videos);

  return (
    <SafeAreaProvider>
      <SafeAreaView className="m-3 flex-1">
        <Text className="mb-2 text-lg">Here is your current clips</Text>
        <Text className="mb-2 text-sm">Pick a clip to see its details</Text>
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
        <Text className="mb-2">Or find a video to crop</Text>
        <Link href={"/crop-modal"} asChild>
          <Button title="Find" />
        </Link>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
