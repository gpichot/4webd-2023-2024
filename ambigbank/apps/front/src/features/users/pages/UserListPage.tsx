import { Table } from "@mantine/core";
import { useGetUsersQuery } from "../query-hooks";

// Using Mantine
export default function UserListPage() {
  const usersQuery = useGetUsersQuery();

  if (usersQuery.isLoading) {
    return <>Loading...</>;
  }

  if (usersQuery.isError || !usersQuery.data) {
    return <>Error...</>;
  }

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Td>Id</Table.Td>
          <Table.Td>First Name</Table.Td>
          <Table.Td>Last Name</Table.Td>
          <Table.Td>Email</Table.Td>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {usersQuery.data.map((user) => (
          <Table.Tr key={user.id}>
            <Table.Td>{user.id}</Table.Td>
            <Table.Td>{user.firstName}</Table.Td>
            <Table.Td>{user.lastName}</Table.Td>
            <Table.Td>{user.email}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
