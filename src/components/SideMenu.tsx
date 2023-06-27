'use client';

import React from 'react';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import type { Stream } from '@/utils/streamsMachine';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from './ui/Sheet';
import { Button } from './ui/Button';
import { SearchInput } from './SearchInput';
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar';

interface SideMenuProps {
  streams: Stream[];
  onSearchSubmit: (channel: string) => void;
  onStreamDelete: (streamId: string) => void;
}

export const SideMenu = ({
  streams,
  onSearchSubmit,
  onStreamDelete,
}: SideMenuProps) => {
  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="outline" size="icon">
          <HamburgerMenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side={'right'}>
        <SheetHeader>
          <SheetTitle>Are you sure absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
          <div className="py-8">
            <SearchInput onSubmit={onSearchSubmit} />
          </div>
          <div className="space-y-8">
            {streams.map(stream => (
              <div key={stream.id} className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/01.png" alt="Avatar" />
                  <AvatarFallback>{stream.channel.at(0)}</AvatarFallback>
                </Avatar>
                <p className="ml-4 text-sm font-medium leading-none">
                  {stream.channel}
                </p>
                <div className="ml-auto">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onStreamDelete(stream.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
