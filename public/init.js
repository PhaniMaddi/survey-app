const payload = {
  questions: [
    {
      type: "rating",
      question: "How do you rate the delivery experience?",
      options: [
        {
          text: "Great",
          points: 10,
        },
        {
          text: "Not So Great",
          points: 5,
        },
        {
          text: "Awful",
          points: 0,
        },
      ],
    },
    {
      type: "rating",
      question: "How do you rate the Freshness of the fruits?",
      options: [
        {
          text: "Great",
          points: 10,
        },
        {
          text: "Not So Great",
          points: 5,
        },
        {
          text: "Awful",
          points: 0,
        },
      ],
    },
    {
      type: "boolean",
      question: "Would you order again?",
      options: [
        {
          text: "Yes, Definitely.",
          points: true,
        },
        {
          text: "No, Never again.",
          points: false,
        },
        {
          text: "Awful",
          points: 0,
        },
      ],
    },
    {
      type: "text",
      question: "Any comments?",
    },
  ],
};

document.addEventListener("DOMContentLoaded", function (event) {
  (function renderQuestions() {
    const formFieldsHtml = ``;
    payload.questions.forEach((question, index) => {
      switch (question.type) {
        case "rating":
          let ratingsHtml = ``;
          question.options.forEach((opt, idx) => {
            console.log(opt);
            ratingsHtml += `
            <div class="tab">
              <input type="radio" id="${opt.idx}-${opt.text.join(
              "-"
            )}" name="rating-${idx}" value="${opt.text.join("-")}" checked="${
              idx === 0
            }">
              <label for="${opt.idx}-${opt.text.join("-")}">${
              opt.text
            }</label><br>
            </div>
          `;
          });

          formFieldsHtml += `
        <fieldset class="survey-page-${index + 1} step step-2 hidden">
          <h4 class="question">${question.question}</h4>
          <div class="tabs styled-radio">
            ${ratingsHtml}
          </div>
        </fieldset>
        `;
          break;

        case "boolean":
          let optionsHtml = ``;
          question.options.forEach((opt, idx) => {
            optionsHtml += `
            <div class="radio-block">
              <input type="radio" id="${opt.idx}-${opt.text.join(
              "-"
            )}" name="rating-${idx}" value="${opt.text.join("-")}" checked="${
              idx === 0
            }">
              <label for="${opt.idx}-${opt.text.join("-")}">${
              opt.text
            }</label><br>
            </div>
          `;
          });

          formFieldsHtml += `
        <fieldset class="survey-page-${index + 1} step step-4 hidden">
          <h4 class="question">${question.question}</h4>

          ${optionsHtml}
        </fieldset>
        `;
          break;

        case "text":
          formFieldsHtml += `
          <fieldset class="survey-page-${index + 1} step step-5 hidden">
            <h4 class="question">${question.question}</h4>
            <textarea name="${question.question.join(
              "-"
            )}" id="${question.question.join(
            "-"
          )}" cols="30" rows="10"></textarea>
          </fieldset>
        `;

          break;
        default:
          break;
      }
    });

    console.log(formFieldsHtml);
  })();
});
