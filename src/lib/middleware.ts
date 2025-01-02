import { QueryClient } from '@tanstack/react-query';
import { EntityConfig, EntityMutationConfig } from './types';
import { updateQueries, processEntityConfig } from './utils';
import { buildGraph } from "./graph.ts";

const INVALIDATION_EVENT = 'QUERY_INVALIDATION_EVENT';

interface InvalidationEventDetail {
    entities: EntityMutationConfig[];
}

export const createMutationMiddleware = (
    queryClient: QueryClient,
    entityConfig: Record<string, EntityConfig>
) => {
    const graph = buildGraph(entityConfig);

    const handleInvalidationEvent = (event: CustomEvent<InvalidationEventDetail>) => {
        const { entities } = event.detail;
        if (entities?.length) {
            entities.forEach(entityConfig => {
                const { name, action } = processEntityConfig(entityConfig);
                updateQueries(graph, queryClient, name, action);
            });
        }
    };

    window.addEventListener(INVALIDATION_EVENT, handleInvalidationEvent as EventListener);

    const unsubscribe = queryClient.getMutationCache().subscribe((event) => {
        const entities = event.mutation?.options?.entities as EntityMutationConfig[] | undefined;

        if (entities?.length && event.mutation?.state.status === 'success') {
            entities.forEach(entityConfig => {
                const { name, action } = processEntityConfig(entityConfig);
                updateQueries(graph, queryClient, name, action);
            });

            const invalidationEvent = new CustomEvent<InvalidationEventDetail>(
                INVALIDATION_EVENT,
                {
                    detail: { entities }
                }
            );
            window.dispatchEvent(invalidationEvent);
        }
    });

    return {
        cleanup: () => {
            window.removeEventListener(INVALIDATION_EVENT, handleInvalidationEvent as EventListener);
            unsubscribe();
        }
    };
};