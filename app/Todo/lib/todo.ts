import { Filter, ObjectId, WithId } from "mongodb";
import {
  CreateTodoInput,
  DEFAULT_PRIORITY,
  PRIORITIES,
  Todo,
  TodoFilters,
  UpdateTodoInput,
} from "../types/todo";
import { getTodoCollection, TodoDocument } from "./db";

// Convert a MongoDB document into a plain, serializable Todo for components.
function toTodo(doc: WithId<TodoDocument>): Todo {
  return {
    _id: doc._id.toString(),
    title: doc.title,
    completed: doc.completed,
    priority: doc.priority ?? DEFAULT_PRIORITY,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt?.toISOString(),
  };
}

// Escape regex special characters so user input is matched literally
// (e.g. searching "c++" or "(draft)" shouldn't break or change the query).
function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Drop anything that isn't a valid ObjectId instead of letting the query throw.
function toObjectIds(ids: string[]): ObjectId[] {
  return ids.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id));
}

export async function fetchTodos(filters: TodoFilters = {}): Promise<Todo[]> {
  const { q, status = "all" } = filters;

  const match: Filter<TodoDocument> = {};

  if (q) {
    match.title = { $regex: escapeRegex(q), $options: "i" };
  }

  if (status === "active") {
    match.completed = false;
  } else if (status === "completed") {
    match.completed = true;
  }

  try {
    const collection = await getTodoCollection();

    // Priorities are strings, so sort on their position in PRIORITIES (low=0 … high=2)
    // to get high → medium → low, then newest first within the same priority.
    const todos = await collection
      .aggregate<WithId<TodoDocument>>([
        { $match: match },
        {
          $addFields: {
            priorityRank: {
              $indexOfArray: [PRIORITIES, { $ifNull: ["$priority", DEFAULT_PRIORITY] }],
            },
          },
        },
        { $sort: { priorityRank: -1, createdAt: -1 } },
        { $project: { priorityRank: 0 } },
      ])
      .toArray();

    return todos.map(toTodo);
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
}

export async function fetchTodoById(id: string): Promise<Todo | null> {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  try {
    const collection = await getTodoCollection();
    const todo = await collection.findOne({ _id: new ObjectId(id) });
    return todo ? toTodo(todo) : null;
  } catch (error) {
    console.error("Error fetching todo by id:", error);
    return null;
  }
}

export async function createTodo(todo: CreateTodoInput): Promise<string | null> {
  try {
    const collection = await getTodoCollection();

    const result = await collection.insertOne({
      title: todo.title,
      completed: todo.completed ?? false,
      priority: todo.priority ?? DEFAULT_PRIORITY,
      createdAt: new Date(),
    });

    return result.insertedId.toString();
  } catch (error) {
    console.error("Error creating todo:", error);
    return null;
  }
}

export async function updateTodo(id: string, todo: UpdateTodoInput): Promise<boolean> {
  if (!ObjectId.isValid(id)) {
    return false;
  }

  try {
    const collection = await getTodoCollection();

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...todo, updatedAt: new Date() } }
    );

    // matchedCount (not modifiedCount) so saving an unchanged title still counts as success.
    return result.matchedCount > 0;
  } catch (error) {
    console.error("Error updating todo:", error);
    return false;
  }
}

export async function deleteTodo(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) {
    return false;
  }

  try {
    const collection = await getTodoCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting todo:", error);
    return false;
  }
}

// Bulk operations: return how many todos were affected (0 on error).

export async function setTodosCompleted(ids: string[], completed: boolean): Promise<number> {
  const objectIds = toObjectIds(ids);

  if (objectIds.length === 0) {
    return 0;
  }

  try {
    const collection = await getTodoCollection();

    const result = await collection.updateMany(
      { _id: { $in: objectIds } },
      { $set: { completed, updatedAt: new Date() } }
    );

    return result.matchedCount;
  } catch (error) {
    console.error("Error updating todos:", error);
    return 0;
  }
}

export async function deleteTodos(ids: string[]): Promise<number> {
  const objectIds = toObjectIds(ids);

  if (objectIds.length === 0) {
    return 0;
  }

  try {
    const collection = await getTodoCollection();
    const result = await collection.deleteMany({ _id: { $in: objectIds } });
    return result.deletedCount;
  } catch (error) {
    console.error("Error deleting todos:", error);
    return 0;
  }
}
