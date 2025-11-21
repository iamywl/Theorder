import React, { useState, useRef } from 'react';
import './App.css';
import CakeCanvas from './CakeCanvas';

function App() {
  // 화면 상태: 'order'(주문작성) 또는 'auction'(입찰현황)
  const [view, setView] = useState('order');
  const [orderData, setOrderData] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);

  // 폼 데이터 관리
  const [formData, setFormData] = useState({
    name: '', phone: '', date: '', details: '', product: '생크림 케이크'
  });

  const canvasRef = useRef();

  // 입력 값 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 주문 제출 버튼 클릭 시 (서버 대신 가짜 처리)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. 캔버스 이미지를 가져옴
    if (canvasRef.current) {
      const blob = await canvasRef.current.getCanvasBlob();
      const imageUrl = URL.createObjectURL(blob); // 브라우저에서 볼 수 있는 임시 URL 생성
      setPreviewImg(imageUrl);
    }

    // 2. 데이터를 상태에 저장하고 화면 전환
    setOrderData(formData);
    setView('auction'); // 입찰 화면으로 이동
    window.scrollTo(0, 0);
  };

  // 다시 주문하기
  const handleReset = () => {
    setFormData({ name: '', phone: '', date: '', details: '', product: '생크림 케이크' });
    setPreviewImg(null);
    setView('order');
  };

  return (
    <div className="App">
      {view === 'order' ? (
        // --- [화면 1] 주문서 작성 ---
        <div className="container order-layout">
          <div className="left-panel">
            <h2 className="title">🎂 케이크 디자인 스튜디오</h2>
            <p className="subtitle">원하는 장식을 선택하고 캔버스에 클릭하세요!</p>
            <CakeCanvas ref={canvasRef} />
          </div>

          <div className="right-panel">
            <h3 className="form-title">📋 주문서 작성</h3>
            <form onSubmit={handleSubmit} className="order-form">
              <label>케이크 종류</label>
              <select name="product" value={formData.product} onChange={handleChange}>
                <option>생크림 케이크</option>
                <option>초코 케이크</option>
                <option>치즈 케이크</option>
              </select>

              <label>예약 날짜</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required />

              <label>주문자 성함</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="홍길동" />

              <label>연락처</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="010-0000-0000" />

              <label>추가 요청사항</label>
              <textarea name="details" value={formData.details} onChange={handleChange} placeholder="레터링 문구 등" />

              <button type="submit" className="submit-btn">
                주문 등록하고 입찰 받기 🚀
              </button>
            </form>
          </div>
        </div>
      ) : (
        // --- [화면 2] 가짜 입찰 현황판 (MVP 개념 증명용) ---
        <div className="container auction-layout">
          <h2 className="title">📢 실시간 입찰 현황</h2>
          <p className="subtitle">사장님들이 고객님의 주문을 보고 견적을 보내왔습니다!</p>
          
          <div className="auction-status">
            <div className="my-order-card">
              <h3>내 디자인</h3>
              {previewImg && <img src={previewImg} alt="내 케이크" className="order-img" />}
              <div className="order-info">
                <p><strong>주문자:</strong> {orderData.name}</p>
                <p><strong>날짜:</strong> {orderData.date}</p>
                <p><strong>종류:</strong> {orderData.product}</p>
              </div>
            </div>

            <div className="bids-list">
              <h3>📥 도착한 견적 (3건)</h3>
              
              {/* 가짜 데이터 1 */}
              <div className="bid-card">
                <div className="shop-info">
                  <span className="shop-name">🍰 달콤 베이커리</span>
                  <span className="shop-score">⭐ 4.8 (거래 120건)</span>
                </div>
                <div className="bid-price">45,000원</div>
                <p className="shop-msg">"사진처럼 예쁘게 만들어 드릴게요! 딸기 추가 가능합니다."</p>
                <button className="accept-btn">수락하기</button>
              </div>

              {/* 가짜 데이터 2 */}
              <div className="bid-card highlight">
                <div className="shop-info">
                  <span className="shop-name">🥐 성수동 케이크</span>
                  <span className="shop-score">⭐ 4.9 (거래 340건)</span>
                </div>
                <div className="bid-price">52,000원</div>
                <p className="shop-msg">"동물성 생크림 100% 사용합니다. 픽업 시간 맞춰드려요."</p>
                <button className="accept-btn">수락하기</button>
              </div>

              {/* 가짜 데이터 3 */}
              <div className="bid-card">
                <div className="shop-info">
                  <span className="shop-name">🍩 맘모스 제과</span>
                  <span className="shop-score">⭐ 4.5 (거래 50건)</span>
                </div>
                <div className="bid-price">42,000원</div>
                <p className="shop-msg">"가성비 최고! 쿨거래 환영합니다."</p>
                <button className="accept-btn">수락하기</button>
              </div>
            </div>
          </div>

          <button onClick={handleReset} className="reset-btn">처음으로 돌아가기</button>
        </div>
      )}
    </div>
  );
}

export default App;