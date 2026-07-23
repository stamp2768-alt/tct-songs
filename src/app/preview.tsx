import { useLocalSearchParams } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default function Preview() {
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

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Artist: {artist}</Text>
      <Text style={styles.text}>Song: {track}</Text>

      {coverUrl ? (
        <Image source={{ uri: coverUrl }} style={styles.cover} />
      ) : null}

      {previewUrl ? (
        <VideoView
          allowsPictureInPicture
          fullscreenOptions={{ enable: true }}
          nativeControls
          player={player}
          style={[styles.video, { width: Math.min(windowWidth - 20, 720) }]}
        />
      ) : (
        <Text style={styles.error}>A preview is not available for this item.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#4477ff',
    borderRadius: 20,
    flex: 1,
    padding: 16,
  },
  text: {
    color: 'white',
    fontSize: 18,
    marginBottom: 6,
  },
  cover: {
    borderRadius: 10,
    height: 100,
    margin: 10,
    width: 100,
  },
  video: {
    backgroundColor: 'black',
    borderRadius: 12,
    height: 300,
    margin: 10,
    padding: 10,
  },
  error: {
    color: 'white',
    fontWeight: '600',
    margin: 12,
  },
});
