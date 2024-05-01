export interface ActionEventCallRequest<Headers, Params, Body, Result> {
  headers: Headers;
  params: Params;
  body: Body;
  result: Result;
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
