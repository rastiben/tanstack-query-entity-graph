import { QueryClient } from '@tanstack/react-query';
import { EntityConfig, EntityMutationConfig } from './types';
import { updateQueries, processEntityConfig } from './utils';
import { buildGraph } from "./graph.ts";

const INVALIDATION_EVENT = 'QUERY_INVALIDATION_EVENT';

interface InvalidationEventDetail {
    affects: EntityMutationConfig[];
}

export const createMutationMiddleware = (
    queryClient: QueryClient,
    entityConfig: Record<string, EntityConfig>
) => {
    const graph = buildGraph(entityConfig);

    const handleInvalidationEvent = (event: CustomEvent<InvalidationEventDetail>) => {
        const { affects } = event.detail;
        if (affects?.length) {
            affects.forEach(entityConfig => {
                const config = processEntityConfig(entityConfig);
                updateQueries(graph, queryClient, config);
            });
        }
    };

    window.addEventListener(INVALIDATION_EVENT, handleInvalidationEvent as EventListener);

    const unsubscribe = queryClient.getMutationCache().subscribe((event) => {
        const affects = event.mutation?.options?.meta?.affects as EntityMutationConfig[] | undefined;

        if (affects?.length && event.mutation?.state.status === 'success') {
            const invalidationEvent = new CustomEvent<InvalidationEventDetail>(
                INVALIDATION_EVENT,
                {
                    detail: { affects }
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