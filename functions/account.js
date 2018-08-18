const neo4j = require("neo4j");
const db = new neo4j.GraphDatabase(process.env.GRAPHENEDB_URL);

module.exports.create = async (event, context, callback) => {
    // db.cypher({
    //   query: 'MATCH (a:Artist) RETURN COUNT(a) AS count'
    // }, function(err, responses) {
    //     console.log(err, responses);
    //   return callback(null, {
    //     message: 'Currently stores ' + responses[0].count + ' artists'
    //   });
    // });
};