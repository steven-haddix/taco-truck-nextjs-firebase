import { Container, Tabs } from "@mantine/core";
import { useRouter } from "next/router";
import { useUser } from "../context/userContext";

const routes = [
  { position: 0, key: "/account/dashboard", label: "Leader Board" },
  { position: 1, key: "/account/settings", label: "Settings" },
  ,
];

const AccountHeader = () => {
  const router = useRouter();
  const { user, loadingUser } = useUser();

  const getActiveTab = () => {
    const activeRoute = routes.find((route) => {
      console.log(router.pathname);
      return route?.key === router.pathname;
    });
    return activeRoute?.position;
  };

  const activeTab = getActiveTab();

  const handleTabChange = (tabIndex: number, tabKey?: string | undefined) => {
    if (tabKey) {
      router.push(tabKey);
    }
  };

  return (
    <>
      {!loadingUser && user ? (
        <Container size="md" mt={20}>
          <Tabs
            active={activeTab}
            onTabChange={handleTabChange}
            styles={{
              tabsListWrapper: {
                borderBottom: "none !important",
              },
            }}
          >
            {routes.map((route) => {
              return (
                <Tabs.Tab
                  key={route?.key}
                  tabKey={route?.key}
                  label={route?.label}
                />
              );
            })}
          </Tabs>
        </Container>
      ) : (
        <Container mt={20}></Container>
      )}
    </>
  );
};

export default AccountHeader;
