import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { createMutationMiddleware } from '../lib/middleware';
import type { EntityConfig } from '../lib/types';

describe('createMutationMiddleware', () => {
    const queryClient = {
        getMutationCache: vi.fn(),
        invalidateQueries: vi.fn(),
        resetQueries: vi.fn()
    };

    const mutationCache = {
        subscribe: vi.fn()
    };

    beforeEach(() => {
        vi.resetAllMocks();
        queryClient.getMutationCache.mockReturnValue(mutationCache);

        // Mocks des méthodes de window directement
        window.addEventListener = vi.fn() as any;
        window.removeEventListener = vi.fn() as any;
        window.dispatchEvent = vi.fn() as any;
    });

    it('should subscribe to mutation cache', () => {
        const entityConfig: Record<string, EntityConfig> = {
            user: { name: 'user' }
        };

        createMutationMiddleware(queryClient as any, entityConfig);

        expect(queryClient.getMutationCache).toHaveBeenCalled();
        expect(mutationCache.subscribe).toHaveBeenCalled();
    });

    it('should add event listener for cross-root communication', () => {
        const entityConfig: Record<string, EntityConfig> = {
            user: { name: 'user' }
        };

        createMutationMiddleware(queryClient as any, entityConfig);

        expect(window.addEventListener).toHaveBeenCalledWith(
            'QUERY_INVALIDATION_EVENT',
            expect.any(Function)
        );
    });

    it('should handle mutation success', () => {
        const entityConfig: Record<string, EntityConfig> = {
            user: { name: 'user' }
        };

        let subscribeCallback: any;
        mutationCache.subscribe.mockImplementation((callback) => {
            subscribeCallback = callback;
            return () => {};
        });

        createMutationMiddleware(queryClient as any, entityConfig);

        subscribeCallback({
            mutation: {
                options: {
                    meta: { affects: ['user'] }
                },
                state: {
                    status: 'success'
                }
            }
        });

        expect(window.dispatchEvent).toHaveBeenCalledWith(
            expect.any(CustomEvent)
        );
    });

    it('should handle cross-root events', () => {
        const entityConfig: Record<string, EntityConfig> = {
            user: { name: 'user' }
        };

        let eventListener: any;

        (window.addEventListener as Mock).mockImplementation((_: any, listener: any) => {
            eventListener = listener;
        });

        createMutationMiddleware(queryClient as any, entityConfig);

        const customEvent = new CustomEvent('QUERY_INVALIDATION_EVENT', {
            detail: {
                affects: ['user']
            }
        });

        eventListener(customEvent);

        expect(queryClient.invalidateQueries).toHaveBeenCalled();
    });

    it('should clean up properly', () => {
        const entityConfig: Record<string, EntityConfig> = {
            user: { name: 'user' }
        };

        const unsubscribe = vi.fn();
        mutationCache.subscribe.mockReturnValue(unsubscribe);

        const middleware = createMutationMiddleware(queryClient as any, entityConfig);
        middleware.cleanup();

        expect(unsubscribe).toHaveBeenCalled();
        expect(window.removeEventListener).toHaveBeenCalledWith(
            'QUERY_INVALIDATION_EVENT',
            expect.any(Function)
        );
    });
});