import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else if (err.code === 'auth/invalid-email') {
        setError('유효하지 않은 이메일 형식입니다.');
      } else {
        setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '0 auto', marginTop: '2rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>관리자 로그인</h2>
      {error && <div style={{ color: '#ff6b6b', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
      <form onSubmit={handleLogin} className="flex-col-gap" style={{ gap: '1rem' }}>
        <input
          type="email"
          placeholder="관리자 이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-base"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-base"
        />
        <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
          로그인
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
