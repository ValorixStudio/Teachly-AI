export interface ProgressRecord {
  completedTopics: string[];
  resetAt: string | null;
  updatedAt: string;
}

type ProgressStore = Map<string, ProgressRecord>;

const globalWithProgressStore = globalThis as typeof globalThis & {
  teachlyProgressStore?: ProgressStore;
};

// Keeping the store on globalThis means route modules share it during local
// development, including after Next refreshes a route module.
const progressStore =
  globalWithProgressStore.teachlyProgressStore ?? new Map<string, ProgressRecord>();

globalWithProgressStore.teachlyProgressStore = progressStore;

function emptyRecord(): ProgressRecord {
  const updatedAt = new Date().toISOString();
  return { completedTopics: [], resetAt: null, updatedAt };
}

export function getProgress(userId: string): ProgressRecord {
  const record = progressStore.get(userId) ?? emptyRecord();
  progressStore.set(userId, record);
  return record;
}

export function completeTopics(userId: string, topicKeys: string[]): ProgressRecord {
  const record = getProgress(userId);
  const completed = new Set(record.completedTopics);
  topicKeys.forEach((key) => completed.add(key));

  record.completedTopics = Array.from(completed);
  record.updatedAt = new Date().toISOString();
  progressStore.set(userId, record);
  return record;
}

export function resetProgress(userId: string): ProgressRecord {
  const record: ProgressRecord = {
    completedTopics: [],
    resetAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  progressStore.set(userId, record);
  return record;
}
