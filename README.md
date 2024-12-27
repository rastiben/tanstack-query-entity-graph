# TanStack Query Entity Graph 🎯

A smart cache invalidation system for TanStack Query that automatically manages query invalidations based on entity relationships.

[![npm version](https://badge.fury.io/js/tanstack-query-entity-graph.svg)](https://badge.fury.io/js/tanstack-query-entity-graph)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Features

- 📊 Declarative entity relationships
- 🔄 Automatic cache invalidation
- 🧹 Smart cache reset
- 🎯 Type-safe entity configuration
- 🔗 Direct dependency resolution
- 🎨 Simple and intuitive API
- 🔀 Cross-root invalidation support

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
  user: {
    name: 'user',
    invalidate: ['user_post'], // These queries will be invalidated
    reset: ['profile']         // These queries will be reset
  },
  user_post: {
    name: 'user_post',
    invalidate: ['user']
  }
};
```

⚠️ **Important Note**: All entity names in the config must be lowercase and use underscores for multiple words!

### 2. Set up the provider

```typescript
import { QueryClient } from '@tanstack/react-query';
import { EntityQueryClientProvider } from 'tanstack-query-entity-graph';

const queryClient = new QueryClient();

function App() {
  return (
    <EntityQueryClientProvider
      client={queryClient}
      entityConfig={entityConfig}
    >
      <YourApp />
    </EntityQueryClientProvider>
  );
}
```

### 3. Use in your mutations

```typescript
function useUpdateUser() {
  return useMutation({
    mutationFn: updateUser,
    entities: ['user'] // That's it! All related queries will be handled automatically
  });
}
```

## 🔍 How It Works

The library creates a dependency graph from your entity configuration and automatically manages cache invalidation when mutations occur:

1. When a mutation succeeds, the middleware checks the `entities` array in the mutation options
2. For each entity, it:
   - Invalidates the entity itself
   - Finds all directly related entities from the dependency graph
   - Invalidates those related entities according to the `invalidate` configuration
   - Resets related entities according to the `reset` configuration
3. TanStack Query then handles the revalidation of all invalidated queries

For example, with this configuration:
```typescript
const entityConfig = {
  user: {
    name: 'user',
    invalidate: ['user_post', 'comment'] // Must explicitly declare all entities to invalidate
  },
  user_post: {
    name: 'user_post',
    invalidate: ['comment'] // Will only invalidate when user_post is directly mutated
  }
};
```

When you trigger a mutation with `entities: ['user']`, it will:
- Invalidate 'user' queries (the entity itself)
- Invalidate 'user_post' queries (because it's in user's invalidate array)
- Invalidate 'comment' queries (because it's in user's invalidate array)

⚠️ **Important Notes**:
1. Entity names must be lowercase with underscores for multiple words
2. Your query keys must start with the entity name (matching the exact format)

```typescript
// ✅ Correct query key format
useQuery(['user', id], fetchUser);
useQuery(['user_post', 'list'], fetchUserPosts);

// ❌ Won't be invalidated
useQuery(['userPost', id], fetchUserPost);
useQuery(['user-post', id], fetchUserPost);
```

## 🔀 Cross-Root Support

When using multiple React roots (e.g., with React on Rails), query invalidation works automatically across different QueryClient instances:

```typescript
// Root 1
function ProfileRoot() {
  return (
    <EntityQueryClientProvider
      client={queryClient1}
      entityConfig={entityConfig}
    >
      <Profile />
    </EntityQueryClientProvider>
  );
}

// Root 2
function DashboardRoot() {
  return (
    <EntityQueryClientProvider
      client={queryClient2}
      entityConfig={entityConfig}
    >
      <Dashboard />
    </EntityQueryClientProvider>
  );
}
```

The library will automatically:
1. Invalidate queries in all roots when a mutation occurs
2. Clean up event listeners when components unmount
3. Handle cross-root communication seamlessly

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.