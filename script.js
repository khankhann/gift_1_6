
// const IMAGE_LINKS = ["link1", "link2", "link3"...]; // tạo folder ảnh rồi dán link từng ảnh vào đây 
const IMAGE_LINKS = [
  "picture/IMG_0619.JPG", "picture/IMG_0620.JPG", "picture/IMG_0621.JPG", "picture/IMG_0622.JPG", 
  "picture/IMG_0623.JPG", "picture/IMG_0624.JPG", "picture/IMG_0625.JPG", 
   "picture/IMG_0628.JPG", "picture/IMG_0629.JPG", 
  "picture/IMG_0631.JPG", "picture/IMG_0632.JPG", "picture/IMG_0633.JPG", "picture/IMG_0634.JPG", 
  "picture/IMG_0635.JPG", "picture/IMG_0636.JPG", "picture/IMG_0637.JPG", "picture/IMG_0638.JPG", 
  "picture/IMG_0639.JPG", "picture/IMG_0640.JPG", "picture/IMG_0641.JPG", "picture/IMG_0642.JPG", 
  "picture/IMG_0643.JPG", "picture/IMG_0644.JPG", "picture/IMG_0645.JPG", "picture/IMG_0646.JPG", 
  "picture/IMG_0647.JPG", "picture/IMG_0648.JPG", "picture/IMG_0649.JPG", "picture/IMG_0650.JPG", 
  "picture/IMG_0651.JPG", "picture/IMG_0652.JPG", "picture/IMG_0653.JPG", "picture/IMG_0654.JPG", 
  "picture/IMG_0655.JPG", "picture/IMG_0656.JPG", "picture/IMG_0657.JPG", "picture/IMG_0658.JPG", 
  "picture/IMG_0659.JPG", "picture/IMG_0660.JPG", "picture/IMG_0661.JPG", "picture/IMG_0662.JPG", 
  "picture/IMG_0663.JPG", "picture/IMG_0664.JPG", "picture/IMG_0665.JPG", "picture/IMG_0666.JPG", 
  "picture/IMG_0667.JPG", "picture/IMG_0668.JPG", "picture/IMG_0669.JPG", "picture/IMG_0670.JPG", 
  "picture/IMG_0671.JPG", "picture/IMG_0672.JPG", "picture/IMG_0673.JPG", "picture/IMG_0674.JPG", 
  "picture/IMG_0675.JPG", "picture/IMG_0676.JPG", "picture/IMG_0677.JPG", "picture/IMG_0678.JPG", 
  "picture/IMG_0679.JPG", "picture/IMG_0680.JPG", "picture/IMG_0681.JPG", "picture/IMG_0682.JPG", 
  "picture/IMG_0683.JPG", "picture/IMG_0684.JPG", "picture/IMG_0685.JPG", "picture/IMG_0686.JPG", 
  "picture/IMG_0687.JPG", "picture/IMG_0688.JPG", "picture/IMG_0689.JPG", "picture/IMG_0690.JPG", 
  "picture/IMG_0691.JPG", "picture/IMG_0692.JPG", "picture/IMG_0693.JPG", "picture/IMG_0694.JPG", 
  "picture/IMG_0695.JPG", "picture/IMG_0696.JPG", "picture/IMG_0697.JPG"
];

const STAR_COLORS = [
  [255, 107, 157], [255, 179, 209], [255, 204, 229], [255, 255, 255], [255, 230, 240] 
];


const canvas = document.getElementById('galaxy');
const ctx    = canvas.getContext('2d');
let W, H, stars = [], nebulae = [], shoots = [];
let mouse = { x: 0, y: 0 };
let t = 0;

let isFormingText = false;
let warpSpeed = false; 
const textSequence = ["Chúc Mừng", " Ngày 1-6 Vui Vẻ!", "Các Bạn Là", "Điều Kỳ Diệu", "Trong Cuộc Sống Của Mình!"];

