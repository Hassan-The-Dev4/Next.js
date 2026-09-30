import { MongoClient, Db, Collection } from "mongodb";
import type { Priority } from "../types/todo";

// Shape of a todo as stored in MongoDB (dates are real Date objects here,
// they get serialized to strings in lib/todo.ts before reaching components).
// _id is left out so MongoDB generates it on insert; reads return WithId<TodoDocument>.
export type TodoDocument = {
  title: string;
  completed: boolean;
  // Optional because todos created before priorities existed don't have one.
  priority?: Priority;
  createdAt: Date;
  updatedAt?: Date;
};

// Cache the connection promise on globalThis so that hot reloads in development
// reuse the same client instead of opening a new connection on every edit.
const globalForMongo = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }

  if (!globalForMongo._mongoClientPromise) {
    globalForMongo._mongoClientPromise = new MongoClient(uri).connect();
  }

  try {
    const client = await globalForMongo._mongoClientPromise;
    return { client, db: client.db("todo_app") };
  } catch (error) {
    // Don't keep a failed connection cached, so the next request can retry.
    globalForMongo._mongoClientPromise = undefined;
    throw error;
  }
}

export async function getTodoCollection(): Promise<Collection<TodoDocument>> {
  const { db } = await connectToDatabase();
  return db.collection<TodoDocument>("todos");
}
