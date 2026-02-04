import AnswerBtn from "@/components/answerBtn";
import InputCom from "@/components/inputCom";
import { useState } from "react";
import { Button, FlatList, Modal, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function Card({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: "rgba(0,0,0,0.15)", foreground: true }}
      className="rounded-lg overflow-hidden p-4 border-2 border-blue-200 bg-blue-100 pressed:opacity-70"
    >
      {children}
    </Pressable>
  );
}

export default function AnswerPage() {
  const [inputAnswer, setInputAnswer] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [answerList, setAnswerList] = useState<string[]>([
    "蘋果",
    "香蕉",
    "橘子",
  ]);

  return (
    <SafeAreaView className="flex-1 ">
      {/* 輸入區：置頂 */}
      <View className="flex-row items-center justify-center gap-2 p-4 border-b border-gray-200">
        <InputCom value={inputAnswer} onChangeText={setInputAnswer} />
        <AnswerBtn
          onPress={() => {
            if (inputAnswer.trim()) {
              setAnswerList([...answerList, inputAnswer.trim()]);
              setInputAnswer("");
            }
          }}
        />
      </View>

      {/* 列表區：佔滿剩餘空間、置中 */}
      <View className="flex-1 px-4 pt-4">
        <FlatList
          data={answerList}
          contentContainerStyle={{ paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={({ item }) => (
            <Card
              onPress={() => {
                setModalVisible(true);
              }}
            >
              <Text className="text-center text-base">{item}</Text>
            </Card>
          )}
          keyExtractor={(item, index) => `${item}-${index}`}
        />
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable className="flex-1 justify-end bg-black/50" onPress={() => setModalVisible(false)}>
          <View className="rounded-t-2xl  p-4">
            <Text className="text-center text-base">Modal 內容</Text>
            <Button title="關閉" onPress={() => setModalVisible(false)} />
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
