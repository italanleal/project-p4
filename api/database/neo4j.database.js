import dotenv from 'dotenv';
dotenv.config();

import neo4j from 'neo4j-driver';

const uri = process.env.NEO4J_URI;
const user = process.env.NEO4J_USER;
const password = process.env.NEO4J_PASSWORD;
const database = process.env.NEO4J_DATABASE;

if (!uri || !user || !password) {
  throw new Error('Variáveis de ambiente NEO4J_URI, NEO4J_USER e NEO4J_PASSWORD devem estar definidas');
}

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

export const conn = {
  getSession: () => driver.session({ database }),
  closeDriver: async () => await driver.close(),
};
