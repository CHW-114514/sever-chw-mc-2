// 数据管理功能 - 仅保留服务器状态相关功能

// 服务器状态数据
let serverStatus = {
  isOnline: true,
  playerCount: Math.floor(Math.random() * 100),
  maxPlayers: 200,
  uptime: '12天8小时30分钟'
};

// 获取服务器状态
export function getServerStatus() {
  return serverStatus;
}

// 显示服务器状态
export function displayServerStatus() {
  const statusElement = document.getElementById('server-status');
  const playerCountElement = document.getElementById('player-count');
  const uptimeElement = document.getElementById('server-uptime');
  
  if (statusElement) {
    statusElement.textContent = serverStatus.isOnline ? '在线' : '离线';
    statusElement.style.color = serverStatus.isOnline ? '#4CAF50' : '#F44336';
  }
  
  if (playerCountElement) {
    playerCountElement.textContent = `${serverStatus.playerCount}/${serverStatus.maxPlayers}`;
  }
  
  if (uptimeElement) {
    uptimeElement.textContent = serverStatus.uptime;
  }
}