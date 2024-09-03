async function scheduleHtmlProvider(iframeContent = '', frameContent = '', dom = document) {
  await loadTool('AIScheduleTools')
  const ifrs = dom.getElementsByTagName("iframe")
  if (ifrs && ifrs.length > 0) {
    const frame = ifrs[0]
    const schedule = frame.contentDocument.body.getElementsByClassName("curriculum")
    if (schedule && schedule.length > 0) return schedule[0].outerHTML
  }
  await AIScheduleAlert('当前页面获取不到课表！请切换到: 培养方案 > 学生课表查询')
  return ''
}