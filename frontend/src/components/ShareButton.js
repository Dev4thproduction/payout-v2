import React from 'react';

const ShareButton = ({ roomId }) => {
  const shareRoom = () => {
    const roomUrl = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(roomUrl).then(() => {
      alert('Room URL copied to clipboard');
    });
  };

  return (
    <button onClick={shareRoom} className="px-4 py-2 bg-blue-500 text-white rounded mb-4">Share Room URL</button>
  );
};

export default ShareButton;
