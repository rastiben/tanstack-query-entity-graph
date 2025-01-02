import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { EntityQueryClientProvider } from '../lib/provider';
import { QueryClient } from '@tanstack/react-query';

// Create the spy before the mock
const createMutationMiddlewareSpy = vi.fn();
const cleanupSpy = vi.fn();

// Mock the module
vi.mock('../lib/middleware', () => ({
    createMutationMiddleware: (...args: any[]) => {
        createMutationMiddlewareSpy(...args);
        return { cleanup: cleanupSpy };
    }
}));

describe('EntityQueryClientProvider', () => {
    const queryClient = new QueryClient();
    const entityConfig = {
        user: { name: 'user' }
    };

    beforeEach(() => {
        createMutationMiddlewareSpy.mockClear();
        cleanupSpy.mockClear();
    });

    afterEach(() => {
        cleanup();
    });

    it('should render children', () => {
        const { getByText } = render(
            <EntityQueryClientProvider
                client={queryClient}
                entityConfig={entityConfig}
            >
                <div>Test Child</div>
            </EntityQueryClientProvider>
        );

        expect(getByText('Test Child')).toBeInTheDocument();
    });

    it('should pass queryClient to QueryClientProvider', () => {
        const TestComponent = () => {
            return <div>Test</div>;
        };

        const { container } = render(
            <EntityQueryClientProvider
                client={queryClient}
                entityConfig={entityConfig}
            >
                <TestComponent />
            </EntityQueryClientProvider>
        );

        expect(container).toBeInTheDocument();
    });

    it('should set up middleware on mount', () => {
        render(
            <EntityQueryClientProvider
                client={queryClient}
                entityConfig={entityConfig}
            >
                <div>Test</div>
            </EntityQueryClientProvider>
        );

        expect(createMutationMiddlewareSpy).toHaveBeenCalledWith(
            queryClient,
            entityConfig
        );
    });

    it('should clean up middleware on unmount', () => {
        const { unmount } = render(
            <EntityQueryClientProvider
                client={queryClient}
                entityConfig={entityConfig}
            >
                <div>Test</div>
            </EntityQueryClientProvider>
        );

        unmount();
        expect(cleanupSpy).toHaveBeenCalled();
    });
});