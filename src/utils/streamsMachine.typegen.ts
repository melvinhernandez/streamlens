// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'xstate.init': { type: 'xstate.init' };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    addStream: 'ADD';
    deleteStream: 'DELETE';
    exitSingleView: 'TOGGLE_SHOW';
    muteStream: 'TOGGLE_MUTE';
    restoreLocalStorage: 'xstate.init';
    selectStream: 'SELECT';
    toggleHasVideo: 'TOGGLE_SHOW';
    unselectStream: 'SELECT';
    updateLocalStorage: 'ADD' | 'SCRIPT_LOADED' | 'TOGGLE_SHOW';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    hasMultipleStreams: 'DELETE';
    hasStreams: 'SCRIPT_LOADED';
    isStreamInSingleView: 'SELECT' | 'TOGGLE_SHOW';
  };
  eventsCausingServices: {};
  matchesStates:
    | 'idle'
    | 'loading'
    | 'viewing'
    | 'viewing.multi'
    | 'viewing.single'
    | { viewing?: 'multi' | 'single' };
  tags: never;
}
