export interface RelationPkgInfo {
  // 依赖名称
  name: string;
  // 依赖版本号
  version: string;
  // 依赖解析目标地址
  resolved: string;
  // 依赖完整性校验码
  integrity?: string;
  // 是否为开发依赖
  dev?: boolean;
  // 是否有安装脚本
  hasInstallScript?: boolean;
  hasShrinkwrap?: boolean;
  peerDependencies: Record<string, string>;
  dependencies: Record<string, string>;
  is_peer: boolean;
  // 是否相互依赖
  is_loop: boolean;
  // 依赖关系
  relations: RelationPkgInfo[];
  // 依赖路径
  path: string;
}

export interface LockPkg {
  name: string;
  version: number;
  packages: Record<string, RelationPkgInfo>;
}
