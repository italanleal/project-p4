import dotenv from 'dotenv';
dotenv.config();

import neo4j from 'neo4j-driver';

const uri = process.env.NEO4J_URI;
const user = process.env.NEO4J_USERNAME;
const password = process.env.NEO4J_PASSWORD;
const database = process.env.NEO4J_DATABASE;

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

async function createUser(username, passwordHash) {
  const session = driver.session({ database });

  try {
    const result = await session.run(
      `CREATE (u:User {username: $username, password: $passwordHash}) RETURN u`,
      { username, passwordHash }
    );

    const singleRecord = result.records[0];
    const node = singleRecord.get(0);

    console.log('Usuário criado:', node.properties);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
  } finally {
    await session.close();
  }
}

// Exemplo de uso:
const username = 'usuarioTeste';
const passwordHash = 'senha123hash'; // Use hash real em produção!

createUser(username, passwordHash)
  .then(() => driver.close())
  .catch(console.error);
