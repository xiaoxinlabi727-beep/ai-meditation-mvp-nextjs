"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ANIMAL_OPTIONS,
  BODY_FOCUS_OPTIONS,
  FOOD_OPTIONS,
  INNER_VOICE_OPTIONS,
  LANGUAGE_STYLE_OPTIONS,
  REASON_OPTIONS,
  SAFE_SCENE_OPTIONS,
  STORAGE_KEYS,
  TRIGGER_OPTIONS,
  VOICE_OPTIONS
} from "../lib/constants";

const TOTAL_STEPS = 4;

const initialForm = {
  nickname: "",
  gender: "",
  age: "",
  heightCm: "",
  weightKg: "",
  reasons: [],
  goalWeightKg: "",
  timeline: "",
  triggers: [],
  innerVoice: "",
  bodyFocus: "",
  idealImage: "",
  safeScene: "",
  languageStyle: "",
  voicePreference: "",
  favoriteFood: "",
  animalImage: ""
};

export default function SurveyPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const router = useRouter();
  const progress = useMemo(() => Math.round((step / TOTAL_STEPS) * 100), [step]);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function toggleArrayValue(name, value) {
    setForm((prev) => {
      const list = prev[name];
      return {
        ...prev,
        [name]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
      };
    });
  }

  function validateCurrentStep() {
    setError("");
    if (step === 1) {
      if (!form.nickname || !form.gender || !form.age || !form.heightCm || !form.weightKg) {
        setError("请先完成基础信息。");
        return false;
      }
    }

    if (step === 2) {
      if (form.reasons.length === 0 || !form.goalWeightKg || !form.timeline) {
        setError("请完成减肥目标部分。");
        return false;
      }
    }

    if (step === 3) {
      if (form.triggers.length === 0 || !form.innerVoice || !form.bodyFocus) {
        setError("请完成心理部分。");
        return false;
      }
    }

    if (step === 4) {
      if (!form.idealImage || !form.safeScene || !form.languageStyle || !form.voicePreference || !form.favoriteFood || !form.animalImage) {
        setError("请完成个性化偏好。");
        return false;
      }
    }

    return true;
  }

  function goNext() {
    if (!validateCurrentStep()) return;
    setStep((prev) => prev + 1);
  }

  function goPrev() {
    setError("");
    setStep((prev) => prev - 1);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validateCurrentStep()) return;
    localStorage.setItem(STORAGE_KEYS.survey, JSON.stringify({
      ...form,
      age: Number(form.age),
      heightCm: Number(form.heightCm),
      weightKg: Number(form.weightKg),
      goalWeightKg: Number(form.goalWeightKg)
    }));
    router.push("/analyzing");
  }

  return (
    <div className="shell">
      <header className="topbar compact">
        <a href="/">返回首页</a>
        <div className="brand">
          <span className="brand-mark">XR</span>
          <div>
            <p className="brand-kicker">Step by Step</p>
            <h1>个性化问卷</h1>
          </div>
        </div>
      </header>

      <main className="survey-layout">
        <section className="survey-intro card glass">
          <p className="eyebrow">MVP Demo</p>
          <h2>先花几分钟，让系统更懂你的身体和节奏。</h2>
          <p>页面采用分步骤填写。你的答案会用于演示：路径分析、心理画像识别、冥想文稿生成与语音播放。</p>

          <div className="progress-shell">
            <div className="progress-meta">
              <span>{`第 ${step} 步 / 共 ${TOTAL_STEPS} 步`}</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </section>

        <section className="card survey-card">
          <form onSubmit={handleSubmit}>
            <div className={`survey-step ${step === 1 ? "active" : ""}`}>
              <div className="step-header">
                <p className="section-kicker">基础信息</p>
                <h3>先从你现在的身体状态开始</h3>
              </div>
              <div className="form-grid two-col">
                <Field label="称呼"><input value={form.nickname} onChange={(e) => updateField("nickname", e.target.value)} /></Field>
                <Field label="性别">
                  <select value={form.gender} onChange={(e) => updateField("gender", e.target.value)}>
                    <option value="">请选择</option>
                    <option value="女">女</option>
                    <option value="男">男</option>
                    <option value="其他">其他 / 不限定</option>
                  </select>
                </Field>
                <Field label="年龄"><input type="number" value={form.age} onChange={(e) => updateField("age", e.target.value)} /></Field>
                <Field label="身高（cm）"><input type="number" value={form.heightCm} onChange={(e) => updateField("heightCm", e.target.value)} /></Field>
                <Field label="体重（kg）"><input type="number" value={form.weightKg} onChange={(e) => updateField("weightKg", e.target.value)} /></Field>
              </div>
            </div>

            <div className={`survey-step ${step === 2 ? "active" : ""}`}>
              <div className="step-header">
                <p className="section-kicker">减肥目标</p>
                <h3>系统会据此判断你的主要路径</h3>
              </div>
              <Field label="减肥原因（可多选）">
                <div className="chip-group">
                  {REASON_OPTIONS.map((item) => (
                    <label key={item} className="chip">
                      <input type="checkbox" checked={form.reasons.includes(item)} onChange={() => toggleArrayValue("reasons", item)} />
                      {item}
                    </label>
                  ))}
                </div>
              </Field>
              <div className="form-grid two-col">
                <Field label="目标体重（kg）"><input type="number" value={form.goalWeightKg} onChange={(e) => updateField("goalWeightKg", e.target.value)} /></Field>
                <Field label="时间期待">
                  <select value={form.timeline} onChange={(e) => updateField("timeline", e.target.value)}>
                    <option value="">请选择</option>
                    {["2周内", "1个月", "3个月", "6个月", "不急"].map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </Field>
              </div>
            </div>

            <div className={`survey-step ${step === 3 ? "active" : ""}`}>
              <div className="step-header">
                <p className="section-kicker">心理部分</p>
                <h3>这一步决定内容主题和重构方向</h3>
              </div>
              <Field label="你最容易在什么时候吃多？（可多选）">
                <div className="chip-group">
                  {TRIGGER_OPTIONS.map((item) => (
                    <label key={item} className="chip">
                      <input type="checkbox" checked={form.triggers.includes(item)} onChange={() => toggleArrayValue("triggers", item)} />
                      {item}
                    </label>
                  ))}
                </div>
              </Field>
              <div className="form-grid two-col">
                <Field label="内在声音">
                  <select value={form.innerVoice} onChange={(e) => updateField("innerVoice", e.target.value)}>
                    <option value="">请选择</option>
                    {INNER_VOICE_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </Field>
                <Field label="身体关注">
                  <select value={form.bodyFocus} onChange={(e) => updateField("bodyFocus", e.target.value)}>
                    <option value="">请选择</option>
                    {BODY_FOCUS_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </Field>
              </div>
            </div>

            <div className={`survey-step ${step === 4 ? "active" : ""}`}>
              <div className="step-header">
                <p className="section-kicker">个性化偏好</p>
                <h3>这一步决定画面感、语气和声音</h3>
              </div>
              <div className="form-grid two-col">
                <Field label="理想形象"><input value={form.idealImage} onChange={(e) => updateField("idealImage", e.target.value)} placeholder="例如：走路更轻盈，穿衬衫更利落" /></Field>
                <Field label="场景选择">
                  <select value={form.safeScene} onChange={(e) => updateField("safeScene", e.target.value)}>
                    <option value="">请选择</option>
                    {SAFE_SCENE_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </Field>
                <Field label="冥想风格">
                  <select value={form.languageStyle} onChange={(e) => updateField("languageStyle", e.target.value)}>
                    <option value="">请选择</option>
                    {LANGUAGE_STYLE_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </Field>
                <Field label="声音选择">
                  <select value={form.voicePreference} onChange={(e) => updateField("voicePreference", e.target.value)}>
                    <option value="">请选择</option>
                    {VOICE_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </Field>
                <Field label="喜欢的食物意象">
                  <select value={form.favoriteFood} onChange={(e) => updateField("favoriteFood", e.target.value)}>
                    <option value="">请选择</option>
                    {FOOD_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </Field>
                <Field label="动物意象">
                  <select value={form.animalImage} onChange={(e) => updateField("animalImage", e.target.value)}>
                    <option value="">请选择</option>
                    {ANIMAL_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </Field>
              </div>
            </div>

            {error ? <div className="error-box">{error}</div> : null}

            <div className="step-actions">
              <button className="button button-ghost" type="button" disabled={step === 1} onClick={goPrev}>上一步</button>
              {step < TOTAL_STEPS ? (
                <button className="button button-primary" type="button" onClick={goNext}>下一步</button>
              ) : (
                <button className="button button-primary" type="submit">开始生成</button>
              )}
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
