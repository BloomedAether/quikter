const quitStorageKey = 'quikter-local-quit-model';
const absorptionStorageKey = 'quikter-local-absorption-model';
const dayMs = 24 * 60 * 60 * 1000;
const milestoneDays = [1, 3, 7, 14, 30, 60, 90, 180, 365, 730, 1000];

const substancePresets = [
  { id: 'nicotine', name: 'Nicotine', halfLifeHours: 2, unit: 'mg', defaultDose: 10, absorptionMinutes: 5, holdSeconds: 3 },
  { id: 'caffeine', name: 'Caffeine', halfLifeHours: 5, unit: 'mg', defaultDose: 95, absorptionMinutes: 45, holdSeconds: 0 },
  { id: 'alcohol', name: 'Alcohol', halfLifeHours: 4.5, unit: 'standard drinks', defaultDose: 1, absorptionMinutes: 60, holdSeconds: 0 },
  { id: 'thc', name: 'THC', halfLifeHours: 30, unit: 'mg', defaultDose: 5, absorptionMinutes: 10, holdSeconds: 3 },
  { id: 'cbd', name: 'CBD', halfLifeHours: 24, unit: 'mg', defaultDose: 25, absorptionMinutes: 90, holdSeconds: 0 },
  { id: 'cocaine', name: 'Cocaine', halfLifeHours: 1, unit: 'mg', defaultDose: 20, absorptionMinutes: 8, holdSeconds: 0 },
  { id: 'amphetamine', name: 'Amphetamine', halfLifeHours: 11, unit: 'mg', defaultDose: 10, absorptionMinutes: 60, holdSeconds: 0 },
  { id: 'diazepam', name: 'Diazepam', halfLifeHours: 40, unit: 'mg', defaultDose: 5, absorptionMinutes: 60, holdSeconds: 0 },
  { id: 'methamphetamine', name: 'Methamphetamine', halfLifeHours: 10, unit: 'mg', defaultDose: 5, absorptionMinutes: 20, holdSeconds: 0 },
  { id: 'morphine', name: 'Morphine', halfLifeHours: 3, unit: 'mg', defaultDose: 10, absorptionMinutes: 30, holdSeconds: 0 },
  { id: 'oxycodone', name: 'Oxycodone', halfLifeHours: 3.5, unit: 'mg', defaultDose: 5, absorptionMinutes: 60, holdSeconds: 0 },
  { id: 'fentanyl', name: 'Fentanyl', halfLifeHours: 7, unit: 'mcg', defaultDose: 50, absorptionMinutes: 10, holdSeconds: 0 },
  { id: 'ketamine', name: 'Ketamine', halfLifeHours: 2.5, unit: 'mg', defaultDose: 25, absorptionMinutes: 15, holdSeconds: 0 },
  { id: 'psilocybin', name: 'Psilocybin', halfLifeHours: 2.5, unit: 'mg', defaultDose: 10, absorptionMinutes: 45, holdSeconds: 0 },
  { id: 'custom', name: 'Custom substance', halfLifeHours: 2, unit: 'mg', defaultDose: 10, absorptionMinutes: 15, holdSeconds: 0 },
];

