import { EntityConfig, Graph } from './types';

export const buildGraph = (config: Record<string, EntityConfig>): Graph => {
  return Object.values(config).reduce((graph, entity) => {
    if (!graph.has(entity.name)) {
      graph.set(entity.name, { invalidate: new Set(), reset: new Set() });
    }

    entity.invalidate?.forEach((related) =>
      graph.get(entity.name)!.invalidate.add(related)
    );

    entity.reset?.forEach((related) =>
      graph.get(entity.name)!.reset.add(related)
    );

    return graph;
  }, new Map());
};

export const getDependencies = (
  graph: Graph,
  entityName: string,
  type: 'invalidate' | 'reset',
  visited = new Set<string>()
): string[] => {
  if (visited.has(entityName)) return [];

  visited.add(entityName);
  const dependencies = Array.from(graph.get(entityName)?.[type] || []);

  dependencies.forEach((dep) => {
    getDependencies(graph, dep, type, visited).forEach((nestedDep) => {
      if (!dependencies.includes(nestedDep)) {
        dependencies.push(nestedDep);
      }
    });
  });

  return dependencies;
};
