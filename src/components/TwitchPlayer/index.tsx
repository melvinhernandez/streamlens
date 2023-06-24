"use client";

import React, { useEffect, useRef, useCallback } from "react";
import {
  TwitchPlayerConstructor,
  TwitchPlayerInstance,
  OnPlayData,
} from "./types";

export interface TwitchPlayerProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onEnded" | "onPause" | "onPlay" | "onPlaying"
  > {
  channel: string;
  // video?: string;
  // collection?: string;
  // parent?: string | string[];
  autoplay?: boolean;
  muted: boolean;
  time?: string;
  allowFullscreen?: boolean;
  playsInline?: boolean;
  hideControls?: boolean;

  // onCaptions?: (player: TwitchPlayerInstance, captions: string) => void;
  // onEnded?: (player: TwitchPlayerInstance) => void;
  onPause?: (player: TwitchPlayerInstance) => void;
  onPlay?: (player: TwitchPlayerInstance, data: OnPlayData) => void;
  onPlaybackBlocked?: (player: TwitchPlayerInstance) => void;
  onPlaying?: (player: TwitchPlayerInstance) => void;
  // onOffline?: (player: TwitchPlayerInstance) => void;
  // onOnline?: (player: TwitchPlayerInstance) => void;
  onReady?: (player: TwitchPlayerInstance) => void;
  // onSeek?: (player: TwitchPlayerInstance, data: OnSeekData) => void;

  id: string;
  height?: string | number;
  width?: string | number;
}

export const TwitchPlayer: React.FC<TwitchPlayerProps> = (props) => {
  const {
    channel,
    autoplay,
    onPause,
    onPlay,
    onPlaybackBlocked,
    onPlaying,
    onReady,
    height = "100%",
    width = "auto",
    id,
    ...restOfProps
  } = props;
  const player = useRef<TwitchPlayerInstance>();

  const createPlayer = useCallback(
    (Player: TwitchPlayerConstructor) => {
      const player = new Player(id, {
        channel,
        autoplay,
        muted: false,
        height: "100%",
        width: "100%",
      });

      player.addEventListener(Player.PAUSE, () => onPause?.(player));
      player.addEventListener(Player.PLAY, (data: OnPlayData) =>
        onPlay?.(player, data)
      );
      player.addEventListener(Player.PLAYBACK_BLOCKED, () =>
        onPlaybackBlocked?.(player)
      );
      player.addEventListener(Player.PLAYING, () => onPlaying?.(player));
      player.addEventListener(Player.READY, () => onReady?.(player));

      return player;
    },
    [
      channel,
      id,
      onPause,
      onPlay,
      onPlaybackBlocked,
      onPlaying,
      onReady,
      autoplay,
    ]
  );

  useEffect(() => {
    if (!player.current) {
      if (!(window && window.Twitch && window.Twitch.Player)) return;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      player.current = createPlayer(window.Twitch.Player);

      return;
    }
  }, [channel, createPlayer]);

  return (
    <div className="max-w-full">
      <div
        id={id}
        style={{
          height,
          width,
        }}
        {...restOfProps}
      />
    </div>
  );
};
