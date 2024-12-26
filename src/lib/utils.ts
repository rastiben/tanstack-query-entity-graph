import { QueryClient } from '@tanstack/react-query';
import { Graph } from './types';
import { getDependencies } from './graph';

export const updateQueries = (
  graph: Graph,
  queryClient: QueryClient,
  entities: string[]
) => {
  entities.forEach((entityName) => {
    const invalidateDeps = getDependencies(graph, entityName, 'invalidate');
    const resetDeps = getDependencies(graph, entityName, 'reset');

    [entityName, ...invalidateDeps].forEach((entity) => {
      queryClient.invalidateQueries({
        queryKey: [entity.toLowerCase()],
      });
    });

    [entityName, ...resetDeps].forEach((entity) => {
      queryClient.resetQueries({
        queryKey: [entity.toLowerCase()],
      });
    });
  });
};
