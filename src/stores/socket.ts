/**
 * websocket 通信
 * 接收、发送数据
 */
import { Pkg } from "@/ajax/type/pkg";
interface Config {
  name?: string;
}

type SocketData = string | ArrayBuffer | Blob | ArrayBufferView;
type ReceiveData = Pkg;

class Socket {
  socket: WebSocket | null;
  options: Config;
  constructor(config: Partial<Config>) {
    this.socket = null;
    this.options = {
      ...config,
    };
  }
  connect(url: string | URL) {
    if (!url) {
      throw new Error("url is required");
    }
    if (!window.WebSocket) {
      throw new Error("WebSocket is not supported");
    }
    this.socket = new WebSocket(url);
  }
  send(data: SocketData) {
    if (!this.socket) {
      throw new Error("WebSocket is not connected");
    }
    this.socket.send(data);
  }
  close() {
    if (!this.socket) {
      throw new Error("WebSocket is not connected");
    }
    this.socket.close();
  }
  on<T extends keyof WebSocketEventMap>(
    type: T,
    callback: (event: WebSocketEventMap[T]) => void
  ) {
    if (!this.socket) {
      throw new Error("WebSocket is not connected");
    }
    this.socket.addEventListener(type, callback);
  }
  off(type: string) {
    if (!this.socket) {
      throw new Error("WebSocket is not connected");
    }
    this.socket.removeEventListener(type, () => {});
  }
}

export default Socket;
export type { Config, SocketData, Socket, ReceiveData };
