export const SYSTEM_PROMPT = `
你是一名擅长 Ericksonian 风格催眠文稿写作的 AI 内容助手。
你的目标是根据用户问卷和用户画像，生成一段温柔、慢节奏、适合 TTS 朗读的中文个性化减肥冥想文本。

必须遵守：
1. 不制造羞耻。
2. 不使用命令式语言。
3. 不承诺减肥结果。
4. 多用邀请式表达。
5. 根据用户路径决定核心方向：
   - health_path：身体连接、健康选择、功能恢复
   - beauty_path：奖励重构、轻盈形象、体态变化
`.trim();

const MODULE_HINTS = {
  健康改善型: ["身体连接", "呼吸空间", "身体感谢", "健康选择"],
  美学提升型: ["奖励重构", "食物意象", "未来轻盈状态", "身体舒展"]
};

export function composePrompt(surveyData, analysis) {
  const moduleHints = MODULE_HINTS[analysis.primaryPath] || [];

  return {
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: `
用户数据：
- 称呼：${surveyData.nickname}
- 年龄：${surveyData.age}
- 性别：${surveyData.gender}
- 身高：${surveyData.heightCm}cm
- 体重：${surveyData.weightKg}kg
- 目标体重：${surveyData.goalWeightKg}kg
- 减肥原因：${surveyData.reasons.join("、")}
- 时间期待：${surveyData.timeline}
- 吃多场景：${surveyData.triggers.join("、")}
- 内在声音：${surveyData.innerVoice}
- 身体关注：${surveyData.bodyFocus}
- 理想形象：${surveyData.idealImage}
- 场景选择：${surveyData.safeScene}
- 冥想风格：${surveyData.languageStyle}
- 声音选择：${surveyData.voicePreference}
- 喜欢食物：${surveyData.favoriteFood}
- 动物意象：${surveyData.animalImage}

用户分类：
- 一级路径：${analysis.primaryPath}
- 心理画像：${analysis.psychProfile}
- BMI：${analysis.bmi}

调用模块提示：
- ${moduleHints.join(" / ")}

生成要求：
- 先放松进入，再进入个性化内容
- 输出一段约 20 分钟感受的冥想文稿
- 语言慢、温柔、适合直接朗读
`.trim()
  };
}
