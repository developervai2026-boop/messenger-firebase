// Firebase v9+ Modular SDK (CDN থেকে ইমপোর্ট)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ⬇️ ধাপ ২ এ কপি করা কনফিগ এখানে পেস্ট করুন
const firebaseConfig = {
  apiKey: "AIzaSyCoxdcqFTVXQvZKC5gZ6n9kA0HewC0Ppeo",
  authDomain: "messenger-firebase-a71c2.firebaseapp.com",
  databaseURL: "https://messenger-firebase-a71c2-default-rtdb.firebaseio.com",
  projectId: "messenger-firebase-a71c2",
  storageBucket: "messenger-firebase-a71c2.firebasestorage.app",
  messagingSenderId: "512998909763",
  appId: "1:512998909763:web:4b07ff4a8f5791828231f6",
  measurementId: "G-VCTPS0Z12H"

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messagesRef = collection(db, "messages");

const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message-input");
const messagesDiv = document.getElementById("messages");

// 📨 মেসেজ সেভ করা
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;

  await addDoc(messagesRef, {
    text,
    sender: "User_" + Math.floor(Math.random() * 1000), // রিয়েল অ্যাপে Auth ব্যবহার করুন
    createdAt: serverTimestamp()
  });

  messageInput.value = "";
});

// 🔄 রিয়েল-টাইম লিসেনার
const q = query(messagesRef, orderBy("createdAt"));
onSnapshot(q, (snapshot) => {
  messagesDiv.innerHTML = "";
  snapshot.forEach((doc) => {
    const data = doc.data();
    const msgEl = document.createElement("div");
    msgEl.className = "msg";
    msgEl.innerHTML = `<strong>${data.sender}:</strong> ${data.text}
                       <div class="time">${data.createdAt?.toDate().toLocaleTimeString() || "..."}</div>`;
    messagesDiv.appendChild(msgEl);
  });
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
