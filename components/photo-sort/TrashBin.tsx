import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { Asset } from "expo-media-library";
import { useEffect, useState } from "react";
import { FlatList, Modal, Pressable, Text, View } from "react-native";

function TrashThumbnail({ asset }: { asset: Asset }) {
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    const u = asset.uri;
    if (u.startsWith("ph://") || u.startsWith("assets-library://")) {
      MediaLibrary.getAssetInfoAsync(asset)
        .then((info) => setUri(info.localUri ?? u))
        .catch(() => setUri(u));
    } else {
      setUri(u);
    }
  }, [asset]);

  if (!uri) return <View className="h-full w-full bg-gray-200" />;
  return (
    <Image source={{ uri }} className="h-full w-full" contentFit="cover" />
  );
}

const TRASH_STORAGE_KEY = "@photo_sort_trash";

type TrashBinProps = {
  visible: boolean;
  onClose: () => void;
  trashAssets: Asset[];
  onClear: () => void;
  onDelete: () => void;
  deleting?: boolean;
};

export default function TrashBin({
  visible,
  onClose,
  trashAssets,
  onClear,
  onDelete,
  deleting = false,
}: TrashBinProps) {
  const count = trashAssets.length;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50">
        <View className="mt-20 flex-1 rounded-t-2xl ">
          <View className="flex-row items-center justify-between border-b border-gray-200 p-4">
            <Text className="text-lg font-semibold">垃圾桶 ({count})</Text>
            <Pressable onPress={onClose}>
              <Text className="text-blue-600">關閉</Text>
            </Pressable>
          </View>

          {count === 0 ? (
            <View className="flex-1 items-center justify-center p-8">
              <Text className="text-gray-500">暫存為空</Text>
            </View>
          ) : (
            <>
              <FlatList
                data={trashAssets}
                keyExtractor={(item) => item.id}
                numColumns={3}
                contentContainerStyle={{ padding: 8 }}
                renderItem={({ item }) => (
                  <View className="m-1 aspect-square w-[31%] overflow-hidden rounded">
                    <TrashThumbnail asset={item} />
                  </View>
                )}
              />
              <View className="flex-row gap-3 border-t border-gray-200 p-4">
                <Pressable
                  className="flex-1 rounded-lg bg-gray-200 py-3"
                  onPress={onClear}
                >
                  <Text className="text-center font-medium">清空暫存</Text>
                </Pressable>
                <Pressable
                  className="flex-1 rounded-lg bg-red-600 py-3"
                  onPress={onDelete}
                  disabled={deleting}
                >
                  <Text className="text-center font-medium text-white">
                    {deleting ? "刪除中..." : "確認刪除"}
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

export { TRASH_STORAGE_KEY };
