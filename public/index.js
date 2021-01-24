const surveyForm = document.getElementById("survey-form");
const startSurvey = document.getElementById("btn-start-survey");
const previousButton = document.getElementById("btn-back");
const nextButton = document.getElementById("btn-next");
const submitButton = document.getElementById("btn-submit");

const TOTAL_STEPS = 6;
let currentStep = 1;

previousButton.addEventListener("click", goBack);
startSurvey.addEventListener("click", goNext);
nextButton.addEventListener("click", goNext);
// startSurvey.addEventListener("submit", submitForm);

// go back to previous step
function goBack(e) {
  e.preventDefault();
  currentStep -= 1;
  renderStep(currentStep);
}

// go to next step
function goNext(e) {
  e.preventDefault();
  currentStep += 1;
  renderStep(currentStep);
}

const submitForm = async (e) => {
  e.preventDefault();
  let elements = surveyForm.elements;
  let obj = {};

  for (var i = 0; i < elements.length; i++) {
    var item = elements.item(i);
    obj[item.name] = item.value;
  }

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
      currentStep += 1;
      renderStep(currentStep);
    }
  } catch (error) {
    console.error(error);
  }
};

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
  if (currentStep === 1) {
    hideElem(previousButton);
    hideElem(nextButton);
    hideElem(submitButton);
  } else if (currentStep === TOTAL_STEPS - 1) {
    showElem(previousButton);
    hideElem(nextButton);
    showElem(submitButton);
  } else if (currentStep === TOTAL_STEPS) {
    hideElem(previousButton);
    hideElem(nextButton);
    hideElem(submitButton);
  } else {
    showElem(previousButton);
    showElem(nextButton);
    hideElem(submitButton);
  }
}

// ************************
// Util functions
function showElem(elem) {
  elem.classList.remove("hidden");
}

function hideElem(elem) {
  elem.classList.add("hidden");
}
