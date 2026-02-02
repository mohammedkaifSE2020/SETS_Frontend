import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocketStore } from '../../context/useWebSocketStore';
import { useAuthStore } from '../../context/useAuthStore';

export const JoinRoom: React.FC = () => {
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  
  const { send, isConnected } = useWebSocketStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!roomCode || roomCode.length !== 4) {
      setError('Please enter a valid 4-digit code');
      return;
    }

    if (!user || !isConnected) return;

    // We send the join request to the backend
    // Format: /app/join-room/{roomCode}
    send(`/join-room/${roomCode.toUpperCase()}`, {
      userId: user.userId
    });

    // We navigate to the room page immediately
    // The RoomPage will subscribe to updates for this code
    navigate(`/room/${roomCode.toUpperCase()}`);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 max-w-md w-full">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🔑</span>
        <h2 className="text-2xl font-bold text-gray-800">Join a Game</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Enter Room Code
          </label>
          <input
            type="text"
            maxLength={4}
            value={roomCode}
            onChange={(e) => {
              setRoomCode(e.target.value.toUpperCase());
              setError('');
            }}
            placeholder="e.g. A1B2"
            className="w-full text-center text-3xl font-mono tracking-widest p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all uppercase"
          />
        </div>

        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        <button
          onClick={handleJoin}
          disabled={!isConnected || roomCode.length !== 4}
          className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all
            ${isConnected && roomCode.length === 4
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] active:scale-95'
              : 'bg-gray-400 cursor-not-allowed'}`}
        >
          {isConnected ? 'Join Room' : 'Connecting...'}
        </button>
      </div>
    </div>
  );
};