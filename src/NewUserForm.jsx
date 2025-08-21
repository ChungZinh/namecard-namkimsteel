import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

function NewUserForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    role: "",
    phone: "",
    email: "",
    about: "",
    social: "",
    socialText: "",
    zalo: "",
    slug: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Tự sinh slug khi nhập name
  useEffect(() => {
    const generateSlug = (name) => {
      return name
        .toLowerCase()
        .normalize("NFD") // tách dấu tiếng Việt
        .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
        .replace(/[^a-z0-9\s-]/g, "") // bỏ ký tự đặc biệt
        .trim()
        .replace(/\s+/g, "-"); // thay khoảng trắng bằng -
    };
    if (form.name) {
      setForm((prev) => ({ ...prev, slug: generateSlug(prev.name) }));
    }
  }, [form.name]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) setAvatarFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let avatarUrl = "";
      if (avatarFile) {
        const fileName = `${form.slug}-${Date.now()}.${avatarFile.name
          .split(".")
          .pop()}`;
        const { data, error } = await supabase.storage
          .from("image")
          .upload(fileName, avatarFile, { upsert: true });
        if (error) throw error;
        const { data: urlData } = supabase.storage
          .from("image")
          .getPublicUrl(fileName);
        avatarUrl = urlData.publicUrl;
      }

      // Lưu vào Firestore
      await addDoc(collection(db, "user"), {
        ...form,
        avatar: avatarUrl,
      });

      // Redirect sang vCard vừa tạo
      navigate(`/?u=${form.slug}`);
    } catch (err) {
      console.error("Lỗi tạo user:", err);
      alert("Tạo user thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold mb-4">Tạo user mới</h2>

        <input
          type="text"
          name="name"
          placeholder="Họ và tên"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />

        {/* Hiển thị slug tự sinh nhưng có thể sửa */}
        <input
          type="text"
          name="slug"
          placeholder="Slug (dùng cho URL)"
          value={form.slug}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="text"
          name="role"
          placeholder="Chức vụ"
          value={form.role}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          name="phone"
          placeholder="Số điện thoại"
          value={form.phone}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />

        <textarea
          name="about"
          placeholder="Giới thiệu"
          value={form.about}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          name="social"
          placeholder="Link social"
          value={form.social}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          name="socialText"
          placeholder="Text hiển thị social"
          value={form.socialText}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          name="zalo"
          placeholder="Zalo link hoặc số"
          value={form.zalo}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />

        {/* Upload avatar */}
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          disabled={loading}
        >
          {loading ? "Đang lưu..." : "Lưu"}
        </button>
      </form>
    </div>
  );
}

export default NewUserForm;
