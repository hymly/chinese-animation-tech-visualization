const DATA = window.PROTOTYPE_DATA;
const MATRIX_DATA = window.technologyMatrixData;

const NODE_COLORS = ["#54d6c7", "#f7c948", "#7aa7ff", "#ff8a65", "#b78cff"];
const RESPONSIBILITY_TASKS = ["构思", "视觉设计", "动画制作", "合成输出", "审核控制"];
const RESPONSIBILITY_FLOW = {
  "节点一": [
    { type: "human", owner: "人主导", detail: "剧本、分镜和动作构思" },
    { type: "human", owner: "人主导", detail: "造型、背景和原画" },
    { type: "human", owner: "人主导", detail: "中间画、描线和上色" },
    { type: "tool", owner: "工具辅助", detail: "摄影台逐格记录" },
    { type: "human", owner: "人主导", detail: "节奏与画面判断" }
  ],
  "节点二": [
    { type: "human", owner: "人主导", detail: "题材、动作和美术构思" },
    { type: "human", owner: "人主导", detail: "水墨、剪纸和木偶造型" },
    { type: "shared", owner: "工艺辅助", detail: "分层、置景和逐格摆拍" },
    { type: "tool", owner: "工具辅助", detail: "摄影、合成和剪辑" },
    { type: "human", owner: "人主导", detail: "媒材与审美控制" }
  ],
  "节点三": [
    { type: "human", owner: "人主导", detail: "剧本、分镜和叙事设计" },
    { type: "shared", owner: "人机共同", detail: "数字绘制与风格设定" },
    { type: "software", owner: "软件处理", detail: "补间、上色和修改" },
    { type: "software", owner: "软件处理", detail: "数字合成与非线性编辑" },
    { type: "human", owner: "人主导", detail: "镜头、风格和流程判断" }
  ],
  "节点四": [
    { type: "human", owner: "人主导", detail: "概念、剧本和导演设计" },
    { type: "shared", owner: "人机共同", detail: "概念设计与三维资产" },
    { type: "software", owner: "管线处理", detail: "建模、绑定和动画协作" },
    { type: "software", owner: "管线处理", detail: "灯光、渲染、特效和合成" },
    { type: "human", owner: "人主导", detail: "美术标准与质量控制" }
  ],
  "节点五": [
    { type: "shared", owner: "人机共同", detail: "剧本草案与分镜预演" },
    { type: "ai", owner: "AI辅助", detail: "角色和场景概念生成" },
    { type: "ai", owner: "AI辅助", detail: "动作与局部素材生成" },
    { type: "ai", owner: "AI辅助", detail: "后期处理与宣发物料" },
    { type: "human", owner: "人主导", detail: "筛选、修正和最终判断" }
  ]
};
const MIGRATION_STEPS = [
  { node: "节点一", top: "人手制作", bottom: "工具记录" },
  { node: "节点二", top: "媒材工艺", bottom: "稳定流程" },
  { node: "节点三", top: "软件处理", bottom: "重复执行" },
  { node: "节点四", top: "工业管线", bottom: "计算协作" },
  { node: "节点五", top: "AI参与", bottom: "生成辅助" }
];
let selectedNode = DATA.timeline[0]?.["节点"] || "节点一";
let selectedCaseFilter = "全部";

function qs(selector, root = document) {
  return root.querySelector(selector);
}

