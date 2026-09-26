import { useEffect, useRef } from "react";
import "../styles/takarakuji-landing.css";

/**
 * Scratch-off ticket. Canvas logic is isolated here so it can be reused
 * anywhere (hero, a card in a dashboard, etc.) without the rest of the
 * page layout.
 */
function ScratchCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  // stash the reset fn so the button (outside the effect) can call it
  const resetRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function paintFoil() {
      const g = ctx!.createLinearGradient(0, 0, canvas!.width, canvas!.height);
      g.addColorStop(0, "#c9963a");
      g.addColorStop(0.5, "#e9c877");
      g.addColorStop(1, "#b9852f");
      ctx!.globalCompositeOperation = "source-over";
      ctx!.fillStyle = g;
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
      ctx!.fillStyle = "rgba(27,16,50,.55)";
      ctx!.font = `700 ${Math.max(14, canvas!.width * 0.05)}px Inter, sans-serif`;
      ctx!.textAlign = "center";
      ctx!.fillText("TAKARAKUJI", canvas!.width / 2, canvas!.height / 2);
      ctx!.globalCompositeOperation = "destination-out";
    }

    function sizeCanvas() {
      const rect = canvas!.parentElement!.getBoundingClientRect();
      canvas!.width = rect.width;
      canvas!.height = rect.height;
      paintFoil();
    }

    function scratchAt(x: number, y: number) {
      ctx!.beginPath();
      ctx!.arc(x, y, Math.max(canvas!.width * 0.045, 16), 0, Math.PI * 2);
      ctx!.fill();
    }

    function getPos(e: PointerEvent | TouchEvent) {
      const rect = canvas!.getBoundingClientRect();
      const t = "touches" in e ? e.touches[0] : e;
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }

    function handlePointerDown(e: PointerEvent | TouchEvent) {
      drawingRef.current = true;
      const p = getPos(e);
      scratchAt(p.x, p.y);
    }
    function handlePointerMove(e: PointerEvent | TouchEvent) {
      if (!drawingRef.current) return;
      const p = getPos(e);
      scratchAt(p.x, p.y);
    }
    function handlePointerUp() {
      drawingRef.current = false;
    }
    function handleTouchStart(e: TouchEvent) {
      e.preventDefault();
      handlePointerDown(e);
    }
    function handleTouchMove(e: TouchEvent) {
      e.preventDefault();
      handlePointerMove(e);
    }

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handlePointerUp);
    window.addEventListener("resize", sizeCanvas);

    sizeCanvas();
    resetRef.current = paintFoil;

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handlePointerUp);
      window.removeEventListener("resize", sizeCanvas);
    };
  }, []);

  return (
    <div className="scratch-stage">
      <div className="scratch-box">
        <div className="prize-layer">
          <span className="kanji-big">当</span>
          <span className="amount">3rd Prize — 5,000 pt</span>
          <span className="fine">scratch to reveal</span>
        </div>
        <canvas className="scratch-canvas" ref={canvasRef} />
      </div>
      <div className="scratch-hint">↑ drag to scratch the foil</div>
      <button className="scratch-reset" onClick={() => resetRef.current()}>
        reset ticket
      </button>
    </div>
  );
}

function Nav() {
  return (
    <nav>
      <div className="brand">
        <span className="kanji">宝</span>Takarakuji
      </div>
      <div className="navlinks">
        <a href="#how">How it works</a>
        <a href="#ens">ENS</a>
        <a href="#world">World ID</a>
        <a
          className="gh"
          href="https://github.com/Derricks-DApps/Takarakuji"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <header className="hero">
      <div className="wrap">
        <h1>
          A Japanese scratch-off lottery, made{" "}
          <span className="accent">provably fair</span> onchain
        </h1>
        <p className="sub">
          Takarakuji brings the ritual of the 宝くじ scratch ticket to
          Ethereum — now with a name for every winner and a human behind
          every ticket.
        </p>

        <ScratchCard />

        <div className="cta-row">
          <a className="btn btn-primary" href="#how">
            See how it works
          </a>
          <a
            className="btn btn-ghost"
            href="https://github.com/Derricks-DApps/Takarakuji"
            target="_blank"
            rel="noopener noreferrer"
          >
            View the code
          </a>
        </div>
      </div>
    </header>
  );
}

