import {
  Avatar,
  Box,
  Button,
  Center,
  Container,
  Grid,
  Group,
  Header,
  Menu,
  Tabs,
  Text,
} from "@mantine/core";
import { VscSignOut } from "react-icons/vsc";
import { getAuth, signOut } from "firebase/auth";
import { useUser } from "../context/userContext";
import IUser from "../types/IUser";
import Link from "next/link";
import { useRouter } from "next/router";
import SlackButton from "./SlackButton";
import { useState } from "react";
import { route } from "next/dist/server/router";
import AccountHeader from "./AccountHeader";

const Authenticated = () => {
  const router = useRouter();
  const signOutCallback = () => {
    signOut(getAuth());
    router.push("/");
  };
  return (
    <>
      <Group position="center">
        <Menu
          placement="start"
          control={
            <Avatar color="cyan" radius="xl">
              SH
            </Avatar>
          }
        >
          <Menu.Item
            color="red"
            icon={<VscSignOut />}
            onClick={signOutCallback}
          >
            Sign Out
          </Menu.Item>
        </Menu>
      </Group>
    </>
  );
};

const UnAuthenticated = () => {
  return (
    <Grid>
      <Grid.Col span={6}>
        <Link href="/account/sign-in" passHref>
          <Button mr="lg" component="a">
            Login
          </Button>
        </Link>
      </Grid.Col>
      <Grid.Col span={6}>
        <Link href="/account/sign-up" passHref>
          <Button component="a" variant="outline">
            Sign Up
          </Button>
        </Link>
      </Grid.Col>
    </Grid>
  );
};

const HeaderComponent = () => {
  const { user, loadingUser } = useUser();
  return (
    <Header height="auto">
      <Container size="lg" mt={"lg"}>
        <Grid grow>
          <Grid.Col span={2} sx={{ display: "flex", alignItems: "center" }}>
            {!loadingUser && user && <SlackButton />}
          </Grid.Col>
          <Grid.Col span={!loadingUser && user ? 8 : 8}>
            <Center style={{ height: "100%" }}>
              <Text size="xl"> Taco Truck</Text>
            </Center>
          </Grid.Col>
          {!loadingUser && user && (
            <Grid.Col
              span={2}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Authenticated />
            </Grid.Col>
          )}
          {!loadingUser && !user && (
            <Grid.Col
              span={2}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <UnAuthenticated />
            </Grid.Col>
          )}
        </Grid>
      </Container>
      <AccountHeader />
    </Header>
  );
};

export default HeaderComponent;
