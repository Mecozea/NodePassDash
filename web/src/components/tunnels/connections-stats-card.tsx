import { Card } from '@heroui/react';

interface ConnectionsData {
  pool?: number | null;
  tcps?: number | null;
  udps?: number | null;
}

interface ConnectionsStatsCardProps {
  connectionsData: ConnectionsData;
}

export const ConnectionsStatsCard = ({ connectionsData }: ConnectionsStatsCardProps) => {
  // 计算TCP和UDP连接数
  const tcpConnections = connectionsData.tcps || 0;
  const udpConnections = connectionsData.udps || 0;
  const totalConnections = tcpConnections + udpConnections;

  // 计算百分比用于显示比例
  const tcpPercentage = totalConnections > 0 ? (tcpConnections / totalConnections) * 100 : 50;
  const udpPercentage = totalConnections > 0 ? (udpConnections / totalConnections) * 100 : 50;

  return (
    <div className="col-span-3">
      <Card className="relative p-4 cursor-pointer transition-all duration-300 hover:shadow-lg mb-4">
        {/* 顶部区域 */}
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center  text-base font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              className="text-blue-500 mr-1"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 2v4l3-3h3l3 3V2h3v20h-3v-4l-3 3h-3l-3-3v4H5V2z"
              />
            </svg>
            <span>连接数量</span>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="flex flex-row items-center justify-between mt-3">
          <div className="flex rounded-lg overflow-hidden bg-slate-100 mt-2 w-full">
            {/* TCP连接部分 */}
            <div
              className="text-white p-4 flex-1 flex flex-col items-center relative bg-blue-500 dark:bg-blue-600"
              style={{
                flex: `${tcpPercentage}`,
                minWidth: '100px'
              }}
            >
              <div className="text-xl font-bold mb-1">
                {tcpConnections}
              </div>
              <div className="text-sm font-medium opacity-90">
                TCP连接
              </div>
            </div>

            {/* UDP连接部分 */}
            <div
              className="text-white p-4 flex-1 flex flex-col items-center bg-green-500 dark:bg-green-600"
              style={{
                flex: `${udpPercentage}`,
                minWidth: '100px'
              }}
            >
              <div className="text-xl font-bold mb-1">
                {udpConnections}
              </div>
              <div className="text-sm font-medium opacity-90">
                UDP连接
              </div>
            </div>
          </div>
        </div>

      </Card>
    </div>
  );
};