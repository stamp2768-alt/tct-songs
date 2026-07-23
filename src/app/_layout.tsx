import { Stack } from 'expo-router/stack';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Apple iTunes' }} />
      <Stack.Screen name="preview" options={{ title: 'Preview' }} />
    </Stack>
  );
}
