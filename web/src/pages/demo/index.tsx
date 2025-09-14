"use client";

import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  cn
} from "@heroui/react";
import React, { useState, useEffect, useCallback, useRef } from "react";

import { Icon } from "@iconify/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRocket,
  faPlay,
  faStop,
  faExclamationTriangle,
  faUnlink
} from "@fortawesome/free-solid-svg-icons";
import {
  faTrash,
  faRotateRight
} from "@fortawesome/free-solid-svg-icons";
import { fontSans } from "@/config/fonts";
import { buildApiUrl } from '@/lib/utils';
import { TrafficOverviewChart } from "@/components/ui/traffic-overview-chart";
import { DemoQuickEntryCard } from "@/components/ui/demo-quick-entry-card";
import { ServerIcon } from "@/components/ui/server-icon";
import { ServerIconRed } from "@/components/ui/server-red-icon";
import { useSettings } from '@/components/providers/settings-provider';
import { WeeklyStatsChart } from "@/components/ui/weekly-stats-chart";
import { DailyStatsChart } from "@/components/ui/daily-stats-chart";

// 统计数据类型
interface TunnelStats {
  total: number;
  running: number;
  stopped: number;
  error: number;
  offline: number;
  total_endpoints: number;
}

// 操作日志类型
interface OperationLog {
  id: string;
  time: string;
  action: string;
  instance: string;
  status: {
    type: "success" | "danger" | "warning";
    text: string;
    icon: string;
  };
  message?: string;
}

// 流量趋势数据类型
interface TrafficTrendData {
  hourTime: number; // Unix时间戳（秒）
  hourDisplay: string;
  tcpRx: number;
  tcpTx: number;
  udpRx: number;
  udpTx: number;
  recordCount: number;
}

// 主控状态类型
type EndpointStatus = 'ONLINE' | 'OFFLINE' | 'FAIL';

// 主控类型
interface Endpoint {
  id: number;
  name: string;
  url: string;
  status: EndpointStatus;
  tunnelCount: number;
}

