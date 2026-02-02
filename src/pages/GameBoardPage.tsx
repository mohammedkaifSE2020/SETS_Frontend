import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWebSocketStore } from '../context/useWebSocketStore';
import { useAuthStore } from '../context/useAuthStore';
import { type RoomResponse } from '../Interface/RoomResponse';
import { type PlayerInfo } from '../Interface/PlayerInfo';
import api from '../api/axios.config';

const GameBoard: React.FC = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const { subscribe, isConnected, send } = useWebSocketStore();
  const { user } = useAuthStore();

  const [roomData, setRoomData] = useState<RoomResponse | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isPassing, setIsPassing] = useState(false);
  const [declareSetClicked, setDeclareSetClicked] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    setIsPassing(false);
  }, [roomData]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await api.get(`/rooms/game/${roomCode}`);
        setRoomData(response.data);
        console.log(response.data);
      } catch (err) {
        console.error("Could not find room", err);
      }
    };

    fetchInitialData();

    if (isConnected && roomCode) {
      const sub = subscribe(`/topic/room/${roomCode.toUpperCase()}`, (data: RoomResponse) => {
        console.log(data)
        setRoomData(data);
      });
      return () => { if (sub) sub.unsubscribe(); };
    }
  }, [isConnected, roomCode, subscribe, declareSetClicked]);

  const handleCardClick = (cardName: string) => {
    if (!user || !roomCode || isPassing) return;

    const cardCount = me?.cards?.length || 0;
    const isHost = user.userId === roomData?.hostUserId;

    // Simple Logic: 
    // 1. Host can always move (to start the game or pass their 5th card).
    // 2. Everyone else MUST have more than 4 cards to make a move.
    if (isHost || cardCount > 4) {
      setIsPassing(true);
      send(`/pass-card/${roomCode.toUpperCase()}`, {
        userId: user.userId,
        cardValue: cardName
      });
    } else {
      console.log("Waiting for a card to be passed to you...");
    }
  };

  useEffect(() => {
    console.log("Inside UseEffect")
    if (roomData?.lastAction) {
      const { type, senderId, senderName, receiverId, receiverName } = roomData.lastAction;

      if (type === "PASS") {
        if (receiverId === user?.userId) {

          setNotification(`🎁 Card received from ${senderName}`);
          console.log(`🎁 Card received from ${senderName}`)
        } else if (senderId === user?.userId) {
          setNotification(`📤 Card sent to ${receiverName}`);
          console.log(`📤 Card sent to ${receiverName}`)
        }

        // Clear notification after 3 seconds
        const timer = setTimeout(() => setNotification(null), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [roomData?.lastAction, user?.userId]);

  // Find "me" in the player list to get my cards
  const me = roomData?.players?.find(p => p.userId === user?.userId);

  const hasFourOfAKind = me?.cards && me.cards.length === 4 &&
    me.cards.every(card => card === me.cards[0]);

  useEffect(() => {
    if (hasFourOfAKind && roomData?.status !== "FINISHED") {
      send(`/declare-set/${roomCode}`, { userId: user?.userId });
    }
  }, [me?.cards]); // Fires whenever your hand changes

  useEffect(() => {
    if (isConnected && roomCode) {
      const sub = subscribe(`/topic/room/${roomCode.toUpperCase()}`, (data: any) => {
        // Check if the received message is the Win Response
        if (data.type === "GAME_WON") {
          setWinner(data.winner);
        } else {
          // Otherwise, it's a standard room update
          setRoomData(data);
        }
      });
      return () => sub?.unsubscribe();
    }
  }, [isConnected, roomCode]);

  const handleDeclareSet = () => {
    if (!user || !roomCode || !me) return;

    // Send your specific PlayerInfo payload
    send(`/declare-set/${roomCode.toUpperCase()}`, me);

    setDeclareSetClicked(true);
  };



  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Game Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-2xl font-black tracking-tighter">SETS <span className="text-blue-500">PRO</span></h1>
            <p className="text-slate-400 text-sm">Room: {roomCode}</p>
          </div>
          <div className="bg-slate-800 px-6 py-2 rounded-full border border-slate-700">
            <span className="text-green-400">●</span> Live Match
          </div>
        </div>

        {/* Victory / Game Over Overlay */}
        {winner && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm">
            <div className="text-center p-12 bg-slate-800 rounded-3xl border-4 border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.4)]">
              <div className="text-7xl mb-4 animate-bounce">👑</div>
              <h2 className="text-5xl font-black text-white mb-2">WINNER!</h2>
              <p className="text-3xl text-yellow-400 font-bold mb-10">{winner}</p>

              <button
                onClick={() => window.location.href = '/'}
                className="px-12 py-4 bg-white text-black font-black rounded-xl hover:scale-105 transition-transform"
              >
                PLAY AGAIN
              </button>
            </div>
          </div>
        )}

        {/* Other Players (Simplified view) */}
        <div className="flex justify-center gap-8 mb-16">
          {roomData?.players?.filter(p => p.userId !== user?.userId).map((player: PlayerInfo) => (
            <div key={player.userId} className="text-center opacity-70">
              <div className="w-12 h-12 bg-slate-700 rounded-full mx-auto mb-2 border-2 border-slate-600 flex items-center justify-center">
                👤
              </div>
              <p className="text-xs font-bold">{player.displayName}</p>
              <p className="text-[10px] text-slate-500">4 CARDS</p>
            </div>
          ))}
        </div>

        {/* Notification Banner */}
        <div className="h-16 flex items-center justify-center">
          {notification && (
            <div className="bg-blue-600/90 text-white px-6 py-2 rounded-full border border-blue-400 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300 font-bold">
              {notification}
            </div>
          )}
        </div>
        {/* Your Hand */}
        <div className="text-center">
          <h2 className="text-xl font-bold mb-6 text-blue-400 uppercase tracking-widest">Your Hand</h2>
          <div className="flex justify-center gap-6">
            {me?.cards?.map((card: any, index: any) => (
              <div
                key={index}
                onClick={() => handleCardClick(card)}
                className={`w-32 h-48 bg-white text-slate-900 rounded-xl shadow-2xl flex flex-col items-center justify-center border-4 border-blue-500 transform hover:-translate-y-4 transition-all cursor-pointer group
                   ${(isPassing) ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer hover:-translate-y-4'}`}
              >
                <span className="text-4xl mb-2 group-hover:scale-125 transition-transform">
                  {getEmojiForCard(card)}
                </span>
                <p className="font-black text-sm uppercase tracking-tighter">{card}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {hasFourOfAKind && (
        <button
          onClick={handleDeclareSet}
          className="mt-8 px-12 py-4 bg-yellow-400 text-black font-black text-2xl rounded-full animate-bounce shadow-[0_0_20px_rgba(250,204,21,0.6)] hover:bg-yellow-300"
        >
          DECLARE SET! 🏆
        </button>
      )}
    </div>
  );
};

// Helper to make it look pretty
const getEmojiForCard = (card: string) => {
  const emojis: Record<string, string> = {
    LION: '🦁', TIGER: '🐯', ELEPHANT: '🐘', MONKEY: '🐒', EAGLE: '🦅'
  };
  return emojis[card] || '🃏';
};

export default GameBoard;