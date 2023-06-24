import { FiEye, FiEyeOff } from 'react-icons/fi';
// import { HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from "react-icons/hi2";
import type { Stream } from '@/utils/streamsMachine';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';

interface StreamControl extends Omit<Stream, 'id'> {
  onAudioToggle: (isSelected: boolean) => void;
  onVideoToggle: (isSelected: boolean) => void;
  onClick: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const StreamControl = ({
  channel,
  // hasAudio,
  hasVideo,
  // onAudioToggle,
  onVideoToggle,
  onClick,
}: StreamControl) => {
  return (
    <div className="border border-white flex gap-1 px-4 items-center">
      <Button variant="outline" onClick={onClick}>
        {channel}
      </Button>
      <Toggle size="sm" pressed={hasVideo} onPressedChange={onVideoToggle}>
        {hasVideo ? <FiEye /> : <FiEyeOff />}
      </Toggle>
      {/* <Toggle size="sm" pressed={hasAudio} onPressedChange={onAudioToggle}>
        {hasAudio ? <HiOutlineSpeakerWave /> : <HiOutlineSpeakerXMark />}
      </Toggle> */}
    </div>
  );
};
