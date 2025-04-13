import { Container, Title, Stack, TextInput, PasswordInput, Button } from "@mantine/core";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";
import { userPrefs } from "~/cookies.server.js";
import { execGql } from "~/utils/gqlAdapter.js";

export async function loader({ request }: LoaderFunctionArgs) {
    const cookieHeader = request.headers.get("Cookie");
    const cookie = (await userPrefs.parse(cookieHeader)) || {};

    console.log('COOKIES!! ' + cookie.token);

    return null;
}

export async function action({ params, request }: ActionFunctionArgs) {
    const cookieHeader = request.headers.get("Cookie");
    const cookie = (await userPrefs.parse(cookieHeader)) || {};

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

    cookie.token = req.register.token;

    return redirect("/", {
        headers: {
            "Set-Cookie": await userPrefs.serialize(cookie),
        },
    });
}

export default function Register() {
    return (
        <Container size="xs">
            <Title order={2} my="lg">Create new account</Title>
            <Form method="post">
                <Stack>
                    <TextInput name="username" label="User Name" required />
                    <TextInput name="email" label="Email" required />
                    <PasswordInput name="password" label="Password" required />
                    <PasswordInput name="confirmPassword" label="Confirm Password" required />
                    <Button type="submit">Register</Button>
                </Stack>
            </Form>
        </Container>
    )
}