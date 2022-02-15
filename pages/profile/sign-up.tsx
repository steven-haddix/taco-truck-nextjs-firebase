import { Button, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const doCreateUserWithEmailAndPassword = (email: string, password: string) =>
  createUserWithEmailAndPassword(getAuth(), email, password);

const doSignInWithEmailAndPassword = (email: string, password: string) =>
  signInWithEmailAndPassword(getAuth(), email, password);

const doSignOut = () => signOut(getAuth());

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
    <form
      onSubmit={form.onSubmit((values) =>
        doSignInWithEmailAndPassword(values.email, values.password)
      )}
    >
      <TextInput
        required
        label="Email"
        placeholder="your@email.com"
        {...form.getInputProps("email")}
      />
      <PasswordInput
        placeholder="Your password"
        label="Password"
        {...form.getInputProps("password")}
        required
      />
      <Button type="submit">Login</Button>
    </form>
  );
};

export default SignInPage;
