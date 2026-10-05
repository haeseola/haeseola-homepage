import React from 'react';

function IdentitySection() {
  const cards = [
    { label: 'HUMAN', intro: '사람을 해설하다', keywords: '심리 · 정체성 · 철학' },
    { label: 'CULTURE', intro: '문화를 해설하다', keywords: '영화 · 버튜버 · 인터넷' },
    { label: 'HISTORY', intro: '과거를 해설하다', keywords: '역사 · 인물 · 사건' },
    { label: 'GAME', intro: '게임을 해설하다', keywords: '게임 · 게임문화' },
    { label: 'LIFE', intro: '삶을 해설하다', keywords: '여행 · 직장 · 경험', fullWidth: true }
  ];

  return (
    <section>
      <h2 className="section-title">해설아는 무엇을 해설할까?</h2>
      
      <div className="identity-grid">
        {cards.map((card, index) => (
          <div key={index} className={`card ${card.fullWidth ? 'identity-card-full' : ''}`} style={{ padding: '1.25rem' }}>
            <div className="identity-label">{card.label}</div>
            <div className="identity-intro">{card.intro}</div>
            <div className="identity-keywords">{card.keywords}</div>
          </div>
        ))}
      </div>

      <div className="identity-flow">
        <div className="identity-flow-step">QUESTION</div>
        <div className="identity-arrow">→</div>
        <div className="identity-flow-step">DISCOVER</div>
        <div className="identity-arrow">→</div>
        <div className="identity-flow-step">INTERPRET</div>
        <div className="identity-arrow">→</div>
        <div className="identity-flow-step identity-highlight">EXPLAIN</div>
      </div>
    </section>
  );
}

export default IdentitySection;
