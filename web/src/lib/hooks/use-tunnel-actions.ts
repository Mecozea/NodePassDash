import { useState } from "react";
import { addToast } from "@heroui/toast";
import { useNavigate } from "react-router-dom";
import { buildApiUrl } from '@/lib/utils';

export interface TunnelActionOptions {
  tunnelId: string;
  tunnelName: string;
  instanceId: string;
  onStatusChange?: (tunnelId: string, isRunning: boolean) => void;
  redirectAfterDelete?: boolean;
  onSuccess?: () => void;
  recycle?: boolean;
}

export const useTunnelActions = () => {
  const navigate = useNavigate();

  const toggleStatus = async (isRunning: boolean, options: TunnelActionOptions) => {
    const { tunnelId, tunnelName, instanceId, onStatusChange } = options;
    const action = isRunning ? 'stop' : 'start';
    const actionText = isRunning ? '停止' : '启动';
    
    try {
      addToast({
        timeout: 1,
        title: `正在${actionText}实例...`,
        description: tunnelName ? `${actionText} ${tunnelName}` : "请稍候",
        color: "primary",
        promise: fetch(buildApiUrl(`/api/tunnels/${tunnelId}/status`), {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: action
          }),
        }).then(async (response) => {
          const data = await response.json();
          if (!response.ok || !data.success) {
            throw new Error(data.message || data.error || `${actionText}失败`);
          }
          
          // 更新状态 (使用tunnelId用于前端状态管理)
          if (tunnelId) {
            // const newStatus = data.tunnel.status === 'running';
            onStatusChange?.(tunnelId, !isRunning);
          }

          // 显示成功提示
          addToast({
            title: `实例已${actionText}`,
            description: tunnelName ? `${tunnelName} 已成功${actionText}` : `实例已成功${actionText}`,
            color: "success",
          });

          return data;
        }).catch((error) => {
          // 显示错误提示
          addToast({
            title: `${actionText}失败`,
            description: error.message || `${tunnelName || '实例'} ${actionText}失败`,
            color: "danger",
          });
          throw error;
        }),
      });
    } catch (error) {
      addToast({
        title: `${actionText}失败`,
        description: error instanceof Error ? error.message : `${actionText}实例时发生错误`,
        color: "danger",
      });
    }
  };

  const restart = async (options: TunnelActionOptions) => {
    const { tunnelId, tunnelName, instanceId, onStatusChange } = options;
    
    try {
      addToast({
        timeout: 1,
        title: "正在重启实例...",
        description: tunnelName ? `重启 ${tunnelName}` : "请稍候",
        color: "primary",
        promise: fetch(buildApiUrl(`/api/tunnels/${tunnelId}/status`), {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'restart'
          }),
        }).then(async (response) => {
          const data = await response.json();
          if (!response.ok || !data.success) {
            throw new Error(data.message || data.error || '重启失败');
          }
          
          // 更新状态 (使用tunnelId用于前端状态管理)
          if (tunnelId) {
            // const newStatus = data.tunnel.status === 'running';
            onStatusChange?.(tunnelId, true);
          }

          // 显示成功提示
          addToast({
            title: "实例重启完成",
            description: tunnelName ? `${tunnelName} 已成功重启并运行` : "实例已成功重启并运行",
            color: "success",
          });

          return data;
        }).catch((error) => {
          // 显示错误提示
          addToast({
            title: "重启失败",
            description: error.message || `${tunnelName || '实例'}重启失败`,
            color: "danger",
          });
          throw error;
        }),
      });
    } catch (error) {
      addToast({
        title: "重启失败",
        description: error instanceof Error ? error.message : "重启实例时发生错误",
        color: "danger",
      });
    }
  };

  const deleteTunnel = async (options: TunnelActionOptions) => {
    const { tunnelId, tunnelName, instanceId, redirectAfterDelete = true, onSuccess, recycle = false } = options;
    
    try {
      addToast({
        timeout: 1,
        title: "正在删除实例...",
        description: tunnelName ? `删除 ${tunnelName}` : "请稍候",
        color: "primary",
        promise: fetch(buildApiUrl(`/api/tunnels/${tunnelId}` + (recycle ? '?recycle=1' : '')), {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        }).then(async (response) => {
          const data = await response.json();
          if (!response.ok || !data.success) {
            throw new Error(data.message || data.error || '删除失败');
          }

          // 显示成功提示
          addToast({
            title: "实例已删除",
            description: tunnelName ? `${tunnelName} 已成功删除` : "实例已成功删除",
            color: "success",
          });
          
          // 调用成功回调
          onSuccess?.();
          
          // 成功删除后跳转
          if (redirectAfterDelete) {
            setTimeout(() => {
              navigate("/tunnels");
            }, 500);
          }

          return data;
        }).catch((error) => {
          // 显示错误提示
          addToast({
            title: "删除失败",
            description: error.message || `${tunnelName || '实例'}删除失败`,
            color: "danger",
          });
          throw error;
        }),
      });
    } catch (error) {
      addToast({
        title: "删除失败",
        description: error instanceof Error ? error.message : "删除实例时发生错误",
        color: "danger",
      });
    }
  };

  return {
    toggleStatus,
    restart,
    deleteTunnel,
  };
}; 