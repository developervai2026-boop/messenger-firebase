// Firebase v9+ Modular SDK ইমপোর্ট
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ⬇️ আপনার Firebase Config (ধাপ ১ থেকে কপি করা)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  // ⚠️ Web Push Config (Project Settings > Cloud Messaging থেকে পাওয়া)
  vapidKey: "BEyU23T9IyqVgiB-asVo1IiKTg29avmJx8Fqu2yIq6GUOfc8yYsQGgzZBoZUk8cwXGK8jhB3JA3-q31NOrWcNzk" 
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const db = getFirestore(app);

// 🔄 টোকেন জেনারেট এবং সেভ করার ফাংশন
export async function requestPermissionAndSaveToken(userId) {
  try {
    // ১. ব্রাউজার থেকে নোটিফিকেশন পারমিশন চাওয়া
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      // ২. FCM টোকেন জেনারেট
      const token = await getToken(messaging, { 
        vapidKey: firebaseConfig.vapidKey 
      });
      
      if (token) {
        console.log('FCM Token:', token);
        
        // ৩. টোকেন ফায়ারস্টোরে সেভ করা (ইউজার আইডি অনুযায়ী)
        await setDoc(doc(db, "user_tokens", userId), {
          fcmToken: token,
          updatedAt: new Date()
        }, { merge: true });
        
        return token;
      }
    } else {
      console.log('নোটিফিকেশন পারমিশন দেওয়া হয়নি');
    }
  } catch (err) {
    console.error('Token error:', err);
  }
}

// 📨 ফোরগ্রাউন্ড মেসেজ রিসিভ করা (অ্যাপ ওপেন থাকলে)
onMessage(messaging, (payload) => {
  console.log('Foreground message received:', payload);
  alert(`নতুন মেসেজ: ${payload.notification?.title}`);
  // এখানে কাস্টম নোটিফিকেশন UI বানাতে পারেন
});
