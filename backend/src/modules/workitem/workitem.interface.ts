import { WorkitemType } from '@/enums/workitem.enum';

export interface ICreateWorkitemDto {
  title: string;
  description: string;
  type: WorkitemType;
}
