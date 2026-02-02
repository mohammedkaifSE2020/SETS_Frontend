import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/services/authService';
import { useAuthStore } from '../../context/useAuthStore';

export const Registration: React.FC = () => {
  const [formData, setFormData] = useState({ username: '', email: '', displayName: '' });
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userResponse = await register(formData);
      setUser(userResponse);
      navigate('/lobby'); // Send them to the game lobby
    } catch (error) {
        console.log(error)
      alert("Registration failed: " + error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 bg-slate-800 rounded-lg">
      <input 
        placeholder="Username" 
        onChange={(e) => setFormData({...formData, username: e.target.value})}
        className="p-2 rounded text-black"
      />
      <input 
        placeholder="Email" 
        type="email"
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        className="p-2 rounded text-black"
      />
      <input 
        placeholder="Display Name" 
        onChange={(e) => setFormData({...formData, displayName: e.target.value})}
        className="p-2 rounded text-black"
      />
      <button type="submit" className="bg-blue-600 p-2 rounded font-bold">Register & Play</button>
    </form>
  );
};