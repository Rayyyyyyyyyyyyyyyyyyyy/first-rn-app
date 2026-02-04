import { Pressable, Text } from "react-native";

type AnswerBtnProps = {
  onPress: () => void;
};

export default function AnswerBtn({ onPress }: AnswerBtnProps) {
  return (
    <Pressable
    android_ripple={{ color: "rgba(0,0,0,0.15)", foreground: true }}
    onPress={onPress} 
    className="bg-blue-500 rounded-lg p-2 pressed:opacity-70"
    >
      <Text className="text-white">新增</Text>
    </Pressable>
  );
}