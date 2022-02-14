import { useEffect, useState } from "react";
import {
  AppShell,
  Button,
  Header,
  Input,
  Navbar,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import { useUser } from "../context/userContext";

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

export default function Home() {
  // Our custom hook to get context values
  const { loadingUser, user } = useUser();

  const profile = { username: "nextjs_user", message: "Awesome!!" };

  useEffect(() => {
    if (!loadingUser) {
      // You know that the user is loaded: either logged in or out!
      console.log(user);
    }
    // You also have your firebase app initialized
  }, [loadingUser, user]);

  const createUser = async () => {
    const db = getFirestore();
    await setDoc(doc(db, "profile", profile.username), {
      profile,
    });

    alert("User created!!");
  };

  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 300 }} height={500} padding="xs">
          {/* Navbar content */}
        </Navbar>
      }
      header={
        <Header height={60} padding="xs">
          Taco Truck
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <div className="container">
        <Head>
          <title>Next.js w/ Firebase Client-Side</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <h1 className="title">Next.js w/ Firebase Client-Side</h1>
          <p className="description">Fill in your credentials to get started</p>

          {!loadingUser && !user ? (
            <SignInPage />
          ) : (
            <div>
              <div>Hello</div>
              <Button onClick={() => doSignOut()}>Sign Out</Button>
            </div>
          )}

          <p className="description">
            Cloud Firestore Security Rules write permissions are required for
            adding users
          </p>
          <button onClick={createUser}>Create 'nextjs_user'</button>

          <p className="description">
            Please press the link below after adding the user
          </p>
          <Link href={`/profile/${profile.username}`} passHref>
            <a>Go to SSR Page</a>
          </Link>
        </main>

        <style jsx>{`
          .container {
            min-height: 100vh;
            padding: 0 0.5rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          main {
            padding: 5rem 0;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          footer {
            width: 100%;
            height: 100px;
            border-top: 1px solid #eaeaea;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          footer img {
            margin-left: 0.5rem;
          }

          footer a {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          button {
            font-size: 1.5em;
            margin: 1em 0;
          }

          a {
            color: blue;
            font-size: 1.5em;
          }

          .title a {
            color: #0070f3;
            text-decoration: none;
          }

          .title a:hover,
          .title a:focus,
          .title a:active {
            text-decoration: underline;
          }

          .title {
            margin: 0;
            line-height: 1.15;
            font-size: 4rem;
          }

          .title,
          .description {
            text-align: center;
          }

          .description {
            line-height: 1.5;
            font-size: 1.5rem;
          }

          code {
            background: #fafafa;
            border-radius: 5px;
            padding: 0.75rem;
            font-size: 1.1rem;
            font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
              DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
          }

          .grid {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            max-width: 800px;
            margin-top: 3rem;
          }

          .card {
            margin: 1rem;
            flex-basis: 45%;
            padding: 1.5rem;
            text-align: left;
            color: inherit;
            text-decoration: none;
            border: 1px solid #eaeaea;
            border-radius: 10px;
            transition: color 0.15s ease, border-color 0.15s ease;
          }

          .card:hover,
          .card:focus,
          .card:active {
            color: #0070f3;
            border-color: #0070f3;
          }

          .card h3 {
            margin: 0 0 1rem 0;
            font-size: 1.5rem;
          }

          .card p {
            margin: 0;
            font-size: 1.25rem;
            line-height: 1.5;
          }

          @media (max-width: 600px) {
            .grid {
              width: 100%;
              flex-direction: column;
            }
          }
        `}</style>

        <style jsx global>{`
          html,
          body {
            padding: 0;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
              Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
              sans-serif;
          }

          * {
            box-sizing: border-box;
          }
        `}</style>
      </div>
    </AppShell>
  );
}
