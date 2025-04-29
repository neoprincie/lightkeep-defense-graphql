import { TextInput, PasswordInput, Button, Container, Title, Stack } from '@mantine/core';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, json, redirect } from '@remix-run/react';
import { execGql } from '~/utils/gqlAdapter.js';

import { userPrefs } from '~/cookies.server.js';

export async function loader({
  request,
}: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};

  const query = `#graphql
    query Characters {
      characters {
        name
        class {
          name
          baseHp
        }
        level
        user {
          id
          name
          email
        }
        attack
        currentHp
        defense
        experience
        id
        maxHp
      }
    } 
  `
  const req = await execGql(query, {}, cookie.token);

  console.log(req.characters)

  return null;
}


export const action = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  return null;
};


export default function Index() {
  return (
    <Container size="xs">
      <Title order={2} my="lg">Characters</Title>
      
    </Container>
  );
}
