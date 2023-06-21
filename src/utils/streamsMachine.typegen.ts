// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    addStream: "ADD";
    deleteStream: "DELETE";
    exitSingleView: "TOGGLE_SHOW";
    muteStream: "TOGGLE_MUTE";
    selectStream: "SELECT";
    showStream: "TOGGLE_SHOW";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    hasMultipleStreams: "DELETE";
    isStreamInSingleView: "SELECT" | "TOGGLE_SHOW";
  };
  eventsCausingServices: {};
  matchesStates:
    | "viewing"
    | "viewing.multi"
    | "viewing.single"
    | "waiting"
    | { viewing?: "multi" | "single" };
  tags: never;
}
