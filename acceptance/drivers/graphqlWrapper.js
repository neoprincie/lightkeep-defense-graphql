import dotenv from 'dotenv';

dotenv.config();

export const request = async (query) => {
    const req = await fetch(process.env.GRAPHQL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: query
        }),
      });

    const res = await req.json();

    return res.data;
}