export type TransferAcknowledgedEvent =
  | {
      transferId: string;
      ok: true;
      reason: null;
    }
  | {
      transferId: string;
      ok: false;
      reason: string;
    };

export type TransferInitiatedEvent = {
  type: "transfer:initiated";
  transferId: string;
  fromAccountId: string;
  toAccountId: string;
  amount: string;
  userId: string;
};
