import { NextResponse } from "next/server";
import { analyzeSurvey } from "../../../lib/analyzer";
import { generateMeditationText } from "../../../lib/mock-openai";
import { composePrompt } from "../../../lib/prompt-templates";
import { getSubmission, saveGeneration } from "../../../lib/storage";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const submissionId = body?.submissionId;
    const fallbackSurveyData = body?.surveyData;
    const fallbackAnalysis = body?.analysis;

    if (!submissionId && (!fallbackSurveyData || typeof fallbackSurveyData !== "object")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message:
              "\u7f3a\u5c11 submissionId\uff0c\u4e14\u6ca1\u6709\u63d0\u4f9b surveyData\u3002"
          }
        },
        { status: 400 }
      );
    }

    const submission = submissionId ? getSubmission(submissionId) : null;
    const surveyData = submission?.surveyData || fallbackSurveyData;

    if (!surveyData) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message:
              "\u6ca1\u6709\u627e\u5230\u5bf9\u5e94\u95ee\u5377\u8bb0\u5f55\uff0c\u4e5f\u6ca1\u6709\u53ef\u7528\u4e8e\u751f\u6210\u7684 surveyData\u3002"
          }
        },
        { status: 404 }
      );
    }

    const analysis =
      fallbackAnalysis && typeof fallbackAnalysis === "object"
        ? fallbackAnalysis
        : analyzeSurvey(surveyData);
    const prompt = composePrompt(surveyData, analysis);
    const generated = generateMeditationText(surveyData, analysis, prompt);
    const generation = saveGeneration({
      submissionId: submissionId || null,
      analysis,
      prompt,
      script: generated.script
    });

    return NextResponse.json({
      success: true,
      generationId: generation.id,
      analysis,
      promptMeta: generated.promptMeta,
      script: generated.script,
      storage: {
        mode: "mock_json",
        savedAt: generation.createdAt
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: { message: error.message || "\u751f\u6210\u5931\u8d25\u3002" }
      },
      { status: 500 }
    );
  }
}
