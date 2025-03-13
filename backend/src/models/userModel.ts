import { ObjectId } from "mongodb";
import { client } from "../config/database";
import bcrypt from "bcryptjs";

// Interface utilisateur
export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
}

// Récupérer la collection "users" depuis MongoDB
const usersCollection = client.db("gamerz-ldf").collection<User>("users");

// Fonction pour récupérer un utilisateur par email
export async function findUserByEmail(email: string): Promise<User | null> {
  return await usersCollection.findOne({ email });
}

// Fonction pour créer un nouvel utilisateur
export async function createUser(email: string, password: string): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await usersCollection.insertOne({ email, password: hashedPassword });
  return { _id: result.insertedId, email, password: hashedPassword };
}
