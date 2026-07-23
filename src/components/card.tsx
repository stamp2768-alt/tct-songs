import { Link } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

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
  return (
    <View style={styles.list}>
      <Image source={{ uri: song.coverUrl }} style={styles.cover} />

      <View style={styles.details}>
        <Text style={styles.text}>Artist: {song.artist}</Text>
        <Text style={styles.text}>Track: {song.track}</Text>

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
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Preview</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#4477ff',
    borderRadius: 10,
    flexDirection: 'row',
    gap: 14,
    margin: 5,
    maxWidth: 640,
    padding: 10,
    width: '94%',
  },
  cover: {
    borderRadius: 8,
    height: 100,
    width: 100,
  },
  details: {
    alignItems: 'flex-start',
    flex: 1,
    gap: 6,
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 6,
    marginTop: 4,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  buttonText: {
    color: '#3156c9',
    fontWeight: 'bold',
  },
});
