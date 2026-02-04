import DateFilter from "@/components/photo-sort/DateFilter";
import PhotoCard from "@/components/photo-sort/PhotoCard";
import TrashBin, { TRASH_STORAGE_KEY } from "@/components/photo-sort/TrashBin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Asset } from "expo-media-library";
import * as MediaLibrary from "expo-media-library";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PhotoSortPage() {
  const [permission, requestPermission] = MediaLibrary.usePermissions();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState<number | null>(null);
  const [day, setDay] = useState<number | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [trashAssets, setTrashAssets] = useState<Asset[]>([]);
  const [trashVisible, setTrashVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadTrashFromStorage = async () => {
    try {
      const raw = await AsyncStorage.getItem(TRASH_STORAGE_KEY);
      if (raw) {
        const ids = JSON.parse(raw) as string[];
        if (ids.length > 0) {
          const infos = await Promise.allSettled(
            ids.map((id) => MediaLibrary.getAssetInfoAsync(id)),
          );
          const valid = infos
            .filter((r) => r.status === "fulfilled" && r.value != null)
            .map((r) => (r as PromiseFulfilledResult<Asset>).value);
          setTrashAssets(valid);
        }
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadTrashFromStorage();
  }, []);

  const saveTrashToStorage = async (list: Asset[]) => {
    try {
      await AsyncStorage.setItem(
        TRASH_STORAGE_KEY,
        JSON.stringify(list.map((a) => a.id)),
      );
    } catch {
      // ignore
    }
  };

  const handleLoadPhotos = async () => {
    if (permission?.status !== "granted") {
      const { status } = await requestPermission();
      if (status !== "granted") return;
    }

    setLoading(true);
    try {
      let createdAfter: Date;
      let createdBefore: Date;
      if (!month) {
        createdAfter = new Date(year, 0, 1);
        createdBefore = new Date(year, 11, 31, 23, 59, 59);
      } else if (!day) {
        createdAfter = new Date(year, month - 1, 1);
        createdBefore = new Date(year, month, 0, 23, 59, 59);
      } else {
        createdAfter = new Date(year, month - 1, day);
        createdBefore = new Date(year, month - 1, day, 23, 59, 59);
      }

      const result = await MediaLibrary.getAssetsAsync({
        first: 200,
        mediaType: "photo",
        sortBy: [["creationTime", false]],
        createdAfter,
        createdBefore,
      });

      setAssets(result.assets);
      setCurrentIndex(0);
    } catch (err) {
      Alert.alert("載入失敗", String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleKeep = () => {
    setCurrentIndex((i) => Math.min(i + 1, assets.length));
  };

  const handleTrash = () => {
    const asset = assets[currentIndex];
    if (asset) {
      const next = [...trashAssets, asset];
      setTrashAssets(next);
      saveTrashToStorage(next);
      setCurrentIndex((i) => Math.min(i + 1, assets.length));
    }
  };

  const handleClearTrash = () => {
    setTrashAssets([]);
    saveTrashToStorage([]);
    setTrashVisible(false);
  };

  const handleDelete = async () => {
    if (trashAssets.length === 0) return;
    const ok = await new Promise<boolean>((resolve) => {
      Alert.alert(
        "確認刪除",
        `將永久刪除 ${trashAssets.length} 張照片，無法復原。確定嗎？`,
        [
          { text: "取消", onPress: () => resolve(false), style: "cancel" },
          { text: "刪除", onPress: () => resolve(true), style: "destructive" },
        ],
      );
    });
    if (!ok) return;

    setDeleting(true);
    try {
      await MediaLibrary.deleteAssetsAsync(trashAssets);
      handleClearTrash();
    } catch (err) {
      Alert.alert("刪除失敗", String(err));
    } finally {
      setDeleting(false);
    }
  };

  if (Platform.OS === "web") {
    return (
      <SafeAreaView className="flex-1 items-center justify-center p-4">
        <Text className="text-center text-gray-600">
          此功能僅支援 iOS 與 Android，請在實機或模擬器上使用。
        </Text>
        <Link href="/" asChild>
          <Text className="mt-4 text-blue-600">返回首頁</Text>
        </Link>
      </SafeAreaView>
    );
  }

  if (permission?.status === "denied") {
    return (
      <SafeAreaView className="flex-1 items-center justify-center p-6">
        <Text className="text-center">
          需要相簿權限才能整理照片。請至設定中開啟權限。
        </Text>
        <Pressable
          className="mt-4 rounded-lg bg-blue-600 px-6 py-3"
          onPress={() => requestPermission()}
        >
          <Text className="font-medium text-white">重新請求權限</Text>
        </Pressable>
        <Pressable className="mt-4" onPress={() => router.back()}>
          <Text className="text-blue-600">返回</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const currentAsset = assets[currentIndex];
  const done = assets.length > 0 && currentIndex >= assets.length;

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="border-b border-gray-200 ">
        <DateFilter
          year={year}
          month={month}
          day={day}
          onYearChange={setYear}
          onMonthChange={setMonth}
          onDayChange={setDay}
          onLoad={handleLoadPhotos}
          loading={loading}
        />
      </View>

      <View className="flex-1">
        {loading && (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" />
          </View>
        )}

        {!loading && assets.length === 0 && (
          <View className="flex-1 items-center justify-center p-8">
            <Text className="text-center text-gray-500">
              選擇日期後點擊「載入照片」
            </Text>
          </View>
        )}

        {!loading && assets.length > 0 && done && (
          <View className="flex-1 items-center justify-center p-8">
            <Text className="text-center text-lg">全部完成！</Text>
            <Text className="mt-2 text-center text-gray-500">
              已整理 {assets.length} 張照片
            </Text>
          </View>
        )}

        {!loading && currentAsset && !done && (
          <View className="flex-1">
            <PhotoCard
              key={currentAsset.id}
              asset={currentAsset}
              onKeep={handleKeep}
              onTrash={handleTrash}
            />
          </View>
        )}
      </View>

      <View className="flex-row items-center justify-between border-t border-gray-200 px-4 py-3">
        <Pressable
          className="rounded-lg bg-gray-200 px-4 py-2"
          onPress={() => router.back()}
        >
          <Text>返回</Text>
        </Pressable>
        <Pressable
          className="rounded-lg bg-amber-500 px-4 py-2"
          onPress={() => setTrashVisible(true)}
        >
          <Text className="font-medium text-white">
            垃圾桶 ({trashAssets.length})
          </Text>
        </Pressable>
      </View>

      <TrashBin
        visible={trashVisible}
        onClose={() => setTrashVisible(false)}
        trashAssets={trashAssets}
        onClear={handleClearTrash}
        onDelete={handleDelete}
        deleting={deleting}
      />
    </SafeAreaView>
  );
}
