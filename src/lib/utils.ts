import { QueryClient } from '@tanstack/react-query';
import { Graph, EntityMutationConfig } from './types';

export const updateQueries = (
    graph: Graph,
    queryClient: QueryClient,
    entityName: string,
    action: 'invalidate' | 'reset'
) => {
  // Get related entities for this action type
  const relatedEntities = graph.get(entityName)?.[action] || new Set();

  // Apply action to the entity itself and its related entities
  [entityName, ...Array.from(relatedEntities)].forEach((entity) => {
    if (action === 'invalidate') {
      queryClient.invalidateQueries({ queryKey: [entity.toLowerCase()] });
    } else {
      queryClient.resetQueries({ queryKey: [entity.toLowerCase()] });
    }
  });
};

export const processEntityConfig = (
    config: EntityMutationConfig
): { name: string; action: 'invalidate' | 'reset' } => {
  if (typeof config === 'string') {
    return { name: config, action: 'invalidate' }; // Default to invalidate for string configs
  }
  return config;
};