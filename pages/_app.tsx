import {
  AppShell,
  Container,
  MantineProvider,
  Navbar,
  Tabs,
} from "@mantine/core";
import { BsGear } from "react-icons/bs";
import { AiOutlineDashboard } from "react-icons/ai";
import Header from "../components/Header";
import UserProvider from "../context/userContext";
import Link from "next/link";
import "../styles/reset.css";

// Custom App to wrap it with context provider
export default function App({
  Component,
  pageProps,
}: {
  Component: any;
  pageProps: any;
}) {
  return (
    <UserProvider>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: "dark",
          fontSizes: {
            xl: 32,
          },
        }}
      >
        <AppShell
          padding="md"
          header={<Header />}
          styles={(theme) => ({
            main: {
              height: "100vh",
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0],
            },
          })}
        >
          <Component {...pageProps} />
        </AppShell>
      </MantineProvider>
    </UserProvider>
  );
}
