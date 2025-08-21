// src/UserCard.jsx
import React from "react";

export default function UserCard({ user }) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center text-center">
      {/* Avatar */}
      <img
        src={user.avatar}
        alt={user.name}
        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 mb-4"
      />

      {/* Name */}
      <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>

      {/* Email */}
      <p className="text-gray-500 text-sm">{user.email}</p>

      {/* Location (nếu có) */}
      {user.location && (
        <p className="text-gray-600 text-sm mt-2">📍 {user.location}</p>
      )}
    </div>
  );
}
