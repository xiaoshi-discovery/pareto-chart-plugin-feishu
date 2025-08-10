/**
 * 计算时间差并返回各时间单位的倒计时信息
 * @param param0 包含目标时间和时间单位的对象
 * @returns 倒计时信息对象
 */
export function getTime({ target, units }: { target: number; units: { title: string; unit: number; order: number }[] }) {
  // 获取当前时间
  const now = Date.now();
  // 计算时间差（毫秒）
  let diff = Math.max(0, target - now);

  // 对时间单位按order排序
  const sortedUnits = [...units].sort((a, b) => a.order - b.order);

  // 计算每个时间单位的值
  const timeUnits: { unit: number; count: number; title: string }[] = [];

  for (const unitObj of sortedUnits) {
    const { title, unit } = unitObj;
    const count = Math.floor(diff / (unit * 1000));
    diff = diff % (unit * 1000);

    timeUnits.push({ unit, count, title });
  }

  return {
    units: timeUnits,
    total: target - now
  };
}