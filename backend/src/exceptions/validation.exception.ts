import HttpException from '@/exceptions/http.exception';
import { IValidationExceptionItem } from '@/interfaces/exception.interface';

class ValidationException extends HttpException {
  public errors: IValidationExceptionItem[];

  constructor(errors: IValidationExceptionItem[]) {
    super(400, 'Invalid request data. Please review request and try again.');
    this.errors = errors;
  }
}

export default ValidationException;
