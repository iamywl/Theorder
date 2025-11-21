import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';

const CakeCanvas = forwardRef((props, ref) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [ctx, setCtx] = useState(null);

    // 캔버스 초기화
    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 350;
        canvas.height = 350;
        const context = canvas.getContext('2d');
        context.lineCap = 'round';
        context.strokeStyle = 'black';
        context.lineWidth = 3;
        context.fillStyle = '#fff'; 
        context.fillRect(0, 0, canvas.width, canvas.height);
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

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, 350, 350);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = getCoordinates(nativeEvent);
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = getCoordinates(nativeEvent);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        ctx.closePath();
        setIsDrawing(false);
    };

    const getCoordinates = (nativeEvent) => {
        if (nativeEvent.touches) {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            return {
                offsetX: nativeEvent.touches[0].clientX - rect.left,
                offsetY: nativeEvent.touches[0].clientY - rect.top
            };
        }
        return { offsetX: nativeEvent.offsetX, offsetY: nativeEvent.offsetY };
    };

    const clearCanvas = () => {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    };

    return (
        <div className="canvas-container">
            <label className="input-label">1. 참고 사진 업로드 (배경)</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{marginBottom: '10px'}} />
            
            <label className="input-label">2. 디자인 스케치 (직접 그리기)</label>
            <canvas
                ref={canvasRef}
                className="drawing-canvas"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
            />
            <button type="button" onClick={clearCanvas} className="reset-btn">
                지우고 다시 그리기
            </button>
        </div>
    );
});

export default CakeCanvas;