import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"; // để lấy ?u=slug
import { db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function App() {
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy slug từ URL (?u=slug)
  const slug = searchParams.get("u");

  useEffect(() => {
    const fetchUser = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }
      try {
        // Query theo field slug
        const q = query(collection(db, "user"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Lấy user đầu tiên
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

  // Hàm tạo vCard
  const handleAddContact = () => {
    const company = "Công ty cổ phần thép Nam Kim";
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${user.name}
ORG:${company}
TITLE:${user.role}
TEL;TYPE=CELL:${user.phone}
EMAIL:${user.email}
END:VCARD`;

    const blob = new Blob([vcard], { type: "text/vcard" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${user.name}.vcf`;
    document.body.appendChild(link); // thêm vào body
    link.click(); // trigger download
    document.body.removeChild(link); // xóa link sau khi download
  };

  return (
    <div className="min-h-screen w-full bg-white p-6 flex">
      <div className="bg-white flex-1 rounded-4xl shadow-lg">
        {/* Header */}
        <div
          className="relative flex h-[240px] flex-col items-center justify-start bg-cover bg-top text-white rounded-t-4xl"
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
          <div className="mt-3 text-lg font-bold  py-1 px-2 bg-white rounded-4xl text-black ">
            {user.name}
          </div>
          <div className="text-sm font-bold py-1 px-2 bg-white rounded-4xl mt-2 text-black">
            {user.role}
          </div>
          <button
            onClick={handleAddContact}
            className="mt-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-indigo-600 shadow 
             hover:bg-indigo-600 hover:text-white 
             active:scale-95 active:bg-indigo-700
             transition transform duration-150"
          >
            + Thêm liên hệ
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
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
                href={user.zalo}
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
      </div>
    </div>
  );
}
