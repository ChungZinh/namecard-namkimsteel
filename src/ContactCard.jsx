import React from "react";
import { Link } from "react-router-dom";

export default function ContactCard({ contact }) {
  return (
    <Link
      to={`/${contact.slug}`}
      className="block bg-white rounded-xl shadow hover:shadow-lg transition duration-200 p-6 text-center no-underline"
    >
      <img
        src={contact.avatar}
        alt={contact.full_name}
        className="w-24 h-24 rounded-full object-cover mx-auto"
      />
      <h2 className="mt-4 text-lg font-semibold text-gray-900">
        {contact.full_name}
      </h2>
      <p className="text-sm text-gray-500">{contact.position}</p>
      <p className="mt-1 text-sm text-gray-600">{contact.phone}</p>
    </Link>
  );
}
