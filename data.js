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
  
  // 初始调用一次公告显示
  setTimeout(displayAnnouncements, 1000); // 延迟1秒执行，让页面先加载完成
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

// 显示公告
function displayAnnouncements() {
  const container = document.getElementById('announcements-container');
  if (!container) {
    console.error('未找到公告容器元素');
    return;
  }
  
  const announcements = getAnnouncements();
  
  if (announcements.length === 0) {
    container.innerHTML = '<p class="no-announcements">暂无公告</p>';
    return;
  }
  
  // 限制显示最近的几条公告
  const displayLimit = 3;
  const announcementsToDisplay = announcements.slice(0, displayLimit);
  
  let html = '';
  announcementsToDisplay.forEach(announcement => {
    // 格式化日期
    const date = new Date(announcement.createdAt);
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    html += `
      <div class="announcement-item">
        <h3 class="announcement-title">${announcement.title}</h3>
        <div class="announcement-content">${announcement.content}</div>
        <div class="announcement-date">${formattedDate}</div>
      </div>
    `;
  });
  
  container.innerHTML = html;
  
  // 添加CSS样式
  const style = document.createElement('style');
  style.textContent = `
    .announcements-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .announcement-item {
      padding: 1rem;
      background: rgba(0, 0, 0, 0.04);
      border-radius: 8px;
      text-align: left;
    }
    @media (prefers-color-scheme: dark) {
      .announcement-item {
        background: rgba(255, 255, 255, 0.04);
      }
    }
    .announcement-title {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
      color: var(--accent);
    }
    .announcement-content {
      margin-bottom: 0.5rem;
      line-height: 1.5;
    }
    .announcement-date {
      font-size: 0.9rem;
      opacity: 0.7;
      text-align: right;
    }
    .no-announcements {
      text-align: center;
      opacity: 0.7;
      padding: 2rem;
    }
  `;
  document.head.appendChild(style);
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
  const user = getLoginState();
  return user && user.role === 'admin';
}

// 初始化数据
initData();
