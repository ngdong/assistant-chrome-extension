import { TRANSACTION_NAME } from "../constant.js";
import BaseRepository from "./BaseRepository.js";

class NoteRepository extends BaseRepository{
  constructor(){
    super(TRANSACTION_NAME.NOTE);
  }
}

export default NoteRepository;
