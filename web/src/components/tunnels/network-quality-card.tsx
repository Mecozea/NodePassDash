import { Card } from '@heroui/react';

interface NetworkQualityData {
  ping?: number | null;
  pool?: number | null;
}

interface NetworkQualityCardProps {
  networkData: NetworkQualityData;
}

export const NetworkQualityCard = ({ networkData }: NetworkQualityCardProps) => {
  const ping = networkData.ping || 0;
  const pool = networkData.pool || 0;

  // 计算延迟质量等级 (越低越好)
  const getLatencyQuality = (latency: number) => {
    if (latency === 0) return { level: '未知', percentage: 0 };
    if (latency <= 50) return { level: '优秀', percentage: 90 };
    if (latency <= 100) return { level: '良好', percentage: 70 };
    if (latency <= 200) return { level: '一般', percentage: 50 };
    return { level: '较差', percentage: 30 };
  };

  // 计算连接池质量等级 (适中最好)
  const getPoolQuality = (poolCount: number) => {
    if (poolCount === 0) return { level: '空闲', percentage: 50 };
    if (poolCount <= 10) return { level: '轻负载', percentage: 80 };
    if (poolCount <= 50) return { level: '中负载', percentage: 90 };
    if (poolCount <= 100) return { level: '重负载', percentage: 70 };
    return { level: '超负载', percentage: 40 };
  };

  const latencyQuality = getLatencyQuality(ping);
  const poolQuality = getPoolQuality(pool);

  // 使用百分比来显示质量比例
  const latencyPercentage = latencyQuality.percentage;
  const poolPercentage = poolQuality.percentage;

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
                d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7z"
              />
            </svg>
            <span>网络质量</span>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="flex flex-row items-center justify-between mt-3">
          <div className="flex rounded-lg overflow-hidden bg-slate-100 mt-2 w-full">
            {/* 延迟质量部分 */}
            <div
              className="text-white p-4 flex-1 flex flex-col items-center relative bg-orange-500 dark:bg-orange-600"
              style={{
                flex: `${latencyPercentage}`,
                minWidth: '100px'
              }}
            >
              <div className="text-xl font-bold mb-1">
                {ping > 0 ? `${ping}ms` : '—'}
              </div>
              <div className="text-sm font-medium opacity-90">
                延迟 {latencyQuality.level}
              </div>
            </div>

            {/* 池连接质量部分 */}
            <div
              className="text-white p-4 flex-1 flex flex-col items-center bg-cyan-500 dark:bg-cyan-600"
              style={{
                flex: `${poolPercentage}`,
                minWidth: '100px'
              }}
            >
              <div className="text-xl font-bold mb-1">
                {pool}
              </div>
              <div className="text-sm font-medium opacity-90">
                池 {poolQuality.level}
              </div>
            </div>
          </div>
        </div>

      </Card>
    </div>
  );
};