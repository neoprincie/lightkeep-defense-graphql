import { TextInput, PasswordInput, Button, Container, Title, Stack } from '@mantine/core';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, json, redirect } from '@remix-run/react';
import { execGql } from '~/utils/gqlAdapter.js';

import { userPrefs } from '~/cookies.server.js';

export async function loader({
  request,
}: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie =
    (await userPrefs.parse(cookieHeader)) || {};

  console.log('COOKIES!! ' + cookie.token);
  return json({ showBanner: cookie.token });
}


export const action = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie =
    (await userPrefs.parse(cookieHeader)) || {};
  //invariant(params.contactId, "Missing contactId param");
  const formData = await request.formData();
  const registerInfo = Object.fromEntries(formData);

  const query = `#graphql
      mutation($email: String!, $username: String!, $password: String!) {
          register(email: $email, username: $username, password: $password) {
              token
              user {
                  name
                  id
                  email
              }
          }
      }
  `

  const variables = {
      "email": registerInfo.email,
      "username": registerInfo.username,
      "password": registerInfo.password
  }

  const req = await execGql(query, variables);
  
  //console.log(req.register.token)
  //console.log(req.register.user)

  //console.log(registerInfo.password)
  //console.log(registerInfo.confirmPassword)

  //const cookie = createCookie("user");
  cookie.token = req.register.token;

  //return req.register;
  return redirect("/", {
    headers: {
      "Set-Cookie": await userPrefs.serialize(cookie),
    },
  });

  //return null;
  //await updateContact(params.contactId, updates);
  //return redirect(`/contacts/${params.contactId}`);
};


export default function Index() {
  return (
    <Container size="xs">
      <Title order={2} my="lg">Characters</Title>
      
    </Container>
  );
}
