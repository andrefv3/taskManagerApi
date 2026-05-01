/*
  Warnings:

  - You are about to drop the column `dueDate` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "dueDate",
ADD COLUMN     "effort" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "impact" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "priorityScore" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Task_priorityScore_idx" ON "Task"("priorityScore" DESC);
