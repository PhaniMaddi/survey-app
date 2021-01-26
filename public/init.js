const payload = {
  questions: [
    {
      type: "rating",
      key: "delivery-rating",
      question: "How do you rate the delivery experience?",
      options: [
        {
          text: "Great",
          value: 10,
        },
        {
          text: "Not So Great",
          value: 5,
        },
        {
          text: "Awful",
          value: 0,
        },
      ],
    },
    {
      type: "rating",
      key: "freshness-rating",
      question: "How do you rate the Freshness of the fruits?",
      options: [
        {
          text: "Great",
          value: 10,
        },
        {
          text: "Not So Great",
          value: 5,
        },
        {
          text: "Awful",
          value: 0,
        },
      ],
    },
    {
      type: "boolean",
      key: "satisfaction-rating",
      question: "Would you order again?",
      options: [
        {
          text: "Yes, Definitely.",
          value: true,
        },
        {
          text: "No, Never again.",
          value: false,
        },
      ],
    },
    {
      type: "text",
      key: "survey-comments",
      question: "Any comments?",
      value: "",
      options: [],
    },
  ],
};

const surveyForm = document.getElementById("survey-form");
const startSurvey = document.getElementById("btn-start-survey");
const previousButton = document.getElementById("btn-back");
const nextButton = document.getElementById("btn-next");
const submitButton = document.getElementById("btn-submit");

/**
 * Event listeners
 */
previousButton.addEventListener("click", goBack);
nextButton.addEventListener("click", goNext);
startSurvey.addEventListener("click", goNext);
submitButton.addEventListener("click", submitForm);

// includes intro and thank you page
const TOTAL_STEPS = payload.questions.length + 2;
let currentStep = Number(getSearchParam("step")) || 0;
let surveyData = new SurveyData();
let formdata = surveyData.getSurveyData();
let storedData = sessionStorage.getItem("surveyData");

// start on DOMContentLoaded
document.addEventListener("DOMContentLoaded", function (event) {
  // persist default selections to sessionStorage
  function persistDefaultSelections(questions) {
    let surveyData = {};
    questions.forEach((question) => {
      if (question.options.length > 0) {
        surveyData[question.key] = question.options[0].text;
      } else {
        surveyData[question.key] = question.value;
      }
    });

    sessionStorage.setItem("surveyData", JSON.stringify(surveyData));
  }

  if (!storedData || Object.keys(storedData).length === 0) {
    persistDefaultSelections(payload.questions);
  } else {
    formdata = restoreData();
    surveyData.setSurveyData(formdata);
  }

  (function renderQuestions() {
    let formFieldsHtml = ``;

    payload.questions.forEach((question, index) => {
      switch (question.type) {
        case "rating": {
          let ratingsHtml = ``;
          let checked = false;

          question.options.forEach((opt, idx) => {
            // making default/ restoring selections
            if (formdata.hasOwnProperty(question.key)) {
              checked = formdata[question.key] === opt.text;
            } else {
              checked = idx === 0;
            }

            ratingsHtml += `
            <div class="tab">
              <input type="radio" id="${idx}-${question.key}" 
                name="${question.key}" value="${opt.text}" 
                ${checked ? "checked" : ""}>
              <label for="${idx}-${question.key}">${opt.text}</label><br>
            </div>
            `;
          });

          formFieldsHtml += `
          <fieldset class="survey-page-${index + 1} step step-${
            index + 1
          } hidden">
            <h4 class="question">${question.question}</h4>
            <div class="tabs styled-radio">
              ${ratingsHtml}
            </div>
          </fieldset>
          `;

          break;
        }
        case "boolean": {
          let checked = false;
          let optionsHtml = ``;
          question.options.forEach((opt, idx) => {
            // making default/ restoring selections
            if (formdata.hasOwnProperty(question.key)) {
              checked = formdata[question.key] === opt.text;
            } else {
              checked = idx === 0;
            }

            optionsHtml += `
            <div class="radio-block">
              <input type="radio" id="${idx}-${question.key}" 
              name="${question.key}" value="${opt.text}" 
              ${checked ? "checked" : ""}>
              <label for="${idx}-${question.key}">${opt.text}</label><br>
            </div>
          `;
          });

          formFieldsHtml += `
          <fieldset class="survey-page-${index + 1} step step-${
            index + 1
          } hidden">
            <h4 class="question">${question.question}</h4>

            ${optionsHtml}
          </fieldset>
          `;
          break;
        }
        case "text": {
          formFieldsHtml += `
            <fieldset class="survey-page-${index + 1} step step-${
            index + 1
          } hidden">
              <h4 class="question">${question.question}</h4>
              <textarea name="${question.key}" id="${question.key}" 
                cols="30" rows="10"></textarea>
            </fieldset>
          `;

          break;
        }

        default:
          break;
      }
    });

    // append dunamic forms
    document.getElementById("survey-form").innerHTML = formFieldsHtml;
    document
      .getElementById("thankyou-page")
      .classList.add(`step-${TOTAL_STEPS - 1}`);

    // attaching event handlers to dynamic forms
    const inputCollection = document.querySelectorAll("input");
    const textCollection = document.querySelectorAll("textarea");
    for (let i = 0; i < inputCollection.length; i++) {
      inputCollection[i].addEventListener("change", updateFormFields);
    }

    for (let i = 0; i < textCollection.length; i++) {
      textCollection[i].addEventListener("change", updateFormFields);
    }

    // initial render
    renderStep(currentStep);
  })();
});
