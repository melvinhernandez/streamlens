'use client';

import React from 'react';
import { useMachine } from '@xstate/react';
import { streamsMachine } from '@/utils/streamsMachine';
import { SearchInput } from './SearchInput';
import { TwitchPlayer } from './TwitchPlayer';
import { cn } from '@/lib/utils';
import Script from 'next/script';
import { StreamControl } from './StreamControl';
import { ScrollArea } from './ui/ScrollArea';
import { Skeleton } from './ui/Skeleton';

const gridLayout = [
  undefined,
  'grid-cols-1	grid-rows-1',
  'grid-cols-2	grid-rows-1',
  'grid-cols-2 grid-rows-[3fr_2fr] [&>*:first-child]:col-span-2',
  'grid-cols-2	grid-rows-2',
  'grid-cols-6	grid-rows-2 [&>*]:col-span-2 [&>*:first-child]:col-span-3 [&>*:nth-child(2)]:col-span-3',
  'grid-cols-3',
  'grid-cols-3 grid-rows-[3fr_2fr_2fr] [&>*:first-child]:col-span-3',
  'grid-cols-4',
  'grid-cols-3',
] as const;

export const VideoGrid = () => {
  const [state, send] = useMachine(streamsMachine);

  const streamsInView = state.context.streams.filter(stream => stream.hasVideo);

  const gridClass = gridLayout[streamsInView.length] || '';

  return (
    <>
      <Script
        src="https://player.twitch.tv/js/embed/v1.js"
        onReady={() => {
          send({ type: 'SCRIPT_LOADED' });

          return;
        }}
      />
      <div className="w-full grid grid-rows-[auto_1fr] h-screen overflow-hidden content-center">
        <div className="bg-slate-950 border-cyan-50 border-b-4">
          <div className="container flex flex-row py-4">
            <ScrollArea className="grow w-[800px] bg-violet-500">
              <div className="flex gap-4 items-center pb-4">
                {state.context.streams.map(stream => (
                  <StreamControl
                    key={stream.id}
                    channel={stream.channel}
                    hasAudio={stream.hasAudio}
                    hasVideo={stream.hasVideo}
                    onAudioToggle={isSelected => {
                      send({
                        type: 'TOGGLE_MUTE',
                        streamId: stream.id,
                        mute: isSelected,
                      });
                    }}
                    onVideoToggle={isSelected => {
                      send({
                        type: 'TOGGLE_SHOW',
                        streamId: stream.id,
                        show: isSelected,
                      });
                    }}
                    onClick={() => {
                      send({
                        type: 'SELECT',
                        streamId: stream.id,
                      });
                    }}
                  />
                ))}
              </div>
            </ScrollArea>
            <div className="grow-0">
              <SearchInput
                onSubmit={channel => send({ type: 'ADD', channel })}
              />
            </div>
          </div>
        </div>
        <div
          className={cn('bg-slate-800 place-self-stretch grid gap-1', {
            'grid-cols-1	grid-rows-1': state.matches('viewing.single'),
            [gridClass]: state.matches('viewing.multi'),
          })}
        >
          {state.matches('viewing.single') &&
            state.context.singleViewStream && (
              <TwitchPlayer
                key={state.context.singleViewStream.id}
                id={state.context.singleViewStream.id}
                channel={state.context.singleViewStream.channel}
                muted={!state.context.singleViewStream.hasAudio}
              />
            )}
          {state.matches('viewing.multi') &&
            streamsInView.map(stream => (
              <TwitchPlayer
                key={stream.id}
                id={stream.id}
                channel={stream.channel}
                muted={!stream.hasAudio}
              />
            ))}
          {(state.matches('loading') || state.matches('idle')) && (
            <Skeleton className="w-full min-h-full" />
          )}
        </div>
      </div>
    </>
  );
};
