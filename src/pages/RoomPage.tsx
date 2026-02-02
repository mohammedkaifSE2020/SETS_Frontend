import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWebSocketStore } from '../context/useWebSocketStore';
import { useAuthStore } from '../context/useAuthStore';
import type { RoomResponse } from '../Interface/RoomResponse';
import api from '../api/axios.config';

const RoomPage: React.FC = () => {
    const { roomCode } = useParams<{ roomCode: string }>();

    const navigate = useNavigate();

    const { subscribe, isConnected, send } = useWebSocketStore();
    const { user } = useAuthStore();

    const [roomData, setRoomData] = useState<RoomResponse | null>(null);

    useEffect(() => {
        if (roomData?.status === 'PLAYING') {
            navigate(`/game/${roomCode}`);
        }
    }, [roomData?.status, navigate, roomCode]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await api.get(`/rooms/${roomCode}`);
                setRoomData(response.data);
            } catch (err) {
                console.error("Could not find room", err);
            }
        };

        fetchInitialData();
        if (isConnected && roomCode) {
            // Subscribe to this specific room's updates
            const subscription = subscribe(`/topic/room/${roomCode.toUpperCase()}`, (data: RoomResponse) => {
                console.log("Room Update Received:", data);
                setRoomData(data);
            });

            return () => {
                if (subscription) subscription.unsubscribe();
            };
        }
    }, [isConnected, roomCode, subscribe]);

    const handleStartGame = () => {
        if (!isHost || !user || !roomCode) return;

        // This matches your @MessageMapping("/start-game/{roomCode}")
        send(`/start-game/${roomCode}`, {
            userId: user.userId
        });
        navigate(`/game/${roomCode}`);
    };

    if (!roomData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                <p className="text-gray-500 font-medium">Loading Room {roomCode}...</p>
            </div>
        );
    }

    const isHost = user?.userId === roomData.hostUserId;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header Section */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white text-center">
                    <p className="text-purple-100 uppercase tracking-widest text-sm font-bold mb-2">Game Lobby</p>
                    <h1 className="text-6xl font-black font-mono tracking-tighter mb-4">{roomCode}</h1>
                    <p className="text-purple-100">Share this code with friends to join the arena!</p>
                </div>

                {/* Players Grid */}
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Players <span className="text-purple-600">({roomData.players.length}/{roomData.maxPlayers})</span>
                        </h2>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold animate-pulse">
                            Waiting for Players...
                        </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {roomData.players.map((player: any) => (
                            <div
                                key={player.userId}
                                className={`relative flex flex-col items-center p-6 rounded-2xl border-2 transition-all
                  ${player.userId === user?.userId ? 'border-purple-500 bg-purple-50' : 'border-gray-100 bg-gray-50'}`}
                            >
                                {/* Host Crown Icon */}
                                {player.isHost && (
                                    <span className="absolute -top-3 text-2xl">👑</span>
                                )}

                                {/* Avatar Placeholder */}
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3 shadow-sm
                  ${player.isHost ? 'bg-yellow-100' : 'bg-white'}`}>
                                    {player.userId === user?.userId ? '🎮' : '👤'}
                                </div>

                                <p className="font-bold text-gray-800 truncate w-full text-center">
                                    {player.displayName}
                                </p>

                                <p className="text-xs font-medium text-gray-400 mt-1 uppercase">
                                    {player.isHost ? 'Host' : 'Challenger'}
                                </p>

                                {player.userId === user?.userId && (
                                    <span className="mt-2 text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded-full uppercase">You</span>
                                )}
                            </div>
                        ))}

                        {/* Empty Slots */}
                        {Array.from({ length: roomData.maxPlayers - roomData.players.length }).map((_, i) => (
                            <div key={`empty-${i}`} className="flex flex-col items-center p-6 rounded-2xl border-2 border-dashed border-gray-200 opacity-50">
                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-300 text-2xl mb-3">
                                    ?
                                </div>
                                <p className="text-gray-300 font-bold italic">Waiting...</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-gray-50 p-8 border-t border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="text-gray-500 text-sm">
                        {isHost
                            ? "You are the host. Start the game when everyone is ready!"
                            : "Waiting for the host to launch the game..."}
                    </div>

                    <button
                        onClick={handleStartGame}
                        disabled={!isHost || roomData.players.length < 3}
                        className={`px-10 py-4 rounded-xl font-black text-white shadow-lg transition-all
              ${isHost && roomData.players.length >= 3
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 active:scale-95'
                                : 'bg-gray-300 cursor-not-allowed text-gray-400'}`}
                    >
                        {isHost ? 'START GAME 🚀' : 'READY TO PLAY'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomPage;