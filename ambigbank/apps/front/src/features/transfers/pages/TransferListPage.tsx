import { Table } from "@mantine/core";
import { useListTransfersQuery } from "../query-hooks";

export default function TransferListPage() {
  const transfersQuery = useListTransfersQuery();

  if (transfersQuery.isLoading) {
    return <>Loading...</>;
  }

  if (transfersQuery.isError || !transfersQuery.data) {
    return <>Error...</>;
  }

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Td>Id</Table.Td>
          <Table.Td>Amount</Table.Td>
          <Table.Td>Sender</Table.Td>
          <Table.Td>Receiver</Table.Td>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {transfersQuery.data.map((transfer) => (
          <Table.Tr key={transfer.id}>
            <Table.Td>{transfer.id}</Table.Td>
            <Table.Td>{transfer.amount}</Table.Td>
            <Table.Td>{transfer.sender}</Table.Td>
            <Table.Td>{transfer.receiver}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
