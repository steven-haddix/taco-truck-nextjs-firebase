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
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
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
    const auth = getAuth();

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCred.user, {
        displayName,
      });

      router.push("/account/dashboard");
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
