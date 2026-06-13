const quitStorageKey = 'quikter-local-quit-model';
const absorptionStorageKey = 'quikter-local-absorption-model';
const cravingStorageKey = 'quikter-local-craving-model';
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
  cravingForm: document.querySelector('#cravingForm'),
  cravingNodes: document.querySelector('#cravingNodes'),
  cravingNodeX: document.querySelector('#cravingNodeX'),
  cravingNodeY: document.querySelector('#cravingNodeY'),
  upsertCravingNode: document.querySelector('#upsertCravingNode'),
  resetCravingButton: document.querySelector('#resetCravingButton'),
  resetButton: document.querySelector('#resetButton'),
  streakDays: document.querySelector('#streakDays'),
  moneySaved: document.querySelector('#moneySaved'),
  usesAvoided: document.querySelector('#usesAvoided'),
  nextMilestone: document.querySelector('#nextMilestone'),
  milestoneEta: document.querySelector('#milestoneEta'),
  heroStreak: document.querySelector('#heroStreak'),
  heroSaved: document.querySelector('#heroSaved'),
  heroAvoided: document.querySelector('#heroAvoided'),
  savingsNodes: document.querySelector('#savingsNodes'),
  savingsNodeX: document.querySelector('#savingsNodeX'),
  savingsNodeY: document.querySelector('#savingsNodeY'),
  upsertSavingsNode: document.querySelector('#upsertSavingsNode'),
  savingsChart: document.querySelector('#savingsChart'),
  cravingChart: document.querySelector('#cravingChart'),
  latestCraving: document.querySelector('#latestCraving'),
  averageCraving: document.querySelector('#averageCraving'),
  cravingEntryCount: document.querySelector('#cravingEntryCount'),
  cravingTrend: document.querySelector('#cravingTrend'),
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
  absorptionNodes: document.querySelector('#absorptionNodes'),
  absorptionNodeDate: document.querySelector('#absorptionNodeDate'),
  absorptionNodeHour: document.querySelector('#absorptionNodeHour'),
  absorptionNodeMinute: document.querySelector('#absorptionNodeMinute'),
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
  graphPointModal: document.querySelector('#graphPointModal'),
  graphPointForm: document.querySelector('#graphPointForm'),
  graphPointTitle: document.querySelector('#graphPointTitle'),
  graphPointHint: document.querySelector('#graphPointHint'),
  graphPointDate: document.querySelector('#graphPointDate'),
  graphPointHour: document.querySelector('#graphPointHour'),
  graphPointMinute: document.querySelector('#graphPointMinute'),
  graphPointCountLabel: document.querySelector('#graphPointCountLabel'),
  graphPointCount: document.querySelector('#graphPointCount'),
  closeGraphPointModal: document.querySelector('#closeGraphPointModal'),
  cancelGraphPointModal: document.querySelector('#cancelGraphPointModal'),
};

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const wholeNumber = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const decimalNumber = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });
let currentSubstanceId = 'nicotine';
const chartStates = new WeakMap();
let pendingGraphPoint = null;

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
    savingsNodes: elements.savingsNodes.value,
    updatedAt: new Date().toISOString(),
  };
}

function loadQuitModel() {
  return safeStoredObject(quitStorageKey, {
    habitName: 'Nicotine',
    quitDate: todayISO(),
    savingsNodes: '',
  });
}

function hydrateQuitForm(model) {
  elements.habitName.value = model.habitName;
  elements.quitDate.value = model.quitDate;
  elements.savingsNodes.value = model.savingsNodes || '';
}

function calculateQuitStats(model) {
  const quitTime = new Date(`${model.quitDate}T00:00:00`).getTime();
  const now = new Date();
  const todayTime = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const streak = Math.max(0, Math.floor((todayTime - quitTime) / dayMs));
  const spentPoints = parseGraphNodes(model.savingsNodes);
  const totalSpent = spentPoints.length ? spentPoints[spentPoints.length - 1].y : 0;
  const lastDay = spentPoints.length ? Math.max(1, spentPoints[spentPoints.length - 1].x) : Math.max(1, streak);
  const averageSpent = totalSpent / lastDay;
  const next = milestoneDays.find((day) => day > streak) || streak + 365;
  const remaining = Math.max(0, next - streak);

  return { streak, totalSpent, averageSpent, next, remaining };
}

