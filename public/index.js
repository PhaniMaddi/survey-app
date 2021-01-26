// go back to previous step
function goBack(e) {
  e.preventDefault();
  currentStep -= 1;
  updateSearchParam("step", currentStep);
  renderStep(currentStep);
}

// go to next step
function goNext(e) {
  e.preventDefault();
  currentStep += 1;
  updateSearchParam("step", currentStep);
  renderStep(currentStep);
}

// reset survey on API success
function resetSurvey(e) {
  e.preventDefault();
  currentStep = 0;
  updateSearchParam("step", currentStep);
  backupData({});
  surveyData.setSurveyData({});

  // refresh page on success
  window.location.reload();
}

function backupData(data) {
  sessionStorage.setItem("surveyData", JSON.stringify(data));
}

function restoreData() {
  let data = sessionStorage.getItem("surveyData");
  if (data) {
    return JSON.parse(data);
  } else {
    return null;
  }
}

// update formdata object with latest selection
function updateFormFields(e) {
  let key = e.srcElement.name;
  let value = e.srcElement.value;
  surveyData.setEntry(key, value);
  backupData(surveyData.getSurveyData());
}

async function submitForm(e) {
  e.preventDefault();
  let obj = formdata;
  // render thank you page
  goNext(e);

  try {
    const rawResponse = await fetch("/survey", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });

    if (rawResponse.status === 200) {
      resetSurvey(e);
    }
  } catch (error) {
    console.error(error);
  }
}

// display form fields from currentStep
function renderStep(stepNumber) {
  currentStep = stepNumber;

  let stepsToHide = document.getElementsByClassName("step");
  let currentView = document.getElementsByClassName(`step-${currentStep}`);

  for (let i = 0; i < stepsToHide.length; i++) {
    hideElem(stepsToHide[i]);
  }

  for (let i = 0; i < currentView.length; ++i) {
    showElem(currentView[i]);
  }

  // conditional rendering of buttons
  switch (currentStep) {
    case 0:
      hideElem(previousButton);
      hideElem(nextButton);
      hideElem(submitButton);
      break;

    case TOTAL_STEPS - 2:
      showElem(previousButton);
      hideElem(nextButton);
      showElem(submitButton);
      break;

    case TOTAL_STEPS - 1:
      hideElem(previousButton);
      hideElem(nextButton);
      hideElem(submitButton);
      break;

    default:
      showElem(previousButton);
      showElem(nextButton);
      hideElem(submitButton);
      break;
  }
}

class SurveyData {
  constructor() {
    this.formdata = {};
  }

  setEntry(key, value) {
    this.formdata[key] = value;
  }

  getEntry(key) {
    return this.formdata[key];
  }

  getSurveyData() {
    return this.formdata;
  }

  setSurveyData(data) {
    this.formdata = data;
  }
}

// ******************************************
// Util functions
// ******************************************
function showElem(elem) {
  elem.classList.remove("hidden");
}

function hideElem(elem) {
  elem.classList.add("hidden");
}

function updateSearchParam(key, value) {
  if ("URLSearchParams" in window) {
    let searchParams = new URLSearchParams(window.location.search);
    searchParams.set(key, value);
    let newRelativePathQuery =
      window.location.pathname + "?" + searchParams.toString();
    history.pushState(null, "", newRelativePathQuery);
  }
}

function getSearchParam(key) {
  const urlParams = new URLSearchParams(window.location.search);
  const myParam = urlParams.get(key);

  return myParam;
}
