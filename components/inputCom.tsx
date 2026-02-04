import { TextInput } from "react-native";

type InputComProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export default function InputCom({ value, onChangeText }: InputComProps) {
  return (
    <TextInput
      className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-3"
      placeholder="輸入新答案"
      value={value}
      onChangeText={onChangeText}
    />
  );
}