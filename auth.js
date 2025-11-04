// 认证功能实现

// 页面加载时执行
window.addEventListener('DOMContentLoaded', function() {
  // 检查登录状态并根据需要重定向
  const currentPath = window.location.pathname;
  
  // 如果用户正在访问管理员页面但未登录或不是管理员，重定向到登录页
  if (currentPath.includes('admin.html')) {
    if (!isLoggedIn()) {
      window.location.href = 'login.html';
    } else if (!isAdmin()) {
      showError('adminErrorMessage', '您没有管理员权限！');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
    } else {
      // 已登录管理员，显示登录信息
      displayAdminInfo();
    }
  } else if (currentPath.includes('login.html') || currentPath.includes('register.html')) {
    // 如果用户已登录，重定向到首页或管理员页
    if (isLoggedIn()) {
      window.location.href = isAdmin() ? 'admin.html' : 'index.html';
    }
  }
  
  // 添加退出登录事件监听器
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
});

// 显示错误消息
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    // 5秒后隐藏错误消息
    setTimeout(() => {
      errorElement.style.display = 'none';
    }, 5000);
  }
}

// 显示成功消息
function showSuccess(elementId, message) {
  const successElement = document.getElementById(elementId);
  if (successElement) {
    successElement.textContent = message;
    successElement.style.display = 'block';
    // 5秒后隐藏成功消息
    setTimeout(() => {
      successElement.style.display = 'none';
    }, 5000);
  }
}

// 处理登录
function handleLogin(event) {
  event.preventDefault();
  
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  
  // 简单的客户端验证
  if (!username || !password) {
    showError('errorMessage', '请输入用户名和密码！');
    return;
  }
  
  // 获取用户数据并验证
  const users = getUsers();
  const user = users[username];
  
  if (!user || user.password !== password) {
    showError('errorMessage', '用户名或密码错误！');
    return;
  }
  
  // 登录成功，保存登录状态
  saveLoginState(username, user.role);
  
  // 根据用户角色重定向
  if (user.role === 'admin') {
    window.location.href = 'admin.html';
  } else {
    window.location.href = 'index.html';
  }
}

// 处理注册
function handleRegister(event) {
  event.preventDefault();
  
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const inviteCode = document.getElementById('inviteCode').value.trim();
  
  // 简单的客户端验证
  if (!username || !password) {
    showError('errorMessage', '请输入用户名和密码！');
    return;
  }
  
  if (username.length < 3 || username.length > 20) {
    showError('errorMessage', '用户名长度应在3-20个字符之间！');
    return;
  }
  
  if (password.length < 6) {
    showError('errorMessage', '密码长度至少为6个字符！');
    return;
  }
  
  // 获取用户数据并检查用户名是否已存在
  const users = getUsers();
  if (users[username]) {
    showError('errorMessage', '用户名已存在！');
    return;
  }
  
  // 如果提供了邀请码，验证邀请码
  if (inviteCode && !validateInviteCode(inviteCode)) {
    showError('errorMessage', '无效或已使用的邀请码！');
    return;
  }
  
  // 注册成功，添加用户
  // 无论是否提供邀请码，都注册为普通用户
  users[username] = {
    password: password, // 实际应用中应使用加密存储
    role: 'user',
    createdAt: new Date().toISOString()
  };
  saveUsers(users);
  
  // 如果提供了邀请码，标记邀请码已使用
  if (inviteCode) {
    markInviteCodeAsUsed(inviteCode, username);
  }
  
  // 显示成功消息并跳转到登录页
  showSuccess('successMessage', '注册成功！即将跳转到登录页...');
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 2000);
}

// 处理退出登录
function handleLogout() {
  clearLoginState();
  window.location.href = 'login.html';
}

// 显示管理员信息
function displayAdminInfo() {
  const loginState = getLoginState();
  if (loginState && loginState.username) {
    const welcomeMessage = document.createElement('p');
    welcomeMessage.textContent = `欢迎回来，管理员 ${loginState.username}！`;
    welcomeMessage.style.textAlign = 'center';
    welcomeMessage.style.color = 'var(--accent)';
    welcomeMessage.style.marginBottom = '1rem';
    
    const adminCard = document.querySelector('.admin-container .card:first-child');
    if (adminCard) {
      const h1 = adminCard.querySelector('h1');
      adminCard.insertBefore(welcomeMessage, h1.nextSibling);
    }
  }
}

// 在页面中显示公告（可以在首页或其他页面调用）
function displayAnnouncements() {
  const announcements = getAnnouncements();
  const container = document.getElementById('announcements-container');
  
  if (!container || announcements.length === 0) {
    return;
  }
  
  container.innerHTML = '';
  
  announcements.forEach(announcement => {
    const item = document.createElement('div');
    item.className = 'announcement-item';
    
    const header = document.createElement('div');
    header.className = 'announcement-header';
    
    const title = document.createElement('div');
    title.className = 'announcement-title';
    title.textContent = announcement.title;
    
    const date = document.createElement('div');
    date.className = 'announcement-date';
    date.textContent = new Date(announcement.createdAt).toLocaleString();
    
    const content = document.createElement('div');
    content.className = 'announcement-content';
    content.textContent = announcement.content;
    
    header.appendChild(title);
    header.appendChild(date);
    item.appendChild(header);
    item.appendChild(content);
    container.appendChild(item);
  });
}

// 为首页添加任务栏中的登录按钮
function addLoginButtonToTaskbar() {
  const taskbarNav = document.querySelector('.taskbar-nav');
  if (!taskbarNav) return;
  
  // 检查是否已存在登录按钮
  if (document.querySelector('.login-btn')) return;
  
  // 根据登录状态添加不同的按钮
  const loginState = getLoginState();
  let loginButton;
  
  if (loginState) {
    // 已登录状态
    loginButton = document.createElement('a');
    loginButton.href = loginState.role === 'admin' ? 'admin.html' : '#';
    loginButton.className = 'taskbar-link login-btn';
    loginButton.textContent = loginState.username;
    
    if (loginState.role === 'admin') {
      loginButton.textContent += ' (管理员)';
    }
    
    // 普通用户显示账号但不跳转
    if (loginState.role !== 'admin') {
      loginButton.addEventListener('click', function(e) {
        e.preventDefault();
        alert(`你好，${loginState.username}！你当前没有管理员权限。`);
      });
    }
  } else {
    // 未登录状态
    loginButton = document.createElement('a');
    loginButton.href = 'login.html';
    loginButton.className = 'taskbar-link login-btn';
    loginButton.textContent = '登录';
  }
  
  taskbarNav.appendChild(loginButton);
}

// 页面加载时为首页添加登录按钮
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
  window.addEventListener('DOMContentLoaded', addLoginButtonToTaskbar);
}