import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const userId = parseInt(searchParams.get('userId') || '1');

  try {
    switch (type) {
      case 'fitness-summary':
        const fitnessGoals = await prisma.fitnessGoal.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(fitnessGoals);

      case 'smoking-summary':
        const smokingGoals = await prisma.smokingGoal.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(smokingGoals);

      case 'cravings':
        const cravings = await prisma.craving.findMany({
          where: { userId },
          orderBy: { date: 'desc' },
          take: 10,
        });
        return NextResponse.json(cravings);

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, userId = 1, data } = body;

    // Ensure user exists
    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId },
    });

    switch (type) {
      case 'fitness':
        const fitnessGoal = await prisma.fitnessGoal.create({
          data: {
            userId: user.id,
            goalType: data.goalType,
            targetValue: data.targetValue,
            currentValue: data.value,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            status: 'active',
          },
        });
        return NextResponse.json(fitnessGoal);

      case 'fitness-progress':
        const fitnessProgress = await prisma.fitnessProgress.create({
          data: {
            userId: user.id,
            goalId: data.goalId,
            value: data.value,
            date: new Date(data.date),
            notes: data.notes,
          },
        });
        return NextResponse.json(fitnessProgress);

      case 'smoking':
        const smokingGoal = await prisma.smokingGoal.create({
          data: {
            userId: user.id,
            targetCigarettesPerDay: data.targetCigarettesPerDay,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            status: 'active',
          },
        });
        return NextResponse.json(smokingGoal);

      case 'smoking-progress':
        const smokingProgress = await prisma.smokingProgress.create({
          data: {
            userId: user.id,
            goalId: data.goalId,
            cigarettesPerDay: data.cigarettesPerDay,
            date: new Date(data.date),
            notes: data.notes,
          },
        });
        return NextResponse.json(smokingProgress);

      case 'craving':
        const craving = await prisma.craving.create({
          data: {
            userId: user.id,
            intensity: data.intensity,
            trigger: data.trigger,
            notes: data.notes,
            date: new Date(),
          },
        });
        return NextResponse.json(craving);

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error creating record:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 