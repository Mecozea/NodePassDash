"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tooltip,
  Input,
  DatePicker,
  Checkbox,
  RadioGroup,
  Radio,
  Select,
  SelectItem,
  Switch,
  Divider,
} from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTag,
  faSave,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import { addToast } from "@heroui/toast";
import Editor from "@monaco-editor/react";
import { parseDate, CalendarDate, type DateValue } from "@internationalized/date";

import { buildApiUrl } from "@/lib/utils";

// 实例标签类型
interface InstanceTag {
  key: string;
  value: string;
}

// 标签数据结构
interface TagData {
  startDate?: string;
  endDate?: string;
  amount?: string;
  bandwidth?: string;
  trafficVol?: string;
  trafficType?: string;
  IPv4?: string;
  IPv6?: string;
  networkRoute?: string;
  extra?: string;
  [key: string]: any;
}

// 金额模式类型
type AmountMode = 'none' | 'prefix' | 'suffix' | 'free';

// 货币选项
const CURRENCY_OPTIONS = [
  { key: 'CNY', label: '¥', value: 'CNY' },
  { key: 'USD', label: '$', value: 'USD' },
  { key: 'EUR', label: '€', value: 'EUR' },
  { key: 'GBP', label: '£', value: 'GBP' },
  { key: 'JPY', label: '¥', value: 'JPY' },
];

// 带宽单位选项
const BANDWIDTH_UNITS = [
  { key: 'Kbps', label: 'Kbps' },
  { key: 'Mbps', label: 'Mbps' },
  { key: 'Gbps', label: 'Gbps' },
];

// 流量单位选项
const TRAFFIC_UNITS = [
  { key: 'MB/月', label: 'MB/月' },
  { key: 'GB/月', label: 'GB/月' },
  { key: 'TB/月', label: 'TB/月' },
  { key: 'PB/月', label: 'PB/月' },
];

// 流量类型选项
const TRAFFIC_TYPE_OPTIONS = [
  { key: '1', label: '单项计算' },
  { key: '2', label: '双向计算' },
];

interface InstanceTagModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tunnelId: string;
  currentTags?: InstanceTag[];
  onSaved: () => void;
}

