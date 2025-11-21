import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';

const CakeCanvas = forwardRef((props, ref) => {
    const canvasRef = useRef(null);
    const [ctx, setCtx] = useState(null);
    
    // 현재 선택된 도구: 'pen' 또는 'emoji'
    const [tool, setTool] = useState('pen'); 
    const [selectedEmoji, setSelectedEmoji] = useState('🍓');
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        // 해상도를 높이기 위해 캔버스 크기 설정 (500x500)
        canvas.width = 500;
        canvas.height = 500;
        
        const context = canvas.getContext('2d');
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.lineWidth = 5; // 선 두께
        
        // 흰색 배경 채우기
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // 기본 원형 케이크 틀 그리기 (가이드라인)
        context.beginPath();
        context.arc(250, 250, 200, 0, 2 * Math.PI);
        context.strokeStyle = '#eee';
        context.lineWidth = 2;
        context.stroke();
        context.strokeStyle = '#000'; // 다시 펜 색상 검정으로
        context.lineWidth = 5;

        setCtx(context);
    }, []);

    useImperativeHandle(ref, () => ({
        getCanvasBlob: () => {
            return new Promise(resolve => {
                canvasRef.current.toBlob(blob => {
                    resolve(blob);
                }, 'image/png');
            });
        }
    }));

    // --- 기능: 스티커(이모지) 선택 ---
    const selectSticker = (emoji) => {
        setTool('sticker');
        setSelectedEmoji(emoji);
    };

    const selectPen = () => {
        setTool('pen');
    };

    // --- 캔버스 이벤트 핸들러 ---
    const startAction = (e) => {
        const { x, y } = getPos(e);

        if (tool === 'sticker') {
            // 스티커 모드면 클릭한 위치에 이모지 그리기
            ctx.font = "40px serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(selectedEmoji, x, y);
        } else {
            // 펜 모드면 그리기 시작
            ctx.beginPath();
            ctx.moveTo(x, y);
            setIsDrawing(true);
        }
    };

    const moveAction = (e) => {
        if (!isDrawing || tool !== 'pen') return;
        const { x, y } = getPos(e);
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const endAction = () => {
        if (tool === 'pen') {
            ctx.closePath();
            setIsDrawing(false);
        }
    };

    // 좌표 계산 (마우스/터치 통합)
    const getPos = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if (e.touches) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        // 캔버스 실제 크기(500)와 화면에 보이는 크기 비율 계산
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    };

    const clearCanvas = () => {
        // 화면 지우기
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 500, 500);
        
        // 가이드라인 다시 그리기
        ctx.beginPath();
        ctx.arc(250, 250, 200, 0, 2 * Math.PI);
        ctx.strokeStyle = '#eee';
        
        // ⭐ 수정된 부분: context -> ctx 로 변경
        ctx.lineWidth = 2; 
        
        ctx.stroke();
        ctx.strokeStyle = '#000';
        
        // ⭐ 수정된 부분: context -> ctx 로 변경
        ctx.lineWidth = 5; 
    };

    return (
        <div className="canvas-wrapper">
            <div className="tools-panel">
                <div className="tool-group">
                    <span>도구: </span>
                    <button onClick={selectPen} className={tool === 'pen' ? 'active' : ''}>🖋️ 펜</button>
                    <button onClick={clearCanvas} className="clear-btn">🗑️ 지우기</button>
                </div>
                <div className="tool-group sticker-group">
                    <span>장식: </span>
                    <button onClick={() => selectSticker('🍓')}>🍓</button>
                    <button onClick={() => selectSticker('🌸')}>🌸</button>
                    <button onClick={() => selectSticker('🍒')}>🍒</button>
                    <button onClick={() => selectSticker('🕯️')}>🕯️</button>
                    <button onClick={() => selectSticker('🍫')}>🍫</button>
                    <button onClick={() => selectSticker('🍋')}>🍋</button>
                    <button onClick={() => selectSticker('🎉')}>🎉</button>
                </div>
            </div>

            <canvas
                ref={canvasRef}
                className="main-canvas"
                onMouseDown={startAction}
                onMouseMove={moveAction}
                onMouseUp={endAction}
                onMouseLeave={endAction}
                onTouchStart={startAction}
                onTouchMove={moveAction}
                onTouchEnd={endAction}
            />
            <p className="tip">💡 장식을 선택하고 캔버스를 클릭(터치)하여 꾸며보세요!</p>
        </div>
    );
});

export default CakeCanvas;