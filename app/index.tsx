import { Text, View } from "react-native";

export default function SomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="m-2 bg-blue-600 p-4 text-gray-200">Welcome to Croppr!</Text>
    </View>
  );
}
