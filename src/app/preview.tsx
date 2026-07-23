import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import {
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';

import { colors } from '@/theme/colors';

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default function Preview() {
  useColorScheme();
  const windowWidth = useWindowDimensions().width;
  const params = useLocalSearchParams<{
    artist?: string | string[];
    track?: string | string[];
    coverUrl?: string | string[];
    previewUrl?: string | string[];
  }>();
  const artist = first(params.artist) ?? 'Unknown artist';
  const track = first(params.track) ?? 'Unknown track';
  const coverUrl = first(params.coverUrl);
  const previewUrl = first(params.previewUrl);
  const player = useVideoPlayer(previewUrl ?? null, (playerInstance) => {
    playerInstance.loop = true;
    playerInstance.play();
  });
  const playerWidth = Math.min(windowWidth - 32, 720);

  return (
    <ScrollView
      contentContainerStyle={styles.page}
      contentInsetAdjustmentBehavior="automatic">
      <View style={styles.previewCard}>
        {coverUrl ? (
          <Image
            contentFit="cover"
            source={coverUrl}
            style={styles.cover}
            transition={180}
          />
        ) : null}

        <View style={styles.metadata}>
          <Text selectable style={styles.track}>
            {track}
          </Text>
          <Text selectable style={styles.artist}>
            {artist}
          </Text>
          <Text style={styles.nowPlaying}>NOW PLAYING PREVIEW</Text>
        </View>
      </View>

      {previewUrl ? (
        <VideoView
          allowsPictureInPicture
          fullscreenOptions={{ enable: true }}
          nativeControls
          player={player}
          style={[styles.video, { width: playerWidth }]}
        />
      ) : (
        <Text selectable style={styles.error}>
          A preview is not available for this item.
        </Text>
      )}

      <Text style={styles.helper}>
        Use the player controls to pause, seek, or enter fullscreen.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    alignItems: 'center',
    backgroundColor: '#17162d',
    flexGrow: 1,
    gap: 22,
    padding: 16,
    paddingTop: 28,
  },
  previewCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 18,
    maxWidth: 720,
    width: '100%',
  },
  cover: {
    backgroundColor: colors.artworkFallback,
    borderCurve: 'continuous',
    borderRadius: 20,
    boxShadow: '0 14px 36px rgba(0, 0, 0, 0.30)',
    height: 142,
    width: 142,
  },
  metadata: {
    flex: 1,
    gap: 6,
  },
  track: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '800',
  },
  artist: {
    color: '#c8c6e8',
    fontSize: 17,
  },
  nowPlaying: {
    color: '#9692ff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    paddingTop: 8,
  },
  video: {
    backgroundColor: '#050508',
    borderCurve: 'continuous',
    borderRadius: 18,
    boxShadow: '0 18px 45px rgba(0, 0, 0, 0.32)',
    height: 360,
  },
  error: {
    color: '#ffb7c0',
    fontWeight: '700',
    padding: 18,
    textAlign: 'center',
  },
  helper: {
    color: '#a8a5c3',
    fontSize: 13,
    textAlign: 'center',
  },
});