export default function InstanceTagModal({
  isOpen,
  onOpenChange,
  tunnelId,
  currentTags = [],
  onSaved,
}: InstanceTagModalProps) {
  const [jsonText, setJsonText] = useState("");
  const [saving, setSaving] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);

  // 原始数据备份，用于对比变化
  const [originalData, setOriginalData] = useState<TagData>({});

  // 标准字段状态
  const [formData, setFormData] = useState<TagData>({});
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [amountMode, setAmountMode] = useState<AmountMode>('none');
  const [prefixCurrency, setPrefixCurrency] = useState('CNY');
  const [suffixCurrency, setSuffixCurrency] = useState('CNY');
  const [amountValue, setAmountValue] = useState('');
  const [bandwidthValue, setBandwidthValue] = useState('');
  const [bandwidthUnit, setBandwidthUnit] = useState('Mbps');
  const [trafficValue, setTrafficValue] = useState('');
  const [trafficUnit, setTrafficUnit] = useState('GB/月');

  // 同步模式：'form' | 'json'
  const [syncMode, setSyncMode] = useState<'form' | 'json'>('form');

  // 数据转换函数：InstanceTag[] -> TagData
  const convertTagsToData = (tags: InstanceTag[]): TagData => {
    const data: TagData = {};
    tags.forEach(tag => {
      data[tag.key] = tag.value;
    });
    return data;
  };

  // 数据转换函数：TagData -> InstanceTag[]
  const convertDataToTags = (data: TagData): InstanceTag[] => {
    return Object.entries(data).map(([key, value]) => ({
      key,
      value: String(value)
    }));
  };

  // 从表单数据生成完整的TagData
  const buildTagDataFromForm = (): TagData => {
    const data: TagData = {};

    if (formData.startDate) data.startDate = formData.startDate;

    if (isUnlimited) {
      data.endDate = '0000-00-00T23:59:59+08:00';
    } else if (formData.endDate) {
      data.endDate = formData.endDate;
    }

    if (amountMode === 'free') {
      data.amount = 'Free';
    } else if (amountMode === 'prefix' && amountValue) {
      const symbol = CURRENCY_OPTIONS.find(c => c.key === prefixCurrency)?.label || '¥';
      data.amount = `${symbol}${amountValue}`;
    } else if (amountMode === 'suffix' && amountValue) {
      data.amount = `${amountValue}${suffixCurrency}`;
    } else if (amountMode === 'none' && amountValue) {
      data.amount = amountValue;
    }

    if (bandwidthValue) {
      data.bandwidth = `${bandwidthValue}${bandwidthUnit}`;
    }

    if (trafficValue) {
      data.trafficVol = `${trafficValue}${trafficUnit}`;
    }

    if (formData.trafficType) data.trafficType = formData.trafficType;
    if (formData.IPv4) data.IPv4 = formData.IPv4;
    if (formData.IPv6) data.IPv6 = formData.IPv6;
    if (formData.networkRoute) data.networkRoute = formData.networkRoute;
    if (formData.extra) data.extra = formData.extra;

    // 添加其他非标准字段
    Object.keys(formData).forEach(key => {
      if (!['startDate', 'endDate', 'amount', 'bandwidth', 'trafficVol', 'trafficType', 'IPv4', 'IPv6', 'networkRoute', 'extra'].includes(key)) {
        data[key] = formData[key];
      }
    });

    return data;
  };

  // 构建用于提交的标签数据（处理删除逻辑）
  const buildSubmitTags = (currentData: TagData): InstanceTag[] => {
    const tags: InstanceTag[] = [];

    // 获取所有可能的字段（原始数据 + 当前数据）
    const allKeys = new Set([...Object.keys(originalData), ...Object.keys(currentData)]);

    allKeys.forEach(key => {
      const originalValue = originalData[key];
      const currentValue = currentData[key];

      // 如果原始数据有这个字段，则需要处理
      if (originalValue !== undefined) {
        if (currentValue === '' || currentValue === undefined) {
          // 字段被删除或清空，发送空值以删除
          tags.push({ key, value: '' });
        } else {
          // 字段有值（包括修改和未变化）
          tags.push({ key, value: String(currentValue) });
        }
      } else if (currentValue !== undefined) {
        // 新增的字段（包括空值）
        tags.push({ key, value: String(currentValue) });
      }
    });

    return tags;
  };

  // 从 JSON 对象构建标签数组（包含空值）
  const buildTagsFromJsonObject = (data: TagData): InstanceTag[] => {
    const tags: InstanceTag[] = [];

    // 遍历所有字段，包括空值
    Object.entries(data).forEach(([key, value]) => {
      tags.push({ key, value: String(value || '') });
    });

    return tags;
  };

  // 从 TagData 初始化表单状态
  const initFormFromData = (data: TagData) => {
    setFormData(data);

    // 初始化结束日期
    if (data.endDate === '0000-00-00T23:59:59+08:00') {
      setIsUnlimited(true);
    } else {
      setIsUnlimited(false);
    }

    // 初始化金额模式
    if (data.amount === 'Free') {
      setAmountMode('free');
      setAmountValue('');
    } else if (data.amount) {
      const amount = data.amount;
      // 检查是否以货币符号开头
      const prefixMatch = CURRENCY_OPTIONS.find(c => amount.startsWith(c.label));
      if (prefixMatch) {
        setAmountMode('prefix');
        setPrefixCurrency(prefixMatch.key);
        setAmountValue(amount.substring(prefixMatch.label.length));
      } else {
        // 检查是否以货币代码结尾
        const suffixMatch = CURRENCY_OPTIONS.find(c => amount.endsWith(c.key));
        if (suffixMatch) {
          setAmountMode('suffix');
          setSuffixCurrency(suffixMatch.key);
          setAmountValue(amount.substring(0, amount.length - suffixMatch.key.length));
        } else {
          setAmountMode('none');
          setAmountValue(amount);
        }
      }
    } else {
      setAmountMode('none');
      setAmountValue('');
    }

    // 初始化带宽
    if (data.bandwidth) {
      const bandwidthMatch = BANDWIDTH_UNITS.find(unit => data.bandwidth!.endsWith(unit.key));
      if (bandwidthMatch) {
        setBandwidthValue(data.bandwidth.substring(0, data.bandwidth.length - bandwidthMatch.key.length));
        setBandwidthUnit(bandwidthMatch.key);
      } else {
        setBandwidthValue(data.bandwidth);
      }
    } else {
      setBandwidthValue('');
    }

    // 初始化流量
    if (data.trafficVol) {
      const trafficMatch = TRAFFIC_UNITS.find(unit => data.trafficVol!.endsWith(unit.key));
      if (trafficMatch) {
        setTrafficValue(data.trafficVol.substring(0, data.trafficVol.length - trafficMatch.key.length));
        setTrafficUnit(trafficMatch.key);
      } else {
        setTrafficValue(data.trafficVol);
      }
    } else {
      setTrafficValue('');
    }
  };

  // 初始化标签数据
  useEffect(() => {
    if (isOpen) {
      // 兼容原有的数组格式数据
      let initialData: TagData = {};
      let initialJson: string;

      if (currentTags && currentTags.length > 0) {
        // 检查是否有标准字段，如果有则优先显示对象格式
        const standardFields = ['startDate', 'endDate', 'amount', 'bandwidth', 'trafficVol', 'trafficType', 'IPv4', 'IPv6', 'networkRoute', 'extra'];
        const hasStandardFields = currentTags.some(tag => standardFields.includes(tag.key));

        if (hasStandardFields) {
          // 新格式：转换为对象显示
          initialData = convertTagsToData(currentTags);
          initialJson = JSON.stringify(initialData, null, 2);
        } else {
          // 旧格式：显示数组格式，但也同步到表单
          initialData = convertTagsToData(currentTags);
          initialJson = JSON.stringify(currentTags, null, 2);
        }
      } else {
        initialJson = JSON.stringify(initialData, null, 2);
      }

      initFormFromData(initialData);
      setJsonText(initialJson);
      setJsonError(null);
      setSyncMode('form');
    }
  }, [isOpen, currentTags]);

  // 同步表单数据到JSON
  const syncFormToJson = () => {
    if (syncMode === 'json') return; // 防止循环同步

    setSyncMode('form');
    const data = buildTagDataFromForm();
    setJsonText(JSON.stringify(data, null, 2));
    setJsonError(null);
  };

  // JSON文本变化处理
  const handleJsonChange = (value: string) => {
    setJsonText(value);
    setSyncMode('json');

    // 实时验证JSON格式
    try {
      if (value.trim() === "") {
        setJsonError(null);
        return;
      }

      const parsed = JSON.parse(value);

      // 支持两种格式：数组格式（旧）和对象格式（新）
      if (Array.isArray(parsed)) {
        // 数组格式验证
        for (let i = 0; i < parsed.length; i++) {
          const tag = parsed[i];
          if (!tag || typeof tag !== 'object' || !tag.key || !tag.value) {
            setJsonError(`第 ${i + 1} 个标签格式不正确，必须包含 key 和 value 字段`);
            return;
          }
        }
        setJsonError(null);
        // 数组格式转换为对象同步到表单
        if (syncMode === 'json') {
          const convertedData = convertTagsToData(parsed);
          initFormFromData(convertedData);
        }
        return;
      } else if (typeof parsed === 'object' && parsed !== null) {
        // 对象格式验证和同步
        setJsonError(null);
        if (syncMode === 'json') {
          initFormFromData(parsed);
        }
      } else {
        setJsonError("数据必须是对象或数组格式");
        return;
      }
    } catch (error) {
      setJsonError("JSON 格式无效");
    }
  };

  // 表单字段变化时同步到JSON
  useEffect(() => {
    if (syncMode === 'form') {
      syncFormToJson();
    }
  }, [formData, isUnlimited, amountMode, prefixCurrency, suffixCurrency, amountValue, bandwidthValue, bandwidthUnit, trafficValue, trafficUnit]);

  // 保存标签设置
  const handleSave = async () => {
    try {
      setSaving(true);

      // 检查是否有JSON错误
      if (jsonError) {
        addToast({
          title: "错误",
          description: jsonError,
          color: "danger",
        });
        return;
      }

      // 解析JSON
      let data: any = {};
      try {
        if (jsonText.trim() === "") {
          data = {};
        } else {
          data = JSON.parse(jsonText);
        }
      } catch (error) {
        addToast({
          title: "错误",
          description: "JSON 格式无效",
          color: "danger",
        });
        return;
      }

      // 根据JSON格式决定如何处理数据
      let tags: InstanceTag[] = [];
      if (Array.isArray(data)) {
        // 数组格式直接使用
        tags = data;
      } else {
        // 对象格式：检查是否是从 JSON 编辑器直接编辑
        try {
          const parsedJson = JSON.parse(jsonText);
          if (typeof parsedJson === 'object' && !Array.isArray(parsedJson) && parsedJson !== null) {
            // 来自 JSON 编辑器的对象，直接转换所有字段
            tags = buildTagsFromJsonObject(parsedJson);
          } else {
            // 来自表单的数据，使用智能对比
            tags = buildSubmitTags(data);
          }
        } catch {
          // JSON 解析失败，使用智能对比
          tags = buildSubmitTags(data);
        }
      }

      const response = await fetch(
        buildApiUrl(`/api/tunnels/${tunnelId}/instance-tags`),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tags: tags,
          }),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "设置实例标签失败");
      }

      addToast({
        title: "成功",
        description: "实例标签设置成功",
        color: "success",
      });

      onSaved();
      onOpenChange(false);
    } catch (error) {
      console.error("设置实例标签失败:", error);
      addToast({
        title: "错误",
        description: error instanceof Error ? error.message : "设置实例标签失败",
        color: "danger",
      });
    } finally {
      setSaving(false);
    }
  };

  // 检查是否有变化
  const hasChanges = () => {
    try {
      const currentData = JSON.parse(jsonText);

      // 对比当前数据和原始数据
      if (Array.isArray(currentData)) {
        // 数组格式的比较
        const originalTags = convertDataToTags(originalData);
        return JSON.stringify(currentData) !== JSON.stringify(originalTags);
      } else {
        // 对象格式的比较
        return JSON.stringify(currentData) !== JSON.stringify(originalData);
      }
    } catch {
      // JSON解析失败时，认为有变化
      return true;
    }
  };

  return (
    <Modal isOpen={isOpen} size="5xl" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon className="text-primary" icon={faTag} />
                实例标签设置
                <Tooltip
                  content={
                    <div className="p-2 max-w-xs">
                      <p className="font-medium mb-2">使用说明：</p>
                      <ul className="text-xs space-y-1">
                        <li>• 左侧为标准字段输入，右侧为 JSON 格式</li>
                        <li>• 左右两侧实时同步，可随意编辑</li>
                        <li>• 空对象 { } 表示清除所有标签</li>
                        <li>• 支持自定义字段扩展</li>
                      </ul>
                    </div>
                  }
                  placement="bottom"
                >
                  <FontAwesomeIcon
                    className="text-default-400 cursor-help text-sm"
                    icon={faQuestionCircle}
                  />
                </Tooltip>
              </div>
            </ModalHeader>
            <ModalBody className="max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6 h-full">
                {/* 左侧：标准字段输入 */}
                <div className="space-y-4">
                  {/* 开始日期和结束日期 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-default-600 mb-2 block">开始日期</label>
                      <DatePicker
                        value={formData.startDate ? parseDate(formData.startDate.split('T')[0]) as DateValue : null}
                        onChange={(date) => {
                          const newData = { ...formData };
                          if (date) {
                            newData.startDate = `${date.toString()}T12:58:17.636Z`;
                          } else {
                            delete newData.startDate;
                          }
                          setFormData(newData);
                        }}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-default-600">结束日期</label>
                        <Checkbox
                          isSelected={isUnlimited}
                          onValueChange={setIsUnlimited}
                          size="sm"
                        >
                          无限期
                        </Checkbox>
                      </div>
                      <DatePicker
                        value={!isUnlimited && formData.endDate && formData.endDate !== '0000-00-00T23:59:59+08:00' ? parseDate(formData.endDate.split('T')[0]) as DateValue : null}
                        onChange={(date) => {
                          const newData = { ...formData };
                          if (date) {
                            newData.endDate = `${date.toString()}T12:58:17.636Z`;
                          } else {
                            delete newData.endDate;
                          }
                          setFormData(newData);
                        }}
                        className="w-full"
                        isDisabled={isUnlimited}
                        minValue={formData.startDate ? parseDate(formData.startDate.split('T')[0]) as DateValue : undefined}
                      />
                    </div>
                  </div>

                  {/* 金额 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-default-600">金额</label>
                      <RadioGroup
                        value={amountMode}
                        onValueChange={(value) => setAmountMode(value as AmountMode)}
                        orientation="horizontal"
                        size="sm"
                      >
                        <Radio value="none">无格式</Radio>
                        <Radio value="prefix">前缀</Radio>
                        <Radio value="suffix">后缀</Radio>
                        <Radio value="free">免费</Radio>
                      </RadioGroup>
                    </div>

                    <div className="flex gap-2">
                      {amountMode === 'prefix' && (
                        <Select
                          selectedKeys={[prefixCurrency]}
                          onSelectionChange={(keys) => setPrefixCurrency(Array.from(keys)[0] as string)}
                          className="w-20"
                          size="sm"
                        >
                          {CURRENCY_OPTIONS.map((currency) => (
                            <SelectItem key={currency.key}>
                              {currency.label}
                            </SelectItem>
                          ))}
                        </Select>
                      )}

                      <Input
                        value={amountValue}
                        onValueChange={setAmountValue}
                        placeholder={amountMode === 'free' ? '免费' : '输入金额'}
                        isDisabled={amountMode === 'free'}
                        className="flex-1"
                        size="sm"
                      />

                      {amountMode === 'suffix' && (
                        <Select
                          selectedKeys={[suffixCurrency]}
                          onSelectionChange={(keys) => setSuffixCurrency(Array.from(keys)[0] as string)}
                          className="w-20"
                          size="sm"
                        >
                          {CURRENCY_OPTIONS.map((currency) => (
                            <SelectItem key={currency.key}>
                              {currency.key}
                            </SelectItem>
                          ))}
                        </Select>
                      )}
                    </div>
                  </div>

                  {/* 带宽和流量 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-default-600 mb-2 block">带宽</label>
                      <Input
                        value={bandwidthValue}
                        onValueChange={setBandwidthValue}
                        placeholder="输入带宽"
                        size="sm"
                        endContent={
                          <select
                            value={bandwidthUnit}
                            onChange={(e) => setBandwidthUnit(e.target.value)}
                            className="border-0 bg-transparent text-default-600 text-sm outline-none"
                          >
                            {BANDWIDTH_UNITS.map((unit) => (
                              <option key={unit.key} value={unit.key}>
                                {unit.label}
                              </option>
                            ))}
                          </select>
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-default-600 mb-2 block">流量</label>
                      <Input
                        value={trafficValue}
                        onValueChange={setTrafficValue}
                        placeholder="输入流量"
                        size="sm"
                        endContent={
                          <select
                            value={trafficUnit}
                            onChange={(e) => setTrafficUnit(e.target.value)}
                            className="border-0 bg-transparent text-default-600 text-sm outline-none"
                          >
                            {TRAFFIC_UNITS.map((unit) => (
                              <option key={unit.key} value={unit.key}>
                                {unit.label}
                              </option>
                            ))}
                          </select>
                        }
                      />
                    </div>
                  </div>

                  {/* 流量类型、IPv4、IPv6 */}
                  <div className="flex flex-row gap-4">
                    <div className="flex items-center gap-2 w-full">
                      <label className="text-sm font-medium text-default-600 whitespace-nowrap">流量类型</label>
                      <Select
                        selectedKeys={formData.trafficType ? [formData.trafficType] : []}
                        onSelectionChange={(keys) => {
                          const newData = { ...formData };
                          const value = Array.from(keys)[0] as string;
                          if (value) {
                            newData.trafficType = value;
                          } else {
                            delete newData.trafficType;
                          }
                          setFormData(newData);
                        }}
                        placeholder="选择流量类型"
                        size="sm"
                        className="flex-1"
                      >
                        {TRAFFIC_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.key}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-default-600 whitespace-nowrap">IPv4</label>
                      <Switch
                        isSelected={formData.IPv4 === '1'}
                        onValueChange={(checked) => {
                          const newData = { ...formData };
                          if (checked) {
                            newData.IPv4 = '1';
                          } else {
                            newData.IPv4 = '0';
                          }
                          setFormData(newData);
                        }}
                        size="sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-default-600 whitespace-nowrap">IPv6</label>
                      <Switch
                        isSelected={formData.IPv6 === '1'}
                        onValueChange={(checked) => {
                          const newData = { ...formData };
                          if (checked) {
                            newData.IPv6 = '1';
                          } else {
                            newData.IPv6 = '0';
                          }
                          setFormData(newData);
                        }}
                        size="sm"
                      />
                    </div>
                  </div>

                  {/* 网络路由 */}
                  <div>
                    <label className="text-sm font-medium text-default-600 mb-2 block">网络路由</label>
                    <Input
                      value={formData.networkRoute || ''}
                      onValueChange={(value) => {
                        const newData = { ...formData };
                        if (value) {
                          newData.networkRoute = value;
                        } else {
                          delete newData.networkRoute;
                        }
                        setFormData(newData);
                      }}
                      placeholder="输入网络路由"
                      size="sm"
                    />
                  </div>

                  {/* 额外信息 */}
                  <div>
                    <label className="text-sm font-medium text-default-600 mb-2 block">额外信息</label>
                    <Input
                      value={formData.extra || ''}
                      onValueChange={(value) => {
                        const newData = { ...formData };
                        if (value) {
                          newData.extra = value;
                        } else {
                          delete newData.extra;
                        }
                        setFormData(newData);
                      }}
                      placeholder="输入额外信息，使用逗号分隔"
                      size="sm"
                    />
                  </div>
                </div>

                {/* 右侧：JSON 编辑器 */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="border border-default-200 rounded-lg overflow-hidden">
                      <Editor
                        height="420px"
                        defaultLanguage="json"
                        value={jsonText}
                        onChange={(value) => handleJsonChange(value || "")}
                        theme="vs-dark"
                        options={{
                          minimap: { enabled: false },
                          fontSize: 13,
                          lineNumbers: "on",
                          formatOnType: true,
                          formatOnPaste: true,
                          tabSize: 2,
                          wordWrap: "on",
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                          bracketPairColorization: { enabled: true },
                          suggest: { showKeywords: false },
                          quickSuggestions: false,
                          parameterHints: { enabled: false },
                          hover: { enabled: false },
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="flex items-center pt-0 justify-between">
              <div className="flex gap-2">
                {jsonError && (
                  <p className="text-danger text-sm">{jsonError}</p>
                )}

                {/* JSON验证提示 */}
                {jsonText && (
                  <div className="text-xs">
                    {(() => {
                      try {
                        if (jsonText.trim() === "") {
                          return (
                            <div className="text-default-500 flex items-center gap-1">
                              <span>•</span>
                              <span>空对象将清除所有标签</span>
                            </div>
                          );
                        }

                        const data = JSON.parse(jsonText.trim());

                        if (Array.isArray(data)) {
                          // 数组格式
                          const validCount = data.filter((tag: any) =>
                            tag && typeof tag === 'object' && tag.key && tag.value
                          ).length;

                          if (validCount === data.length && data.length > 0) {
                            return (
                              <div className="text-success-600 flex items-center gap-1">
                                <span>✓</span>
                                <span>检测到 {validCount} 个标签（数组格式）</span>
                              </div>
                            );
                          } else if (data.length === 0) {
                            return (
                              <div className="text-warning-600 flex items-center gap-1">
                                <span>!</span>
                                <span>空数组，将清除所有标签</span>
                              </div>
                            );
                          } else {
                            return (
                              <div className="text-warning-600 flex items-center gap-1">
                                <span>⚠</span>
                                <span>有效标签：{validCount} / {data.length}</span>
                              </div>
                            );
                          }
                        } else if (typeof data === 'object' && data !== null) {
                          // 对象格式
                          const fieldCount = Object.keys(data).length;

                          if (fieldCount > 0) {
                            return (
                              <div className="text-success-600 flex items-center gap-1">
                                <span>✓</span>
                                <span>检测到 {fieldCount} 个字段（对象格式）</span>
                              </div>
                            );
                          } else {
                            return (
                              <div className="text-warning-600 flex items-center gap-1">
                                <span>!</span>
                                <span>空对象，将清除所有标签</span>
                              </div>
                            );
                          }
                        } else {
                          return (
                            <div className="text-danger-600 flex items-center gap-1">
                              <span>✗</span>
                              <span>必须是 JSON 对象或数组格式</span>
                            </div>
                          );
                        }
                      } catch {
                        return (
                          <div className="text-danger-600 flex items-center gap-1">
                            <span>✗</span>
                            <span>JSON 格式错误</span>
                          </div>
                        );
                      }
                    })()}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  color="default"
                  isDisabled={saving}
                  variant="flat"
                  onPress={onClose}
                >
                  取消
                </Button>
                <Button
                  color="primary"
                  isDisabled={!hasChanges() || !!jsonError}
                  isLoading={saving}
                  startContent={<FontAwesomeIcon icon={faSave} />}
                  onPress={handleSave}
                >
                  保存
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}