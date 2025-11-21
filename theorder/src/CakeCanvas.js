import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';

const CakeCanvas = forwardRef((props, ref) => {
    const canvasRef = useRef(null);
    const [ctx, setCtx] = useState(null);
    
    const [tool, setTool] = useState('pen'); 
    const [selectedEmoji, setSelectedEmoji] = useState('🍓');
    const [isDrawing, setIsDrawing] = useState(false);
    const [cakeShape, setCakeShape] = useState('round'); 
    const [cakeColor, setCakeColor] = useState('#ffffff'); 
    const [textInput, setTextInput] = useState(''); 

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 500;
        canvas.height = 500;
        const context = canvas.getContext('2d');
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.lineWidth = 5;
        setCtx(context);
        
        // 베이스 그리기 (에러 해결을 위해 함수 내부로 로직 이동 가능하지만, 여기선 주석으로 처리)
        context.clearRect(0, 0, 500, 500);
        context.fillStyle = '#fdfbf7'; 
        context.fillRect(0, 0, 500, 500);
        context.fillStyle = '#ffffff';
        context.strokeStyle = '#ddd';
        context.lineWidth = 2;
        context.beginPath();
        context.arc(250, 250, 200, 0, 2 * Math.PI);
        context.fill();
        context.stroke();
        context.strokeStyle = '#000';
        context.lineWidth = 5;
        context.fillStyle = '#000';
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(ctx) drawBase(ctx, cakeShape, cakeColor);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cakeShape, cakeColor]);

    const drawBase = (context, shape, color) => {
        context.clearRect(0, 0, 500, 500);
        context.fillStyle = '#fdfbf7'; 
        context.fillRect(0, 0, 500, 500);
        context.fillStyle = color;
        context.strokeStyle = '#ddd';
        context.lineWidth = 2;
        context.beginPath();

        if (shape === 'round') {
            context.arc(250, 250, 200, 0, 2 * Math.PI);
        } else if (shape === 'square') {
            context.rect(50, 50, 400, 400);
        } else if (shape === 'heart') {
            context.moveTo(250, 120);
            context.bezierCurveTo(250, 100, 200, 50, 125, 50);
            context.bezierCurveTo(50, 50, 50, 150, 50, 150);
            context.bezierCurveTo(50, 250, 150, 360, 250, 450);
            context.bezierCurveTo(350, 360, 450, 250, 450, 150);
            context.bezierCurveTo(450, 150, 450, 50, 375, 50);
            context.bezierCurveTo(300, 50, 250, 100, 250, 120);
        }
        context.fill();
        context.stroke();
        context.strokeStyle = '#000';
        context.lineWidth = 5;
        context.fillStyle = '#000';
    };

    const addTextToCanvas = () => {
        if (!textInput) return;
        ctx.font = "bold 40px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#555"; 
        ctx.fillText(textInput, 250, 250); 
        setTextInput(''); 
        setTool('pen'); 
    };

    useImperativeHandle(ref, () => ({
        getCanvasBlob: () => {
            return new Promise(resolve => {
                canvasRef.current.toBlob(blob => resolve(blob), 'image/png');
            });
        }
    }));

    const startAction = (e) => {
        const { x, y } = getPos(e);
        if (tool === 'sticker') {
            ctx.font = "40px serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(selectedEmoji, x, y);
        } else if (tool === 'pen') {
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
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    };

    const clearCanvas = () => {
        drawBase(ctx, cakeShape, cakeColor);
    };

    return (
        <div className="canvas-wrapper">
            <div className="option-panel" style={{marginBottom: '10px', padding: '10px', background: '#f5f5f5', borderRadius: '8px', fontSize: '14px'}}>
                <div style={{marginBottom: '5px'}}>
                    <strong>시트: </strong>
                    <button onClick={() => setCakeShape('round')}>⚪ 원형</button>
                    <button onClick={() => setCakeShape('square')}>⬜ 사각</button>
                    <button onClick={() => setCakeShape('heart')}>❤️ 하트</button>
                </div>
                <div>
                    <strong>배경: </strong>
                    <button onClick={() => setCakeColor('#ffffff')}>🤍 생크림</button>
                    <button onClick={() => setCakeColor('#5d4037')}>🍫 초코</button>
                    <button onClick={() => setCakeColor('#f8bbd0')}>🍓 딸기</button>
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

            <div className="tools-panel" style={{marginTop: '10px'}}>
                <div className="tool-group" style={{display:'flex', gap:'5px', justifyContent:'center', marginBottom:'5px'}}>
                    <input type="text" placeholder="레터링 입력" value={textInput} onChange={(e) => setTextInput(e.target.value)} style={{padding: '5px', width: '120px'}}/>
                    <button onClick={addTextToCanvas} style={{background:'#333', color:'white'}}>쓰기</button>
                </div>
                <div className="tool-group">
                    <button onClick={() => setTool('pen')} className={tool==='pen'?'active':''}>🖋️ 펜</button>
                    <button onClick={() => {setTool('sticker'); setSelectedEmoji('🍓');}}>🍓</button>
                    <button onClick={() => {setTool('sticker'); setSelectedEmoji('🕯️');}}>🕯️</button>
                    <button onClick={() => {setTool('sticker'); setSelectedEmoji('🌸');}}>🌸</button>
                    <button onClick={clearCanvas} className="clear-btn">🗑️ 초기화</button>
                </div>
            </div>
        </div>
    );
});

export default CakeCanvas;