import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

/**
 * Generates a beautiful HTML string for the medical report
 */
const createHtmlContent = (report) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  
  const currentTime = new Date().toLocaleTimeString('en-US');

  // Format arrays to HTML lists
  const formatList = (items) => {
    if (!items || items.length === 0) return '<li>None</li>';
    return items.map(item => `<li>${item}</li>`).join('');
  };

  const scoreText = report.score !== undefined ? `${report.score}%` : 'N/A';
  const scoreColor = report.score > 75 ? '#FF6B6B' : (report.score > 40 ? '#FFA500' : '#3B82F6');
  
  // Create HTML
  return `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 40px;
            background-color: #f9fbfd;
          }
          .container {
            max-width: 800px;
            margin: auto;
            background: #fff;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            border-top: 8px solid #3B82F6;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #eee;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .brand {
            display: flex;
            align-items: center;
          }
          .logo-text {
            font-size: 32px;
            font-weight: bold;
            color: #1E3A8A;
            margin: 0;
          }
          .logo-sub {
            font-size: 14px;
            color: #3B82F6;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .doc-info {
            text-align: right;
          }
          .doc-title {
            font-size: 24px;
            color: #333;
            margin: 0 0 5px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .doc-date {
            font-size: 14px;
            color: #666;
            margin: 0;
          }
          .patient-box {
            background-color: #f0f4f8;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
          }
          .patient-box div p {
            margin: 5px 0;
            font-size: 14px;
            color: #555;
          }
          .patient-box div p strong {
            color: #222;
          }
          .result-banner {
            background-color: ${scoreColor}15;
            border-left: 6px solid ${scoreColor};
            padding: 20px;
            border-radius: 4px;
            margin-bottom: 30px;
          }
          .result-banner h2 {
            margin: 0 0 10px 0;
            color: ${scoreColor};
            font-size: 22px;
          }
          .result-banner p {
            margin: 0;
            font-size: 16px;
            color: #444;
          }
          .section {
            margin-bottom: 30px;
          }
          .section h3 {
            font-size: 18px;
            color: #1E3A8A;
            border-bottom: 1px solid #ddd;
            padding-bottom: 8px;
            margin-bottom: 15px;
            text-transform: uppercase;
          }
          ul {
            padding-left: 20px;
            margin: 0;
            color: #444;
            line-height: 1.6;
          }
          li {
            margin-bottom: 8px;
          }
          .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            text-align: center;
            font-size: 12px;
            color: #888;
          }
          .signature {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
          }
          .sig-line {
            width: 200px;
            border-bottom: 1px solid #333;
            text-align: center;
            padding-bottom: 5px;
            font-size: 14px;
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="brand">
              <div>
                <h1 class="logo-text">DENGUE KBS</h1>
                <p class="logo-sub">AI Medical Diagnosis System</p>
              </div>
            </div>
            <div class="doc-info">
              <h2 class="doc-title">Clinical Report</h2>
              <p class="doc-date">Generated: ${currentDate} ${currentTime}</p>
              <p class="doc-date">Report ID: ${report.id || 'SYS-' + Math.floor(Math.random() * 10000)}</p>
            </div>
          </div>

          <div class="patient-box">
            <div>
              <p><strong>Patient Name:</strong> ___________________</p>
              <p><strong>Age/Gender:</strong> ____________________</p>
              <p><strong>Contact:</strong> _______________________</p>
            </div>
            <div style="text-align: right;">
              <p><strong>Analysis Date:</strong> ${report.date || currentDate}</p>
              <p><strong>Analyzed By:</strong> Automated AI Engine</p>
            </div>
          </div>

          <div class="result-banner">
            <h2>DIAGNOSIS RESULT: ${report.status || report.result || 'Analysis Complete'}</h2>
            <p><strong>Risk Level:</strong> ${report.result || 'Unknown'}</p>
            <p><strong>Machine Learning Probability Score:</strong> ${scoreText}</p>
            ${report.alertText ? `<p style="margin-top: 10px; color: ${scoreColor}; font-weight: bold;">Alert: ${report.alertText}</p>` : ''}
          </div>

          <div class="section">
            <h3>Captured Symptoms & Clinical Signs</h3>
            <ul>
              ${formatList(report.symptoms)}
            </ul>
          </div>

          <div class="section">
            <h3>Medical Recommendations</h3>
            <ul>
              ${formatList(report.recommendations)}
            </ul>
          </div>

          <div class="section">
            <h3>AI Logic & Reasoning Engine</h3>
            <ul>
              ${formatList(report.reasoning)}
            </ul>
          </div>

          <div class="signature">
            <div class="sig-line">
              <p style="margin:0;">Physician / Examiner</p>
            </div>
            <div class="sig-line">
              <p style="margin:0;">Digital AI Signature</p>
            </div>
          </div>

          <div class="footer">
            <p>This report is generated by Dengue KBS AI. It is intended to assist medical professionals and should not replace clinical judgment.</p>
            <p>&copy; ${new Date().getFullYear()} Dengue KBS. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const generateAndSharePDF = async (reportData) => {
  try {
    const html = createHtmlContent(reportData);
    const { uri } = await Print.printToFileAsync({ html });
    
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Download Medical Report',
        UTI: 'com.adobe.pdf'
      });
    } else {
      console.log('Sharing is not available on this platform');
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
