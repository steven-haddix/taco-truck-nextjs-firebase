import {
  Button,
  Container,
  Paper,
  PasswordInput,
  TextInput,
  Text,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import { useState } from "react";

const SignUpPage = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>("");

  const doCreateUserWithEmailAndPassword = async (
    displayName: string,
    email: string,
    password: string
  ) => {
    try {
      // TODO: create generic API handler
      const response = await fetch("/api/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ displayName, email, password }),
      });

      if (response.ok) {
        // TODO: There is probably a better way to auto-login users
        signInWithEmailAndPassword(getAuth(), email, password);
        router.push("/account/dashboard");
      }
      const body = await response.json();
      throw new Error(body.message);
    } catch (err) {
      setServerError(err.message);
      console.error(err);
    }
  };

  const form = useForm({
    initialValues: {
      displayName: "",
      email: "",
      password: "",
    },

    validationRules: {
      email: (value) => /^\S+@\S+$/.test(value),
      displayName: (value) => value.trim().length >= 2,
      password: (value) => value.trim().length >= 2,
    },
  });

  return (
    <Container size="sm">
      <Paper padding="lg" mt="xl">
        <Title>Register New Account</Title>
        {serverError && <Text color="red">{serverError}</Text>}
        <form
          onSubmit={form.onSubmit((values) =>
            doCreateUserWithEmailAndPassword(
              values.displayName,
              values.email,
              values.password
            )
          )}
        >
          <TextInput
            required
            mt="lg"
            label="Display Name"
            placeholder="John Smith"
            {...form.getInputProps("displayName")}
          />
          <TextInput
            required
            mt="lg"
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            required
            mt="lg"
            placeholder="Your password"
            label="Password"
            {...form.getInputProps("password")}
          />
          <Button mt="lg" type="submit">
            Register
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default SignUpPage;
