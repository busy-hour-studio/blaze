// deno-lint-ignore-file no-empty-interface

export interface BlazeCallRequest<Headers, Params, Query, Body, Result> {
  headers: Headers;
  params: Params;
  body: Body;
  result: Result;
  query: Query;
}

export interface BlazeActionCallRecord {
  // Extend the interface with other modules
  // [key: string]: BlazeCallRequest<
  //   RecordString,
  //   RecordUnknown,
  //   Random,
  //   never
  // >;
}

export interface BlazeEventCallRecord {
  // Extend the interface with other modules
  // [key: string]: BlazeCallRequest<
  //   RecordString,
  //   RecordUnknown,
  //   Random,
  //   never
  // >;
}

export interface BlazeTrpcQueryCallRecord {
  // Extend the interface with other modules
}

export interface BlazeTrpcMutationCallRecord {
  // Extend the interface with other modules
}
