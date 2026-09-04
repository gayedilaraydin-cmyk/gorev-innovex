-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('URGENT', 'NOT_URGENT', 'URGENT_HARD', 'URGENT_EASY', 'NOT_URGENT_HARD', 'NOT_URGENT_EASY');

-- AlterEnum
BEGIN;
CREATE TYPE "TaskStatus_new" AS ENUM ('TODO', 'IN_PROGRESS', 'WAITING_CLIENT', 'WAITING_TEAM', 'DONE', 'CANCELLED', 'MEETING_NOTES');
ALTER TABLE "public"."tasks" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "tasks" ALTER COLUMN "status" TYPE "TaskStatus_new" USING ("status"::text::"TaskStatus_new");
ALTER TYPE "TaskStatus" RENAME TO "TaskStatus_old";
ALTER TYPE "TaskStatus_new" RENAME TO "TaskStatus";
DROP TYPE "public"."TaskStatus_old";
ALTER TABLE "tasks" ALTER COLUMN "status" SET DEFAULT 'TODO';
COMMIT;

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "priority" "TaskPriority";
