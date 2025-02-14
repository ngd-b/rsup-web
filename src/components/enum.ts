export interface SelectItem {
  label: string;
  value: string;
}
/**
 * 依赖源地址
 */
export const RegistryType: SelectItem[] = [
  {
    label: "npm(https://registry.npmjs.org)",
    value: "https://registry.npmjs.org",
  },
  {
    label: "taobao(https://registry.npmmirror.com)",
    value: "https://registry.npmmirror.com",
  },
];

const DicMap: Record<string, SelectItem[]> = {
  RegistryType,
};

export default DicMap;
