import React, { useState, useRef } from 'react';
import Chart from './components/Chart';
import './App.css'; 
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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

  const printRef = useRef();

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element, {
      scrollY: -window.scrollY,
      useCORS: true
    });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
  
    let pdfHeight = pdf.internal.pageSize.getHeight();
    let pdfWidth = pdf.internal.pageSize.getWidth();
    let totalHeight = canvas.height;
    
    for (let position = 0; position < totalHeight; position += pdfHeight) {
      if (position !== 0) {
        pdf.addPage();
      }
      pdf.addImage(imgData, 'PNG', 0, -position, pdfWidth, totalHeight);
    }
  
    pdf.save('download.pdf');
  };

  return (
    <div ref={printRef}>

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

      <div className="button-container">
        <button onClick={handleDownloadPdf} className="download-button">Download as PDF</button>
      </div>

    </div>
  );
}

export default App;
