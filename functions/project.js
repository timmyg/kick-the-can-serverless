const neo4j = require("neo4j-driver").v1;
const randomstring = require("randomstring");
const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');

var driver = neo4j.driver(
    process.env.GRAPHENEDB_URL,
    neo4j.auth.basic(
        process.env.GRAPHENEDB_USERNAME,
        process.env.GRAPHENEDB_PASSWORD
    )
);

const helpers = {
    getBody(event) {
        try {
            return JSON.parse(event.body);
        } catch (e) {
            return event.body;
        }
    },
    getUserId(token) {
        const profile = jwt.decode(token);
        return profile.sub.split("|")[1];
    }
};

module.exports.create = async (event, context, callback) => {
    try {
        const params = helpers.getBody(event);
        const userId = helpers.getUserId(params.accessToken);
        var session = driver.session();

        const query = [
            "CREATE (team:Team {})-[:EMPLOYS]->(hacker:Hacker {id: {userId}})",
            "CREATE (project:Project {name: {name}, apiKey: {apiKey}, id: {id}})",
            "CREATE (team)-[:WORKS_ON]->(project)"
        ].join('\n');
        const result = await session
            .run(query, {
                userId,
                name: params.name,
                id: uuid(),
                apiKey: randomstring.generate({
                    length: 20,
                    charset: "hex"
                })
            })
        const team = result.records[0];

        return callback(null, {
            message: `Node saved to database`
        });
    } catch (e) {
        console.error(e);
    }
};

module.exports.get = async (event, context, callback) => {
    try {
        const params = helpers.getBody(event);
        const userId = helpers.getUserId(params.accessToken);
        var session = driver.session();

        const query = "MATCH (h:Hacker {id: {userId}})<-[:EMPLOYS]-(team:Team)-[:WORKS_ON]->(p:Project) RETURN p{.name}";
        const result = await session
            .run(query, {
                userId
            })
        const response = {
            statusCode: 200,
            body: JSON.stringify(result.records[0]._fields)
        }
        return callback(null, response);
    } catch (e) {
        return callback(null, {
            message: `Error: ${e}`
        });
    }
};