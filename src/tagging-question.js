import { html, css } from "lit";
import { DDD } from "@lrnwebcomponents/d-d-d/d-d-d.js";
import "@lrnwebcomponents/rpg-character/rpg-character.js";

export class TaggingQuestion extends DDD {
  static get tag() {
    return 'party-ui';
  }

  constructor() {
    super();
    this.users = [];
    this.userInput = '';
  }

  static get styles() {
    return [
      super.styles,
      css`
        
    `];
  }

  render() {
    return html`
      <confetti-container id="confetti">
        <div class="tagging-container">
              <div class="add-user-container">
                <p><span>Add User:</span></p>
                <input type="text" class="text-input" .value=${this.userInput} @input="${this.handleInput}">
                <button id="close-button" @click="${this.confirmClose}">✕</button>        
                <button id="add-button" ?disabled="${this.userInput === ''}" @click="${this.addUser}">►</button>
              </div>
              <div class="current-user-container">
                <p><span>Current Users:</span></p>        
                <div class="scroll-container">
                  ${this.users.map(user => html`
                    <div class="card-container">
                      <button @click="${() => this.deleteUser(user)}">
                        <rpg-character hat="random" seed="${user}"></rpg-character>
                        <p>${user}</p>
                      </button>
                    </div>
                  `)}       
                </div>
              </div>
              <button id="save-button" @click="${this.saveParty}">Save Party</button>
        </div>
      </confetti-container>
    `;
  }

  static get properties() {
    return {
      ...super.properties,
      users: { type: Array },
      userInput: { type: String, reflect: true },
    }
  }
}  

globalThis.customElements.define(TaggingQuestion.tag, TaggingQuestion);