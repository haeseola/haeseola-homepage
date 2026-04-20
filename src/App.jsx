import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getToken } from 'firebase/messaging';
import { ref, set } from 'firebase/database';
import { messaging, db } from './services/firebase';
import Layout from './components/Layout';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  useEffect(() => {
    const requestPermissionAndGetToken = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
          if (vapidKey) {
            const token = await getToken(messaging, { vapidKey });
            if (token) {
              await set(ref(db, `fcmTokens/${token}`), true);
            }
          } else {
            console.warn('VITE_FIREBASE_VAPID_KEY 환경변수가 설정되지 않아 알림 토큰을 발급받을 수 없습니다.');
          }
        }
      } catch (err) {
        console.error('FCM 권한 요청 오류:', err);
      }
    };
    
    requestPermissionAndGetToken();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="admin" element={<AdminLogin />} />
          <Route path="admin/dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
