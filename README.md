# 🐶 泡泡狗 Bubble Puppy MVP

一个基于 Phaser 3 + Socket.io 的泡泡龙克隆游戏，支持单人模式和联网双人合作。

## ✨ 特性

- **单人模式**：控制 Cici，熊熊自动跟随并协助战斗
- **本地双人**：同一键盘，Cici（方向键+空格）+ 熊熊（WASD+Shift）
- **联网双人**：创建/加入房间，实时同步
- **GOLDEN 字母系统**：收集 G-O-L-D-E-N 六个字母触发黄金奖励
- **120秒限时**：30秒警告，0秒出现骷髅猫
- **程序化图形**：所有图片资源由 `tools/generate_assets.py` 生成，无需外部素材
- **100 关**：关卡数据外置为 JSON，可用生成器批量创建
- **高清可爱风**：128×128 程序化生成角色/敌人/道具/砖块
- **移动端支持**：触屏设备自动显示虚拟方向键 + 跳跃 + 吹泡泡按钮
- **更多角色**：新增布丁、mocha 等小狗，以及刺猬、青蛙等敌人

## 🎮 操作

| 玩家 | 移动 | 跳跃 | 吹泡泡 |
|------|------|------|--------|
| Cici (P1) | 方向键 ←→ / 触屏 ←→ | 方向键 ↑ / 触屏 ↑ | 空格 / 触屏“泡泡” |
| 熊熊 (P2) | A D | W | 左 Shift |

## 🚀 本地运行

```bash
# 1. 安装依赖
cd server && npm install

# 2. 启动服务器
npm start

# 3. 浏览器打开
# http://localhost:3000
```

## 🛠️ 开发者工具

### 生成/修改 100 关
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install pillow
python tools/generate_levels.py
```
生成后会覆盖 `client/assets/data/levels.json`，可手动编辑微调。

### 重新生成高清可爱风资源
```bash
python tools/generate_assets.py
```
会覆盖 `client/assets/` 下的所有图片。在 `tools/generate_assets.py` 中修改配色、新增敌人或小狗后重新运行即可。

## 🌐 部署上线

### 前端（Vercel）
1. 将 `client/` 文件夹部署到 Vercel
2. 或使用 `npx vercel --prod` 一键部署

### 后端（Render - 免费）
1. 将 `server/` 文件夹推送到 GitHub
2. 在 [Render](https://render.com) 创建 Web Service
3. 选择 Node 环境，Build Command: `npm install`，Start Command: `node server.js`
4. 选择 **Free** 计划（无需信用卡）
5. 复制后端 URL，修改 `client/js/network.js` 中的 `serverUrl`

### 保活（避免 Render 休眠）
- 注册 [UptimeRobot](https://uptimerobot.com)
- 添加 HTTP 监控，每 5 分钟 ping 你的 Render 地址

## 📁 项目结构

```
bubble-puppy-mvp/
├── client/              # 前端（部署到 Vercel）
│   ├── assets/          # 图片、音效、关卡 JSON
│   │   ├── data/levels.json   # 100 关数据
│   │   ├── sprites/     # 小狗/敌人精灵图
│   │   ├── tiles/       # 砖块
│   │   ├── effects/     # 泡泡、字母、粒子
│   │   ├── items/       # 道具
│   │   ├── ui/          # UI 按钮、心形
│   │   └── background/  # 背景
│   ├── index.html       # 入口页面 + UI菜单
│   └── js/
│       ├── game.js      # Phaser 游戏逻辑
│       └── network.js   # Socket.io 网络管理
├── server/              # 后端（部署到 Render）
│   ├── server.js        # Express + Socket.io
│   └── package.json
├── tools/               # 开发者工具
│   ├── generate_assets.py   # 生成高清可爱风资源
│   └── generate_levels.py   # 生成/重排 100 关 JSON
├── package.json         # 根项目配置
└── README.md
```

## 🎯 游戏机制

1. **吹泡泡**：空格发射泡泡，击中敌人将其困住
2. **击破泡泡**：触碰困敌泡泡消灭敌人，掉落肉骨头
3. **收集字母**：触碰 G-O-L-D-E-N 字母泡泡
4. **黄金奖励**：集齐 6 个字母 → 额外生命 + 1000分 + 全屏敌人变肉骨头
5. **限时挑战**：120秒内清版，否则骷髅猫出现（无敌追踪）
6. **底部循环**：从底部掉下会从顶部出现（经典泡泡龙机制）

## 📝 技术栈

- **Phaser 3.60** - HTML5 游戏引擎（CDN引入）
- **Socket.io 4.7** - 实时联网（CDN引入）
- **Node.js + Express** - 后端服务器
- **程序化图形** - 全部用代码绘制，零外部资源

## 🐕 角色设定

- **Cici**：白色小狗，粉色项圈，左耳下垂，活泼好动
- **熊熊 (Xiongxiong)**：白色小狗，蓝色蝴蝶结，双耳竖起，憨厚可爱

## ⚠️ 已知限制

- 联网同步为 20Hz 输入 + 500ms 状态校验，可能有轻微延迟感
- 特殊泡泡（水/火/闪电）已有美术资源， gameplay 效果尚未实装
- 排行榜和存档系统尚未加入

## 🔮 后续扩展方向

- 实装水/火/闪电特殊泡泡的 gameplay 效果
- 增加排行榜和存档系统
- 更多关卡主题和 Boss 战

---

Made with ❤️ for dog lovers 🐾
