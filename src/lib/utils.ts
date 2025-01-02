import { QueryClient } from '@tanstack/react-query';
import { Graph, EntityMutationConfig, QueryKeyConfig, EntityAction } from './types';

const applyQueryAction = (
    queryClient: QueryClient,
    queryKey: unknown[],
    action: 'invalidate' | 'reset'
) => {
  if (action === 'invalidate') {
    queryClient.invalidateQueries({ queryKey });
  } else {
    queryClient.resetQueries({ queryKey });
  }
};

const processSpecificQueries = (
    queryClient: QueryClient,
    configs: QueryKeyConfig[] | undefined,
    action: 'invalidate' | 'reset'
) => {
  if (!configs?.length) return new Set<string>();

  const processedEntities = new Set<string>();

  configs.forEach(config => {
    processedEntities.add(config.entity);
    applyQueryAction(queryClient, config.queryKey, action);
  });

  return processedEntities;
};

export const updateQueries = (
    graph: Graph,
    queryClient: QueryClient,
    entityConfig: EntityAction
) => {
  const { name, action, queryKey, invalidate: specificInvalidates, reset: specificResets } = entityConfig;

  // Process specific query keys first
  const processedInvalidates = processSpecificQueries(queryClient, specificInvalidates, 'invalidate');
  const processedResets = processSpecificQueries(queryClient, specificResets, 'reset');

  // Handle the main entity with optional specific queryKey
  applyQueryAction(queryClient, queryKey || [name.toLowerCase()], action);

  // Handle related entities from graph (excluding those already processed specifically)
  if (action === 'invalidate') {
    const relatedEntities = Array.from(graph.get(name)?.invalidate || []);
    relatedEntities
        .filter(entity => !processedInvalidates.has(entity))
        .forEach(entity => applyQueryAction(queryClient, [entity.toLowerCase()], 'invalidate'));
  } else {
    const relatedEntities = Array.from(graph.get(name)?.reset || []);
    relatedEntities
        .filter(entity => !processedResets.has(entity))
        .forEach(entity => applyQueryAction(queryClient, [entity.toLowerCase()], 'reset'));
  }
};

export const processEntityConfig = (
    config: EntityMutationConfig
): EntityAction => {
  if (typeof config === 'string') {
    return { name: config, action: 'invalidate' };
  }
  return config;
};