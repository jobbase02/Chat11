(function() {
  const scriptTag = document.currentScript || document.querySelector('script[src*="widget.js"]');
  const botId = scriptTag ? scriptTag.getAttribute('data-bot-id') : null;
  
  if (!botId) {
    console.error('Chat11 Widget: data-bot-id is missing.');
    return;
  }

  const API_BASE = 'https://chat11.cdn.elevenxsolutions.com/api'; 
  let chatConfig = null;
  let isChatOpen = false;
  let chatHistory = [];
  let root = null; // Global root variable taki undefined error na aaye

  // Icon Library mapped to DB values
  const ICON_LIB = {
    MessageSquare: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    MessageCircle: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z"/></svg>`,
    Bot: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>`,
    Sparkles: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
    User: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    Smile: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
    Headphones: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>`
  };

  const closeIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
  const sendIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;

  fetch(`${API_BASE}/widget/config?apiKey=${botId}`)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        chatConfig = data.config;
        injectStyles();
        initWidget();
      }
    });

  function injectStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

      #c11-widget-root {
        position: fixed; bottom: 20px; right: 20px; z-index: 2147483647;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        -webkit-font-smoothing: antialiased;
      }

      /* Launcher Button */
      #c11-launcher {
        width: 64px; height: 64px; border-radius: 50%;
        cursor: pointer; display: flex; align-items: center; justify-content: center;
        box-shadow: 0 8px 32px rgba(0,0,0,0.25); transition: all 0.3s ease;
        border: none; outline: none;
        background-color: ${chatConfig.widgetBgColor};
        color: ${chatConfig.widgetIconColor};
      }
      /* Hover pe ab rotate nahi hoga, sirf thoda bada hoga */
      #c11-launcher:hover { transform: scale(1.05); } 
      #c11-launcher svg { width: 32px; height: 32px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1)); }

      /* Main Window */
      #c11-chat-window {
        display: none; width: 400px; height: 650px; max-height: calc(100vh - 100px);
        background: #ffffff; border-radius: 24px; box-shadow: 0 16px 48px rgba(0,0,0,0.18);
        flex-direction: column; overflow: hidden; margin-bottom: 15px;
        border: 1px solid rgba(0,0,0,0.06); animation: c11-slideUp 0.5s cubic-bezier(0.19, 1, 0.22, 1);
      }

      @keyframes c11-slideUp {
        from { opacity: 0; transform: translateY(30px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }

      /* Header */
      #c11-header {
        padding: 20px; display: flex; justify-content: space-between; align-items: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05); z-index: 10;
        background-color: ${chatConfig.botHeaderColor};
        color: ${chatConfig.botHeaderTextColor}; /* 🔥 Applied Header Text Color */
      }
      #c11-header-info { display: flex; align-items: center; gap: 12px; }
      #c11-header-info span { font-weight: 700; font-size: 17px; letter-spacing: -0.3px; }
      #c11-close { 
        background: rgba(255,255,255,0.15); border: none; cursor: pointer; 
        color: ${chatConfig.botHeaderTextColor}; /* 🔥 Applied Header Text Color to Icon */
        width: 36px; height: 36px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
        transition: background 0.2s;
      }
      #c11-close:hover { background: rgba(255,255,255,0.25); }

      /* Messages Area */
      #c11-messages {
        flex: 1; padding: 20px; overflow-y: auto; background: #F8FAFC; 
        display: flex; flex-direction: column; gap: 16px; scroll-behavior: smooth;
      }
      .c11-msg-row { display: flex; gap: 10px; width: 100%; animation: fadeIn 0.3s ease; }
      .c11-msg-row.user-row { flex-direction: row-reverse; }

      .c11-avatar { 
        width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
        flex-shrink: 0; margin-top: auto; box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        background-color: ${chatConfig.botHeaderColor};
        color: ${chatConfig.botHeaderTextColor}; /* Avatar icon inside chat matches header color */
      }
      
      .c11-msg { 
        max-width: 80%; padding: 14px 18px; font-size: 14.5px; line-height: 1.5; 
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      }
      .c11-msg.user { 
        border-radius: 20px 20px 4px 20px; color: white; font-weight: 500; 
        background-color: ${chatConfig.botBubbleColor};
      }
      .c11-msg.bot { background: white; color: #1E293B; border-radius: 20px 20px 20px 4px; border: 1px solid #F1F5F9; }

      /* 🔥 Suggested Questions Styles */
      #c11-suggested-chips {
        display: flex; flex-wrap: wrap; gap: 8px; margin-top: -4px; padding-left: 42px; /* aligned with bot text */
      }
      .c11-chip {
        background: white; border: 1px solid ${chatConfig.botHeaderColor}40; color: ${chatConfig.botHeaderColor};
        padding: 8px 12px; border-radius: 16px; font-size: 13px; font-weight: 500; cursor: pointer;
        transition: all 0.2s ease;
      }
      .c11-chip:hover {
        background: ${chatConfig.botHeaderColor}; color: white; border-color: ${chatConfig.botHeaderColor};
      }

      /* Input Area */
      #c11-input-area {
        padding: 16px; background: #ffffff; border-top: 1px solid #F1F5F9; 
        display: flex; gap: 12px; align-items: center;
      }
      #c11-input {
        flex: 1; padding: 14px 20px; border: 1.5px solid #E2E8F0; border-radius: 16px; 
        font-size: 15px; outline: none; transition: all 0.2s; background: #F8FAFC;
      }
      #c11-input:focus { background: #fff; box-shadow: 0 0 0 4px rgba(0,0,0,0.02); }
      
      #c11-send {
        width: 48px; height: 48px; border-radius: 16px; border: none; cursor: pointer;
        display: flex; align-items: center; justify-content: center; transition: all 0.2s;
        background-color: ${chatConfig.botHeaderColor}; 
        color: ${chatConfig.botHeaderTextColor};
      }
      #c11-send:active { transform: scale(0.9); }

      #c11-typing { 
        display: none; padding: 0 24px 12px; font-size: 12px; color: #94A3B8; 
        font-weight: 500; align-items: center; gap: 4px;
      }

      /* 📱 MOBILE FIRST OVERRIDES */
      @media (max-width: 480px) {
        #c11-widget-root { bottom: 0; right: 0; }
        #c11-launcher { bottom: 20px; right: 20px; position: fixed; }
        #c11-chat-window {
          width: 100vw; height: 100vh; max-height: 100vh;
          bottom: 0; right: 0; margin-bottom: 0; border-radius: 0;
          border: none;
        }
        #c11-header { padding: 24px 20px; border-radius: 0; }
        #c11-messages { padding: 24px 16px; }
        #c11-input-area { padding: 20px 16px 34px; }
      }

      @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    `;
    document.head.appendChild(style);
  }

  function initWidget() {
    root = document.createElement('div');
    root.id = 'c11-widget-root';
    document.body.appendChild(root);

    // Get dynamic icons
    const botAvatarIcon = ICON_LIB[chatConfig.botAvatarName] || ICON_LIB.Bot;
    const launcherIcon = ICON_LIB[chatConfig.widgetIconName] || ICON_LIB.MessageSquare;

    // 🔥 Build Suggested Questions HTML
    let chipsHtml = '';
    if (chatConfig.suggestedQuestions && chatConfig.suggestedQuestions.length > 0) {
      chipsHtml = `<div id="c11-suggested-chips">` + 
        chatConfig.suggestedQuestions.map(q => `<button class="c11-chip">${q}</button>`).join('') +
      `</div>`;
    }

    root.innerHTML = `
      <div id="c11-chat-window">
        <div id="c11-header">
          <div id="c11-header-info">
            <div style="background: rgba(255,255,255,0.2); padding: 6px; border-radius: 10px; display: flex; align-items: center; justify-content: center;">${botAvatarIcon}</div>
            <span>${chatConfig.botName}</span>
          </div>
          <button id="c11-close">${closeIcon}</button>
        </div>
        <div id="c11-messages">
          <div class="c11-msg-row">
            <div class="c11-avatar">${botAvatarIcon}</div>
            <div class="c11-msg bot">Hi! I am ${chatConfig.botName}. How can I help you today?</div>
          </div>
          ${chipsHtml} </div>
        <div id="c11-typing">
           <span style="display:inline-block; width:4px; height:4px; background:#94A3B8; border-radius:50%; animation: blink 1s infinite"></span>
           ${chatConfig.botName} is thinking...
        </div>
        <form id="c11-input-area">
          <input type="text" id="c11-input" placeholder="Ask anything..." autocomplete="off">
          <button type="submit" id="c11-send">${sendIcon}</button>
        </form>
      </div>
      <button id="c11-launcher">
         ${launcherIcon}
      </button>
    `;

    document.getElementById('c11-launcher').addEventListener('click', toggleChat);
    document.getElementById('c11-close').addEventListener('click', toggleChat);
    document.getElementById('c11-input-area').addEventListener('submit', sendMessage);
    
    // 🔥 Setup Click Listeners for Chips
    const chips = document.querySelectorAll('.c11-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', function() {
        const text = this.innerText;
        sendDirectMessage(text);
        document.getElementById('c11-suggested-chips').style.display = 'none'; // Hide chips after first click
      });
    });

    // Dynamic Border Color Focus
    const inputField = document.getElementById('c11-input');
    inputField.addEventListener('focus', () => {
      inputField.style.borderColor = chatConfig.botHeaderColor;
    });
    inputField.addEventListener('blur', () => {
      inputField.style.borderColor = '#E2E8F0';
    });
  }

  function toggleChat() {
    isChatOpen = !isChatOpen;
    document.getElementById('c11-chat-window').style.display = isChatOpen ? 'flex' : 'none';
    document.getElementById('c11-launcher').style.display = isChatOpen ? 'none' : 'flex';
    if(isChatOpen) document.getElementById('c11-input').focus();
  }

  // Wrapper for manual submit
  function sendMessage(e) {
    e.preventDefault();
    const input = document.getElementById('c11-input');
    const msg = input.value.trim();
    if (!msg) return;
    input.value = '';
    
    // Hide chips if user types a message instead of clicking
    const chipsDiv = document.getElementById('c11-suggested-chips');
    if(chipsDiv) chipsDiv.style.display = 'none';

    sendDirectMessage(msg);
  }

  // Actual API Call logic (Extracted so chips can use it too)
  function sendDirectMessage(msg) {
    appendMessage('user', msg);
    chatHistory.push({ role: 'user', content: msg });

    document.getElementById('c11-typing').style.display = 'flex';

    fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: botId, messages: chatHistory })
    })
    .then(res => res.json())
    .then(data => {
      document.getElementById('c11-typing').style.display = 'none';
      if (data.success) {
        appendMessage('bot', data.reply);
        chatHistory.push({ role: 'assistant', content: data.reply });
      }
    })
    .catch(() => {
      document.getElementById('c11-typing').style.display = 'none';
    });
  }

  function appendMessage(role, text) {
    const msgContainer = document.getElementById('c11-messages');
    const row = document.createElement('div');
    row.className = `c11-msg-row ${role === 'user' ? 'user-row' : ''}`;
    
    const botAvatarIcon = ICON_LIB[chatConfig.botAvatarName] || ICON_LIB.Bot;
    const avatar = role === 'bot' ? `<div class="c11-avatar">${botAvatarIcon}</div>` : '';
    
    row.innerHTML = `
      ${avatar}
      <div class="c11-msg ${role}">
        ${text}
      </div>
    `;
    
    msgContainer.appendChild(row);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }
})();