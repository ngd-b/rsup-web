export interface Env {
  /// 命令名称
  name: string;
  /// 命令版本
  version: string;
  /// 命令路径
  path: string;
  /// 命令是否是批处理操作
  is_cmd: boolean;
}

export enum EnvType {
  Node = "node",
  Npm = "npm",
  Yarn = "yarn",
  Pnpm = "pnpm",
}
export type EnvConfig = Partial<Record<EnvType, Env>>;
