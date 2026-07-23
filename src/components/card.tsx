import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { colors } from '@/theme/colors';

export type Song = {
  id: number;
  artist: string;
  track: string;
  coverUrl: string;
  previewUrl: string;
};

type CardProps = {
  song: Song;
};

export default function Card({ song }: CardProps) {
  useColorScheme();

  return (
    <View style={styles.card}>
      <Image
        contentFit="cover"
        source={song.coverUrl}
        style={styles.cover}
        transition={180}
      />

      <View style={styles.details}>
        <Text numberOfLines={1} selectable style={styles.track}>
          {song.track}
        </Text>
        <Text numberOfLines={1} selectable style={styles.artist}>
          {song.artist}
        </Text>

        <Link
          asChild
          href={{
            pathname: '/preview',
            params: {
              artist: song.artist,
              track: song.track,
              coverUrl: song.coverUrl,
              previewUrl: song.previewUrl,
            },
          }}>
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}>
            <Text style={styles.buttonText}>Play preview</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.separator,
    borderCurve: 'continuous',
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    boxShadow: '0 6px 18px rgba(32, 38, 58, 0.08)',
    flexDirection: 'row',
    gap: 16,
    maxWidth: 760,
    padding: 14,
    width: '92%',
  },
  cover: {
    backgroundColor: colors.artworkFallback,
    borderCurve: 'continuous',
    borderRadius: 14,
    height: 108,
    width: 108,
  },
  details: {
    alignItems: 'flex-start',
    flex: 1,
    gap: 5,
  },
  track: {
    color: colors.label,
    fontSize: 18,
    fontWeight: '800',
  },
  artist: {
    color: colors.secondaryLabel,
    fontSize: 15,
  },
  button: {
    backgroundColor: colors.primary,
    borderCurve: 'continuous',
    borderRadius: 10,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
});
