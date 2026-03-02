"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

export default function InvitationPage() {
  const [dDay, setDDay] = useState(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef(null);
  const fadeTimerRef = useRef(null);

  // 30초 후 페이드아웃
  const startFadeTimer = () => {
    fadeTimerRef.current = setTimeout(() => {
      const audio = audioRef.current;
      if (!audio) return;
      let vol = audio.volume;
      const fadeOut = setInterval(() => {
        vol -= 0.05;
        if (vol <= 0) {
          audio.pause();
          audio.volume = 0;
          setIsMusicPlaying(false);
          clearInterval(fadeOut);
        } else {
          audio.volume = vol;
        }
      }, 100);
    }, 88000);
  };

  // 첫 터치/클릭 시 자동 재생
  useEffect(() => {
    let started = false;
    const tryPlay = () => {
      const audio = audioRef.current;
      if (!audio || started) return;
      audio.volume = 0.5;
      audio.currentTime = 0;
      audio.play().then(() => {
        started = true;
        setIsMusicPlaying(true);
        startFadeTimer();
      }).catch(() => { });
    };
    const handleInteraction = () => {
      tryPlay();
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };
    document.addEventListener("click", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);
    tryPlay(); // 바로 시도
    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMusicPlaying) {
      audio.pause();
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      setIsMusicPlaying(false);
    } else {
      audio.volume = 0.5;
      audio.currentTime = 0;
      audio.play().then(() => {
        setIsMusicPlaying(true);
        startFadeTimer();
      }).catch(() => { });
    }
  };

  // D-Day calculation
  useEffect(() => {
    const eventDate = new Date("2026-08-16T11:30:00+09:00");
    const now = new Date();
    const diff = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));
    if (diff > 0) {
      setDDay(`D-${diff}`);
    } else if (diff === 0) {
      setDDay("D-Day");
    } else {
      setDDay(`D+${Math.abs(diff)}`);
    }
  }, []);

  // Scroll-based fade-in animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Falling petals effect
  useEffect(() => {
    const container = document.querySelector(".petals-container");
    if (!container) return;

    const petalsCount = 12;
    for (let i = 0; i < petalsCount; i++) {
      const petal = document.createElement("div");
      petal.className = "petal";
      petal.innerHTML = "🌸";
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.fontSize = `${10 + Math.random() * 12}px`;
      petal.style.animationDuration = `${5 + Math.random() * 5}s`;
      petal.style.animationDelay = `${Math.random() * 3}s`;
      container.appendChild(petal);
    }

    const timer = setTimeout(() => {
      if (container) container.innerHTML = "";
    }, 10000);

    return () => clearTimeout(timer);
  }, []);


  const handleShare = async () => {
    const shareData = {
      title: "이순자 여사님 칠순 잔치 초대장",
      text: "따뜻한 축하의 자리에 초대합니다 💐\n2026년 8월 16일 | 채림웨딩홀",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch { }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("초대장 링크가 복사되었습니다!");
      } catch {
        alert("링크를 복사할 수 없습니다.");
      }
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/bgm.mp3" preload="auto" />
      <button className={`bgm-toggle ${isMusicPlaying ? 'playing' : ''}`} onClick={toggleMusic}>
        <span className="bgm-icon">{isMusicPlaying ? '🎵' : '🎵'}</span>
        <span className="bgm-label">{isMusicPlaying ? '끄기' : '재생'}</span>
      </button>
      <div className="petals-container" />
      <div className="invitation-wrapper">
        {/* ===== Hero Section ===== */}
        <section className="hero-section" id="hero">
          <div className="hero-content">
            <p className="hero-eyebrow">INVITATION</p>
            <h1 className="hero-title">
              <span className="name">이순자</span>
              <span className="honorific">여사님의</span>
            </h1>
            <p className="hero-event">칠순 잔치에 초대합니다</p>
            <div className="hero-date-chip">
              <span>2026. 08. 16 SUN</span>
            </div>
            {dDay && <span className="dday-badge">{dDay}</span>}
          </div>
          <div className="hero-photo-wrapper">
            <Image
              src="/images/mom-hero.jpg"
              alt="어머니 사진"
              width={360}
              height={480}
              className="hero-mom-photo"
              priority
            />
            <div className="hero-photo-caption">
              <span>70년만의 엄마가 아닌 주인공 🎤</span>
              <span>오늘의 주인공은 나야 나! 🌟</span>
            </div>
          </div>
        </section>

        {/* ===== Divider ===== */}
        <div className="divider-line">
          <span className="divider-dot" />
        </div>

        {/* ===== Greeting Section ===== */}
        <section className="greeting-section fade-in" id="greeting">
          <p className="section-label">인사말</p>
          <div className="greeting-text">
            <p>
              살아온 날도 아름답지만
              <br />
              살아갈 날은 더욱 빛날
              <br />
              저희 어머니의 칠순을 맞이하여
              <br />
              작은 잔치를 마련하였습니다.
            </p>
            <p>
              바쁘시더라도 귀한 걸음 하시어
              <br />
              따뜻한 축하와 격려로
              <br />
              자리를 빛내 주시면
              <br />
              더없는 기쁨이겠습니다.
            </p>
          </div>
          <div className="greeting-signature">
            <span className="sig-name">장녀 이은아</span>
            ,{" "}
            <span className="sig-name">차녀 이시정</span>
            <span className="sig-suffix"> 올림</span>
          </div>
        </section>

        {/* ===== Divider ===== */}
        <div className="section-divider fade-in">
          <Image
            src="/images/floral-divider.png"
            alt="Floral divider"
            width={180}
            height={72}
          />
        </div>

        {/* ===== Event Info ===== */}
        <section className="event-section fade-in" id="event">
          <p className="section-label">행사 안내</p>
          <div className="event-card">
            <div className="event-date-row">
              <span className="event-date-num">16</span>
              <div className="event-date-info">
                <span className="event-date-month">2026년 8월</span>
                <span className="event-date-day">일요일</span>
              </div>
            </div>
            <div className="event-time-row">
              <span className="event-time-icon">🕦</span>
              <span>오전 11:30 — 오후 2:30</span>
            </div>
            <div className="event-venue-row">
              <span className="event-venue-icon">📍</span>
              <div>
                <span className="event-venue-name">채림웨딩홀</span>
                <span className="event-venue-addr">
                  경기도 부천시 부천로 3-1 (심곡동)
                </span>
              </div>
            </div>
          </div>
        </section>



        {/* ===== Divider ===== */}
        <div className="divider-line fade-in">
          <span className="divider-dot" />
        </div>

        {/* ===== Location Section ===== */}
        <section className="location-section fade-in" id="location">
          <p className="section-label">오시는 길</p>
          <p className="location-venue-name">채림웨딩홀</p>

          <div className="map-container">
            <iframe
              src="https://maps.google.com/maps?q=채림웨딩홀+경기도+부천시+부천로+3-1&t=&z=16&ie=UTF8&iwloc=&output=embed"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="채림웨딩홀 위치"
            />
          </div>

          <div className="map-buttons">
            <a
              href="https://map.naver.com/p/search/채림웨딩홀/place/13352022"
              target="_blank"
              rel="noopener noreferrer"
              className="map-btn"
            >
              <span className="map-btn-icon">🗺️</span>
              네이버 지도
            </a>
            <a
              href="https://map.kakao.com/link/search/채림웨딩홀"
              target="_blank"
              rel="noopener noreferrer"
              className="map-btn"
            >
              <span className="map-btn-icon">📍</span>
              카카오맵
            </a>
          </div>

          <div className="transport-info fade-in fade-in-delay-1">
            <div className="transport-item">
              <span className="transport-icon">🚇</span>
              <div>
                <span className="transport-label">지하철</span>
                <span className="transport-detail">
                  1호선 부천역 도보 1분
                </span>
              </div>
            </div>
            <div className="transport-item">
              <span className="transport-icon">📞</span>
              <div>
                <span className="transport-label">전화</span>
                <span className="transport-detail">032-228-8000</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Contact Section ===== */}
        <section className="contact-section fade-in" id="contact">
          <p className="section-label">연락하기</p>
          <p className="contact-subtitle">
            축하의 마음을 전해주세요
          </p>

          <div className="contact-cards">
            <div className="contact-card fade-in fade-in-delay-1">
              <div className="contact-info">
                <p className="contact-role">장녀</p>
                <p className="contact-name">이은아</p>
              </div>
              <div className="contact-actions">
                <a
                  href="tel:010-4043-0186"
                  className="contact-btn call"
                  title="전화하기"
                >
                  📞
                </a>
                <a
                  href="sms:010-4043-0186"
                  className="contact-btn message"
                  title="문자하기"
                >
                  💌
                </a>
              </div>
            </div>
            <div className="contact-card fade-in fade-in-delay-2">
              <div className="contact-info">
                <p className="contact-role">차녀</p>
                <p className="contact-name">이시정</p>
              </div>
              <div className="contact-actions">
                <a
                  href="tel:010-7106-0186"
                  className="contact-btn call"
                  title="전화하기"
                >
                  📞
                </a>
                <a
                  href="sms:010-7106-0186"
                  className="contact-btn message"
                  title="문자하기"
                >
                  💌
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Closing Section ===== */}
        <section className="closing-section fade-in" id="closing">
          <div className="closing-text">
            함께해 주시는 모든 분들께
            <br />
            진심으로 감사드립니다 💐
          </div>
          <Image
            src="/images/floral-divider.png"
            alt="Floral decoration"
            width={160}
            height={64}
            className="closing-floral"
          />
        </section>

        {/* ===== Share Button ===== */}
        <section className="share-section fade-in">
          <button className="share-btn" onClick={handleShare}>
            💕 초대장 공유하기
          </button>
        </section>

        {/* ===== Footer ===== */}
        <footer className="footer">
          <p className="footer-text">이순자 여사님 칠순 잔치</p>
        </footer>
      </div>
    </>
  );
}

function generateCalendar(year, month) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push({ num: "", class: "empty" });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dayOfWeek = new Date(year, month - 1, d).getDay();
    let cls = "";
    if (dayOfWeek === 0) cls = "sun";
    else if (dayOfWeek === 6) cls = "sat";
    if (d === 16) cls = "today";
    days.push({ num: d, class: cls });
  }

  return days;
}
