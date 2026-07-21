import Link from "next/link";

export default function HomePage() {
  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">XR</span>
          <div>
            <p className="brand-kicker">AI Personalized Meditation</p>
            <h1>心欣然 · AI个性化减肥冥想</h1>
          </div>
        </div>
      </header>

      <main className="hero-grid">
        <section className="hero-copy card glass">
          <p className="eyebrow">更懂你的身体，也更懂你的节奏</p>
          <h2>把问卷、心理画像和催眠引导，变成一条专属语音。</h2>
          <p className="lede">
            这不是一条要求你改变的声音，而是一条先理解你、再陪你慢慢靠近轻松状态的声音。
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/survey">开始测试</Link>
            <a className="button button-ghost" href="#flow">查看流程</a>
          </div>
          <ul className="feature-row">
            <li>个性化问卷画像</li>
            <li>自动识别减肥路径</li>
            <li>生成专属冥想文本</li>
            <li>语音播放演示</li>
          </ul>
        </section>

        <aside className="hero-panel card warm-panel">
          <div className="stat-stack">
            <div className="mini-stat">
              <span>Path</span>
              <strong>健康改善型 / 美学提升型</strong>
            </div>
            <div className="mini-stat">
              <span>Profile</span>
              <strong>压力进食 / 奖励型 / 习惯型</strong>
            </div>
            <div className="mini-stat">
              <span>Output</span>
              <strong>专属冥想文本 + 语音播放</strong>
            </div>
          </div>

          <div className="quote-panel">
            <p>“这个声音懂我。”</p>
            <span>这是这款产品最重要的体验目标。</span>
          </div>
        </aside>
      </main>

      <section id="flow" className="section-grid">
        <article className="card section-card">
          <p className="section-kicker">产品介绍</p>
          <h3>一段从身体出发的个性化减肥冥想体验</h3>
          <p>
            用户先填写一份关于身体状态、减肥目标、进食模式、理想意象和声音偏好的问卷。系统据此分析用户路径与心理画像，再生成更贴合个人状态的冥想引导语。
          </p>
        </article>

        <article className="card section-card">
          <p className="section-kicker">使用流程</p>
          <ol className="flow-list">
            {[
              ["填写问卷", "输入身体信息、减肥目标、进食触发和个性化偏好。"],
              ["系统分析", "自动识别健康路径或美学路径，并提取心理画像。"],
              ["生成专属冥想", "根据身体关注、食物意象、内在声音与理想画面拼接内容。"],
              ["播放语音", "查看你的路径标签、心理画像，并直接播放演示版语音。"]
            ].map(([title, desc], index) => (
              <li key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </article>
      </section>

      <footer className="footer-note">
        <p>该页面为 MVP 演示版，仅用于展示个性化冥想产品流程，不替代医疗、营养或心理治疗建议。</p>
      </footer>
    </div>
  );
}
