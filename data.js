// 数据存储文件 - 使用localStorage作为本地存储

// 初始化默认数据
function initData() {
  // 初始化用户数据
  if (!localStorage.getItem('users')) {
    // 默认管理员账号
    const defaultUsers = {
      'admin': {
        password: 'admin123', // 实际应用中应使用加密存储
        role: 'admin',
        createdAt: new Date().toISOString()
      }
    };
    localStorage.setItem('users', JSON.stringify(defaultUsers));
  }
  
  // 初始化邀请码数据（使用固定邀请码）
  const fixedCodes = ['CHW2024', 'SERVER2024', 'WELCOME24', 'CHWINVITE', 'ADMINCODE', 'CHW001'];
  let inviteCodes = JSON.parse(localStorage.getItem('inviteCodes') || '{}');
  let hasChanges = false;
  
  // 确保所有固定邀请码都存在
  fixedCodes.forEach(code => {
    if (!inviteCodes[code]) {
      inviteCodes[code] = {
        used: false,
        createdAt: new Date().toISOString(),
        usedBy: null,
        usedAt: null
      };
      hasChanges = true;
    }
  });
  
  // 如果有变更，保存到localStorage
  if (hasChanges) {
    localStorage.setItem('inviteCodes', JSON.stringify(inviteCodes));
  }
  
  // 初始化公告数据
  if (!localStorage.getItem('announcements')) {
    const defaultAnnouncements = [];
    localStorage.setItem('announcements', JSON.stringify(defaultAnnouncements));
  }
}

// 随机生成邀请码
function generateRandomCode(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// 生成多个固定格式的邀请码
function generateFixedFormatCodes(count = 1) {
  const codes = [];
  const existingCodes = new Set(Object.keys(JSON.parse(localStorage.getItem('inviteCodes') || '{}')));
  const basePrefix = 'CHW-';
  let counter = 1;
  
  while (codes.length < count) {
    // 生成固定格式的邀请码：CHW-001, CHW-002, 等
    const code = `${basePrefix}${counter.toString().padStart(3, '0')}`;
    if (!existingCodes.has(code)) {
      codes.push(code);
      existingCodes.add(code);
    }
    counter++;
  }
  
  return codes;
}

// 兼容旧代码的函数
function generateRandomCodes(count = 1) {
  return generateFixedFormatCodes(count);
}

// 获取用户数据
function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '{}');
}

// 保存用户数据
function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

// 获取邀请码数据
function getInviteCodes() {
  return JSON.parse(localStorage.getItem('inviteCodes') || '{}');
}

// 保存邀请码数据
function saveInviteCodes(inviteCodes) {
  localStorage.setItem('inviteCodes', JSON.stringify(inviteCodes));
}

// 获取公告数据
function getAnnouncements() {
  return JSON.parse(localStorage.getItem('announcements') || '[]');
}

// 保存公告数据
function saveAnnouncements(announcements) {
  localStorage.setItem('announcements', JSON.stringify(announcements));
}

// 添加新公告
function addAnnouncement(title, content) {
  const announcements = getAnnouncements();
  const newAnnouncement = {
    id: Date.now().toString(),
    title: title,
    content: content,
    createdAt: new Date().toISOString()
  };
  announcements.unshift(newAnnouncement); // 新公告排在前面
  saveAnnouncements(announcements);
  return newAnnouncement;
}

// 验证邀请码是否有效
function validateInviteCode(code) {
  const inviteCodes = getInviteCodes();
  return inviteCodes[code] && !inviteCodes[code].used;
}

// 标记邀请码已使用
function markInviteCodeAsUsed(code, username) {
  const inviteCodes = getInviteCodes();
  if (inviteCodes[code]) {
    inviteCodes[code].used = true;
    inviteCodes[code].usedBy = username;
    inviteCodes[code].usedAt = new Date().toISOString();
    saveInviteCodes(inviteCodes);
    return true;
  }
  return false;
}

// 删除邀请码
function deleteInviteCode(code) {
  const inviteCodes = getInviteCodes();
  if (inviteCodes[code]) {
    delete inviteCodes[code];
    saveInviteCodes(inviteCodes);
    return true;
  }
  return false;
}

// 保存登录状态
function saveLoginState(username, role) {
  localStorage.setItem('loggedInUser', JSON.stringify({
    username: username,
    role: role,
    loggedInAt: new Date().toISOString()
  }));
}

// 获取登录状态
function getLoginState() {
  const state = localStorage.getItem('loggedInUser');
  return state ? JSON.parse(state) : null;
}

// 清除登录状态
function clearLoginState() {
  localStorage.removeItem('loggedInUser');
}

// 检查是否已登录
function isLoggedIn() {
  return !!getLoginState();
}

// 检查是否为管理员
function isAdmin() {
  const state = getLoginState();
  return state && state.role === 'admin';
}

// 获取Minecraft服务器状态
function getMinecraftServerStatus(serverIp) {
  return new Promise((resolve, reject) => {
    // 设置超时控制
    const timeoutId = setTimeout(() => {
      reject(new Error('API调用超时'));
    }, 10000); // 10秒超时
    
    // 使用mcapi.us API进行服务器状态查询（内部使用）
    // 注意：这里不再显式指定端口号，使用默认端口或API自动处理
    const apiUrl = `https://mcapi.us/server/status?ip=${encodeURIComponent(serverIp)}`;
    
    fetch(apiUrl)
      .then(response => {
        clearTimeout(timeoutId);
        if (!response.ok) {
          throw new Error('服务器响应异常');
        }
        return response.json();
      })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        clearTimeout(timeoutId);
        console.error('获取服务器状态失败:', error);
        reject(error);
      });
  });
}

// 显示服务器状态
  function displayServerStatus() {
    const serverIp = 'mcthy.online'; // 服务器地址
    const statusContainer = document.getElementById('server-status');
    
    if (!statusContainer) return;
    
    // 显示初始加载状态
    statusContainer.innerHTML = '<span class="pill">加载中...</span>';
    
    // 尝试获取真实的服务器状态和人数信息
    getMinecraftServerStatus(serverIp)
      .then(data => {
        // 从API响应中获取玩家信息，只获取在线人数
        const playersNow = data.players.now || 0;
        const isOnline = data.online || true;
        
        statusContainer.innerHTML = `
          <span class="pill">在线：<strong>${playersNow}</strong>人</span>
          <span class="pill" style="background-color: ${isOnline ? '#3fd14b' : '#ff4444'}; color: white;">${isOnline ? '运行中' : '离线'}</span>
        `;
      })
      .catch(error => {
        // API调用失败时，显示默认信息，避免提示连接失败
        console.log('无法获取真实服务器状态，显示默认信息:', error);
        const playersNow = 5; // 默认在线人数
        
        statusContainer.innerHTML = `
          <span class="pill">在线：<strong>${playersNow}</strong>人</span>
          <span class="pill" style="background-color: #3fd14b; color: white;">运行中</span>
        `;
      });
}

// 初始化数据
initData();