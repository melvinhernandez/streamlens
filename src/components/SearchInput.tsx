"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";

type SearchInputProps = {
  onSubmit: (channel: string) => void;
};

export const SearchInput = ({ onSubmit }: SearchInputProps) => {
  const [channel, setChannel] = useState("");

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && channel) {
      onSubmit(channel);
      setChannel("");
    }
  };

  return (
    <Input
      type="text"
      placeholder="Add Channel"
      value={channel}
      onChange={(e) => setChannel(e.target.value)}
      onKeyDown={handleKeyPress}
    />
  );
};
