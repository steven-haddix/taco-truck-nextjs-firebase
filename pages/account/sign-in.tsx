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
import { useRouter } from "next/router";

const SignInPage = () => {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validationRules: {
      email: (value) => /^\S+@\S+$/.test(value),
      password: (value) => value.trim().length > 0
    },
    errorMessages: {
      email: "Invalid email",
      password: "Invalid password",
    },
  });

  const signIn = async (email: string, password: string) => {
    signInWithEmailAndPassword(getAuth(), email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(`Logged in user: ${user}`)
        router.push("/account/dashboard");
      })
      .catch((error) => {
        form.setErrors({email: true, password: true});
        form.setFieldError("password", "Email not found or password invalid");
      });
  };

  return (
    <Container size="sm">
      <Paper padding="lg" mt="xl">
        <Title>Sign In</Title>
        <form
          onSubmit={form.onSubmit(
            (values) => signIn(values.email, values.password))
          }
          onChange={form.resetErrors}
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
