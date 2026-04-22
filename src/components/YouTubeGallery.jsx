import React, { useState, useEffect } from 'react';

function YouTubeGallery() {
  const [shorts, setShorts] = useState([]);
  const [vods, setVods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const channelId = "UCAGeAW20MJMXIXWPNLvr0cQ";
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
        
        // 🚨 수정됨: AllOrigins 대신 corsproxy.io 사용
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(rssUrl)}`;

        const res = await fetch(proxyUrl);

        if (!res.ok) {
          throw new Error("네트워크 응답이 실패했습니다.");
        }

        // 🚨 수정됨: JSON이 아닌 원본 XML 텍스트를 바로 가져옴
        const xmlText = await res.text();

        // XML 데이터 파싱
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        const entries = xmlDoc.querySelectorAll("entry");

        if (entries.length === 0) {
          throw new Error("유튜브 데이터 없음");
        }

        const shortsArr = [];
        const vodsArr = [];

        Array.from(entries).forEach((entry) => {
          const videoId = entry.querySelector("yt\\:videoId").textContent;
          const title = entry.querySelector("title").textContent;
          const date = new Date(entry.querySelector("published").textContent).toLocaleDateString();
          const link = `https://www.youtube.com/watch?v=${videoId}`;
          
          // 썸네일 추출
          const mediaGroup = entry.getElementsByTagName("media:group")[0];
          const thumbnail = mediaGroup 
            ? mediaGroup.getElementsByTagName("media:thumbnail")[0].getAttribute("url") 
            : '';

          // 숏츠 판별 로직
          const isShort =
            title.toLowerCase().includes("short") ||
            title.includes("#쇼츠") ||
            title.includes("#shorts");

          const videoData = {
            id: videoId,
            title,
            thumbnail,
            date,
            link,
          };

          if (isShort) shortsArr.push(videoData);
          else vodsArr.push(videoData);
        });

        setShorts(shortsArr);
        setVods(vodsArr);
      } catch (err) {
        console.error("RSS 피드 파싱 에러:", err);
        setError("영상 불러오기 실패");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
        영상을 불러오는 중...
      </div>
    );

  if (error)
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#ff6b6b' }}>
        잠시 후 다시 시도해주세요.
      </div>
    );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 숏츠 영역 */}
      {shorts.length > 0 && (
        <div>
          <h3 style={{ marginBottom: '1rem' }}>
            <span style={{ color: '#FF0000' }}>▶</span> 최신 숏츠
          </h3>

          <div style={{ display: 'flex', overflowX: 'auto', gap: '1rem' }}>
            {shorts.map((short) => (
              <a key={short.id} href={short.link} target="_blank" rel="noreferrer">
                <div style={{ width: '140px' }}>
                  <img
                    src={short.thumbnail}
                    alt={short.title}
                    style={{ width: '100%', borderRadius: '10px' }}
                  />
                  <p style={{ fontSize: '0.8rem' }}>{short.title}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* VOD 영역 */}
      {vods.length > 0 && (
        <div>
          <h3 style={{ marginBottom: '1rem' }}>
            <span style={{ color: '#FF0000' }}>▶</span> 최근 방송
          </h3>

          {vods.map((vod) => (
            <a key={vod.id} href={vod.link} target="_blank" rel="noreferrer">
              <div style={{ marginBottom: '1rem' }}>
                <img
                  src={vod.thumbnail}
                  alt={vod.title}
                  style={{ width: '100%', borderRadius: '10px' }}
                />
                <p>{vod.title}</p>
                <p style={{ fontSize: '0.8rem', color: '#aaa' }}>{vod.date}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default YouTubeGallery;
