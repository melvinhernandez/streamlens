import { assign, createMachine } from 'xstate';

export type Stream = {
  id: string;
  channel: string;
  hasAudio: boolean;
  hasVideo: boolean;
};

type Context = {
  streams: Stream[];
  singleViewStream: Stream | null;
  currentId: number;
};

type Events =
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
      type: 'TOGGLE_MUTE';
      streamId: string;
      mute: boolean;
    }
  | {
      type: 'TOGGLE_SHOW';
      streamId: string;
      show: boolean;
    };

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
      events: {} as Events,
    },
    id: 'streams',
    initial: 'loading',
    context: INITIAL_CONTEXT,
    states: {
      loading: {
        entry: ['restoreLocalStorage'],
        on: {
          SCRIPT_LOADED: [
            {
              target: 'viewing',
              cond: 'hasStreams',
            },
            {
              target: 'idle',
            },
          ],
        },
      },
      idle: {
        on: {
          ADD: {
            target: 'viewing',
            actions: 'addStream',
          },
        },
      },
      viewing: {
        description:
          'This is a _state description_.\n\n[📚 Learn more in the docs](https://stately.ai/docs)',
        initial: 'multi',
        entry: ['updateLocalStorage'],
        states: {
          multi: {
            on: {
              SELECT: {
                target: 'single',
                actions: ['selectStream'],
              },
            },
          },
          single: {
            on: {
              SELECT: [
                {
                  target: 'multi',
                  actions: ['unselectStream'],
                  cond: 'isStreamInSingleView',
                  description:
                    'New stream selected is in SingleView so it becomes "unselected"',
                },
                {
                  target: 'single',
                  actions: ['selectStream'],
                  description: 'New stream selected is not the SingleView',
                  internal: false,
                },
              ],
            },
          },
        },
        on: {
          DELETE: [
            {
              cond: 'hasMultipleStreams',
              actions: ['deleteStream'],
            },
            {
              target: 'idle',
              actions: ['deleteStream'],
            },
          ],
          ADD: {
            target: 'viewing',
            actions: ['addStream'],
            internal: false,
          },
          TOGGLE_SHOW: [
            {
              actions: ['exitSingleView'],
              description:
                'State is in SingleView && streamId is not currently playing in SingleView',
              target: '.multi',
              cond: 'isStreamInSingleView',
            },
            {
              actions: 'toggleHasVideo',
              target: 'viewing',
              internal: false,
            },
          ],
          TOGGLE_MUTE: {
            actions: ['muteStream'],
            description: 'Mute button click or native player mute click',
          },
        },
      },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
      addStream: assign((context, { channel }) => {
        const id = context.currentId;

        return {
          streams: [
            ...context.streams,
            {
              id: id.toString(),
              channel,
              hasVideo: true,
              hasAudio: true,
            },
          ],
          currentId: id + 1,
        };
      }),
      deleteStream: assign({
        streams: (context, event) =>
          context.streams.filter(stream => stream.id !== event.streamId),
      }),
      selectStream: assign({
        singleViewStream: (context, event) => {
          const selectedStream = context.streams.find(
            stream => stream.id === event.streamId,
          );

          return selectedStream || null;
        },
      }),
      unselectStream: assign({
        singleViewStream: null,
      }),
      exitSingleView: assign({
        streams: (context, event) =>
          context.streams.map(stream => {
            if (stream.id === event.streamId) {
              return { ...stream, hasVideo: event.show };
            }

            return stream;
          }),
        singleViewStream: null,
      }),
      toggleHasVideo: assign({
        streams: (context, event) =>
          context.streams.map(stream => {
            if (stream.id === event.streamId) {
              return { ...stream, hasVideo: event.show };
            }

            return stream;
          }),
      }),
      updateLocalStorage: (context, event) => {
        console.log('localStorage', event);
        if (window.localStorage) {
          console.log('updating localStorage', context);
          window.localStorage.setItem('context', JSON.stringify(context));
        }
      },
      restoreLocalStorage: assign(() => {
        const existingContext = window?.localStorage.getItem('context');

        if (existingContext) {
          console.log('existing', existingContext);

          return JSON.parse(existingContext);
        }

        return INITIAL_CONTEXT;
      }),
      muteStream: assign({
        streams: (context, event) =>
          context.streams.map(stream => {
            if (stream.id === event.streamId) {
              return { ...stream, hasAudio: event.mute };
            }

            return stream;
          }),
      }),
    },
    guards: {
      hasStreams: context => context.streams.length >= 1,
      hasMultipleStreams: context => context.streams.length > 1,
      isStreamInSingleView: (context, event) => {
        console.log('isStreamInSingleView');
        if (event.type === 'SELECT') {
          return context.singleViewStream?.id === event.streamId;
        }
        if (event.type === 'TOGGLE_SHOW') {
          const isPlayingInSingleView =
            context.singleViewStream?.id === event.streamId;

          return isPlayingInSingleView && !event.show;
        }

        return false;
      },
    },
  },
);
