import { TRANSACTION_NAME } from "../constant.js";
import BaseRepository from "./BaseRepository.js";

class TodoRepository extends BaseRepository{
  constructor(){
    super(TRANSACTION_NAME.TODO);
  }
}

export default TodoRepository;
