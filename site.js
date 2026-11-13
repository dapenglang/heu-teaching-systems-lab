const NS = "http://www.w3.org/2000/svg";

function svgEl(name, attributes = {}) {
  const element = document.createElementNS(NS, name);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
}

const graphNodes = [
  { id: "basics", label: "运行环境", x: 360, y: 485, kind: "chapter" },
  { id: "types", label: "数据类型", x: 244, y: 428, kind: "concept" },
  { id: "control", label: "程序控制", x: 470, y: 415, kind: "chapter" },
  { id: "collections", label: "列表字典", x: 170, y: 337, kind: "concept" },
  { id: "count", label: "计数初始化", x: 278, y: 284, kind: "focus" },
  { id: "functions", label: "函数", x: 435, y: 326, kind: "chapter" },
  { id: "exceptions", label: "异常", x: 540, y: 360, kind: "concept" },
  { id: "files", label: "文件读写", x: 585, y: 260, kind: "chapter" },
  { id: "encoding", label: "中文编码", x: 645, y: 175, kind: "concept" },
  { id: "clean", label: "数据清洗", x: 495, y: 177, kind: "chapter" },
  { id: "aggregate", label: "分组聚合", x: 352, y: 140, kind: "concept" },
  { id: "visual", label: "可视化", x: 235, y: 196, kind: "chapter" },
  { id: "verify", label: "结果验证", x: 122, y: 242, kind: "concept" },
  { id: "ai", label: "AI使用", x: 88, y: 132, kind: "concept" },
  { id: "evidence", label: "证据追溯", x: 198, y: 80, kind: "concept" },
];

const graphEdges = [
  ["basics", "types"],
  ["basics", "control"],
  ["types", "collections"],
  ["collections", "count"],
  ["control", "functions"],
  ["control", "exceptions"],
  ["functions", "files"],
  ["files", "encoding"],
  ["files", "clean"],
  ["collections", "verify"],
  ["clean", "aggregate"],
  ["aggregate", "visual"],
  ["visual", "verify"],
  ["exceptions", "verify"],
  ["verify", "ai"],
  ["ai", "evidence"],
];

function drawKnowledgeGraph() {
  const svg = document.querySelector("#knowledge-graph");
  const byId = Object.fromEntries(graphNodes.map((node) => [node.id, node]));
  graphEdges.forEach(([from, to]) => {
    const a = byId[from];
    const b = byId[to];
    svg.append(
      svgEl("line", {
        x1: a.x,
        y1: a.y,
        x2: b.x,
        y2: b.y,
        stroke: "#405164",
        "stroke-width": "1.2",
        opacity: "0.8",
      })
    );
  });
  graphNodes.forEach((node) => {
    const group = svgEl("g", {
      transform: `translate(${node.x} ${node.y})`,
      class: "graph-node",
    });
    const radius = node.kind === "focus" ? 24 : node.kind === "chapter" ? 17 : 13;
    const color =
      node.kind === "focus"
        ? "#efbb64"
        : node.kind === "chapter"
          ? "#71b8f6"
          : "#63d0bd";
    group.append(
      svgEl("circle", {
        r: radius,
        fill: `${color}22`,
        stroke: color,
        "stroke-width": node.kind === "focus" ? 2.2 : 1.5,
      }),
      svgEl("circle", {
        r: 4,
        fill: color,
      })
    );
    const label = svgEl("text", {
      x: 0,
      y: radius + 22,
      "text-anchor": "middle",
      fill: node.kind === "focus" ? "#efbb64" : "#b7c4d2",
      "font-size": node.kind === "focus" ? "14" : "12",
      "font-family": "Songti SC, STSong, SimSun, serif",
    });
    label.textContent = node.label;
    group.append(label);
    svg.append(group);
  });
}

function drawTimeline() {
  const svg = document.querySelector("#timeline-chart");
  const width = 720;
  const height = 440;
  const padding = { left: 54, right: 32, top: 46, bottom: 56 };
  const weeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  const errors = [19, 21, 20, 18, 24, 28, 31, 30, 36, 39, 37, 34, 28, 24];
  const reviews = [63, 66, 68, 71, 69, 65, 63, 61, 56, 58, 61, 65, 68, 72];
  const maxError = Math.max(...errors);
  const xs = (index) =>
    padding.left +
    (index * (width - padding.left - padding.right)) / (weeks.length - 1);
  const yError = (value) =>
    padding.top +
    (height - padding.top - padding.bottom) * (1 - value / maxError);
  const yReview = (value) =>
    padding.top +
    (height - padding.top - padding.bottom) * (1 - value / 100);

  for (let line = 0; line <= 4; line += 1) {
    const y = padding.top + ((height - padding.top - padding.bottom) * line) / 4;
    svg.append(
      svgEl("line", {
        x1: padding.left,
        y1: y,
        x2: width - padding.right,
        y2: y,
        stroke: "#293540",
        "stroke-width": "1",
      })
    );
  }
  const errorPoints = errors.map((value, index) => `${xs(index)},${yError(value)}`).join(" ");
  const reviewPoints = reviews.map((value, index) => `${xs(index)},${yReview(value)}`).join(" ");
  svg.append(
    svgEl("polyline", {
      points: errorPoints,
      fill: "none",
      stroke: "#71b8f6",
      "stroke-width": "3",
      "stroke-linejoin": "round",
    }),
    svgEl("polyline", {
      points: reviewPoints,
      fill: "none",
      stroke: "#63d0bd",
      "stroke-width": "3",
      "stroke-dasharray": "7 6",
      "stroke-linejoin": "round",
    })
  );
  weeks.forEach((week, index) => {
    const x = xs(index);
    svg.append(
      svgEl("circle", {
        cx: x,
        cy: yError(errors[index]),
        r: 4,
        fill: "#71b8f6",
      }),
      svgEl("circle", {
        cx: x,
        cy: yReview(reviews[index]),
        r: 3.5,
        fill: "#63d0bd",
      })
    );
    if (index % 2 === 0 || index === weeks.length - 1) {
      const label = svgEl("text", {
        x,
        y: height - 23,
        "text-anchor": "middle",
        fill: "#8392a3",
        "font-size": "11",
        "font-family": "Times New Roman, serif",
      });
      label.textContent = `W${week}`;
      svg.append(label);
    }
  });
  const errorLabel = svgEl("text", {
    x: padding.left,
    y: 22,
    fill: "#71b8f6",
    "font-size": "12",
    "font-family": "Songti SC, STSong, SimSun, serif",
  });
  errorLabel.textContent = "错误事件";
  const reviewLabel = svgEl("text", {
    x: padding.left + 88,
    y: 22,
    fill: "#63d0bd",
    "font-size": "12",
    "font-family": "Songti SC, STSong, SimSun, serif",
  });
  reviewLabel.textContent = "复核率";
  svg.append(errorLabel, reviewLabel);
}

function initCompare() {
  const slider = document.querySelector("#compare-slider");
  const after = document.querySelector("#compare-after-wrap");
  const line = document.querySelector("#compare-line");
  const update = () => {
    const value = Number(slider.value);
    after.style.width = `${value}%`;
    line.style.left = `${value}%`;
  };
  slider.addEventListener("input", update);
  update();
}

drawKnowledgeGraph();
drawTimeline();
initCompare();

if (window.location.hash) {
  const target = document.querySelector(window.location.hash);
  if (target) {
    requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
  }
}

