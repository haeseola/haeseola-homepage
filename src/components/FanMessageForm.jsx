import React, { useState } from 'react';
import { ref, push, serverTimestamp } from 'firebase/database';
import { db } from '../services/firebase'; // 경로가 맞는지 확인 필요

const FanMessageForm = () => {
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null); // 'success', 'error' 등

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nickname.trim() || !message.trim()) return;

    try {
      const messagesRef = ref(db, 'fanMessages');
      await push(messagesRef, {
        nickname: nickname.trim(),
        message: message.trim(),
        timestamp: serverTimestamp(),
        isRead: false
      });

      setNickname('');
      setMessage('');
      setStatus('success');

      // 3.5초 뒤 성공 메시지 사라짐
      setTimeout(() => setStatus(null), 3500);
    } catch (error) {
      console.error("메시지 전송 실패:", error);
      setStatus('error');
      setTimeout(() => setStatus(null), 3000);
    }
  };

  return (
    <div className="fan-message-container">
      <form onSubmit={handleSubmit} className="fan-message-form">
        <input
          type="text"
          placeholder="닉네임 (최대 20자)"
          value={nickname}
          onChange={(e) => setNickname(e.target.value.slice(0, 20))}
          className="form-input"
          required
        />
        <textarea
          placeholder="해설아님에게 메시지를 남겨보세요! (최대 200자)"
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, 200))}
          className="form-textarea"
          required
        />
        <button type="submit" className="btn-submit">메시지 보내기 💜</button>
      </form>

      {status === 'success' && (
        <div className="status-message success-anim">
          메시지가 전달됐습니다 💜
        </div>
      )}
      {status === 'error' && (
        <div className="status-message error">
          전송에 실패했어요. 다시 시도해주세요.
        </div>
      )}
    </div>
  );
};

export default FanMessageForm;
