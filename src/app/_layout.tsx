import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="preview"
        options={{
          contentStyle: { backgroundColor: '#17162d' },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#17162d' },
          headerTintColor: '#ffffff',
          title: 'Now Playing',
        }}
      />
    </Stack>
  );
}
