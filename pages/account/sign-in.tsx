import {
  Button,
  Container,
  Paper,
  PasswordInput,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const doSignInWithEmailAndPassword = (email: string, password: string) =>
  signInWithEmailAndPassword(getAuth(), email, password);

const SignInPage = () => {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validationRules: {
      email: (value) => /^\S+@\S+$/.test(value),
    },
  });
  return (
    <Container size="sm">
      <Paper padding="lg" mt="xl">
        <Title>Sign In</Title>
        <form
          onSubmit={form.onSubmit((values) =>
            doSignInWithEmailAndPassword(values.email, values.password)
          )}
        >
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
            Sign In
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default SignInPage;
