import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-lg">我的第一個 App</Text>
      <Text className="text-sm text-gray-500 mt-1">歡迎練習</Text>
  
      <Link href="/examples" asChild>
        <Text className="text-blue-600 mt-2">元件範例（依序示範）</Text>
      </Link>
      <Link href="/answerPage" asChild>
        <Text className="text-blue-600 mt-2">作業</Text>
      </Link>
      <Link href="/photo-sort" asChild>
        <Text className="text-blue-600 mt-2">照片整理</Text>
      </Link>
    </View>
  );
}