const STEPS = [
  {
    num: "一",
    title: "Buy a ticket onchain",
    body: "Connect a wallet and mint a ticket. Each ticket's outcome is committed onchain before it's ever revealed.",
  },
  {
    num: "二",
    title: "Scratch to reveal",
    body: "The scratch animation is cosmetic — the result underneath is already fixed by the contract, not decided client-side.",
  },
  {
    num: "三",
    title: "Claim, named and verified",
    body: "Winners claim to their ENS name, and — with World ID — the draw stays one-ticket-per-human, not one-ticket-per-wallet.",
  },
] as const;

function HowItWorks() {
  return (
    <section id="how">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">THE GAME</div>
          <h2>One ticket, one scratch, one honest draw</h2>
          <p>
            Takarakuji simulates the classic Japanese instant-win scratch
            ticket — buy a ticket, scratch the foil, find out instantly.
            Placeholder flow below; replace with your actual contract
            mechanics.
          </p>
        </div>
        <div className="steps">
          {STEPS.map((s) => (
            <div className="step" key={s.num}>
              <span className="num">{s.num}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EnsBounty() {
  return (
    <div className="bounty ens" id="ens">
      <div>
        <span className="tag">ENS · Continuity Integration</span>
        <h3>Winners get a name, not just an address</h3>
        <p>
          Every claim and every leaderboard entry resolves through ENS. If
          you own a name, we show it. If you don't, we offer a free
          subname under <b className="paper-text">takarakuji.eth</b> the
          moment you win — so a prize feels like it belongs to <i>you</i>,
          not to <span className="mono">0x8f2…c91</span>.
        </p>
        <ul>
          <li>
            <b>Primary name lookup</b> — reverse-resolve winners for the
            public draw feed
          </li>
          <li>
            <b>Winner subnames</b> — auto-issue{" "}
            <span className="mono">alice.takarakuji.eth</span> on first win
          </li>
          <li>
            <b>Text records</b> — store win streak / lifetime winnings as
            a public profile stat
          </li>
        </ul>
      </div>
      <div className="mock">
        <div className="row">
          <span>Draw #4821</span>
          <span className="badge">3rd prize</span>
        </div>
        <div className="row">
          <span className="name">yuki.eth</span>
          <span>5,000 pt</span>
        </div>
        <div className="row">
          <span className="name">momo.takarakuji.eth</span>
          <span>1,000 pt</span>
        </div>
        <div className="row">
          <span className="mono dim">0x51…2ac (unresolved)</span>
          <span>500 pt</span>
        </div>
      </div>
    </div>
  );
}

function WorldBounty() {
  return (
    <div className="bounty world" id="world">
      <div className="mock">
        <div className="row">
          <span>Ticket eligibility</span>
          <span className="badge">1 / human / draw</span>
        </div>
        <div className="row">
          <span>World ID verified</span>
          <span className="gold-text">✓ orb</span>
        </div>
        <div className="row">
          <span>Wallets seen, no proof</span>
          <span className="dim">blocked</span>
        </div>
      </div>
      <div>
        <span className="tag">World ID · Continuity Integration</span>
        <h3>One human, one ticket — no bot-farmed draws</h3>
        <p>
          Scratch tickets are only fun if the odds are real. We gate
          ticket purchases per draw with a World ID proof, so a single
          person can't spin up a hundred wallets to corner the prize pool
          — while staying anonymous, since World ID proves personhood,
          not identity.
        </p>
        <ul>
          <li>
            <b>Sybil-resistant entry</b> — one verified-human proof per
            wallet per draw
          </li>
          <li>
            <b>Verified badge</b> — shown next to winners in the public
            feed alongside their ENS name
          </li>
          <li>
            <b>Onchain proof check</b> — validated in the ticket contract,
            not just the frontend
          </li>
        </ul>
      </div>
    </div>
  );
}

function Bounties() {
  return (
    <section id="ens-world">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">BOUNTY INTEGRATIONS</div>
          <h2>What's new for the Continuity Track</h2>
          <p>
            Takarakuji already exists — these are the two extensions we're
            shipping this weekend.
          </p>
        </div>
        <EnsBounty />
        <WorldBounty />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <p>
        Built for ETHGlobal Tokyo 2026 — Continuity Track. Extending an
        existing project with ENS identity and World ID Sybil-resistance.
      </p>
      <a
        className="btn btn-primary"
        href="https://github.com/Derricks-DApps/Takarakuji"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub
      </a>
      <a className="btn btn-ghost" href="#how">
        Back to top
      </a>
    </footer>
  );
}

export default function TakarakujiLanding() {
  return (
    <div className="takarakuji-landing">
      <Nav />
      <Hero />
      <HowItWorks />
      <Bounties />
      <Footer />
    </div>
  );
}
