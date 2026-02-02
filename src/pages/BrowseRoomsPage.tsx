import React from 'react';
import { JoinRoom } from '../componentss/room/JoinRoom';

const BrowseRoomsPage: React.FC = () => {
  return (
    <div className="container mx-auto py-12 px-4 flex flex-col items-center min-h-[70vh]">
      <h1 className="text-4xl font-black text-gray-900 mb-2">Find a Table</h1>
      <p className="text-gray-500 mb-10">Enter a friend's code or browse active games.</p>
      
      <JoinRoom />
      
      <div className="mt-12 text-center text-gray-400">
        <p>Don't have a code? Ask a friend to host a game!</p>
      </div>
    </div>
  );
};

export default BrowseRoomsPage;