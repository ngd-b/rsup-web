export interface Pkg {
  path: string;
  // 绝对路径
  absolute_path: string;
  name: string;
  version: string;
  description: string;
  scripts: Record<string, string>;
  // 当前项目的管理工具
  manager_name: string;
  dependencies: Record<string, PkgInfo>;
  dev_dependencies: Record<string, PkgInfo>;
}

export interface PkgInfo {
  name: string;
  readme: string;
  version: string;
  description: string;
  homepage: string;
  keywords: string[];
  license: string;
  "dist-tags": DistTags;
  versions: Record<string, VersionInfo>;
  is_dev: boolean;
  is_finish: boolean;
  is_del: boolean;
}

export interface DistTags {
  latest: string;
}

export interface VersionInfo {
  name: string;
  version: string;
  homepage: string;
  description: string;
  keywords: string[];
  author: Author;
  maintainers: Memeber[];
  dependencies: Record<string, string>;
  dev_dependencies: Record<string, string>;
  peer_dependencies: Record<string, string>;
  dist: Dist;
}

export interface Memeber {
  name: string;
  email: string;
}

export enum Author {
  Memeber,
  string,
}

export interface Dist {
  shasum: string;
  size: number;
  tarball: string;
  integrity: string;
}

export interface UpdatePkg {
  name: string;
  version: string;
  is_dev: boolean;
  // 是否是切换依赖类型
  // 开发依赖包、运行时依赖包
  is_change?: boolean;
}

export interface RemovePkg {
  name: string;
  is_dev: boolean;
}

export interface BatchUpdate {
  data: UpdatePkg[];
  reinstall: boolean;
  manager_name: string;
}