import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "./supabase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import NewUserForm from "./NewUserForm";

export default function App() {
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

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
ORG:Công ty cổ phần Thép Nam Kim
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

      setToast("Thêm liên hệ thành công!");
      setTimeout(() => setToast(""), 3000);
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
  return <NewUserForm />;
}

  return (
    <div className="min-h-screen w-full bg-gray-100 p-6 flex flex-col items-center">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-md overflow-hidden flex flex-col flex-1">
        {/* Header */}
        <div
          className="relative flex flex-col items-center justify-center bg-cover bg-top text-white h-64 sm:h-72 md:h-80"
          style={{
            backgroundImage:
              "url('https://ejgcugnvtmhdxpdonhwa.supabase.co/storage/v1/object/public/image/bg.jpg')",
          }}
        >
          {/* Logo */}
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

          {/* Avatar */}
          <img
            src={user.avatar}
            alt="Avatar"
            className="h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36 rounded-full border-4 border-white bg-white object-cover shadow-md"
          />

          {/* Name */}
          <div className="mt-3 text-lg sm:text-xl md:text-2xl font-bold py-1 px-4 bg-white rounded-full text-black">
            {user.name}
          </div>

          {/* Role */}
          <div className="mt-2 text-sm sm:text-base md:text-lg font-bold py-1 px-4 bg-white rounded-full text-black">
            {user.role}
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col gap-3 justify-between w-full">
          <div className="flex-1 flex  h-full flex-col justify-between">
            {/* Info */}
            <div className="p-4 flex-1 flex flex-col gap-3">
              {/* Giới thiệu */}
              <div className="w-full rounded-lg bg-gray-50 p-3 shadow-sm">
                <strong className="block text-gray-700 mb-1">Giới thiệu</strong>
                <p>{user.about || "Chưa có thông tin giới thiệu."}</p>
              </div>

              {/* Email */}
              <div className="w-full rounded-lg bg-gray-50 p-3 shadow-sm">
                <strong className="block text-gray-700 mb-1">Email</strong>
                <a
                  href={`mailto:${user.email}`}
                  className="text-indigo-600 w-full block"
                >
                  {user.email}
                </a>
              </div>

              {/* Phone */}
              <div className="w-full rounded-lg bg-gray-50 p-3 shadow-sm">
                <strong className="block text-gray-700 mb-1">Phone</strong>
                <a
                  href={`tel:${user.phone}`}
                  className="text-indigo-600 w-full block"
                >
                  {user.phone}
                </a>
              </div>

              {/* Social */}
              <div className="w-full rounded-lg bg-gray-50 p-3 shadow-sm flex items-center gap-3">
                <div className="flex-1">
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
            <div className="flex-none p-4  justify-center">
              <button
                onClick={handleAddContact}
                className="w-full rounded-full bg-indigo-600 px-6 py-3 text-white font-semibold shadow 
                       hover:bg-indigo-700 active:scale-95 transition transform duration-150"
              >
                + Thêm liên hệ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Nút thêm liên hệ full-width xuống cuối */}

      {/* Push-up thông báo */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md animate-slideUp">
          {toast}
        </div>
      )}
    </div>
  );
}
