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

const Authenticated = () => {
  const router = useRouter();
  const signOutCallback = () => {
    signOut(getAuth());
    router.push("/");
  };
  return (
    <Center>
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
    </Center>
  );
};

const UnAuthenticated = () => {
  return (
    <Center>
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
    </Center>
  );
};

const HeaderComponent = () => {
  const { user, loadingUser } = useUser();

  return (
    <Header height={60} padding="xs">
      <Container size="xl">
        <Grid grow>
          {!loadingUser && <Grid.Col span={user ? 1 : 2} />}
          <Grid.Col span={!loadingUser && user ? 10 : 8}>
            <Center>
              <Text size="xl"> Taco Truck</Text>
            </Center>
          </Grid.Col>
          {!loadingUser && user && (
            <Grid.Col span={1}>
              <Authenticated />
            </Grid.Col>
          )}
          {!loadingUser && !user && (
            <Grid.Col span={2}>
              <UnAuthenticated />
            </Grid.Col>
          )}
        </Grid>
      </Container>
    </Header>
  );
};

export default HeaderComponent;
