import { FindOneOptions, ObjectLiteral, Repository } from 'typeorm';

class CoreService<T extends ObjectLiteral> {
  private entityRepository: Repository<T>;
  constructor(repository: Repository<T>) {
    this.entityRepository = repository;
  }

  async getAll(): Promise<T[]> {
    const result = await this.entityRepository.find();
    return result;
  }

  async getOne(objId: number) {
    const item = await this.entityRepository.findOne({
      where: {
        id: objId,
      },
    } as FindOneOptions<T & { id: number }>);
    if (!item) {
      throw new Error('Not found');
    }
    return item;
  }

  async create(input: T): Promise<Partial<T> | Error> {
    try {
      const result = await this.entityRepository.insert(input);
      const createdEntity = result.generatedMaps[0];
      return { ...input, ...createdEntity };
    } catch (error) {
      throw new Error(`Failed to create entity`);
    }
  }

  async update(input: Partial<T> & { id: number }): Promise<void | Error> {
    try {
      const { id } = input;
      await this.entityRepository.update(id, input);
    } catch (error) {
      throw new Error('Failed to update entity');
    }
  }

  async delete(objId: number): Promise<boolean | Error> {
    const result = await this.entityRepository.delete(objId);
    if (!result.affected) {
      throw new Error('Failed to delete entity');
    }
    return !!result.affected;
  }
}

export default CoreService;
