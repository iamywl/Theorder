import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import CakeCanvas from './CakeCanvas';
import Logo from './Logo';

// --- [유틸] 날짜 포맷터 ---
const getToday = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
};

// --- [컴포넌트] 토스트 알림 ---
const Toast = ({ message, onClose }) => {
  useEffect(() => { const timer = setTimeout(onClose, 2000); return () => clearTimeout(timer); }, [onClose]);
  return <div className="toast-popup">{message}</div>;
};

// --- [데이터] 이상형 월드컵 후보 (컴포넌트 밖으로 이동하여 에러 해결) ---
const CANDIDATES = [
  { id: 1, name: "곰돌이 케이크", emoji: "🐻", color: "#FFC0CB" },
  { id: 2, name: "엘사 케이크", emoji: "❄️", color: "#87CEEB" },
  { id: 3, name: "골프장 케이크", emoji: "⛳", color: "#98FB98" },
  { id: 4, name: "보라해 케이크", emoji: "💜", color: "#DDA0DD" },
  { id: 5, name: "돈방석 케이크", emoji: "💰", color: "#FFD700" },
  { id: 6, name: "자몽 타르트", emoji: "🍊", color: "#FFA07A" },
  { id: 7, name: "갤럭시 케이크", emoji: "🌌", color: "#E6E6FA" },
  { id: 8, name: "하트 쿠키", emoji: "🍪", color: "#FF6B6B" },
];

