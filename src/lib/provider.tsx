import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useEffect } from 'react';
import { EntityConfig } from './types';
import { createMutationMiddleware } from './middleware';

type EntityQueryClientProviderProps = PropsWithChildren & {
    client: QueryClient;
    entityConfig: Record<string, EntityConfig>;
}

export const EntityQueryClientProvider = ({
      children,
      client,
      entityConfig,
  }: EntityQueryClientProviderProps) => {
    useEffect(() => {
        const handler = createMutationMiddleware(client, entityConfig);

        return () => {
            handler.cleanup();
        };
    }, [client, entityConfig]);

    return (
        <QueryClientProvider client={client}>
            {children}
        </QueryClientProvider>
    );
};