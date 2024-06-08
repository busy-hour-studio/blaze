export interface ActionEventCallRequest<Headers, Params, Body, Result, Query> {
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
