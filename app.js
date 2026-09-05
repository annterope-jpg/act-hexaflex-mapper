"use strict";

const welcomeView = document.querySelector("#welcome-view");
const workspaceView = document.querySelector("#workspace-view");
const caseView = document.querySelector("#case-view");
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
  workspaceView.hidden = false;
  document.title = "準備完了 | ACT Hexaflex Mapper";
  workspaceView.querySelector("h1").focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "instant" });
}

function showWelcome() {
  workspaceView.hidden = true;
  caseView.hidden = true;
  welcomeView.hidden = false;
  document.title = "ACT Hexaflex Mapper";
  startButton.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "instant" });
}

function showCaseForm() {
  welcomeView.hidden = true;
  workspaceView.hidden = true;
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
  caseFormStatus.textContent = `「${caseId}」の概要を一時入力として確認しました。端末には保存されていません。`;
}

function clearCaseForm() {
  caseForm.reset();
  caseForm.querySelectorAll("textarea, input").forEach(updateCharacterCount);
  clearCaseIdError();
  caseFormStatus.textContent = "入力内容を消去しました。";
  caseIdInput.focus();
}

agreementCheckbox.addEventListener("change", updateAgreementState);
startButton.addEventListener("click", showWorkspace);
returnButton.addEventListener("click", showWelcome);
caseStartButton.addEventListener("click", showCaseForm);
caseBackButton.addEventListener("click", showWorkspace);
caseForm.addEventListener("submit", handleCaseSubmit);
clearCaseButton.addEventListener("click", clearCaseForm);
caseIdInput.addEventListener("input", clearCaseIdError);
caseForm.querySelectorAll("textarea, input[maxlength]").forEach((field) => {
  field.addEventListener("input", () => updateCharacterCount(field));
  updateCharacterCount(field);
});

updateAgreementState();
