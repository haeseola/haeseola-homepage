import React, { useState, useEffect } from 'react';

function YouTubeGallery() {
  const [shorts, setShorts] = useState([]);
  const [vods, setVods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
        const channelId = import.meta.env.VITE_YOUTUBE_CHANNEL_ID;
        
        if (!apiKey || !channelId) {
          throw new Error('API 키 또는 채널 ID가 설정되지 않았습니다.');
        }

        // Search API로 최근 15개 비디오 가져오기
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&order=date&maxResults=15&type=video`
        );
        
        if (!response.ok) {
          throw new Error('YouTube 데이터를 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        
        if (data.items.length === 0) {
           setLoading(false);
           return;
        }

        const videoIds = data.items.map(item => item.id.videoId).join(',');
        
        // videos API를 호출하여 영상 길이(duration) 가져오기
        const videosResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds}&part=contentDetails`
        );
        
        if (!videosResponse.ok) {
           throw new Error('비디오 상세 정보를 불러오는데 실패했습니다.');
        }
        
        const videosData = await videosResponse.json();
        const durationMap = {};
        videosData.items.forEach(v => {
           durationMap[v.id] = v.contentDetails.duration; // ex: "PT15S", "PT1H2M30S"
        });

        const fetchedShorts = [];
        const fetchedVods = [];

        data.items.forEach(item => {
          const videoId = item.id.videoId;
          const duration = durationMap[videoId] || '';
          
          // PT#H#M#S 형식 파싱 (간단히 M, H가 없고 S가 60 이하인지 체크)
          // 정규식: M이나 H가 포함되어 있으면 1분 이상
          const isOverMinute = duration.includes('M') || duration.includes('H');
          const isShort = !isOverMinute; // 1분 이하면 숏츠로 간주

          const title = item.snippet.title.toLowerCase();
          const desc = item.snippet.description.toLowerCase();
          
          // 해시태그로도 판별
          const hasShortsTag = title.includes('shorts') || title.includes('쇼츠') || desc.includes('shorts') || desc.includes('쇼츠');

          const videoData = {
            id: videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
            date: new Date(item.snippet.publishedAt).toLocaleDateString()
          };

          if (isShort || hasShortsTag) {
            fetchedShorts.push(videoData);
          } else {
            fetchedVods.push(videoData);
          }
        });

        setShorts(fetchedShorts);
        setVods(fetchedVods);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>영상을 불러오는 중입니다...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: '#ff6b6b' }}>오류: {error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Shorts Section */}
      {shorts.length > 0 && (
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#FF0000' }}>▶</span> 최신 숏츠
          </h3>
          <div style={{ 
            display: 'flex', 
            overflowX: 'auto', 
            gap: '1.25rem', 
            paddingBottom: '1rem',
            scrollbarWidth: 'none'
          }}>
            {shorts.map(short => (
              <a key={short.id} href={`https://www.youtube.com/watch?v=${short.id}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card" style={{
                  flex: '0 0 auto',
                  width: '140px',
                  padding: '0',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ width: '100%', height: '250px', overflow: 'hidden' }}>
                    <img src={short.thumbnail} alt={short.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform var(--transition-normal)' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                  </div>
                  <div style={{ padding: '0.8rem' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: '500', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{short.title}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* VODs Section */}
      {vods.length > 0 && (
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#FF0000' }}>▶</span> 최근 방송 (VOD)
          </h3>
          <div className="flex-col-gap">
            {vods.map(vod => (
              <a key={vod.id} href={`https://www.youtube.com/watch?v=${vod.id}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer' }}>
                  <div className="youtube-thumb-container" style={{ marginBottom: 0 }}>
                    <img src={vod.thumbnail} alt={vod.title} className="youtube-thumb-img" />
                  </div>
                  <div>
                    <p style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{vod.title}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{vod.date}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {shorts.length === 0 && vods.length === 0 && (
         <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>최근 영상이 없습니다.</div>
      )}
    </div>
  );
}

export default YouTubeGallery;