const elements = {
  quitForm: document.querySelector('#quitForm'),
  habitName: document.querySelector('#habitName'),
  quitDate: document.querySelector('#quitDate'),
  dailyCost: document.querySelector('#dailyCost'),
  dailyUses: document.querySelector('#dailyUses'),
  craving: document.querySelector('#craving'),
  cravingValue: document.querySelector('#cravingValue'),
  resetButton: document.querySelector('#resetButton'),
  streakDays: document.querySelector('#streakDays'),
  moneySaved: document.querySelector('#moneySaved'),
  usesAvoided: document.querySelector('#usesAvoided'),
  nextMilestone: document.querySelector('#nextMilestone'),
  milestoneEta: document.querySelector('#milestoneEta'),
  heroStreak: document.querySelector('#heroStreak'),
  heroSaved: document.querySelector('#heroSaved'),
  heroAvoided: document.querySelector('#heroAvoided'),
  savingsGraphMode: document.querySelector('#savingsGraphMode'),
  savingsNodes: document.querySelector('#savingsNodes'),
  savingsNodeX: document.querySelector('#savingsNodeX'),
  savingsNodeY: document.querySelector('#savingsNodeY'),
  upsertSavingsNode: document.querySelector('#upsertSavingsNode'),
  savingsChart: document.querySelector('#savingsChart'),
  absorptionForm: document.querySelector('#absorptionForm'),
  substanceSelect: document.querySelector('#substanceSelect'),
  customSubstance: document.querySelector('#customSubstance'),
  halfLife: document.querySelector('#halfLife'),
  doseAmount: document.querySelector('#doseAmount'),
  doseUnit: document.querySelector('#doseUnit'),
  usageTime: document.querySelector('#usageTime'),
  timeZoneMode: document.querySelector('#timeZoneMode'),
  inhalationMinutes: document.querySelector('#inhalationMinutes'),
  holdSeconds: document.querySelector('#holdSeconds'),
  absorptionGraphMode: document.querySelector('#absorptionGraphMode'),
  absorptionNodes: document.querySelector('#absorptionNodes'),
  absorptionNodeX: document.querySelector('#absorptionNodeX'),
  absorptionNodeY: document.querySelector('#absorptionNodeY'),
  upsertAbsorptionNode: document.querySelector('#upsertAbsorptionNode'),
  resetAbsorptionButton: document.querySelector('#resetAbsorptionButton'),
  substanceName: document.querySelector('#substanceName'),
  halfLifeLabel: document.querySelector('#halfLifeLabel'),
  peakAmount: document.querySelector('#peakAmount'),
  peakEta: document.querySelector('#peakEta'),
  remainingAmount: document.querySelector('#remainingAmount'),
  clearanceTime: document.querySelector('#clearanceTime'),
  absorptionWindowLabel: document.querySelector('#absorptionWindowLabel'),
  usageTimeContext: document.querySelector('#usageTimeContext'),
  absorptionChart: document.querySelector('#absorptionChart'),
};

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const wholeNumber = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const decimalNumber = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function nowLocalDateTime() {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 16);
}

function safeStoredObject(key, fallback) {
  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(key)) };
  } catch {
    return fallback;
  }
}

function getQuitModelFromForm() {
  return {
    habitName: elements.habitName.value.trim() || 'Habit',
    quitDate: elements.quitDate.value || todayISO(),
    dailyCost: Math.max(0, Number(elements.dailyCost.value) || 0),
    dailyUses: Math.max(0, Number(elements.dailyUses.value) || 0),
    craving: Math.max(0, Number(elements.craving.value) || 0),
    savingsGraphMode: elements.savingsGraphMode.value,
    savingsNodes: elements.savingsNodes.value,
    updatedAt: new Date().toISOString(),
  };
}

function loadQuitModel() {
  return safeStoredObject(quitStorageKey, {
    habitName: 'Nicotine',
    quitDate: todayISO(),
    dailyCost: 12,
    dailyUses: 20,
    craving: 4,
    savingsGraphMode: 'model',
    savingsNodes: '',
  });
}

function hydrateQuitForm(model) {
  elements.habitName.value = model.habitName;
  elements.quitDate.value = model.quitDate;
  elements.dailyCost.value = model.dailyCost;
  elements.dailyUses.value = model.dailyUses;
  elements.craving.value = model.craving;
  elements.cravingValue.textContent = model.craving;
  elements.savingsGraphMode.value = model.savingsGraphMode || 'model';
  elements.savingsNodes.value = model.savingsNodes || '';
}

function calculateQuitStats(model) {
  const quitTime = new Date(`${model.quitDate}T00:00:00`).getTime();
  const now = new Date();
  const todayTime = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const streak = Math.max(0, Math.floor((todayTime - quitTime) / dayMs));
  const savings = streak * model.dailyCost;
  const avoided = streak * model.dailyUses;
  const next = milestoneDays.find((day) => day > streak) || streak + 365;
  const remaining = Math.max(0, next - streak);

  return { streak, savings, avoided, next, remaining };
}

function updateQuitDashboard(model) {
  const stats = calculateQuitStats(model);

  elements.streakDays.textContent = wholeNumber.format(stats.streak);
  elements.moneySaved.textContent = currency.format(stats.savings);
  elements.usesAvoided.textContent = wholeNumber.format(stats.avoided);
  elements.nextMilestone.textContent = `${stats.next}d`;
  elements.milestoneEta.textContent = stats.remaining === 0 ? 'today' : `${stats.remaining} days away`;
  elements.heroStreak.textContent = `${wholeNumber.format(stats.streak)} days`;
  elements.heroSaved.textContent = currency.format(stats.savings);
  elements.heroAvoided.textContent = wholeNumber.format(stats.avoided);

  drawSavingsChart(model, stats.streak);
}

