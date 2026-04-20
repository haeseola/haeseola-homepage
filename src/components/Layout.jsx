import React, { useEffect, useRef } from 'react';
import { Outlet, Link } from 'react-router-dom';

function Layout() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random(),
        speed: Math.random() * 0.015 + 0.005,
      });
    }

    let animationFrameId;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.alpha += p.speed;
        if (p.alpha >= 1 || p.alpha <= 0) {
          p.speed *= -1;
        }
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, p.alpha)})`;
        ctx.fill();
      });
      
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="layout">
      <canvas ref={canvasRef} className="global-canvas"></canvas>
      <div className="global-light-purple"></div>
      <div className="global-light-gold"></div>

      <header className="header-glass">
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '480px', margin: '0 auto', padding: '1.2rem 1.5rem' }}>
          <Link to="/" style={{ color: 'var(--color-text)', fontWeight: 'bold', fontSize: '1.3rem', textDecoration: 'none', letterSpacing: '-0.02em' }}>
            해설아
          </Link>
          <Link to="/admin" style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            관리자
          </Link>
        </nav>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
