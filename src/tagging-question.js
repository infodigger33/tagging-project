import { LitElement, html, css } from "lit";
import { DDD } from "@lrnwebcomponents/d-d-d/d-d-d.js";

export class TaggingQuestion extends DDD {
  static get tag() {
    return "tagging-question";
  }

  constructor() {
    super();
    this.image = "image";
    this.question = "question";
    this.answerSet = "default";
    this.tagOptions = [];
    this.tagAnswers = [];
    this.submitted = false;
    this.loadTagsData();
  }

  static get styles() {
    return [
      super.styles,
      css`
        .tag-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 2px solid #ccc;
          border-radius: 8px;
          padding: 20px;
          max-width: 600px;
          margin: auto;
          overflow: hidden; 
          transition: height 0.3s ease;
        }

        .tag-container.submitted {
          max-height: 1000px;
        }

        .image-container {
          margin: 0px;
        }

        .image {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
        }

        .tag-question {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
        }

        .tag-option-container {
          width: 100%;
          background-color: #f0f0f0;
          padding: 20px;
          border: 2px solid #ccc;
          border-radius: 8px;
          box-sizing: border-box;
        }

        .submission-container {
          display: flex;
          height: auto;
          background-color: #f0f0f0;
          padding: 10px;
          border: 2px solid #ccc;
          border-radius: 8px;
          box-sizing: border-box;
          margin-bottom: 20px;
        }

        .user-choice-container {
          display: inline-flex;
          width: 100%;
        }

        #submit-button {
          display: inline-flex;
          position: relative;
          right: 0;
          padding: 10px 20px;
          background-color: #007bff;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        #submit-button:hover {
          background-color: #0056b3;
        }

        .option-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }

        .tag-option {
          padding: 8px 12px;
          border: 2px solid #ccc;
          border-radius: 8px;
          background-color: #f0f0f0;
          cursor: pointer;
          user-select: none;
          transition: background-color 0.3s ease;
        }

        .tag-option:hover {
          background-color: #e0e0e0;
        }

        .tag-option.selected {
          background-color: #a0d4ff;
        }

        .tag-option.correct {
          outline: 2px solid #4caf50;
        }

        .tag-option.incorrect {
          outline: 2px solid #f44336;
        }

        .result-item {
          margin-top: 10px;
        }

        .result-feedback {
          font-style: italic;
        }
      `
    ];
  }

  render() {
    return html`
      <confetti-container id="confetti">
        <div
          class="tag-container ${this.submitted ? "submitted" : ""}"
        >
          <div class="image-container">
            <img class="image" src="${this.image}">
          </div>
          <div class="tag-question">
            <p><span>${this.question}</span></p>
          </div>
          <div class="tag-option-container">
            <div class="submission-container">
              <div class="user-choice-container">
                <!-- ${this.tagAnswers.map(tagAnswer => html``)} -->
              </div>
              <button id="submit-button" @click="${this.submitAnswers}">Submit</button>
            </div>
            <div class="option-container">
              ${this.tagOptions.map(tagOption => html`
                <div class="tag-option" draggable="true" @click="${() => this.selectTagOption(tagOption)}">${tagOption}</div>
              `)}
            </div>
          </div>
        </div>
      </confetti-container>
    `;
  }

  loadTagsData() {
    fetch("./src/tags.json")
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch tags data");
        }
        return response.json();
      })
      .then(tagsData => {
        const tagSet = tagsData[this.answerSet];
        if (tagSet) {
          this.tagOptions = tagSet.tagOptions || [];
          this.tagAnswers = tagSet.tagAnswers || [];
        } else {
          throw new Error(`tagSet '${this.answerSet}' not found`);
        }
      })
      .catch(error => {
        console.error("Error loading tags data: ", error);
      });
  }

  submitAnswers() {
    this.submitted = !this.submitted;
    this.makeItRain();
  }

  makeItRain() {
    import('@lrnwebcomponents/multiple-choice/lib/confetti-container.js').then((module) => {
      setTimeout(() => {
        this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
      }, 0);
    });
  }

  static get properties() {
    return {
      ...super.properties,
      image: { type: String, reflect: true },
      question: { type: String, reflect: true },
      answerSet: { type: String, reflect: true },
      tagOptions: { type: Array, attribute: "tag-options" },
      tagAnswers: { type: Array, attribute: "tag-answers" },
      submitted: { type: Boolean, reflect: true }
    };
  }
}

globalThis.customElements.define(TaggingQuestion.tag, TaggingQuestion);