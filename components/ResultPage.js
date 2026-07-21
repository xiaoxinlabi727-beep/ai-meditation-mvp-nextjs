"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { STORAGE_KEYS } from "../lib/constants";

export default function ResultPage() {
  const [result, setResult] = useState(null);
  const [voiceStatus, setVoiceStatus] = useState("点击播放按钮，使用浏览器语音朗读你的专属冥想。");
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.analysis);
    if (!raw) {
      router.replace("/survey");
      return;
    }
    setResult(JSON.parse(raw));
  }, [router]);

  function playSpeech() {
    if (!result) return;
    if (!("speechSynthesis" in window)) {
      setVoiceStatus("当前浏览器不支持语音播放，请直接阅读下方生成文本。");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(result.script);
    utterance.lang = "zh-CN";
    utterance.rate = 0.92;
    utterance.pitch = result.survey.voicePreference === "男声" ? 0.9 : 1;
    utterance.onstart = () => setVoiceStatus("正在播放你的专属冥想演示语音。");
    utterance.onend = () => setVoiceStatus("播放完成。你可以再次点击播放按钮重新播放。");
    utterance.onerror = () => setVoiceStatus("语音播放失败，请稍后重试或直接阅读文本。");
    window.speechSynthesis.speak(utterance);
  }

  function stopSpeech() {
    window.speechSynthesis.cancel();
    setVoiceStatus("播放已停止。你可以再次点击播放按钮重新收听。");
  }

  if (!result) return null;

  const { survey, analysis, script } = result;
  const tags = [analysis.primaryPath, analysis.psychProfile, survey.favoriteFood, survey.bodyFocus, survey.safeScene, survey.languageStyle];

  return (
    <div className="shell">
      <header className="topbar compact">
        <a href="/survey">重新填写</a>
        <div className="brand">
          <span className="brand-mark">XR</span>
          <div>
            <p className="brand-kicker">Your Personalized Result</p>
            <h1>专属冥想结果</h1>
          </div>
        </div>
      </header>

      <main className="result-layout">
        <section className="card glass result-hero">
          <p className="eyebrow">分析完成</p>
          <h2>{`${survey.nickname || "你"}的专属路径已经生成。`}</h2>
          <p className="lede">
            {`系统判断你更接近「${analysis.primaryPath}」，当前主心理画像为「${analysis.psychProfile}」。这版工程 Demo 会根据你的身体关注、触发场景、食物意象和理想画面生成演示版冥想内容。`}
          </p>
        </section>

        <section className="result-grid">
          <article className="card result-card">
            <p className="section-kicker">你的减肥路径</p>
            <h3>{analysis.primaryPath}</h3>
            <p>{analysis.pathDescription}</p>
          </article>
          <article className="card result-card">
            <p className="section-kicker">你的心理画像</p>
            <h3>{analysis.psychProfile}</h3>
            <p>{analysis.psychDescription}</p>
          </article>
        </section>

        <section className="card player-card">
          <div className="player-header">
            <div>
              <p className="section-kicker">你的专属冥想</p>
              <h3>播放演示版语音</h3>
            </div>
            <div className="player-controls">
              <button className="button button-primary" type="button" onClick={playSpeech}>播放按钮</button>
              <button className="button button-ghost" type="button" onClick={stopSpeech}>停止播放</button>
            </div>
          </div>
          <p className="footer-note">{voiceStatus}</p>
          <div className="tags">
            {tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </section>

        <section className="card script-card">
          <p className="section-kicker">生成文本</p>
          <h3>你的专属冥想文稿</h3>
          <div className="script-output">{script}</div>
        </section>
      </main>
    </div>
  );
}
