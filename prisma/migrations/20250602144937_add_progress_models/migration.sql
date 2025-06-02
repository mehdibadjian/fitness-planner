-- CreateTable
CREATE TABLE "FitnessProgress" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "goalId" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FitnessProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmokingProgress" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "goalId" INTEGER NOT NULL,
    "cigarettesPerDay" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmokingProgress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FitnessProgress" ADD CONSTRAINT "FitnessProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FitnessProgress" ADD CONSTRAINT "FitnessProgress_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "FitnessGoal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SmokingProgress" ADD CONSTRAINT "SmokingProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SmokingProgress" ADD CONSTRAINT "SmokingProgress_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "SmokingGoal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
