'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { TwitchPlayerConstructor, TwitchPlayerInstance } from './types';

export interface TwitchPlayerProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onEnded' | 'onPause' | 'onPlay' | 'onPlaying'
  > {
  channel: string;
  id: string;
}

export const TwitchPlayer: React.FC<TwitchPlayerProps> = props => {
  const { channel, id, ...restOfProps } = props;
  const player = useRef<TwitchPlayerInstance>();

  const createPlayer = useCallback(
    (Player: TwitchPlayerConstructor) => {
      const player = new Player(id, {
        channel,
        autoplay: true,
        muted: false,
        height: '100%',
        width: '100%',
      });

      return player;
    },
    [channel, id],
  );

  useEffect(() => {
    if (!player.current && window?.Twitch?.Player) {
      player.current = createPlayer(window.Twitch.Player);
    }
  }, [channel, createPlayer]);

  return (
    <div className="max-w-full">
      <div
        id={id}
        style={{
          height: '100%',
          width: 'auto',
        }}
        {...restOfProps}
      />
    </div>
  );
};
