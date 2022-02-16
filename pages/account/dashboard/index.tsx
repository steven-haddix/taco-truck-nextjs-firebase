import { Center, Container, Text } from "@mantine/core";
import { useUser } from "../../../context/userContext";

const DashboardPage = () => {
  const { loadingUser, user } = useUser();
  return (
    <Container>
      <Center>
        <Text>Welcome {user?.displayName}</Text>
      </Center>
    </Container>
  );
};

export default DashboardPage;
