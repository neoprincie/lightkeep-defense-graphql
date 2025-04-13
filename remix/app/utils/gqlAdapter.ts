//import dotenv from 'dotenv';

//dotenv.config();

export const execGql = async (query: any, variables = {}, token = '') => {
    let headers
    if (token === '') {
      headers = {
        'Content-Type': 'application/json',
        Accept: "application/json"
      }
    }
    else {
      headers = {
        'Content-Type': 'application/json',
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      }
    }

    const req = await fetch('http://localhost:8080/', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          query: query,
          variables: variables
        }),
      });

    const res = await req.json();

    return res.data;
}