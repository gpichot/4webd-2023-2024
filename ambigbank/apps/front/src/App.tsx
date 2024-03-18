import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { Button, Divider, MantineProvider, NavLink } from "@mantine/core";
import { AppShell, Burger, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createBrowserRouter,
  Outlet,
  Link,
  RouterProvider,
} from "react-router-dom";
import { SignInForm, UserListPage, useAuthContext } from "./features/users";
import { BankAccountsListPage } from "./features/accounts";
import { AuthProvider } from "./features/users/context";
import { Notifications } from "@mantine/notifications";
import TransferListPage from "./features/transfers/pages/TransferListPage";

const queryClient = new QueryClient();

export default function App() {
  return (
    <MantineProvider>
      <Notifications />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthProvider>
      </QueryClientProvider>
    </MantineProvider>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <BasicAppShell />,
    children: [
      { path: "/", element: <>Hello</> },
      { path: "/clients", element: <UserListPage /> },
      { path: "/accounts", element: <BankAccountsListPage /> },
      { path: "/transactions", element: <TransferListPage /> },
    ],
  },
]);

export function BasicAppShell() {
  const [opened, { toggle }] = useDisclosure();

  const auth = useAuthContext();

  if (!auth.token) {
    return <SignInForm />;
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <NavLink component={Link} to="/clients" label="Clients" />
        <NavLink component={Link} to="/accounts" label="Comptes" />
        <NavLink component={Link} to="/transactions" label="Transactions" />

        <Divider my="md" />
        <Button onClick={() => auth.signOut()}>Déconnexion</Button>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
