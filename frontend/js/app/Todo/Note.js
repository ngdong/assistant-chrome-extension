import noteService from "../../services/NoteService.js";
class Note {
  constructor() {}

  async getNote() {
    try {
      const notes = await noteService.getAll();
      return notes.shift();
    } catch (error) {
      return [];
    }
  }

  async createMarkup() {
    return `
      <div class="notes">
        <div class="row form-control">
          <input type="text" class="input_title" placeholder="Title here..." />
        </div>
        <div class="row form-control note-content">
          <textarea class="input_description" placeholder="Description"
            id="description_area"></textarea>
          <div id="description_copy"></div>
        </div>
        <div class="tooltip">
          <span>* Press Ctrl + S to save the current document</span>
        </div>
      </div>
    `;
  }

  async render(selector) {
    const markup = await this.createMarkup();
    const parent = document.getElementById(selector);
    parent.innerHTML = markup;
    this.bindEvents();
    this.setFormValue();
  }

  bindEvents() {
    let el = document.getElementById("description_area");
    let handler = (e) => this.autosize(e);
    ['change', 'keyup', 'keydown'].forEach(event => el.addEventListener(event, handler));

    document.addEventListener('keydown', e => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        this.saveNote();
      }
    });
  }

  autosize(e) {
    const textCopy = document.getElementById("description_copy");
    textCopy.innerHTML = e.target.value.replace(/\n/g, '<br/>');
    this.saveNote();
  }

  async saveNote() {
    try {
      let description = document.querySelector(".input_description").value;
      let title = document.querySelector(".input_title").value;
      if (!title || title === '') {
        return;
      }
      await noteService.create({title, description});
    } catch(e) {
      console.error(e)
    }
  }

  async setFormValue() {
    const note = await this.getNote();
    if (note) {
      document.querySelector(".input_title").value = note.title;
      document.querySelector(".input_description").value = note.description;
      document.getElementById("description_copy").innerHTML = note.description.replace(/\n/g, '<br/>');
    }
  }
}
export default Note;
