import { useEffect, useState } from "react";
import { Button, Center, Paper, Title } from "@mantine/core";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import { useUser } from "../context/userContext";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  // Our custom hook to get context values
  const { loadingUser, user } = useUser();

  const profile = { username: user?.uid, message: "Awesome!!" };

  useEffect(() => {
    if (!loadingUser && user) {
      router.push("/account/dashboard");
    }
    // You also have your firebase app initialized
  }, [loadingUser, user]);

  return (
    <Center>
      <Paper mt="xl" padding="xl">
        <Title mb="xl">Next.js w/ Firebase Client-Side</Title>
        <link rel="icon" href="/favicon.ico" />

        <main>
          <p className="description">Fill in your credentials to get started</p>

          <p className="description">
            Cloud Firestore Security Rules write permissions are required for
            adding users
          </p>

          <p className="description">
            Please press the link below after adding the user
          </p>
          <Link href={`/profile/${profile.username}`} passHref>
            <a>Go to SSR Page</a>
          </Link>
        </main>
      </Paper>
    </Center>
  );
}
