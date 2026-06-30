const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" },
    transports: ['websocket', 'polling']
});

// 静态文件服务（开发时前端可直接访问）
app.use(express.static(path.join(__dirname, '../client')));

// 内存房间管理
const rooms = new Map();

function generateRoomId() {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
}

io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);
    let currentRoom = null;

    // 创建房间
    socket.on('createRoom', () => {
        const roomId = generateRoomId();
        rooms.set(roomId, {
            id: roomId,
            host: socket.id,
            guest: null,
            gameStarted: false,
            hostReady: false,
            guestReady: false
        });
        socket.join(roomId);
        currentRoom = roomId;
        socket.emit('roomCreated', roomId);
        console.log('Room created:', roomId);
    });

    // 加入房间
    socket.on('joinRoom', (roomId) => {
        const room = rooms.get(roomId);
        if (!room) {
            socket.emit('error', '房间不存在');
            return;
        }
        if (room.guest) {
            socket.emit('error', '房间已满');
            return;
        }
        room.guest = socket.id;
        socket.join(roomId);
        currentRoom = roomId;
        socket.emit('joinedRoom', roomId);
        io.to(room.host).emit('guestJoined', socket.id);
        console.log('Guest joined room:', roomId);
    });

    // 玩家准备
    socket.on('playerReady', () => {
        const room = rooms.get(currentRoom);
        if (!room) return;
        if (socket.id === room.host) room.hostReady = true;
        if (socket.id === room.guest) room.guestReady = true;

        if (room.hostReady && room.guestReady) {
            room.gameStarted = true;
            io.to(currentRoom).emit('gameStart', {
                host: room.host,
                guest: room.guest,
                level: 1
            });
        }
    });

    // 输入同步（20Hz）
    socket.on('input', (data) => {
        if (!currentRoom) return;
        socket.to(currentRoom).emit('remoteInput', {
            playerId: socket.id,
            keys: data.keys,
            timestamp: Date.now()
        });
    });

    // 关键事件同步（主机权威）
    socket.on('gameEvent', (data) => {
        if (!currentRoom) return;
        socket.to(currentRoom).emit('gameEvent', {
            event: data.event,
            payload: data.payload,
            from: socket.id
        });
    });

    // 状态同步（主机每500ms广播）
    socket.on('stateSync', (data) => {
        if (!currentRoom) return;
        socket.to(currentRoom).emit('stateSync', data.state);
    });

    // 断开清理
    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
        if (currentRoom) {
            const room = rooms.get(currentRoom);
            if (room) {
                io.to(currentRoom).emit('playerDisconnected', socket.id);
                rooms.delete(currentRoom);
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🐶 Bubble Puppy Server running on port ${PORT}`);
    console.log(`Local: http://localhost:${PORT}`);
});