function qsa(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function splitKeywords(value) {
  return String(value || "").split(/[；;]/).map((item) => item.trim()).filter(Boolean);
}

function nodeColor(node) {
  const index = DATA.timeline.findIndex((item) => item["节点"] === node);
  return NODE_COLORS[Math.max(0, index)] || NODE_COLORS[0];
}

function renderKeywordList(value) {
  return '<div class="keyword-list">' + splitKeywords(value).map((item) => '<span>' + escapeHtml(item) + '</span>').join("") + '</div>';
}

function getNodeVisual(nodeId) {
  return DATA.nodeVisuals?.[nodeId];
}

function getCaseVisual(row) {
  return DATA.caseVisuals?.[row["作品名"]];
}

function renderNodeThumb(nodeId) {
  const visual = getNodeVisual(nodeId);
  if (!visual) return "";
  return '<figure class="node-thumb"><img src="' + escapeHtml(visual["图片路径"]) + '" alt="' + escapeHtml(visual["标题"]) + '"></figure>';
}

function renderNodeVisualBlock(nodeId) {
  const visual = getNodeVisual(nodeId);
  if (!visual) return "";
  return '<figure class="node-visual"><img src="' + escapeHtml(visual["图片路径"]) + '" alt="' + escapeHtml(visual["标题"]) + '"><figcaption>' + escapeHtml(visual["图片说明"]) + '</figcaption></figure>';
}

function renderCaseVisual(row) {
  const visual = getCaseVisual(row);
  if (!visual) return "";
  const caption = visual["图片说明"] || visual["来源名称"] || "参考图像";
  return '<figure class="case-visual"><img src="' + escapeHtml(visual["图片路径"]) + '" alt="' + escapeHtml(caption) + '"><figcaption>' + escapeHtml(caption) + '</figcaption></figure>';
}

function getCasesForNode(nodeId) {
  return DATA.cases
    .map((row, index) => ({ ...row, "__caseIndex": index }))
    .filter((row) => row["节点"] === nodeId);
}

function renderCaseThumbImage(row) {
  const visual = getCaseVisual(row);
  if (visual) {
    const caption = visual["图片说明"] || row["作品名"];
    return '<span class="node-case-thumb-image"><img src="' + escapeHtml(visual["图片路径"]) + '" alt="' + escapeHtml(caption) + '"></span>';
  }
  return '<span class="node-case-thumb-image is-placeholder">' + escapeHtml(String(row["作品名"] || "").slice(0, 2)) + '</span>';
}

function renderNodeCaseEntrypoints(nodeId) {
  const rows = getCasesForNode(nodeId);
  if (!rows.length) return "";
  return '<div class="responsibility-case-dock" aria-label="节点代表作品入口">' +
    '<div class="case-dock-copy"><strong>代表作品</strong><span>点击查看案例</span></div>' +
    '<div class="node-case-thumb-row case-dock-thumbs">' +
      rows.map((row) => '<button type="button" class="node-case-thumb ' + specialCaseKind(row) + '" data-case-index="' + row.__caseIndex + '" aria-label="查看' + escapeHtml(row["作品名"]) + '" title="' + escapeHtml(row["作品名"]) + '">' +
        renderCaseThumbImage(row) +
        '<span class="thumb-year">' + escapeHtml(row["年份"]) + '</span>' +
        '<strong>' + escapeHtml(row["作品名"]) + '</strong>' +
        '<em>' + escapeHtml(specialLabel(row)) + '</em>' +
      '</button>').join("") +
    '</div>' +
  '</div>';
}

function openCaseModal(index) {
  const row = DATA.cases[Number(index)];
  const modal = qs("#case-modal");
  const content = qs("#case-modal-content");
  if (!row || !modal || !content) return;
  const kind = specialCaseKind(row);
  content.innerHTML = '<div class="case-modal-layout ' + kind + '">' +
    '<div class="case-modal-visual">' + renderCaseVisual(row) + '</div>' +
    '<div class="case-modal-copy">' +
      '<div class="case-meta"><span class="tag">' + escapeHtml(row["节点"]) + '</span><span class="tag">' + escapeHtml(row["年份"]) + '</span></div>' +
      '<h3 id="case-modal-title">' + escapeHtml(row["作品名"]) + '</h3>' +
      '<p class="case-type">' + escapeHtml(row["案例类型"]) + '</p>' +
      '<p><strong>核心数据：</strong>' + escapeHtml(row["核心数据"]) + '</p>' +
      renderKeywordList(row["技术关键词"]) +
      '<p>' + escapeHtml(row["说明"]) + '</p>' +
      '<span class="badge special-label">' + escapeHtml(specialLabel(row)) + '</span>' +
    '</div>' +
  '</div>';
  modal.hidden = false;
  document.body.classList.add("has-case-modal");
  const closeButton = qs(".case-modal-close", modal);
  if (closeButton) closeButton.focus();
}

function closeCaseModal() {
  const modal = qs("#case-modal");
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove("has-case-modal");
}

function bindCaseEntryButtons(root = document) {
  qsa(".node-case-thumb, .stage-case-thumb", root).forEach((button) => {
    button.addEventListener("click", () => openCaseModal(button.dataset.caseIndex));
  });
}

function bindCaseModalControls() {
  qsa("[data-close-case]").forEach((button) => {
    button.addEventListener("click", closeCaseModal);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeCaseModal();
  });
}

function getNode(nodeId) {
  return DATA.timeline.find((node) => node["节点"] === nodeId) || DATA.timeline[0];
}

function getDetails(nodeId) {
  return DATA.details.filter((item) => item["节点"] === nodeId);
}

function getNodeResponsibility(nodeId) {
  return DATA.nodeResponsibilities?.[nodeId];
}

function getMatrixNode(nodeId) {
  const index = DATA.timeline.findIndex((node) => node["节点"] === nodeId);
  return MATRIX_DATA?.nodes?.[Math.max(0, index)] || MATRIX_DATA?.nodes?.[0];
}

function matrixFirstSentence(value, limit = 44) {
  const sentence = String(value || "现有资料未提供说明").split(/[。；]/)[0];
  return sentence.length > limit ? sentence.slice(0, limit) + "…" : sentence;
}

function renderMatrixScoreTrack(score) {
  const cells = Array.from({ length: 5 }, (_, index) =>
    '<i class="matrix-score-cell ' + (score !== null && index < score ? "is-filled" : "") + '"></i>'
  ).join("");
  return '<div class="matrix-score-track ' + (score === null ? "is-unscored" : "") + '">' + cells + '</div>';
}

function matrixEvidenceClass(status) {
  return String(status || "").includes("核心") ? "is-strong" : "is-pending";
}

function renderMatrixProcessCard(step, index) {
  return '<button type="button" class="matrix-process-card" data-matrix-step="' + index + '">' +
    '<div class="matrix-card-head">' +
      '<span><i>' + String(index + 1).padStart(2, "0") + '</i><strong>' + escapeHtml(step.name) + '</strong></span>' +
      '<em>' + (step.score === null ? "暂未评分" : escapeHtml(step.score + " / 5")) + '</em>' +
    '</div>' +
    renderMatrixScoreTrack(step.score) +
    '<div class="matrix-duty is-tool"><span>技术承担</span><strong>' + escapeHtml(matrixFirstSentence(step.technologyWork)) + '</strong></div>' +
    '<div class="matrix-duty is-human"><span>人工负责</span><strong>' + escapeHtml(matrixFirstSentence(step.humanWork)) + '</strong></div>' +
    '<div class="matrix-card-foot">' +
      '<span class="matrix-evidence ' + matrixEvidenceClass(step.evidenceStatus) + '">' + escapeHtml(step.evidenceStatus) + '</span>' +
      '<span>查看详情 ›</span>' +
    '</div>' +
  '</button>';
}

function renderMatrixTrend(activeId) {
  return '<div class="matrix-trend" aria-label="五阶段平均介入强度">' +
    '<span>平均介入强度</span>' +
    '<div>' + MATRIX_DATA.nodes.map((node) =>
      '<i class="' + (node.id === activeId ? "is-active" : "") + '" style="--trend-color:' + NODE_COLORS[MATRIX_DATA.nodes.indexOf(node)] + ';--trend-height:' + Math.max(14, node.average / 5 * 100) + '%" title="' + escapeHtml(node.id + "：" + node.average.toFixed(2) + "分") + '"><b></b><small>' + escapeHtml(node.id) + '</small></i>'
    ).join("") + '</div>' +
  '</div>';
}

function renderTechnologyMatrixPanel(node) {
  const matrixNode = getMatrixNode(node["节点"]);
  const responsibility = getNodeResponsibility(node["节点"]) || {};
  if (!matrixNode) return renderExpandedNodePanel(node);

  return '<article class="technology-matrix-panel timeline-expanded-node" style="--node-color:' + nodeColor(node["节点"]) + '">' +
    '<div class="matrix-stage-head">' +
      '<div class="matrix-stage-title">' +
        '<span>' + escapeHtml(matrixNode.id) + '</span>' +
        '<div><p class="eyebrow">当前阶段</p><h3>' + escapeHtml(matrixNode.name) + '</h3><p>' + escapeHtml(matrixNode.years) + '</p></div>' +
      '</div>' +
      '<div class="matrix-stage-metrics">' +
        '<div><strong>' + escapeHtml(matrixNode.average.toFixed(2)) + '</strong><span>平均介入强度</span><small>满分5分</small></div>' +
        '<div><strong>' + escapeHtml(Math.round(matrixNode.evidenceCoverage * 100) + "%") + '</strong><span>已有证据覆盖率</span><small>不是技术替代率</small></div>' +
      '</div>' +
    '</div>' +
    '<div class="matrix-context-strip">' +
      '<div class="matrix-context-visual">' + renderNodeVisualBlock(node["节点"]) + '</div>' +
      '<div class="matrix-context-copy">' +
        '<span class="panel-kicker">阶段变化</span>' +
        '<h4>' + escapeHtml(responsibility["短标题"] || node["阶段结论"]) + '</h4>' +
        '<p>' + escapeHtml(node["一句话概括"]) + '</p>' +
        renderKeywordList(node["核心技术关键词"]) +
      '</div>' +
      '<div class="matrix-context-cases">' + renderNodeCaseEntrypoints(node["节点"]) + '</div>' +
    '</div>' +
    '<div class="matrix-grid-head">' +
      '<div><strong>八个制作环节</strong><span>长度表示技术介入强度，不表示替代比例</span></div>' +
      '<span>点击环节查看完整解释与来源</span>' +
    '</div>' +
    '<div class="matrix-process-grid">' + matrixNode.steps.map(renderMatrixProcessCard).join("") + '</div>' +
    '<div class="matrix-panel-footer">' +
      renderMatrixTrend(matrixNode.id) +
      '<p>' + escapeHtml(matrixNode.explanation) + '</p>' +
    '</div>' +
  '</article>';
}

function renderMatrixSources(step) {
  const length = Math.max(step.sourceNames.length, step.sourceUrls.length);
  if (!length) return '<li><span>本条暂未提供公开链接。</span></li>';
  return Array.from({ length }, (_, index) => {
    const name = step.sourceNames[index] || "来源" + (index + 1);
    const url = step.sourceUrls[index] || "";
    return url
      ? '<li><a href="' + escapeHtml(url) + '" target="_blank" rel="noreferrer">' + escapeHtml(name) + '</a></li>'
      : '<li><span>' + escapeHtml(name) + '</span></li>';
  }).join("");
}

function openMatrixDrawer(stepIndex) {
  const matrixNode = getMatrixNode(selectedNode);
  const step = matrixNode?.steps?.[Number(stepIndex)];
  if (!step) return;
  const drawer = qs("#matrix-detail-drawer");
  if (!drawer) return;
  drawer.style.setProperty("--node-color", nodeColor(selectedNode));
  qs("#matrix-drawer-group").textContent = matrixNode.name + " · " + step.group;
  qs("#matrix-drawer-title").textContent = step.name;
  qs("#matrix-drawer-content").innerHTML =
    '<div class="matrix-drawer-score"><strong>' + (step.score === null ? "未评分" : escapeHtml(step.score + " / 5")) + '</strong><span>技术介入强度</span><em class="matrix-evidence ' + matrixEvidenceClass(step.evidenceStatus) + '">' + escapeHtml(step.evidenceStatus) + '</em></div>' +
    '<section><h3>本阶段技术</h3><p>' + escapeHtml(step.technology) + '</p></section>' +
    '<section><h3>技术怎样介入</h3><p>' + escapeHtml(step.intervention) + '</p></section>' +
    '<section class="is-tool"><h3>技术承担</h3><p>' + escapeHtml(step.technologyWork) + '</p></section>' +
    '<section class="is-human"><h3>人工仍需负责</h3><p>' + escapeHtml(step.humanWork) + '</p></section>' +
    '<section><h3>人的工作转向</h3><p>' + escapeHtml(step.humanShift) + '</p></section>' +
    '<section><h3>评分依据</h3><p>' + escapeHtml(step.scoreBasis) + '</p></section>' +
    (step.note ? '<section><h3>研究备注</h3><p>' + escapeHtml(step.note) + '</p></section>' : "") +
    '<section><h3>来源</h3><ul>' + renderMatrixSources(step) + '</ul></section>';
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("matrix-drawer-open");
}

function closeMatrixDrawer() {
  const drawer = qs("#matrix-detail-drawer");
  if (!drawer) return;
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("matrix-drawer-open");
}

function bindMatrixControls(root = document) {
  qsa(".matrix-process-card", root).forEach((button) => {
    button.addEventListener("click", () => openMatrixDrawer(button.dataset.matrixStep));
  });
}

function bindMatrixDrawerControls() {
  qsa("[data-close-matrix-drawer]").forEach((button) => {
    button.addEventListener("click", closeMatrixDrawer);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMatrixDrawer();
  });
}

function renderResponsibilityBand(nodeId) {
  const data = getNodeResponsibility(nodeId);
  if (!data) return "";
  const states = RESPONSIBILITY_FLOW[nodeId] || [];
  const tasks = RESPONSIBILITY_TASKS.map((task, index) => {
    const state = states[index] || { type: "human", owner: "人主导", detail: "" };
    return '<div class="task-transfer-cell ' + escapeHtml(state.type) + '" style="--delay:' + index + '">' +
      '<span class="task-order">' + String(index + 1).padStart(2, "0") + '</span>' +
      '<strong>' + escapeHtml(task) + '</strong>' +
      '<span class="actor-chip">' + escapeHtml(state.owner) + '</span>' +
      '<p>' + escapeHtml(state.detail) + '</p>' +
    '</div>';
  }).join("");
  return '<article class="responsibility-panel responsibility-task-panel" aria-label="五项动画制作任务的责任变化">' +
    '<div class="responsibility-topline">' +
      '<div><span class="panel-kicker">当前阶段的任务分工</span><h4>' + escapeHtml(data["短标题"] || "生产责任变化") + '</h4></div>' +
      '<div class="responsibility-legend" aria-label="颜色图例">' +
        '<span><i class="legend-human"></i>人主导</span>' +
        '<span><i class="legend-shared"></i>共同完成</span>' +
        '<span><i class="legend-tool"></i>技术辅助</span>' +
      '</div>' +
    '</div>' +
    '<div class="responsibility-direction">' +
      '<span>执行劳动逐步交给技术</span><i></i><span>人的重心向判断与控制集中</span>' +
    '</div>' +
    '<div class="task-transfer-track">' + tasks + '</div>' +
    '<div class="responsibility-takeaway">' +
      '<span>阶段判断</span><p>' + escapeHtml(data["阶段结论"]) + '</p>' +
    '</div>' +
    '<p class="responsibility-note">颜色表示任务的主要承担方式，不表示精确比例。</p>' +
  '</article>';
}

function renderMigrationSummary(activeNode) {
  return '<div class="migration-summary" aria-label="五个阶段的责任迁移总览">' +
    '<div class="migration-summary-title"><span>贯穿五个阶段的变化</span><strong>执行逐步技术化，人的工作逐步转向判断</strong></div>' +
    '<div class="migration-step-row">' +
      MIGRATION_STEPS.map((step, index) => '<button type="button" class="migration-step ' + (step.node === activeNode ? "is-active" : "") + '" data-node="' + escapeHtml(step.node) + '" style="--node-color:' + nodeColor(step.node) + '">' +
        '<span>' + String(index + 1).padStart(2, "0") + '</span>' +
        '<strong>' + escapeHtml(step.top) + '</strong>' +
        '<em>' + escapeHtml(step.bottom) + '</em>' +
      '</button>').join("") +
    '</div>' +
  '</div>';
}

function renderInlineDetailPills(nodeId) {
  const keepModules = new Set(["技术核心", "流程变化", "代表作品"]);
  return getDetails(nodeId)
    .filter((row) => keepModules.has(row["模块名称"]))
    .map((row) => '<article class="inline-module-pill">' +
      '<strong>' + escapeHtml(row["模块名称"]) + '</strong>' +
      '<h5>' + escapeHtml(row["标题"]) + '</h5>' +
      '<p>' + escapeHtml(row["正文"]) + '</p>' +
    '</article>').join("");
}

function specialCaseKind(row) {
  const text = [row["作品名"], row["标签"], row["说明"], row["案例类型"]].join(" ");
  if (/Critterz|长片工业实验/.test(text)) return "experimental";
  return "";
}

function specialLabel(row) {
  const kind = specialCaseKind(row);
  if (kind === "experimental") return "AI长片工业实验，尚未市场验证";
  return row["标签"] || "技术阶段案例";
}

function renderTimeline(target, options = {}) {
  const compact = options.compact;
  if (!compact) {
    const activeNode = getNode(selectedNode);
    target.innerHTML = '<div class="timeline-stage">' +
      '<div class="timeline-node-row" aria-label="五个技术节点">' +
        DATA.timeline.map((node) => {
          const active = node["节点"] === selectedNode;
          return '<button type="button" class="timeline-node-tab ' + (active ? "is-active" : "") + '" style="--node-color:' + nodeColor(node["节点"]) + '" data-node="' + escapeHtml(node["节点"]) + '" aria-expanded="' + (active ? "true" : "false") + '">' +
            '<span class="node-index">' + escapeHtml(node["节点"]) + '</span>' +
            '<strong>' + escapeHtml(node["节点名称"]) + '</strong>' +
            '<span class="year">' + escapeHtml(node["年份范围"]) + '</span>' +
          '</button>';
        }).join("") +
      '</div>' +
      renderTechnologyMatrixPanel(activeNode) +
    '</div>';

    qsa(".timeline-node-tab", target).forEach((button) => {
      button.addEventListener("click", () => {
        selectedNode = button.dataset.node;
        renderIndexTimelineState();
      });
    });
    qsa(".migration-step", target).forEach((button) => {
      button.addEventListener("click", () => {
        selectedNode = button.dataset.node;
        renderIndexTimelineState();
      });
    });
    bindMatrixControls(target);
    bindCaseEntryButtons(target);
    return;
  }

  target.innerHTML = DATA.timeline.map((node, index) => {
    const active = node["节点"] === selectedNode || index === 1;
    return '<article class="timeline-card ' + (active ? "is-active" : "") + '" style="--node-color:' + nodeColor(node["节点"]) + '" data-node="' + escapeHtml(node["节点"]) + '">' +
      '<button type="button" class="timeline-card-main" data-node="' + escapeHtml(node["节点"]) + '" aria-expanded="' + (active ? "true" : "false") + '">' +
        renderNodeThumb(node["节点"]) +
        '<span class="node-index">' + escapeHtml(node["节点"]) + '</span>' +
        '<h3>' + escapeHtml(node["节点名称"]) + '</h3>' +
        '<p class="year">' + escapeHtml(node["年份范围"]) + '</p>' +
        '<span class="click-hint">点击展开</span>' +
      '</button>' +
    '</article>';
  }).join("");

  qsa(".timeline-card-main", target).forEach((button) => {
    button.addEventListener("click", () => {
      selectedNode = button.dataset.node;
      renderIndexTimelineState();
    });
  });
}

function renderDetailsMarkup(nodeId, limit) {
  const rows = getDetails(nodeId).slice(0, limit || 99);
  return rows.map((row) => '<article class="detail-card">' +
    '<strong>' + escapeHtml(row["模块名称"]) + '</strong>' +
    '<h3>' + escapeHtml(row["标题"]) + '</h3>' +
    '<p>' + escapeHtml(row["正文"]) + '</p>' +
  '</article>').join("");
}

function renderDetails(target, nodeId, limit) {
  target.innerHTML = renderDetailsMarkup(nodeId, limit);
}

function renderInlineNodeDetails(node) {
  return '<div class="timeline-inline-detail">' +
    '<div class="inline-detail-bridge" aria-hidden="true"></div>' +
    '<div class="inline-detail-shell">' +
      '<div class="inline-visual-column">' +
        renderNodeVisualBlock(node["节点"]) +
        '<div class="inline-detail-copy">' +
        '<p class="eyebrow">节点展开详情</p>' +
        '<h4>' + escapeHtml(node["节点名称"]) + '</h4>' +
        '<p>' + escapeHtml(node["一句话概括"]) + '</p>' +
        renderKeywordList(node["核心技术关键词"]) +
        '<p><strong>代表作品：</strong>' + escapeHtml(node["代表作品"]) + '</p>' +
        '</div>' +
      '</div>' +
      renderResponsibilityBand(node["节点"]) +
    '</div>' +
    '<div class="inline-module-grid">' + renderInlineDetailPills(node["节点"]) + '</div>' +
  '</div>';
}

function renderExpandedNodePanel(node) {
  const responsibility = getNodeResponsibility(node["节点"]) || {};
  return '<article class="timeline-expanded-node" style="--node-color:' + nodeColor(node["节点"]) + '">' +
    '<div class="expanded-node-head">' +
      '<div>' +
      '<p class="eyebrow">当前阶段</p>' +
        '<h3>' + escapeHtml(node["节点名称"]) + '</h3>' +
        '<p class="year">' + escapeHtml(node["年份范围"]) + '</p>' +
      '</div>' +
      '<p>' + escapeHtml(node["一句话概括"]) + '</p>' +
    '</div>' +
    '<div class="node-story-grid">' +
      '<div class="node-media-column">' +
        renderNodeVisualBlock(node["节点"]) +
        '<div class="inline-detail-copy compact-copy">' +
          '<p class="eyebrow">核心技术</p>' +
          renderKeywordList(node["核心技术关键词"]) +
        '</div>' +
      '</div>' +
      renderResponsibilityBand(node["节点"]) +
      '<aside class="node-evidence-rail">' +
        '<div class="stage-conclusion-card"><span>这一阶段发生了什么</span><p>' + escapeHtml(responsibility["短标题"] || node["阶段结论"]) + '</p></div>' +
        renderNodeContextPanel(node["节点"]) +
        renderNodeCaseEntrypoints(node["节点"]) +
      '</aside>' +
    '</div>' +
  '</article>';
}

function getLaborMigration(nodeId) {
  return DATA.laborMigration?.find((row) => row["节点"] === nodeId);
}

function renderMainlineNodeRow(className) {
  return '<div class="' + className + '" aria-label="五个正式技术节点">' +
    DATA.timeline.map((node, index) => {
      const active = node["节点"] === selectedNode;
      return '<button type="button" class="mainline-node-tab ' + (active ? "is-active" : "") + '" style="--node-color:' + nodeColor(node["节点"]) + '" data-mainline-node="' + escapeHtml(node["节点"]) + '" aria-pressed="' + String(active) + '">' +
        '<span>T' + (index + 1) + '</span>' +
        '<strong>' + escapeHtml(node["节点名称"]) + '</strong>' +
        '<em>' + escapeHtml(node["年份范围"]) + '</em>' +
      '</button>';
    }).join("") +
  '</div>';
}

function renderStageCaseStrip(nodeId, compact = false) {
  const rows = getCasesForNode(nodeId);
  if (!rows.length) return "";
  return '<div class="stage-case-strip ' + (compact ? "is-compact" : "") + '">' +
    '<div class="stage-case-strip-title"><strong>代表作品</strong><span>点击缩略图查看案例</span></div>' +
    '<div class="stage-case-thumb-grid">' +
      rows.map((row) => '<button type="button" class="stage-case-thumb ' + specialCaseKind(row) + '" data-case-index="' + row.__caseIndex + '" aria-label="查看' + escapeHtml(row["作品名"]) + '">' +
        renderCaseThumbImage(row) +
        '<span><strong>' + escapeHtml(row["作品名"]) + '</strong><em>' + escapeHtml(row["年份"]) + '</em></span>' +
      '</button>').join("") +
    '</div>' +
  '</div>';
}

function renderParallelPath(nodeId) {
  const row = DATA.parallelPath;
  if (!row || row["关联节点"] !== nodeId) return "";
  return '<aside class="parallel-path-card">' +
    '<img src="' + escapeHtml(row["图片路径"]) + '" alt="《' + escapeHtml(row["作品名"]) + '》相关图片">' +
    '<div><span>' + escapeHtml(row["标签"]) + '</span><h4>' + escapeHtml(row["标题"]) + '</h4><strong>《' + escapeHtml(row["作品名"]) + '》 · ' + escapeHtml(row["年份"]) + '</strong><p>' + escapeHtml(row["说明"]) + '</p></div>' +
  '</aside>';
}

function renderStagePresentationPanel(node) {
  return '<article class="stage-presentation-panel" style="--node-color:' + nodeColor(node["节点"]) + '">' +
    '<header class="stage-presentation-head">' +
      '<div><span>' + escapeHtml(node["节点"]) + '</span><h3>' + escapeHtml(node["节点名称"]) + '</h3><em>' + escapeHtml(node["年份范围"]) + '</em></div>' +
      '<p>' + escapeHtml(node["一句话概括"]) + '</p>' +
    '</header>' +
    '<div class="stage-presentation-grid">' +
      '<div class="stage-media-visual">' + renderNodeVisualBlock(node["节点"]) + '</div>' +
      '<div class="stage-feature-grid">' +
        '<article><span>技术 / 媒介</span><strong>' + escapeHtml(node["技术媒介特征"]) + '</strong><p>' + escapeHtml(node["生产载体"]) + '</p></article>' +
        '<article><span>视觉 / 风格</span><strong>' + escapeHtml(node["视觉风格特征"]) + '</strong><p>' + escapeHtml(node["影像呈现方式"]) + '</p></article>' +
        '<div class="stage-keyword-band"><span>核心关键词</span>' + renderKeywordList(node["核心技术关键词"]) + '</div>' +
      '</div>' +
      renderStageCaseStrip(node["节点"]) +
    '</div>' +
    renderParallelPath(node["节点"]) +
  '</article>';
}

function bindMainlineNodeControls(root) {
  qsa("[data-mainline-node]", root).forEach((button) => {
    button.addEventListener("click", () => {
      selectedNode = button.dataset.mainlineNode;
      renderMainlineState();
    });
  });
}

function renderStageTimeline(target) {
  if (!target) return;
  const node = getNode(selectedNode);
  target.innerHTML = '<div class="stage-story-shell">' +
    renderMainlineNodeRow("mainline-node-row stage-node-row") +
    renderStagePresentationPanel(node) +
  '</div>';
  bindMainlineNodeControls(target);
  bindCaseEntryButtons(target);
}

function renderLaborMigration(target) {
  if (!target || !DATA.laborMigration) return;
  target.innerHTML = '<div class="labor-migration-chart" aria-label="五个阶段的动画劳动迁移总图">' +
    '<div class="labor-migration-axis"><span>具体执行与重复劳动</span><i></i><strong>技术接手范围扩大</strong><i></i><span>判断、协调与控制</span></div>' +
    '<div class="labor-migration-head"><span>阶段</span><span>技术工具</span><span>技术接手的劳动</span><span>人保留的劳动</span><span>人的新工作重心</span></div>' +
    '<div class="labor-migration-rows">' +
      DATA.laborMigration.map((row, index) => {
        const active = row["节点"] === selectedNode;
        return '<article class="labor-migration-row ' + (active ? "is-active" : "") + '" style="--node-color:' + nodeColor(row["节点"]) + '">' +
          '<button type="button" data-mainline-node="' + escapeHtml(row["节点"]) + '"><span>T' + (index + 1) + '</span><strong>' + escapeHtml(row["阶段"]) + '</strong><em>查看该阶段</em></button>' +
          '<div class="migration-cell is-tool"><strong>' + escapeHtml(row["技术工具"]) + '</strong></div>' +
          '<div class="migration-cell is-takeover"><strong>' + escapeHtml(row["技术接手的劳动"]) + '</strong></div>' +
          '<div class="migration-cell is-human"><strong>' + escapeHtml(row["人保留的劳动"]) + '</strong></div>' +
          '<div class="migration-cell is-focus"><strong>' + escapeHtml(row["人的新工作重心"]) + '</strong></div>' +
        '</article>';
      }).join("") +
    '</div>' +
    '<div class="labor-migration-conclusion"><span>主线结论</span><p>技术接手的劳动从记录和拍摄辅助，逐步扩展到软件处理、复杂计算与生成式初稿。人的工作重心逐步转向审美判断、流程协调、风险控制和最终决策。</p></div>' +
  '</div>';
  bindMainlineNodeControls(target);
}

function renderDivisionCaseEvidence(nodeId) {
  const detail = getDetails(nodeId).find((row) => row["模块名称"] === "代表作品");
  return '<div class="division-case-evidence">' +
    '<div><span>代表案例如何体现分工变化</span><p>' + escapeHtml(detail?.["正文"] || getNode(nodeId)["代表作品"]) + '</p></div>' +
    renderStageCaseStrip(nodeId, true) +
  '</div>';
}

function renderDivisionPanel(node) {
  const row = getLaborMigration(node["节点"]);
  if (!row) return "";
  return '<article class="division-panel" style="--node-color:' + nodeColor(node["节点"]) + '">' +
    '<header><div><span>' + escapeHtml(node["节点"]) + '</span><h3>' + escapeHtml(node["节点名称"]) + '</h3><em>' + escapeHtml(node["年份范围"]) + '</em></div><p>' + escapeHtml(row["生产组织变化"]) + '</p></header>' +
    '<div class="division-direction"><span>技术承担扩大</span><i></i><span>人的工作向判断与协同集中</span></div>' +
    '<div class="division-card-grid">' +
      '<article class="is-tool"><span>01 · 技术接手</span><strong>' + escapeHtml(row["技术接手的劳动"]) + '</strong><p>主要工具：' + escapeHtml(row["技术工具"]) + '</p></article>' +
      '<article class="is-human"><span>02 · 人仍负责</span><strong>' + escapeHtml(row["人保留的劳动"]) + '</strong><p>技术参与后，核心创作责任仍需要人工承担。</p></article>' +
      '<article class="is-focus"><span>03 · 人的新重心</span><strong>' + escapeHtml(row["人的新工作重心"]) + '</strong><p>人的价值逐步集中到选择、判断、协调和控制。</p></article>' +
      '<article class="is-organization"><span>04 · 生产组织</span><strong>' + escapeHtml(row["生产组织变化"]) + '</strong></article>' +
    '</div>' +
    renderDivisionCaseEvidence(node["节点"]) +
  '</article>';
}

function renderDivisionTimeline(target) {
  if (!target) return;
  const node = getNode(selectedNode);
  target.innerHTML = '<div class="division-story-shell">' +
    renderMainlineNodeRow("mainline-node-row division-node-row") +
    renderDivisionPanel(node) +
  '</div>';
  bindMainlineNodeControls(target);
  bindCaseEntryButtons(target);
}

function renderMainlineState() {
  renderStageTimeline(qs("#stage-timeline-root"));
  renderLaborMigration(qs("#labor-migration-root"));
  renderDivisionTimeline(qs("#division-timeline-root"));
}

function renderIndexTimelineState() {
  renderMainlineState();
}

function renderFilters() {
  const el = qs("#case-filters");
  if (!el) return;
  const filters = ["全部", ...DATA.timeline.map((node) => node["节点"])];
  el.innerHTML = filters.map((filter) => '<button class="filter-chip ' + (selectedCaseFilter === filter ? "is-active" : "") + '" data-filter="' + escapeHtml(filter) + '">' + escapeHtml(filter === "全部" ? "全部案例" : filter) + '</button>').join("");
  qsa(".filter-chip", el).forEach((button) => {
    button.addEventListener("click", () => {
      selectedCaseFilter = button.dataset.filter;
      renderFilters();
      renderCases();
    });
  });
}

function renderCaseCard(row) {
  const kind = specialCaseKind(row);
  return '<article class="case-card ' + kind + '">' +
    renderCaseVisual(row) +
    '<div class="case-meta"><span class="tag">' + escapeHtml(row["节点"]) + '</span><span class="tag">' + escapeHtml(row["年份"]) + '</span></div>' +
    '<h3>' + escapeHtml(row["作品名"]) + '</h3>' +
    '<p class="case-type">' + escapeHtml(row["案例类型"]) + '</p>' +
    '<p><strong>核心数据：</strong>' + escapeHtml(row["核心数据"]) + '</p>' +
    renderKeywordList(row["技术关键词"]) +
    '<p>' + escapeHtml(row["说明"]) + '</p>' +
    '<span class="badge special-label">' + escapeHtml(specialLabel(row)) + '</span>' +
  '</article>';
}

function renderCases(target = qs("#case-grid"), rows) {
  if (!target) return;
  const list = rows || DATA.cases.filter((row) => selectedCaseFilter === "全部" || row["节点"] === selectedCaseFilter);
  target.innerHTML = list.map(renderCaseCard).join("");
}

function renderMarketChartMarkup(isCompact = false) {
  const data = DATA.marketBridge;
  if (!data) return "";
  const rows = data["票房数据"] || [];
  const maxValue = Math.max(...rows.map((row) => Number(row["国产动画电影年度票房_亿元"]) || 0), 1);
  if (isCompact) {
    return '<div class="box-office-mini">' +
      '<div class="box-office-legend"><span><i class="legend-total"></i>年度票房</span><span><i class="legend-top"></i>TOP1贡献</span></div>' +
      '<div class="box-mini-bars">' +
        rows.map((row) => {
          const total = Number(row["国产动画电影年度票房_亿元"]) || 0;
          const top = Number(row["TOP1票房_亿元"]) || 0;
          const bar = Math.max(8, Math.round(total / maxValue * 100));
          const topShare = total ? Math.round(top / total * 100) : 0;
          return '<div class="box-mini-item" title="' + escapeHtml(row["年份"]) + '年：《' + escapeHtml(row["TOP1"]) + '》约' + top.toFixed(2) + '亿，TOP1约占国产动画' + topShare + '%">' +
            '<div class="box-mini-bar" style="--bar:' + bar + '%; --top:' + topShare + '%"><i></i></div>' +
            '<strong>' + escapeHtml(row["年份"]) + '</strong>' +
            '<span>约' + total.toFixed(1) + '亿</span>' +
          '</div>';
        }).join("") +
      '</div>' +
      '<p class="box-office-note">' + escapeHtml(data["票房口径说明"]) + '</p>' +
    '</div>';
  }
  return '<div class="box-office-chart ' + (isCompact ? "is-compact" : "") + '">' +
    '<div class="box-office-legend"><span><i class="legend-total"></i>国产动画年度票房</span><span><i class="legend-top"></i>TOP1贡献</span><span>年份下方为动画电影票房占比</span></div>' +
    rows.map((row) => {
      const total = Number(row["国产动画电影年度票房_亿元"]) || 0;
      const top = Number(row["TOP1票房_亿元"]) || 0;
      const bar = Math.max(3, Math.round(total / maxValue * 100));
      const topShare = total ? Math.round(top / total * 100) : 0;
      return '<div class="box-office-row">' +
        '<div class="box-year"><strong>' + escapeHtml(row["年份"]) + '</strong><span>' + escapeHtml(row["动画电影票房占比"]) + '</span></div>' +
        '<div class="box-bar-area">' +
          '<div class="box-bar" style="--bar:' + bar + '%; --top:' + topShare + '%">' +
            '<i></i>' +
          '</div>' +
          '<div class="box-topline"><span>TOP1：《' + escapeHtml(row["TOP1"]) + '》</span><em>TOP1约' + top.toFixed(2) + '亿，占国产动画约' + topShare + '%</em></div>' +
        '</div>' +
        '<strong class="box-total">约' + total.toFixed(2) + '亿</strong>' +
      '</div>';
    }).join("") +
    '<p class="box-office-note">' + escapeHtml(data["票房口径说明"]) + '</p>' +
  '</div>';
}

function renderMarketSparkline() {
  const data = DATA.marketBridge;
  if (!data) return "";
  const rows = data["票房数据"] || [];
  const maxValue = Math.max(...rows.map((row) => Number(row["国产动画电影年度票房_亿元"]) || 0), 1);
  return '<div class="market-sparkline" aria-label="关键年份国产动画票房小图">' +
    rows.map((row) => {
      const total = Number(row["国产动画电影年度票房_亿元"]) || 0;
      const top = Number(row["TOP1票房_亿元"]) || 0;
      const height = Math.max(10, Math.round(total / maxValue * 100));
      const topShare = total ? Math.round(top / total * 100) : 0;
      return '<span title="' + escapeHtml(row["年份"]) + '年国产动画约' + total.toFixed(1) + '亿，TOP1约占' + topShare + '%">' +
        '<i style="--height:' + height + '%; --top:' + topShare + '%"></i>' +
        '<em>' + escapeHtml(row["年份"]) + '</em>' +
      '</span>';
    }).join("") +
  '</div>';
}

function renderNodeContextPanel(nodeId) {
  if (nodeId === "节点四") {
    return '<div class="node-context-panel market-context">' +
      '<div><span class="tag">市场反馈背景</span><strong>国产动画票房关键年份</strong></div>' +
      renderMarketSparkline() +
      '<p>票房用于说明院线动画的市场反馈，不单独证明技术进步。</p>' +
    '</div>';
  }
  if (nodeId === "节点五") {
    return '<a class="node-context-panel ai-context" href="#ai">' +
      '<div><span class="tag">流程放大入口</span><strong>继续查看 AI 八环节</strong></div>' +
      '<p>第五节点在下方展开为剧本、分镜、角色、场景、动作、声音、后期和宣发八个环节。</p>' +
    '</a>';
  }
  const earlyMessages = {
    "节点一": ["工具承担记录", "摄影台负责逐格记录，动作设计和绘制仍由人完成。"],
    "节点二": ["工艺稳定媒材", "分层、置景和摄影形成稳定方法，人继续控制造型与媒材效果。"],
    "节点三": ["软件接手重复执行", "补间、上色、修改和合成进入数字流程，人的工作转向设计与控制。"]
  };
  const message = earlyMessages[nodeId] || ["重点看生产方式", "这一阶段主要观察制作任务如何重新分配。"];
  return '<div class="node-context-panel early-context">' +
    '<div><span class="tag">责任变化</span><strong>' + escapeHtml(message[0]) + '</strong></div>' +
    '<p>' + escapeHtml(message[1]) + '</p>' +
  '</div>';
}

function renderScore(score) {
  const value = Number(score) || 0;
  let html = '<div class="score-bar" aria-label="影响程度评分 ' + value + ' 分">';
  for (let i = 1; i <= 5; i += 1) {
    html += '<span class="' + (i <= Math.round(value) ? "is-filled" : "") + '"></span>';
  }
  html += '</div>';
  return html;
}

function compactAiSummary(row) {
  const text = String(row["AI介入方式"] || "");
  const first = text.split(/[，；。;]/)[0] || text;
  return first.length > 24 ? first.slice(0, 24) + "..." : first;
}

function renderAiCard(row, index) {
  const score = Number(row["影响程度评分"]) || 0;
  return '<article class="ai-card" style="--score:' + score + '">' +
    '<button class="ai-card-main" type="button" aria-expanded="false">' +
      '<span class="ai-index">' + String(index + 1).padStart(2, "0") + '</span>' +
      '<span class="ai-title-wrap"><h3>' + escapeHtml(row["制作环节"]) + '</h3><span>' + escapeHtml(compactAiSummary(row)) + '</span></span>' +
      '<span class="ai-score-pill">' + escapeHtml(row["影响程度评分"]) + ' / 5</span>' +
    '</button>' +
    '<div class="ai-status-row"><span class="tag">' + escapeHtml(row["AI是否可介入"]) + '</span>' + renderScore(row["影响程度评分"]) + '</div>' +
    '<div class="ai-detail">' +
      '<button class="ai-detail-close" type="button" aria-label="收起AI环节详情">×</button>' +
      '<p><strong>AI介入方式：</strong>' + escapeHtml(row["AI介入方式"]) + '</p>' +
      '<p><strong>人工仍需负责：</strong>' + escapeHtml(row["人工仍需负责"]) + '</p>' +
      '<p><strong>风险或限制：</strong>' + escapeHtml(row["风险或限制"]) + '</p>' +
      '<p><strong>代表案例：</strong>' + escapeHtml(row["代表案例"]) + '</p>' +
    '</div>' +
  '</article>';
}

function bindAiCards(root = document) {
  qsa(".ai-card-main", root).forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".ai-card");
      const open = !card.classList.contains("is-open");
      qsa(".ai-card", root).forEach((item) => {
        if (item !== card) {
          item.classList.remove("is-open");
          const otherButton = qs(".ai-card-main", item);
          if (otherButton) otherButton.setAttribute("aria-expanded", "false");
        }
      });
      card.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", String(open));
    });
  });
  qsa(".ai-detail-close", root).forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const card = button.closest(".ai-card");
      if (!card) return;
      card.classList.remove("is-open");
      const mainButton = qs(".ai-card-main", card);
      if (mainButton) mainButton.setAttribute("aria-expanded", "false");
    });
  });
}

