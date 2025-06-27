import dotenv from 'dotenv';
dotenv.config();

import neo4j from 'neo4j-driver';
import { UserRepository } from './UserRepository.js';

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

const conn = {
  getSession: () => driver.session({ database: process.env.NEO4J_DATABASE })
};

const userRepo = new UserRepository(conn);

const run = async () => {
  const userId = "tvf9xkrez68c2subawstif7sa"; // Coloca um userId que exista no banco

  const update = {
    userDisplayName: 'carlos1',
    profileImageUrl: "https://i.scdn.co/image/ab6775700000ee85bf87f40440be2531fde60ef5",
    biography: 'Nova biografia brabíssima'
  };

  try {
    const result = await UserRepository.updateUser(userId, update);
    if (result) {
      console.log('Usuário atualizado com sucesso:', result);
    } else {
      console.log('Usuário não encontrado.');
    }
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err.message);
  } finally {
    await driver.close();
  }
};

run();
