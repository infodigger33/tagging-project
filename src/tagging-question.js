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
    this.selectedTags = [];
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
          height: auto;
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

        .user-choice-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          overflow-y: auto;
          background-color: #f0f0f0;
          padding: 10px;
          border: 2px solid #ccc;
          border-radius: 8px;
          box-sizing: border-box;
          margin-bottom: 20px;
        }

        #submit-button, #reset-button {
          padding: 15px 20px;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        #submit-button {
          background-color: #007bff;
        }

        #reset-button {
          margin-top: 10px;
          background-color: #e92539;
        }

        #submit-button:hover {
          background-color: #005fc4;
        }

        #reset-button:hover {
          background-color: #c82333;
        }

        #submit-button:disabled {
          pointer-events: none;
          opacity: 0.5;
          cursor: not-allowed;
          background-color: #ccc;
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

        .tag-option.correct {
          outline: 2px solid #4caf50;
        }

        .tag-option.incorrect {
          outline: 2px solid #f44336;
        }

        
      `
    ];
  }

  render() {
    return html`
      <confetti-container id="confetti">
        <div class="tag-container ${this.submitted ? "submitted" : ""}">
          <div class="image-container">
            <img class="image" src="${this.image}">
          </div>
          <div class="tag-question">
            <p><span>${this.question}</span></p>
          </div>
          <div class="tag-option-container">
            <div class="user-choice-container" @drop="${this.handleDropInAnswer}" @dragover="${this.allowDrop}">
              ${this.selectedTags.map(tag => html`
                <div class="tag-option" draggable="true" @dragstart="${this.handleDragStart}" @dragend="${this.handleDragEnd}">${tag}</div>
              `)}
            </div>
            <div class="option-container" @dragover="${this.allowDrop}">
              ${this.tagOptions.map(tagOption => html`
                <div class="tag-option" draggable="true" @dragstart="${this.handleDragStart}" >${tagOption}</div>
              `)}
            </div>
          </div>
          <div>
            <button id="submit-button" ?disabled="${this.submitted}" @click="${this.submitAnswers}">Submit</button>
            <button id="reset-button" @click="${this.reset}">Reset</button>
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
          
          this.tagOptions = this.shuffleArray(this.tagOptions);
        } else {
          throw new Error(`tagSet '${this.answerSet}' not found`);
        }
      })
      .catch(error => {
        console.error("Error loading tags data: ", error);
      });
  }
  
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  firstUpdated() {
    super.firstUpdated();
    this.answerContainer = this.shadowRoot.querySelector(".user-choice-container");
    this.optionContainer = this.shadowRoot.querySelector(".option-container");
    this.answerContainer.addEventListener("dragover", this.allowDrop.bind(this));
    this.optionContainer.addEventListener("dragover", this.allowDrop.bind(this));
    this.answerContainer.addEventListener("drop", this.handleDrop.bind(this, true));
    this.optionContainer.addEventListener("drop", this.handleDrop.bind(this, false));
  }

  handleDragStart(e) {
    const tagOption = e.target.textContent.trim();
    e.dataTransfer.setData("text/plain", tagOption);
  }

  handleDragEnd(e) {
    const tagOption = e.target.textContent.trim();
    const sourceContainer = e.target.closest(".user-choice-container");
    if (sourceContainer) {
      this.removeTag(tagOption);
    }
  }

  allowDrop(e) {
    e.preventDefault();
  }

  handleDrop(isUserChoice, e) {
    e.preventDefault();
    const tagOption = e.dataTransfer.getData("text/plain");
    if (isUserChoice) {
      this.addTag(tagOption);
    } else {
      if (!this.selectedTags.includes(tagOption)) {
        if (!this.tagOptions.includes(tagOption)) {
          this.tagOptions.push(tagOption);
        }
      }
    }
  }
  
  applyFeedback() {
    if (this.submitted) {
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
            const tagAnswers = tagSet.tagAnswers || [];
            const selectedTags = this.selectedTags;
            const tagElements = Array.from(this.shadowRoot.querySelectorAll('.tag-option'));
            tagElements.forEach(tagElement => {
              const optionText = tagElement.textContent.trim();
              const tagAnswer = tagAnswers.find(answer => answer.hasOwnProperty(optionText));
              if (tagAnswer) {
                const correct = tagAnswer[optionText].correct;
                tagElement.classList.toggle('correct', correct && selectedTags.includes(optionText));
                tagElement.classList.toggle('incorrect', !correct && selectedTags.includes(optionText));
              }
            });
          } else {
            throw new Error(`tagSet '${this.answerSet}' not found`);
          }
        })
        .catch(error => {
          console.error("Error applying feedback: ", error);
        });
    }
  }
  
  addTag(tagOption) {
    if (!this.submitted && !this.selectedTags.includes(tagOption)) {
      this.selectedTags = [...this.selectedTags, tagOption];
      this.tagOptions = this.tagOptions.filter(tag => tag !== tagOption);
    }
  }

  removeTag(tagOption) {
    if (!this.submitted) {
      this.selectedTags = this.selectedTags.filter(tag => tag !== tagOption);
      this.tagOptions.push(tagOption);
    }
  }

  submitAnswers() {
    this.submitted = true;
    this.applyFeedback();
    this.makeItRain();
  }

  reset() {
    this.submitted = false;
    this.tagOptions = [...this.tagOptions, ...this.selectedTags];
    this.selectedTags = [];
    this.shuffleArray(this.tagOptions); 
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
      selectedTags: { type: Array, attribute: "selected-tags" },
      submitted: { type: Boolean, reflect: true }
    };
  }
}

globalThis.customElements.define(TaggingQuestion.tag, TaggingQuestion);