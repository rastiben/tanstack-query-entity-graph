declare module '@tanstack/react-query' {
  interface UseMutationOptions {
    entities?: string[];
  }

  interface MutationCacheNotifyEvent {
    mutation: {
      options: {
        entities?: string[];
      };
    };
  }
}