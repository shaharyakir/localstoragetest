import { openDB, deleteDB, wrap, unwrap } from "idb";

export async function tryWriteLock(myVal: string) {
  const db = await openDB("myDb", 1, {
    upgrade(db) {
      console.log("hi");
      db.createObjectStore("whatever");
    },
  });

  // const store = db.createObjectStore("locker");
  const tx = db.transaction("whatever", "readwrite");
  // const txStore = tx.objectStore('whatever');
  const value = await tx.store.get("lock");
  if (!value) {
    await tx.store.put(myVal, "lock");
  }
  await tx.done;
}

export async function getLockValue() {
  const db = await openDB("myDb", 1);
  return db.get("whatever", "lock");
}
