import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      {/* Hero Section */}
      <div className="text-center max-w-3xl animate-fade-in">
        <div className="mb-6 inline-block p-4 bg-purple-100 rounded-2xl shadow-inner">
          <span className="text-6xl">🎴</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Sets</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-10 leading-relaxed">
          The ultimate fast-paced multiplayer card passing game. 
          Race against friends to collect matching sets of 
          <span className="font-semibold text-purple-600"> Lions, Tigers, and Eagles.</span> 
          Be quick, be strategic, and shout "SET!" before anyone else.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto"
          >
            Create Your Profile
          </button>
          
          <button
            onClick={() => navigate('/browse-rooms')}
            className="px-8 py-4 bg-white border-2 border-purple-600 text-purple-600 text-lg font-bold rounded-xl hover:bg-purple-50 transition-all duration-300 w-full sm:w-auto"
          >
            Watch a Game
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl bg-white shadow-sm border border-gray-100">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold text-gray-800 mb-2">Real-time Play</h3>
            <p className="text-sm text-gray-500">Low latency gameplay powered by WebSockets.</p>
          </div>
          <div className="p-6 rounded-xl bg-white shadow-sm border border-gray-100">
            <div className="text-3xl mb-3">🤝</div>
            <h3 className="font-bold text-gray-800 mb-2">Multiplayer</h3>
            <p className="text-sm text-gray-500">Create private rooms and play with up to 5 friends.</p>
          </div>
          <div className="p-6 rounded-xl bg-white shadow-sm border border-gray-100">
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="font-bold text-gray-800 mb-2">Leaderboards</h3>
            <p className="text-sm text-gray-500">Win games and climb the global rankings.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;