// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Random = any;

export type RecordUnknown = Record<string, unknown>;

export type RecordString = Record<string, string>;

export interface ActionEventCallRequest<Headers, Params, Query, Body, Result> {
  headers: Headers;
  params: Params;
  body: Body;
  result: Result;
  query: Query;
}

export interface TrpcQueryCallRecord {
  // Extend the interface with other modules
}

export interface TrpcMutationCallRecord {
  // Extend the interface with other modules
}

export interface ActionCallRecord {
  // Extend the interface with other modules
}

export interface EventCallRecord {
  // Extend the interface with other modules
}