function updateQuitDashboard(model) {
  const stats = calculateQuitStats(model);

  elements.streakDays.textContent = wholeNumber.format(stats.streak);
  elements.moneySaved.textContent = currency.format(stats.totalSpent);
  elements.usesAvoided.textContent = currency.format(stats.averageSpent);
  elements.nextMilestone.textContent = `${stats.next}d`;
  elements.milestoneEta.textContent = stats.remaining === 0 ? 'today' : `${stats.remaining} days away`;
  elements.heroStreak.textContent = `${wholeNumber.format(stats.streak)} days`;
  elements.heroSaved.textContent = currency.format(stats.totalSpent);
  elements.heroAvoided.textContent = currency.format(stats.averageSpent);

  drawSavingsChart(model, stats.streak);
}

function drawSavingsChart(model, streak) {
  const actualPoints = parseGraphNodes(model.savingsNodes);
  const lastDay = Math.max(1, 90, streak, ...actualPoints.map((point) => point.x));
  const totalSpent = actualPoints.length ? actualPoints[actualPoints.length - 1].y : 0;
  const lastSpendDay = actualPoints.length ? Math.max(1, actualPoints[actualPoints.length - 1].x) : 1;
  const averagePerDay = totalSpent / lastSpendDay;
  const averagePoints = [
    { x: 0, y: 0 },
    { x: lastDay, y: lastDay * averagePerDay },
  ];
  const points = actualPoints.length ? actualPoints : [{ x: 0, y: 0 }];

  drawLineChart(elements.savingsChart, points, {
    lineColor: '#1368ff',
    fillColor: 'rgba(19, 104, 255, 0.08)',
    xLabelStart: '0d',
    xLabelEnd: `${wholeNumber.format(lastDay)}d`,
    yLabelStart: '$0',
    yLabelEnd: currency.format(Math.max(1, totalSpent, lastDay * averagePerDay)),
    markerX: actualPoints.length ? actualPoints[actualPoints.length - 1].x : 0,
    customPoints: actualPoints,
    secondaryPoints: averagePoints,
    secondaryColor: '#15a46b',
  });
}

function loadCravingModel() {
  return safeStoredObject(cravingStorageKey, { cravingNodes: '' });
}

function getCravingModelFromForm() {
  return { cravingNodes: elements.cravingNodes.value, updatedAt: new Date().toISOString() };
}

function hydrateCravingForm(model) {
  elements.cravingNodes.value = model.cravingNodes || '';
}

