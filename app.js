"use strict";

const welcomeView = document.querySelector("#welcome-view");
const workspaceView = document.querySelector("#workspace-view");
const caseView = document.querySelector("#case-view");
const mapView = document.querySelector("#map-view");
const actionView = document.querySelector("#action-view");
const agreementCheckbox = document.querySelector("#agreement-checkbox");
const agreementHelp = document.querySelector("#agreement-help");
const startButton = document.querySelector("#start-button");
const returnButton = document.querySelector("#return-button");
const caseStartButton = document.querySelector("#case-start-button");
const caseBackButton = document.querySelector("#case-back-button");
const processGrid = document.querySelector("#process-grid");
const caseForm = document.querySelector("#case-form");
const caseIdInput = document.querySelector("#case-id");
const caseIdError = document.querySelector("#case-id-error");
const clearCaseButton = document.querySelector("#clear-case-button");
const caseFormStatus = document.querySelector("#case-form-status");
const mapBackButton = document.querySelector("#map-back-button");
const mapProcessNav = document.querySelector("#map-process-nav");
const mappedCount = document.querySelector("#mapped-count");
const mapObservation = document.querySelector("#map-observation");
const mapHypothesis = document.querySelector("#map-hypothesis");
const mapObservationCount = document.querySelector("#map-observation-count");
const mapHypothesisCount = document.querySelector("#map-hypothesis-count");
const relationOptions = document.querySelector("#relation-options");
const clearProcessButton = document.querySelector("#clear-process-button");
const mapStatus = document.querySelector("#map-status");
const actionStartButton = document.querySelector("#action-start-button");
const actionBackButton = document.querySelector("#action-back-button");
const actionForm = document.querySelector("#action-form");
const valuedDirection = document.querySelector("#valued-direction");
const smallAction = document.querySelector("#small-action");
const clearActionButton = document.querySelector("#clear-action-button");
const actionStatus = document.querySelector("#action-status");
const mapDraft = new Map();
let activeProcessId = "acceptance";

function renderProcesses() {
  if (typeof ACT_DATA === "undefined" || !Array.isArray(ACT_DATA.processes)) {
    processGrid.textContent = "プロセス情報を読み込めませんでした。";
    return;
  }

  const fragment = document.createDocumentFragment();

  ACT_DATA.processes.forEach((process, index) => {
    const article = document.createElement("article");
    article.className = "process-card";

    const number = document.createElement("span");
    number.className = "process-number";
    number.textContent = String(index + 1).padStart(2, "0");

    const title = document.createElement("h2");
    title.textContent = process.name;

    const englishName = document.createElement("p");
    englishName.className = "process-en";
    englishName.textContent = process.nameEn;

    const description = document.createElement("p");
    description.className = "process-desc";
    description.textContent = process.shortDesc;

    article.append(number, title, englishName, description);
    fragment.append(article);
  });

  processGrid.replaceChildren(fragment);
}

function updateAgreementState() {
  const agreed = agreementCheckbox.checked;
  startButton.disabled = !agreed;
  agreementHelp.textContent = agreed
    ? "確認済みです。匿名・架空ケースの準備へ進めます。"
    : "確認項目への同意後に進めます。";
}

function showWorkspace() {
  if (!agreementCheckbox.checked) {
    return;
  }

  renderProcesses();
  welcomeView.hidden = true;
  caseView.hidden = true;
  mapView.hidden = true;
  actionView.hidden = true;
  workspaceView.hidden = false;
  document.title = "準備完了 | ACT Hexaflex Mapper";
  workspaceView.querySelector("h1").focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "instant" });
}

function showWelcome() {
  workspaceView.hidden = true;
  caseView.hidden = true;
  mapView.hidden = true;
  actionView.hidden = true;
  welcomeView.hidden = false;
  document.title = "ACT Hexaflex Mapper";
  startButton.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "instant" });
}

function showCaseForm() {
  welcomeView.hidden = true;
  workspaceView.hidden = true;
  mapView.hidden = true;
  actionView.hidden = true;
  caseView.hidden = false;
  document.title = "匿名ケース概要 | ACT Hexaflex Mapper";
  document.querySelector("#case-title").focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "instant" });
}

