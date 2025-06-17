import neo4j from 'neo4j-driver';

const uri = 'neo4j://127.0.0.1:7687';
const user = 'neo4j';
const password = 'a846d5da';

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

export const conn = {
    getSession: () => driver.session(),
    closeDriver: async () => await driver.close()
}
