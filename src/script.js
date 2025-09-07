// Simple local clicker with random bonus drops and a fake wallet id
(function(){
  const walletKey = 'pengu_wallet';
  const balanceKey = 'pengu_balance';
  const clicksKey = 'pengu_clicks';

  function randHex(len){ let s=''; const chars='0123456789abcdef'; for(let i=0;i<len;i++) s+=chars[Math.floor(Math.random()*chars.length)]; return s; }
  function now(){ return new Date().toLocaleTimeString(); }

  // init wallet
  let wallet = localStorage.getItem(walletKey);
  if(!wallet){
    wallet = '0x' + randHex(8) + '...' + randHex(8);
    localStorage.setItem(walletKey, wallet);
  }
  document.getElementById('walletAddr').textContent = wallet;

  let balance = parseFloat(localStorage.getItem(balanceKey) || '0');
  let clicks = parseInt(localStorage.getItem(clicksKey) || '0', 10);
  const balanceEl = document.getElementById('balance');
  const logEl = document.getElementById('log');
  const bonusMsg = document.getElementById('bonusMsg');

  function updateUI(){
    balanceEl.textContent = balance.toFixed(0);
  }
  function addLog(txt){
    const li = document.createElement('li');
    li.textContent = `${now()} — ${txt}`;
    logEl.insertBefore(li, logEl.firstChild);
  }

  updateUI();
  if(clicks>0) addLog('Welcome back — your score was restored.');

  document.getElementById('penguBtn').addEventListener('click', ()=>{
    clicks++;
    balance += 1; // 1 PENGU per click
    localStorage.setItem(balanceKey, balance);
    localStorage.setItem(clicksKey, clicks);
    updateUI();

    // every 10 clicks: random bonus
    if(clicks % 10 === 0){
      const bonus = Math.floor(Math.random()*50) + 3; // 3-
      balance += bonus;
      localStorage.setItem(balanceKey, balance);
      bonusMsg.textContent = `Lucky drop! +${bonus} PENGU`;
      addLog(`Got bonus +${bonus} PENGU`);
      setTimeout(()=> bonusMsg.textContent = '', 3500);
    } else {
      addLog('Clicked +1 PENGU');
    }
  });

  document.getElementById('resetBtn').addEventListener('click', ()=>{
    if(confirm('Reset your local pengu score? This clears your browser storage.')){
      localStorage.removeItem(balanceKey);
      localStorage.removeItem(clicksKey);
      balance = 0; clicks = 0;
      updateUI();
      addLog('Score reset');
    }
  });
})();
