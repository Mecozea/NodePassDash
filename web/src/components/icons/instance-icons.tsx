import React from "react";
import { Icon } from '@iconify/react';

// 通用图标属性
type IconProps = React.SVGAttributes<SVGElement> & {
  size?: number | string;
  color?: string;
};

/*
// 注释掉原本的手写SVG图标
// 保留以备后续对比或回滚使用

const defaultProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// 实例ID图标 - 使用ID卡片图标 (基于Lucide风格)
export const InstanceIdIcon: React.FC<IconProps> = ({ size, color, ...props }) => (
  <svg
    {...defaultProps}
    width={size || defaultProps.width}
    height={size || defaultProps.height}
    stroke={color || defaultProps.stroke}
    {...props}
  >
    <rect x="3" y="4" width="18" height="14" rx="3" />
    <path d="M8 10h8" />
    <path d="M8 14h6" />
    <circle cx="6" cy="6" r="1" fill="currentColor" />
  </svg>
);
*/

// 使用Iconify图标替换 - Lucide风格统一

// 实例ID图标 - 使用hash标识
export const InstanceIdIcon: React.FC<IconProps> = ({ size, color, ...props }) => (
  <Icon
    icon="lucide:hash"
    width={size || 20}
    height={size || 20}
    color={color}
    {...props}
  />
);

// 主控图标 - 使用服务器图标
export const EndpointIcon: React.FC<IconProps> = ({ size, color, ...props }) => (
  <Icon
    icon="lucide:server"
    width={size || 20}
    height={size || 20}
    color={color}
    {...props}
  />
);

// 隧道地址图标 - 使用链接图标
export const TunnelAddressIcon: React.FC<IconProps> = ({ size, color, ...props }) => (
  <Icon
    icon="lucide:link"
    width={size || 20}
    height={size || 20}
    color={color}
    {...props}
  />
);

// 目标地址图标 - 使用目标图标
export const TargetAddressIcon: React.FC<IconProps> = ({ size, color, ...props }) => (
  <Icon
    icon="lucide:target"
    width={size || 20}
    height={size || 20}
    color={color}
    {...props}
  />
);

// 日志级别图标 - 使用文本文件图标
export const LogLevelIcon: React.FC<IconProps> = ({ size, color, ...props }) => (
  <Icon
    icon="lucide:file-text"
    width={size || 20}
    height={size || 20}
    color={color}
    {...props}
  />
);

// 池设置图标 - 使用层级图标
export const PoolSettingsIcon: React.FC<IconProps> = ({ size, color, ...props }) => (
  <Icon
    icon="lucide:layers"
    width={size || 20}
    height={size || 20}
    color={color}
    {...props}
  />
);

// 连接限制图标 - 使用连接链路图标
export const ConnectionLimitIcon: React.FC<IconProps> = ({ size, color, ...props }) => (
  <Icon
    icon="lucide:link-2"
    width={size || 20}
    height={size || 20}
    color={color}
    {...props}
  />
);

// TLS设置图标 - 使用盾牌图标
export const TLSIcon: React.FC<IconProps> = ({ size, color, ...props }) => (
  <Icon
    icon="lucide:shield"
    width={size || 20}
    height={size || 20}
    color={color}
    {...props}
  />
);

// 证书路径图标 - 使用认证奖章图标
export const CertificateIcon: React.FC<IconProps> = ({ size, color, ...props }) => (
  <Icon
    icon="lucide:award"
    width={size || 20}
    height={size || 20}
    color={color}
    {...props}
  />
);

// 密钥路径图标 - 使用钥匙图标
export const KeyIcon: React.FC<IconProps> = ({ size, color, ...props }) => (
  <Icon
    icon="lucide:key"
    width={size || 20}
    height={size || 20}
    color={color}
    {...props}
  />
);

// 隧道密码图标 - 使用锁图标
export const PasswordIcon: React.FC<IconProps> = ({ size, color, ...props }) => (
  <Icon
    icon="lucide:lock"
    width={size || 20}
    height={size || 20}
    color={color}
    {...props}
  />
);

// 读取超时图标 - 使用时钟图标
export const TimeoutIcon: React.FC<IconProps> = ({ size, color, ...props }) => (
  <Icon
    icon="lucide:clock"
    width={size || 20}
    height={size || 20}
    color={color}
    {...props}
  />
);

// 速率限制图标 - 使用仪表盘图标
export const RateLimitIcon: React.FC<IconProps> = ({ size, color, ...props }) => (
  <Icon
    icon="lucide:gauge"
    width={size || 20}
    height={size || 20}
    color={color}
    {...props}
  />
);

// 版本图标 - 使用Git分支图标
export const VersionIcon: React.FC<IconProps> = ({ size, color, ...props }) => (
  <Icon
    icon="lucide:git-branch"
    width={size || 20}
    height={size || 20}
    color={color}
    {...props}
  />
);

// 模式图标 - 使用设置图标
export const ModeIcon: React.FC<IconProps> = ({ size, color, ...props }) => (
  <Icon
    icon="tabler:adjustments"
    width={size || 20}
    height={size || 20}
    color={color}
    {...props}
  />
);
// ProxyProtocol图标 - 使用设置图标
export const ProxyProtocolIcon: React.FC<IconProps> = ({ size, color, ...props }) => (
  <Icon
    icon="lucide:shuffle"
    width={size || 20}
    height={size || 20}
    color={color}
    {...props}
  />
);
// Tags图标 - 使用设置图标
export const TagsIcon: React.FC<IconProps> = ({ size, color, ...props }) => (
  <Icon
    icon="lucide:tag"
    width={size || 20}
    height={size || 20}
    color={color}
    {...props}
  />
);