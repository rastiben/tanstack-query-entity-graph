export type QueryKeyConfig = {
  entity: string;
  queryKey: unknown[];
};

export type EntityActionType = 'invalidate' | 'reset';

export type EntityAction = {
  name: string;
  action: EntityActionType;
  queryKey?: unknown[];  // Query key for the main entity
  invalidate?: QueryKeyConfig[];  // Only for related entities
  reset?: QueryKeyConfig[];      // Only for related entities
};

export type EntityConfig = {
  name: string;
  invalidate?: string[];
  reset?: string[];
};

export type Graph = Map<
    string,
    { invalidate: Set<string>; reset: Set<string> }
>;

export type EntityMutationConfig = string | EntityAction;
