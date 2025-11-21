import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import CakeCanvas from './CakeCanvas';
import Logo from './Logo';

// --- [NEW] AI 챗봇 컴포넌트 ---
const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "안녕하세요! 무엇을 도와드릴까요? 🤖", isBot: true }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsgs = [...messages, { text: input, isBot: false }];
    setMessages(newMsgs);
    setInput("");
    
    // 가짜 응답
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "죄송합니다. 현재 상담원 연결이 지연되고 있습니다. 잠시만 기다려주세요! (가짜 AI)", 
        isBot: true 
      }]);
    }, 1000);
  };

  return (
    <div className="chatbot-wrapper">
      {!isOpen && (
        <button className="chatbot-btn" onClick={() => setIsOpen(true)}>
          💬 <span className="chatbot-badge">1</span>
        </button>
      )}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>🤖 케이크 AI 상담원</span>
            <button onClick={() => setIsOpen(false)}>✖️</button>
          </div>
          <div className="chatbot-body">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.isBot ? 'bot' : 'user'}`}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="문의사항 입력..." />
            <button onClick={handleSend}>전송</button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- [NEW] 가게 상세 보기 모달 (배달앱 스타일) ---
const StoreModal = ({ store, onClose }) => {
  if (!store) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="store-modal-content" onClick={e => e.stopPropagation()}>
        <div className="store-header-img" style={{backgroundColor: '#ffec99'}}>
            🏠 {store.name}
        </div>
        <div className="store-body">
            <div className="store-title-row">
                <h2>{store.name}</h2>
                <span className="score">⭐ 4.9 (리뷰 120)</span>
            </div>
            <p className="store-desc">"매일 아침 구워내는 신선한 시트! {store.name}입니다."</p>
            
            <div className="store-tabs">
                <button className="active">메뉴</button>
                <button>정보</button>
                <button>리뷰</button>
            </div>

            <div className="menu-list-scroll">
                <div className="menu-item-card">
                    <div className="menu-info">
                        <h4>딸기 듬뿍 케이크</h4>
                        <p>제철 딸기가 한가득!</p>
                        <span>35,000원</span>
                    </div>
                    <div className="menu-img">🍰</div>
                </div>
                <div className="menu-item-card">
                    <div className="menu-info">
                        <h4>초코 폭탄 케이크</h4>
                        <p>발로나 초콜릿 사용</p>
                        <span>38,000원</span>
                    </div>
                    <div className="menu-img">🍫</div>
                </div>
                <div className="menu-item-card">
                    <div className="menu-info">
                        <h4>레터링 도시락</h4>
                        <p>간단한 선물로 딱!</p>
                        <span>18,000원</span>
                    </div>
                    <div className="menu-img">🍱</div>
                </div>
            </div>
            <button className="action-btn" onClick={onClose}>견적 요청하기</button>
        </div>
      </div>
    </div>
  );
};

// --- [서브] 갤러리 탭 ---
const GalleryTab = () => {
  const images = [
    { id: 1, color: '#FFC0CB', emoji: '🎂', title: '봄날의 곰', like: 124 },
    { id: 2, color: '#87CEEB', emoji: '🧁', title: '엘사 컵케익', like: 89 },
    { id: 3, color: '#98FB98', emoji: '🍩', title: '골프장 도넛', like: 230 },
    { id: 4, color: '#DDA0DD', emoji: '🍰', title: '보라해 조각', like: 45 },
    { id: 5, color: '#FFD700', emoji: '🥞', title: '돈방석 팬케익', like: 12 },
    { id: 6, color: '#FFA07A', emoji: '🥧', title: '자몽 타르트', like: 67 },
  ];
  return (
    <div className="tab-content">
      <h2 className="tab-title">🏆 명예의 전당</h2>
      <div className="gallery-grid">
        {images.map(img => (
          <div key={img.id} className="gallery-item">
            <div className="fake-img" style={{backgroundColor: img.color}}>
                <span className="gallery-emoji">{img.emoji}</span>
            </div>
            <div className="gallery-info">
              <h4>{img.title}</h4>
              <span className="like-count">❤️ {img.like}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- [서브] 마이페이지 (이벤트 추가) ---
const MyPageTab = () => {
  return (
    <div className="tab-content">
      <h2 className="tab-title">👤 마이페이지</h2>
      <div className="profile-card">
        <div className="profile-img">🦁</div>
        <div className="profile-info">
            <h3>멋쟁이 사자님</h3>
            <p>VIP 등급 (다음 달 달성 예정)</p>
        </div>
      </div>
      {/* 이벤트 배너 추가 */}
      <div className="event-banner">
        <span>🎉 신규가입 쿠폰팩이 도착했어요!</span>
      </div>
      <div className="section-box">
        <h3>🚀 진행 중인 주문</h3>
        <div className="order-status-card">
            <div className="status-header">
                <span className="order-date">2023.11.21 주문</span>
                <span className="status-badge">제작 중</span>
            </div>
            <div className="cake-preview-row">
                <span style={{fontSize:'30px', marginRight:'10px'}}>🎂</span>
                <div>
                    <strong>커스텀 레터링 케이크 (1호)</strong>
                    <p>달콤 베이커리 · 45,000원</p>
                </div>
            </div>
        </div>
      </div>
      <div className="menu-list">
        <div className="menu-item">❤️ 찜한 가게 <span>3 ></span></div>
        <div className="menu-item">🎟️ 내 쿠폰함 <span>2 ></span></div>
        <div className="menu-item">⚙️ 설정 <span>></span></div>
      </div>
    </div>
  );
};

// --- [서브] 지도 탭 (업그레이드) ---
const MapTab = () => {
  const [selectedStore, setSelectedStore] = useState(null);

  const stores = [
    { id: 1, name: "달콤 베이커리", top: "30%", left: "20%" },
    { id: 2, name: "성수동 케이크", top: "60%", left: "70%" },
    { id: 3, name: "터틀힙", top: "40%", left: "50%" },
  ];

  return (
    <div className="tab-content">
      <h2 className="tab-title">📍 내 주변 케이크 샵</h2>
      <p style={{fontSize:'12px', color:'#666', marginBottom:'10px'}}>핀을 클릭하면 가게 상세정보를 볼 수 있습니다.</p>
      
      {/* CSS 패턴 지도 (이미지 안씀) */}
      <div className="fake-map-pattern">
        {stores.map(store => (
            <div key={store.id} 
                 className="map-pin" 
                 style={{top: store.top, left: store.left}}
                 onClick={() => setSelectedStore(store)}>
                🏠 {store.name}
            </div>
        ))}
        <div className="current-pos">🔵 나</div>
      </div>

      <div className="shop-list">
        {stores.map(store => (
            <div className="shop-item" key={store.id}>
            <div>
                <strong>{store.name}</strong> <span className="tag">입찰가능</span>
                <p>0.8km · 무료배달</p>
            </div>
            <button onClick={() => setSelectedStore(store)}>상세보기</button>
            </div>
        ))}
      </div>

      {/* 가게 상세 모달 */}
      <StoreModal store={selectedStore} onClose={() => setSelectedStore(null)} />
    </div>
  );
};

// --- [메인] App ---
function App() {
  const [activeTab, setActiveTab] = useState('home'); 
  const [darkMode, setDarkMode] = useState(false);
  const [view, setView] = useState('order');
  const [orderData, setOrderData] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [refImage, setRefImage] = useState(null);
  const [bids, setBids] = useState([]);
  const [timeLeft, setTimeLeft] = useState(600);
  const [formData, setFormData] = useState({
    name: '', phone: '', date: '', details: '', 
    product: '생크림', size: '1호', sheet: '바닐라'
  });

  const canvasRef = useRef();

  useEffect(() => {
    if (darkMode) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
  }, [darkMode]);

  useEffect(() => {
    let timer;
    if (view === 'auction' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [view, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRefImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setRefImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const calculateEstimatedPrice = () => {
    let basePrice = 35000;
    if (formData.size === '2호') basePrice += 8000;
    if (formData.size === '3호') basePrice += 15000;
    if (formData.product === '크림치즈') basePrice += 3000;
    if (formData.product === '티라미수') basePrice += 5000;
    return basePrice.toLocaleString();
  };

  const generateRandomBids = () => {
    const shops = [
        { name: '달콤 베이커리', msg: '사진처럼 예쁘게 해드릴게요!' },
        { name: '성수동 케이크', msg: '동물성 생크림 100% 사용합니다.' },
        { name: '맘모스 제과', msg: '가성비 최고! 쿨거래 환영.' },
        { name: '터틀 힙', msg: '레터링 서비스로 해드려요.' },
        { name: '홍대 피오니', msg: '딸기 많이 넣어드릴게요.' }
    ];
    const shuffled = shops.sort(() => 0.5 - Math.random()).slice(0, 3);
    const currentPrice = parseInt(calculateEstimatedPrice().replace(/,/g, ''));

    return shuffled.map(shop => ({
        name: shop.name,
        msg: shop.msg,
        score: (4.0 + Math.random()).toFixed(1),
        price: currentPrice + Math.floor(Math.random() * 8000) - 3000
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (canvasRef.current) {
      const blob = await canvasRef.current.getCanvasBlob();
      setPreviewImg(URL.createObjectURL(blob));
    }
    setOrderData(formData);
    setBids(generateRandomBids());
    setView('auction');
    setTimeLeft(600);
    window.scrollTo(0, 0);
  };

  const handleReset = () => {
    setFormData({ name: '', phone: '', date: '', details: '', product: '생크림', size: '1호', sheet: '바닐라' });
    setPreviewImg(null);
    setRefImage(null);
    setView('order');
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="logo-area">
            <Logo size={30} type="icon" />
            <span className="brand-name">The Order</span>
        </div>
        <button className="theme-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️' : '🌙'}
        </button>
      </header>

      <main className="main-content">
        {activeTab === 'home' && (
          <>
            {view === 'order' ? (
              <div className="container order-layout fade-in">
                <div className="left-panel">
                  <div style={{marginBottom: '20px', textAlign:'center'}}>
                      <h2 className="page-title">🎂 커스텀 주문</h2>
                      <p className="subtitle">나만의 디자인으로 입찰을 받아보세요!</p>
                  </div>
                  <CakeCanvas ref={canvasRef} />
                  <div className="ref-section">
                      <h4 style={{margin: '0 0 10px 0', fontSize:'14px'}}>📌 레퍼런스 첨부</h4>
                      <input type="file" accept="image/*" onChange={handleRefImageUpload} />
                      {refImage && <img src={refImage} alt="참고" className="ref-preview" />}
                  </div>
                </div>

                <div className="right-panel">
                  <h3 className="form-title">📋 주문서 작성</h3>
                  <form onSubmit={handleSubmit} className="order-form">
                    <div className="form-row">
                      <div className="form-group">
                          <label>사이즈</label>
                          <select name="size" value={formData.size} onChange={handleChange}>
                              <option>1호 (15cm)</option>
                              <option>2호 (18cm)</option>
                              <option>3호 (21cm)</option>
                          </select>
                      </div>
                      <div className="form-group">
                          <label>맛</label>
                          <select name="product" value={formData.product} onChange={handleChange}>
                              <option>생크림</option>
                              <option>초코</option>
                              <option>크림치즈</option>
                              <option>티라미수</option>
                          </select>
                      </div>
                    </div>
                    <label>날짜</label>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                    <label>이름</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="홍길동" />
                    <label>연락처</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="010-0000-0000" />
                    <label>요청사항</label>
                    <textarea name="details" value={formData.details} onChange={handleChange} placeholder="레터링 문구 등" />
                    
                    <div className="price-estimator">
                      <span>예상 견적</span>
                      <span className="price">{calculateEstimatedPrice()}원 ~</span>
                    </div>
                    <button type="submit" className="submit-btn">입찰 시작 🚀</button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="container auction-layout fade-in">
                <div className="auction-header">
                  <h2 className="page-title">📢 실시간 입찰 중</h2>
                  <div className="timer-badge">⏳ 마감까지 {formatTime(timeLeft)}</div>
                </div>
                <div className="auction-status">
                  <div className="my-order-card">
                    <h3>내 주문</h3>
                    <div style={{display:'flex', gap:'10px', justifyContent:'center', flexWrap: 'wrap'}}>
                       {previewImg && <img src={previewImg} alt="도안" className="order-img" />}
                       {refImage && <img src={refImage} alt="레퍼런스" className="order-img" style={{borderColor:'#5c7cfa'}} />}
                    </div>
                    <div className="order-info">
                        <p><strong>{orderData.name}</strong>님의 주문</p>
                        <p>{orderData.product} ({orderData.size})</p>
                    </div>
                  </div>
                  <div className="bids-list">
                    <h3>📥 도착한 견적 ({bids.length})</h3>
                    {bids.map((bid, index) => (
                      <div className={`bid-card ${index === 0 ? 'highlight' : ''}`} key={index}>
                          <div className="shop-info">
                              <span className="shop-name">{bid.name}</span>
                              <span className="shop-score">⭐ {bid.score}</span>
                          </div>
                          <div className="bid-price">{bid.price.toLocaleString()}원</div>
                          <p className="shop-msg">{bid.msg}</p>
                          <button className="accept-btn">수락</button>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={handleReset} className="reset-btn">새 주문하기</button>
              </div>
            )}
          </>
        )}

        {activeTab === 'map' && <MapTab />}
        {activeTab === 'gallery' && <GalleryTab />}
        {activeTab === 'mypage' && <MyPageTab />}
      </main>

      {/* 챗봇 플로팅 버튼 */}
      <ChatBot />

      <nav className="bottom-nav">
        <button className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>
            <span>🏠</span>홈
        </button>
        <button className={activeTab === 'map' ? 'active' : ''} onClick={() => setActiveTab('map')}>
            <span>🗺️</span>지도
        </button>
        <button className={activeTab === 'gallery' ? 'active' : ''} onClick={() => setActiveTab('gallery')}>
            <span>🖼️</span>갤러리
        </button>
        <button className={activeTab === 'mypage' ? 'active' : ''} onClick={() => setActiveTab('mypage')}>
            <span>👤</span>마이
        </button>
      </nav>
    </div>
  );
}

export default App;