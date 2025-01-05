import { useVideoStore } from "@/store/store";
import { Link } from "expo-router";
import { Button, FlatList, Pressable, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const videos = useVideoStore((state) => state.videos);

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1">
        <Text>Test</Text>
        <Text>Here is your current clips</Text>

        <FlatList
          data={videos.toReversed()}
          renderItem={({ item }) => (
            <Link
              href={{
                pathname: "/(details)/[name]",
                params: { name: item.name, description: item.description, uri: item.uri as string },
              }}
              asChild
            >
              <Pressable className="m-1 bg-blue-200 p-1">
                <Text>
                  {item.name} {item.description}
                </Text>
              </Pressable>
            </Link>
          )}
        />
        <Text>Or find a video to crop</Text>
        <Link href={"/crop-modal"} asChild>
          <Button title="Find" />
        </Link>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
