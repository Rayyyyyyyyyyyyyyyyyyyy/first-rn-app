/**
 * 元件範例頁：依 COMPONENTS.md 順序示範 React Native 基礎元件。
 * 每個 Card 對應一個元件，可捲動查看、實際操作。
 */
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    BackHandler,
    Button,
    Dimensions,
    FlatList,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Linking,
    Modal,
    PixelRatio,
    Platform,
    Pressable,
    RefreshControl,
    ScrollView,
    SectionList,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ---------- 工具 API 範例用 ----------
const {width: WIN_WIDTH, height: WIN_HEIGHT} = Dimensions.get("window");
const PX = PixelRatio.get();

// FlatList 範例資料（需 id 給 keyExtractor）
const FLAT_DATA = [
    {id: "1", name: "項目 A"},
    {id: "2", name: "項目 B"},
    {id: "3", name: "項目 C"},
];

// SectionList 範例：區段標題 + 該區 data
const SECTIONS = [
    {title: "區段 1", data: ["A1", "A2"]},
    {title: "區段 2", data: ["B1", "B2", "B3"]},
];

// 平台專用 API：僅在對應平台載入，避免其他平台報錯
let DrawerLayoutAndroid: React.ComponentType<any> | null = null;
let ToastAndroid: any = null;
let PermissionsAndroid: any = null;
let ActionSheetIOS: any = null;
if (Platform.OS === "android") {
    DrawerLayoutAndroid = require("react-native").DrawerLayoutAndroid;
    ToastAndroid = require("react-native").ToastAndroid;
    PermissionsAndroid = require("react-native").PermissionsAndroid;
}
if (Platform.OS === "ios") {
    ActionSheetIOS = require("react-native").ActionSheetIOS;
}

/** 每個元件範例的外層卡片：標題 + 內容區 */
function Card({title, children}: { title: string; children: React.ReactNode }) {
    return (
        <View style={s.card}>
            <Text style={s.cardTitle}>{title}</Text>
            {children}
        </View>
    );
}

