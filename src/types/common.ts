export interface ActionEventCallRequest<Headers, Params, Query, Body, Result> {
  headers: Headers;
  params: Params;
  body: Body;
  result: Result;
  query: Query;
}

export interface ActionCallRecord {
  // Extend the interface with other modules
  // [key: string]: ActionEventCallRequest<
  //   RecordString,
  //   RecordUnknown,
  //   Random,
  //   never
  // >;
}

export interface EventCallRecord {
  // Extend the interface with other modules
  // [key: string]: ActionEventCallRequest<
  //   RecordString,
  //   RecordUnknown,
  //   Random,
  //   never
  // >;
}

export interface TrpcQueryCallRecord {
  // Extend the interface with other modules
}

export interface TrpcMutationCallRecord {
  // Extend the interface with other modules
}
