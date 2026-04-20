import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, push, set, remove, onValue } from 'firebase/database';
import { auth, db } from '../services/firebase';

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Message Form State
  const [messageContent, setMessageContent] = useState('');
  const [messages, setMessages] = useState([]);

  // Calendar Form State
  const [calendarDay, setCalendarDay] = useState('monday');
  const [calendarContent, setCalendarContent] = useState('');
  const [schedule, setSchedule] = useState({});

  // Notification Form State
  const [notiTitle, setNotiTitle] = useState('');
  const [notiBody, setNotiBody] = useState('');

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/admin');
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    
    // Fetch Messages
    const msgsRef = ref(db, 'messages');
    const unsubMsgs = onValue(msgsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] })).sort((a,b) => b.timestamp - a.timestamp);
        setMessages(list);
      } else {
        setMessages([]);
      }
    });

    // Fetch Calendar
    const calRef = ref(db, 'calendar');
    const unsubCal = onValue(calRef, (snapshot) => {
      setSchedule(snapshot.val() || {});
    });

    return () => {
      unsubMsgs();
      unsubCal();
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const handleAddMessage = async (e) => {
    e.preventDefault();
    if (!messageContent.trim()) return;
    try {
      const msgsRef = ref(db, 'messages');
      await push(msgsRef, {
        content: messageContent,
        timestamp: Date.now()
      });
      setMessageContent('');
      alert('메시지가 등록되었습니다.');
    } catch (err) {
      alert('등록 실패: ' + err.message);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('이 메시지를 삭제하시겠습니까?')) return;
    try {
      await remove(ref(db, `messages/${id}`));
    } catch (err) {
      alert('삭제 실패: ' + err.message);
    }
  };

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    if (!calendarContent.trim()) return;
    try {
      await set(ref(db, `calendar/${calendarDay}`), calendarContent);
      setCalendarContent('');
      alert('일정이 등록되었습니다.');
    } catch (err) {
      alert('등록 실패: ' + err.message);
    }
  };

  const handleDeleteSchedule = async (dayKey) => {
    if (!window.confirm('해당 요일의 일정을 삭제하시겠습니까? (휴방으로 표시됩니다)')) return;
    try {
      await remove(ref(db, `calendar/${dayKey}`));
    } catch (err) {
      alert('삭제 실패: ' + err.message);
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!notiTitle.trim() || !notiBody.trim()) return;
    if (!window.confirm('저장된 모든 기기로 푸시 알림 발송 요청을 저장할까요?')) return;
    try {
      const notiRef = ref(db, 'pending-notifications');
      await push(notiRef, {
        title: notiTitle,
        body: notiBody,
        timestamp: Date.now()
      });
      setNotiTitle('');
      setNotiBody('');
      alert('알림 전송 요청이 대기열(pending-notifications)에 저장되었습니다. Python 스크립트를 실행하여 실제 알림을 발송하세요.');
    } catch (err) {
      alert('요청 실패: ' + err.message);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>인증 확인 중...</div>;

  const daysList = [
    { key: 'monday', label: '월요일' },
    { key: 'tuesday', label: '화요일' },
    { key: 'wednesday', label: '수요일' },
    { key: 'thursday', label: '목요일' },
    { key: 'friday', label: '금요일' },
    { key: 'saturday', label: '토요일' },
    { key: 'sunday', label: '일요일' },
  ];

  return (
    <div className="flex-col-gap" style={{ gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ letterSpacing: '-0.02em' }}>관리자 대시보드</h2>
        <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>로그아웃</button>
      </div>

      {/* 데일리 메시지 관리 */}
      <section className="card">
        <h3 className="section-title" style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>데일리 메시지 등록</h3>
        <form onSubmit={handleAddMessage}>
          <textarea
            placeholder="오늘의 메시지를 입력하세요..."
            value={messageContent}
            onChange={e => setMessageContent(e.target.value)}
            className="input-base"
            style={{ minHeight: '100px', resize: 'vertical', marginBottom: '1rem' }}
            required
          />
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>메시지 등록</button>
        </form>

        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h4 style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>등록된 메시지 목록</h4>
          {messages.length === 0 ? <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>메시지가 없습니다.</p> : 
            messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-bg)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ flex: 1, marginRight: '1rem' }}>
                  <p style={{ fontSize: '0.95rem', whiteSpace: 'pre-wrap', marginBottom: '4px' }}>{msg.content}</p>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{new Date(msg.timestamp).toLocaleString()}</span>
                </div>
                <button onClick={() => handleDeleteMessage(msg.id)} className="btn" style={{ backgroundColor: '#ff6b6b', color: 'white', padding: '0.5rem 0.8rem', fontSize: '0.8rem' }}>삭제</button>
              </div>
            ))
          }
        </div>
      </section>

      {/* 방송 일정 관리 */}
      <section className="card">
        <h3 className="section-title" style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>방송 일정 등록</h3>
        <form onSubmit={handleAddSchedule} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
          <select value={calendarDay} onChange={e => setCalendarDay(e.target.value)} className="input-base" style={{ width: 'auto' }}>
            {daysList.map(day => <option key={day.key} value={day.key}>{day.label}</option>)}
          </select>
          <input
            type="text"
            placeholder="예: 20:00 저챗 및 종겜"
            value={calendarContent}
            onChange={e => setCalendarContent(e.target.value)}
            className="input-base"
            style={{ flex: 1, minWidth: '150px' }}
            required
          />
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>일정 등록</button>
        </form>

        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h4 style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>이번 주 일정 내역</h4>
          {daysList.map(day => (
             schedule[day.key] ? (
              <div key={day.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-bg)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ flex: 1 }}>
                  <strong style={{ display: 'inline-block', width: '60px', color: 'var(--color-accent-light)' }}>{day.label}</strong>
                  <span style={{ fontSize: '0.95rem' }}>{schedule[day.key]}</span>
                </div>
                <button onClick={() => handleDeleteSchedule(day.key)} className="btn" style={{ backgroundColor: '#ff6b6b', color: 'white', padding: '0.5rem 0.8rem', fontSize: '0.8rem' }}>삭제</button>
              </div>
             ) : null
          ))}
          {Object.keys(schedule).length === 0 && <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>등록된 일정이 없습니다.</p>}
        </div>
      </section>

      {/* 푸시 알림 발송 */}
      <section className="card">
        <h3 className="section-title" style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>전체 푸시 알림 보내기</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>제목과 내용을 입력하여 구독한 모든 유저에게 알림을 보냅니다.</p>
        <form onSubmit={handleSendNotification} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <input
            type="text"
            placeholder="알림 제목 (예: 방송 켰습니다!)"
            value={notiTitle}
            onChange={e => setNotiTitle(e.target.value)}
            className="input-base"
            required
          />
          <textarea
            placeholder="알림 내용 (예: 지금 바로 보러오세요!)"
            value={notiBody}
            onChange={e => setNotiBody(e.target.value)}
            className="input-base"
            style={{ minHeight: '80px', resize: 'vertical' }}
            required
          />
          <button type="submit" className="btn" style={{ backgroundColor: 'var(--color-gold)', color: '#2A2A2E', marginTop: '0.5rem' }}>전체 알림 발송</button>
        </form>
      </section>

    </div>
  );
}

export default AdminDashboard;
