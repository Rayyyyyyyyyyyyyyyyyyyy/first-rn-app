import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 20 }, (_, i) => CURRENT_YEAR - 15 + i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

type PickerType = "year" | "month" | "day" | null;

type DateFilterProps = {
  year: number;
  month: number | null;
  day: number | null;
  onYearChange: (y: number) => void;
  onMonthChange: (m: number | null) => void;
  onDayChange: (d: number | null) => void;
  onLoad: () => void;
  loading?: boolean;
};

export default function DateFilter({
  year,
  month,
  day,
  onYearChange,
  onMonthChange,
  onDayChange,
  onLoad,
  loading = false,
}: DateFilterProps) {
  const [picker, setPicker] = useState<PickerType>(null);

  const getDaysInMonth = () => {
    const m = month ?? 12;
    const last = new Date(year, m, 0).getDate();
    return Array.from({ length: last }, (_, i) => i + 1);
  };

  const renderPickerModal = () => {
    if (!picker) return null;
    const items =
      picker === "year"
        ? YEARS
        : picker === "month"
          ? MONTHS
          : getDaysInMonth();
    return (
      <Modal visible transparent animationType="slide">
        <Pressable
          className="flex-1 justify-end bg-black/50"
          onPress={() => setPicker(null)}
        >
          <View className="max-h-64 rounded-t-2xl ">
            <View className="border-b border-gray-200 p-3">
              <Text className="text-center font-medium">
                {picker === "year"
                  ? "選擇年份"
                  : picker === "month"
                    ? "選擇月份"
                    : "選擇日期"}
              </Text>
            </View>
            <ScrollView className="max-h-48">
              {picker === "month" && (
                <Pressable
                  className="border-b border-gray-100 p-3"
                  onPress={() => {
                    onMonthChange(null);
                    setPicker(null);
                  }}
                >
                  <Text className="text-center text-gray-500">全部</Text>
                </Pressable>
              )}
              {picker === "day" && (
                <Pressable
                  className="border-b border-gray-100 p-3"
                  onPress={() => {
                    onDayChange(null);
                    setPicker(null);
                  }}
                >
                  <Text className="text-center text-gray-500">全部</Text>
                </Pressable>
              )}
              {items.map((n) => (
                <Pressable
                  key={n}
                  className="border-b border-gray-100 p-3"
                  onPress={() => {
                    if (picker === "year") onYearChange(n);
                    else if (picker === "month") onMonthChange(n);
                    else onDayChange(n);
                    setPicker(null);
                  }}
                >
                  <Text className="text-center">{n}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    );
  };

  const monthLabel = month ? `${month}月` : "全部";
  const dayLabel = day ? `${day}日` : "全部";

  return (
    <View className="gap-3 p-4">
      <View className="flex-row flex-wrap gap-2">
        <Pressable
          className="rounded-lg bg-gray-200 px-4 py-2"
          onPress={() => setPicker("year")}
        >
          <Text>{year}年</Text>
        </Pressable>
        <Pressable
          className="rounded-lg bg-gray-200 px-4 py-2"
          onPress={() => setPicker("month")}
        >
          <Text>{monthLabel}</Text>
        </Pressable>
        <Pressable
          className="rounded-lg bg-gray-200 px-4 py-2"
          onPress={() => setPicker("day")}
        >
          <Text>{dayLabel}</Text>
        </Pressable>
      </View>
      <Pressable
        className="rounded-lg bg-blue-600 py-3"
        onPress={onLoad}
        disabled={loading}
      >
        <Text className="text-center font-medium text-white">
          {loading ? "載入中..." : "載入照片"}
        </Text>
      </Pressable>
      {renderPickerModal()}
    </View>
  );
}
