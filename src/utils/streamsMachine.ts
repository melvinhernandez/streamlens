import { assign, createMachine } from 'xstate';

export type Stream = {
  id: string;
  channel: string;
  hasVideo: boolean;
};

type Context = {
  streams: Stream[];
  singleViewStream: Stream | null;
  currentId: number;
};

type StreamsEvent =
  | {
      type: 'SCRIPT_LOADED';
    }
  | {
      type: 'ADD';
      channel: string;
    }
  | {
      type: 'SELECT';
      streamId: string;
    }
  | {
      type: 'DELETE';
      streamId: string;
    }
  | {
      type: 'TOGGLE_SHOW';
      streamId: string;
      show: boolean;
    };

const STORAGE_KEY = 'streamlens_context_v1';

const INITIAL_CONTEXT: Context = {
  streams: [],
  singleViewStream: null,
  currentId: 0,
};

export const streamsMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5SwC4CcwEMC2sB0A7pgJYrEB2UAxAIIAidA2gAwC6ioADgPaynHdyHEAA9EARgCsAFjwAmOc2aSAHMwDM6pUukAaEAE9EAdjmS84heuPq56gJwr10uQF9X+1Bhz4AbsTACCmo6AFEAGVCAFVCWdiQQHj4yQWExBAA2DPs8DJVJGRUMuSlpFTl9IwRpY3E8NTta9QzxY2kW43dPdCxcPH9A4KowyJjGcXiuXn5UhPTS+UVlNU1tZj1DRGKc5kVje3bm1U6PEC9evwCgyloGOOEkmaE5kxdc5Wl1FXtmcXEsySVRDWczGJQqMr2KzOaTSLpnHo+fpXIZRADyAHEMZEAPoAWQAqmM2A9pilnqB0llZOIyi51pJmBlYSogQgFCp3rZxA5yhljDITt1vH0BtdqOisbiAMoACTRAHV7glHuS0oh2nVJHJsuIVK19lp-mynHhJLZVHIbNq8jZ4eckWLgnhsABXAA2ZCo0oioQAwlFlVNkgIKaJEJJLHgwfZmT9mSpyoDNgginUanIDvl7JGZOJ7YjRSjKHg+JR3WBvb6A0HEmTQ+qEJG5NHmLHpPGykm2bVZCCtGZ+VmCyLLoMS2WoBWq5EaxNSSHZpTEInOdkoW2bHJPnYe+0zY4XD9-kprCOLsjxxLMdjQji5YrxpM64uw+kyhk8Ad1DI4z8vhkbI6jkx4HBkuxtP86juKc5DcBAcDCA6uALk8jYALSASm6FQXgLiwgURxZA4GTnkiRD8JQqFqi81QVCmGSSMYX7ME4+zMjYGj5qcyFjuK1ENrRzQ5C04iOM4-xsT+bLoQKX5fMYxiJvstSmKRPGFnxzpup6xACUu4bVK0uR-OJ0iSdY0kpioxiftk1rFJ8OY5mRRZXqWwQVvpb6IPYjj1AU0iMmC9mstZ+wWPYDnbg4kguTBQA */
    tsTypes: {} as import('./streamsMachine.typegen').Typegen0,
    schema: {
      context: {} as Context,
      events: {} as StreamsEvent,
    },
    id: 'streams',
    initial: 'loading',
    context: INITIAL_CONTEXT,
    states: {
      loading: {
        on: {
          SCRIPT_LOADED: {
            target: 'idle',
            actions: ['restoreStoredContext'],
          },
        },
        invoke: {
          src: 'notifyOnTwitchScriptLoad',
        },
      },
      idle: {
        always: [{ target: 'viewing', cond: 'isStreamsNotEmpty' }],
        on: {
          ADD: {
            actions: ['addStream', 'saveToLocalStorage'],
            cond: 'isChannelNotInStreams',
          },
        },
      },
      viewing: {
        initial: 'multi',
        always: [{ target: 'idle', cond: 'isStreamsEmpty' }],
        states: {
          multi: {
            always: [{ target: 'single', cond: 'shouldShowSingleView' }],
          },
          single: {
            always: [{ target: 'multi', cond: 'shouldShowMultiView' }],
          },
        },
        on: {
          ADD: {
            actions: ['addStream', 'saveToLocalStorage'],
            cond: 'isChannelNotInStreams',
          },
          SELECT: { actions: ['selectStream', 'saveToLocalStorage'] },
          DELETE: { actions: ['deleteStream', 'saveToLocalStorage'] },
          TOGGLE_SHOW: { actions: ['toggleHasVideo', 'saveToLocalStorage'] },
        },
      },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
      addStream: assign((ctx, { channel }) => {
        const id = ctx.currentId;

        return {
          streams: [
            ...ctx.streams,
            {
              id: id.toString(),
              channel,
              hasVideo: true,
            },
          ],
          currentId: id + 1,
        };
      }),
      deleteStream: assign((ctx, { streamId }) => {
        const isStreamInSingleView = ctx.singleViewStream?.id === streamId;

        return {
          streams: ctx.streams.filter(stream => stream.id !== streamId),
          singleViewStream: isStreamInSingleView ? null : ctx.singleViewStream,
        };
      }),
      selectStream: assign((ctx, { streamId }) => {
        // Unselect stream if it is currently selected
        if (ctx.singleViewStream?.id === streamId) {
          return { singleViewStream: null };
        }

        return {
          singleViewStream:
            ctx.streams.find(stream => stream.id === streamId) || null,
        };
      }),
      toggleHasVideo: assign({
        streams: (ctx, { streamId, show }) =>
          ctx.streams.map(stream => {
            if (stream.id === streamId) {
              return { ...stream, hasVideo: show };
            }

            return stream;
          }),
      }),
      saveToLocalStorage: ctx => {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ctx));
        }
      },
      restoreStoredContext: assign(() => {
        if (typeof window !== 'undefined') {
          const existingContext = window.localStorage.getItem(STORAGE_KEY);

          if (existingContext) {
            return JSON.parse(existingContext);
          }
        }

        return INITIAL_CONTEXT;
      }),
    },
    services: {
      notifyOnTwitchScriptLoad: () => send => {
        const id = setInterval(() => {
          if (typeof window !== 'undefined' && window.Twitch?.Player) {
            send('SCRIPT_LOADED');
          }
        }, 500);

        return () => {
          clearInterval(id);
        };
      },
    },
    guards: {
      isChannelNotInStreams: (ctx, { channel }) =>
        ctx.streams.every(stream => stream.channel !== channel),
      isStreamsEmpty: ctx => ctx.streams.length === 0,
      isStreamsNotEmpty: ctx => ctx.streams.length >= 1,
      shouldShowSingleView: ctx => ctx.singleViewStream !== null,
      shouldShowMultiView: ctx =>
        ctx.singleViewStream === null && ctx.streams.length >= 1,
    },
  },
);
