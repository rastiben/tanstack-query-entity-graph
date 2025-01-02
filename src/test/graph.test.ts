import { describe, it, expect } from 'vitest';
import { buildGraph } from '../lib/graph';
import type { EntityConfig } from '../lib/types';

describe('buildGraph', () => {
    it('should create an empty graph for empty config', () => {
        const graph = buildGraph({});
        expect(graph.size).toBe(0);
    });

    it('should create graph with single entity without relationships', () => {
        const config: Record<string, EntityConfig> = {
            user: {
                name: 'user'
            }
        };
        const graph = buildGraph(config);
        expect(graph.size).toBe(1);
        expect(graph.get('user')).toEqual({
            invalidate: new Set(),
            reset: new Set()
        });
    });

    it('should create graph with invalidate relationships', () => {
        const config: Record<string, EntityConfig> = {
            user: {
                name: 'user',
                invalidate: ['post']
            }
        };
        const graph = buildGraph(config);
        expect(graph.get('user')?.invalidate).toEqual(new Set(['post']));
        expect(graph.get('user')?.reset).toEqual(new Set());
    });

    it('should create graph with reset relationships', () => {
        const config: Record<string, EntityConfig> = {
            user: {
                name: 'user',
                reset: ['stats']
            }
        };
        const graph = buildGraph(config);
        expect(graph.get('user')?.invalidate).toEqual(new Set());
        expect(graph.get('user')?.reset).toEqual(new Set(['stats']));
    });

    it('should create graph with both invalidate and reset relationships', () => {
        const config: Record<string, EntityConfig> = {
            user: {
                name: 'user',
                invalidate: ['post'],
                reset: ['stats']
            }
        };
        const graph = buildGraph(config);
        expect(graph.get('user')?.invalidate).toEqual(new Set(['post']));
        expect(graph.get('user')?.reset).toEqual(new Set(['stats']));
    });

    it('should create graph with multiple entities', () => {
        const config: Record<string, EntityConfig> = {
            user: {
                name: 'user',
                invalidate: ['post'],
                reset: ['stats']
            },
            post: {
                name: 'post',
                invalidate: ['comment']
            }
        };
        const graph = buildGraph(config);
        expect(graph.size).toBe(2);
        expect(graph.get('user')?.invalidate).toEqual(new Set(['post']));
        expect(graph.get('user')?.reset).toEqual(new Set(['stats']));
        expect(graph.get('post')?.invalidate).toEqual(new Set(['comment']));
    });
});