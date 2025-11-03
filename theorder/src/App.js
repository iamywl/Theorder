// src/App.js

import './App.css';
import OrderForm from './OrderForm'; // 1. OrderForm 컴포넌트 불러오기

function App() {
  return (
    <div className="App">
      {/* 2. OrderForm 컴포넌트 렌더링 */}
      <OrderForm /> 
    </div>
  );
}

export default App;