import { NextResponse } from 'next/server';
import {
  createFitnessGoal,
  recordFitnessProgress,
  createSmokingGoal,
  recordSmokingProgress,
  recordCraving,
  getFitnessProgress,
  getSmokingProgress,
  getCravings,
  getFitnessProgressSummary,
  getSmokingProgressSummary,
  createDefaultUser,
} from '@/lib/db-utils';

// Ensure default user exists
createDefaultUser();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    switch (type) {
      case 'fitness-goal':
        const fitnessGoal = await createFitnessGoal(data);
        return NextResponse.json(fitnessGoal);

      case 'fitness-progress':
        const fitnessProgress = await recordFitnessProgress(data);
        return NextResponse.json(fitnessProgress);

      case 'smoking-goal':
        try {
          const smokingGoal = await createSmokingGoal(data);
          return NextResponse.json(smokingGoal);
        } catch (error) {
          console.error('Error creating smoking goal:', error);
          return NextResponse.json(
            { error: 'Failed to create smoking goal. Please try again.' },
            { status: 500 }
          );
        }

      case 'smoking-progress':
        const smokingProgress = await recordSmokingProgress(data);
        return NextResponse.json(smokingProgress);

      case 'craving':
        const craving = await recordCraving(data);
        return NextResponse.json(craving);

      default:
        return NextResponse.json(
          { error: 'Invalid tracking type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in tracking API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const userId = searchParams.get('userId');
    const goalId = searchParams.get('goalId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    switch (type) {
      case 'fitness-progress':
        if (!goalId) {
          return NextResponse.json(
            { error: 'Goal ID is required for fitness progress' },
            { status: 400 }
          );
        }
        const fitnessProgress = await getFitnessProgress(
          parseInt(userId),
          parseInt(goalId)
        );
        return NextResponse.json(fitnessProgress);

      case 'smoking-progress':
        const smokingProgress = await getSmokingProgress(parseInt(userId));
        return NextResponse.json(smokingProgress);

      case 'cravings':
        const cravings = await getCravings(parseInt(userId));
        return NextResponse.json(cravings);

      case 'fitness-summary':
        const fitnessSummary = await getFitnessProgressSummary(parseInt(userId));
        return NextResponse.json(fitnessSummary);

      case 'smoking-summary':
        const smokingSummary = await getSmokingProgressSummary(parseInt(userId));
        return NextResponse.json(smokingSummary);

      default:
        return NextResponse.json(
          { error: 'Invalid tracking type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in tracking API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 