import React, { useState, useRef } from 'react';
import './App.css';
import CakeCanvas from './CakeCanvas';
import Logo from './Logo';

function App() {
  const [view, setView] = useState('order');
  const [orderData, setOrderData] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [refImage, setRefImage] = useState(null);
  const [bids, setBids] = useState([]); // 입찰 데이터

  const [formData, setFormData] = useState({
    name: '', phone: '', date: '', details: '', product: '생크림 케이크'
  });

  const canvasRef = useRef();

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

  // 랜덤 입찰 생성 함수
  const generateRandomBids = () => {
    const shops = [
        { name: '달콤 베이커리', msg: '사진처럼 예쁘게 해드릴게요!' },
        { name: '성수동 케이크', msg: '동물성 생크림 100% 사용합니다.' },
        { name: '맘모스 제과', msg: '가성비 최고! 쿨거래 환영.' },
        { name: '터틀 힙', msg: '레터링 서비스로 해드려요.' },
        { name: '홍대 피오니', msg: '딸기 많이 넣어드릴게요.' }
    ];
    
    // 3개 랜덤 선택
    const shuffled = shops.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    return shuffled.map(shop => ({
        name: shop.name,
        msg: shop.msg,
        score: (4.0 + Math.random()).toFixed(1), // 4.0 ~ 5.0 랜덤 별점
        price: Math.floor(Math.random() * (60 - 35) + 35) * 1000 // 35,000 ~ 60,000 랜덤 가격
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (canvasRef.current) {
      const blob = await canvasRef.current.getCanvasBlob();
      setPreviewImg(URL.createObjectURL(blob));
    }
    setOrderData(formData);
    setBids(generateRandomBids()); // 주문 시마다 랜덤 입찰 생성
    setView('auction');
    window.scrollTo(0, 0);
  };

  const handleReset = () => {
    setFormData({ name: '', phone: '', date: '', details: '', product: '생크림 케이크' });
    setPreviewImg(null);
    setRefImage(null);
    setView('order');
  };

  return (
    <div className="App">
      {view === 'order' ? (
        <div className="container order-layout">
          <div className="left-panel">
             {/* 로고 적용 */}
            <div style={{display: 'flex', justifyContent: 'center', marginBottom: '20px'}}>
                <Logo size={50} type="full" />
            </div>
            <p className="subtitle">나만의 케이크를 디자인하고 입찰을 받아보세요!</p>
            
            <CakeCanvas ref={canvasRef} />
            
            <div className="ref-section" style={{marginTop: '20px', padding: '15px', background: '#fff', borderRadius: '10px', border: '1px solid #eee'}}>
                <h4 style={{margin: '0 0 10px 0', fontSize:'14px'}}>📌 참고용 사진 (선택)</h4>
                <input type="file" accept="image/*" onChange={handleRefImageUpload} />
                {refImage && (
                    <div style={{marginTop: '10px'}}>
                        <img src={refImage} alt="참고용" style={{width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px'}} />
                    </div>
                )}
            </div>
          </div>

          <div className="right-panel">
            <h3 className="form-title">📋 주문서 작성</h3>
            <form onSubmit={handleSubmit} className="order-form">
              <label>케이크 종류</label>
              <select name="product" value={formData.product} onChange={handleChange}>
                <option>생크림 케이크</option>
                <option>초코 케이크</option>
                <option>치즈 케이크</option>
                <option>티라미수</option>
              </select>

              <label>예약 날짜</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required />

              <label>주문자 성함</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="홍길동" />

              <label>연락처</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="010-0000-0000" />

              <label>추가 요청사항</label>
              <textarea name="details" value={formData.details} onChange={handleChange} placeholder="알러지 유무, 픽업 시간 등" />

              <button type="submit" className="submit-btn">
                주문 등록하고 견적 받기 🚀
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="container auction-layout">
          <div style={{display: 'flex', justifyContent: 'center', marginBottom: '20px'}}>
                <Logo size={40} type="full" />
          </div>
          <h2 className="title">📢 실시간 입찰 도착!</h2>
          
          <div className="auction-status">
            <div className="my-order-card">
              <h3>내 디자인</h3>
              <div style={{display:'flex', gap:'10px', justifyContent:'center', flexWrap: 'wrap'}}>
                 {previewImg && <img src={previewImg} alt="도안" className="order-img" />}
                 {refImage && <div className="ref-badge"><span style={{display:'block', fontSize:'10px', marginBottom:'5px'}}>참고사진</span><img src={refImage} alt="레퍼런스" className="order-img" style={{borderColor:'blue'}} /></div>}
              </div>
              <div className="order-info">
                <p><strong>주문자:</strong> {orderData.name}</p>
                <p><strong>날짜:</strong> {orderData.date}</p>
                <p><strong>종류:</strong> {orderData.product}</p>
              </div>
            </div>

            <div className="bids-list">
              <h3>📥 도착한 견적 ({bids.length}건)</h3>
              
              {bids.map((bid, index) => (
                <div className={`bid-card ${index === 0 ? 'highlight' : ''}`} key={index}>
                    <div className="shop-info">
                        <span className="shop-name">🍰 {bid.name}</span>
                        <span className="shop-score">⭐ {bid.score}</span>
                    </div>
                    <div className="bid-price">{bid.price.toLocaleString()}원</div>
                    <p className="shop-msg">"{bid.msg}"</p>
                    <button className="accept-btn">수락하기</button>
                </div>
              ))}

            </div>
          </div>
          <button onClick={handleReset} className="reset-btn">처음으로 돌아가기</button>
        </div>
      )}
    </div>
  );
}

export default App;