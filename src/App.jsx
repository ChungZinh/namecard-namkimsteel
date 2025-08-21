import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "./supabase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export default function App() {
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(""); // state thông báo

  const slug = searchParams.get("u");

  useEffect(() => {
    const fetchUser = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }
      try {
        const q = query(collection(db, "user"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          setUser({ id: docSnap.id, ...docSnap.data() });
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Firebase error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [slug]);

  const handleAddContact = async () => {
    if (!user) return;

    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${user.name}
ORG:Công ty Nam Kim
TITLE:${user.role}
TEL;TYPE=CELL:${user.phone}
EMAIL:${user.email}
END:VCARD`;

    const file = new Blob([vcard], { type: "text/vcard" });
    const fileName = `${user.slug}-${Date.now()}.vcf`;

    try {
      const { data, error } = await supabase.storage
        .from("vcards")
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("vcards")
        .getPublicUrl(fileName);

      const publicURL = urlData.publicUrl;

      const a = document.createElement("a");
      a.href = publicURL;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // hiện push-up thông báo
      setToast("Thêm liên hệ thành công!");
      setTimeout(() => setToast(""), 3000); // 3s tự ẩn
    } catch (err) {
      console.error("Lỗi upload vCard:", err);
      setToast("Lỗi khi thêm liên hệ!");
      setTimeout(() => setToast(""), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <p className="text-gray-600">Đang tải...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <p className="text-red-500">Không tìm thấy user!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 p-6 flex flex-col items-center">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div
          className="relative flex h-[240px] flex-col items-center justify-start bg-cover bg-top text-white"
          style={{
            backgroundImage:
              "url('https://ejgcugnvtmhdxpdonhwa.supabase.co/storage/v1/object/public/image/bg.jpg')",
          }}
        >
          <a
            href="https://tonnamkim.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute left-2 top-2"
          >
            <img
              src="https://ejgcugnvtmhdxpdonhwa.supabase.co/storage/v1/object/public/image/logo.png"
              alt="Logo"
              className="w-[100px]"
            />
          </a>
          <img
            src={user.avatar}
            alt="Avatar"
            className="mt-10 h-[120px] w-[120px] rounded-full border-4 border-white bg-white object-cover shadow-md"
          />
          <div className="mt-3 text-lg font-bold py-1 px-4 bg-white rounded-full text-black">
            {user.name}
          </div>
          <div className="text-sm font-bold py-1 px-4 bg-white rounded-full mt-2 text-black">
            {user.role}
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex-1">
          <div className="mb-3 rounded-lg bg-gray-50 p-3 shadow-sm">
            <strong className="block text-gray-700 mb-1">Giới thiệu</strong>
            <p>{user.about || "Chưa có thông tin giới thiệu."}</p>
          </div>
          <div className="mb-3 rounded-lg bg-gray-50 p-3 shadow-sm">
            <strong className="block text-gray-700 mb-1">Email</strong>
            <a href={`mailto:${user.email}`} className="text-indigo-600">
              {user.email}
            </a>
          </div>
          <div className="mb-3 rounded-lg bg-gray-50 p-3 shadow-sm">
            <strong className="block text-gray-700 mb-1">Phone</strong>
            <a href={`tel:${user.phone}`} className="text-indigo-600">
              {user.phone}
            </a>
          </div>
          <div className="mb-3 rounded-lg bg-gray-50 p-3 shadow-sm flex items-center gap-3">
            <div>
              <strong className="block text-gray-700 mb-1">Social</strong>
              <a
                href={user.social}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600"
              >
                {user.socialText || user.social}
              </a>
            </div>
            {user.zalo && (
              <a
                href={
                  user.zalo.startsWith("http")
                    ? user.zalo
                    : `https://${user.zalo}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto"
              >
                <img
                  src="/images/zalo-icon.png"
                  alt="Zalo"
                  className="h-6 w-6"
                />
              </a>
            )}
          </div>
        </div>

        {/* Nút thêm liên hệ xuống cuối */}
        <div className="p-4 flex justify-center">
          <button
            onClick={handleAddContact}
            className="rounded-full bg-indigo-600 px-6 py-3 text-white font-semibold shadow 
                       hover:bg-indigo-700 active:scale-95 transition transform duration-150"
          >
            + Thêm liên hệ
          </button>
        </div>
      </div>

      {/* Push-up thông báo */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md animate-slideUp">
          {toast}
        </div>
      )}
    </div>
  );
}
