"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { STORAGE_KEYS } from "../lib/constants";

const ANALYSIS_STEPS = [
  {
    title: "\u6b63\u5728\u5206\u6790\u4f60\u7684\u8eab\u4f53\u72b6\u6001...",
    description:
      "\u7cfb\u7edf\u6b63\u5728\u8bc6\u522b\u4f60\u7684\u51cf\u91cd\u8def\u5f84\u4e0e\u8eab\u4f53\u5173\u6ce8\u91cd\u70b9\u3002"
  },
  {
    title: "\u6b63\u5728\u5206\u6790\u4f60\u7684\u5fc3\u7406\u753b\u50cf...",
    description:
      "\u7cfb\u7edf\u6b63\u5728\u6574\u7406\u4f60\u7684\u89e6\u53d1\u573a\u666f\u3001\u5185\u5728\u58f0\u97f3\u548c\u5956\u52b1\u6a21\u5f0f\u3002"
  },
  {
    title: "\u6b63\u5728\u751f\u6210\u4f60\u7684\u4e13\u5c5e\u51a5\u60f3...",
    description:
      "\u7cfb\u7edf\u6b63\u5728\u628a\u8def\u5f84\u3001\u610f\u8c61\u548c\u98ce\u683c\u62fc\u63a5\u6210\u4f60\u7684\u4e2a\u6027\u5316\u5f15\u5bfc\u8bed\u3002"
  }
];

export default function AnalyzingPage() {
  const [error, setError] = useState("");
  const [items, setItems] = useState(["active", "", ""]);
  const [progress, setProgress] = useState(12);
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.survey);
    if (!raw) {
      router.replace("/survey");
      return;
    }

    const surveyData = JSON.parse(raw);

    async function run() {
      try {
        const analyzeResponse = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ surveyData })
        });
        const analyze = await analyzeResponse.json();

        if (!analyzeResponse.ok) {
          throw new Error(analyze?.error?.message || "\u5206\u6790\u5931\u8d25");
        }

        setItems(["done", "active", ""]);
        setProgress(46);

        await new Promise((resolve) => setTimeout(resolve, 600));

        const generateResponse = await fetch("/api/generate-meditation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            submissionId: analyze.submissionId,
            surveyData,
            analysis: analyze.analysis
          })
        });
        const generate = await generateResponse.json();

        if (!generateResponse.ok) {
          throw new Error(generate?.error?.message || "\u751f\u6210\u5931\u8d25");
        }

        setItems(["done", "done", "done"]);
        setProgress(100);

        localStorage.setItem(
          STORAGE_KEYS.analysis,
          JSON.stringify({
            survey: surveyData,
            submissionId: analyze.submissionId,
            generationId: generate.generationId,
            analysis: generate.analysis,
            script: generate.script,
            promptMeta: generate.promptMeta,
            generatedAt: new Date().toISOString()
          })
        );

        setTimeout(() => {
          router.replace("/result");
        }, 500);
      } catch (err) {
        setError(err.message || "\u751f\u6210\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5\u3002");
      }
    }

    run();
  }, [router]);

  return (
    <div className="shell">
      <main className="analyzing-shell card glass centered-card">
        <p className="eyebrow">
          {"\u6b63\u5728\u751f\u6210\u4f60\u7684\u4e13\u5c5e\u4f53\u9a8c"}
        </p>
        <h1>
          {"\u8bf7\u7ed9\u7cfb\u7edf\u4e00\u70b9\u65f6\u95f4\uff0c\u5148\u7406\u89e3\u4f60\uff0c\u518d\u4e3a\u4f60\u5199\u4f5c\u3002"}
        </h1>

        <div className="analysis-steps">
          {ANALYSIS_STEPS.map((item, index) => (
            <div key={item.title} className={`analysis-item ${items[index]}`}>
              <span className="pulse-dot" />
              <div>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="progress-shell">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <p className="footer-note">
          {error ||
            "\u5f53\u524d\u4e3a\u5de5\u7a0b\u7248 Demo\uff0c\u4f7f\u7528\u672c\u5730 mock \u6570\u636e\u5206\u6790\u548c mock \u6587\u672c\u751f\u6210\u3002"}
        </p>
      </main>
    </div>
  );
}
