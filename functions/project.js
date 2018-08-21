const neo4j = require("neo4j-driver").v1;
const randomstring = require("randomstring");

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
    }
};

module.exports.create = async (event, context, callback) => {
    try {
        const params = helpers.getBody(event);
        const {
            name,
            userId
        } = params;
        var session = driver.session();

        const query = [
            "CREATE (team:Team {})-[:EMPLOYS]->(hacker:Hacker {id: {userId}})",
            "CREATE (project:Project {name: {name}, apiKey: {apiKey}})",
            "CREATE (team)-[:WORKS_ON]->(project)"
        ].join('\n');
        const result = await session
            .run(query, {
                userId,
                name,
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
        const {
            userId
        } = params;
        var session = driver.session();

        const query = "MATCH (h:Hacker {id: {userId}})<-[:EMPLOYS]-(team:Team)-[:WORKS_ON]->(p:Project) RETURN p";
        const result = await session
            .run(query, {
                userId
            })
        console.log({
            result
        });
        const projects = result.records;
        const response = {
            statusCode: 200,
            body: JSON.stringify(projects)
        }
        return callback(null, response);
    } catch (e) {
        return callback(null, {
            message: `Error: ${e}`
        });
    }
};