export default function Examples() {
    // 各範例用的 state
    const [input, setInput] = useState("");
    const [sw, setSw] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [darkBar, setDarkBar] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [fade] = useState(() => new Animated.Value(1));
    const drawerRef = useRef<any>(null);

    /** RefreshControl：下拉結束後模擬 800ms 結束 refreshing */
    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 800);
    };

    /** BackHandler (Android)：監聽實體返回鍵，彈 Alert；return true 表示已處理、不預設返回 */
    useEffect(() => {
        if (Platform.OS !== "android") return;
        const sub = BackHandler.addEventListener("hardwareBackPress", () => {
            Alert.alert("BackHandler", "偵測到 Android 返回鍵");
            return true;
        });
        return () => sub.remove();
    }, []);

    /** Animated：先淡出再淡入，示範 Animated.timing + sequence */
    const fadeAnim = () => {
        Animated.sequence([
            Animated.timing(fade, {useNativeDriver: true, toValue: 0.3, duration: 200}),
            Animated.timing(fade, {useNativeDriver: true, toValue: 1, duration: 200}),
        ]).start();
    };

    // 主內容：ScrollView + RefreshControl，內含各元件 Card
    const content = (
        <ScrollView
            style={s.scroll}
            contentContainerStyle={s.scrollContent}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
            }
        >
            {/* 1. View：最基礎容器，Flexbox + style */}
            <Card title="1. View">
                <View style={s.viewDemo}>
                    <Text style={s.viewDemoText}>View 容器（灰底、圓角）</Text>
                </View>
            </Card>

            {/* 2. Text：文字須包在 Text 內，可巢狀、多種 style */}
            <Card title="2. Text">
                <Text>一般文字</Text>
                <Text style={s.bold}>粗體</Text>
                <Text style={s.muted}>小字、灰色</Text>
            </Card>

            {/* 3. Image：本地 require 或 source={{ uri }}，resizeMode 控制縮放 */}
            <Card title="3. Image">
                <Image
                    source={require("@/assets/images/icon.png")}
                    style={s.img}
                    resizeMode="contain"
                />
            </Card>

            {/* 4. ImageBackground：圖當背景，子元件疊在上方；imageStyle 修飾圖片本身 */}
            <Card title="4. ImageBackground">
                <ImageBackground
                    source={require("@/assets/images/splash-icon.png")}
                    style={s.bgImg}
                    imageStyle={s.bgImgInner}
                >
                    <Text style={s.bgImgText}>疊在背景圖上的文字</Text>
                </ImageBackground>
            </Card>

            {/* 5. TextInput：受控元件 value/onChangeText，placeholder 提示文字 */}
            <Card title="5. TextInput">
                <TextInput
                    style={s.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder="輸入一些字..."
                    placeholderTextColor="#999"
                />
                {input.length > 0 && <Text>已輸入：{input}</Text>}
            </Card>

            {/* 6. ScrollView：整頁垂直捲動；內嵌水平 ScrollView 示範雙向捲動 */}
            <Card title="6. ScrollView">
                <Text style={s.hint}>此頁面即包在 ScrollView 內，可上下捲動。</Text>
                <ScrollView horizontal style={s.hScroll} showsHorizontalScrollIndicator={false}>
                    {["A", "B", "C", "D", "E"].map((x) => (
                        <View key={x} style={s.hScrollItem}>
                            <Text>{x}</Text>
                        </View>
                    ))}
                </ScrollView>
            </Card>

            {/* 7. Pressable：style 為函式時可依 pressed 等狀態切換樣式 */}
            <Card title="7. Pressable">
                <Pressable
                    style={({pressed}) => [s.pressable, pressed && s.pressablePressed]}
                    onPress={() => {
                    }}
                >
                    <Text>按我（有壓下效果）</Text>
                </Pressable>
            </Card>

            {/* 8. StyleSheet：整頁用 StyleSheet.create，見下方 const s */}
            <Card title="8. StyleSheet">
                <Text>此頁樣式皆用 StyleSheet.create 定義，便於重用與檢查。</Text>
            </Card>

            {/* 9. Button：原生按鈕，title + onPress；樣式較受限 */}
            <Card title="9. Button">
                <Button title="原生 Button" onPress={() => {
                }}/>
            </Card>

            {/* 10. Switch：value 受控，onValueChange 更新 state */}
            <Card title="10. Switch">
                <View style={s.row}>
                    <Text>開關 {sw ? "ON" : "OFF"}</Text>
                    <Switch value={sw} onValueChange={setSw}/>
                </View>
            </Card>

            {/* 11. FlatList：data + renderItem + keyExtractor；scrollEnabled=false 避免巢狀捲動 */}
            <Card title="11. FlatList">
                <FlatList
                    data={FLAT_DATA}
                    keyExtractor={(i) => i.id}
                    renderItem={({item}) => (
                        <View style={s.listItem}>
                            <Text>{item.name}</Text>
                        </View>
                    )}
                    scrollEnabled={false}
                />
            </Card>

            {/* 12. SectionList：sections 含 title/data，renderSectionHeader 繪製區段標題 */}
            <Card title="12. SectionList">
                <SectionList
                    sections={SECTIONS}
                    keyExtractor={(i) => i}
                    renderItem={({item}) => (
                        <View style={s.listItem}>
                            <Text>{item}</Text>
                        </View>
                    )}
                    renderSectionHeader={({section}) => (
                        <View style={s.sectionHeader}>
                            <Text style={s.sectionHeaderText}>{section.title}</Text>
                        </View>
                    )}
                    scrollEnabled={false}
                />
            </Card>

            {/* 13. ActivityIndicator：loading 轉圈，size / color */}
            <Card title="13. ActivityIndicator">
                <ActivityIndicator size="large" color="#0066cc"/>
            </Card>

            {/* 14. Modal：visible 控制顯示，transparent 半透明底，onRequestClose 支援返回鍵關閉 */}
            <Card title="14. Modal">
                <Button title="開啟 Modal" onPress={() => setModalVisible(true)}/>
                <Modal
                    visible={modalVisible}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <Pressable style={s.modalOverlay} onPress={() => setModalVisible(false)}>
                        <View style={s.modalBox}>
                            <Text>Modal 內容</Text>
                            <Button title="關閉" onPress={() => setModalVisible(false)}/>
                        </View>
                    </Pressable>
                </Modal>
            </Card>

            {/* 15. StatusBar：barStyle 控制狀態列文字亮/暗；按鈕切換 darkBar */}
            <Card title="15. StatusBar">
                <Button
                    title={darkBar ? "淺色狀態列" : "深色狀態列"}
                    onPress={() => setDarkBar((x) => !x)}
                />
                <Text style={s.hint}>頂端狀態列由 StatusBar 控制</Text>
            </Card>

            {/* 16. SafeAreaView：此頁最外層使用，避開劉海、Home 指示條 */}
            <Card title="16. SafeAreaView">
                <Text>此頁最外層使用 SafeAreaView，避開劉海與 Home 指示條。</Text>
            </Card>

            {/* 17. KeyboardAvoidingView：鍵盤彈起時上推內容；iOS 多用 padding，Android 多用 height */}
            <Card title="17. KeyboardAvoidingView">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={s.kav}
                >
                    <TextInput
                        style={s.input}
                        placeholder="聚焦時鍵盤會推高內容"
                        placeholderTextColor="#999"
                    />
                </KeyboardAvoidingView>
            </Card>

            {/* 18. RefreshControl：掛在 ScrollView 上，下拉觸發 onRefresh */}
            <Card title="18. RefreshControl">
                <Text>在本頁頂端下拉可觸發重新整理（ScrollView 的 RefreshControl）。</Text>
            </Card>

            {/* 19. Alert：Alert.alert(標題, 訊息, 按鈕陣列)；按鈕可設 style、onPress */}
            <Card title="19. Alert">
                <Button
                    title="顯示 Alert"
                    onPress={() =>
                        Alert.alert("標題", "訊息內容", [
                            {text: "取消", style: "cancel"},
                            {
                                text: "確定", onPress: () => {
                                }
                            },
                        ])
                    }
                />
            </Card>

            {/* 20. TouchableOpacity：按壓時 opacity 變為 activeOpacity */}
            <Card title="20. TouchableOpacity">
                <TouchableOpacity activeOpacity={0.5} onPress={() => {
                }}>
                    <View style={s.touchableBox}>
                        <Text>按下去變半透明</Text>
                    </View>
                </TouchableOpacity>
            </Card>

            {/* 21. TouchableHighlight：按壓時 underlayColor 高亮；子元件須包一層 View */}
            <Card title="21. TouchableHighlight">
                <TouchableHighlight underlayColor="#e0e0e0" onPress={() => {
                }}>
                    <View style={s.touchableBox}>
                        <Text>按下去有高亮</Text>
                    </View>
                </TouchableHighlight>
            </Card>

            {/* 22. TouchableWithoutFeedback：僅觸發 onPress，無視覺回饋；只能有一個子節點 */}
            <Card title="22. TouchableWithoutFeedback">
                <TouchableWithoutFeedback onPress={() => Alert.alert("", "有觸發，無視覺回饋")}>
                    <View style={s.touchableBox}>
                        <Text>按我（無視覺回饋）</Text>
                    </View>
                </TouchableWithoutFeedback>
            </Card>

            {/* 23. Dimensions：Dimensions.get("window") 取得螢幕寬高 */}
            <Card title="23. Dimensions">
                <Text>window: {Math.round(WIN_WIDTH)} × {Math.round(WIN_HEIGHT)}</Text>
            </Card>

            {/* 24. PixelRatio：裝置像素密度，可用於 roundToNearestPixel 等 */}
            <Card title="24. PixelRatio">
                <Text>PixelRatio.get() = {PX}</Text>
            </Card>

            {/* 25. Linking：Linking.openURL 開啟外部連結、tel、mailto 等 */}
            <Card title="25. Linking">
                <Button
                    title="開啟 https://expo.dev"
                    onPress={() => Linking.openURL("https://expo.dev")}
                />
            </Card>

            {/* 26. Animated：Animated.View 綁 opacity；fadeAnim 用 timing + sequence 做淡出淡入 */}
            <Card title="26. Animated">
                <Pressable onPress={fadeAnim}>
                    <Animated.View style={[s.animBox, {opacity: fade}]}>
                        <Text>按我觸發淡入淡出</Text>
                    </Animated.View>
                </Pressable>
            </Card>

            {/* 27. BackHandler：useEffect 中訂閱 hardwareBackPress，見上方 useEffect */}
            <Card title="27. BackHandler (Android)">
                <Text>
                    {Platform.OS === "android"
                        ? "在此頁按裝置返回鍵會觸發 Alert。"
                        : "僅 Android。"}
                </Text>
            </Card>

            {/* 28. DrawerLayoutAndroid：僅 Android；ref.openDrawer/closeDrawer 控制抽屜 */}
            {Platform.OS === "android" && DrawerLayoutAndroid && (
                <Card title="28. DrawerLayoutAndroid">
                    <Button
                        title="開啟抽屜"
                        onPress={() => drawerRef.current?.openDrawer()}
                    />
                    <Text style={s.hint}>此頁已包在 DrawerLayoutAndroid 內，從左緣滑出。</Text>
                </Card>
            )}

            {/* 29. ToastAndroid：show(訊息, SHORT|LONG)；30. PermissionsAndroid：request(權限) 回傳 granted 等 */}
            {Platform.OS === "android" && (
                <Card title="29. ToastAndroid / 30. PermissionsAndroid">
                    <Button
                        title="Show Toast"
                        onPress={() => ToastAndroid.show("Toast 訊息", ToastAndroid.SHORT)}
                    />
                    <View style={s.smallTop}/>
                    <Button
                        title="Request 相機權限"
                        onPress={async () => {
                            const v = await PermissionsAndroid.request(
                                PermissionsAndroid.PERMISSIONS.CAMERA
                            );
                            Alert.alert("權限", v === "granted" ? "已授權" : String(v));
                        }}
                    />
                </Card>
            )}

            {/* 31. ActionSheetIOS：showActionSheetWithOptions({ options, cancelButtonIndex }, callback) */}
            {Platform.OS === "ios" && ActionSheetIOS && (
                <Card title="31. ActionSheetIOS">
                    <Button
                        title="顯示 Action Sheet"
                        onPress={() =>
                            ActionSheetIOS.showActionSheetWithOptions(
                                {
                                    options: ["取消", "選項 A", "選項 B"],
                                    cancelButtonIndex: 0,
                                },
                                (i: number) => Alert.alert("", `選了 index: ${i}`)
                            )
                        }
                    />
                </Card>
            )}

            {/* 非對應平台時顯示說明 */}
            {Platform.OS !== "android" && (
                <Card title="28–30. Android 專用">
                    <Text>DrawerLayoutAndroid、ToastAndroid、PermissionsAndroid 僅 Android。</Text>
                </Card>
            )}
            {Platform.OS !== "ios" && (
                <Card title="31. iOS 專用">
                    <Text>ActionSheetIOS 僅 iOS。</Text>
                </Card>
            )}

            <View style={s.footer}>
                <Pressable onPress={() => router.back()}>
                    <Text style={s.link}>返回</Text>
                </Pressable>
            </View>
        </ScrollView>
    );

    // Android 時外層包 DrawerLayoutAndroid，抽屜從左滑出；其餘平台直接顯示 content
    const wrap = Platform.OS === "android" && DrawerLayoutAndroid ? (
        <DrawerLayoutAndroid
            ref={drawerRef}
            drawerWidth={220}
            drawerPosition="left"
            renderNavigationView={() => (
                <View style={s.drawer}>
                    <Text style={s.drawerTitle}>抽屜</Text>
                    <Pressable onPress={() => drawerRef.current?.closeDrawer()}>
                        <Text style={s.link}>關閉</Text>
                    </Pressable>
                </View>
            )}
        >
            {content}
        </DrawerLayoutAndroid>
    ) : (
        content
    );

    return (
        <SafeAreaView style={s.safe}>
            <StatusBar barStyle={darkBar ? "light-content" : "dark-content"}/>
            {wrap}
        </SafeAreaView>
    );
}

