# TanStack Query Entity Graph 🎯

A smart cache invalidation system for TanStack Query that automatically manages query invalidations based on entity relationships.

[![npm version](https://badge.fury.io/js/tanstack-query-entity-graph.svg)](https://badge.fury.io/js/tanstack-query-entity-graph)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Features

- 📊 Declarative entity relationships
- 🔄 Automatic cache invalidation
- 🧹 Smart cache reset
- 🎯 Type-safe entity configuration
- 🔗 Deep dependency resolution
- 🎨 Simple and intuitive API

## 📦 Installation

```bash
npm install tanstack-query-entity-graph
# or
yarn add tanstack-query-entity-graph
# or
pnpm add tanstack-query-entity-graph
```

## 🚀 Quick Start

### 1. Define your entity relationships

```typescript
const entityConfig = {
  Collaborator: {
    name: 'Collaborator',
    invalidate: ['CalendarEvent'], // These queries will be invalidated
    reset: ['Profile']            // These queries will be reset
  },
  CalendarEvent: {
    name: 'CalendarEvent',
    invalidate: ['Collaborator']
  }
};
```

### 2. Set up the middleware

```typescript
import { QueryClient } from '@tanstack/react-query';
import { createMutationMiddleware } from 'tanstack-query-entity-graph';

const queryClient = new QueryClient();

// Initialize the middleware with your entity config
createMutationMiddleware(queryClient, entityConfig);
```

### 3. Use in your mutations

```typescript
function useUpdateCollaborator() {
  return useMutation({
    mutationFn: updateCollaborator,
    entities: ['Collaborator'] // That's it! All related queries will be handled automatically
  });
}
```

## 🔍 How It Works

The library creates a dependency graph from your entity configuration and automatically manages cache invalidation when mutations occur:

1. When a mutation succeeds, the middleware checks the `entities` array in the mutation options
2. For each entity, it:
    - Traverses the dependency graph to find all related entities
    - Invalidates queries according to the `invalidate` configuration
    - Resets queries according to the `reset` configuration
3. TanStack Query then handles the revalidation of the invalidated queries

## 📚 API Reference

### EntityConfig

```typescript
interface EntityConfig {
  name: string;
  invalidate?: string[]; // Entities whose queries should be invalidated
  reset?: string[];      // Entities whose queries should be reset
}
```

### createMutationMiddleware

```typescript
function createMutationMiddleware(
  queryClient: QueryClient,
  entityConfig: Record<string, EntityConfig>
): QueryClient;
```

### Mutation Options

The library extends TanStack Query's `UseMutationOptions` with:

```typescript
interface UseMutationOptions {
  entities?: string[]; // Entities affected by this mutation
}
```

## 🎯 Examples

### Basic Usage

```typescript
// Entity configuration
const entityConfig = {
  User: {
    name: 'User',
    invalidate: ['Post', 'Comment'],
    reset: ['UserStats']
  },
  Post: {
    name: 'Post',
    invalidate: ['Comment']
  }
};

// In your component
function UserProfile() {
  const mutation = useMutation({
    mutationFn: updateUser,
    entities: ['User']
  });

  return (
    <button onClick={() => mutation.mutate(userData)}>
      Update Profile
    </button>
  );
}
```

### Multiple Entities

```typescript
function TeamManager() {
  const mutation = useMutation({
    mutationFn: updateTeam,
    entities: ['Team', 'User', 'Project'] // All related queries will be handled
  });
}
```

## 🔧 Configuration

### QueryClient Options

The middleware works with your existing QueryClient configuration:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
    },
  },
});

createMutationMiddleware(queryClient, entityConfig);
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- [TanStack Query](https://tanstack.com/query/latest) for the amazing query management library
- The React community for their continuous support and feedback

## 🐛 Troubleshooting

### Common Issues

#### Query not invalidating?

Make sure:
1. The entity name matches exactly (case-sensitive)
2. The entity is properly configured in entityConfig
3. The mutation status is 'success'

#### Type errors with entities?

Make sure:
1. You're using TypeScript 4.x or later
2. You've imported the types from the package
3. Your entity names match the configuration

## 📈 Performance

The library is designed to be performant by default:

- Dependency graph is built once at initialization
- Efficient graph traversal for dependency resolution
- Batched query invalidations
- Minimal runtime overhead

## 🗺 Roadmap

- [ ] Conditional invalidations
- [ ] Query key pattern matching
- [ ] Development tools and debugging
- [ ] Performance monitoring
- [ ] Offline support
- [ ] Migration helpers

## 📚 Further Reading

- [Blog Post: Smart Cache Invalidation](https://your-blog-post-url)
- [Cache Management Best Practices](https://your-best-practices-url)
- [API Documentation](https://your-api-docs-url)