export default function DemoPage() {
  const { settings } = useSettings();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tunnelStats, setTunnelStats] = useState<TunnelStats>({
    total: 0,
    running: 0,
    stopped: 0,
    error: 0,
    offline: 0,
    total_endpoints: 0
  });
  const [operationLogs, setOperationLogs] = useState<OperationLog[]>([]);
  const [trafficTrend, setTrafficTrend] = useState<TrafficTrendData[]>([]);
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [trafficLoading, setTrafficLoading] = useState(true);

  // 清空日志确认模态框控制
  const { isOpen: isClearOpen, onOpen: onClearOpen, onClose: onClearClose } = useDisclosure();
  const [clearingLogs, setClearingLogs] = useState(false);

  // 添加组件挂载状态检查
  const isMountedRef = useRef(true);

  // 组件挂载/卸载管理
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      // 清理状态数据
      setTunnelStats({ total: 0, running: 0, stopped: 0, error: 0, offline: 0, total_endpoints: 0 });
      setOperationLogs([]);
      setTrafficTrend([]);
      setEndpoints([]);
    };
  }, []);

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 获取tunnel统计数据
  const fetchTunnelStats = useCallback(async () => {
    try {
      const response = await fetch(buildApiUrl('/api/dashboard/tunnel-stats'));

      if (!response.ok) throw new Error('获取tunnel统计数据失败');
      const result = await response.json();

      if (result.success && result.data && isMountedRef.current) {
        setTunnelStats(result.data);
      }
    } catch (error) {
      if (isMountedRef.current) {
        console.error('获取tunnel统计数据失败:', error);
      }
    }
  }, []);

  // 获取操作日志数据
  const fetchOperationLogs = useCallback(async () => {
    try {
      const response = await fetch(buildApiUrl('/api/dashboard/operate_logs?limit=1000'));

      if (!response.ok) throw new Error('获取操作日志失败');
      const data: OperationLog[] = await response.json();

      if (isMountedRef.current) {
        setOperationLogs(data);
      }
    } catch (error) {
      if (isMountedRef.current) {
        console.error('获取操作日志失败:', error);
      }
    }
  }, []);

  // 处理IP地址隐藏的函数
  const maskIpAddress = useCallback((url: string): string => {
    // 如果隐私模式关闭，直接返回原始URL
    if (!settings.isPrivacyMode) {
      return url;
    }

    try {
      // IPv4 正则表达式：匹配 x.x.x.x 格式
      const ipv4Regex = /(\d{1,3}\.\d{1,3}\.)(\d{1,3}\.\d{1,3})/g;

      // IPv6 正则表达式：匹配方括号内的IPv6地址
      const ipv6Regex = /(\[)([0-9a-fA-F:]+)(\])/g;

      let maskedUrl = url;

      // 处理IPv4地址 - 隐藏后两段
      maskedUrl = maskedUrl.replace(ipv4Regex, '$1***.***');

      // 处理IPv6地址 - 隐藏最后几段
      maskedUrl = maskedUrl.replace(ipv6Regex, (match, start, ipv6, end) => {
        const segments = ipv6.split(':');
        if (segments.length >= 4) {
          // 保留前面几段，隐藏后面的段
          const visibleSegments = segments.slice(0, Math.max(2, segments.length - 2));
          const hiddenCount = segments.length - visibleSegments.length;
          return `${start}${visibleSegments.join(':')}${hiddenCount > 0 ? ':***' : ''}${end}`;
        }
        return match;
      });

      return maskedUrl;
    } catch (error) {
      // 如果处理失败，返回原始URL
      return url;
    }
  }, [settings.isPrivacyMode]);

  // 获取主控数据
  const fetchEndpoints = useCallback(async () => {
    try {
      const response = await fetch(buildApiUrl('/api/endpoints/simple'));

      if (!response.ok) throw new Error('获取主控数据失败');
      const data: Endpoint[] = await response.json();

      if (isMountedRef.current) {
        setEndpoints(data);
      }
    } catch (error) {
      if (isMountedRef.current) {
        console.error('获取主控数据失败:', error);
      }
    }
  }, []);

  // 获取流量趋势数据
  const fetchTrafficTrend = useCallback(async () => {
    try {
      const response = await fetch(buildApiUrl('/api/dashboard/traffic-trend'));

      if (!response.ok) throw new Error('获取流量趋势数据失败');

      const result = await response.json();
      if (result.success && isMountedRef.current) {
        setTrafficTrend(result.data);
        console.log('[Demo页面] 流量趋势数据获取成功:', {
          数据条数: result.data.length,
          示例数据: result.data.slice(0, 3)
        });
      } else if (isMountedRef.current) {
        throw new Error(result.error || '获取流量趋势数据失败');
      }
    } catch (error) {
      if (isMountedRef.current) {
        console.error('获取流量趋势数据失败:', error);
        setTrafficTrend([]); // 设置为空数组，显示无数据状态
      }
    }
  }, []);

  // 确认清空日志
  const confirmClearLogs = useCallback(async () => {
    if (operationLogs.length === 0) return;
    setClearingLogs(true);
    try {
      const response = await fetch(buildApiUrl('/api/dashboard/operate_logs'), {
        method: 'DELETE',
      });
      const data = await response.json();

      if (response.ok && data.success && isMountedRef.current) {
        setOperationLogs([]);
        onClearClose();
      } else if (isMountedRef.current) {
        console.error('清空失败:', data.error || '无法清空日志');
      }
    } catch (error) {
      if (isMountedRef.current) {
        console.error('清空操作日志失败:', error);
      }
    } finally {
      if (isMountedRef.current) {
        setClearingLogs(false);
      }
    }
  }, [operationLogs.length, onClearClose]);

  // 初始化数据
  useEffect(() => {
    const fetchData = async () => {
      if (!isMountedRef.current) return;

      setLoading(true);
      setTrafficLoading(true);

      try {
        await Promise.all([
          fetchTunnelStats(),
          fetchOperationLogs(),
          fetchTrafficTrend(),
          fetchEndpoints()
        ]);
      } catch (error) {
        if (isMountedRef.current) {
          console.error('加载数据失败:', error);
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
          setTrafficLoading(false);
        }
      }
    };

    fetchData();
  }, [fetchTunnelStats, fetchOperationLogs, fetchTrafficTrend, fetchEndpoints]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // 表格列定义
  const columns = [
    { key: "time", label: "时间" },
    { key: "action", label: "操作" },
    { key: "instance", label: "实例" },
    { key: "status", label: "状态" },
  ];

  // 根据操作类型获取图标和样式
  const getActionIconAndColor = useCallback((action: string) => {
    const actionLower = action.toLowerCase();

    if (actionLower.includes('start') || actionLower.includes('启动')) {
      return {
        icon: faPlay,
        color: 'success' as const,
        bgColor: 'bg-success/10',
        textColor: 'text-success'
      };
    } else if (actionLower.includes('stop') || actionLower.includes('停止')) {
      return {
        icon: faStop,
        color: 'danger' as const,
        bgColor: 'bg-danger/10',
        textColor: 'text-danger'
      };
    } else if (actionLower.includes('create') || actionLower.includes('创建')) {
      return {
        icon: faRocket,
        color: 'primary' as const,
        bgColor: 'bg-primary/10',
        textColor: 'text-primary'
      };
    } else if (actionLower.includes('delete') || actionLower.includes('删除')) {
      return {
        icon: faTrash,
        color: 'danger' as const,
        bgColor: 'bg-danger/10',
        textColor: 'text-danger'
      };
    } else if (actionLower.includes('restart') || actionLower.includes('重启')) {
      return {
        icon: faRotateRight,
        color: 'warning' as const,
        bgColor: 'bg-warning/10',
        textColor: 'text-warning'
      };
    } else {
      // 默认图标
      return {
        icon: faExclamationTriangle,
        color: 'default' as const,
        bgColor: 'bg-default/10',
        textColor: 'text-default-600'
      };
    }
  }, []);

  return (
    <div className={cn("space-y-4 md:space-y-6 p-4 md:p-0", fontSans.className)}>
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-foreground">👋 概览</h1>
          <p className="text-sm md:text-base text-default-500">
            当前时间 {formatTime(currentTime)}
          </p>
        </div>

        <div className="flex gap-4 md:gap-6">
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-primary">{loading ? "--" : tunnelStats.total}</div>
            <div className="text-xs md:text-sm text-default-500">实例数</div>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-secondary">{loading ? "--" : tunnelStats.total_endpoints}</div>
            <div className="text-xs md:text-sm text-default-500">主控数</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          className="p-3 md:p-4 bg-gradient-to-br from-success-50 to-success-100/50 dark:from-success-900/20 dark:to-success-900/10 cursor-pointer transition-transform hover:scale-[1.02]"
          classNames={{
            base: "bg-content1 outline-none transition-transform-background motion-reduce:transition-none"
          }}
          isPressable
        >
          <CardBody className="p-0">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <span className="text-default-600 text-xs md:text-sm">运行</span>
                <span className="text-xl md:text-2xl font-semibold text-success">{loading ? "--" : tunnelStats.running}</span>
              </div>
              <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg bg-success/10 text-success">
                <FontAwesomeIcon icon={faPlay} className="!w-6 !h-6" style={{ width: '24px', height: '24px' }} />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card
          className="p-3 md:p-4 bg-gradient-to-br from-danger-50 to-danger-100/50 dark:from-danger-900/20 dark:to-danger-900/10 cursor-pointer transition-transform hover:scale-[1.02]"
          classNames={{
            base: "bg-content1 outline-none transition-transform-background motion-reduce:transition-none"
          }}
          isPressable
        >
          <CardBody className="p-0">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <span className="text-default-600 text-xs md:text-sm">停止</span>
                <span className="text-xl md:text-2xl font-semibold text-danger">{loading ? "--" : tunnelStats.stopped}</span>
              </div>
              <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg bg-danger/10 text-danger">
                <FontAwesomeIcon icon={faStop} className="!w-6 !h-6" style={{ width: '24px', height: '24px' }} />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card
          className="p-3 md:p-4 bg-gradient-to-br from-warning-50 to-warning-100/50 dark:from-warning-900/20 dark:to-warning-900/10 cursor-pointer transition-transform hover:scale-[1.02]"
          classNames={{
            base: "bg-content1 outline-none transition-transform-background motion-reduce:transition-none"
          }}
          isPressable
        >
          <CardBody className="p-0">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <span className="text-default-600 text-xs md:text-sm">错误</span>
                <span className="text-xl md:text-2xl font-semibold text-warning">{loading ? "--" : tunnelStats.error}</span>
              </div>
              <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg bg-warning/10 text-warning">
                <FontAwesomeIcon icon={faExclamationTriangle} className="!w-6 !h-6" style={{ width: '24px', height: '24px' }} />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card
          className="p-3 md:p-4 bg-gradient-to-br from-default-50 to-default-100/50 dark:from-default-900/20 dark:to-default-900/10 cursor-pointer transition-transform hover:scale-[1.02]"
          classNames={{
            base: "bg-content1 outline-none transition-transform-background motion-reduce:transition-none"
          }}
          isPressable
        >
          <CardBody className="p-0">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <span className="text-default-600 text-xs md:text-sm">离线</span>
                <span className="text-xl md:text-2xl font-semibold text-default-600">{loading ? "--" : tunnelStats.offline}</span>
              </div>
              <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg bg-default/10 text-default-600">
                <FontAwesomeIcon icon={faUnlink} className="!w-6 !h-6" style={{ width: '24px', height: '24px' }} />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* 流量概览和主控列表 - 响应式布局 */}
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 md:gap-6" style={{ minHeight: '400px' }}>
        {/* 流量概览 - 在移动端占满宽度，桌面端占2列 */}
        <div className="lg:col-span-2 lg:h-full">
          <TrafficOverviewChart
            data={trafficTrend.map(item => ({
              time: new Date(item.hourTime * 1000).toISOString(), // 将时间戳转换为ISO字符串
              tcpIn: item.tcpRx,
              tcpOut: item.tcpTx,
              udpIn: item.udpRx,
              udpOut: item.udpTx,
            }))}
            loading={trafficLoading}
            timeRange="24Hours"
            onTimeRangeChange={(range) => {
              console.log('时间范围变化:', range);
              // 这里可以根据时间范围重新获取数据
            }}
          />
        </div>

        {/* 主控列表 - 右侧卡片 */}
        <div className="lg:h-full">
          <Card className="h-full min-h-[400px] dark:border-default-100 border border-transparent">
            <CardHeader className="p-5 pb-0">
              <div className="flex flex-col items-start gap-1 w-full">
                <span className="text-base font-semibold text-foreground">主控列表</span>
              </div>
            </CardHeader>
            <CardBody className="p-5 pt-3">
              <div className="space-y-3">
                {loading ? (
                  // 加载状态骨架屏
                  [1, 2, 3, 4].map((i) => (
                    <Card key={i} className="w-full h-[80px] bg-white dark:bg-default-50">
                      <CardBody className="p-4">
                        <div className="flex items-center gap-4 h-full">
                          {/* 左侧：SVG图标骨架 */}
                          <div className="w-8 h-8 bg-default-300 rounded animate-pulse flex-shrink-0" />

                          {/* 右侧：信息骨架 */}
                          <div className="flex flex-col justify-center gap-1 flex-1">
                            <div className="w-20 h-4 bg-default-300 rounded animate-pulse" />
                            <div className="w-32 h-3 bg-default-300 rounded animate-pulse" />
                            <div className="w-16 h-3 bg-default-200 rounded animate-pulse" />
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))
                ) : endpoints.length > 0 ? (
                  // 主控卡片列表 - 竖向排列
                  endpoints.map((endpoint) => (
                    <Card
                      key={endpoint.id}
                      className="w-full h-[80px]  bg-white dark:bg-default-100"
                    >
                      <CardBody className="p-4">
                        <div className="flex items-center h-full">
                          {/* 左侧：服务器图标 */}
                          <div className="flex-shrink-0 -ml-1">
                            {endpoint.status === 'ONLINE' ? (
                              <ServerIcon size={64} className="text-default-400" />
                            ) : (
                              <ServerIconRed size={64} className="text-default-400" />
                            )}
                          </div>

                          {/* 右侧：主控信息 */}
                          <div className="flex flex-col justify-center gap-1 flex-1 min-w-0">
                            {/* 主控名称和实例数量 */}
                            <div className="flex items-center gap-1 min-w-0">
                              <h4 className="font-medium text-sm text-foreground truncate">{endpoint.name}</h4>
                              <Chip
                                size="sm"
                                variant="flat"
                                color="default"
                                classNames={{
                                  base: "text-xs",
                                  content: "text-xs"
                                }}
                              >
                                {endpoint.tunnelCount || 0} 个实例
                              </Chip>
                            </div>

                            {/* 主控地址 - 根据隐私模式显示 */}
                            <p className="text-xs text-default-500 truncate font-mono">
                              {maskIpAddress(endpoint.url)}
                            </p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))
                ) : (
                  // 无主控时的空状态
                  <div className="flex items-center justify-center h-32">
                    <div className="text-center">
                      <p className="text-default-500 text-sm">暂无主控</p>
                      <p className="text-default-400 text-xs mt-1">请先添加主控服务器</p>
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* 快捷操作和其他卡片 - 三列布局 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* 快捷操作按钮 - 左侧占三分之一 */}
        <div className="w-full">
          <DemoQuickEntryCard />
        </div>

        {/* 本周统计 - 中间占三分之一 */}
        <div className="w-full">
          <WeeklyStatsChart />
        </div>

        {/* 今日统计 - 右侧占三分之一 */}
        <div className="w-full">
          <DailyStatsChart />
        </div>
      </div>

      {/* 最近活动 */}
      <Card isHoverable className="min-h-[400px]">
        <CardHeader className="p-5">
          <div className="flex flex-col items-start gap-1 w-full">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col items-start gap-0">
                <span className="text-base font-semibold text-foreground">最近活动</span>
                <span className="text-sm text-default-500">
                  {loading ? "加载中..." : `筛选最近1000条记录`}
                </span>
              </div>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="text-default-400 hover:text-danger"
                onPress={onClearOpen}
                title="清空最近活动"
              >
                <Icon icon="solar:trash-bin-minimalistic-bold" className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-4 pt-0">
          <div className="">
            <div className="h-[400px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <Table
                isHeaderSticky
                selectionMode="none"
                removeWrapper
                classNames={{
                  base: "overflow-visible",
                  table: operationLogs.length === 0 ? "min-h-[200px]" : "",
                  thead: "text-white border-none",
                  tbody: "",
                  tr: "",
                  td: "text-xs md:text-sm border-none"
                }}
              >
                <TableHeader columns={columns}>
                  {(column) => (
                    <TableColumn
                      key={column.key}
                      hideHeader={false}
                      align="start"
                      className="bg-primary text-white border-none"
                    >
                      {column.label}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody
                  items={operationLogs}
                  emptyContent={
                    <div className="text-center py-8">
                      <span className="text-default-400 text-xs md:text-sm">
                        {loading ? "加载中..." : "暂无操作记录"}
                      </span>
                    </div>
                  }
                >
                  {(log) => (
                    <TableRow>
                      {(columnKey) => (
                        <TableCell>
                          {columnKey === "time" && (
                            <div className="text-xs md:text-sm">
                              {new Date(log.time).toLocaleString('zh-CN', {
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          )}
                          {columnKey === "action" && (
                            <div className="flex items-center gap-2">
                              <div className={`flex items-center justify-center w-6 h-6 rounded-md ${getActionIconAndColor(log.action).bgColor}`}>
                                <FontAwesomeIcon
                                  icon={getActionIconAndColor(log.action).icon}
                                  className={`!w-3 !h-3 ${getActionIconAndColor(log.action).textColor}`}
                                  style={{ width: '12px', height: '12px' }}
                                />
                              </div>
                              <span className="truncate text-xs md:text-sm">{log.action}</span>
                            </div>
                          )}
                          {columnKey === "instance" && (
                            <div className="truncate text-xs md:text-sm">{log.instance}</div>
                          )}
                          {columnKey === "status" && (
                            <Chip
                              color={log.status.type}
                              size="sm"
                              variant="flat"
                              startContent={<Icon icon={log.status.icon} width={12} className="md:w-3.5 md:h-3.5" />}
                              classNames={{
                                base: "text-xs max-w-full",
                                content: "truncate"
                              }}
                            >
                              {log.status.text}
                            </Chip>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 清空操作日志确认模态框 */}
      <Modal isOpen={isClearOpen} onClose={onClearClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">确认清空最近活动</ModalHeader>
          <ModalBody>
            <p className="text-sm">此操作将删除所有最近活动记录，且不可撤销。确定要继续吗？</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClearClose}>取消</Button>
            <Button color="danger" onPress={confirmClearLogs} isLoading={clearingLogs}>确认清空</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}