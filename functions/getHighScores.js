const faunadb = require('faunadb');
const q = faunadb.query;

const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
});

exports.handler = async (event, context) => {
  try {
    const response = await client.query(
      q.Map(
        q.Paginate(q.Match(q.Index('all_users'))),
        q.Lambda("X", q.Get(q.Var("X")))
      )
    );
    console.log('FaunaDB response:', response);
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error('Error querying FaunaDB:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};