// Nội dung bức thư HTML (Bạn có thể tự do chỉnh sửa)
const letterContent = `Cảm ơn các bạn đã xuất hiện trong cuộc sống của mình —<br>mỗi khoảnh khắc bên bạn đều là <em>điều kỳ diệu nhỏ</em> mà mình trân trọng từng ngày.<br><br>Dù là lúc vui hay buồn,<br>mình luôn muốn các bạn biết rằng<br><em>các bạn thật sự quan trọng</em>. 🩷`;

function rand(a, b) { return a + Math.random() * (b - a); }
function randInt(a, b) { return Math.floor(rand(a, b + 1)); }

function resizeCanvas() {
   W = canvas.width = window.innerWidth; 
   H = canvas.height = window.innerHeight; 
  buildScene();
  }
  window.addEventListener('resize', () => {
  resizeCanvas();
});

function buildScene() {
  stars = []; nebulae = []; shoots = []; warpSpeed = false; 
  const count = Math.min(6000, Math.max(6000, Math.floor(W * H / 100)));
  
  for (let i = 0; i < count; i++) {
    const col = STAR_COLORS[randInt(0, STAR_COLORS.length - 1)];
    const r = Math.random() < 0.05 ? rand(1.5, 2.5) : Math.random() < 0.4 ? rand(0.6, 1.2) : rand(0.2, 0.5);
    let sx, sy;
    if (Math.random() < 0.8) { 
      let angle = Math.random() * Math.PI * 2;
      let radius = Math.pow(Math.random(), 2.5) * (Math.min(W, H) * 0.8);
      sx = W / 2 + Math.cos(angle) * radius * 1.5; sy = H / 2 + Math.sin(angle) * radius;
    } else {
      sx = rand(0, W); sy = rand(0, H);
    }
    stars.push({
      x: sx, y: sy, vx: 0, vy: 0, tx: 0, ty: 0, isText: false, 
      renderAlpha: rand(0.1, 0.8), origAlpha: rand(0.1, 0.8),
      origCol: col, currentCol: col, r, baseR: r,
      twOff: rand(0, Math.PI * 2), twSpd: rand(0.005, 0.03), depth: rand(0.2, 1.0),
      hasCross: r > 1.8 && Math.random() < 0.3,
    });
  }

  const nebColors = [ [255, 107, 157], [200, 50, 100], [150, 20, 60] ];
  for (let i = 0; i < 4; i++) {
    nebulae.push({
      x: rand(W * 0.3, W * 0.7), y: rand(H * 0.3, H * 0.7),
      rx: rand(W * 0.2, W * 0.4), ry: rand(H * 0.2, H * 0.3),
      angle: rand(0, Math.PI), alpha: rand(0.02, 0.06), col: nebColors[randInt(0, 2)],
    });
  }
}

function getTextPoints(text) {
  const tCanvas = document.createElement('canvas'); 
  const tCtx = tCanvas.getContext('2d', { willReadFrequently: true });
  tCanvas.width = W; tCanvas.height = H;
  
  // LOGIC RESPONSIVE MỚI
  const isMobile = W < 768;
  
  // Nếu là mobile, ta dùng font size cố định hoặc to hơn để không bị tràn
  // Công thức: Chiều ngang chia cho số ký tự, nhưng có giới hạn tối thiểu
  let fontSize = isMobile ? Math.min(W / (text.length * 0.35), 60) : Math.min(W / (text.length * 0.4), 120);
  
  // Ép font-weight 900 cho chữ siêu dày
  tCtx.fillStyle = 'white'; 
  tCtx.font = `900 ${fontSize}px 'Dancing Script', cursive`;
  tCtx.textAlign = 'center'; 
  tCtx.textBaseline = 'middle'; 
  tCtx.fillText(text, W / 2, H / 2);

  const imgData = tCtx.getImageData(0, 0, W, H).data; 
  const points = [];
  
  // Tăng mật độ hạt (step nhỏ hơn = hạt dày hơn)
  const step = isMobile ? 2 : Math.max(2, Math.floor(W / 450)); 
  
  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) { 
      if (imgData[(y * W + x) * 4 + 3] > 128) points.push({ x, y }); 
    }
  }
  return points;
}

