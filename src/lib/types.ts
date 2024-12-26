export type EntityConfig = {
  name: string;
  invalidate?: string[];
  reset?: string[];
};

export type Graph = Map<
  string,
  { invalidate: Set<string>; reset: Set<string> }
>;