import { Button, Center, Container, PasswordInput, Stack, TextInput, Title, Text, Anchor } from "@mantine/core"
import { Form, Link } from "@remix-run/react"

export default function Login() {
    return (
        <Container size="xs">
            <Title order={2} my="lg">Login</Title>
            <Form method="post">
                <Stack>
                    <TextInput name="username" label="User Name" required />
                    <PasswordInput name="password" label="Password" required />
                    <Button type="submit">Login</Button>
                </Stack>
            </Form>

            <Center mt="md">
                <Text>
                    Don't have an account? <Anchor component={Link} to="/register">Create one</Anchor>!
                </Text>
            </Center>
        </Container>
    )
}