import { AppContext } from '@typings';
import { InMemoryMongoStore } from './in-memory-mongo-store';
import { MockLogger } from './mock-logger';

const mockStore = new InMemoryMongoStore();
const mockLogger = new MockLogger();

export const repositoryContext = {
  logger: mockLogger,
  store: mockStore,
  translate: (value: string) => value
};

export const testAppContext: AppContext = {
  logger: mockLogger
};
