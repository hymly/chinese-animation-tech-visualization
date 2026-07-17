const stageDetails = {
  t1: {
    works: "assets/figma/details-transparent/stage-t1-works.png",
    tech: "assets/figma/details-transparent/stage-t1-tech.png",
    name: "T1 手工逐格与摄影台生产"
  },
  t2: {
    works: "assets/figma/details-transparent/stage-t2-works.png",
    tech: "assets/figma/details-transparent/stage-t2-tech.png",
    name: "T2 手工媒材与美术片工艺"
  },
  t3: {
    works: "assets/figma/details-transparent/stage-t3-works.png",
    tech: "assets/figma/details-transparent/stage-t3-tech.png",
    name: "T3 二维数字动画与无纸化制作"
  },
  t4: {
    works: "assets/figma/details-transparent/stage-t4-works.png",
    tech: "assets/figma/details-transparent/stage-t4-tech.png",
    name: "T4 三维CG与动画工业化"
  },
  t5: {
    works: "assets/figma/details-transparent/stage-t5-works.png",
    tech: "assets/figma/details-transparent/stage-t5-tech.png",
    name: "T5 多模态人工智能与人机协同"
  }
};

const stageArt = {
  works: "assets/figma/components/vintage-note-source.png",
  tech: {
    t1: "assets/figma/components/notebook-t1.png",
    t2: "assets/figma/components/notebook-t2.png",
    t3: "assets/figma/components/notebook-t3.png",
    t4: "assets/figma/components/notebook-t4.png",
    t5: "assets/figma/components/notebook-t5.png"
  }
};

const body = document.body;
const levelButtons = [...document.querySelectorAll("[data-level-target]")];
const stageButtons = [...document.querySelectorAll("[data-stage]")];
const imageDetailButtons = [...document.querySelectorAll("[data-detail-src]")];
const overlay = document.querySelector("#detail-overlay");
const detailImage = document.querySelector("#detail-image");
const closeButton = document.querySelector(".detail-close");
const backdrop = document.querySelector(".detail-backdrop");

let selectedLevel = body.dataset.level === "tech" ? "tech" : "works";
let currentDetail = null;
let lastTrigger = null;
let levelTransitioning = false;

const levelTransitionMs = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 420;

function updateLevelButtons(level) {
  levelButtons.forEach((button) => {
    const active = button.dataset.levelTarget === level;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function renderStageArt(level) {
  stageButtons.forEach((button) => {
    const stage = button.dataset.stage;
    const image = button.querySelector(".stage-card-art img");
    if (!image) return;
    image.src = level === "works" ? stageArt.works : stageArt.tech[stage];
  });

  body.dataset.level = level;
}

function syncOpenStageDetail() {
  if (currentDetail?.kind === "stage" && !overlay.hidden) {
    showStageDetail(currentDetail.stage, false, lastTrigger);
  }
}

function finishLevelTransition(className) {
  body.classList.remove(className, "is-level-transitioning");
  levelTransitioning = false;
  syncOpenStageDetail();
}

function setLevel(level) {
  if (level !== "works" && level !== "tech") return;
  if (level === selectedLevel || levelTransitioning) return;

  const previousLevel = selectedLevel;
  selectedLevel = level;
  updateLevelButtons(level);

  if (levelTransitionMs === 0) {
    renderStageArt(level);
    syncOpenStageDetail();
    return;
  }

  levelTransitioning = true;
  body.classList.add("is-level-transitioning");

  if (previousLevel === "works" && level === "tech") {
    body.classList.add("is-leaving-works");

    window.setTimeout(() => {
      renderStageArt("tech");
      finishLevelTransition("is-leaving-works");
    }, levelTransitionMs);
    return;
  }

  body.classList.add("is-entering-works");
  renderStageArt("works");

  window.setTimeout(() => {
    finishLevelTransition("is-entering-works");
  }, levelTransitionMs);
}

function openDetail(source, alt, moveFocus = true, trigger = null, kind = "image") {
  if (!source) return;

  if (trigger) lastTrigger = trigger;
  detailImage.src = source;
  detailImage.alt = alt || "详情图";
  overlay.dataset.detailKind = kind;
  overlay.hidden = false;
  body.classList.add("detail-open");

  if (moveFocus) closeButton.focus();
}

function showStageDetail(stage, moveFocus = true, trigger = null) {
  const data = stageDetails[stage];
  if (!data) return;

  currentDetail = { kind: "stage", stage };
  const levelName = selectedLevel === "works" ? "代表作品" : "制作技术";
  openDetail(data[selectedLevel], `${data.name}｜${levelName}详情页`, moveFocus, trigger, "stage");
}

function showImageDetail(button) {
  const kind = button.dataset.detailKind || "image";
  currentDetail = { kind };
  openDetail(button.dataset.detailSrc, button.dataset.detailAlt, true, button, kind);
}

function closeDetail() {
  overlay.hidden = true;
  body.classList.remove("detail-open");
  detailImage.removeAttribute("src");
  detailImage.alt = "";
  delete overlay.dataset.detailKind;
  currentDetail = null;

  if (lastTrigger?.isConnected) lastTrigger.focus();
  lastTrigger = null;
}

levelButtons.forEach((button) => {
  button.addEventListener("click", () => setLevel(button.dataset.levelTarget));
});

stageButtons.forEach((button) => {
  button.addEventListener("click", () => showStageDetail(button.dataset.stage, true, button));
});

imageDetailButtons.forEach((button) => {
  button.addEventListener("click", () => showImageDetail(button));
});

closeButton.addEventListener("click", closeDetail);
backdrop.addEventListener("click", closeDetail);

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !overlay.hidden) closeDetail();
});

updateLevelButtons(selectedLevel);
renderStageArt(selectedLevel);
