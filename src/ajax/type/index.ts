import { RelationPkgInfo } from "./relation";

export * from "./pkg";
export * from "./env";
export * from "./relation";

export interface ResParams<T> {
  success: boolean;
  msg: string;
  data: T;
}

// 工厂函数定义对象默认值
export const createRelationPkgInfo = (): RelationPkgInfo => ({
  name: "",
  // 依赖版本号
  version: "",
  // 依赖解析目标地址
  resolved: "",
  peerDependencies: {},
  dependencies: {},
  is_peer: false,
  // 是否相互依赖
  is_loop: false,
  // 依赖关系
  relations: [],
  // 依赖路径
  path: "",
});
