-- AlterTable
ALTER TABLE "EXAM_TYPE" ADD COLUMN     "id_class" INTEGER;

-- CreateTable
CREATE TABLE "CLASS_EXAM" (
    "id_class" SERIAL NOT NULL,
    "class_name" TEXT NOT NULL,

    CONSTRAINT "CLASS_EXAM_pkey" PRIMARY KEY ("id_class")
);

-- AddForeignKey
ALTER TABLE "EXAM_TYPE" ADD CONSTRAINT "EXAM_TYPE_id_class_fkey" FOREIGN KEY ("id_class") REFERENCES "CLASS_EXAM"("id_class") ON DELETE SET NULL ON UPDATE CASCADE;
