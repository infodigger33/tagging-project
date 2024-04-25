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
    this.allTags = [];
    this.tagCorrect = [];
    this.tagFeedback = [];
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
          border: 2px solid #ccc;
          border-radius: 8px;
          padding: 20px;
          height: auto;
          max-width: 600px;
          margin: auto;
          overflow: hidden; 
          transition: height 0.3s ease;
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

        .user-choice-container p {
          font-size: 18px;
          margin: 11px;
          color: #939393
        }

        #submit-button, #reset-button {
          margin-top: 20px;
          padding: 15px 20px;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
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

        .tag-option:hover, .tag-option:focus {
          background-color: #e0e0e0;
        }

        .tag-option.correct {
          outline: 2px solid #4caf50;
        }

        .tag-option.incorrect {
          outline: 2px solid #f44336;
        }

        #submit-button {
          background-color: #007bff;
        }

        #reset-button {
          margin-top: 10px;
          background-color: #e92539;
        }

        #submit-button:hover, #submit-button:focus {
          background-color: #005fc4;
        }

        #reset-button:hover, #reset-button:focus {
          background-color: #c82333;
        }

        #submit-button:disabled {
          pointer-events: none;
          opacity: 0.5;
          cursor: not-allowed;
          background-color: #ccc;
        }

        .feedback-container h2 {
          margin-top: 20px;
          font-size: 24px;
          font-weight: bold;
          text-align: center;
        }

        .feedback-container p {
          text-align: center;
          margin-top: 0px;
        }

        .feedback {
          text-align: left;
          margin-top: 20px;
        }

        .feedback.correct {
          color: #4caf50;
        }

        .feedback.incorrect {
          color: #f44336;
        }
      `
    ];
  }

  render() {
    return html`
      <confetti-container id="confetti">
        <div class="tag-container">
          <div class="image-container">
            <img class="image" src="${this.image}">
          </div>
          <div class="tag-question">
            <p>${this.question}</p>
          </div>
          <div class="tag-option-container">
            <div class="user-choice-container" @drop="${this.handleDrop}" @dragover="${this.allowDrop}">
              ${this.selectedTags.length === 0 ? html`
                <p>*place tags here*</p>
              ` : ''}
              ${this.selectedTags.map(selectedTag => html`
                <div class="tag-option ${this.submitted ? (this.isTagCorrect(selectedTag) ? 'correct' : 'incorrect') : ''}" draggable="true" @dragstart="${this.handleDragStart}" @dragend="${this.handleDragEnd}" @click="${() => this.handleTagClick(selectedTag)}" @keydown="${(event) => this.handleKeyDown(event, selectedTag)}" tabindex=0>${selectedTag}</div>
              `)}
            </div>
            <div class="option-container" @drop="${this.handleDrop}" @dragover="${this.allowDrop}">
              ${this.tagOptions.map(tagOption => html`
                <div class="tag-option" draggable="true" @dragstart="${this.handleDragStart}" @dragend="${this.handleDragEnd}" @click="${() => this.handleTagClick(tagOption)}" @keydown="${(event) => this.handleKeyDown(event, tagOption)}" tabindex=0 >${tagOption}</div>
              `)}
            </div>
          </div>
          <div class="button-container">
            <button id="submit-button" ?disabled="${this.submitted || this.selectedTags.length === 0}" @click="${this.submitAnswers}">Submit</button>
            <button id="reset-button" @click="${this.reset}">Reset</button>
          </div>
          ${this.submitted ? html`
          <div class="feedback-container">
            <h2>Feedback</h2>
            <p>${this.selectedTags.filter(tag => this.isTagCorrect(tag)).length} out of ${this.allTags.filter(tag => this.isTagCorrect(tag)).length} correct options selected</p>
            ${this.selectedTags.map(selectedTag => html`
              <div class="feedback ${this.isTagCorrect(selectedTag) ? 'correct' : 'incorrect'}"><strong>${selectedTag}:</strong> ${this.getFeedbackForTag(selectedTag)}</div>              
            `)}
          </div>
        ` : ''}
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
          const originalTagOptions = tagSet.tagOptions || [];
          this.allTags = originalTagOptions.slice(); 
          this.tagOptions = originalTagOptions.slice();
          this.tagCorrect = [];
          this.tagFeedback = [];
  
          tagSet.tagAnswers.forEach((tagAnswer, index) => {
            const tagKey = Object.keys(tagAnswer)[0];
            const { correct, feedback } = tagAnswer[tagKey];
            this.tagCorrect.push(correct);
            this.tagFeedback.push(feedback);
          });
  
          this.tagOptions = this.shuffleArray(this.tagOptions);
        } else {
          throw new Error(`tagSet '${this.answerSet}' not found`);
        }
      })
      .catch(error => {
        console.error("Error loading tags data: ", error);
      }
    );
  }
  
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  getFeedbackForTag(tag) {
    const index = this.allTags.indexOf(tag);
    if (index !== -1) {
      const feedback = this.tagFeedback[index];
      return html`${feedback}`;
    }
    return html``;
  }

  isTagCorrect(tag) {
    const index = this.allTags.indexOf(tag);
    if (index !== -1) {
      return this.tagCorrect[index];
    }
    return false;
  }

  handleDragStart(e) {
    const tagOption = e.target.textContent.trim();
    e.dataTransfer.setData("text/plain", tagOption);
  }
  
  handleDragEnd(e) {
    const tagOption = e.target.textContent.trim();
    e.dataTransfer.getData("text/plain", tagOption);
  }

  allowDrop(e) {
    e.preventDefault();
  }

  handleDrop(e) {
    e.preventDefault();
    const tagOption = e.dataTransfer.getData("text/plain");
    const isInOptionContainer = this.tagOptions.includes(tagOption);
    const sourceContainer = isInOptionContainer ? "option" : "user-choice";
    const destinationContainer = e.target.classList.contains("option-container") ? "option" : "user-choice";

    if (sourceContainer === destinationContainer) {
        return;
    }

    if (isInOptionContainer) {
        this.handleTagMove(tagOption, "option");
    } else {
        this.handleTagMove(tagOption, "user-choice");
    }
  }
  
  handleTagMove(tagOption, source) {
    if (source === "user-choice") {
      this.removeTag(tagOption);
    } else {
      this.addTag(tagOption);
    }
  }

  handleKeyDown(event, tagOption) {
    if (event.key === 'Enter') {
      this.handleTagClick(tagOption);
    }
  }
  
  handleTagClick(tagOption) {
    if (this.selectedTags.includes(tagOption)) {
      this.handleTagMove(tagOption, "user-choice");
    } else if (this.tagOptions.includes(tagOption)) {
      this.handleTagMove(tagOption, "option");
    }
  }

  addTag(tagOption) {
    if (!this.submitted && !this.selectedTags.includes(tagOption)) {
      this.selectedTags = [...this.selectedTags, tagOption];
      this.tagOptions = this.tagOptions.filter(selectedTags => selectedTags !== tagOption);
    }
  }

  removeTag(tagOption) {
    if (!this.submitted) {
      this.selectedTags = this.selectedTags.filter(selectedTags => selectedTags !== tagOption);
      this.tagOptions.push(tagOption);
    }
  }

  submitAnswers() {
    this.submitted = true;
    this.checkAnswers();
    this.makeItRain();
  }

  checkAnswers() {
    this.selectedTags.forEach(tag => {
      const index = this.allTags.indexOf(tag);
      if (index !== -1) {
        const correct = this.tagCorrect[index];
        const feedback = this.tagFeedback[index];
      }
    });
  }

  reset() {
    this.submitted = false;
    this.tagOptions = [...this.tagOptions, ...this.selectedTags];
    this.selectedTags = [];
    this.shuffleArray(this.tagOptions); 
  }

  makeItRain() {
    const allCorrect = this.selectedTags.every(tag => this.isTagCorrect(tag));
  
    if (allCorrect) {
      import('@lrnwebcomponents/multiple-choice/lib/confetti-container.js').then((module) => {
        setTimeout(() => {
          this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
        }, 0);
      });
    }
  }
  
  static get properties() {
    return {
      ...super.properties,
      image: { type: String, reflect: true },
      question: { type: String, reflect: true },
      answerSet: { type: String, reflect: true },
      tagOptions: { type: Array, attribute: "tag-options" },
      allTags: { type: Array, attribute: "all-tags" },
      tagCorrect: { type: Array, attribute: "tag-correct" },
      tagFeedback: { type: Array, attribute: "tag-feedback" },
      selectedTags: { type: Array, attribute: "selected-tags" },
      submitted: { type: Boolean, reflect: true }
    };
  }
}

globalThis.customElements.define(TaggingQuestion.tag, TaggingQuestion);