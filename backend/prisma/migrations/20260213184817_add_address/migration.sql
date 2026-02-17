/*
  Warnings:

  - You are about to drop the column `addressLine` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Address` table. All the data in the column will be lost.
  - Added the required column `fullAddress` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "addressLine",
DROP COLUMN "name",
ADD COLUMN     "fullAddress" TEXT NOT NULL;
