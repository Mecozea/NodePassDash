# Iconify图标推荐方案

## 基础配置字段

### 1. 实例ID - InstanceIdIcon
- `mdi:identifier` - 标识符图标
- `lucide:hash` - 井号标识
- `tabler:id` - ID标识图标
- `heroicons:identification` - 身份识别图标
- `carbon:ibm-cloud-identity-access-management` - 实例管理

### 2. 主控 - EndpointIcon
- `mdi:server-network` - 服务器网络
- `lucide:server` - 服务器图标
- `tabler:server` - 服务器
- `heroicons:server-stack` - 服务器堆栈
- `carbon:cloud-service-management` - 云服务管理

### 3. 版本号 - VersionIcon
- `mdi:source-branch` - 版本分支
- `lucide:git-branch` - Git分支
- `tabler:versions` - 版本图标
- `heroicons:code-bracket` - 代码版本
- `carbon:version` - 版本标识

### 4. 模式 - ModeIcon
- `mdi:tune` - 调节/模式
- `lucide:settings` - 设置模式
- `tabler:adjustments` - 调整配置
- `heroicons:cog-6-tooth` - 配置齿轮
- `carbon:settings-adjust` - 设置调整

### 5. 隧道地址 - TunnelAddressIcon
- `mdi:tunnel` - 隧道图标
- `lucide:link` - 链接地址
- `tabler:route` - 路由地址
- `heroicons:globe-alt` - 网络地址
- `carbon:network-3` - 网络连接

### 6. 目标地址 - TargetAddressIcon
- `mdi:target` - 目标图标
- `lucide:target` - 目标标识
- `tabler:target-arrow` - 目标箭头
- `heroicons:arrow-top-right-on-square` - 目标跳转
- `carbon:location` - 位置目标

### 7. 日志级别 - LogLevelIcon
- `mdi:file-document-outline` - 文档日志
- `lucide:file-text` - 文本文件
- `tabler:report` - 报告日志
- `heroicons:document-text` - 文档
- `carbon:debug` - 调试日志

## 池配置字段

### 8. 池最小值 - PoolSettingsIcon (客户端模式)
- `mdi:pool` - 池图标
- `lucide:layers` - 层级池
- `tabler:stack-2` - 堆栈池
- `heroicons:queue-list` - 队列列表
- `carbon:network-interface` - 网络接口

### 9. 池最大值 - PoolSettingsIcon (服务端模式)
- `mdi:pool` - 池图标
- `lucide:layers` - 层级池
- `tabler:stack-3` - 堆栈池
- `heroicons:bars-3-bottom-right` - 池配置
- `carbon:ibm-cloud-pak-manta-automated-data-lineage` - 数据池

### 10. 最大连接数限制 - ConnectionLimitIcon
- `mdi:connection` - 连接图标
- `lucide:link-2` - 连接链路
- `tabler:plug-connected` - 插头连接
- `heroicons:signal` - 信号连接
- `carbon:network-4` - 网络连接限制

## 安全配置字段

### 11. TLS 设置 - TLSIcon (服务端模式)
- `mdi:security` - 安全图标
- `lucide:shield` - 盾牌保护
- `tabler:shield-lock` - 安全锁
- `heroicons:lock-closed` - 安全锁定
- `carbon:security` - 安全设置

### 12. 证书路径 - CertificateIcon (TLS模式为2时)
- `mdi:certificate` - 证书图标
- `lucide:award` - 认证奖章
- `tabler:certificate` - 证书文档
- `heroicons:academic-cap` - 学术认证
- `carbon:certificate` - 证书标识

### 13. 密钥路径 - KeyIcon (TLS模式为2时)
- `mdi:key` - 密钥图标
- `lucide:key` - 钥匙
- `tabler:key` - 密钥
- `heroicons:key` - 安全密钥
- `carbon:password` - 密码密钥

### 14. 隧道密码 - PasswordIcon (有密码时)
- `mdi:lock` - 锁定图标
- `lucide:lock` - 锁
- `tabler:password` - 密码
- `heroicons:lock-closed` - 密码锁
- `carbon:password` - 密码设置

## 性能配置字段

### 15. 读取超时 - TimeoutIcon
- `mdi:timer` - 计时器
- `lucide:clock` - 时钟
- `tabler:hourglass` - 沙漏
- `heroicons:clock` - 时间
- `carbon:timer` - 计时器

### 16. 速率限制 - RateLimitIcon
- `mdi:speedometer` - 速度计
- `lucide:gauge` - 仪表盘
- `tabler:dashboard` - 仪表板
- `heroicons:chart-bar` - 图表限制
- `carbon:meter` - 计量器

## 使用建议

1. **统一风格**: 建议选择同一个图标库（如都选择 `mdi` 或 `lucide`）来保持界面风格统一
2. **语义匹配**: 优先选择语义最匹配的图标
3. **视觉识别**: 考虑图标的辨识度和用户理解度
4. **尺寸适配**: 确保图标在不同尺寸下都清晰可见

### 17. 自动重启 - AutoRestartIcon
- `mdi:restart` - 重启图标
- `lucide:rotate-ccw` - 逆时针重启
- `tabler:refresh` - 刷新重启
- `heroicons:arrow-path` - 循环箭头
- `carbon:restart` - 重启标识

### 18. Proxy Protocol - ProxyProtocolIcon
- `mdi:protocol` - 协议图标
- `lucide:shuffle` - 代理转发
- `tabler:route-2` - 路由协议
- `heroicons:arrows-right-left` - 双向代理
- `carbon:network-overlay` - 网络覆盖

## 推荐组合方案

**方案一 (Material Design Icons - mdi)**
- 风格现代，图标丰富，适合现代Web应用

**方案二 (Lucide)**
- 简洁清晰，线条优美，适合简约设计风格

**方案三 (Tabler Icons)**
- 专为界面设计，一致性好，适合管理后台

**方案四 (Heroicons)**
- Tailwind CSS官方推荐，适合现代响应式设计

**方案五 (Carbon Design System)**
- IBM设计系统，适合企业级应用