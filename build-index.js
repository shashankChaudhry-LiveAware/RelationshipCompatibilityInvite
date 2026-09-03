/**
 * Regenerates index.html from Mobile PersonalityMappingData inventory.
 * Run: node build-index.js
 */
const fs = require('fs');
const path = require('path');
const { PERSONALITY_TRAITS, PERSONALITY_QUESTIONS } = require('./_inventory.cjs');

const inventoryJson = JSON.stringify({
  TRAITS: PERSONALITY_TRAITS,
  QUESTIONS: PERSONALITY_QUESTIONS,
});

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Compatibility Assessment | LiveAware</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #f5f5f5; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; min-height: 100vh; }
    .header { text-align: center; padding: 20px 0; }
    .header h1 { color: #C41E3A; font-size: 28px; }
    .header p { color: #666; font-size: 14px; margin-top: 5px; }
    .invite-info { background: #E8F4FD; border-radius: 12px; padding: 15px; margin-bottom: 15px; text-align: center; }
    .invite-info p { color: #1976D2; font-size: 14px; }
    .invite-note { font-style: italic; color: #555 !important; margin-top: 8px; }
    .progress-section { margin-bottom: 20px; }
    .progress-info { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px; color: #666; }
    .progress-bar-bg { height: 6px; background: #E0E0E0; border-radius: 3px; overflow: hidden; }
    .progress-bar { height: 100%; background: #C41E3A; border-radius: 3px; transition: width 0.3s; }
    .question-card { background: #fff; border-radius: 16px; padding: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
    .trait-badge { display: inline-block; background: #E8F4FD; color: #1976D2; padding: 6px 14px; border-radius: 16px; font-size: 12px; font-weight: 600; margin-bottom: 15px; }
    .question-text { font-size: 18px; font-weight: 700; color: #1E3A5F; line-height: 1.4; margin-bottom: 10px; }
    .instruction { font-size: 13px; color: #666; margin-bottom: 20px; }
    .anchors { display: flex; justify-content: space-between; gap: 12px; font-size: 11px; color: #94a3b8; margin-bottom: 12px; }
    .options { display: flex; flex-direction: column; gap: 10px; }
    .option { display: flex; align-items: flex-start; padding: 14px; background: #F8F9FA; border: 2px solid #E8E8E8; border-radius: 12px; cursor: pointer; text-align: left; transition: all 0.2s; }
    .option:hover, .option.selected { border-color: #C41E3A; background: #FFF5F5; }
    .option-num { width: 32px; height: 32px; min-width: 32px; border-radius: 50%; background: #E0E0E0; color: #666; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; margin-right: 12px; }
    .option.selected .option-num { background: #C41E3A; color: #fff; }
    .option-content { flex: 1; }
    .option-label { font-weight: 600; font-size: 14px; color: #333; }
    .option.selected .option-label { color: #C41E3A; }
    .nav { display: flex; justify-content: space-between; margin-top: 25px; padding-top: 20px; border-top: 1px solid #E8E8E8; }
    .btn { padding: 12px 25px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; border: none; }
    .btn-prev { background: none; color: #666; }
    .btn-prev:disabled { opacity: 0.4; cursor: not-allowed; }
    .btn-next { background: #C41E3A; color: #fff; }
    .btn-next:hover { background: #A01830; }
    .btn-submit { background: #22C55E; color: #fff; }
    .btn-submit:hover { background: #16A34A; }
    .btn-submit:disabled { background: #ccc; cursor: not-allowed; }
    .screen { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
    .screen-card { background: #fff; border-radius: 16px; padding: 40px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.08); max-width: 400px; }
    .success-icon { width: 60px; height: 60px; background: #22C55E; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; margin: 0 auto 20px; }
    .error-title { color: #EF4444; margin-bottom: 15px; }
    .success-title { color: #22C55E; margin-bottom: 15px; }
    .spinner { width: 40px; height: 40px; border: 4px solid #E0E0E0; border-top-color: #C41E3A; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 15px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .hidden { display: none !important; }
    .store-links { margin-top: 20px; display: flex; flex-direction: column; gap: 10px; }
    .store-links a { text-decoration: none; color: #C41E3A; font-weight: 600; font-size: 14px; }
  </style>
</head>
<body>
  <div id="loadingScreen" class="screen">
    <div class="spinner"></div>
    <p>Loading...</p>
  </div>

  <div id="errorScreen" class="screen hidden">
    <div class="screen-card">
      <h2 class="error-title">Oops!</h2>
      <p id="errorMessage">You don't have permission to access this form.</p>
    </div>
  </div>

  <div id="successScreen" class="screen hidden">
    <div class="screen-card">
      <div class="success-icon">✓</div>
      <h2 class="success-title">Thank You!</h2>
      <p>Your Personality Type assessment has been submitted. Your partner can view relationship alignment in Live Aware.</p>
      <div class="store-links">
        <a href="https://apps.apple.com/app/id6474657320" target="_blank" rel="noopener">Download on the App Store</a>
        <a href="https://play.google.com/store/apps/details?id=com.liveaware" target="_blank" rel="noopener">Get it on Google Play</a>
      </div>
    </div>
  </div>

  <div id="mainForm" class="container hidden">
    <div class="header">
      <h1>LiveAware</h1>
      <p>Personality Compatibility Assessment</p>
    </div>
    <div class="invite-info">
      <p><strong id="inviterName">Someone</strong> invited you to complete your Personality Type so you both can see how your types interact.</p>
      <p id="inviteNote" class="invite-note hidden"></p>
    </div>
    <div class="progress-section">
      <div class="progress-info">
        <span>Question <span id="currentNum">1</span> of <span id="totalNum">44</span></span>
        <span><span id="answeredCount">0</span>/<span id="totalAnswered">44</span> answered</span>
      </div>
      <div class="progress-bar-bg"><div class="progress-bar" id="progressBar" style="width:0%"></div></div>
    </div>
    <div class="question-card">
      <div class="trait-badge" id="traitBadge"></div>
      <div class="question-text" id="questionText"></div>
      <div class="instruction">Select the option that best describes you (1–7).</div>
      <div class="anchors"><span id="leftAnchor"></span><span id="rightAnchor"></span></div>
      <div class="options" id="optionsContainer"></div>
      <div class="nav">
        <button type="button" class="btn btn-prev" id="prevBtn">Previous</button>
        <button type="button" class="btn btn-next" id="nextBtn">Next</button>
      </div>
    </div>
  </div>

  <script>
const API_URL = 'https://be.liveaware.in';
const INVENTORY = ${inventoryJson};
const TRAITS = INVENTORY.TRAITS;
const QUESTIONS = INVENTORY.QUESTIONS;
const TOTAL = QUESTIONS.length;

let currentIndex = 0;
let answers = {};
QUESTIONS.forEach((q) => { answers[q.id] = null; });
let inviteId = null;
let inviteData = null;

function getIdFromURL() {
  return new URLSearchParams(window.location.search).get('id');
}

function showScreen(screenId) {
  ['loadingScreen', 'errorScreen', 'successScreen', 'mainForm'].forEach((id) => {
    document.getElementById(id).classList.add('hidden');
  });
  document.getElementById(screenId).classList.remove('hidden');
}

function showError(message) {
  document.getElementById('errorMessage').textContent = message;
  showScreen('errorScreen');
}

async function loadInviteData() {
  inviteId = getIdFromURL();
  if (!inviteId) {
    showError("You don't have permission to access this form.");
    return;
  }
  try {
    const response = await fetch(API_URL + '/api/v1/compatibility/get-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: inviteId })
    });
    const data = await response.json();
    if (!data.error && data.data) {
      inviteData = data.data;
      if (inviteData.status === 'completed') {
        showError('This assessment has already been completed.');
        return;
      }
      document.getElementById('inviterName').textContent = inviteData.userName || 'Someone';
      if (inviteData.note) {
        document.getElementById('inviteNote').textContent = '"' + inviteData.note + '"';
        document.getElementById('inviteNote').classList.remove('hidden');
      }
      document.getElementById('totalNum').textContent = String(TOTAL);
      document.getElementById('totalAnswered').textContent = String(TOTAL);
      showScreen('mainForm');
      renderQuestion();
    } else {
      showError("You don't have permission to access this form.");
    }
  } catch (err) {
    console.error('Load error:', err);
    showError('Unable to load form. Please try again later.');
  }
}

function renderQuestion() {
  const q = QUESTIONS[currentIndex];
  const trait = TRAITS.find((t) => t.id === q.traitId) || {};
  document.getElementById('traitBadge').textContent = trait.traitHeading || trait.name || q.traitId;
  document.getElementById('questionText').textContent = q.prompt;
  document.getElementById('leftAnchor').textContent = q.leftAnchor || '';
  document.getElementById('rightAnchor').textContent = q.rightAnchor || '';
  document.getElementById('currentNum').textContent = String(currentIndex + 1);
  document.getElementById('progressBar').style.width = (((currentIndex + 1) / TOTAL) * 100) + '%';
  const answeredCount = Object.values(answers).filter((v) => v !== null).length;
  document.getElementById('answeredCount').textContent = String(answeredCount);

  const container = document.getElementById('optionsContainer');
  container.innerHTML = '';
  (q.options || []).forEach((label, idx) => {
    const value = idx + 1;
    const div = document.createElement('div');
    div.className = 'option' + (answers[q.id] === value ? ' selected' : '');
    div.innerHTML = '<div class="option-num">' + value + '</div><div class="option-content"><div class="option-label">' + label + '</div></div>';
    div.onclick = () => selectOption(value);
    container.appendChild(div);
  });

  document.getElementById('prevBtn').disabled = currentIndex === 0;
  const nextBtn = document.getElementById('nextBtn');
  if (currentIndex === TOTAL - 1) {
    nextBtn.textContent = 'Submit';
    nextBtn.className = 'btn btn-submit';
    nextBtn.onclick = submitForm;
  } else {
    nextBtn.textContent = 'Next';
    nextBtn.className = 'btn btn-next';
    nextBtn.onclick = goNext;
  }
}

function selectOption(value) {
  answers[QUESTIONS[currentIndex].id] = value;
  renderQuestion();
}

function goPrev() {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function goNext() {
  if (answers[QUESTIONS[currentIndex].id] === null) {
    alert('Please select an option before continuing.');
    return;
  }
  if (currentIndex < TOTAL - 1) {
    currentIndex++;
    renderQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

async function submitForm() {
  if (Object.values(answers).some((v) => v === null)) {
    alert('Please answer all ' + TOTAL + ' questions before submitting.');
    return;
  }
  const nextBtn = document.getElementById('nextBtn');
  nextBtn.disabled = true;
  nextBtn.textContent = 'Submitting...';
  try {
    const response = await fetch(API_URL + '/api/v1/compatibility/submit-partner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: inviteId, itemAnswers: answers })
    });
    const data = await response.json();
    if (!data.error) {
      showScreen('successScreen');
    } else {
      const msg = typeof data.message === 'string'
        ? data.message
        : (data.message && JSON.stringify(data.message)) || 'Failed to submit. Please try again.';
      alert(msg);
      nextBtn.disabled = false;
      nextBtn.textContent = 'Submit';
    }
  } catch (err) {
    console.error('Submit error:', err);
    alert('Failed to submit. Please check your connection and try again.');
    nextBtn.disabled = false;
    nextBtn.textContent = 'Submit';
  }
}

document.getElementById('prevBtn').onclick = goPrev;
loadInviteData();
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('Wrote index.html (' + PERSONALITY_QUESTIONS.length + ' questions)');
