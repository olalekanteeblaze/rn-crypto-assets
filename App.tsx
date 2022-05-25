import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import GlobalStateContextProvider from './hooks/useGlobalState';
import Navigation from './navigation';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const queryClient = new QueryClient();
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <GlobalStateContextProvider>
          <QueryClientProvider client={queryClient}>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
          </QueryClientProvider>
        </GlobalStateContextProvider>
      </SafeAreaProvider>
    );
  }
}
