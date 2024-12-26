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
   collaborator: {
      name: 'collaborator',
      invalidate: ['calendar_event'], // These queries will be invalidated
      reset: ['profile']             // These queries will be reset
   },
   calendar_event: {
      name: 'calendar_event',
      invalidate: ['collaborator']
   }
};
```

⚠️ **Important Note**: All entity names in the config must be lowercase and use underscores for multiple words!

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
    entities: ['collaborator'] // That's it! All related queries will be handled automatically
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
useQuery(['collaborator', id], fetchCollaborator);
useQuery(['calendar_event', 'list'], fetchCalendarEvents);

// ❌ Won't be invalidated
useQuery(['calendarEvent', id], fetchCalendarEvent);
useQuery(['calendar-event', id], fetchCalendarEvent);
```

## 🎯 Examples

### Basic Usage

```typescript
// Entity configuration
const entityConfig = {
  user: {
    name: 'user',
    invalidate: ['user_post', 'user_comment'],
    reset: ['user_stats']
  },
  user_post: {
    name: 'user_post',
    invalidate: ['user_comment']
  }
};

// Query keys must match entity names
const userQuery = useQuery(['user', id], fetchUser);
const postsQuery = useQuery(['user_post', 'list'], fetchUserPosts);

// In your component
function UserProfile() {
  const mutation = useMutation({
    mutationFn: updateUser,
    entities: ['user']
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
    entities: ['team', 'team_member', 'team_project'] // All related queries will be handled
  });
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.