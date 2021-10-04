import { ModelFactory } from '@models';
import { DeleteResult, QueryOptions } from '@storage';
import { LooseObject } from '@typings';
import { RepositoryContext } from './repository-context';

export class BaseRepository<T> {
  constructor(protected context: RepositoryContext) {}

  public aggregate(data: LooseObject[]): Promise<T[]> {
    return this.context.store.aggregate<T>(data, this.modelFactory());
  }

  public getAll(data?: LooseObject, options?: QueryOptions): Promise<T[]> {
    return this.context.store.getAll<T>(data, options, this.modelFactory());
  }

  public findById(id: string, options?: QueryOptions): Promise<T> {
    return this.context.store.findById<T>(id, options, this.modelFactory());
  }

  public findOne(data?: LooseObject, options?: QueryOptions): Promise<T> {
    return this.context.store.findOne<T>(data, options, this.modelFactory());
  }

  public save(entity: T): Promise<T> {
    return this.context.store.save<T>(entity, this.modelFactory());
  }

  public update(filter: LooseObject, dataToUpdate: LooseObject): Promise<T> {
    return this.context.store.update<T>(filter, dataToUpdate, this.modelFactory());
  }

  public upsert(filter: LooseObject, dataToUpdate: LooseObject): Promise<T> {
    return this.context.store.upsert<T>(filter, dataToUpdate, this.modelFactory());
  }

  public saveMany(entities: T[]): Promise<T[]> {
    return this.context.store.saveMany<T>(entities, this.modelFactory());
  }

  public toObjectId(id: string): any {
    return this.context.store.toObjectId(id);
  }

  public count(data?: LooseObject): Promise<number> {
    return this.context.store.count(data, this.modelFactory());
  }

  public deleteMany(filter: LooseObject): Promise<DeleteResult> {
    return this.context.store.deleteMany(filter, this.modelFactory());
  }

  protected modelFactory(): ModelFactory<T> {
    throw new Error('Not Implemented');
  }
}
