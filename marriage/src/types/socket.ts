export interface ServerToClientEvents {
  mensaje: (msg: string) => void;
}

export interface ClientToServerEvents {
  mensaje: (msg: string) => void;
}
