import {
  Avatar,
  Button,
  Center,
  Container,
  Grid,
  Group,
  Header,
  Menu,
  Text,
} from "@mantine/core";
import { VscSignOut } from "react-icons/vsc";
import { getAuth, signOut } from "firebase/auth";
import { useUser } from "../context/userContext";
import IUser from "../types/IUser";
import Link from "next/link";
import { useRouter } from "next/router";
import SlackButton from "./SlackButton";

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
    <>
      <Link href="/account/sign-in" passHref>
        <Button mr="lg" component="a">
          Login
        </Button>
      </Link>
      <Link href="/account/sign-up" passHref>
        <Button component="a" variant="outline">
          Sign Up
        </Button>
      </Link>
    </>
  );
};

const HeaderComponent = () => {
  const { user, loadingUser } = useUser();

  return (
    <Header height="auto" padding="xs">
      <Container size="xl">
        <Grid grow>
          <Grid.Col span={2}>
            <Center style={{ height: "100%" }}>
              {!loadingUser && user && <SlackButton />}
            </Center>
          </Grid.Col>
          <Grid.Col span={!loadingUser && user ? 8 : 8}>
            <Center style={{ height: "100%" }}>
              <Text size="xl"> Taco Truck</Text>
            </Center>
          </Grid.Col>
          {!loadingUser && user && (
            <Grid.Col span={2}>
              <Center style={{ height: "100%" }}>
                <Authenticated />
              </Center>
            </Grid.Col>
          )}
          {!loadingUser && !user && (
            <Grid.Col span={2}>
              <Center style={{ height: "100%" }}>
                <UnAuthenticated />
              </Center>
            </Grid.Col>
          )}
        </Grid>
      </Container>
    </Header>
  );
};

export default HeaderComponent;
