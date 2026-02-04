# React Native 基礎元件清單

以下為 `react-native` 內建的基礎元件，可直接 `import { ... } from 'react-native'` 使用。

---

## 一、基本元件 (Basic Components)

| 元件 | 用途 |
|------|------|
| **View** | 最基礎的容器，類似 `<div>`。支援 Flexbox、style、觸控、 accessibility。 |
| **Text** | 顯示文字。所有文字都必須包在 `<Text>` 內，可巢狀、設 style、觸控。 |
| **Image** | 顯示圖片。`source={{ uri: '...' }}` 遠端，`source={require('./x.png')}` 本地。 |
| **ImageBackground** | 以圖片當背景的容器，子元件疊在上面。 |
| **TextInput** | 文字輸入框，透過鍵盤輸入。常用 `value`、`onChangeText`、`placeholder`。 |
| **ScrollView** | 可捲動容器，可放多個子元件。不適合超長列表，長列表用 `FlatList`。 |
| **Pressable** | 包住任意子元件，偵測按壓（含長按、延遲等）。取代舊的 Touchable* 系列。 |
| **StyleSheet** | 建立樣式表，類似 CSS。`StyleSheet.create({ ... })` 具優化與檢查。 |

---

## 二、使用者介面 (User Interface)

| 元件 | 用途 |
|------|------|
| **Button** | 基本按鈕，`title`、`onPress`。樣式有限，常用 `Pressable` 自訂。 |
| **Switch** | 開關，布林輸入。`value`、`onValueChange`。 |

---

## 三、列表 (List Views)

| 元件 | 用途 |
|------|------|
| **FlatList** | 高效能捲動列表，只渲染可見項目。`data`、`renderItem`、`keyExtractor`。 |
| **SectionList** | 分區列表，同 `FlatList` 但支援 `sections` 與區段標題。 |

---

## 四、其他常用元件與 API (Others)

| 元件 / API | 用途 |
|------------|------|
| **ActivityIndicator** | 圓形 loading 動畫。`size`、`color`。 |
| **Modal** | 疊在畫面上方的視窗，可關閉。`visible`、`onRequestClose`、`transparent`。 |
| **StatusBar** | 控制狀態列（時間、電量等）樣式。`barStyle`、`backgroundColor`。 |
| **SafeAreaView** | 避開劉海、Home 指示條等安全區域的容器。 |
| **KeyboardAvoidingView** | 鍵盤彈出時自動上移內容，避免被擋住。 |
| **RefreshControl** | 搭配 `ScrollView` / `FlatList` 的下拉重新整理。 |
| **Alert** | 原生對話框。`Alert.alert(title, message, buttons)`。 |

---

## 五、觸控元件（舊版，建議用 Pressable）

| 元件 | 用途 |
|------|------|
| **TouchableOpacity** | 按下去變半透明。 |
| **TouchableHighlight** | 按下去有高亮底色。 |
| **TouchableWithoutFeedback** | 僅觸發事件，無視覺回饋。 |

---

## 六、工具型 API（非 UI 元件）

| API | 用途 |
|-----|------|
| **Dimensions** | 取得螢幕尺寸。`Dimensions.get('window')`。 |
| **PixelRatio** | 裝置像素密度。`PixelRatio.get()`、`roundToNearestPixel`。 |
| **Linking** | 開啟 URL、處理 deep link。`Linking.openURL(url)`。 |
| **Animated** | 動畫 API。`Animated.View`、`Animated.timing` 等。 |

---

## 七、平台專用 (Platform-specific)

**Android**

| 元件 / API | 用途 |
|------------|------|
| **BackHandler** | 偵測實體返回鍵。 |
| **DrawerLayoutAndroid** | 抽屜式側邊選單。 |
| **PermissionsAndroid** | Android 權限請求。 |
| **ToastAndroid** | Android Toast 提示。 |

**iOS**

| 元件 / API | 用途 |
|------------|------|
| **ActionSheetIOS** | iOS 動作選單 / 分享表。 |

---

## 匯入範例

```tsx
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  Button,
  Switch,
  FlatList,
  SectionList,
  ActivityIndicator,
  Modal,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  RefreshControl,
  Alert,
  TouchableOpacity,
  Dimensions,
  PixelRatio,
  Linking,
} from "react-native";
```

---

## Expo 常用補充

專案使用 Expo，還可能用到：

| 套件 | 用途 |
|------|------|
| **expo-router** | `Link`、`router`、`Stack`、`Tabs` 等檔案式路由與導航。 |
| **expo-image** | `Image` 強化版，快取、優先順序等。 |
| **expo-status-bar** | `StatusBar` 的 Expo 版本，跨平台一致。 |
| **@expo/vector-icons** | 圖示庫（如 Ionicons、MaterialIcons）。 |

---

依教學歷程可先熟練：**View**、**Text**、**Pressable**、**ScrollView**、**TextInput**、**FlatList**。
