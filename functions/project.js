var Promise = require("bluebird");
const neo4j = require("neo4j");
const randomstring = require("randomstring");
const db = new neo4j.GraphDatabase(process.env.GRAPHENEDB_URL);
const cypher = Promise.promisify(db.cypher.bind(db));

module.exports.create = async (event, context, callback) => {
    const results = cypher({
        query: 'CREATE (project:Project {name: {name}, user: {user}, apiKey: {apiKey}}) RETURN project',
        params: {
            name: "project-yellow",
            user: "user5",
            apiKey: randomstring.generate({
                length: 20,
                charset: 'hex'
            })
        }
    });
    return callback(null, {
        message: `Node saved to database: ${results}`
    });
}

module.exports.get = async (event, context, callback) => {
    console.log("yo");
    console.time("projectGet")
    try {
        const results = await cypher({
            // query: 'MATCH (project:Project {name: {name}, user: {user}}) RETURN project',
            query: 'MATCH (project:Project {user: {user}}) RETURN project.apiKey',
            // query: 'MATCH (project:Project {name: {name}, user: {user}}) RETURN project.apiKey',
            params: {
                // name: "project-blue",
                user: "user1"
            }
        })
        console.timeEnd("projectGet")
        return callback(null, {
            message: `Node found: ${JSON.stringify(results)}`
        });
    } catch (e) {
        console.timeEnd("projectGet")
        return callback(null, {
            message: `Error: ${e}`
        });
    }
};