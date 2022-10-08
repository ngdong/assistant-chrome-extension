import BaseService from "./BaseService.js";
import NoteRepository from "../repositories/NoteRepository.js";

export class NoteService extends BaseService {
  noteRepository;
  constructor() {
    super();
    this.noteRepository = new NoteRepository();
  }

  async getAll() {
    try {
      /* const result = await this.get("todos"); */
      const result = await this.noteRepository.findAll();
      return result;
    } catch (error) {
      return [];
    }
  }

  async create(noteInput) {
    try {
      noteInput.id = "note";
      noteInput.created_date = new Date().getTime();
      await this.noteRepository.updateOne(noteInput);
      return result;
    } catch (error) {
      return [];
    }
  }
}

const noteService = new NoteService();
export default noteService;
