import { Link } from "expo-router";
import { Button, FlatList, Pressable, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const clips = [
    {
      id: Math.floor(Math.random() * 1000).toString(),
      name: "Something",
      description: "Something desc",
    },
    {
      id: Math.floor(Math.random() * 1000).toString(),
      name: "Another",
      description: "Another desc",
    },
    {
      id: Math.floor(Math.random() * 1000).toString(),
      name: "Any",
      description: "any desc",
    },
    {
      id: Math.floor(Math.random() * 1000).toString(),
      name: "Video",
      description: "video desc",
    },
  ];
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1">
        <Text>Test</Text>
        {/* //todo: fill here with clips */}
        <Text>Here is your current clips</Text>
        <FlatList
          data={clips}
          renderItem={({ item }) => (
            <Link
              href={{ pathname: "/(details)/[name]", params: { name: item.name, description: item.description } }}
              asChild
            >
              <Pressable className="m-2 bg-emerald-400 p-2">
                <Text>{item.name}</Text>
                <Text>{item.description}</Text>
              </Pressable>
            </Link>
          )}
          keyExtractor={(item) => item.id}
        />
        {/* //todo: modal here */}
        <Link href={"/crop-modal"} asChild>
          <Button title="Crop" />
        </Link>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