function renderAi(target = qs("#ai-grid"), rows) {
  if (!target) return;
  target.innerHTML = (rows || DATA.aiMetrics).map(renderAiCard).join("");
  bindAiCards(target);
}

function renderJobSignals(target = qs("#job-signal-root")) {
  if (!target || !DATA.jobSignals) return;
  const data = DATA.jobSignals;
  const keywordMax = Math.max(...data.keywords.map((item) => Number(item["出现次数"]) || 0), 1);

  const keywordBars = data.keywords.slice(0, 10).map((item) => {
    const total = Number(item["出现次数"]) || 0;
    const ai = Number(item["AI岗位出现次数"]) || 0;
    const traditional = Number(item["传统岗位出现次数"]) || 0;
    const aiWidth = total ? Math.round(ai / total * 100) : 0;
    const traditionalWidth = total ? Math.round(traditional / total * 100) : 0;
    return '<div class="job-keyword-row">' +
      '<div class="job-keyword-head"><strong>' + escapeHtml(item["关键词"]) + '</strong><span>' + total + '次</span></div>' +
      '<div class="job-stacked-bar" style="--bar-width:' + Math.round(total / keywordMax * 100) + '%">' +
        '<i class="ai-part" style="width:' + aiWidth + '%"></i>' +
        '<i class="traditional-part" style="width:' + traditionalWidth + '%"></i>' +
      '</div>' +
    '</div>';
  }).join("");

  const comparisons = data.comparisons.map((item) => '<article class="job-compare-card">' +
    '<h3>' + escapeHtml(item["类别"]) + '</h3>' +
    '<div class="keyword-list">' + item["关键词"].map((word) => '<span>' + escapeHtml(word) + '</span>').join("") + '</div>' +
    '<p>' + escapeHtml(item["结论"]) + '</p>' +
  '</article>').join("");

  target.innerHTML = '<div class="job-echo-layout">' +
    '<article class="job-echo-summary">' +
      '<div><p class="eyebrow">小样本旁证</p><h3>' + escapeHtml(data.summary["标题"]) + '</h3><p>' + escapeHtml(data.summary["说明"]) + '</p></div>' +
      '<div class="job-echo-meta"><strong>' + escapeHtml(data.summary["样本数"]) + '</strong><span>条公开岗位样本</span><em>' + escapeHtml(data.summary["采样时间"]) + '</em></div>' +
    '</article>' +
    '<div class="job-echo-grid">' +
      '<article class="job-keyword-panel">' +
        '<div class="job-chart-title"><h3>反复出现的技术能力</h3><span><i class="legend-tool"></i>AI相关岗位 <i class="legend-human"></i>传统岗位</span></div>' +
        keywordBars +
      '</article>' +
      '<div class="job-capability-stack">' + comparisons +
        '<article class="job-human-value"><span>仍然由人承担的能力</span><strong>理解脚本与分镜、筛选画面、修正风格、控制质量、协同管线</strong><p>' + escapeHtml(data.summary["主线结论"]) + '</p></article>' +
      '</div>' +
    '</div>' +
    '<p class="job-caution">' + escapeHtml(data.summary["口径说明"]) + '</p>' +
  '</div>';
}

