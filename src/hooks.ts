import { DashboardState, bitable, dashboard } from "@lark-base-open/js-sdk";
import React from "react";
import { useLayoutEffect, useState } from "react";

function updateTheme(theme: string) {
  document.body.setAttribute('theme-mode', theme);
}

/** 跟随主题色变化 */
export function useTheme() {
  const [bgColor, setBgColor] = useState('#ffffff');
  useLayoutEffect(() => {
    // 使用类型断言解决TypeScript类型检查问题
    const dashboardWithTheme = dashboard as any;

    // 检查dashboard.getTheme是否存在
    if (typeof dashboardWithTheme.getTheme === 'function') {
      dashboardWithTheme.getTheme().then((res: any) => {
        setBgColor(res.chartBgColor || '#ffffff');
        updateTheme(res.theme?.toLocaleLowerCase() || 'light');
      })
    } else {
      // 如果不存在，使用默认主题
      setBgColor('#ffffff');
      updateTheme('light');
      console.warn('dashboard.getTheme is not a function, using default theme');
    }

    // 检查dashboard.onThemeChange是否存在
    if (typeof dashboardWithTheme.onThemeChange === 'function') {
      dashboardWithTheme.onThemeChange((res: any) => {
        setBgColor(res.data?.chartBgColor || '#ffffff');
        updateTheme(res.data?.theme?.toLocaleLowerCase() || 'light');
      })
    }
  }, [])
  return {
    bgColor,
  }
}

/** 初始化、更新config */
export function useConfig(updateConfig: (data: any) => void) {

  const isCreate = dashboard.state === DashboardState.Create
  React.useEffect(() => {
    if (isCreate) {
      return
    }
    // 初始化获取配置
    dashboard.getConfig().then(updateConfig);
  }, []);


  React.useEffect(() => {
    const offConfigChange = dashboard.onConfigChange((r) => {
      // 监听配置变化，协同修改配置
      updateConfig(r.data);
    });
    return () => {
      offConfigChange();
    }
  }, []);
}