import dotenv from 'dotenv';
dotenv.config();

import neo4j from 'neo4j-driver';

const uri = process.env.NEO4J_URI;
const user = process.env.NEO4J_USERNAME;
const password = process.env.NEO4J_PASSWORD;
const database = process.env.NEO4J_DATABASE;


const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

export const conn = {
  getSession: () => driver.session({ database }),
  closeDriver: async () => await driver.close(),
};