-- CreateTable
CREATE TABLE "APPOINTMENT" (
    "id_appointment" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "requested_date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "APPOINTMENT_pkey" PRIMARY KEY ("id_appointment")
);

-- CreateTable
CREATE TABLE "CUSTOM_FILES" (
    "id_file" SERIAL NOT NULL,
    "config_name" TEXT NOT NULL,
    "json_schema" TEXT NOT NULL,

    CONSTRAINT "CUSTOM_FILES_pkey" PRIMARY KEY ("id_file")
);

-- CreateTable
CREATE TABLE "EXAM" (
    "id_exam" SERIAL NOT NULL,
    "id_type" INTEGER NOT NULL,
    "id_file" INTEGER NOT NULL,

    CONSTRAINT "EXAM_pkey" PRIMARY KEY ("id_exam")
);

-- CreateTable
CREATE TABLE "EXAM_APPOINTMENT_DETAIL" (
    "id_detail" SERIAL NOT NULL,
    "id_appointment" INTEGER NOT NULL,
    "id_exam" INTEGER NOT NULL,
    "patient_observations" TEXT,

    CONSTRAINT "EXAM_APPOINTMENT_DETAIL_pkey" PRIMARY KEY ("id_detail")
);

-- CreateTable
CREATE TABLE "EXAM_TYPE" (
    "id_type" SERIAL NOT NULL,
    "category_name" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "requirements" TEXT,

    CONSTRAINT "EXAM_TYPE_pkey" PRIMARY KEY ("id_type")
);

-- CreateTable
CREATE TABLE "RESULT" (
    "id_result" SERIAL NOT NULL,
    "id_appointment_detail" INTEGER NOT NULL,
    "delivery_date" TIMESTAMP(3) NOT NULL,
    "result_data" TEXT,

    CONSTRAINT "RESULT_pkey" PRIMARY KEY ("id_result")
);

-- CreateTable
CREATE TABLE "ROLE" (
    "id_role" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ROLE_pkey" PRIMARY KEY ("id_role")
);

-- CreateTable
CREATE TABLE "USER" (
    "id_user" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "id_role" INTEGER NOT NULL DEFAULT 3,

    CONSTRAINT "USER_pkey" PRIMARY KEY ("id_user")
);

-- CreateIndex
CREATE UNIQUE INDEX "RESULT_id_appointment_detail_key" ON "RESULT"("id_appointment_detail");

-- CreateIndex
CREATE UNIQUE INDEX "USER_uid_key" ON "USER"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "USER_email_key" ON "USER"("email");

-- AddForeignKey
ALTER TABLE "APPOINTMENT" ADD CONSTRAINT "APPOINTMENT_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "USER"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EXAM" ADD CONSTRAINT "EXAM_id_file_fkey" FOREIGN KEY ("id_file") REFERENCES "CUSTOM_FILES"("id_file") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EXAM" ADD CONSTRAINT "EXAM_id_type_fkey" FOREIGN KEY ("id_type") REFERENCES "EXAM_TYPE"("id_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EXAM_APPOINTMENT_DETAIL" ADD CONSTRAINT "EXAM_APPOINTMENT_DETAIL_id_appointment_fkey" FOREIGN KEY ("id_appointment") REFERENCES "APPOINTMENT"("id_appointment") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EXAM_APPOINTMENT_DETAIL" ADD CONSTRAINT "EXAM_APPOINTMENT_DETAIL_id_exam_fkey" FOREIGN KEY ("id_exam") REFERENCES "EXAM"("id_exam") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RESULT" ADD CONSTRAINT "RESULT_id_appointment_detail_fkey" FOREIGN KEY ("id_appointment_detail") REFERENCES "EXAM_APPOINTMENT_DETAIL"("id_detail") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "USER" ADD CONSTRAINT "USER_id_role_fkey" FOREIGN KEY ("id_role") REFERENCES "ROLE"("id_role") ON DELETE RESTRICT ON UPDATE CASCADE;
