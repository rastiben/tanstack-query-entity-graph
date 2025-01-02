import { describe, it, expect, vi } from 'vitest';
import { updateQueries, processEntityConfig } from '../lib/utils';
import type { Graph, EntityAction } from '../lib/types';

describe('processEntityConfig', () => {
    it('should process string config to default invalidate action', () => {
        const result = processEntityConfig('user');
        expect(result).toEqual({
            name: 'user',
            action: 'invalidate'
        });
    });

    it('should pass through full config unchanged', () => {
        const config: EntityAction = {
            name: 'user',
            action: 'reset',
            queryKey: ['user', { id: 1 }]
        };
        const result = processEntityConfig(config);
        expect(result).toEqual(config);
    });
});

describe('updateQueries', () => {
    const queryClient = {
        invalidateQueries: vi.fn(),
        resetQueries: vi.fn()
    };

    beforeEach(() => {
        queryClient.invalidateQueries.mockReset();
        queryClient.resetQueries.mockReset();
    });

    it('should invalidate main entity with default query key', () => {
        const graph = new Map() as Graph;
        updateQueries(graph, queryClient as any, {
            name: 'user',
            action: 'invalidate'
        });

        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
            queryKey: ['user']
        });
    });

    it('should use custom query key when provided', () => {
        const graph = new Map() as Graph;
        const queryKey = ['user', { id: 123 }];
        updateQueries(graph, queryClient as any, {
            name: 'user',
            action: 'invalidate',
            queryKey
        });

        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
            queryKey
        });
    });

    it('should handle invalidate dependencies', () => {
        const graph = new Map([
            ['user', { invalidate: new Set(['post']), reset: new Set() }]
        ]) as Graph;

        updateQueries(graph, queryClient as any, {
            name: 'user',
            action: 'invalidate'
        });

        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
            queryKey: ['user']
        });
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
            queryKey: ['post']
        });
    });

    it('should handle reset dependencies', () => {
        const graph = new Map([
            ['user', { invalidate: new Set(), reset: new Set(['stats']) }]
        ]) as Graph;

        updateQueries(graph, queryClient as any, {
            name: 'user',
            action: 'reset'
        });

        expect(queryClient.resetQueries).toHaveBeenCalledWith({
            queryKey: ['user']
        });
        expect(queryClient.resetQueries).toHaveBeenCalledWith({
            queryKey: ['stats']
        });
    });

    it('should handle specific invalidations', () => {
        const graph = new Map() as Graph;
        updateQueries(graph, queryClient as any, {
            name: 'user',
            action: 'invalidate',
            invalidate: [
                { entity: 'post', queryKey: ['post', { userId: 123 }] }
            ]
        });

        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
            queryKey: ['user']
        });
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
            queryKey: ['post', { userId: 123 }]
        });
    });

    it('should handle specific resets', () => {
        const graph = new Map() as Graph;
        updateQueries(graph, queryClient as any, {
            name: 'user',
            action: 'reset',
            reset: [
                { entity: 'stats', queryKey: ['stats', { userId: 123 }] }
            ]
        });

        expect(queryClient.resetQueries).toHaveBeenCalledWith({
            queryKey: ['user']
        });
        expect(queryClient.resetQueries).toHaveBeenCalledWith({
            queryKey: ['stats', { userId: 123 }]
        });
    });
});