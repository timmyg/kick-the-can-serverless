const neo4j = require("neo4j");
const randomstring = require("randomstring");
const db = new neo4j.GraphDatabase(process.env.GRAPHENEDB_URL);

module.exports.create = async (event, context, callback) => {
    db.cypher({
        query: 'CREATE (project:Project {name: {name}, user: {user}, apiKey: {apiKey}}) RETURN project',
        params: {
            name: "project-yellow",
            user: "user5",
            apiKey: randomstring.generate({
                length: 20,
                charset: 'hex'
            })
        }
    }, function (err, results) {
        var result = results[0];
        if (err) {
            return callback(null, {
                message: 'Error saving new node to database:',
                err
            });
        } else {
            console.log(result);
            return callback(null, {
                message: `Node saved to database: ${result}`
            });
        }
    });
}

module.exports.get = async (event, context, callback) => {
    console.log("yo");
    db.cypher({
        query: 'MATCH (project:Project {name: {name}, user: {user}}) RETURN project',
        params: {
            name: "project-blue",
            user: "user1"
        }
    }, function (err, results) {
        console.log(err, results);
        if (err) {
            return callback(null, {
                message: 'Error saving new node to database:',
                err
            });
        } else {
            console.log(results);
            return callback(null, {
                message: `Node found: ${JSON.stringify(results.length)}`
            });
        }
    });
};