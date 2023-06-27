'use client';

import React from 'react';
import { Stream } from '@/utils/streamsMachine';
import { StreamControl } from './StreamControl';
import { ScrollArea } from './ui/ScrollArea';

interface StreamsNavProps {
  streams: Stream[];
  singleViewStream: Stream | null;
  onVideoToggle: (streamId: string, isSelected: boolean) => void;
  onStreamClick: (streamId: string) => void;
}

export const StreamsNav = ({
  streams,
  singleViewStream,
  onVideoToggle,
  onStreamClick,
}: StreamsNavProps) => {
  return (
    <ScrollArea className="grow w-[800px] bg-background">
      <div className="flex gap-4 items-center pb-4">
        {streams.map(stream => (
          <StreamControl
            key={stream.id}
            channel={stream.channel}
            hasVideo={stream.hasVideo}
            disableVideoToggle={singleViewStream !== null}
            isInSingleView={singleViewStream?.id === stream.id}
            onVideoToggle={isSelected => {
              onVideoToggle(stream.id, isSelected);
            }}
            onClick={() => {
              onStreamClick(stream.id);
            }}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
