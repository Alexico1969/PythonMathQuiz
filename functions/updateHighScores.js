const faunadb = require('faunadb');
const q = faunadb.query;

const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
});

exports.handler = async (event, context) => {
  const data = JSON.parse(event.body);
  const { name, score } = data;

  try {
    const response = await client.query(
      q.If(
        q.Exists(q.Match(q.Index('user_by_name'), name)),
        q.Update(
          q.Select('ref', q.Get(q.Match(q.Index('user_by_name'), name))),
          { data: { score } }
        ),
        q.Create(q.Collection('highscores'), { data: { name, score } })
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