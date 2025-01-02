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
```

## 🚀 Usage Guide

### 1. Setting Up Entity Configuration

Define relationships between your entities:

```typescript
const entityConfig = {
   user: {
      name: 'user',
      invalidate: ['post'], // Entities to invalidate when user is invalidated
      reset: ['stats']      // Entities to reset when user is reset
   },
   post: {
      name: 'post',
      invalidate: ['comment']
   }
};
```

### 2. Setting Up the Provider

```typescript
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

### 3. Use Cases

#### Basic Usage - Simple Entity Invalidation
```typescript
useMutation({
  mutationFn: updateUser,
  affects: ['user'] // Will invalidate 'user' and all its related entities
})
```

#### Specifying Action Type
```typescript
useMutation({
  mutationFn: updateUser,
  affects: [{
    name: 'user',
    action: 'reset' // 'invalidate' or 'reset'
  }]
})
```

#### Using Specific Query Key for Main Entity
```typescript
useMutation({
  mutationFn: updateUser,
  affects: [{
    name: 'user',
    action: 'invalidate',
    queryKey: userKeys.detail({ id: 123 }) // Specific query key for the main entity
  }]
})
```

#### Granular Control Over Related Entities
```typescript
useMutation({
  mutationFn: updateUser,
  affects: [{
    name: 'user',
    action: 'invalidate',
    invalidate: [
      {
        entity: 'post',
        queryKey: postKeys.list({ userId: 123 })
      }
    ],
    reset: [
      {
        entity: 'stats',
        queryKey: statsKeys.detail({ userId: 123 })
      }
    ]
  }]
})
```

#### Multiple Entities in One Mutation
```typescript
useMutation({
  mutationFn: updateTeam,
  affects: [
    { 
      name: 'team',
      action: 'invalidate'
    },
    {
      name: 'user',
      action: 'reset',
      queryKey: userKeys.list({ teamId: 123 })
    }
  ]
})
```

#### Mixed Simple and Complex Configurations
```typescript
useMutation({
  mutationFn: complexUpdate,
  affects: [
    'comment', // Uses default invalidate action
    {
      name: 'post',
      action: 'invalidate',
      queryKey: postKeys.detail({ id: 123 }),
      invalidate: [
        {
          entity: 'comment',
          queryKey: commentKeys.list({ postId: 123 })
        }
      ]
    }
  ]
})
```

## ⚠️ Important Notes

1. Entity names must be lowercase
2. Query keys must start with the entity name
3. An entity specified in the main config cannot appear in its own invalidate/reset arrays
4. Each entity's dependency is processed only one level deep

## 🔍 Query Key Format

```typescript
// ✅ Correct query key format
useQuery(['user', id], fetchUser);
useQuery(['post', 'list'], fetchPosts);

// ❌ Won't be invalidated
useQuery(['userPost', id], fetchPost);
useQuery(['user-post', id], fetchPost);
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.