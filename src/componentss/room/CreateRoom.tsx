import React, { useState } from 'react';
import { useWebSocketStore } from '../../context/useWebSocketStore';
import { useAuthStore } from '../../context/useAuthStore';
import type { CreateRoomRequest } from '../../Interface/CreateRoomRequest';

export const CreateRoom: React.FC = () => {
  const { send, isConnected } = useWebSocketStore();
  const { user } = useAuthStore();
  
  const [roomSettings, setRoomSettings] = useState({
    maxPlayers: 8,
    isPrivate: false,
  });

  const handleCreate = () => {
    if (!user || !isConnected) return;

    const payload: CreateRoomRequest = {
      hostUserId: user.userId,
      maxPlayers: roomSettings.maxPlayers,
      isPrivate: roomSettings.isPrivate,
    };

    // Sends to @MessageMapping("/create-room") in Spring Boot
    send('/create-room', payload);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-purple-100 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🏰</span>
        <h2 className="text-2xl font-bold text-gray-800">Room Settings</h2>
      </div>

      <div className="space-y-6">
        {/* Max Players Slider */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex justify-between">
            Max Players <span>{roomSettings.maxPlayers}</span>
          </label>
          <input
            type="range" min="3" max="8"
            value={roomSettings.maxPlayers}
            onChange={(e) => setRoomSettings({ ...roomSettings, maxPlayers: parseInt(e.target.value) })}
            className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
      
          </div>
        </div>

        {/* Privacy Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-800">Private Room</p>
            <p className="text-xs text-gray-500">Only friends with code can join</p>
          </div>
          <input
            type="checkbox"
            checked={roomSettings.isPrivate}
            onChange={(e) => setRoomSettings({ ...roomSettings, isPrivate: e.target.checked })}
            className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500"
          />
        </div>

        {/* Create Button */}
        <button
          onClick={handleCreate}
          disabled={!isConnected}
          className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all 
            ${isConnected 
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-[1.02] active:scale-95' 
              : 'bg-gray-400 cursor-not-allowed'}`}
        >
          {isConnected ? 'Create Room' : 'Connecting to Server...'}
        </button>
      </div>
    </div>
  );
};