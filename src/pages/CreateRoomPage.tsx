import React from 'react';
import { CreateRoom } from '../componentss/room/CreateRoom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocketStore } from '../context/useWebSocketStore';
import type { RoomResponse } from '../Interface/RoomResponse';
import { useAuthStore } from '../context/useAuthStore';

const CreateRoomPage: React.FC = () => {
    const navigate = useNavigate();
    const { subscribe, isConnected } = useWebSocketStore();
    const { user } = useAuthStore();

    useEffect(() => {
        let subscription: any = null;

        if (isConnected) {
            subscription = subscribe('/topic/rooms', (room: RoomResponse) => {
                if (room.hostUserId === user?.userId) {
                    navigate(`/room/${room.roomCode}`);
                }
            });
        }

        // This runs when the component unmounts (user leaves the page)
        return () => {
            if (subscription) {
                console.log("Unsubscribing from /topic/rooms");
                subscription.unsubscribe();
            }
        };
    }, [isConnected, subscribe, navigate, user]);
    
    return (
        <div className="container mx-auto py-12 px-4 min-h-[70vh] flex flex-col items-center">
            <h1 className="text-4xl font-black text-gray-900 mb-2">Host a Game</h1>
            <p className="text-gray-500 mb-10">Set up your table and wait for challengers.</p>

            <CreateRoom />

            <p className="mt-8 text-sm text-gray-400 italic">
                Tip: 4 players is the most balanced for "Sets".
            </p>
        </div>
    );
};

export default CreateRoomPage;