export * from "./pkg";
export * from "./env";

export interface ResParams<T> {
  success: boolean;
  msg: string;
  data: T;
}
