import { fetch } from 'expo/fetch';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';

import Card, { type Song } from '@/components/card';
import { colors } from '@/theme/colors';

type ItunesResult = {
  trackId: number;
  artistName: string;
  trackName: string;
  artworkUrl100: string;
  previewUrl: string;
};

type ItunesResponse = {
  resultCount: number;
  results: ItunesResult[];
};

function highResolutionArtwork(url: string) {
  return url.replace(/\/100x100bb\.(jpg|png)$/, '/600x600bb.$1');
}

export default function Index() {
  useColorScheme();
  const { width } = useWindowDimensions();
  const isCompact = width < 620;
  const [data, setData] = useState<Song[]>([]);
  const [count, setCount] = useState(0);
  const [entity, setEntity] = useState(false);
  const [term, setTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getData = async () => {
    const searchTerm = term.trim();

    if (!searchTerm) {
      setError('Enter an artist or song to search.');
      return;
    }

    setData([]);
    setCount(0);
    setError('');
    setIsLoading(true);

    try {
      const trackType = entity ? 'musicVideo' : 'musicTrack';
      const url =
        `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}` +
        `&entity=${trackType}&limit=5`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const json = (await response.json()) as ItunesResponse;
      const songs = json.results.map((item) => ({
        id: item.trackId,
        artist: item.artistName,
        track: item.trackName,
        coverUrl: highResolutionArtwork(item.artworkUrl100),
        previewUrl: item.previewUrl,
      }));

      setData(songs);
      setCount(json.resultCount);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to search the iTunes catalog.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FlatList
      contentContainerStyle={styles.page}
      contentInsetAdjustmentBehavior="automatic"
      data={data}
      keyExtractor={(item) => item.id.toString()}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View style={styles.headerContent}>
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>TCT SONGS</Text>
            <Text style={styles.heading}>Find your next favorite track</Text>
            <Text style={styles.subtitle}>
              Search Apple Music previews by artist or song title.
            </Text>
          </View>

          <View style={styles.searchPanel}>
            <Text style={styles.inputLabel}>What do you want to hear?</Text>
            <View style={[styles.form, isCompact && styles.formCompact]}>
              <TextInput
                accessibilityLabel="Artist or song"
                onChangeText={setTerm}
                onSubmitEditing={getData}
                placeholder="Try Adele, Bruno Mars..."
                placeholderTextColor="#8b91a3"
                returnKeyType="search"
                style={styles.input}
                value={term}
              />

              <View style={styles.mediaToggle}>
                <View>
                  <Text style={styles.toggleTitle}>
                    {entity ? 'Music video' : 'Audio track'}
                  </Text>
                  <Text style={styles.toggleHint}>Choose result type</Text>
                </View>
                <Switch
                  accessibilityLabel="Toggle music video results"
                  onValueChange={setEntity}
                  thumbColor={colors.white}
                  trackColor={{ false: '#a8aec0', true: '#7676e8' }}
                  value={entity}
                />
              </View>

              <Pressable
                accessibilityRole="button"
                disabled={isLoading}
                onPress={getData}
                style={({ pressed }) => [
                  styles.searchButton,
                  pressed && styles.buttonPressed,
                  isLoading && styles.buttonDisabled,
                ]}>
                {isLoading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.searchButtonText}>Search</Text>
                )}
              </Pressable>
            </View>
          </View>

          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>Results</Text>
            <Text style={styles.count}>{count} found</Text>
          </View>

          {error ? (
            <Text selectable style={styles.error}>
              {error}
            </Text>
          ) : null}
        </View>
      }
      ListEmptyComponent={
        !isLoading && !error ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>♫</Text>
            <Text style={styles.emptyTitle}>Ready when you are</Text>
            <Text style={styles.emptyText}>
              Enter a search above to discover audio and video previews.
            </Text>
          </View>
        ) : null
      }
      renderItem={({ item }) => <Card song={item} />}
    />
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.background,
    flexGrow: 1,
    gap: 12,
    paddingBottom: 32,
  },
  headerContent: {
    gap: 18,
  },
  hero: {
    alignItems: 'center',
    backgroundColor: '#29264f',
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 36,
  },
  eyebrow: {
    color: '#b9b7ff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2.2,
  },
  heading: {
    color: colors.white,
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: '#d8d7ef',
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 520,
    textAlign: 'center',
  },
  searchPanel: {
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.separator,
    borderCurve: 'continuous',
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    boxShadow: '0 10px 30px rgba(34, 38, 60, 0.10)',
    gap: 10,
    maxWidth: 760,
    padding: 18,
    width: '92%',
  },
  inputLabel: {
    color: colors.label,
    fontSize: 15,
    fontWeight: '700',
  },
  form: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  formCompact: {
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.separator,
    borderCurve: 'continuous',
    borderRadius: 12,
    borderWidth: 1,
    color: colors.label,
    flex: 1,
    fontSize: 16,
    minHeight: 48,
    minWidth: 220,
    paddingHorizontal: 14,
  },
  mediaToggle: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderCurve: 'continuous',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    minHeight: 48,
    paddingHorizontal: 12,
  },
  toggleTitle: {
    color: colors.label,
    fontSize: 14,
    fontWeight: '700',
  },
  toggleHint: {
    color: colors.secondaryLabel,
    fontSize: 11,
  },
  searchButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderCurve: 'continuous',
    borderRadius: 12,
    justifyContent: 'center',
    minHeight: 48,
    minWidth: 108,
    paddingHorizontal: 20,
  },
  searchButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  resultsHeader: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: 760,
    paddingHorizontal: 4,
    width: '92%',
  },
  resultsTitle: {
    color: colors.label,
    fontSize: 20,
    fontWeight: '800',
  },
  count: {
    color: colors.secondaryLabel,
    fontSize: 14,
    fontVariant: ['tabular-nums'],
  },
  error: {
    alignSelf: 'center',
    color: colors.danger,
    maxWidth: 760,
    paddingHorizontal: 18,
    textAlign: 'center',
    width: '92%',
  },
  emptyState: {
    alignItems: 'center',
    alignSelf: 'center',
    gap: 8,
    maxWidth: 420,
    paddingHorizontal: 24,
    paddingVertical: 38,
  },
  emptyIcon: {
    color: colors.primary,
    fontSize: 44,
  },
  emptyTitle: {
    color: colors.label,
    fontSize: 19,
    fontWeight: '800',
  },
  emptyText: {
    color: colors.secondaryLabel,
    lineHeight: 21,
    textAlign: 'center',
  },
});
