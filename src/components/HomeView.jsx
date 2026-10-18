import React from 'react';
import MinimalShadeDeck from './MinimalShadeDeck';

export default function HomeView({ setActiveTab, onSelectColor, onCopy, copiedHex }) {
  return (
    <MinimalShadeDeck
      onSelectColor={onSelectColor}
      onCopy={onCopy}
      copiedHex={copiedHex}
      setActiveTab={setActiveTab}
    />
  );
}