function updateCravingDashboard(model) {
  const points = parseGraphNodes(model.cravingNodes).map((point) => ({ x: point.x, y: Math.min(10, point.y) }));
  const latest = points.length ? points[points.length - 1].y : 0;
  const average = points.length ? points.reduce((sum, point) => sum + point.y, 0) / points.length : 0;
  const first = points.length ? points[0].y : latest;

  elements.latestCraving.textContent = decimalNumber.format(latest);
  elements.averageCraving.textContent = decimalNumber.format(average);
  elements.cravingEntryCount.textContent = wholeNumber.format(points.length);
  elements.cravingTrend.textContent = points.length < 2 ? '—' : (latest <= first ? 'Down' : 'Up');

  drawLineChart(elements.cravingChart, points.length ? points : [{ x: 0, y: 0 }], {
    lineColor: '#7c3aed',
    fillColor: 'rgba(124, 58, 237, 0.1)',
    xLabelStart: '0d',
    xLabelEnd: `${wholeNumber.format(Math.max(1, ...points.map((point) => point.x)))}d`,
    yLabelStart: '0',
    yLabelEnd: '10',
    markerX: points.length ? points[points.length - 1].x : 0,
    customPoints: points,
    fixedYMax: 10,
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

function zeroAbsorptionModel(substanceId) {
  const preset = substancePresets.find((substance) => substance.id === substanceId) || substancePresets[0];
  return {
    substanceId: preset.id,
    customSubstance: '',
    halfLifeHours: preset.halfLifeHours,
    doseAmount: 0,
    doseUnit: preset.unit,
    usageTime: nowLocalDateTime(),
    timeZoneMode: 'local',
    inhalationMinutes: 0,
    holdSeconds: 0,
    absorptionNodes: '',
  };
}

function loadAbsorptionStore() {
  try {
    const stored = JSON.parse(localStorage.getItem(absorptionStorageKey));
    return stored?.substances ? stored : { substances: {} };
  } catch {
    return { substances: {} };
  }
}

function saveAbsorptionModel(model) {
  const store = loadAbsorptionStore();
  store.substances = { ...store.substances, [model.substanceId]: model };
  localStorage.setItem(absorptionStorageKey, JSON.stringify(store));
}

function loadAbsorptionModel(substanceId = currentSubstanceId) {
  const store = loadAbsorptionStore();
  return store.substances?.[substanceId] || zeroAbsorptionModel(substanceId);
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
  elements.absorptionNodes.value = model.absorptionNodes || '';
  elements.absorptionNodeDate.value = (model.usageTime || nowLocalDateTime()).slice(0, 10);
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

function amountAtHourForDose(hour, model, doseAmount) {
  if (hour < 0) return 0;
  const absorptionWindowHours = Math.max(0.01, model.inhalationMinutes / 60 + model.holdSeconds / 3600);
  const absorbedFraction = Math.min(1, Math.max(0, hour / absorptionWindowHours));
  const absorbedAmount = doseAmount * absorbedFraction;
  const eliminationHours = Math.max(0, hour - absorptionWindowHours / 2);
  return absorbedAmount * Math.pow(0.5, eliminationHours / model.halfLifeHours);
}

function absorptionNodePoints(model) {
  return parseGraphNodes(model.absorptionNodes);
}

function amountAtHour(hour, model) {
  const baseAmount = amountAtHourForDose(hour, model, model.doseAmount);
  return absorptionNodePoints(model).reduce((total, instance) => (
    total + amountAtHourForDose(hour - instance.x, model, instance.y)
  ), baseAmount);
}

function absorptionSeries(model) {
  const lastInstanceHour = Math.max(0, ...absorptionNodePoints(model).map((point) => point.x));
  const visibleHours = Math.max(24, Math.ceil(lastInstanceHour + model.halfLifeHours * 6));
  const pointCount = 145;
  return Array.from({ length: pointCount }, (_, index) => {
    const hour = (visibleHours / (pointCount - 1)) * index;
    return { x: hour, y: amountAtHour(hour, model) };
  });
}

function updateAbsorptionDashboard(model) {
  const series = absorptionSeries(model);
  const nodePoints = absorptionNodePoints(model);
  const peak = series.reduce((highest, point) => (point.y > highest.y ? point : highest), series[0]);
  const remaining24 = amountAtHour(24, model);
  const clearanceHours = model.halfLifeHours * Math.log2(20);
  const lastInstanceHour = Math.max(0, ...absorptionNodePoints(model).map((point) => point.x));
  const visibleHours = Math.max(24, Math.ceil(lastInstanceHour + model.halfLifeHours * 6));
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
    customPoints: nodePoints,
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

function upsertAbsorptionNodeFromDateTime() {
  const dateValue = elements.absorptionNodeDate.value || (elements.usageTime.value || nowLocalDateTime()).slice(0, 10);
  const hour = Number(elements.absorptionNodeHour.value);
  const minute = Number(elements.absorptionNodeMinute.value);
  const amount = Number(elements.absorptionNodeY.value);
  if (!dateValue || !Number.isFinite(hour) || !Number.isFinite(minute) || !Number.isFinite(amount)) return false;

  const nodeDate = new Date(`${dateValue}T${String(Math.max(0, Math.min(23, hour))).padStart(2, '0')}:${String(Math.max(0, Math.min(59, minute))).padStart(2, '0')}:00`);
  const startDate = usageDate(getAbsorptionModelFromForm());
  const hourOffset = Math.max(0, (nodeDate.getTime() - startDate.getTime()) / (60 * 60 * 1000));
  elements.absorptionNodeDate.value = dateValue;
  const didUpdate = upsertGraphNode(elements.absorptionNodes, { value: hourOffset }, elements.absorptionNodeY);
  if (didUpdate) {
    elements.absorptionNodeHour.value = '';
    elements.absorptionNodeMinute.value = '';
  }
  return didUpdate;
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
  const allXPoints = [...points, ...(config.secondaryPoints || [])];
  const xMax = Math.max(...allXPoints.map((point) => point.x), 1);
  const allYPoints = [...points, ...(config.secondaryPoints || [])];
  const yMax = config.fixedYMax || Math.max(...allYPoints.map((point) => point.y), 1);
  chartStates.set(canvas, { padding, xMax, yMax });

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

  if (config.secondaryPoints?.length) {
    ctx.beginPath();
    config.secondaryPoints.forEach((point, index) => {
      const x = padding + (point.x / xMax) * (width - padding * 2);
      const y = height - padding - (point.y / yMax) * (height - padding * 2);
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = config.secondaryColor || '#15a46b';
    ctx.lineWidth = 4;
    ctx.stroke();
  }

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

function pointFromCanvasClick(canvas, event, options = {}) {
  const state = chartStates.get(canvas);
  if (!state) return null;

  const rect = canvas.getBoundingClientRect();
  const canvasX = ((event.clientX - rect.left) / rect.width) * canvas.width;
  const canvasY = ((event.clientY - rect.top) / rect.height) * canvas.height;
  const plotWidth = canvas.width - state.padding * 2;
  const plotHeight = canvas.height - state.padding * 2;
  const xRatio = Math.min(1, Math.max(0, (canvasX - state.padding) / plotWidth));
  const yRatio = Math.min(1, Math.max(0, (canvas.height - state.padding - canvasY) / plotHeight));
  const x = Number((xRatio * state.xMax).toFixed(options.xPrecision ?? 2));
  const rawY = yRatio * state.yMax;
  const yMax = options.yMax ?? state.yMax;
  const y = Number(Math.min(yMax, Math.max(0, rawY)).toFixed(options.yPrecision ?? 2));
  return { x, y };
}

function addPointToTextareaFromCanvas(canvas, textarea, event, options = {}) {
  const point = pointFromCanvasClick(canvas, event, options);
  if (!point) return false;
  const nodes = parseGraphNodes(textarea.value);
  nodes.push(point);
  textarea.value = formatGraphNodes(nodes.sort((a, b) => a.x - b.x));
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
  return true;
}

function syncAbsorptionDateFieldsFromHourOffset(hourOffset) {
  const startDate = usageDate(getAbsorptionModelFromForm());
  const nodeDate = new Date(startDate.getTime() + hourOffset * 60 * 60 * 1000);
  elements.absorptionNodeDate.value = new Date(nodeDate.getTime() - nodeDate.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  elements.absorptionNodeHour.value = nodeDate.getHours();
  elements.absorptionNodeMinute.value = nodeDate.getMinutes();
}

function localDateInputValue(date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function dateFromParts(dateValue, hourValue, minuteValue) {
  const hour = Math.max(0, Math.min(23, Number(hourValue) || 0));
  const minute = Math.max(0, Math.min(59, Number(minuteValue) || 0));
  return new Date(`${dateValue}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`);
}

function daysBetweenDates(date, baseDateValue) {
  const baseDate = new Date(`${baseDateValue}T00:00:00`);
  return Math.max(0, (date.getTime() - baseDate.getTime()) / dayMs);
}

function openGraphPointModal(kind, canvas, event) {
  const point = pointFromCanvasClick(canvas, event, {
    xPrecision: kind === 'absorption' ? 2 : 1,
    yPrecision: kind === 'craving' ? 1 : 2,
    yMax: kind === 'craving' ? 10 : undefined,
  });
  if (!point) return;

  const now = new Date();
  pendingGraphPoint = { kind, point };
  elements.graphPointTitle.textContent = `Add ${kind} point`;
  elements.graphPointCountLabel.textContent = kind === 'money' ? 'Money spent' : kind === 'craving' ? 'Craving count' : 'Usage count';
  elements.graphPointHint.textContent = kind === 'absorption'
    ? 'Pick the usage date/time and amount for this absorption node.'
    : 'Pick the date/time and count for this graph point.';

  if (kind === 'absorption') {
    const startDate = usageDate(getAbsorptionModelFromForm());
    const date = new Date(startDate.getTime() + point.x * 60 * 60 * 1000);
    elements.graphPointDate.value = localDateInputValue(date);
    elements.graphPointHour.value = date.getHours();
    elements.graphPointMinute.value = date.getMinutes();
  } else {
    const baseDate = getQuitModelFromForm().quitDate || todayISO();
    const date = new Date(new Date(`${baseDate}T00:00:00`).getTime() + point.x * dayMs);
    elements.graphPointDate.value = localDateInputValue(date);
    elements.graphPointHour.value = date.getHours();
    elements.graphPointMinute.value = date.getMinutes();
  }

  elements.graphPointCount.value = point.y;
  elements.graphPointModal.hidden = false;
  elements.graphPointCount.focus();
}

function closeGraphPointModal() {
  pendingGraphPoint = null;
  elements.graphPointModal.hidden = true;
}

function submitGraphPoint() {
  if (!pendingGraphPoint) return false;
  const date = dateFromParts(elements.graphPointDate.value, elements.graphPointHour.value, elements.graphPointMinute.value);
  const count = Math.max(0, Number(elements.graphPointCount.value) || 0);

  if (pendingGraphPoint.kind === 'money') {
    const x = daysBetweenDates(date, getQuitModelFromForm().quitDate || todayISO());
    upsertGraphNode(elements.savingsNodes, { value: x }, { value: count });
  } else if (pendingGraphPoint.kind === 'craving') {
    const x = daysBetweenDates(date, getQuitModelFromForm().quitDate || todayISO());
    upsertGraphNode(elements.cravingNodes, { value: x }, { value: Math.min(10, count) });
  } else {
    const startDate = usageDate(getAbsorptionModelFromForm());
    const x = Math.max(0, (date.getTime() - startDate.getTime()) / (60 * 60 * 1000));
    upsertGraphNode(elements.absorptionNodes, { value: x }, { value: count });
    syncAbsorptionDateFieldsFromHourOffset(x);
    elements.absorptionNodeY.value = count;
  }

  closeGraphPointModal();
  return true;
}

function start() {
  populateSubstanceOptions();

  const quitModel = loadQuitModel();
  hydrateQuitForm(quitModel);
  updateQuitDashboard(quitModel);

  const cravingModel = loadCravingModel();
  hydrateCravingForm(cravingModel);
  updateCravingDashboard(cravingModel);

  currentSubstanceId = elements.substanceSelect.value || currentSubstanceId;
  const absorptionModel = loadAbsorptionModel(currentSubstanceId);
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
    updateQuitDashboard(nextModel);
  });

  elements.upsertSavingsNode.addEventListener('click', () => {
    upsertGraphNode(elements.savingsNodes, elements.savingsNodeX, elements.savingsNodeY);
  });

  elements.savingsChart.addEventListener('click', (event) => {
    openGraphPointModal('money', elements.savingsChart, event);
  });

  elements.resetButton.addEventListener('click', () => {
    localStorage.removeItem(quitStorageKey);
    const resetModel = loadQuitModel();
    hydrateQuitForm(resetModel);
    updateQuitDashboard(resetModel);
  });

  elements.cravingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const nextModel = getCravingModelFromForm();
    localStorage.setItem(cravingStorageKey, JSON.stringify(nextModel));
    updateCravingDashboard(nextModel);
  });

  elements.cravingForm.addEventListener('input', () => {
    updateCravingDashboard(getCravingModelFromForm());
  });

  elements.upsertCravingNode.addEventListener('click', () => {
    upsertGraphNode(elements.cravingNodes, elements.cravingNodeX, elements.cravingNodeY);
  });

  elements.cravingChart.addEventListener('click', (event) => {
    openGraphPointModal('craving', elements.cravingChart, event);
  });

  elements.resetCravingButton.addEventListener('click', () => {
    localStorage.removeItem(cravingStorageKey);
    const resetModel = loadCravingModel();
    hydrateCravingForm(resetModel);
    updateCravingDashboard(resetModel);
  });

  elements.substanceSelect.addEventListener('change', () => {
    saveAbsorptionModel(getAbsorptionModelFromForm());
    currentSubstanceId = elements.substanceSelect.value;
    const nextModel = loadAbsorptionModel(currentSubstanceId);
    hydrateAbsorptionForm(nextModel);
    updateAbsorptionDashboard(nextModel);
  });

  elements.absorptionForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const nextModel = getAbsorptionModelFromForm();
    saveAbsorptionModel(nextModel);
    updateAbsorptionDashboard(nextModel);
  });

  elements.absorptionForm.addEventListener('input', () => {
    const nextModel = getAbsorptionModelFromForm();
    saveAbsorptionModel(nextModel);
    updateAbsorptionDashboard(nextModel);
  });


  elements.upsertAbsorptionNode.addEventListener('click', () => {
    upsertAbsorptionNodeFromDateTime();
  });

  elements.absorptionChart.addEventListener('click', (event) => {
    openGraphPointModal('absorption', elements.absorptionChart, event);
  });

  elements.graphPointForm.addEventListener('submit', (event) => {
    event.preventDefault();
    submitGraphPoint();
  });

  elements.closeGraphPointModal.addEventListener('click', closeGraphPointModal);
  elements.cancelGraphPointModal.addEventListener('click', closeGraphPointModal);
  elements.graphPointModal.addEventListener('click', (event) => {
    if (event.target === elements.graphPointModal) closeGraphPointModal();
  });

  elements.resetAbsorptionButton.addEventListener('click', () => {
    const store = loadAbsorptionStore();
    delete store.substances[currentSubstanceId];
    localStorage.setItem(absorptionStorageKey, JSON.stringify(store));
    const resetModel = loadAbsorptionModel(currentSubstanceId);
    hydrateAbsorptionForm(resetModel);
    updateAbsorptionDashboard(resetModel);
  });
}

start();
