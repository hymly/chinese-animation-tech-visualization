window.AI_WORK_TRANSITION_DATA = {
  "study": {
    "title": "Shifting Work Patterns with Generative AI",
    "authors": "Eleanor W. Dillon、Sonia Jaffe、Nicole Immorlica、Christopher T. Stanton",
    "publication": "NBER Working Paper 33795",
    "issueDate": "2025年5月",
    "revisionDate": "2025年11月",
    "firms": 66,
    "workers": 7137,
    "treatedWorkers": 3684,
    "months": 6,
    "scope": "跨行业大型企业知识工作者；工具集成在邮件、会议和文档应用中",
    "measurement": "微软办公软件遥测数据。研究观察时间使用和活动数量，不观察工作内容，也不直接测量产出、质量或绩效。"
  },
  "adoption": [
    { "label": "六个月内至少使用一次", "value": 90, "display": "90%以上", "note": "处理组" },
    { "label": "第4至6个月至少使用一次", "value": 80, "display": "80%", "note": "处理组" },
    { "label": "第4至6个月从未使用", "value": 20, "display": "20%", "note": "处理组" },
    { "label": "第4至6个月每周都使用", "value": 5, "display": "5%", "note": "处理组" },
    { "label": "第4至6个月使用周占比中位数", "value": 33, "display": "33%", "note": "处理组" },
    { "label": "实验初期每周使用率峰值", "value": 55, "display": "55%", "note": "处理组" },
    { "label": "熟悉工具后每周平均使用率", "value": 39, "display": "略低于40%", "note": "第12周后趋于稳定" }
  ],
  "mainOutcomes": [
    { "group": "邮件", "metric": "Outlook使用时间", "unit": "小时/周", "baseline": 11.65, "itt": -1.37, "ittSE": 0.13, "late": -2.03, "lateSE": 0.19, "workers": 6441, "observations": 250145, "significant": true },
    { "group": "邮件", "metric": "Outlook会话次数", "unit": "次/周", "baseline": 31.67, "itt": -3.56, "ittSE": 0.30, "late": -5.30, "lateSE": 0.44, "workers": 6441, "observations": 250145, "significant": true },
    { "group": "邮件", "metric": "无邮件干扰工作时段", "unit": "小时/周", "baseline": 26.18, "itt": 1.48, "ittSE": 0.14, "late": 2.20, "lateSE": 0.21, "workers": 6441, "observations": 250145, "significant": true },
    { "group": "邮件", "metric": "非工作时段Outlook时间", "unit": "小时/周", "baseline": 2.19, "itt": -0.33, "ittSE": 0.038, "late": -0.49, "lateSE": 0.057, "workers": 6441, "observations": 250145, "significant": true },
    { "group": "邮件", "metric": "阅读邮件数", "unit": "封/周", "baseline": 160.83, "itt": -6.69, "ittSE": 1.62, "late": -10.02, "lateSE": 2.43, "workers": 6387, "observations": 223702, "significant": true },
    { "group": "邮件", "metric": "回复的独立邮件线程数", "unit": "个/周", "baseline": 14.51, "itt": -0.16, "ittSE": 0.17, "late": -0.24, "lateSE": 0.25, "workers": 6441, "observations": 267887, "significant": false },
    { "group": "邮件", "metric": "邮件送达至回复时间", "unit": "小时", "baseline": 16.55, "itt": -0.33, "ittSE": 0.17, "late": -0.47, "lateSE": 0.24, "workers": 6432, "observations": 235121, "significant": false },
    { "group": "会议", "metric": "Teams会议时间", "unit": "小时/周", "baseline": 5.22, "itt": 0.10, "ittSE": 0.054, "late": 0.14, "lateSE": 0.076, "workers": 6170, "observations": 155003, "significant": false },
    { "group": "会议", "metric": "参加Teams会议数", "unit": "次/周", "baseline": 9.93, "itt": 0.24, "ittSE": 0.11, "late": 0.34, "lateSE": 0.15, "workers": 6170, "observations": 253723, "significant": false },
    { "group": "会议", "metric": "迟到或早退会议占比", "unit": "百分点", "baseline": 30.65, "itt": 0.019, "ittSE": 0.27, "late": 0.026, "lateSE": 0.37, "workers": 6086, "observations": 128660, "significant": false },
    { "group": "会议", "metric": "周期性Teams会议时间", "unit": "小时/周", "baseline": 2.32, "itt": 0.037, "ittSE": 0.029, "late": 0.052, "lateSE": 0.041, "workers": 6170, "observations": 202314, "significant": false },
    { "group": "文档", "metric": "Word使用时间", "unit": "小时/周", "baseline": 1.63, "itt": 0.14, "ittSE": 0.065, "late": 0.19, "lateSE": 0.089, "workers": 2525, "observations": 104913, "significant": false },
    { "group": "文档", "metric": "文档平均完成时间", "unit": "小时", "baseline": 186.54, "itt": -3.98, "ittSE": 8.96, "late": -5.27, "lateSE": 11.86, "workers": 2521, "observations": 29683, "significant": false },
    { "group": "文档", "metric": "协作文档平均完成时间", "unit": "小时", "baseline": 287.85, "itt": -48.03, "ittSE": 21.50, "late": -60.56, "lateSE": 27.17, "workers": 1763, "observations": 8700, "significant": false },
    { "group": "文档", "metric": "非协作文档平均完成时间", "unit": "小时", "baseline": 158.07, "itt": 0.16, "ittSE": 9.07, "late": 0.22, "lateSE": 12.02, "workers": 2506, "observations": 25252, "significant": false },
    { "group": "文档", "metric": "完成文档数", "unit": "份/周", "baseline": 0.76, "itt": 0.029, "ittSE": 0.025, "late": 0.039, "lateSE": 0.035, "workers": 2525, "observations": 77138, "significant": false },
    { "group": "文档", "metric": "完成协作文档数", "unit": "份/周", "baseline": 0.14, "itt": 0.011, "ittSE": 0.0072, "late": 0.015, "lateSE": 0.0098, "workers": 2525, "observations": 77138, "significant": false },
    { "group": "总体", "metric": "非工作时段软件使用时间", "unit": "小时/周", "baseline": 2.72, "itt": -0.25, "ittSE": 0.050, "late": -0.36, "lateSE": 0.075, "workers": 6304, "observations": 244944, "significant": true }
  ],
  "structuralSignals": [
    { "label": "回复的邮件线程数", "result": "未检测到显著变化", "why": "邮件工作数量大体相近" },
    { "label": "Teams会议时间与数量", "result": "未检测到显著变化", "why": "会议结构没有明显改组" },
    { "label": "Word使用时间", "result": "未检测到显著变化", "why": "文档工作时间没有稳定下降" },
    { "label": "完成文档与协作文档数", "result": "未检测到显著变化", "why": "产出数量没有明确增加" },
    { "label": "任务数量与构成", "result": "论文总体结论：未检测到转移", "why": "个人获得AI工具后，工作系统没有自动重组" }
  ],
  "spillover": {
    "coworkerExposure": 30,
    "significantTeammateMetrics": 1,
    "totalMetrics": 18,
    "highSaturationAverage": 39,
    "note": "同事处理效应列的18个主指标中，仅回复的独立邮件线程数在多重检验调整后显著。高覆盖团队中，同事平均获得工具的比例也只有39%，所以研究可能没有足够条件识别团队层面的变化。"
  },
  "transition": {
    "directFinding": "在这项实验中，AI带来了邮件时间和非工作时段时间的局部节省，但研究没有检测到任务数量或任务构成的明显变化。",
    "inference": "把AI接入原有应用，可以改善部分个人任务。现有流程、岗位边界和协作方式仍需要重新设计，组织层面的生产力潜力才可能继续释放。",
    "boundary": "这项研究没有直接测量产出、质量或绩效。页面据此讨论的是“工作模式变化有限”，不把它写成“AI没有提高生产力”的直接证明。"
  },
  "t6": {
    "id": "T6",
    "name": "AI原生工作流与企业组织重构",
    "years": "未来，尚未定型",
    "question": "什么样的动画生产结构，才能充分发挥AI的生产力？",
    "questions": [
      { "name": "流程重构", "text": "动画流程是否需要围绕生成、筛选、迭代和版本控制重新组织？" },
      { "name": "岗位重构", "text": "哪些执行岗位会转向提示、审核、风格控制和一致性管理？" },
      { "name": "协作重构", "text": "导演、美术、技术和模型之间怎样共享上下文与资产？" },
      { "name": "管理重构", "text": "企业怎样调整预算、排期、权限和跨团队协作方式？" },
      { "name": "责任重构", "text": "版权、质量、偏差和最终决策由谁负责？" }
    ]
  },
  "sources": [
    {
      "name": "Dillon 等：《Shifting Work Patterns with Generative AI》",
      "detail": "NBER Working Paper 33795，2025年5月，2025年11月修订。主结果采用表2；采用率采用第1.2节和图1；同事效应采用表3及正文。",
      "url": "https://www.nber.org/papers/w33795",
      "pdf": "https://www.nber.org/system/files/working_papers/w33795/w33795.pdf",
      "note": "NBER工作论文，用于讨论和评议，尚未经过正式同行评审。"
    },
    {
      "name": "Paul A. David：《The Dynamo and the Computer》",
      "detail": "American Economic Review，1990，80(2)：355-361。用于T6的历史参照。",
      "url": "https://ideas.repec.org/a/aea/aecrev/v80y1990i2p355-61.html",
      "note": "该文讨论通用技术需要互补的组织、技能和流程调整。"
    }
  ]
};
