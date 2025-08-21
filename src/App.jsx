import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import UserCard from "./UserCard";

export default function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "user"));
        const usersData = [];
        querySnapshot.forEach((doc) => {
          usersData.push({ id: doc.id, ...doc.data() });
        });
        setUsers(usersData);
      } catch (err) {
        console.error("Firebase error:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#0c5ba2] p-6 flex">
      <div className="bg-white flex-1 rounded-4xl shadow-lg">
        {/* rỗng vẫn fill full */}
      </div>
    </div>
  );
}
