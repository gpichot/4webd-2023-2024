import { Button, Table } from "@mantine/core";
import { Link } from "react-router-dom";
import { useListAccountsQuery } from "../query-hooks";

export default function BankAccountListPage() {
  const bankAccountsQuery = useListAccountsQuery();

  if (bankAccountsQuery.isLoading) {
    return <>Loading...</>;
  }

  if (bankAccountsQuery.isError || !bankAccountsQuery.data) {
    return <>Error...</>;
  }

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Td>Id</Table.Td>
          <Table.Td>Balance</Table.Td>
          <Table.Td>Actions</Table.Td>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {bankAccountsQuery.data.map((bankAccount) => (
          <Table.Tr key={bankAccount.id}>
            <Table.Td>{bankAccount.id}</Table.Td>
            <Table.Td>{bankAccount.balance}</Table.Td>
            <Table.Td>
              <Button
                component={Link}
                to={`/accounts/${bankAccount.id}`}
                color="blue"
                disabled
              >
                View
              </Button>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
