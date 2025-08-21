// convert.js
import * as XLSX from "xlsx";
import fs from "fs";

// Đọc file excel (file bạn tạo trước đó: vcard_contacts.xlsx)
const workbook = XLSX.readFile("./vcard_contacts.xlsx");
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Chuyển sang JSON
const data = XLSX.utils.sheet_to_json(sheet);

// Hàm tạo slug (ví dụ "Nguyễn Văn A" -> "nguyen-van-a")
function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD") // bỏ dấu tiếng Việt
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// Gắn thêm slug + id
const contacts = data.map((c, idx) => ({
  id: idx + 1,
  slug: slugify(c.FullName || `contact-${idx}`),
  full_name: c.FullName,
  phone: c.Phone,
  email: c.Email,
  company: c.Company,
  position: c.Position,
  avatar: c.Avatar || "https://via.placeholder.com/150"
}));

// Lưu ra file JSON
fs.writeFileSync("contacts.json", JSON.stringify(contacts, null, 2), "utf-8");

console.log("✅ Đã tạo contacts.json thành công!");