function drawSavingsChart(model, streak) {
  const modelPoints = Array.from({ length: 91 }, (_, day) => ({ x: day, y: day * model.dailyCost }));
  const customPoints = parseGraphNodes(model.savingsNodes);
  const points = pointsForMode(model.savingsGraphMode, modelPoints, customPoints);
  drawLineChart(elements.savingsChart, points, {
    lineColor: '#1368ff',
    fillColor: 'rgba(19, 104, 255, 0.08)',
    xLabelStart: '0d',
    xLabelEnd: '90d',
    yLabelStart: '$0',
    yLabelEnd: currency.format(Math.max(1, 90 * model.dailyCost)),
    markerX: Math.min(Math.max(...points.map((point) => point.x), 90), streak),
    customPoints,
  });
}

function populateSubstanceOptions() {
  elements.substanceSelect.innerHTML = substancePresets
    .map((substance) => `<option value="${substance.id}">${substance.name}</option>`)
    .join('');
}

function selectedPreset() {
  return substancePresets.find((preset) => preset.id === elements.substanceSelect.value) || substancePresets[0];
}

function loadAbsorptionModel() {
  return safeStoredObject(absorptionStorageKey, {
    substanceId: 'nicotine',
    customSubstance: '',
    halfLifeHours: 2,
    doseAmount: 10,
    doseUnit: 'mg',
    usageTime: nowLocalDateTime(),
    timeZoneMode: 'local',
    inhalationMinutes: 5,
    holdSeconds: 3,
  });
}

function getAbsorptionModelFromForm() {
  const preset = selectedPreset();
  return {
    substanceId: preset.id,
    customSubstance: elements.customSubstance.value.trim(),
    halfLifeHours: Math.max(0.05, Number(elements.halfLife.value) || preset.halfLifeHours),
    doseAmount: Math.max(0, Number(elements.doseAmount.value) || 0),
    doseUnit: elements.doseUnit.value.trim() || preset.unit,
    usageTime: elements.usageTime.value || nowLocalDateTime(),
    timeZoneMode: elements.timeZoneMode.value,
    inhalationMinutes: Math.max(0, Number(elements.inhalationMinutes.value) || 0),
    holdSeconds: Math.max(0, Number(elements.holdSeconds.value) || 0),
    absorptionGraphMode: elements.absorptionGraphMode.value,
    absorptionNodes: elements.absorptionNodes.value,
    updatedAt: new Date().toISOString(),
  };
}

function hydrateAbsorptionForm(model) {
  elements.substanceSelect.value = model.substanceId;
  elements.customSubstance.value = model.customSubstance;
  elements.halfLife.value = model.halfLifeHours;
  elements.doseAmount.value = model.doseAmount;
  elements.doseUnit.value = model.doseUnit;
  elements.usageTime.value = model.usageTime;
  elements.timeZoneMode.value = model.timeZoneMode || 'local';
  elements.inhalationMinutes.value = model.inhalationMinutes;
  elements.holdSeconds.value = model.holdSeconds;
  elements.absorptionGraphMode.value = model.absorptionGraphMode || 'model';
  elements.absorptionNodes.value = model.absorptionNodes || '';
}

function applyPresetToAbsorptionForm() {
  const preset = selectedPreset();
  elements.halfLife.value = preset.halfLifeHours;
  elements.doseAmount.value = preset.defaultDose;
  elements.doseUnit.value = preset.unit;
  elements.inhalationMinutes.value = preset.absorptionMinutes;
  elements.holdSeconds.value = preset.holdSeconds;
  if (preset.id !== 'custom') elements.customSubstance.value = '';
}

function substanceDisplayName(model) {
  const preset = substancePresets.find((substance) => substance.id === model.substanceId) || substancePresets[0];
  return model.substanceId === 'custom' && model.customSubstance ? model.customSubstance : preset.name;
}

