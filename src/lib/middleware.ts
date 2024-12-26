import { QueryClient, MutationCacheNotifyEvent } from '@tanstack/react-query';
import { buildGraph } from './graph';
import { EntityConfig } from './types';
import { updateQueries } from './utils';

export const createMutationMiddleware = (
  queryClient: QueryClient,
  entityConfig: Record<string, EntityConfig>
) => {
  const graph = buildGraph(entityConfig);

  queryClient
    .getMutationCache()
    .subscribe((event: MutationCacheNotifyEvent) => {
      const entities = event.mutation?.options?.entities;

      if (entities?.length && event.mutation?.state.status === 'success') {
        updateQueries(graph, queryClient, entities);
      }
    });

  return queryClient;
};
