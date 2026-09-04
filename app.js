"use strict";

const welcomeView = document.querySelector("#welcome-view");
const workspaceView = document.querySelector("#workspace-view");
const agreementCheckbox = document.querySelector("#agreement-checkbox");
const agreementHelp = document.querySelector("#agreement-help");
const startButton = document.querySelector("#start-button");
const returnButton = document.querySelector("#return-button");
const processGrid = document.querySelector("#process-grid");

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
  workspaceView.hidden = false;
  document.title = "準備完了 | ACT Hexaflex Mapper";
  workspaceView.querySelector("h1").focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "instant" });
}

function showWelcome() {
  workspaceView.hidden = true;
  welcomeView.hidden = false;
  document.title = "ACT Hexaflex Mapper";
  startButton.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "instant" });
}

agreementCheckbox.addEventListener("change", updateAgreementState);
startButton.addEventListener("click", showWorkspace);
returnButton.addEventListener("click", showWelcome);

updateAgreementState();
