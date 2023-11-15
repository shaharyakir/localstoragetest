import { openDB } from "idb";

const dbPromise = openDB("keyval-store", 1, {
  upgrade(db) {
    db.createObjectStore("keyval");
  },
});

class KeyvalStore {
  async get(key: string) {
    return (await dbPromise).get("keyval", key);
  }
  async set(key: string, val) {
    return (await dbPromise).put("keyval", val, key);
  }
  async setIfNotExists(key: string, val: any) {
    return (await dbPromise).add("keyval", val, key);
  }
  async del(key: string) {
    return (await dbPromise).delete("keyval", key);
  }
  async clear() {
    return (await dbPromise).clear("keyval");
  }
  async keys() {
    return (await dbPromise).getAllKeys("keyval");
  }
}

export const keyvalStore = new KeyvalStore();