function playTextSequence() {
  isFormingText = true; let step = 0;
  function nextText() {
    if (step < textSequence.length) {
      const points = getTextPoints(textSequence[step]);
      const shuffledStars = stars.sort(() => Math.random() - 0.5);
      shuffledStars.forEach((s, i) => {
        if (i < points.length) { s.isText = true; s.tx = points[i].x; s.ty = points[i].y; } else { s.isText = false; }
      });
      step++; setTimeout(nextText, 5500); 
    } else {
      document.getElementById('continue-wrap').classList.add('visible');
    }
  }
  nextText();
}

function drawMilkyWay() {
  ctx.save(); ctx.translate(W / 2, H / 2);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, W * 0.35);
  
  g.addColorStop(0, 'rgba(255, 107, 157, 0.25)'); 
  g.addColorStop(0.4, 'rgba(255, 107, 157, 0.08)'); 
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.scale(1, (H * 1.6) / (W * 0.55));
  ctx.beginPath(); ctx.arc(0, 0, W * 0.35, 0, Math.PI * 2);
  ctx.fillStyle = g; ctx.fill(); ctx.restore();
}
// ════ VÒNG LẶP VẼ BACKGROUND (CÓ SAO CHỔI) ════
function galaxyDraw() {
  ctx.fillStyle = warpSpeed ? 'rgba(0, 0, 8, 0.6)' : '#000008';
  ctx.fillRect(0, 0, W, H);
  if (!warpSpeed) drawMilkyWay(); 

  // --- VẼ SAO BĂNG / SAO CHỔI ---
  if (!warpSpeed) {
    for (let i = shoots.length - 1; i >= 0; i--) {
      const s = shoots[i];
      s.life -= s.dec;
      if (s.life <= 0) { shoots.splice(i, 1); continue; }
      s.x += s.vx; s.y += s.vy;
      
      const grd = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * s.len / 12, s.y - s.vy * s.len / 12);
      grd.addColorStop(0,   `rgba(255, 255, 255, ${s.life})`);
      grd.addColorStop(0.3, `rgba(255, 179, 209, ${s.life * 0.5})`);
      grd.addColorStop(1,   'rgba(255, 179, 209, 0)');
      
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.vx * s.len / 12, s.y - s.vy * s.len / 12);
      ctx.strokeStyle = grd;
      ctx.lineWidth = 2.5; 
      ctx.stroke();
    }
    
    // Tỉ lệ xuất hiện sao chổi mới
    if (Math.random() < 0.03) { 
      shoots.push({
        x: rand(0, W), y: rand(0, H * 0.4), 
        vx: rand(15, 25), vy: rand(4, 10),  
        len: rand(150, 400),                
        life: 1.0, dec: rand(0.015, 0.03),  
      });
    }
  }

  for (const s of stars) {
    if (warpSpeed) {
      s.cx += s.cx * s.warpSpeedMultiplier; s.cy += s.cy * s.warpSpeedMultiplier;
      s.x = W / 2 + s.cx; s.y = H / 2 + s.cy;
      s.r += s.baseR * s.warpSpeedMultiplier * 0.6;

      if (s.x < -50 || s.x > W + 50 || s.y < -50 || s.y > H + 50) {
        let angle = Math.random() * Math.PI * 2; let dist = Math.random() * 80; 
        s.cx = Math.cos(angle) * dist; s.cy = Math.sin(angle) * dist;
        s.x = W / 2 + s.cx; s.y = H / 2 + s.cy; s.r = rand(0.2, 1.0); s.baseR = s.r;
        s.warpSpeedMultiplier = rand(0.008, 0.035); s.currentCol = s.origCol;
      }
    } 
    else if (isFormingText) {
      if (s.isText) {
        s.vx += (s.tx - s.x) * 0.006;
         s.vy += (s.ty - s.y) * 0.006;
         s.vx *= 0.90; s.vy *= 0.90;
        s.currentCol = [255, 255, 255]; s.renderAlpha = Math.min(1, s.renderAlpha + 0.1); 
      } else {
        s.vx += (Math.random() - 0.5) * 0.1; s.vy += (Math.random() - 0.5) * 0.1;
         s.vx *= 0.85; s.vy *= 0.85;
        s.currentCol = s.origCol; s.renderAlpha = s.origAlpha * 0.3 * (0.5 + 0.5 * Math.sin(t * s.twSpd + s.twOff));
      }
      s.x += s.vx; s.y += s.vy;
    } else {
      s.vx += (Math.random() - 0.5) * 0.02; s.vy += (Math.random() - 0.5) * 0.02; s.vx *= 0.95; s.vy *= 0.95;
      s.currentCol = s.origCol; s.renderAlpha = s.origAlpha * (0.5 + 0.5 * Math.sin(t * s.twSpd + s.twOff));
      s.x += s.vx; s.y += s.vy;
    }

    const ox = (mouse.x - W / 2) * s.depth * 0.015 * -1;
    const oy = (mouse.y - H / 2) * s.depth * 0.015 * -1;
    const px = s.x + ox; const py = s.y + oy;
    if (s.renderAlpha <= 0.01) continue; 
    const [r, g, b] = s.currentCol;
const glow = (isFormingText && s.isText) ? s.r * 15 : s.r * 4;
    if (s.r > 1.2 && (!isFormingText || s.isText)) {
      const grd = ctx.createRadialGradient(px, py, 0, px, py, s.r * 4);
      grd.addColorStop(0, `rgba(${r},${g},${b},${s.renderAlpha * 0.35})`); grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath(); ctx.arc(px, py, s.r * 4, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill();
    }
    const size = (isFormingText && s.isText) ? s.r * 1.5 : s.r;
    ctx.beginPath(); ctx.arc(px, py, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${b},${s.renderAlpha})`; ctx.fill();
  }
  t++; requestAnimationFrame(galaxyDraw);
}

resizeCanvas(); buildScene(); galaxyDraw();
window.addEventListener('resize', () => { resizeCanvas(); buildScene(); });

// ═══════════════════════════════════════
//  EVENTS, MODAL & INTERACTIVE CYLINDER
// ═══════════════════════════════════════
const holdBtn      = document.getElementById('holdBtn');
const progressRing = document.getElementById('progressRing');
const intro        = document.getElementById('intro');
const msgScreen    = document.getElementById('message-screen');
const continueBtn  = document.getElementById('continueBtn');
const continueWrap = document.getElementById('continue-wrap');
const sphereZone   = document.getElementById('sphere-zone');
const sphereScene  = document.getElementById('sphere-scene');
const openCardBtn  = document.getElementById('openCardBtn');

const imageModal   = document.getElementById('image-modal');
const zoomedImg    = document.getElementById('zoomedImg');
const closeModal   = document.getElementById('closeModal');
let isModalOpen    = false; 
let hasDragged     = false;

let holdInterval = null; 
let progress = 0; 
let holding = false;

function startHold() {
  if (holding) return; holding = true;
  progressRing.style.opacity = '1';
  
const bgMusic = document.getElementById('bgMusic');
  if (bgMusic) {
   bgMusic.play().then(() => {
      console.log("Nhạc đã phát thành công!");
    }).catch(error => {
      console.log("Trình duyệt vẫn chặn, cần thêm tương tác: ", error);
    });
  
    
  }

  holdInterval = setInterval(() => {
    progress += 2; if (progress > 100) progress = 100;
    progressRing.style.background = `conic-gradient(var(--pink) ${progress * 3.6}deg, transparent ${progress * 3.6}deg)`;
    if (progress >= 100) {
       clearInterval(holdInterval);
      holding = false;
      
      revealMessage();
     }
  }, 30);
}

function stopHold() {
  if (!holding) return; holding = false; clearInterval(holdInterval);
  if (progress < 100) {
    const decay = setInterval(() => {
      progress -= 3; if (progress <= 0) { progress = 0; progressRing.style.opacity = '0'; clearInterval(decay); }
      progressRing.style.background = `conic-gradient(var(--pink) ${progress * 3.6}deg, transparent ${progress * 3.6}deg)`;
    }, 20);
  }
}

holdBtn.addEventListener('mousedown', startHold);
holdBtn.addEventListener('touchstart', e => { e.preventDefault(); startHold(); }, { passive: false });
holdBtn.addEventListener('mouseup', stopHold); holdBtn.addEventListener('mouseleave', stopHold);
holdBtn.addEventListener('touchend', stopHold); holdBtn.addEventListener('touchcancel', stopHold);

function revealMessage() {
  intro.style.transition = 'opacity 1s ease'; intro.style.opacity = '0';
  setTimeout(() => intro.style.display = 'none', 1000);
  setTimeout(playTextSequence, 500); 
}

// KHAI BÁO BIẾN CHO TƯƠNG TÁC TRỤ 3D
let sphereRotX = -10; let sphereRotY = 0;
let isDraggingSphere = false;
let startMouseX = 0, startMouseY = 0;
let currentRotX = -10, currentRotY = 0;
let sphereAnimId = null;

function renderSphere() {
  if (isModalOpen || !sphereZone.classList.contains('visible')) {
    sphereAnimId = requestAnimationFrame(renderSphere);
    return;
  }
  if (!isDraggingSphere && !isModalOpen) {
    sphereRotY -= 0.15; 
  }
  sphereScene.style.transform = `rotateX(${sphereRotX}deg) rotateY(${sphereRotY}deg)`;
  sphereAnimId = requestAnimationFrame(renderSphere);
}

continueBtn.addEventListener('click', () => {
  continueWrap.classList.remove('visible'); isFormingText = false; warpSpeed = true; 
  stars.forEach(s => { s.cx = s.x - W / 2; s.cy = s.y - H / 2; s.warpSpeedMultiplier = rand(0.005, 0.025); s.baseR = s.r; });
  setTimeout(() => { canvas.style.opacity = '0'; }, 2500);

  setTimeout(() => {
    warpSpeed = false;
    stars.forEach(s => { s.x = rand(0, W); s.y = rand(0, H); s.vx = 0; s.vy = 0; });
    canvas.style.opacity = '1'; 
    sphereZone.classList.add('visible'); 
    buildImageCylinder(); 
    if(!sphereAnimId) renderSphere();
  }, 4000); 
});

function buildImageCylinder() {
  sphereScene.innerHTML = ''; 
  const rows = 3; const cols = 20; 
  const totalImages = rows * cols;
  const radius = Math.min(window.innerWidth, window.innerHeight) * 0.75;
  const ySpacing = window.innerWidth < 768 ? 120 : 220; 
  const startY = -((rows - 1) * ySpacing) / 2; 
  
  let imgIndex = 0;

  for (let r = 0; r < rows; r++) {
    let yOffset = startY + r * ySpacing;
    for (let c = 0; c < cols; c++) {
      let angle = (360 / cols) * c + (r % 2 !== 0 ? (360 / cols) / 2 : 0);

      const img = document.createElement('img');
      img.src = IMAGE_LINKS[imgIndex % IMAGE_LINKS.length];
      img.className = 'sphere-img';
      img.loading = 'lazy';
      img.draggable = false; 

      // DÙNG CÁCH NÀY ĐỂ TRÁNH BUG:
      // Gán trực tiếp onclick thay vì addEventListener
      img.onclick = (e) => {
        if (hasDragged) return; // Nếu đang xoay thì không mở
        // Kiểm tra chắc chắn chỉ mở khi sphere đang visible
        if (sphereZone.classList.contains('visible')) {
           openImageModal(img.src);
        }
      };

      img.style.transform = `translate3d(150vw, ${rand(-300, 300)}px, ${rand(-500, 500)}px)`;
      sphereScene.appendChild(img);
      void img.offsetWidth; 

      setTimeout(() => {
        img.style.transform = `translateY(${yOffset}px) rotateY(${angle}deg) translateZ(${radius}px)`;
        img.style.opacity = '1';
      }, 100 + (imgIndex * 35)); 

      imgIndex++;
    }
  }
  setTimeout(() => { openCardBtn.classList.add('show'); }, totalImages * 35 + 2000);
}
// LOGIC MODAL PHÓNG TO ẢNH
function openImageModal(src) {
  isModalOpen = true;
  zoomedImg.src = src;
  imageModal.classList.add('visible');
}

function closeImageModalFunc() {
  isModalOpen = false;
  imageModal.classList.remove('visible');
  setTimeout(() => { zoomedImg.src = ""; }, 500);
}

closeModal.addEventListener('click', closeImageModalFunc);
imageModal.addEventListener('click', (e) => { if (e.target === imageModal) closeImageModalFunc(); });

// LOGIC KÉO THẢ TRỤ XOAY VÀ PHÂN BIỆT VỚI CLICK
const startDrag = (e) => {
  isDraggingSphere = true; hasDragged = false; 
  startMouseX = e.touches ? e.touches[0].clientX : e.clientX;
  startMouseY = e.touches ? e.touches[0].clientY : e.clientY;
  currentRotX = sphereRotX; currentRotY = sphereRotY;
};

const moveDrag = (e) => {
  if (!isDraggingSphere) return;
  let clientX = e.touches ? e.touches[0].clientX : e.clientX;
  let clientY = e.touches ? e.touches[0].clientY : e.clientY;
  
  let deltaX = clientX - startMouseX; let deltaY = clientY - startMouseY;
  if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) { hasDragged = true; }
  
  sphereRotY = currentRotY + deltaX * 0.4;
  sphereRotX = currentRotX - deltaY * 0.2; 
  sphereRotX = Math.max(-25, Math.min(25, sphereRotX));
};

const endDrag = () => { 
  isDraggingSphere = false; 
  setTimeout(() => { hasDragged = false; }, 50);
};

sphereZone.addEventListener('mousedown', startDrag); sphereZone.addEventListener('touchstart', startDrag, {passive: true});
window.addEventListener('mousemove', moveDrag); window.addEventListener('touchmove', moveDrag, {passive: true});
window.addEventListener('mouseup', endDrag); window.addEventListener('touchend', endDrag);

// MỞ THƯ THEO HIỆU ỨNG ĐÁNH MÁY
function typeWriterHTML(element, fullHTML, speed, callback) {
  element.innerHTML = ''; let i = 0; let currentString = '';
  function type() {
    if (i < fullHTML.length) {
      if (fullHTML.charAt(i) === '<') {
        let tag = '';
        while (fullHTML.charAt(i) !== '>' && i < fullHTML.length) { tag += fullHTML.charAt(i); i++; }
        tag += '>'; currentString += tag; i++; element.innerHTML = currentString; type(); 
      } else {
        currentString += fullHTML.charAt(i); element.innerHTML = currentString; i++; setTimeout(type, speed); 
      }
    } else { if (callback) callback(); }
  }
  type();
}

openCardBtn.addEventListener('click', () => {
  sphereZone.classList.remove('visible'); 
  setTimeout(() => {
    msgScreen.classList.add('visible'); startHeartsRain();
    setTimeout(() => {
      typeWriterHTML(document.getElementById('msgBody'), letterContent, 40, () => {
        document.getElementById('msgSign').classList.add('show');
      });
    }, 500);
  }, 1000);
});

function startHeartsRain() {
  const emojis = ['🩷','💕','✨','🌸','💖','💗']; let count = 0;
  const interval = setInterval(() => {
    const h = document.createElement('div'); h.className = 'falling-heart';
    h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    h.style.left = rand(0, 95) + 'vw'; h.style.fontSize = rand(12, 24) + 'px';
    const dur = rand(3, 6); h.style.animation = `fall ${dur}s linear forwards`;
    document.getElementById('heartsRain').appendChild(h);
    setTimeout(() => h.remove(), dur * 1000 + 100);
    count++; if (count > 40) clearInterval(interval);
  }, 80);
}

document.getElementById('backBtn').addEventListener('click', () => {
  msgScreen.classList.remove('visible');
  imageModal.classList.remove('visible');
  document.getElementById('msgBody').innerHTML = '';
  document.getElementById('msgSign').classList.remove('show');
  canvas.style.opacity = '1'; progress = 0; progressRing.style.opacity = '0';
  progressRing.style.background = 'conic-gradient(var(--pink) 0%, transparent 0%)';
  buildScene(); 
  setTimeout(() => {
    intro.style.display = 'flex';
    setTimeout(() => { intro.style.opacity = '1'; }, 10);
  }, 500);
});