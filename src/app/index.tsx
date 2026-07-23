import { fetch } from 'expo/fetch';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import Card, { type Song } from '@/components/card';

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

export default function Index() {
  const [data, setData] = useState<Song[]>([]);
  const [count, setCount] = useState(0);
  const [entity, setEntity] = useState(false);
  const [term, setTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const windowWidth = useWindowDimensions().width;

  const getData = async () => {
    const searchTerm = term.trim();

    if (!searchTerm) {
      setError('Enter text to search for first.');
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
        coverUrl: item.artworkUrl100,
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
    <View style={styles.container}>
      <Text style={[styles.title, { width: windowWidth }]}>
        Apple iTunes ({count})
      </Text>

      <View style={styles.form}>
        <Text style={styles.label}>Song:</Text>
        <TextInput
          onChangeText={setTerm}
          onSubmitEditing={getData}
          placeholder="Artist or song"
          returnKeyType="search"
          style={styles.input}
          value={term}
        />
        <Text style={styles.label}>{entity ? 'Video' : 'Audio'}</Text>
        <Switch
          onValueChange={setEntity}
          thumbColor="#4477ff"
          trackColor={{ false: 'grey', true: '#4477ff' }}
          value={entity}
        />
        <TouchableOpacity
          accessibilityRole="button"
          disabled={isLoading}
          onPress={getData}
          style={[styles.button, isLoading && styles.buttonDisabled]}>
          <Text style={styles.buttonText}>Get Data</Text>
        </TouchableOpacity>
      </View>

      {isLoading && <ActivityIndicator color="#4477ff" size="large" />}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        contentContainerStyle={styles.results}
        data={data}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          !isLoading && !error ? (
            <Text style={styles.empty}>Search results will appear here.</Text>
          ) : null
        }
        renderItem={({ item }) => <Card song={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#f7f8ff',
    flex: 1,
  },
  title: {
    backgroundColor: '#6688ff',
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    paddingVertical: 10,
    textAlign: 'center',
  },
  form: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#ddddff',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 8,
  },
  label: {
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: 'pink',
    borderColor: 'gray',
    borderRadius: 5,
    borderWidth: 1,
    margin: 10,
    minWidth: 180,
    padding: 10,
  },
  button: {
    backgroundColor: '#44bb44',
    borderRadius: 5,
    margin: 10,
    padding: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  results: {
    paddingBottom: 24,
    width: '100%',
  },
  error: {
    color: '#b00020',
    margin: 12,
    textAlign: 'center',
  },
  empty: {
    color: '#555',
    marginTop: 32,
    textAlign: 'center',
  },
});
