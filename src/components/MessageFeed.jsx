import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../services/firebase';

function MessageFeed() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messagesRef = ref(db, 'messages');
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // 객체를 배열로 변환하고 최신순(timestamp 내림차순) 정렬
        const messageList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => b.timestamp - a.timestamp);
        setMessages(messageList);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex-col-gap">
      {messages.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
          아직 메시지가 없습니다.
        </div>
      ) : (
        messages.map((msg) => (
          <div key={msg.id} className="msg-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <p style={{ fontSize: '1rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{msg.content}</p>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              {new Date(msg.timestamp).toLocaleString()}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

export default MessageFeed;
