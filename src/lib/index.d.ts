declare module '@tanstack/react-query' {
  interface UseMutationOptions {
    affects?: string[];
  }

  interface MutationCacheNotifyEvent {
    mutation: {
      options: {
        affects?: string[];
      };
    };
  }
}