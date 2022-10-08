export interface IValidationExceptionItem {
  message: string;
  field: string;
}

export interface IGenerateException {
  message: string;
  errors?: IValidationExceptionItem[];
}
