import { Avatar, Center, Container, Grid, Header, Text } from "@mantine/core";
import { useUser } from "../context/userContext";
import IUser from "../types/IUser";

const HeaderComponent = () => {
  const { user, loadingUser } = useUser();
  return (
    <Header height={60} padding="xs">
      <Container size="xl">
        <Grid grow>
          <Grid.Col span={1} />
          <Grid.Col span={10}>
            <Center>
              <Text size="xl"> Taco Truck</Text>
            </Center>
          </Grid.Col>
          <Grid.Col span={1}>
            <Center>
              <Avatar color="cyan" radius="xl">
                SH
              </Avatar>
            </Center>
          </Grid.Col>
        </Grid>
      </Container>
    </Header>
  );
};

export default HeaderComponent;