function updateCharacterCount(field) {
  const counter = document.querySelector(`[data-count-for="${field.id}"]`);
  if (counter) {
    counter.textContent = String(field.value.length);
  }
}

function clearCaseIdError() {
  caseIdInput.removeAttribute("aria-invalid");
  caseIdError.hidden = true;
}

function handleCaseSubmit(event) {
  event.preventDefault();
  const caseId = caseIdInput.value.trim();

  if (!caseId) {
    caseIdInput.setAttribute("aria-invalid", "true");
    caseIdError.hidden = false;
    caseFormStatus.textContent = "入力内容を確認してください。";
    caseIdInput.focus();
    return;
  }

  clearCaseIdError();
  caseFormStatus.textContent = `「${caseId}」の概要を確認しました。マップへ進みます。`;
  showMap();
}

function clearCaseForm() {
  caseForm.reset();
  caseForm.querySelectorAll("textarea, input").forEach(updateCharacterCount);
  clearCaseIdError();
  caseFormStatus.textContent = "入力内容を消去しました。";
  caseIdInput.focus();
}

function getProcessDraft(processId) {
  if (!mapDraft.has(processId)) {
    mapDraft.set(processId, { observation: "", hypothesis: "", relations: [] });
  }
  return mapDraft.get(processId);
}

function updateMapProgress() {
  const completed = ACT_DATA.processes.filter((process) => {
    const draft = getProcessDraft(process.id);
    return draft.observation.trim() || draft.hypothesis.trim();
  }).length;
  mappedCount.textContent = `${completed} / ${ACT_DATA.processes.length}`;

  mapProcessNav.querySelectorAll("button").forEach((button) => {
    const draft = getProcessDraft(button.dataset.processId);
    button.classList.toggle("has-content", Boolean(draft.observation.trim() || draft.hypothesis.trim()));
  });
}

function saveActiveProcess() {
  const draft = getProcessDraft(activeProcessId);
  draft.observation = mapObservation.value;
  draft.hypothesis = mapHypothesis.value;
  draft.relations = Array.from(relationOptions.querySelectorAll("input:checked"), (input) => input.value);
  updateMapProgress();
}

function renderRelationOptions(process) {
  const draft = getProcessDraft(process.id);
  const fragment = document.createDocumentFragment();

  ACT_DATA.processes.filter((item) => item.id !== process.id).forEach((item) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    const text = document.createElement("span");
    input.type = "checkbox";
    input.value = item.id;
    input.checked = draft.relations.includes(item.id);
    input.addEventListener("change", saveActiveProcess);
    text.textContent = item.name;
    label.append(input, text);
    fragment.append(label);
  });
  relationOptions.replaceChildren(fragment);
}

function selectMapProcess(processId) {
  if (activeProcessId && activeProcessId !== processId) saveActiveProcess();
  activeProcessId = processId;
  const process = ACT_DATA.processes.find((item) => item.id === processId);
  const draft = getProcessDraft(processId);
  const index = ACT_DATA.processes.findIndex((item) => item.id === processId);

  document.querySelector("#map-process-number").textContent = String(index + 1).padStart(2, "0");
  document.querySelector("#map-process-en").textContent = process.nameEn;
  document.querySelector("#map-process-title").textContent = process.name;
  document.querySelector("#map-process-description").textContent = process.shortDesc;
  mapObservation.value = draft.observation;
  mapHypothesis.value = draft.hypothesis;
  mapObservationCount.textContent = String(draft.observation.length);
  mapHypothesisCount.textContent = String(draft.hypothesis.length);
  renderRelationOptions(process);
  mapProcessNav.querySelectorAll("button").forEach((button) => {
    const selected = button.dataset.processId === processId;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-current", selected ? "true" : "false");
  });
  mapStatus.textContent = `${process.name}を編集中です。入力は自動的に一時保持されます。`;
}

