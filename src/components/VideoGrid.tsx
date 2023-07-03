'use client';

import React from 'react';
import { useMachine } from '@xstate/react';
import { motion, AnimatePresence } from 'framer-motion';
import { streamsMachine } from '@/utils/streamsMachine';
import { TwitchPlayer } from './TwitchPlayer';
import { cn } from '@/lib/utils';
import Script from 'next/script';
import { Skeleton } from './ui/Skeleton';
import { StreamsNav } from './StreamsNav';
import { SideMenu } from './SideMenu';

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

  const streamsInView = state.context.singleViewStream
    ? [state.context.singleViewStream]
    : state.context.streams.filter(stream => stream.hasVideo);

  return (
    <>
      <Script
        src="https://player.twitch.tv/js/embed/v1.js"
        onReady={() => {
          send({ type: 'SCRIPT_LOADED' });
        }}
      />
      <div className="w-full grid grid-rows-[auto_1fr] h-screen overflow-hidden content-center">
        <div className="bg-background border-base-300 border-b-4 relative z-10">
          <div className="container flex flex-row py-2">
            <StreamsNav
              streams={state.context.streams}
              singleViewStream={state.context.singleViewStream}
              onVideoToggle={(streamId, isSelected) => {
                send({
                  type: 'TOGGLE_SHOW',
                  streamId: streamId,
                  show: isSelected,
                });
              }}
              onStreamClick={streamId => {
                send({
                  type: 'SELECT',
                  streamId: streamId,
                });
              }}
            />
            <div className="grow-0 pl-2">
              <SideMenu
                onSearchSubmit={channel => send({ type: 'ADD', channel })}
                onStreamDelete={streamId => send({ type: 'DELETE', streamId })}
                streams={state.context.streams}
              />
            </div>
          </div>
        </div>
        {state.matches('viewing') && (
          <motion.div
            layoutRoot
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              'bg-slate-800 place-self-stretch grid gap-1',
              gridLayout[streamsInView.length],
            )}
          >
            {/* With `popLayout`, elements move to the their new layout immediately  */}
            <AnimatePresence mode="popLayout">
              {streamsInView.map(stream => (
                <motion.div
                  layout="preserve-aspect"
                  layoutId={`stream-layout-${stream.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key={stream.id}
                >
                  <TwitchPlayer id={stream.id} channel={stream.channel} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
        <AnimatePresence>
          {(state.matches('loading') || state.matches('idle')) && (
            <motion.div
              key="skeleton"
              className="place-self-stretch max-w-full"
              initial={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              animate={{ opacity: 1 }}
            >
              <Skeleton className="w-full min-h-full" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
