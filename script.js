let uploadedLogo = null;
let fgColor = '#000000';
let bgColor = '#ffffff';

const qrContainer = document.getElementById('qrContainer');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const fgBox       = document.getElementById('fgColorBox');
const bgBox       = document.getElementById('bgColorBox');
const fgPicker    = document.getElementById('fgPicker');
const bgPicker    = document.getElementById('bgPicker');

// Initialize box colors
fgBox.style.background = fgColor;
bgBox.style.background = bgColor;

// When you pick a color, update the box and stored value
fgPicker.addEventListener('input', e => {
  fgColor = e.target.value;
  fgBox.style.background = fgColor;
});
bgPicker.addEventListener('input', e => {
  bgColor = e.target.value;
  bgBox.style.background = bgColor;
});

// Generate preview
generateBtn.addEventListener('click', () => {
  const qrText = document.getElementById('qrText').value.trim();
  if (!qrText) return alert('Please enter text or URL');

  qrContainer.innerHTML = '';

  // Create off-screen QR
  const tmp = document.createElement('div');
  tmp.style.display = 'none';
  document.body.appendChild(tmp);

  const PREVIEW_S = 260, M = 20;
  new QRCode(tmp, {
    text: qrText,
    width: PREVIEW_S,
    height: PREVIEW_S,
    colorDark: fgColor,
    colorLight: bgColor,
    correctLevel: QRCode.CorrectLevel.H
  });

  setTimeout(() => {
    const raw = tmp.querySelector('canvas') || tmp.querySelector('img');
    const cvs = document.createElement('canvas');
    cvs.width = PREVIEW_S + M*2;
    cvs.height = PREVIEW_S + M*2;
    const ctx = cvs.getContext('2d');

    // draw background + margin
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    // draw qr
    ctx.drawImage(raw, M, M, PREVIEW_S, PREVIEW_S);

    // draw logo if any
    if (uploadedLogo) {
      const logo = new Image();
      logo.src = uploadedLogo;
      logo.onload = () => {
        const L = PREVIEW_S * 0.2;
        const x = (cvs.width - L)/2, y = (cvs.height - L)/2;
        // clear center
        ctx.fillStyle = bgColor;
        ctx.fillRect(x - 4, y - 4, L + 8, L + 8);
        ctx.drawImage(logo, x, y, L, L);
        finish();
      };
    } else finish();

    function finish() {
      qrContainer.innerHTML = '';
      qrContainer.appendChild(cvs);
      document.body.removeChild(tmp);
    }
  }, 50);
});

// Download final
downloadBtn.addEventListener('click', () => {
  const qrText = document.getElementById('qrText').value.trim();
  if (!qrText) return alert('Please enter text or URL');

  const S = parseInt(document.getElementById('sizeInput').value) || 500;
  const M = 20;
  const tmp = document.createElement('div');
  tmp.style.display = 'none';
  document.body.appendChild(tmp);

  new QRCode(tmp, {
    text: qrText, width: S, height: S,
    colorDark: fgColor, colorLight: bgColor,
    correctLevel: QRCode.CorrectLevel.H
  });

  setTimeout(() => {
    const raw = tmp.querySelector('canvas') || tmp.querySelector('img');
    const cvs = document.createElement('canvas');
    cvs.width = S + M*2;
    cvs.height = S + M*2;
    const ctx = cvs.getContext('2d');

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    ctx.drawImage(raw, M, M, S, S);

    if (uploadedLogo) {
      const logo = new Image();
      logo.src = uploadedLogo;
      logo.onload = () => {
        const L = S * 0.2;
        const x = (cvs.width - L)/2, y = (cvs.height - L)/2;
        ctx.fillStyle = bgColor;
        ctx.fillRect(x - 4, y - 4, L + 8, L + 8);
        ctx.drawImage(logo, x, y, L, L);
        finishDownload();
      };
    } else finishDownload();

    function finishDownload() {
      document.body.removeChild(tmp);
      const link = document.createElement('a');
      link.href = cvs.toDataURL('image/png');
      link.download = 'qrcode.png';
      link.click();
    }
  }, 50);
});
