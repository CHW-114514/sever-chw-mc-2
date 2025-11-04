// 管理员功能实现

// 页面加载时执行
window.addEventListener('DOMContentLoaded', function() {
  // 检查是否为管理员
  if (!isAdmin()) {
    window.location.href = 'login.html';
    return;
  }
  
  // 加载现有的邀请码
  loadInviteCodes();
  
  // 加载现有的公告
  loadAnnouncements();
});

// 生成邀请码
function generateInviteCodes() {
  const countInput = document.getElementById('codeCount');
  const count = parseInt(countInput.value) || 1;
  
  if (count < 1 || count > 10) {
    showError('adminErrorMessage', '请输入1-10之间的数字！');
    return;
  }
  
  // 生成随机邀请码
  const newCodes = generateRandomCodes(count);
  const inviteCodes = getInviteCodes();
  
  // 添加新生成的邀请码
  newCodes.forEach(code => {
    inviteCodes[code] = {
      used: false,
      createdAt: new Date().toISOString(),
      usedBy: null,
      usedAt: null
    };
  });
  
  // 保存到本地存储
  saveInviteCodes(inviteCodes);
  
  // 更新显示
  loadInviteCodes();
  
  // 显示成功消息
  showSuccess('adminSuccessMessage', `成功生成 ${count} 个邀请码！`);
}

// 加载并显示邀请码
function loadInviteCodes() {
  const inviteCodesList = document.getElementById('inviteCodesList');
  if (!inviteCodesList) return;
  
  const inviteCodes = getInviteCodes();
  
  // 清空列表
  inviteCodesList.innerHTML = '';
  
  // 如果没有邀请码，显示提示消息
  if (Object.keys(inviteCodes).length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'empty-message';
    emptyMessage.textContent = '暂无邀请码，请生成新的邀请码。';
    emptyMessage.style.textAlign = 'center';
    emptyMessage.style.padding = '1rem';
    emptyMessage.style.color = 'var(--fg)';
    emptyMessage.style.opacity = '0.7';
    inviteCodesList.appendChild(emptyMessage);
    return;
  }
  
  // 按创建时间排序（最新的在前）
  const sortedCodes = Object.entries(inviteCodes).sort((a, b) => {
    return new Date(b[1].createdAt) - new Date(a[1].createdAt);
  });
  
  // 创建邀请码列表项
  sortedCodes.forEach(([code, data]) => {
    const item = document.createElement('div');
    item.className = 'invite-code-item';
    
    const codeContainer = document.createElement('div');
    codeContainer.className = 'invite-code-info';
    
    const codeText = document.createElement('div');
    codeText.className = 'invite-code-text';
    codeText.textContent = code;
    
    const codeStatus = document.createElement('div');
    codeStatus.className = 'invite-code-status';
    codeStatus.textContent = data.used ? '已使用' : '未使用';
    codeStatus.style.fontSize = '0.9rem';
    codeStatus.style.marginTop = '0.25rem';
    codeStatus.style.color = data.used ? 'var(--accent-2)' : 'var(--accent)';
    
    codeContainer.appendChild(codeText);
    codeContainer.appendChild(codeStatus);
    
    // 添加删除按钮（只有未使用的邀请码可以删除）
    if (!data.used) {
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = '删除';
      deleteBtn.addEventListener('click', function() {
        if (confirm(`确定要删除邀请码 ${code} 吗？`)) {
          deleteInviteCode(code);
          loadInviteCodes();
          showSuccess('adminSuccessMessage', '邀请码已删除！');
        }
      });
      item.appendChild(codeContainer);
      item.appendChild(deleteBtn);
    } else {
      // 已使用的邀请码显示使用信息
      const usedInfo = document.createElement('div');
      usedInfo.className = 'invite-code-used-info';
      usedInfo.style.fontSize = '0.85rem';
      usedInfo.style.marginTop = '0.25rem';
      usedInfo.style.opacity = '0.7';
      
      if (data.usedBy && data.usedAt) {
        usedInfo.textContent = `使用者: ${data.usedBy} (${new Date(data.usedAt).toLocaleString()})`;
      }
      
      codeContainer.appendChild(usedInfo);
      item.appendChild(codeContainer);
    }
    
    inviteCodesList.appendChild(item);
  });
}

// 处理公告提交
function handleAnnouncementSubmit(event) {
  event.preventDefault();
  
  const title = document.getElementById('announcementTitle').value.trim();
  const content = document.getElementById('announcementContent').value.trim();
  
  if (!title || !content) {
    showError('adminErrorMessage', '请填写公告标题和内容！');
    return;
  }
  
  // 添加公告
  addAnnouncement(title, content);
  
  // 清空表单
  document.getElementById('announcementTitle').value = '';
  document.getElementById('announcementContent').value = '';
  
  // 显示成功消息
  showSuccess('adminSuccessMessage', '公告发布成功！');
  
  // 重新加载公告列表
  loadAnnouncements();
}

// 加载并显示公告
function loadAnnouncements() {
  const announcements = getAnnouncements();
  
  // 创建公告列表区域（如果不存在）
  let announcementsSection = document.querySelector('.announcements-section');
  if (!announcementsSection) {
    announcementsSection = document.createElement('div');
    announcementsSection.className = 'card announcements-section';
    
    const title = document.createElement('h2');
    title.textContent = '已发布公告';
    announcementsSection.appendChild(title);
    
    const adminContainer = document.querySelector('.admin-container');
    if (adminContainer) {
      adminContainer.appendChild(announcementsSection);
    }
  }
  
  // 清空现有公告
  const existingList = announcementsSection.querySelector('.announcements-list');
  if (existingList) {
    announcementsSection.removeChild(existingList);
  }
  
  // 创建公告列表容器
  const listContainer = document.createElement('div');
  listContainer.className = 'announcements-list';
  
  // 如果没有公告，显示提示消息
  if (announcements.length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.textContent = '暂无公告。';
    emptyMessage.style.textAlign = 'center';
    emptyMessage.style.padding = '1rem';
    emptyMessage.style.color = 'var(--fg)';
    emptyMessage.style.opacity = '0.7';
    listContainer.appendChild(emptyMessage);
  } else {
    // 显示最近5条公告
    const recentAnnouncements = announcements.slice(0, 5);
    
    recentAnnouncements.forEach(announcement => {
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
      listContainer.appendChild(item);
    });
  }
  
  announcementsSection.appendChild(listContainer);
}

// 为管理员页面添加快捷键
function addAdminShortcuts() {
  document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + G 生成邀请码
    if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
      e.preventDefault();
      generateInviteCodes();
    }
    
    // Ctrl/Cmd + S 保存公告
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      const announcementForm = document.getElementById('announcementForm');
      if (announcementForm) {
        announcementForm.dispatchEvent(new Event('submit'));
      }
    }
  });
}

// 初始化管理员快捷键
addAdminShortcuts();