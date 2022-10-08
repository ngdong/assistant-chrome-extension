import { WorkitemEntity } from '@/entities/workitem.entity';
import { UserRepository } from '@/repositories/user.repository';
import { WorkitemRepository } from '@/repositories/workitem.repository';
import { ICreateWorkitemDto } from './workitem.interface';

class WorkitemService {
  private workitemRepository: typeof WorkitemRepository;
  private userRepository: typeof UserRepository;
  constructor() {
    this.workitemRepository = WorkitemRepository;
    this.userRepository = UserRepository;
  }

  async getAll() {
    const workitems = await this.workitemRepository.find({
      order: {
        id: 'DESC',
      },
    });
    return workitems;
  }

  async getOne(workitemId: number) {
    const item = await this.workitemRepository.findOneBy({
      id: Number(workitemId),
    });
    if (!item) {
      throw new Error('Not found');
    }
    return item;
  }

  async recentlyCreated(userId: number) {
    const workitems = await this.workitemRepository.find({
      where: {
        user: {
          id: Number(userId),
        },
      },
    });
    return workitems;
  }

  async create(input: ICreateWorkitemDto, userId: number) {
    const workItemInput = new WorkitemEntity();
    const user = await this.userRepository.findOne({
      where: { id: Number(userId) },
    });
    if (!user) {
      throw new Error('Provide invalid user for create workitem');
    }
    workItemInput.title = input.title;
    workItemInput.description = input.description;
    workItemInput.type = input.type;
    workItemInput.user = user;

    await this.workitemRepository.save(workItemInput);
  }
}

export default WorkitemService;
