import React from "react";
import { useParams } from "react-router-dom";
import contacts from "./contact.json";
import { QRCodeCanvas } from "qrcode.react";

function generateVCard(c) {
  return `BEGIN:VCARD
VERSION:3.0
FN:${c.full_name}
TEL;TYPE=CELL:${c.phone}
EMAIL:${c.email}
ORG:${c.company}
TITLE:${c.position}
END:VCARD`;
}

export default function VCardDetail() {
  const { slug } = useParams();
  const contact = contacts.find((c) => c.slug === slug);

  if (!contact) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-500">❌ Không tìm thấy vCard!</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        <img
          src={contact.avatar}
          alt={contact.full_name}
          className="w-32 h-32 mx-auto rounded-full shadow-md border-4 border-white -mt-20"
        />

        <h1 className="mt-6 text-2xl font-extrabold text-gray-800">
          {contact.full_name}
        </h1>
        <p className="text-gray-500 mt-1">
          {contact.position} <span className="text-gray-400">@</span>{" "}
          {contact.company}
        </p>

        <div className="mt-6 space-y-2 text-left">
          <p className="flex items-center justify-center gap-2 text-gray-700">
            <span className="font-medium">📞</span> {contact.phone}
          </p>
          <p className="flex items-center justify-center gap-2 text-gray-700">
            <span className="font-medium">✉️</span> {contact.email}
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <p className="text-sm text-gray-500 mb-2">Quét mã QR để lưu liên hệ</p>
          <div className="bg-white p-3 rounded-lg shadow-md">
            <QRCodeCanvas value={generateVCard(contact)} size={180} />
          </div>
        </div>
      </div>
    </div>
  );
}
