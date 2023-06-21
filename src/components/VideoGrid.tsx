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
import { cn } from "@/lib/utils";

const gridLayout = [
  undefined,
  "grid-cols-1	grid-rows-1",
  "grid-cols-2	grid-rows-1",
  "grid-cols-2 grid-rows-[3fr_2fr] [&>*:first-child]:col-span-2",
  "grid-cols-2	grid-rows-2",
  "grid-cols-6	grid-rows-2 [&>*]:col-span-2 [&>*:first-child]:col-span-3 [&>*:nth-child(2)]:col-span-3",
  "grid-cols-3",
  "grid-cols-3 grid-rows-[3fr_2fr_2fr] [&>*:first-child]:col-span-3",
  "grid-cols-4",
] as const;

export const VideoGrid = () => {
  const [state, send] = useMachine(streamsMachine);

  const streamsInView = state.context.streams.filter(
    (stream) => stream.hasVideo
  );

  return (
    <div className="w-full grid grid-rows-[auto_1fr] h-screen overflow-hidden content-center">
      <div className="bg-slate-950 border-cyan-50 border-b-4">
        <div className="container flex flex-row py-4">
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
      <div
        className={cn(
          "bg-slate-800 place-self-stretch grid gap-1",
          gridLayout[streamsInView.length]
        )}
      >
        {streamsInView.map((stream) => (
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
