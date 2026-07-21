export function calculateBMI(heightCm, weightKg) {
  const meters = Number(heightCm) / 100;
  if (!meters || !weightKg) return 0;
  return Number((Number(weightKg) / (meters * meters)).toFixed(1));
}

export function validateSurveyData(data) {
  const requiredFields = [
    "nickname",
    "gender",
    "age",
    "heightCm",
    "weightKg",
    "goalWeightKg",
    "timeline",
    "innerVoice",
    "bodyFocus",
    "idealImage",
    "safeScene",
    "languageStyle",
    "voicePreference",
    "favoriteFood",
    "animalImage"
  ];

  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === "") {
      throw new Error(`缺少必要字段：${field}`);
    }
  }

  if (!Array.isArray(data.reasons) || data.reasons.length === 0) {
    throw new Error("减肥原因至少需要选择一项。");
  }

  if (!Array.isArray(data.triggers) || data.triggers.length === 0) {
    throw new Error("吃多场景至少需要选择一项。");
  }
}

export function analyzeSurvey(data) {
  validateSurveyData(data);

  const reasons = data.reasons || [];
  const triggers = data.triggers || [];
  const bmi = calculateBMI(data.heightCm, data.weightKg);

  let healthScore = 0;
  let beautyScore = 0;

  if (bmi >= 28) healthScore += 3;
  else if (bmi >= 24) healthScore += 1;

  if (reasons.includes("健康")) healthScore += 2;
  if (reasons.includes("体能")) healthScore += 2;
  if (reasons.includes("医生建议")) healthScore += 3;

  if (["膝盖", "腰背", "心肺", "睡眠", "整体精力"].includes(data.bodyFocus)) {
    healthScore += 2;
  }

  if (reasons.includes("外貌")) beautyScore += 2;
  if (reasons.includes("穿衣")) beautyScore += 2;
  if (reasons.includes("自信提升")) beautyScore += 2;
  if (data.idealImage) beautyScore += 1;
  if (data.animalImage) beautyScore += 1;

  let primaryPath = "美学提升型";
  if (healthScore >= beautyScore && healthScore >= 4) {
    primaryPath = "健康改善型";
  }

  let psychProfile = "习惯型进食";
  if (triggers.some((item) => ["压力大", "疲惫", "孤独"].includes(item))) {
    psychProfile = "压力进食型";
  }
  if (triggers.some((item) => ["奖励自己", "工作结束后"].includes(item)) || data.innerVoice === "今天太累了，应该奖励自己") {
    psychProfile = "奖励型进食";
  }
  if (triggers.some((item) => ["看到别人吃", "家里有囤货", "熬夜"].includes(item))) {
    psychProfile = "习惯型进食";
  }
  if (["我控制不住", "反正已经胖了，再吃一点也没关系"].includes(data.innerVoice)) {
    psychProfile = "自我控制困难型";
  }

  const pathDescription =
    primaryPath === "健康改善型"
      ? "你的动力更偏向身体轻松感、健康恢复和功能改善。引导语会更强调身体合作、呼吸空间和稳定选择。"
      : "你的动力更偏向外形、自信和轻盈状态。引导语会更强调奖励重构、体态变化和未来镜像。";

  const psychDescriptionMap = {
    压力进食型: "你更容易在紧绷或压力升高时，把食物当作快速安抚。内容会更偏向情绪缓和和身体放松。",
    奖励型进食: "你更容易把吃当成犒劳。内容会更偏向新的奖励方式学习，让满足感慢慢从食物转向身体照顾。",
    习惯型进食: "你更容易在环境、时间点或固定习惯里不自觉地吃多。内容会更偏向暂停、觉察和微小转向。",
    自我控制困难型: "你更容易陷入已经这样了或我控制不住的循环。内容会更偏向自我效能和非评判的重新开始。"
  };

  return {
    bmi,
    healthScore,
    beautyScore,
    primaryPath,
    psychProfile,
    pathDescription,
    psychDescription: psychDescriptionMap[psychProfile],
    promptPathKey: primaryPath === "健康改善型" ? "health_path" : "beauty_path",
    promptProfileKey: psychProfile
  };
}
