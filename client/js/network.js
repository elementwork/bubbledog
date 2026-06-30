class NetworkManager {
    constructor() {
        // 自动检测服务器地址
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        this.serverUrl = isLocal ? 'http://localhost:3000' : window.location.origin;
        this.socket = null;
        this.roomId = null;
        this.isHost = false;
        this.remoteInputs = {};
        this.connected = false;
        this.onGameStart = null;
        this.onPlayerDisconnected = null;
        this.playerId = null;
    }

    connect() {
        if (this.socket) return;
        this.socket = io(this.serverUrl, { transports: ['websocket', 'polling'] });

        this.socket.on('connect', () => {
            this.connected = true;
            this.playerId = this.socket.id;
            console.log('Connected:', this.playerId);
        });

        this.socket.on('disconnect', () => {
            this.connected = false;
            console.log('Disconnected');
        });

        this.socket.on('roomCreated', (roomId) => {
            this.roomId = roomId;
            this.isHost = true;
            console.log('Room created:', roomId);
        });

        this.socket.on('joinedRoom', (roomId) => {
            this.roomId = roomId;
            this.isHost = false;
            console.log('Joined room:', roomId);
        });

        this.socket.on('guestJoined', (guestId) => {
            console.log('Guest joined:', guestId);
            // 房主自动准备，等待客人准备
            this.socket.emit('playerReady');
        });

        this.socket.on('gameStart', (data) => {
            console.log('Game start:', data);
            if (this.onGameStart) this.onGameStart(data);
        });

        this.socket.on('remoteInput', (data) => {
            this.remoteInputs = data.keys;
        });

        this.socket.on('gameEvent', (data) => {
            // 由GameScene处理
            if (window.gameScene) window.gameScene.handleRemoteEvent(data);
        });

        this.socket.on('stateSync', (state) => {
            if (window.gameScene && !this.isHost) {
                window.gameScene.syncRemoteState(state);
            }
        });

        this.socket.on('playerDisconnected', (id) => {
            if (this.onPlayerDisconnected) this.onPlayerDisconnected(id);
        });

        this.socket.on('error', (msg) => {
            alert(msg);
        });
    }

    createRoom(callback) {
        if (!this.connected) this.connect();
        this.socket.emit('createRoom');
        this.socket.once('roomCreated', (roomId) => {
            if (callback) callback(roomId);
        });
    }

    joinRoom(roomId, callback) {
        if (!this.connected) this.connect();
        this.socket.emit('joinRoom', roomId);
        this.socket.once('joinedRoom', () => {
            this.socket.emit('playerReady');
            if (callback) callback(true);
        });
        this.socket.once('error', () => {
            if (callback) callback(false);
        });
    }

    sendInput(keys) {
        if (!this.connected || !this.roomId) return;
        this.socket.emit('input', { keys });
    }

    sendEvent(event, payload) {
        if (!this.connected || !this.roomId) return;
        this.socket.emit('gameEvent', { event, payload });
    }

    sendState(state) {
        if (!this.connected || !this.roomId || !this.isHost) return;
        this.socket.emit('stateSync', { state });
    }
}

const networkManager = new NetworkManager();
