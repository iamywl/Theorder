// src/OrderForm.js (전체 코드)

import React, { useState } from 'react';

// 카카오톡 채널 ID (여기에 본인의 채널 ID를 넣어주세요)
const KAKAO_CHANNEL_ID = 'YOUR_KAKAO_CHANNEL_ID_HERE'; 

const OrderForm = () => {
    // 폼 데이터 상태 관리
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        time: '',
        product: '케이크 A', 
        phone: '',
        details: ''
    });

    // ... (handleChange 함수)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ... (handleSubmit 함수)

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // ... (Netlify Forms 제출 및 카카오톡 메시지 생성/인코딩 로직)

        const form = e.target;
        const netlifyFormData = new FormData(form);
        fetch('/', {
            method: 'POST',
            body: netlifyFormData
        });

        const messageText = `
[1차 주문서]
-------------------------
**상품**: ${formData.product}
**예약일시**: ${formData.date} ${formData.time}
**주문자**: ${formData.name}
**연락처**: ${formData.phone}
**요청사항**: ${formData.details || '없음'}
-------------------------
위 내용으로 주문합니다. 확인 후 안내 부탁드립니다.
        `.trim();

        const encodedMessage = encodeURIComponent(messageText);
        const kakaoChatUrl = `https://pf.kakao.com/_${KAKAO_CHANNEL_ID}/chat?message=${encodedMessage}`;
        window.location.href = kakaoChatUrl;
    };

    // ⭐⭐ 이 부분이 오류가 난 부분입니다. return 문 안에 유효한 JSX 코드를 넣어야 합니다. ⭐⭐
    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>🍰 1차 주문서 작성</h2>
            <form 
                name="cake-order" 
                method="POST" 
                data-netlify="true" // Netlify Forms 연동을 위한 필수 속성
                onSubmit={handleSubmit}
            >
                {/* Netlify Forms가 필드를 인식하도록 숨겨진 인풋 추가 */}
                <input type="hidden" name="form-name" value="cake-order" />

                {/* 상품 선택 */}
                <label>상품 선택:</label>
                <select name="product" value={formData.product} onChange={handleChange} required>
                    <option value="케이크 A">케이크 A</option>
                    <option value="케이크 B">케이크 B</option>
                    <option value="마카롱 세트">마카롱 세트</option>
                </select>

                {/* 날짜 선택 */}
                <label>희망 날짜:</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />

                {/* 시간 선택 */}
                <label>희망 시간:</label>
                <input type="time" name="time" value={formData.time} onChange={handleChange} required />

                {/* 개인정보 입력 */}
                <label>주문자 성함:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="홍길동" />

                <label>연락처:</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="010-1234-5678" />

                {/* 추가 요청 사항 */}
                <label>추가 요청사항:</label>
                <textarea name="details" value={formData.details} onChange={handleChange} placeholder="ex. 문구 요청, 알레르기 등" />

                <button type="submit" style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: 'purple', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    주문하기 및 채팅 연결 →
                </button>
            </form>
            <style jsx>{`
                label { display: block; margin-top: 10px; font-weight: bold; }
                input[type="date"], input[type="time"], input[type="text"], input[type="tel"], select, textarea {
                    width: 100%;
                    padding: 8px;
                    margin-top: 5px;
                    box-sizing: border-box;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
                textarea { resize: vertical; min-height: 100px; }
            `}</style>
        </div>
    );
};

export default OrderForm;