// --- [컴포넌트] 이상형 월드컵 (미니게임) ---
const CakeWorldCup = ({ onClose }) => {
  const [round, setRound] = useState([]);
  const [nextRound, setNextRound] = useState([]);
  const [currentPair, setCurrentPair] = useState([0, 1]);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    // CANDIDATES 상수를 사용하여 의존성 경고 해결
    setRound([...CANDIDATES].sort(() => Math.random() - 0.5)); 
  }, []);

  const handleSelect = (selected) => {
    const newNextRound = [...nextRound, selected];
    if (currentPair[1] + 2 < round.length) {
      setNextRound(newNextRound);
      setCurrentPair([currentPair[1] + 1, currentPair[1] + 2]);
    } else {
      if (newNextRound.length === 1) {
        setWinner(newNextRound[0]);
      } else {
        setRound(newNextRound);
        setNextRound([]);
        setCurrentPair([0, 1]);
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="worldcup-content">
        <div className="worldcup-header">
            <h3>🏆 케이크 이상형 월드컵 {winner ? "- 우승!" : (round.length > 2 ? `- ${round.length}강` : "- 결승")}</h3>
            <button onClick={onClose}>나가기</button>
        </div>
        {winner ? (
            <div className="winner-view">
                <div className="cake-card winner" style={{backgroundColor: winner.color}}>
                    <span className="emoji">{winner.emoji}</span>
                </div>
                <h4>🎉 최고의 취향: {winner.name}</h4>
            </div>
        ) : (
            <div className="battle-view">
                {round[currentPair[0]] && (
                    <div className="cake-card" onClick={() => handleSelect(round[currentPair[0]])} style={{backgroundColor: round[currentPair[0]].color}}>
                        <span className="emoji">{round[currentPair[0]].emoji}</span>
                        <p>{round[currentPair[0]].name}</p>
                    </div>
                )}
                <div className="vs-badge">VS</div>
                {round[currentPair[1]] && (
                    <div className="cake-card" onClick={() => handleSelect(round[currentPair[1]])} style={{backgroundColor: round[currentPair[1]].color}}>
                        <span className="emoji">{round[currentPair[1]].emoji}</span>
                        <p>{round[currentPair[1]].name}</p>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

// --- [모드] 사장님 대시보드 (Admin) ---
const BossMode = () => {
  const [activeTab, setActiveTab] = useState('dash');
  const salesData = [
    { day: '월', amount: 120000 }, { day: '화', amount: 180000 },
    { day: '수', amount: 150000 }, { day: '목', amount: 240000 },
    { day: '금', amount: 350000 }, { day: '토', amount: 420000 }, { day: '일', amount: 380000 }
  ];
  const maxSale = Math.max(...salesData.map(d => d.amount));

  return (
    <div className="container boss-container fade-in">
      <div className="boss-header">
        <h2>💼 사장님, 환영합니다!</h2>
        <p>오늘 들어온 주문을 확인해보세요.</p>
      </div>
      <div className="boss-tabs">
        <button className={activeTab==='dash'?'active':''} onClick={()=>setActiveTab('dash')}>📊 매출 통계</button>
        <button className={activeTab==='orders'?'active':''} onClick={()=>setActiveTab('orders')}>🛎️ 주문 관리 <span className="badge">2</span></button>
      </div>
      {activeTab === 'dash' && (
        <div className="dashboard-view">
            <div className="stat-cards">
                <div className="card"><h4>오늘 매출</h4><p>350,000원</p></div>
                <div className="card"><h4>누적 주문</h4><p>12건</p></div>
                <div className="card"><h4>리뷰 평점</h4><p>⭐ 4.9</p></div>
            </div>
            <div className="chart-box">
                <h4>📅 주간 매출 추이</h4>
                <div className="bar-chart">
                    {salesData.map((d, i) => (
                        <div key={i} className="bar-col">
                            <div className="bar" style={{height: `${(d.amount / maxSale) * 150}px`}}></div>
                            <span>{d.day}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}
      {activeTab === 'orders' && (
        <div className="order-manage-view">
            <div className="order-item-boss">
                <div className="order-head"><span className="new-badge">NEW</span><strong>홍길동 고객님 (1호, 생크림)</strong><span className="time">10분 전</span></div>
                <p className="req">"레터링: Happy Day! 딸기 많이 넣어주세요."</p>
                <div className="btn-group"><button className="reject">거절</button><button className="accept">입찰하기 (35,000원)</button></div>
            </div>
            <div className="order-item-boss">
                <div className="order-head"><span className="new-badge">NEW</span><strong>김철수 고객님 (2호, 초코)</strong><span className="time">30분 전</span></div>
                <p className="req">"픽업 시간 18시로 맞춰주세요."</p>
                <div className="btn-group"><button className="reject">거절</button><button className="accept">입찰하기 (42,000원)</button></div>
            </div>
        </div>
      )}
    </div>
  );
};

// --- [서브] 갤러리 탭 ---
const GalleryTab = ({ onToast }) => {
  const [showWorldCup, setShowWorldCup] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [images, setImages] = useState([
    { id: 1, color: '#FFC0CB', emoji: '🎂', title: '봄날의 곰', tag: '기념일', like: 124, liked: false },
    { id: 2, color: '#87CEEB', emoji: '🧁', title: '엘사 컵케익', tag: '캐릭터', like: 89, liked: false },
    { id: 3, color: '#98FB98', emoji: '🍩', title: '골프장 케이크', tag: '부모님', like: 230, liked: false },
    { id: 4, color: '#DDA0DD', emoji: '🍰', title: '보라해 조각', tag: '친구', like: 45, liked: false },
    { id: 5, color: '#FFD700', emoji: '🥞', title: '돈방석 케이크', tag: '부모님', like: 12, liked: false },
    { id: 6, color: '#FFA07A', emoji: '🥧', title: '자몽 타르트', tag: '기념일', like: 67, liked: false },
  ]);

  const toggleLike = (id) => {
    setImages(images.map(img => img.id === id ? { ...img, liked: !img.liked, like: img.like + (!img.liked ? 1 : -1) } : img));
    onToast("❤️ 반영되었습니다!");
  };

  const filteredImages = images.filter(img => (filter === "ALL" || img.tag === filter) && img.title.includes(searchTerm));

  return (
    <div className="container">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2 className="tab-title">🏆 명예의 전당</h2>
        <button className="game-btn" onClick={() => setShowWorldCup(true)}>🎮 이상형 월드컵</button>
      </div>
      <div className="filter-bar"><input type="text" placeholder="디자인 검색..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/></div>
      <div className="tags-bar">
        {['ALL', '기념일', '부모님', '캐릭터', '친구'].map(tag => (<button key={tag} className={filter === tag ? 'active' : ''} onClick={() => setFilter(tag)}>#{tag}</button>))}
      </div>
      <div className="gallery-grid">
        {filteredImages.map(img => (
          <div key={img.id} className="gallery-item">
            <div className="fake-img" style={{backgroundColor: img.color}}>
                <span className="gallery-emoji">{img.emoji}</span>
                <button className={`like-btn ${img.liked ? 'liked' : ''}`} onClick={() => toggleLike(img.id)}>♥</button>
            </div>
            <div className="gallery-info"><h4>{img.title}</h4><span className="like-count">❤️ {img.like}</span></div>
          </div>
        ))}
      </div>
      {showWorldCup && <CakeWorldCup onClose={() => setShowWorldCup(false)} />}
    </div>
  );
};

// --- [메인] App ---
function App() {
  const [isBossMode, setIsBossMode] = useState(false);
  const [activeTab, setActiveTab] = useState('home'); 
  const [toastMsg, setToastMsg] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [view, setView] = useState('order');
  const [orderData, setOrderData] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [refImage, setRefImage] = useState(null);
  const [bids, setBids] = useState([]);
  const [timeLeft, setTimeLeft] = useState(600);
  const [formData, setFormData] = useState({ name: '', phone: '', date: getToday(), details: '', product: '생크림', size: '1호' });
  const canvasRef = useRef();
  const [recentItems, setRecentItems] = useState([]);

  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 3000); };
  const addToRecent = (item) => { setRecentItems(prev => [item, ...prev.filter(i => i.name !== item.name)].slice(0, 5)); };

  useEffect(() => { if (darkMode) document.body.classList.add('dark-mode'); else document.body.classList.remove('dark-mode'); }, [darkMode]);
  useEffect(() => { let timer; if (view === 'auction' && timeLeft > 0) timer = setInterval(() => setTimeLeft(p => p - 1), 1000); return () => clearInterval(timer); }, [view, timeLeft]);
  
  const formatTime = (s) => { const m = Math.floor(s / 60).toString().padStart(2, '0'); const sc = (s % 60).toString().padStart(2, '0'); return `${m}:${sc}`; };
  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleRefImageUpload = (e) => { const file = e.target.files[0]; if(file) { const reader = new FileReader(); reader.onload = (ev) => setRefImage(ev.target.result); reader.readAsDataURL(file); }};
  const calculateEstimatedPrice = () => { let p = 35000; if(formData.size==='2호') p+=8000; if(formData.size==='3호') p+=15000; return p.toLocaleString(); };
  
  const handleSubmit = async (e) => { 
      e.preventDefault(); 
      if (canvasRef.current) setPreviewImg(URL.createObjectURL(await canvasRef.current.getCanvasBlob())); 
      setOrderData(formData); 
      setBids([{name:'달콤베이커리', price:38000, score:4.8, msg:'예쁘게 만들어드릴게요!'},{name:'성수동케이크', price:42000, score:4.9, msg:'동물성 생크림 사용!'}]); 
      setView('auction'); 
      setTimeLeft(600); 
      addToRecent({ name: '나만의 커스텀 케이크', date: getToday(), type: 'custom' });
      window.scrollTo(0,0); 
  };
  const handleReset = () => { setFormData({ name:'', phone:'', date:getToday(), details:'', product:'생크림', size:'1호' }); setPreviewImg(null); setRefImage(null); setView('order'); };

  return (
    <div className="App">
      <header className="app-header">
        <div style={{width: '100%', maxWidth:'1000px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div className="logo-area"><Logo size={30} type="icon" /><span className="brand-name">The Order</span></div>
            <div style={{display:'flex', gap:'10px'}}>
                <label className="switch">
                    <input type="checkbox" checked={isBossMode} onChange={()=>setIsBossMode(!isBossMode)} />
                    <span className="slider round"></span>
                </label>
                <span style={{fontSize:'12px', lineHeight:'34px', fontWeight:'bold'}}>{isBossMode ? '사장님' : '고객'}</span>
                <button className="theme-btn" onClick={() => setDarkMode(!darkMode)}>{darkMode ? '☀️' : '🌙'}</button>
            </div>
        </div>
      </header>

      <main className="main-content">
        {isBossMode ? (
            <BossMode />
        ) : (
            <>
            {activeTab === 'home' && (
                view === 'order' ? (
                    <div className="container order-layout fade-in">
                        <div className="left-panel">
                            <div className="panel-header"><h2 className="page-title">🎨 커스텀 디자인</h2><p className="subtitle">원하는 모양으로 케이크를 그려보세요.</p></div>
                            <CakeCanvas ref={canvasRef} />
                            <div className="ref-section"><h4 className="section-label">📌 레퍼런스 첨부</h4><input type="file" accept="image/*" onChange={handleRefImageUpload} />{refImage && <img src={refImage} alt="참고" className="ref-preview" />}</div>
                        </div>
                        <div className="right-panel">
                            <div className="panel-header"><h2 className="page-title">📋 주문서 작성</h2><p className="subtitle">상세 정보를 입력해주세요.</p></div>
                            <form onSubmit={handleSubmit} className="order-form">
                                <div className="form-row">
                                    <div className="input-group"><label>사이즈</label><select name="size" value={formData.size} onChange={handleChange}><option>1호</option><option>2호</option><option>3호</option></select></div>
                                    <div className="input-group"><label>맛 선택</label><select name="product" value={formData.product} onChange={handleChange}><option>생크림</option><option>초코</option><option>크림치즈</option><option>티라미수</option></select></div>
                                </div>
                                <div className="input-group"><label>예약 날짜</label><input type="date" name="date" value={formData.date} onChange={handleChange} required /></div>
                                <div className="input-group"><label>주문자 이름</label><input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="홍길동" /></div>
                                <div className="input-group"><label>연락처</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="010-0000-0000" /></div>
                                <div className="input-group"><label>요청사항</label><textarea name="details" value={formData.details} onChange={handleChange} placeholder="레터링 문구, 알러지 유무 등" /></div>
                                <div className="price-box"><span>예상 견적</span><span className="price-val">{calculateEstimatedPrice()}원 ~</span></div>
                                <button type="submit" className="submit-btn">견적 요청하기 🚀</button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="container auction-layout fade-in">
                        <div className="auction-header"><h2 className="page-title">📢 실시간 입찰 중</h2><div className="timer-badge">⏳ 마감까지 {formatTime(timeLeft)}</div></div>
                        <div className="auction-status">
                            <div className="my-order-card">
                                <h3>내 주문</h3>
                                <div className="preview-row">
                                {previewImg && <img src={previewImg} alt="도안" className="order-img" />}
                                <div className="order-text"><p><strong>{orderData.name}</strong>님</p><p>{orderData.product} / {orderData.size}</p><p>{orderData.date} 픽업</p></div>
                                </div>
                            </div>
                            <div className="bids-list">
                                <h3>📥 도착한 견적 ({bids.length})</h3>
                                {bids.map((bid, i) => (
                                    <div className="bid-card" key={i}>
                                        <div className="shop-info"><span className="shop-name">{bid.name}</span><span className="shop-score">⭐ {bid.score}</span></div>
                                        <div className="bid-price">{bid.price.toLocaleString()}원</div>
                                        <p className="shop-msg">{bid.msg}</p>
                                        <button className="accept-btn" onClick={() => showToast("✅ 주문이 수락되었습니다!")}>수락</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button onClick={handleReset} className="reset-btn">새 주문하기</button>
                    </div>
                )
            )}

            {activeTab === 'map' && (
                <div className="container">
                    <h2 className="tab-title">📍 내 주변 케이크 샵</h2>
                    <div className="fake-map-pattern" style={{backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Map_of_Seoul_districts_de.svg/2560px-Map_of_Seoul_districts_de.svg.png')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
                        <div className="map-pin" style={{top: '30%', left: '20%'}}>🏠 달콤</div>
                        <div className="map-pin" style={{top: '60%', left: '70%'}}>🏠 성수</div>
                        <div className="current-pos">🔵 나</div>
                    </div>
                    <div className="shop-list" style={{marginTop:'20px'}}>
                        <div className="shop-item" style={{display:'flex', justifyContent:'space-between', padding:'15px 0', borderBottom:'1px solid #eee'}}>
                            <div><strong>달콤 베이커리</strong><p>0.8km · 무료배달</p></div><button className="action-btn" style={{width:'auto', margin:0, padding:'8px 15px'}}>상세보기</button>
                        </div>
                    </div>
                </div>
            )}
            
            {activeTab === 'gallery' && <GalleryTab onToast={showToast} />}
            
            {activeTab === 'mypage' && (
                <div className="container fade-in">
                    <h2 className="tab-title">👤 마이페이지</h2>
                    <div className="profile-card"><div className="profile-img">🦁</div><div className="profile-info"><h3>멋쟁이 사자님</h3><p>VIP 등급 (다음 달 달성 예정)</p></div></div>
                    <div className="section-box">
                        <h4 style={{margin:'0 0 10px'}}>🕒 최근 본 상품</h4>
                        {recentItems.length === 0 ? <p style={{color:'#999', fontSize:'13px'}}>최근 본 기록이 없습니다.</p> : (
                            <div style={{display:'flex', gap:'10px', overflowX:'auto', paddingBottom:'10px'}}>
                                {recentItems.map((item, i) => (
                                    <div key={i} style={{minWidth:'120px', padding:'10px', border:'1px solid #eee', borderRadius:'8px', background:'white', fontSize:'12px'}}>
                                        <div style={{height:'50px', background:'#eee', marginBottom:'5px', display:'flex', alignItems:'center', justifyContent:'center'}}>🎂</div>
                                        <strong>{item.name}</strong><br/>{item.date}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="menu-list" style={{marginTop:'20px'}}>
                        <div className="menu-item" style={{padding:'15px 0', borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between', cursor:'pointer'}}>❤️ 찜한 가게 <span>3 ></span></div>
                        <div className="menu-item" style={{padding:'15px 0', borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between', cursor:'pointer'}}>⚙️ 설정 <span>></span></div>
                    </div>
                </div>
            )}
            </>
        )}
      </main>

      {!isBossMode && (
        <nav className="bottom-nav">
            {['home', 'map', 'gallery', 'mypage'].map(tab => (
                <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
                    <span className="nav-icon">{tab === 'home' ? '🏠' : tab === 'map' ? '🗺️' : tab === 'gallery' ? '🖼️' : '👤'}</span>
                    <span className="nav-text">{tab === 'home' ? '홈' : tab === 'map' ? '지도' : tab === 'gallery' ? '갤러리' : '마이'}</span>
                </button>
            ))}
        </nav>
      )}

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
    </div>
  );
}

export default App;