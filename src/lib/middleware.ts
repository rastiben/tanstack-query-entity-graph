import { QueryClient } from '@tanstack/react-query';
import { EntityConfig } from './types';
import { buildGraph } from './graph.ts';
import { updateQueries } from "./utils.ts";

const INVALIDATION_EVENT = 'QUERY_INVALIDATION_EVENT';

interface InvalidationEventDetail {
    entities: string[];
}

export const createMutationMiddleware = (
    queryClient: QueryClient,
    entityConfig: Record<string, EntityConfig>
) => {
    const graph = buildGraph(entityConfig);

    const handleInvalidationEvent = (event: CustomEvent<InvalidationEventDetail>) => {
        const { entities } = event.detail;
        if (entities?.length) {
            updateQueries(graph, queryClient, entities);
        }
    };

    window.addEventListener(INVALIDATION_EVENT, handleInvalidationEvent as EventListener);

    const unsubscribe = queryClient.getMutationCache().subscribe((event) => {
        const entities = event.mutation?.options?.entities as string[] | undefined;

        if (entities?.length && event.mutation?.state.status === 'success') {
            updateQueries(graph, queryClient, entities);

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