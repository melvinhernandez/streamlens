'use client';

import { FiEye, FiEyeOff } from 'react-icons/fi';
import type { Stream } from '@/utils/streamsMachine';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { cn } from '@/lib/utils';

interface StreamControlProps extends Omit<Stream, 'id'> {
  onVideoToggle: (isSelected: boolean) => void;
  onClick: () => void;
  isInSingleView: boolean;
  disableVideoToggle: boolean;
}

const StreamControl = ({
  channel,
  hasVideo,
  onVideoToggle,
  onClick,
  isInSingleView,
  disableVideoToggle,
}: StreamControlProps) => {
  return (
    <div
      className={cn('border bg-base-200 rounded-md flex items-center', {
        'bg-success': isInSingleView,
      })}
    >
      <Button
        variant={isInSingleView ? 'selected' : 'base'}
        onClick={onClick}
        className="border-transparent"
      >
        {channel}
      </Button>
      <Toggle
        size="sm"
        variant={isInSingleView ? 'selected' : 'custom'}
        pressed={hasVideo}
        onPressedChange={onVideoToggle}
        disabled={disableVideoToggle}
      >
        {hasVideo || isInSingleView ? <FiEye /> : <FiEyeOff />}
      </Toggle>
    </div>
  );
};

export { StreamControl };
