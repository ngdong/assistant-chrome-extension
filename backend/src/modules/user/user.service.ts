import { UserRepository } from '@/repositories/user.repository';

class UserService {
  private userRepository: typeof UserRepository;
  constructor() {
    this.userRepository = UserRepository;
  }

  async getOne(userId: number) {
    const item = await this.userRepository.findOneBy({
      id: Number(userId),
    });
    if (!item) {
      throw new Error('Not found');
    }
    return item;
  }
}

export default UserService;
