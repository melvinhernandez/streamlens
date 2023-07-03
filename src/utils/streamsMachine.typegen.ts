// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    '': { type: '' };
    'xstate.init': { type: 'xstate.init' };
  };
  invokeSrcNameMap: {
    notifyOnTwitchScriptLoad: 'done.invoke.streams.loading:invocation[0]';
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    addStream: 'ADD';
    deleteStream: 'DELETE';
    restoreStoredContext: 'SCRIPT_LOADED';
    saveToLocalStorage: 'ADD' | 'DELETE' | 'SELECT' | 'TOGGLE_SHOW';
    selectStream: 'SELECT';
    toggleHasVideo: 'TOGGLE_SHOW';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    isChannelNotInStreams: 'ADD';
    isStreamsEmpty: '';
    isStreamsNotEmpty: '';
    shouldShowMultiView: '';
    shouldShowSingleView: '';
  };
  eventsCausingServices: {
    notifyOnTwitchScriptLoad: 'xstate.init';
  };
  matchesStates:
    | 'idle'
    | 'loading'
    | 'viewing'
    | 'viewing.multi'
    | 'viewing.single'
    | { viewing?: 'multi' | 'single' };
  tags: never;
}
