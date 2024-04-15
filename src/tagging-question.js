import { html, css } from "lit";
import { DDD } from "@lrnwebcomponents/d-d-d/d-d-d.js";

export class TaggingQuestion extends DDD {
  static get tag() {
    return 'tagging-question';
  }

  constructor() {
    super();
  }

  static get styles() {
    return [
      super.styles,
      css`
        .tag-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 2px solid #ccc;
          border-radius: 8px;
          padding: 20px;
          max-width: 700px;
          margin: 0 auto;
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
          margin-bottom: 20px;
        }

        .tag-option-container {
          width: 100%;
          background-color: #f0f0f0;
          padding: 20px; 
          border: 2px solid #ccc;
          border-radius: 8px;
          box-sizing: border-box;
          text-align: center;
        }

        .answer-container {
          background-color: #f0f0f0;
          padding: 10px;
          border: 2px solid #ccc;
          border-radius: 8px;
          box-sizing: border-box;
          text-align: center;
          margin-top: 10px;
          margin-bottom: 10px;
        }

        #submit-button {
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
      `
    ];
  }
  

  render() {
    return html`
      <confetti-container id="confetti">
        <div class="tag-container">
          <div class="image-container">
            <img class="image" src="https://scontent-iad3-1.xx.fbcdn.net/v/t39.30808-6/434777403_10226789742222080_4737298705859346069_n.jpg?stp=cp6_dst-jpg&_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=ibjBgkSswCsAb5UKh2J&_nc_ht=scontent-iad3-1.xx&oh=00_AfDPgavqQZPNrAU6fDY6xfizb1ofGKUdUwoxn56IwKD3xg&oe=662238F0" alt="Buckeye"></div>
          <div class="tag-question"></div>
            <p><span>woof</span></p>
          <div class="tag-option-container">
            <div class="answer-container">
              <button id="submit-button" @click="${this.submitAnswers}">Submit</button>
            </div>
            <div class="option-container">
              <div class="tag-option">Option 1</div>
              <div class="tag-option">Option 2</div>
              <div class="tag-option">Option 3</div>
            </div>
          </div>
        </div>
      </confetti-container>
    `;
  }

  static get properties() {
    return {
      ...super.properties,
    }
  }
}  

globalThis.customElements.define(TaggingQuestion.tag, TaggingQuestion);