/** StyleSheet.create：集中管理樣式，利於重用與型別檢查（見 Card 8） */
const s = StyleSheet.create({
    safe: {flex: 1, backgroundColor: "#f5f5f5"},
    scroll: {flex: 1},
    scrollContent: {padding: 16, paddingBottom: 48},
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    cardTitle: {fontSize: 16, fontWeight: "600", marginBottom: 12},
    viewDemo: {
        backgroundColor: "#e0e0e0",
        borderRadius: 8,
        padding: 12,
        alignItems: "center",
    },
    viewDemoText: {fontSize: 14},
    bold: {fontWeight: "700", marginTop: 4},
    muted: {fontSize: 12, color: "#666", marginTop: 4},
    img: {width: 64, height: 64, alignSelf: "center"},
    bgImg: {height: 80, justifyContent: "center", alignItems: "center"},
    bgImgInner: {borderRadius: 8},
    bgImgText: {color: "#fff", fontWeight: "600", textShadowColor: "#000", textShadowRadius: 2},
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
    },
    hint: {fontSize: 12, color: "#666", marginBottom: 8},
    hScroll: {marginTop: 8, maxHeight: 48},
    hScrollItem: {
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: "#e0e0e0",
        marginRight: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    pressable: {
        alignSelf: "flex-start",
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: "#e0e0e0",
        borderRadius: 8,
    },
    pressablePressed: {opacity: 0.7},
    row: {flexDirection: "row", alignItems: "center", gap: 12},
    listItem: {paddingVertical: 8, paddingLeft: 4},
    sectionHeader: {backgroundColor: "#eee", padding: 8, marginTop: 4},
    sectionHeaderText: {fontWeight: "600"},
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalBox: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 24,
        minWidth: 200,
        alignItems: "center",
    },
    kav: {minHeight: 60},
    touchableBox: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        alignItems: "center",
    },
    animBox: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: "#cce5ff",
        borderRadius: 8,
        alignItems: "center",
    },
    smallTop: {height: 12},
    drawer: {flex: 1, padding: 24, paddingTop: 48, backgroundColor: "#fff"},
    drawerTitle: {fontSize: 18, fontWeight: "600", marginBottom: 16},
    footer: {alignItems: "center", paddingVertical: 24},
    link: {color: "#0066cc", fontSize: 16},
});
