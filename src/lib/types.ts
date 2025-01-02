export type EntityActionType = 'invalidate' | 'reset';

export type EntityAction = {
  name: string;
  action: EntityActionType;
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