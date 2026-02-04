import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "首頁" }} />
        <Stack.Screen name="examples" options={{ title: "元件範例" }} />
        <Stack.Screen name="photo-sort/index" options={{ title: "照片整理" }} />
        <Stack.Screen name="answerPage" options={{ title: "作業" }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
