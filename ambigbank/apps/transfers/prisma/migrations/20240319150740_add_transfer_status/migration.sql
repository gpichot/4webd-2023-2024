-- CreateEnum
CREATE TYPE "TransferStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "MoneyTransfer" ADD COLUMN     "errorReason" TEXT,
ADD COLUMN     "status" "TransferStatus" NOT NULL DEFAULT 'PENDING';
