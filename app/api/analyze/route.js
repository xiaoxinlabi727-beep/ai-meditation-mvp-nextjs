import { NextResponse } from "next/server";
import { analyzeSurvey } from "../../../lib/analyzer";
import { saveSubmission } from "../../../lib/storage";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const surveyData = body?.surveyData;

    if (!surveyData || typeof surveyData !== "object") {
      return NextResponse.json(
        { success: false, error: { message: "\u7f3a\u5c11 surveyData\u3002" } },
        { status: 400 }
      );
    }

    const submission = saveSubmission(surveyData);
    const analysis = analyzeSurvey(surveyData);

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      analysis,
      storage: {
        mode: "mock_json",
        savedAt: submission.createdAt
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: { message: error.message || "\u5206\u6790\u5931\u8d25\u3002" }
      },
      { status: 500 }
    );
  }
}
