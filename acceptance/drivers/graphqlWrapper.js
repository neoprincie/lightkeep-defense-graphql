
export const request = async (query) => {
    const req = await fetch('https://lightkeep-defense-graphql.fly.dev/', {
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