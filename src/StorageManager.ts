import WebApp from '@twa-dev/sdk';

interface IStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}

class LocalStorageManager implements IStorage {
  getItem(key: string): Promise<string | null> {
    return Promise.resolve(localStorage.getItem(key));
  }

  setItem(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value);
    return Promise.resolve();
  }
}

class CloudStorageManager implements IStorage {
  getItem(key: string): Promise<string | null> {
    return new Promise((resolve) => {
      WebApp.CloudStorage.getItem(key, (error, value) => {
        if (error) {
          console.error('Error getting item from CloudStorage:', error);
          resolve(null);
        } else {
          resolve(value ?? null);
        }
      });
    });
  }

  setItem(key: string, value: string): Promise<void> {
    return new Promise((resolve, reject) => {
      WebApp.CloudStorage.setItem(key, value, (error) => {
        if (error) {
          console.error('Error setting item in CloudStorage:', error);
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}

class StorageManager {
  private static instance: IStorage;

  private constructor() {}

  public static getInstance(): IStorage {
    if (!StorageManager.instance) {
      StorageManager.instance = import.meta.env.MODE === 'development'
        ? new LocalStorageManager()
        : new CloudStorageManager();
    }
    return StorageManager.instance;
  }
}

export default StorageManager.getInstance();