function renderHome() {
  qs("#home-title").textContent = DATA.home["主标题"];
  qs("#home-subtitle").textContent = DATA.home["副标题"];
  qs("#home-question").textContent = DATA.home["研究问题"];
  qs("#home-conclusion").textContent = DATA.home["核心结论"];
  const origin = qs("#home-origin");
  if (origin) origin.textContent = DATA.home["引子"];
}

function alignInitialHash() {
  if (!window.location.hash) return;
  const target = document.querySelector(window.location.hash);
  if (!target) return;
  const align = () => target.scrollIntoView({ block: "start" });
  requestAnimationFrame(() => requestAnimationFrame(align));
  window.addEventListener("load", align, { once: true });
}

function renderIndexPage() {
  renderHome();
  renderIndexTimelineState();
  renderAi();
  renderJobSignals();
  bindCaseModalControls();
  bindMatrixDrawerControls();
  alignInitialHash();
}

function renderComponentsPage() {
  const hero = qs("#component-hero");
  if (hero) {
    hero.innerHTML = '<p class="eyebrow">首页标题组件</p><h1>' + escapeHtml(DATA.home["主标题"]) + '</h1><p class="subtitle">' + escapeHtml(DATA.home["副标题"]) + '</p><p class="hero-conclusion">' + escapeHtml(DATA.home["研究问题"]) + '</p>';
  }
  const stage = qs("#component-stage");
  if (stage) stage.innerHTML = renderMainlineNodeRow("mainline-node-row") + renderStagePresentationPanel(getNode("节点三"));
  const migration = qs("#component-migration");
  if (migration) renderLaborMigration(migration);
  const division = qs("#component-division");
  if (division) division.innerHTML = renderMainlineNodeRow("mainline-node-row") + renderDivisionPanel(getNode("节点五"));
  const ordinaryCase = DATA.cases.find((row) => row["节点"] === "节点四");
  const digitalCase = DATA.cases.find((row) => /罗小黑战记/.test(row["作品名"]));
  const critterz = DATA.cases.find((row) => /Critterz/.test(row["作品名"]));
  renderCases(qs("#component-cases"), [ordinaryCase, digitalCase, critterz].filter(Boolean));
  renderAi(qs("#component-ai"), DATA.aiMetrics.slice(0, 2));
  bindCaseEntryButtons();
  bindCaseModalControls();
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page === "components") renderComponentsPage();
  else renderIndexPage();
});
