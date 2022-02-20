import { Container, Grid, Paper, Space, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useUser } from "../../../context/userContext";
import IConfiguration from "../../../types/IConfiguration";

const SettingsPage = () => {
  const { loadingUser, user } = useUser();
  const [configuration, setConfiguration] = useState<IConfiguration>();

  const getConfiguration = async () => {
    const configRes = await fetch("/api/account/configuration", {
      headers: {
        Authorization: user?.token || "",
      },
    });

    const configData = await configRes.json();

    setConfiguration(configData);
  };

  useEffect(() => {
    if (!loadingUser) {
      getConfiguration();
    }
  }, [loadingUser]);

  return (
    <Container size="md">
      <Title>Settings</Title>
      <Space h="lg" />
      <Paper padding="xl" shadow="xs">
        <Title order={2}>Team</Title>
        <Container>
          <Grid>
            <Grid.Col span={12}>
              <Text weight={500} color="white">
                Team ID
              </Text>
              <Text>{configuration?.team.id}</Text>
            </Grid.Col>
            <Grid.Col span={12}>
              <Text weight={500} color="white">
                Team Name
              </Text>
              <Text>{configuration?.team.name}</Text>{" "}
            </Grid.Col>
          </Grid>
        </Container>
      </Paper>
    </Container>
  );
};

export default SettingsPage;
function userState<T>(): { configuration: any; setConfiguration: any } {
  throw new Error("Function not implemented.");
}
