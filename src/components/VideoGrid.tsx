"use client";

import React from "react";
import { useMachine } from "@xstate/react";
import { streamsMachine } from "@/utils/streamsMachine";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "./SearchInput";
import { Toggle } from "@/components/ui/Toggle";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from "react-icons/hi2";
import { TwitchPlayer } from "./TwitchPlayer";

type TwitchEmbedProps = {
  channel: string;
};
const TwitchEmbed = ({ channel }: TwitchEmbedProps) => (
  <iframe
    src={`https://player.twitch.tv/?channel=${channel}&parent=localhost&muted=true`}
    height="100%"
    width="100%"
    allowFullScreen
  ></iframe>
);

export const VideoGrid = () => {
  const [state, send] = useMachine(streamsMachine);

  return (
    <div className="w-full grid grid-rows-[58px_1fr] h-screen gap-4 overflow-hidden content-center">
      <div className="bg-slate-950 border-b-4">
        <div className="container flex flex-row py-2">
          <div className="grow flex gap-4">
            {state.context.streams.map((stream) => (
              <div
                className="border border-white flex gap-1 px-4"
                key={stream.id}
              >
                <Button variant="outline">{stream.channel}</Button>
                <Toggle
                  size="sm"
                  pressed={stream.hasVideo}
                  onPressedChange={(pressed) => {
                    console.log({ was: stream.hasVideo, pressed });
                    send({
                      type: "TOGGLE_SHOW",
                      streamId: stream.id,
                      show: pressed,
                    });
                  }}
                >
                  {stream.hasVideo ? <FiEye /> : <FiEyeOff />}
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={stream.hasAudio}
                  onPressedChange={(pressed) => {
                    console.log({ was: stream.hasAudio, pressed });
                    send({
                      type: "TOGGLE_MUTE",
                      streamId: stream.id,
                      mute: pressed,
                    });
                  }}
                >
                  {stream.hasAudio ? (
                    <HiOutlineSpeakerWave />
                  ) : (
                    <HiOutlineSpeakerXMark />
                  )}
                </Toggle>
              </div>
            ))}
          </div>
          <div className="grow-0">
            <SearchInput
              onSubmit={(channel) => send({ type: "ADD", channel })}
            />
          </div>
        </div>
      </div>
      <div className="bg-slate-800 place-self-stretch grid grid-flow-row-dense grid-cols-[repeat(auto-fit,_minmax(400px,_1fr))]">
        {state.context.streams
          .filter((stream) => stream.hasVideo)
          .map((stream) => (
            <TwitchPlayer
              id={stream.id}
              channel={stream.channel}
              key={stream.id}
              muted={!stream.hasAudio}
            />
          ))}
      </div>
    </div>
  );
};
