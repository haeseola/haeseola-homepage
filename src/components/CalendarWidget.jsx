import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../services/firebase';

function CalendarWidget() {
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    const calendarRef = ref(db, 'calendar');
    const unsubscribe = onValue(calendarRef, (snapshot) => {
      const data = snapshot.val();
      setSchedule(data);
    });

    return () => unsubscribe();
  }, []);

  const days = [
    { key: 'monday', label: '월' },
    { key: 'tuesday', label: '화' },
    { key: 'wednesday', label: '수' },
    { key: 'thursday', label: '목' },
    { key: 'friday', label: '금' },
    { key: 'saturday', label: '토', color: '#A98FCC' },
    { key: 'sunday', label: '일', color: '#ff6b6b' },
  ];

  return (
    <div className="card">
      {!schedule ? (
        <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', margin: '1rem 0' }}>이번 주 일정이 없습니다.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(50px, 1fr))', gap: '10px' }}>
          {days.map(day => (
            <div key={day.key} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '0.8rem 0.5rem',
              backgroundColor: 'var(--color-bg)',
              borderRadius: '8px',
              border: `1px solid ${schedule[day.key] ? 'var(--color-accent)' : 'transparent'}`,
              transition: 'transform var(--transition-fast), border-color var(--transition-fast)',
              cursor: 'default'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--color-accent-light)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = schedule[day.key] ? 'var(--color-accent)' : 'transparent'; }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: day.color || 'var(--color-text-muted)', marginBottom: '6px' }}>
                {day.label}
              </span>
              <span style={{ fontSize: '0.8rem', textAlign: 'center', wordBreak: 'keep-all', color: schedule[day.key] ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
                {schedule[day.key] || '휴방'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CalendarWidget;
