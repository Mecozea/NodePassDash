import React from "react";

// 通用图标属性
type IconProps = React.SVGAttributes<SVGElement> & {
  size?: number | string;
  color?: string;
};

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

// 主控图标 - 使用服务器图标 (参考DMIT CPU图标风格)
export const EndpointIcon: React.FC<IconProps> = ({ size, color, ...props }) => (
  <svg
    {...defaultProps}
    width={size || defaultProps.width}
    height={size || defaultProps.height}
    stroke={color || defaultProps.stroke}
    {...props}
  >
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" rx="1" />
    <path d="M15 2v2M15 20v2M2 15h2M2 9h2M22 15h2M22 9h2M9 2v2M9 20v2" />
  </svg>
);

// 隧道地址图标 - 使用网络连接图标 (基于Lucide风格)
export const TunnelAddressIcon: React.FC<IconProps> = ({ size, color, ...props }) => (
  <svg
    {...defaultProps}
    width={size || defaultProps.width}
    height={size || defaultProps.height}
    stroke={color || defaultProps.stroke}
    {...props}
  >
    <circle cx="5" cy="6" r="3" />
    <path d="M12 6h5a2 2 0 0 1 2 2v7" />
    <path d="m15 9-3-3 3-3" />
    <circle cx="19" cy="18" r="3" />
    <path d="M12 18H7a2 2 0 0 1-2-2V9" />
    <path d="m9 15 3 3-3 3" />
  </svg>
);

// 目标地址图标 - 使用靶心图标 (基于Lucide风格)
export const TargetAddressIcon: React.FC<IconProps> = ({ size, color, ...props }) => (
  <svg
    {...defaultProps}
    width={size || defaultProps.width}
    height={size || defaultProps.height}
    stroke={color || defaultProps.stroke}
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
    <path d="M12 6v-2M12 20v-2M6 12H4M20 12h-2" />
  </svg>
);

// 日志级别图标 - 使用文档列表图标 (基于Lucide风格)
export const LogLevelIcon: React.FC<IconProps> = ({ size, color, ...props }) => (
  <svg
    {...defaultProps}
    width={size || defaultProps.width}
    height={size || defaultProps.height}
    stroke={color || defaultProps.stroke}
    {...props}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
    <path d="M10 9H8" />
  </svg>
);

// 池设置图标 - 使用数据库图标 (基于Lucide风格)
export const PoolSettingsIcon: React.FC<IconProps> = ({ size, color, ...props }) => (
  <svg
    {...defaultProps}
    width={size || defaultProps.width}
    height={size || defaultProps.height}
    stroke={color || defaultProps.stroke}
    {...props}
  >
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
  </svg>
);

// 连接限制图标 - 使用限流图标 (基于Lucide风格)
export const ConnectionLimitIcon: React.FC<IconProps> = ({ size, color, ...props }) => (
  <svg
    {...defaultProps}
    width={size || defaultProps.width}
    height={size || defaultProps.height}
    stroke={color || defaultProps.stroke}
    {...props}
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6M12 17v6" />
    <path d="M1 12h6M17 12h6" />
    <path d="M8 8L4 4M20 20l-4-4" />
    <path d="M16 8l4-4M4 20l4-4" />
  </svg>
);

// TLS设置图标 - 使用盾牌锁图标 (参考DMIT DDoS Protection图标)
export const TLSIcon: React.FC<IconProps> = ({ size, color, ...props }) => (
  <svg
    {...defaultProps}
    width={size || defaultProps.width}
    height={size || defaultProps.height}
    stroke={color || defaultProps.stroke}
    {...props}
  >
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

// 证书路径图标 - 使用证书文档图标 (基于Lucide风格)
export const CertificateIcon: React.FC<IconProps> = ({ size, color, ...props }) => (
  <svg
    {...defaultProps}
    width={size || defaultProps.width}
    height={size || defaultProps.height}
    stroke={color || defaultProps.stroke}
    {...props}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M10 12l2 2 4-4" />
  </svg>
);

// 密钥路径图标 - 使用密钥图标 (基于Lucide风格)
export const KeyIcon: React.FC<IconProps> = ({ size, color, ...props }) => (
  <svg
    {...defaultProps}
    width={size || defaultProps.width}
    height={size || defaultProps.height}
    stroke={color || defaultProps.stroke}
    {...props}
  >
    <circle cx="8" cy="8" r="6" />
    <path d="m15 13 6 6" />
    <path d="m21 19-2-2" />
    <path d="m21 19-2 2" />
  </svg>
);

// 隧道密码图标 - 使用锁图标 (基于Lucide风格)
export const PasswordIcon: React.FC<IconProps> = ({ size, color, ...props }) => (
  <svg
    {...defaultProps}
    width={size || defaultProps.width}
    height={size || defaultProps.height}
    stroke={color || defaultProps.stroke}
    {...props}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <circle cx="12" cy="16" r="1" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

// 读取超时图标 - 使用时钟图标 (基于Lucide风格)
export const TimeoutIcon: React.FC<IconProps> = ({ size, color, ...props }) => (
  <svg
    {...defaultProps}
    width={size || defaultProps.width}
    height={size || defaultProps.height}
    stroke={color || defaultProps.stroke}
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
);

// 速率限制图标 - 使用速度计图标 (基于Lucide风格)
export const RateLimitIcon: React.FC<IconProps> = ({ size, color, ...props }) => (
  <svg
    {...defaultProps}
    width={size || defaultProps.width}
    height={size || defaultProps.height}
    stroke={color || defaultProps.stroke}
    {...props}
  >
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
    <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    <path d="m9 9 3 3 3-3" />
  </svg>
);

// 版本图标 - 使用标签图标 (基于Lucide风格)
export const VersionIcon: React.FC<IconProps> = ({ size, color, ...props }) => (
  <svg
    {...defaultProps}
    width={size || defaultProps.width}
    height={size || defaultProps.height}
    stroke={color || defaultProps.stroke}
    {...props}
  >
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <path d="M7 7h.01" />
  </svg>
);

// 模式图标 - 使用设置图标 (基于Lucide风格)
export const ModeIcon: React.FC<IconProps> = ({ size, color, ...props }) => (
  <svg
    {...defaultProps}
    width={size || defaultProps.width}
    height={size || defaultProps.height}
    stroke={color || defaultProps.stroke}
    {...props}
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6M12 17v6" />
    <path d="m4.22 4.22 4.24 4.24M15.54 15.54l4.24 4.24" />
    <path d="M1 12h6M17 12h6" />
    <path d="m4.22 19.78 4.24-4.24M15.54 8.46l4.24-4.24" />
  </svg>
);