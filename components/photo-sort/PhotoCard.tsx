import * as MediaLibrary from "expo-media-library";
import { Asset } from "expo-media-library";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

type PhotoCardProps = {
  asset: Asset;
  onKeep: () => void;
  onTrash: () => void;
};

export default function PhotoCard({ asset, onKeep, onTrash }: PhotoCardProps) {
  const [displayUri, setDisplayUri] = useState<string | null>(null);

  useEffect(() => {
    setDisplayUri(null);
    const uri = asset.uri;
    if (uri.startsWith("ph://") || uri.startsWith("assets-library://")) {
      MediaLibrary.getAssetInfoAsync(asset.id, {
        shouldDownloadFromNetwork: true,
      })
        .then((info) => {
          let u = info.localUri ?? uri;
          if (u && Platform.OS === "ios" && u.includes("#")) {
            u = u.split("#")[0];
          }
          setDisplayUri(u);
        })
        .catch(() => setDisplayUri(uri));
    } else {
      setDisplayUri(uri);
    }
  }, [asset]);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY * 0.3;
    })
    .onEnd((e) => {
      const goRight = translateX.value > SWIPE_THRESHOLD;
      const goLeft = translateX.value < -SWIPE_THRESHOLD;

      if (goRight) {
        translateX.value = withSpring(SCREEN_WIDTH, { damping: 15 }, () => {
          runOnJS(onKeep)();
        });
      } else if (goLeft) {
        translateX.value = withSpring(-SCREEN_WIDTH, { damping: 15 }, () => {
          runOnJS(onTrash)();
        });
      } else {
        translateX.value = withSpring(0, { damping: 15 });
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rot = (translateX.value / SCREEN_WIDTH) * 15;
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rot}deg` },
      ],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        className="absolute h-[70%] w-[90%] overflow-hidden rounded-2xl bg-gray-200"
        style={[
          animatedStyle,
          {
            left: "5%",
            top: "15%",
          },
        ]}
      >
        {displayUri ? (
          <Image
            source={{ uri: displayUri }}
            style={{ flex: 1, width: "100%" }}
            resizeMode="cover"
          />
        ) : (
          <View className="h-full w-full items-center justify-center bg-gray-200">
            <ActivityIndicator size="large" />
          </View>
        )}
      </Animated.View>
    </GestureDetector>
  );
}
