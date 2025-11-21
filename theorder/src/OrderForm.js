import React, { useState, useRef } from 'react';
import CakeCanvas from './CakeCanvas';

// 본인의 카카오 채널 ID로 변경하세요
const KAKAO_CHANNEL_ID = 'YOUR_KAKAO_CHANNEL_ID_HERE'; 

const OrderForm = () => {
    const canvasRef = useRef();
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        time: '',
        product: '케이크 A', 
        phone: '',
        details: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // 캔버스 이미지 가져오기
        const imageBlob = await canvasRef.current.getCanvasBlob();
        
        // 폼 데이터 준비
        const form = e.target;
        const netlifyFormData = new FormData(form);
        netlifyFormData.append('design-image', imageBlob, `design-${Date.now()}.png`);

        try {
            // Netlify 전송
            await fetch('/', {
                method: 'POST',
                body: netlifyFormData
            });

            // 카카오톡 메시지 생성
            const messageText = `
[주문서 접수]
-------------------------
**상품**: ${formData.product}
**예약일시**: ${formData.date} ${formData.time}
**주문자**: ${formData.name}
**연락처**: ${formData.phone}
-------------------------
📸 *디자인 스케치 이미지가 주문서와 함께 전송되었습니다.*
판매자 확인 후 연락드리겠습니다.
            `.trim();

            const kakaoChatUrl = `https://pf.kakao.com/_${KAKAO_CHANNEL_ID}/chat?message=${encodeURIComponent(messageText)}`;
            window.location.href = kakaoChatUrl;

        } catch (error) {
            alert('전송 중 오류가 발생했습니다.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="order-container">
            <h2>🍰 나만의 케이크 주문하기</h2>
            <form 
                name="cake-order-visual" 
                method="POST" 
                data-netlify="true" 
                encType="multipart/form-data"
                onSubmit={handleSubmit}
            >
                <input type="hidden" name="form-name" value="cake-order-visual" />

                <CakeCanvas ref={canvasRef} />

                <label className="input-label">상품 선택:</label>
                <select name="product" value={formData.product} onChange={handleChange} className="input-field">
                    <option value="케이크 A">케이크 A</option>
                    <option value="케이크 B">케이크 B</option>
                </select>

                <label className="input-label">희망 날짜:</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required className="input-field"/>

                <label className="input-label">희망 시간:</label>
                <input type="time" name="time" value={formData.time} onChange={handleChange} required className="input-field"/>

                <label className="input-label">주문자 성함:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input-field"/>

                <label className="input-label">연락처:</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="input-field"/>

                <label className="input-label">추가 요청사항:</label>
                <textarea name="details" value={formData.details} onChange={handleChange} className="input-field textarea-field"/>

                <button type="submit" disabled={isSubmitting} className="submit-btn">
                    {isSubmitting ? '전송 중...' : '주문서 전송 및 채팅하기'}
                </button>
            </form>
        </div>
    );
};

export default OrderForm;