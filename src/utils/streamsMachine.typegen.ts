// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    '': { type: '' };
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
    restoreStoredContext: 'xstate.init';
    saveToLocalStorage: 'ADD' | 'DELETE' | 'SELECT' | 'TOGGLE_SHOW';
    selectStream: 'SELECT';
    toggleHasVideo: 'TOGGLE_SHOW';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    isChannelNotInStreams: 'ADD';
    isStreamsEmpty: '';
    isStreamsNotEmpty: 'SCRIPT_LOADED';
    shouldShowMultiView: '';
    shouldShowSingleView: '';
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
