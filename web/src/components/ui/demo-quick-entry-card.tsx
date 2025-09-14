import { Button, Card, CardBody } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faServer,
  faPlus,
  faLayerGroup,
  faBug
} from "@fortawesome/free-solid-svg-icons";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

/**
 * Demo QuickEntry Card 快捷操作卡片组件（Demo页面专用）
 * 2列3行布局，按钮为左右布局：icon label
 */
export function DemoQuickEntryCard() {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: "add-endpoint",
      icon: faServer,
      label: "添加主控",
      route: "/endpoints",
      color: "bg-blue-500 hover:bg-blue-600",
      iconType: "fontawesome",
      external: false
    },
    {
      id: "create-tunnel",
      icon: "solar:transmission-bold",
      label: "创建实例",
      route: "/tunnels/create",
      color: "bg-green-500 hover:bg-green-600",
      iconType: "iconify",
      external: false
    },
    {
      id: "template-create",
      icon: faLayerGroup,
      label: "场景创建",
      route: "/templates",
      color: "bg-purple-500 hover:bg-purple-600",
      iconType: "fontawesome",
      external: false
    },
    {
      id: "settings",
      icon: "solar:settings-bold",
      label: "设置",
      route: "/settings",
      color: "bg-gray-500 hover:bg-gray-600",
      iconType: "iconify",
      external: false
    },
    {
      id: "docs",
      icon: "solar:document-text-bold",
      label: "文档",
      route: "/docs",
      color: "bg-indigo-500 hover:bg-indigo-600",
      iconType: "iconify",
      external: false
    },
    {
      id: "debug-tools",
      icon: faBug,
      label: "调试工具",
      route: "/debug",
      color: "bg-teal-500 hover:bg-teal-600",
      iconType: "fontawesome",
      external: false
    }
  ];

  return (
    <Card className="h-full min-h-[300px] dark:border-default-100 border border-transparent">
      <CardBody className="p-5 h-full flex flex-col">
        {/* 标题 */}
        <span className="text-base font-semibold text-foreground mb-4">快捷操作</span>

        {/* 按钮网格 - 2列3行 */}
        <div className="grid grid-cols-2 gap-3 flex-1">
          {quickActions.map((action) => (
            <div
              key={action.id}
              className="flex items-center gap-3 p-3 cursor-pointer group transition-all hover:scale-[1.02] rounded-lg hover:bg-default-50 dark:hover:bg-default-100"
              onClick={() => {
                if (action.external) {
                  window.open(action.route, '_blank');
                } else {
                  navigate(action.route);
                }
              }}
            >
              {/* 图标 */}
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${action.color} text-white transition-colors duration-200 group-hover:shadow-lg flex-shrink-0`}>
                {action.iconType === "fontawesome" ? (
                  <FontAwesomeIcon
                    icon={action.icon}
                    className="!w-4 !h-4"
                    style={{ width: '16px', height: '16px' }}
                  />
                ) : (
                  <Icon
                    icon={action.icon}
                    width={16}
                    height={16}
                  />
                )}
              </div>

              {/* 文字标签 */}
              <span className="text-sm text-default-600 group-hover:text-foreground transition-colors duration-200 font-medium">
                {action.label}
              </span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}