function amountAtHour(hour, model) {
  const absorptionWindowHours = Math.max(0.01, model.inhalationMinutes / 60 + model.holdSeconds / 3600);
  const absorbedFraction = Math.min(1, Math.max(0, hour / absorptionWindowHours));
  const absorbedAmount = model.doseAmount * absorbedFraction;
  const eliminationHours = Math.max(0, hour - absorptionWindowHours / 2);
  return absorbedAmount * Math.pow(0.5, eliminationHours / model.halfLifeHours);
}

function absorptionSeries(model) {
  const visibleHours = Math.max(24, Math.ceil(model.halfLifeHours * 6));
  const pointCount = 145;
  return Array.from({ length: pointCount }, (_, index) => {
    const hour = (visibleHours / (pointCount - 1)) * index;
    return { x: hour, y: amountAtHour(hour, model) };
  });
}

function updateAbsorptionDashboard(model) {
  const modelSeries = absorptionSeries(model);
  const customPoints = parseGraphNodes(model.absorptionNodes);
  const series = pointsForMode(model.absorptionGraphMode, modelSeries, customPoints);
  const peak = series.reduce((highest, point) => (point.y > highest.y ? point : highest), series[0]);
  const remaining24 = amountAtHour(24, model);
  const clearanceHours = model.halfLifeHours * Math.log2(20);
  const visibleHours = Math.max(24, Math.ceil(model.halfLifeHours * 6));
  const unit = model.doseUnit;

  elements.substanceName.textContent = substanceDisplayName(model);
  elements.halfLifeLabel.textContent = `${decimalNumber.format(model.halfLifeHours)}h half-life`;
  elements.peakAmount.textContent = `${decimalNumber.format(peak.y)} ${unit}`;
  elements.peakEta.textContent = `around ${decimalNumber.format(peak.x)}h`;
  elements.remainingAmount.textContent = `${decimalNumber.format(remaining24)} ${unit}`;
  elements.clearanceTime.textContent = `${decimalNumber.format(clearanceHours)}h`;
  elements.absorptionWindowLabel.textContent = `${visibleHours} hour view`;
  elements.usageTimeContext.textContent = formatUsageTimeContext(model);

  drawLineChart(elements.absorptionChart, series, {
    lineColor: '#0c43b8',
    fillColor: 'rgba(47, 199, 255, 0.16)',
    xLabelStart: '0h',
    xLabelEnd: `${visibleHours}h`,
    yLabelStart: `0 ${unit}`,
    yLabelEnd: `${decimalNumber.format(Math.max(...series.map((point) => point.y)))} ${unit}`,
    markerX: peak.x,
    customPoints,
  });
}

function parseGraphNodes(rawNodes) {
  return (rawNodes || '')
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(/[,	 ]+/).map(Number))
    .filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y) && x >= 0 && y >= 0)
    .map(([x, y]) => ({ x, y }))
    .sort((a, b) => a.x - b.x);
}

function pointsForMode(mode, modelPoints, customPoints) {
  if (mode === 'nodes' && customPoints.length) return customPoints;
  if (mode === 'combined' && customPoints.length) {
    return [...modelPoints, ...customPoints].sort((a, b) => a.x - b.x);
  }
  return modelPoints;
}

function formatGraphNodes(nodes) {
  return nodes.map((point) => `${Number(point.x.toFixed(4))}, ${Number(point.y.toFixed(4))}`).join('\n');
}

function upsertGraphNode(textarea, xInput, yInput) {
  const x = Number(xInput.value);
  const y = Number(yInput.value);
  if (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || y < 0) return false;

  const nodes = parseGraphNodes(textarea.value);
  const existingIndex = nodes.findIndex((point) => Math.abs(point.x - x) < 0.0001);
  if (existingIndex >= 0) nodes[existingIndex] = { x, y };
  else nodes.push({ x, y });

  textarea.value = formatGraphNodes(nodes.sort((a, b) => a.x - b.x));
  xInput.value = '';
  yInput.value = '';
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
  return true;
}

function usageDate(model) {
  return model.usageTime ? new Date(model.usageTime) : new Date();
}

function formatUsageTimeContext(model) {
  const date = usageDate(model);
  const timeZone = model.timeZoneMode === 'utc' ? 'UTC' : Intl.DateTimeFormat().resolvedOptions().timeZone;
  const label = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
    timeZoneName: 'short',
  }).format(date);
  return `Usage starts ${label}; graph hours are relative to that day and timezone.`;
}

