/**
 * websocket 通信
 * 接收、发送数据
 */

function Socket(config) {
  this.socket = null;
  this.options = {
    ...config,
  };
}

Socket.prototype.connect = function (url) {
  if (!url) {
    throw new Error("url is required");
  }
  if (!window.WebSocket) {
    throw new Error("WebSocket is not supported");
  }
  this.socket = new WebSocket(url);
};
Socket.prototype.send = function (data) {
  if (!this.socket) {
    throw new Error("WebSocket is not connected");
  }
  this.socket.send(data);
};
Socket.prototype.close = function () {
  if (!this.socket) {
    throw new Error("WebSocket is not connected");
  }
  this.socket.close();
};
Socket.prototype.on = function (type, callback) {
  if (!this.socket) {
    throw new Error("WebSocket is not connected");
  }
  this.socket[type] = callback;
};
Socket.prototype.off = function (type) {
  if (!this.socket) {
    throw new Error("WebSocket is not connected");
  }
  this.socket[type] = null;
};

export default Socket;
