import React, { useState } from 'react';
import Chart from './components/Chart';
import './App.css'; 

function App() {
  const [tickers] = useState([
    '^GSPC', '^IXIC', '^DJI',
    '000002.SS', '399107.SZ', '^HSI',
    '^STOXX', '^FTSE', '^GDAXI',
    'GC=F', 'HG=F', 'Missing Copper/Gold Ratio',
    'CL=F', 'BZ=F', 'NG=F',
    'DX-Y.NYB', 'EURCNY=X', 'JPYCNY=X',
    'CNY=X', 'HKDCNY=X', 'JPY=X'
  ]);

  return (
    <div>
      <header className="app-header">
        <div className="header-content">
          <img src="logo.png" alt="Logo" className="logo" />
          <div>
            <h1 className="title">Market Dashboard</h1>
            <h2 className="subtitle">by Frank Zhao</h2>
          </div>
        </div>
      </header>

      <div className="instructions">
        <p>
          本程序用于跟踪各市场指标，数据非实时更新，展示皆为收盘价，仅供参考。部分图表未完成，请待后续更新；后续亦有更多功能更新。
          全部为非工作时间完成，更新较慢请谅解。如有问题或修改建议欢迎联系微信：frankz2020
        </p>
      </div>
      
      <div className="chart-grid">
        {tickers.map(ticker => (
          <Chart key={ticker} ticker={ticker} />
        ))}
      </div>
    </div>
  );
}

export default App;