function renderMapNavigation() {
  if (mapProcessNav.childElementCount) return;
  const fragment = document.createDocumentFragment();
  ACT_DATA.processes.forEach((process, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.processId = process.id;
    button.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span><strong>${process.name}</strong><small>${process.inflexibilityName}</small>`;
    button.addEventListener("click", () => selectMapProcess(process.id));
    fragment.append(button);
  });
  mapProcessNav.append(fragment);
}

function showMap() {
  welcomeView.hidden = true;
  workspaceView.hidden = true;
  caseView.hidden = true;
  mapView.hidden = false;
  actionView.hidden = true;
  renderMapNavigation();
  selectMapProcess(activeProcessId);
  updateMapProgress();
  document.title = "ヘキサフレックス・マップ | ACT Hexaflex Mapper";
  document.querySelector("#map-title").focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "instant" });
}

function clearActiveProcess() {
  mapDraft.set(activeProcessId, { observation: "", hypothesis: "", relations: [] });
  selectMapProcess(activeProcessId);
  updateMapProgress();
  mapStatus.textContent = "このプロセスの入力を消去しました。";
  mapObservation.focus();
}

function showActionPlan() {
  saveActiveProcess();
  welcomeView.hidden = true;
  workspaceView.hidden = true;
  caseView.hidden = true;
  mapView.hidden = true;
  actionView.hidden = false;
  document.title = "価値に沿った行動計画 | ACT Hexaflex Mapper";
  document.querySelector("#action-title").focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "instant" });
}

function setActionFieldError(field, errorId, hasError) {
  field.toggleAttribute("aria-invalid", hasError);
  document.querySelector(errorId).hidden = !hasError;
}

function handleActionSubmit(event) {
  event.preventDefault();
  const missingValue = !valuedDirection.value.trim();
  const missingAction = !smallAction.value.trim();
  setActionFieldError(valuedDirection, "#valued-direction-error", missingValue);
  setActionFieldError(smallAction, "#small-action-error", missingAction);
  if (missingValue || missingAction) {
    actionStatus.textContent = "必須項目を確認してください。";
    (missingValue ? valuedDirection : smallAction).focus();
    return;
  }
  actionStatus.textContent = "価値と小さな一歩を確認しました。入力は端末に保存されていません。";
}

function clearActionPlan() {
  actionForm.reset();
  actionForm.querySelectorAll("textarea[maxlength]").forEach((field) => {
    const counter = document.querySelector(`#${field.id}-count`);
    if (counter) counter.textContent = "0";
  });
  setActionFieldError(valuedDirection, "#valued-direction-error", false);
  setActionFieldError(smallAction, "#small-action-error", false);
  actionStatus.textContent = "行動計画を消去しました。";
  valuedDirection.focus();
}

agreementCheckbox.addEventListener("change", updateAgreementState);
startButton.addEventListener("click", showWorkspace);
returnButton.addEventListener("click", showWelcome);
caseStartButton.addEventListener("click", showCaseForm);
caseBackButton.addEventListener("click", showWorkspace);
caseForm.addEventListener("submit", handleCaseSubmit);
clearCaseButton.addEventListener("click", clearCaseForm);
caseIdInput.addEventListener("input", clearCaseIdError);
mapBackButton.addEventListener("click", showCaseForm);
mapObservation.addEventListener("input", () => {
  mapObservationCount.textContent = String(mapObservation.value.length);
  saveActiveProcess();
});
mapHypothesis.addEventListener("input", () => {
  mapHypothesisCount.textContent = String(mapHypothesis.value.length);
  saveActiveProcess();
});
clearProcessButton.addEventListener("click", clearActiveProcess);
actionStartButton.addEventListener("click", showActionPlan);
actionBackButton.addEventListener("click", showMap);
actionForm.addEventListener("submit", handleActionSubmit);
clearActionButton.addEventListener("click", clearActionPlan);
[valuedDirection, smallAction].forEach((field) => {
  field.addEventListener("input", () => {
    const counter = document.querySelector(`#${field.id}-count`);
    counter.textContent = String(field.value.length);
    field.removeAttribute("aria-invalid");
    document.querySelector(`#${field.id}-error`).hidden = true;
  });
});
caseForm.querySelectorAll("textarea, input[maxlength]").forEach((field) => {
  field.addEventListener("input", () => updateCharacterCount(field));
  updateCharacterCount(field);
});

updateAgreementState();