function drawLineChart(canvas, points, config) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const padding = 48;
  const xMax = Math.max(...points.map((point) => point.x), 1);
  const yMax = Math.max(...points.map((point) => point.y), 1);

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = '#d9e7fb';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i += 1) {
    const y = padding + ((height - padding * 2) / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  ctx.beginPath();
  points.forEach((point, index) => {
    const x = padding + (point.x / xMax) * (width - padding * 2);
    const y = height - padding - (point.y / yMax) * (height - padding * 2);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.lineTo(width - padding, height - padding);
  ctx.lineTo(padding, height - padding);
  ctx.closePath();
  ctx.fillStyle = config.fillColor;
  ctx.fill();

  ctx.beginPath();
  points.forEach((point, index) => {
    const x = padding + (point.x / xMax) * (width - padding * 2);
    const y = height - padding - (point.y / yMax) * (height - padding * 2);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = config.lineColor;
  ctx.lineWidth = 4;
  ctx.stroke();

  if (config.customPoints?.length) {
    ctx.fillStyle = '#0c43b8';
    config.customPoints.forEach((point) => {
      const x = padding + (point.x / xMax) * (width - padding * 2);
      const y = height - padding - (point.y / yMax) * (height - padding * 2);
      ctx.fillRect(x - 5, y - 5, 10, 10);
    });
  }

  const markerPoint = points.reduce((closest, point) => (
    Math.abs(point.x - config.markerX) < Math.abs(closest.x - config.markerX) ? point : closest
  ), points[0]);
  const markerX = padding + (markerPoint.x / xMax) * (width - padding * 2);
  const markerY = height - padding - (markerPoint.y / yMax) * (height - padding * 2);
  ctx.fillStyle = '#2fc7ff';
  ctx.beginPath();
  ctx.arc(markerX, markerY, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#5c6f8f';
  ctx.font = '600 16px Inter, sans-serif';
  ctx.fillText(config.yLabelStart, 12, height - padding + 5);
  ctx.fillText(config.yLabelEnd, 12, padding + 5);
  ctx.fillText(config.xLabelStart, padding - 12, height - 14);
  ctx.fillText(config.xLabelEnd, width - padding - 46, height - 14);
}

function start() {
  populateSubstanceOptions();

  const quitModel = loadQuitModel();
  hydrateQuitForm(quitModel);
  updateQuitDashboard(quitModel);

  const absorptionModel = loadAbsorptionModel();
  hydrateAbsorptionForm(absorptionModel);
  updateAbsorptionDashboard(absorptionModel);

  elements.quitForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const nextModel = getQuitModelFromForm();
    localStorage.setItem(quitStorageKey, JSON.stringify(nextModel));
    updateQuitDashboard(nextModel);
  });

  elements.quitForm.addEventListener('input', () => {
    const nextModel = getQuitModelFromForm();
    elements.cravingValue.textContent = nextModel.craving;
    updateQuitDashboard(nextModel);
  });

  elements.upsertSavingsNode.addEventListener('click', () => {
    upsertGraphNode(elements.savingsNodes, elements.savingsNodeX, elements.savingsNodeY);
  });

  elements.resetButton.addEventListener('click', () => {
    localStorage.removeItem(quitStorageKey);
    const resetModel = loadQuitModel();
    hydrateQuitForm(resetModel);
    updateQuitDashboard(resetModel);
  });

  elements.substanceSelect.addEventListener('change', () => {
    applyPresetToAbsorptionForm();
    updateAbsorptionDashboard(getAbsorptionModelFromForm());
  });

  elements.absorptionForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const nextModel = getAbsorptionModelFromForm();
    localStorage.setItem(absorptionStorageKey, JSON.stringify(nextModel));
    updateAbsorptionDashboard(nextModel);
  });

  elements.absorptionForm.addEventListener('input', () => {
    updateAbsorptionDashboard(getAbsorptionModelFromForm());
  });

  elements.upsertAbsorptionNode.addEventListener('click', () => {
    upsertGraphNode(elements.absorptionNodes, elements.absorptionNodeX, elements.absorptionNodeY);
  });

  elements.resetAbsorptionButton.addEventListener('click', () => {
    localStorage.removeItem(absorptionStorageKey);
    const resetModel = loadAbsorptionModel();
    hydrateAbsorptionForm(resetModel);
    updateAbsorptionDashboard(resetModel);
  });
}

start();
