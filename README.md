# CHw服务器网站

这是一个简单的服务器网站，包含登录系统、注册功能（需要邀请码）、管理员权限管理和公告发布功能。

## 功能介绍

1. **用户系统**
   - 登录功能
   - 注册功能
   - 权限管理（普通用户和管理员）

2. **邀请码系统**
   - 邀请码为**可选**：留空将注册为普通用户
   - 固定预设邀请码：CHW2024, SERVER2024, WELCOME24, CHWINVITE, ADMINCODE, CHW001
   - CHW001：普通用户专属邀请码
   - 管理员可生成新的固定格式邀请码（CHW-001, CHW-002等）

3. **公告系统**
   - 管理员可发布公告
   - 首页显示最新公告

4. **管理员功能**
   - 邀请码管理（生成、删除）
   - 公告发布

## 默认账号

- **管理员账号**
  - 用户名：admin
  - 密码：admin123

## 如何将项目托管到GitHub

### 步骤1：创建GitHub账户

如果你还没有GitHub账户，请先在[GitHub官网](https://github.com)注册一个免费账户。

### 步骤2：在GitHub上创建新仓库

1. 登录GitHub
2. 点击右上角的"+"图标，选择"New repository"
3. 填写仓库名称（例如：chw-server-website）
4. 选择"Public"（因为免费账户只能创建公开仓库）
5. 勾选"Add a README file"（可选）
6. 点击"Create repository"

### 步骤3：将本地项目上传到GitHub

使用以下方法之一将你的项目上传到GitHub：

#### 方法A：使用GitHub Desktop（推荐新手）

1. 下载并安装[GitHub Desktop](https://desktop.github.com/)
2. 打开GitHub Desktop，登录你的GitHub账户
3. 点击"Clone a Repository from the Internet..."
4. 选择"URL"选项卡，输入你刚创建的仓库URL
5. 设置本地路径为你的项目文件夹
6. 点击"Clone"
7. 将你的项目文件复制到克隆的文件夹中
8. 在GitHub Desktop中，你会看到已更改的文件
9. 填写"Summary"（例如："Initial commit"）
10. 点击"Commit to main"
11. 点击"Push origin"将更改推送到GitHub

#### 方法B：使用命令行（需要Git）

1. 下载并安装[Git](https://git-scm.com/)
2. 打开命令提示符（Windows）或终端（Mac/Linux）
3. 导航到你的项目文件夹：
   ```
   cd c:\Users\ZhuanZ\Desktop\CHw服务器网站
   ```
4. 初始化Git仓库：
   ```
   git init
   ```
5. 添加所有文件：
   ```
   git add .
   ```
6. 提交更改：
   ```
   git commit -m "Initial commit"
   ```
7. 连接到GitHub仓库：
   ```
   git remote add origin https://github.com/你的用户名/chw-server-website.git
   ```
8. 推送到GitHub：
   ```
   git push -u origin master
   ```

### 步骤4：启用GitHub Pages（使网站可访问）

1. 在你的GitHub仓库页面，点击"Settings"
2. 滚动到"Pages"部分
3. 在"Source"下拉菜单中，选择"main"分支
4. 点击"Save"
5. 等待几分钟，GitHub会生成一个可访问的URL

## 注意事项

1. 这个项目使用localStorage存储数据，所有数据都存储在用户浏览器中
2. 不需要后端服务器，可以直接通过浏览器访问HTML文件运行
3. 邀请码系统使用预设的固定邀请码，确保用户需要邀请才能注册

## 本地运行

直接在浏览器中打开index.html文件即可运行项目，无需额外配置。