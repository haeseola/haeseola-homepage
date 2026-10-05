import React from 'react';
import CalendarWidget from '../components/CalendarWidget';
import MessageFeed from '../components/MessageFeed';
import YouTubeGallery from '../components/YouTubeGallery';
import IdentitySection from '../components/IdentitySection';
import HeroSlider from '../components/HeroSlider';
import FanMessageForm from '../components/FanMessageForm';

function Home() {
  return (
    <div className="flex-col-gap" style={{ gap: '2.0rem' }}>
      
      {/* Hero Section */}
      <section className="hero-section" style={{
        paddingTop: '0',
        paddingBottom: '2rem',
        marginTop: '0'
      }}>
        <div className="hero-content"
          style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '1.2rem',
          paddingTop: '0'
          }}
        >
          <HeroSlider />
          <div className="hero-text">
            <h1 className="hero-title">💘해설아💘</h1>
            <div className="hero-subtitle">해설하는 사람</div>
            <div className="hero-desc">
              명문S대 · 대기업L사 · 유학파 석사 출신{'\n'}게임부터 역사까지, 하고 싶은 거 다 하는 중!
            </div>
            <div className="hero-links">
              <a href="https://www.youtube.com/@haeseola" target="_blank" rel="noreferrer" className="btn btn-primary" style={{ padding: '0.6rem 1rem', fontSize: '0.85rem', backgroundColor: '#FF0000' }}>
                ▶ YouTube
              </a>
              <a href="https://chzzk.naver.com/501e7d7f6c739901b845d7b9320e54b4" target="_blank" rel="noreferrer" className="btn btn-primary" style={{ padding: '0.6rem 1rem', fontSize: '0.85rem', backgroundColor: '#00FFA3', color: '#000' }}>
                ⚡ CHZZK
              </a>
              <a href="https://discord.gg/DbFk8ajrbu" target="_blank" rel="noreferrer" className="btn btn-primary" style={{ padding: '0.6rem 1rem', fontSize: '0.85rem', backgroundColor: '#5865F2' }}>
                💬 Discord
              </a>
            </div>
          </div>
        </div>
      </section>

      <IdentitySection />

      <section>
        <h2 className="section-title">주간 방송 일정</h2>
        <CalendarWidget />
      </section>

      <section>
        <h2 className="section-title">💘해설아가 온님에게💘</h2>
        <MessageFeed />
      </section>

      <section>
        <h2 className="section-title">💌 설아에게 메시지 보내기</h2>
        <FanMessageForm />
      </section>

      <section>
        <h2 className="section-title">해설아 유튜브</h2>
        <YouTubeGallery />
      </section>
    </div>
  );
}

export default Home;
