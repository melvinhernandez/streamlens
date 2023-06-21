"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import {
  useScript,
  usePrevious,
  // typedNoop,
  // typedNoop2,
  objectCompareWithIgnoredKeys,
} from "./utils";
// import { DEFAULTS } from "./constants";
import {
  TwitchWindow,
  TwitchPlayerConstructor,
  TwitchPlayerInstance,
  OnPlayData,
  // OnSeekData,
} from "./types";
// import { clearElementById } from "../utils/document";

export interface TwitchPlayerProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onEnded" | "onPause" | "onPlay" | "onPlaying"
  > {
  channel?: string;
  video?: string;
  collection?: string;
  parent?: string | string[];
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

const nonReconstructTriggeringProps: (keyof TwitchPlayerProps)[] = [
  "channel",
  "video",
  "collection",
  "height",
  "width",
];
const shouldReconstructPlayer = (
  previousProps: TwitchPlayerProps | undefined,
  props: TwitchPlayerProps
): boolean => {
  return objectCompareWithIgnoredKeys(
    (previousProps as unknown as Record<string, unknown>) ?? {},
    props as unknown as Record<string, unknown>,
    nonReconstructTriggeringProps
  );
};

export const TwitchPlayer: React.FC<TwitchPlayerProps> = (props) => {
  const {
    channel,
    video,
    collection,
    parent,
    autoplay,
    muted,
    time,
    allowFullscreen,
    playsInline,
    hideControls,

    // onCaptions,
    // onEnded,
    onPause,
    onPlay,
    onPlaybackBlocked,
    onPlaying,
    // onOffline,
    // onOnline,
    onReady,
    // onSeek,

    id,
    height = "100%",
    width = "auto",
    ...restOfProps
  } = props;
  const { loading, error } = useScript(
    "https://player.twitch.tv/js/embed/v1.js"
  );
  const previousProps = usePrevious(props);
  const player = useRef<TwitchPlayerInstance>();
  const [isMuted, setIsMuted] = useState(muted);

  const createPlayer = useCallback(
    (Player: TwitchPlayerConstructor) => {
      const player = new Player(id, {
        channel,
        video,
        collection,
        parent: typeof parent === "string" ? [parent] : parent,
        autoplay,
        muted: false,
        time,
        allowfullscreen: allowFullscreen,
        playsinline: playsInline,
        controls: !hideControls,
        height: "100%",
        width: "100%",
      });

      // player.addEventListener(Player.CAPTIONS, (captions: string) =>
      //   onCaptions?.(player, captions)
      // );
      // player.addEventListener(Player.ENDED, () => onEnded?.(player));
      player.addEventListener(Player.PAUSE, () => onPause?.(player));
      player.addEventListener(Player.PLAY, (data: OnPlayData) =>
        onPlay?.(player, data)
      );
      player.addEventListener(Player.PLAYBACK_BLOCKED, () =>
        onPlaybackBlocked?.(player)
      );
      player.addEventListener(Player.PLAYING, () => onPlaying?.(player));
      // player.addEventListener(Player.OFFLINE, () => onOffline?.(player));
      // player.addEventListener(Player.ONLINE, () => onOnline?.(player));
      player.addEventListener(Player.READY, () => onReady?.(player));
      // player.addEventListener(Player.SEEK, (data: OnSeekData) =>
      //   onSeek?.(player, data)
      // );

      return player;
    },
    [
      channel,
      video,
      collection,
      parent,
      autoplay,
      // muted,
      time,
      allowFullscreen,
      playsInline,
      hideControls,
      // onCaptions,
      // onEnded,
      // onOffline,
      // onOnline,
      onPause,
      onPlay,
      onPlaybackBlocked,
      onPlaying,
      onReady,
      // onSeek,
      id,
    ]
  );

  useEffect(() => {
    if (loading) {
      return;
    }

    if (error) {
      console.error(error);

      return;
    }

    if (!player.current) {
      if (!(window && window.Twitch && window.Twitch.Player)) return;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      player.current = createPlayer(window.Twitch.Player);

      return;
    }

    if (channel && previousProps?.channel !== channel) {
      player.current?.setChannel(channel);
    }

    if (video && previousProps?.video !== video) {
      player.current?.setVideo(video, 0);
    }

    if (collection && previousProps?.collection !== collection) {
      player.current?.setCollection(collection, video);
    }
  }, [
    channel,
    collection,
    createPlayer,
    error,
    loading,
    previousProps,
    props,
    video,
  ]);

  useEffect(() => {
    console.log("muteEffect", player?.current?.getMuted());
    if (muted !== isMuted) {
      console.log("different");
      console.log({ muted, prevMuted: previousProps?.muted, isMuted });
      player?.current?.setMuted(muted);
      setIsMuted(muted);
    }
  }, [muted, previousProps, isMuted]);

  if (loading) {
    return null;
  }

  return (
    <div className=" max-w-full">
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
