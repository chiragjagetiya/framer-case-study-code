import React, { useState, useEffect, useRef } from "react"

// ─── Data & Hooks ─────────────────────────────────────────────────────────────
const AUCTION_LOTS = [
    {
        id: "LOT-0047",
        material: "HR Steel Coils",
        grade: "IS 2062 E250",
        qty: "50 MT",
        emd: "₹1,24,000",
        current: 1240000,
        reserve: 1100000,
        bidders: 7,
        ends: 312,
        category: "Steel",
        hot: true,
    },
    {
        id: "LOT-0051",
        material: "LDPE Granules",
        grade: "Virgin Grade",
        qty: "12 MT",
        emd: "₹44,000",
        current: 440000,
        reserve: 380000,
        bidders: 4,
        ends: 847,
        category: "Polymers",
        hot: false,
    },
    {
        id: "LOT-0039",
        material: "Kraft Paper Rolls",
        grade: "80 GSM",
        qty: "30 MT",
        emd: "₹62,000",
        current: 618000,
        reserve: 540000,
        bidders: 11,
        ends: 1203,
        category: "Paper",
        hot: true,
    },
    {
        id: "LOT-0055",
        material: "Aluminium Scrap",
        grade: "Segregated",
        qty: "8 MT",
        emd: "₹38,000",
        current: 376000,
        reserve: 320000,
        bidders: 3,
        ends: 2401,
        category: "Non-Ferrous",
        hot: false,
    },
    {
        id: "LOT-0061",
        material: "Chemical Drums",
        grade: "HDPE 200L",
        qty: "200 Pcs",
        emd: "₹18,000",
        current: 182000,
        reserve: 160000,
        bidders: 6,
        ends: 445,
        category: "Chemicals",
        hot: false,
    },
    {
        id: "LOT-0063",
        material: "CR Steel Sheets",
        grade: "IS 513",
        qty: "25 MT",
        emd: "₹96,000",
        current: 962000,
        reserve: 820000,
        bidders: 9,
        ends: 178,
        category: "Steel",
        hot: true,
    },
]
const TICKER_EVENTS = [
    "LOT-0047 · New bid ₹1,24,000 by Bidder #7 · 4 others watching",
    "LOT-0063 · OUTBID ALERT · Reserve crossed · 9 active bidders",
    "LOT-0039 · Bid confirmed ₹6,18,000 · You are #1 · 20 min left",
    "LOT-0071 · Opening in 14 minutes · Set a reminder",
    "LOT-0047 · Price up ₹5,000 in last 30 seconds",
    "LOT-0063 · Final 3 minutes · Urgency alert active",
]
function fmtTime(s) {
    const h = Math.floor(s / 3600),
        m = Math.floor((s % 3600) / 60),
        sec = s % 60
    if (h > 0) return `${h}h ${m}m`
    if (m > 0) return `${m}m ${String(sec).padStart(2, "0")}s`
    return `${String(sec).padStart(2, "0")}s`
}
function fmtINR(n) {
    return "₹" + n.toLocaleString("en-IN")
}
function useCountdown(init) {
    const [t, setT] = useState(init)
    useEffect(() => {
        const id = setInterval(() => setT((p) => Math.max(0, p - 1)), 1000)
        return () => clearInterval(id)
    }, [])
    return t
}
function useTicker() {
    const [idx, setIdx] = useState(0)
    const [vis, setVis] = useState(true)
    useEffect(() => {
        const id = setInterval(() => {
            setVis(false)
            setTimeout(() => {
                setIdx((p) => (p + 1) % TICKER_EVENTS.length)
                setVis(true)
            }, 350)
        }, 3200)
        return () => clearInterval(id)
    }, [])
    return { text: TICKER_EVENTS[idx], vis }
}
function AnimNum({ value, prefix = "" }) {
    const [disp, setDisp] = useState(value)
    const prev = useRef(value)
    const [flash, setFlash] = useState(false)
    useEffect(() => {
        if (value !== prev.current) {
            setFlash(true)
            const steps = 12,
                diff = value - prev.current
            let i = 0
            const id = setInterval(() => {
                i++
                setDisp(Math.round(prev.current + (diff * i) / steps))
                if (i >= steps) {
                    clearInterval(id)
                    prev.current = value
                    setTimeout(() => setFlash(false), 500)
                }
            }, 28)
        }
    }, [value])
    return (
        <span
            style={{
                color: flash ? "#1e40af" : "inherit",
                transition: "color 0.25s",
            }}
        >
            {prefix}
            {disp.toLocaleString("en-IN")}
        </span>
    )
}

// ─── Lot Card ─────────────────────────────────────────────────────────────────
function LotCard({ lot, dark }) {
    const [bid, setBid] = useState(lot.current)
    const [hov, setHov] = useState(false)
    const t = useCountdown(lot.ends)
    const urgent = t < 300
    useEffect(() => {
        const id = setInterval(() => {
            if (Math.random() > 0.85)
                setBid((p) => p + Math.floor(Math.random() * 5 + 1) * 1000)
        }, 4000)
        return () => clearInterval(id)
    }, [])
    const pct = Math.round(((bid - lot.reserve) / lot.reserve) * 100)
    const bg = dark
        ? hov
            ? "rgba(255,255,255,0.06)"
            : "rgba(255,255,255,0.03)"
        : hov
          ? "#fafaf8"
          : "#ffffff"
    const bdr = dark
        ? hov
            ? "rgba(255,255,255,0.18)"
            : "rgba(255,255,255,0.08)"
        : hov
          ? "#1e40af44"
          : "#e0ddd6"
    const inkC = dark ? "#ffffff" : "#111111"
    const subC = dark ? "rgba(255,255,255,0.4)" : "#888880"
    const ghostC = dark ? "rgba(255,255,255,0.28)" : "#aaa9a3"
    const divC = dark ? "rgba(255,255,255,0.07)" : "#e0ddd6"
    const monoBg = dark ? "rgba(255,255,255,0.06)" : "#f2f1ed"
    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                background: bg,
                border: `1px solid ${bdr}`,
                padding: "28px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 20,
                cursor: "pointer",
                transition: "all 0.18s ease",
                position: "relative",
                overflow: "hidden",
                boxShadow: dark
                    ? "none"
                    : hov
                      ? "0 4px 24px rgba(30,64,175,0.08)"
                      : "none",
            }}
        >
            {lot.hot && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        background: "#1e40af",
                        color: "#fff",
                        fontSize: 9,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        padding: "4px 12px",
                    }}
                >
                    High Demand
                </div>
            )}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}
            >
                <div>
                    <div
                        style={{
                            fontSize: 10,
                            letterSpacing: "0.22em",
                            color: ghostC,
                            textTransform: "uppercase",
                            marginBottom: 6,
                        }}
                    >
                        {lot.category}
                    </div>
                    <div
                        style={{
                            fontFamily: "Verdana",
                            fontSize: 15,
                            color: inkC,
                            lineHeight: 1.3,
                            marginBottom: 4,
                        }}
                    >
                        {lot.material}
                    </div>
                    <div
                        style={{
                            fontSize: 11,
                            color: subC,
                            display: "flex",
                            gap: 8,
                        }}
                    >
                        <span>{lot.grade}</span>
                        <span>·</span>
                        <span>{lot.qty}</span>
                    </div>
                </div>
                <div style={{ textAlign: "right" }}>
                    <div
                        style={{
                            fontSize: 9,
                            letterSpacing: "0.18em",
                            color: ghostC,
                            textTransform: "uppercase",
                            marginBottom: 4,
                        }}
                    >
                        Lot
                    </div>
                    <div
                        style={{
                            fontFamily: "monospace",
                            fontSize: 12,
                            color: subC,
                            background: monoBg,
                            padding: "3px 8px",
                            border: `1px solid ${divC}`,
                        }}
                    >
                        {lot.id}
                    </div>
                </div>
            </div>
            <div>
                <div
                    style={{
                        fontSize: 9,
                        letterSpacing: "0.2em",
                        color: ghostC,
                        textTransform: "uppercase",
                        marginBottom: 8,
                    }}
                >
                    Current Highest Bid
                </div>
                <div
                    style={{
                        fontFamily: "Verdana",
                        fontSize: 32,
                        color: inkC,
                        lineHeight: 1,
                        marginBottom: 10,
                    }}
                >
                    <AnimNum value={bid} prefix="₹" />
                </div>
                <div
                    style={{ height: 3, background: divC, overflow: "hidden" }}
                >
                    <div
                        style={{
                            height: "100%",
                            width: `${Math.min(pct * 2, 100)}%`,
                            background: pct > 30 ? "#16a34a" : "#1e40af",
                            transition: "width 0.6s ease",
                        }}
                    />
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 6,
                    }}
                >
                    <span style={{ fontSize: 10, color: ghostC }}>
                        Reserve {fmtINR(lot.reserve)}
                    </span>
                    <span style={{ fontSize: 10, color: "#16a34a" }}>
                        +{pct}% above reserve
                    </span>
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: 16,
                    borderTop: `1px solid ${divC}`,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                        }}
                    >
                        <div
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: urgent ? "#dc2626" : "#16a34a",
                                animation: "mpulse 1.5s ease-in-out infinite",
                            }}
                        />
                        <span
                            style={{
                                fontFamily: "monospace",
                                fontSize: 14,
                                color: urgent ? "#dc2626" : inkC,
                                transition: "color 0.3s",
                            }}
                        >
                            {fmtTime(t)}
                        </span>
                    </div>
                    <span style={{ fontSize: 11, color: ghostC }}>
                        {lot.bidders} bidders
                    </span>
                </div>
                <div
                    style={{
                        fontSize: 10,
                        letterSpacing: "0.15em",
                        color: "#1e40af",
                        textTransform: "uppercase",
                        opacity: hov ? 1 : 0,
                        transition: "opacity 0.18s",
                    }}
                >
                    Bid now →
                </div>
            </div>
            {hov && (
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: "#1e40af",
                        padding: "11px 24px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTop: "1px solid #163a8f",
                        animation: "mslideUp 0.14s ease",
                    }}
                >
                    <span
                        style={{
                            fontSize: 11,
                            color: "rgba(255,255,255,0.75)",
                        }}
                    >
                        Security Deposit (EMD)
                    </span>
                    <span
                        style={{
                            fontSize: 14,
                            color: "#fff",
                            fontFamily: "Verdana",
                        }}
                    >
                        {lot.emd}
                    </span>
                </div>
            )}
        </div>
    )
}

// ─── Landing Section ──────────────────────────────────────────────────────────
function LandingSection() {
    const [cat, setCat] = useState("All")
    const [q, setQ] = useState("")
    const [regOpen, setRegOpen] = useState(false)
    const ticker = useTicker()
    const blue = "#1e40af",
        ink = "#111111",
        ghost = "#777770",
        border = "#e0ddd6",
        stone = "#f2f1ed",
        offWh = "#fafaf8"
    const isActive = (c) =>
        c === "ALL"
            ? cat === "All"
            : cat === c.charAt(0) + c.slice(1).toLowerCase()
    const filtered = AUCTION_LOTS.filter((l) => {
        const cOk = cat === "All" || l.category === cat
        const qOk =
            l.material.toLowerCase().includes(q.toLowerCase()) ||
            l.id.toLowerCase().includes(q.toLowerCase())
        return cOk && qOk
    })
    return (
        <div
            style={{
                background: "#fff",
                fontFamily: "Verdana,sans-serif",
                fontSize: 13,
                color: ink,
                lineHeight: 1.5,
                position: "relative",
            }}
        >
            <div
                style={{
                    background: ink,
                    padding: "7px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        minWidth: 0,
                        overflow: "hidden",
                    }}
                >
                    <span
                        style={{
                            background: "#dc2626",
                            color: "#fff",
                            fontSize: 9,
                            letterSpacing: "0.16em",
                            padding: "3px 8px",
                            textTransform: "uppercase",
                            flexShrink: 0,
                        }}
                    >
                        ● LIVE
                    </span>
                    <span
                        style={{
                            fontSize: 11,
                            color: "rgba(255,255,255,0.65)",
                            transition: "opacity 0.3s",
                            opacity: ticker.vis ? 1 : 0,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {ticker.text}
                    </span>
                </div>
                <button
                    onClick={() => setRegOpen(true)}
                    style={{
                        background: blue,
                        color: "#fff",
                        border: "none",
                        padding: "5px 14px",
                        fontSize: 10,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        fontFamily: "Verdana",
                        fontWeight: 700,
                        flexShrink: 0,
                    }}
                >
                    REGISTER TO BID →
                </button>
            </div>
            <div
                style={{
                    borderBottom: `1px solid ${border}`,
                    padding: "0 28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#fff",
                    height: 52,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
                    <span
                        style={{
                            fontFamily: "Verdana",
                            fontSize: 14,
                            fontWeight: 700,
                            color: ink,
                            letterSpacing: "0.05em",
                        }}
                    >
                        BIDNEXT
                    </span>
                    {[
                        "MARKETPLACE",
                        "HOW IT WORKS",
                        "CATEGORIES",
                        "FOR SELLERS",
                    ].map((n) => (
                        <span
                            key={n}
                            style={{
                                fontSize: 10,
                                letterSpacing: "0.14em",
                                color: ghost,
                                textTransform: "uppercase",
                                cursor: "pointer",
                            }}
                        >
                            {n}
                        </span>
                    ))}
                </div>
                <span
                    style={{
                        fontSize: 10,
                        letterSpacing: "0.14em",
                        color: ghost,
                        textTransform: "uppercase",
                        cursor: "pointer",
                    }}
                >
                    LOG IN
                </span>
            </div>
            <div style={{ padding: "64px 28px 52px" }}>
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        background: "#eff6ff",
                        border: "1px solid #bfdbfe",
                        padding: "4px 12px",
                        marginBottom: 24,
                    }}
                >
                    <span
                        style={{
                            fontSize: 9,
                            letterSpacing: "0.2em",
                            color: blue,
                            textTransform: "uppercase",
                            fontWeight: 700,
                        }}
                    >
                        + INDIA'S B2B MARKETPLACE
                    </span>
                </div>
                <h1
                    style={{
                        fontFamily: "Verdana",
                        fontSize: "clamp(30px,5vw,56px)",
                        fontWeight: 200,
                        lineHeight: 1.05,
                        color: ink,
                        margin: "0 0 4px",
                        letterSpacing: "-0.02em",
                    }}
                >
                    Every surplus lot.
                </h1>
                <h1
                    style={{
                        fontFamily: "Verdana",
                        fontSize: "clamp(30px,5vw,56px)",
                        fontWeight: 200,
                        lineHeight: 1.05,
                        color: ink,
                        margin: "0 0 24px",
                        letterSpacing: "-0.02em",
                    }}
                >
                    One <span style={{ color: blue }}>unified</span> marketplace
                </h1>
                <p
                    style={{
                        fontSize: 13,
                        color: ghost,
                        lineHeight: 1.75,
                        marginBottom: 36,
                        maxWidth: 540,
                    }}
                >
                    Bid on steel, polymers, paper, chemicals and more — from a
                    single account, one wallet, and one transparent platform.
                </p>
                <div
                    style={{
                        display: "flex",
                        gap: 10,
                        flexWrap: "wrap",
                        alignItems: "center",
                    }}
                >
                    <button
                        onClick={() => setRegOpen(true)}
                        style={{
                            background: blue,
                            color: "#fff",
                            border: "none",
                            padding: "13px 26px",
                            fontSize: 10,
                            letterSpacing: "0.16em",
                            textTransform: "uppercase",
                            cursor: "pointer",
                            fontFamily: "Verdana",
                            fontWeight: 200,
                        }}
                    >
                        REGISTER &amp; START BIDDING →
                    </button>
                    <button
                        style={{
                            background: "transparent",
                            color: ink,
                            border: `1px solid ${border}`,
                            padding: "13px 26px",
                            fontSize: 10,
                            letterSpacing: "0.16em",
                            textTransform: "uppercase",
                            cursor: "pointer",
                            fontFamily: "Verdana",
                        }}
                    >
                        BROWSE AS GUEST
                    </button>
                </div>
            </div>
            <div
                style={{
                    borderTop: `1px solid ${border}`,
                    borderBottom: `1px solid ${border}`,
                    display: "grid",
                    gridTemplateColumns: "repeat(4,1fr)",
                    background: offWh,
                }}
            >
                {[
                    { val: "₹840Cr+", label: "Auction volume processed" },
                    { val: "12,400+", label: "Registered bidders" },
                    { val: "99.4%", label: "EMD refund accuracy" },
                    { val: "4 min", label: "Avg. time to first bid" },
                ].map((s, i) => (
                    <div
                        key={s.val}
                        style={{
                            padding: "24px 28px",
                            borderRight: i < 3 ? `1px solid ${border}` : "none",
                        }}
                    >
                        <div
                            style={{
                                fontFamily: "Verdana",
                                fontSize: "clamp(20px,2.5vw,32px)",
                                fontWeight: 500,
                                color: blue,
                                lineHeight: 1,
                                marginBottom: 5,
                            }}
                        >
                            {s.val}
                        </div>
                        <div style={{ fontSize: 11, color: ghost }}>
                            {s.label}
                        </div>
                    </div>
                ))}
            </div>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 1,
                    background: border,
                }}
            >
                <div style={{ background: "#fff", padding: "40px 32px" }}>
                    <div
                        style={{
                            fontSize: 9,
                            letterSpacing: "0.22em",
                            color: blue,
                            textTransform: "uppercase",
                            marginBottom: 14,
                            fontWeight: 200,
                        }}
                    >
                        UNIFICATION
                    </div>
                    <h2
                        style={{
                            fontFamily: "Verdana",
                            fontSize: "clamp(16px,1.8vw,24px)",
                            fontWeight: 500,
                            color: ink,
                            lineHeight: 1.2,
                            marginBottom: 14,
                        }}
                    >
                        One account. Both auction types. Zero Confusion.
                    </h2>
                    <p
                        style={{
                            fontSize: 12,
                            color: ghost,
                            lineHeight: 1.7,
                            marginBottom: 24,
                        }}
                    >
                        We merged two separate platforms into one. Your login,
                        your wallet, your bid history unified.
                    </p>
                    <div
                        style={{
                            display: "flex",
                            gap: 1,
                            alignItems: "stretch",
                            border: `1px solid ${border}`,
                            overflow: "hidden",
                        }}
                    >
                        {["Buyer", "Seller"].map((l, i) => (
                            <button
                                key={l}
                                style={{
                                    flex: 1,
                                    padding: "10px 16px",
                                    border: "none",
                                    borderRight:
                                        i === 0
                                            ? `1px solid ${border}`
                                            : "none",
                                    background: i === 0 ? stone : "#fff",
                                    color: i === 0 ? ink : ghost,
                                    fontSize: 11,
                                    fontFamily: "Verdana",
                                    cursor: "pointer",
                                }}
                            >
                                {l}
                            </button>
                        ))}
                        <button
                            style={{
                                padding: "10px 20px",
                                background: blue,
                                color: "#fff",
                                border: "none",
                                fontSize: 11,
                                fontFamily: "Verdana",
                                fontWeight: 500,
                                cursor: "pointer",
                                letterSpacing: "0.06em",
                                whiteSpace: "nowrap",
                            }}
                        >
                            BID NEXT
                        </button>
                    </div>
                </div>
                <div style={{ background: offWh, padding: "40px 32px" }}>
                    <div
                        style={{
                            fontSize: 9,
                            letterSpacing: "0.22em",
                            color: ghost,
                            textTransform: "uppercase",
                            marginBottom: 14,
                            fontWeight: 500,
                        }}
                    >
                        WALLET
                    </div>
                    <h2
                        style={{
                            fontFamily: "Verdana",
                            fontSize: "clamp(16px,1.8vw,24px)",
                            fontWeight: 500,
                            color: "darkgray",
                            lineHeight: 1.2,
                            marginBottom: 20,
                        }}
                    >
                        Always know where your money is
                    </h2>
                    <div
                        style={{
                            background: "#fff",
                            border: `1px solid ${border}`,
                        }}
                    >
                        <div
                            style={{
                                padding: "11px 16px",
                                borderBottom: `1px solid ${border}`,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 10,
                                    letterSpacing: "0.12em",
                                    color: ghost,
                                    textTransform: "uppercase",
                                }}
                            >
                                MY WALLET
                            </span>
                            <span
                                style={{
                                    fontFamily: "Verdana",
                                    fontSize: 15,
                                    fontWeight: 500,
                                    color: ink,
                                }}
                            >
                                ₹2,40,000
                            </span>
                        </div>
                        {[
                            { label: "• Available", val: "₹1,16,000" },
                            { label: "• EMD Locked", val: "₹1,06,000" },
                            { label: "• Refund Pending", val: "₹24,000" },
                        ].map((r, i) => (
                            <div
                                key={r.label}
                                style={{
                                    padding: "10px 16px",
                                    borderBottom:
                                        i < 2 ? `1px solid ${border}` : "none",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    background: "#fff",
                                }}
                            >
                                <span style={{ fontSize: 12, color: ghost }}>
                                    {r.label}
                                </span>
                                <span
                                    style={{
                                        fontSize: 12,
                                        color: ink,
                                        fontFamily: "Verdana",
                                    }}
                                >
                                    {r.val}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ background: offWh, padding: "40px 32px" }}>
                    <div
                        style={{
                            fontSize: 9,
                            letterSpacing: "0.22em",
                            color: ghost,
                            textTransform: "uppercase",
                            marginBottom: 14,
                            fontWeight: 500,
                        }}
                    >
                        TRUST
                    </div>
                    <h2
                        style={{
                            fontFamily: "Verdana",
                            fontSize: "clamp(16px,1.8vw,24px)",
                            fontWeight: 500,
                            color: ink,
                            lineHeight: 1.2,
                            marginBottom: 20,
                        }}
                    >
                        Browse first. Register when you're ready.
                    </h2>
                    <button
                        style={{
                            background: "transparent",
                            color: ink,
                            border: `1px solid ${border}`,
                            padding: "10px 20px",
                            fontSize: 10,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            cursor: "pointer",
                            fontFamily: "Verdana",
                        }}
                    >
                        START BROWSING
                    </button>
                </div>
                <div style={{ background: "#fff", padding: "40px 32px" }}>
                    <div
                        style={{
                            fontSize: 9,
                            letterSpacing: "0.22em",
                            color: ghost,
                            textTransform: "uppercase",
                            marginBottom: 14,
                            fontWeight: 500,
                        }}
                    >
                        REAL TIME
                    </div>
                    <h2
                        style={{
                            fontFamily: "Verdana",
                            fontSize: "clamp(16px,1.8vw,24px)",
                            fontWeight: 500,
                            color: ink,
                            lineHeight: 1.2,
                            marginBottom: 20,
                        }}
                    >
                        Know your rank. Always
                    </h2>
                    <div style={{ background: ink, padding: "16px 20px" }}>
                        <div
                            style={{
                                fontSize: 9,
                                letterSpacing: "0.16em",
                                color: "rgba(255,255,255,0.4)",
                                textTransform: "uppercase",
                                marginBottom: 12,
                            }}
                        >
                            LOT-0047 · HR Steel Coils · LIVE
                        </div>
                        {[
                            { lbl: "Highest bid", val: "₹1,24,000", c: "#fff" },
                            {
                                lbl: "Your last bid",
                                val: "₹1,29,000",
                                c: "rgba(255,255,255,0.6)",
                            },
                            { lbl: "Your rank", val: "#2 of 7", c: "#86efac" },
                        ].map((r, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    paddingBottom: i < 2 ? 10 : 0,
                                    marginBottom: i < 2 ? 10 : 0,
                                    borderBottom:
                                        i < 2
                                            ? "1px solid rgba(255,255,255,0.08)"
                                            : "none",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: 11,
                                        color: "rgba(255,255,255,0.45)",
                                    }}
                                >
                                    {r.lbl}
                                </span>
                                <span
                                    style={{
                                        fontFamily: "Verdana",
                                        fontSize: 13,
                                        fontWeight: 500,
                                        color: r.c,
                                    }}
                                >
                                    {r.val}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div style={{ padding: "52px 28px 40px", background: "#fff" }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        marginBottom: 20,
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontSize: 9,
                                letterSpacing: "0.22em",
                                color: ghost,
                                textTransform: "uppercase",
                                marginBottom: 8,
                            }}
                        >
                            LIVE AUCTIONS
                        </div>
                        <h2
                            style={{
                                fontFamily: "Verdana",
                                fontSize: "clamp(22px,3vw,38px)",
                                fontWeight: 500,
                                color: ink,
                                lineHeight: 1,
                                margin: 0,
                            }}
                        >
                            Bidding <span style={{ color: blue }}>Now</span>
                        </h2>
                    </div>
                    <div
                        style={{
                            border: `1px solid ${border}`,
                            padding: "8px 14px",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            background: offWh,
                        }}
                    >
                        <span style={{ fontSize: 11, color: ghost }}>🔍</span>
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Search material or lot ID"
                            style={{
                                border: "none",
                                outline: "none",
                                fontSize: 11,
                                color: ink,
                                background: "transparent",
                                width: 180,
                                fontFamily: "Verdana",
                            }}
                        />
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        gap: 6,
                        marginBottom: 20,
                        flexWrap: "wrap",
                    }}
                >
                    {[
                        "ALL",
                        "STEEL",
                        "POLYMER",
                        "PAPER",
                        "IRON",
                        "HAZARDOUS",
                    ].map((c) => (
                        <button
                            key={c}
                            onClick={() =>
                                setCat(
                                    c === "ALL"
                                        ? "All"
                                        : c.charAt(0) + c.slice(1).toLowerCase()
                                )
                            }
                            style={{
                                padding: "5px 14px",
                                border: `1px solid ${isActive(c) ? ink : border}`,
                                background: isActive(c) ? ink : "transparent",
                                color: isActive(c) ? "#fff" : ghost,
                                fontSize: 9,
                                letterSpacing: "0.16em",
                                cursor: "pointer",
                                fontFamily: "Verdana",
                                fontWeight: 500,
                            }}
                        >
                            {c}
                        </button>
                    ))}
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 16,
                    }}
                >
                    <span style={{ fontSize: 11, color: ghost }}>
                        Showing {filtered.length} lots
                    </span>
                    <span
                        style={{
                            fontSize: 10,
                            color: blue,
                            letterSpacing: "0.06em",
                        }}
                    >
                        Prices updated in real-time
                    </span>
                </div>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 1,
                        background: border,
                        border: `1px solid ${border}`,
                    }}
                >
                    {filtered.slice(0, 4).map((lot) => (
                        <div
                            key={lot.id}
                            style={{ background: "#fff", padding: "22px" }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    marginBottom: 10,
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: 6,
                                            marginBottom: 5,
                                            alignItems: "center",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: 8,
                                                letterSpacing: "0.14em",
                                                color: ghost,
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            {lot.category}
                                        </span>
                                        {lot.hot && (
                                            <span
                                                style={{
                                                    fontSize: 8,
                                                    color: "#dc2626",
                                                    background: "#fef2f2",
                                                    border: "1px solid #fecaca",
                                                    padding: "1px 6px",
                                                    letterSpacing: "0.1em",
                                                    textTransform: "uppercase",
                                                }}
                                            >
                                                HIGH DEMAND
                                            </span>
                                        )}
                                    </div>
                                    <div
                                        style={{
                                            fontFamily: "Verdana",
                                            fontSize: 14,
                                            fontWeight: 500,
                                            color: ink,
                                            lineHeight: 1.2,
                                            marginBottom: 3,
                                        }}
                                    >
                                        {lot.material}
                                    </div>
                                    <div style={{ fontSize: 11, color: ghost }}>
                                        {lot.grade} · {lot.qty}
                                    </div>
                                </div>
                                <span
                                    style={{
                                        fontSize: 9,
                                        color: ghost,
                                        fontFamily: "monospace",
                                        background: stone,
                                        padding: "3px 8px",
                                        border: `1px solid ${border}`,
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {lot.id}
                                </span>
                            </div>
                            <div style={{ marginBottom: 12 }}>
                                <div
                                    style={{
                                        fontSize: 8,
                                        letterSpacing: "0.14em",
                                        color: ghost,
                                        textTransform: "uppercase",
                                        marginBottom: 4,
                                    }}
                                >
                                    CURRENT HIGHEST BID
                                </div>
                                <div
                                    style={{
                                        fontFamily: "Verdana",
                                        fontSize: 24,
                                        fontWeight: 500,
                                        color: ink,
                                        lineHeight: 1,
                                    }}
                                >
                                    ₹{lot.current.toLocaleString("en-IN")}
                                </div>
                                <div
                                    style={{
                                        fontSize: 10,
                                        color: blue,
                                        marginTop: 3,
                                    }}
                                >
                                    Reserve ₹
                                    {lot.reserve.toLocaleString("en-IN")} · +
                                    {Math.round(
                                        ((lot.current - lot.reserve) /
                                            lot.reserve) *
                                            100
                                    )}
                                    % above reserve
                                </div>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    paddingTop: 12,
                                    borderTop: `1px solid ${border}`,
                                }}
                            >
                                <span style={{ fontSize: 11, color: ghost }}>
                                    • {lot.bidders} bidders
                                </span>
                                <button
                                    style={{
                                        background: blue,
                                        color: "#fff",
                                        border: "none",
                                        padding: "7px 16px",
                                        fontSize: 9,
                                        letterSpacing: "0.14em",
                                        textTransform: "uppercase",
                                        cursor: "pointer",
                                        fontFamily: "Verdana",
                                        fontWeight: 500,
                                    }}
                                >
                                    BID NOW
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div
                    style={{
                        textAlign: "center",
                        marginTop: 20,
                        paddingTop: 20,
                        borderTop: `1px solid ${border}`,
                    }}
                >
                    <button
                        onClick={() => setRegOpen(true)}
                        style={{
                            background: "transparent",
                            color: ghost,
                            border: "none",
                            fontSize: 12,
                            cursor: "pointer",
                            fontFamily: "Verdana",
                        }}
                    >
                        Register to see all 147 live lots →
                    </button>
                </div>
            </div>
            <div
                style={{
                    background: stone,
                    borderTop: `1px solid ${border}`,
                    borderBottom: `1px solid ${border}`,
                    padding: "52px 28px",
                }}
            >
                <div
                    style={{
                        fontSize: 9,
                        letterSpacing: "0.22em",
                        color: ghost,
                        textTransform: "uppercase",
                        marginBottom: 36,
                    }}
                >
                    HOW IT WORKS
                </div>
                <div
                    style={{
                        display: "flex",
                        gap: 1,
                        background: border,
                        border: `1px solid ${border}`,
                    }}
                >
                    {[
                        {
                            n: "01",
                            title: "Browse as guest",
                            body: "Explore live lots without creating an account.",
                        },
                        {
                            n: "02",
                            title: "Register free",
                            body: "Complete signup. Business or individual.",
                        },
                        {
                            n: "03",
                            title: "Add to wallet",
                            body: "EMD is held in your wallet when you bid, not before.",
                        },
                        {
                            n: "04",
                            title: "Bid in real-time",
                            body: "See your rank. Get instant confirmation.",
                        },
                        {
                            n: "05",
                            title: "Win or get refunded",
                            body: "EMD back within 48 hours if you don't win.",
                        },
                    ].map((s, i) => (
                        <div
                            key={s.n}
                            style={{
                                flex: 1,
                                background: "#fff",
                                padding: "28px 20px",
                                borderRight:
                                    i < 4 ? `1px solid ${border}` : "none",
                            }}
                        >
                            <div
                                style={{
                                    fontFamily: "Verdana",
                                    fontSize: 26,
                                    fontWeight: 500,
                                    color: blue,
                                    lineHeight: 1,
                                    marginBottom: 10,
                                }}
                            >
                                {s.n}
                            </div>
                            <div
                                style={{
                                    fontSize: 12,
                                    fontWeight: 500,
                                    color: ink,
                                    marginBottom: 7,
                                    lineHeight: 1.3,
                                }}
                            >
                                {s.title}
                            </div>
                            <div
                                style={{
                                    fontSize: 11,
                                    color: ghost,
                                    lineHeight: 1.6,
                                }}
                            >
                                {s.body}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div
                style={{
                    padding: "80px 28px",
                    textAlign: "center",
                    background: "#fff",
                    borderBottom: `1px solid ${border}`,
                }}
            >
                <h2
                    style={{
                        fontFamily: "Verdana",
                        fontSize: "clamp(26px,4vw,50px)",
                        fontWeight: 500,
                        color: ink,
                        lineHeight: 1.1,
                        marginBottom: 4,
                    }}
                >
                    Stop switching apps.
                </h2>
                <h2
                    style={{
                        fontFamily: "Verdana",
                        fontSize: "clamp(26px,4vw,50px)",
                        fontWeight: 500,
                        color: blue,
                        lineHeight: 1.1,
                        marginBottom: 24,
                    }}
                >
                    Start winning lots.
                </h2>
                <p
                    style={{
                        fontSize: 13,
                        color: ghost,
                        lineHeight: 1.7,
                        maxWidth: 460,
                        margin: "0 auto 36px",
                    }}
                >
                    Join 12,400+ MSME traders already bidding on BID NEXT.
                </p>
                <div
                    style={{
                        display: "flex",
                        gap: 10,
                        justifyContent: "center",
                        marginBottom: 16,
                    }}
                >
                    <button
                        onClick={() => setRegOpen(true)}
                        style={{
                            background: blue,
                            color: "#fff",
                            border: "none",
                            padding: "13px 28px",
                            fontSize: 10,
                            letterSpacing: "0.16em",
                            textTransform: "uppercase",
                            cursor: "pointer",
                            fontFamily: "Verdana",
                            fontWeight: 500,
                        }}
                    >
                        CREATE FREE ACCOUNT →
                    </button>
                    <button
                        style={{
                            background: "transparent",
                            color: ink,
                            border: `1px solid ${border}`,
                            padding: "13px 24px",
                            fontSize: 10,
                            letterSpacing: "0.16em",
                            textTransform: "uppercase",
                            cursor: "pointer",
                            fontFamily: "Verdana",
                        }}
                    >
                        TALK TO SALES
                    </button>
                </div>
                <p
                    style={{
                        fontSize: 10,
                        color: ghost,
                        letterSpacing: "0.08em",
                    }}
                >
                    No credit card required · EMD Deposit when you bid · Refunds
                    within 48hrs
                </p>
            </div>
            <div
                style={{
                    background: stone,
                    padding: "20px 28px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <span
                    style={{
                        fontFamily: "Verdana",
                        fontSize: 13,
                        fontWeight: 500,
                        color: ink,
                        letterSpacing: "0.05em",
                    }}
                >
                    BIDNEXT
                </span>
                <div style={{ display: "flex", gap: 24 }}>
                    {["Terms", "Privacy", "Support", "Careers", "API Docs"].map(
                        (l) => (
                            <span
                                key={l}
                                style={{
                                    fontSize: 11,
                                    color: ghost,
                                    cursor: "pointer",
                                }}
                            >
                                {l}
                            </span>
                        )
                    )}
                </div>
            </div>
            {regOpen && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        minHeight: 600,
                        background: "rgba(0,0,0,0.55)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    }}
                    onClick={() => setRegOpen(false)}
                >
                    <div
                        style={{
                            background: "#fff",
                            padding: "44px",
                            width: 420,
                            maxWidth: "90vw",
                            position: "relative",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setRegOpen(false)}
                            style={{
                                position: "absolute",
                                top: 14,
                                right: 16,
                                background: "none",
                                border: "none",
                                fontSize: 18,
                                cursor: "pointer",
                                color: ghost,
                            }}
                        >
                            ✕
                        </button>
                        <div
                            style={{
                                fontSize: 9,
                                letterSpacing: "0.22em",
                                color: blue,
                                textTransform: "uppercase",
                                marginBottom: 12,
                                fontWeight: 500,
                            }}
                        >
                            GET STARTED
                        </div>
                        <h2
                            style={{
                                fontFamily: "Verdana",
                                fontSize: 20,
                                fontWeight: 500,
                                color: ink,
                                marginBottom: 24,
                                lineHeight: 1.2,
                            }}
                        >
                            Create your account
                        </h2>
                        {[
                            { label: "Full Name", p: "Rajesh Kumar" },
                            { label: "Company Name", p: "Kumar Industries" },
                            { label: "Mobile Number", p: "+91 98765 43210" },
                            { label: "Email Address", p: "rajesh@kumar.com" },
                        ].map((f) => (
                            <div key={f.label} style={{ marginBottom: 14 }}>
                                <div
                                    style={{
                                        fontSize: 9,
                                        letterSpacing: "0.18em",
                                        color: ghost,
                                        textTransform: "uppercase",
                                        marginBottom: 6,
                                    }}
                                >
                                    {f.label}
                                </div>
                                <input
                                    placeholder={f.p}
                                    readOnly
                                    style={{
                                        width: "100%",
                                        background: offWh,
                                        border: `1px solid ${border}`,
                                        padding: "10px 14px",
                                        fontSize: 13,
                                        color: ink,
                                        fontFamily: "Verdana",
                                        outline: "none",
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>
                        ))}
                        <button
                            style={{
                                width: "100%",
                                background: blue,
                                border: "none",
                                color: "#fff",
                                padding: "13px",
                                fontFamily: "Verdana",
                                fontSize: 11,
                                letterSpacing: "0.16em",
                                textTransform: "uppercase",
                                cursor: "pointer",
                                marginTop: 8,
                            }}
                        >
                            CONTINUE →
                        </button>
                        <div
                            style={{
                                marginTop: 12,
                                textAlign: "center",
                                fontSize: 10,
                                color: ghost,
                                lineHeight: 1.6,
                            }}
                        >
                            By continuing you agree to our Terms of Service.
                            <br />
                            Company details verified against MCA records.
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// ─── Registration Carousel ───────────────────────────────────────────────────
const REG_SCREENS = [
    {
        id: "entry",
        step: null,
        leftBg: "#1e40af",
        leftContent: {
            eyebrow: "Welcome to BID NEXT",
            stat: "₹840Cr+",
            statLabel: "traded on platform",
            headline: "India's B2B\nauction marketplace",
            sub: "Steel · Polymers · Paper · Chemicals · Non-Ferrous",
            trust: [
                "147 live auctions right now",
                "12,400+ verified bidders",
                "No registration required to browse",
            ],
        },
        screen: "entry",
    },
    {
        id: "type",
        step: "01 / 05",
        leftBg: "#1e40af",
        leftContent: {
            eyebrow: "Step 01 — Account type",
            headline: "Choose how\nyou'll be bidding",
            sub: "Different paths. Same platform. Same auctions.",
            note: "You can switch your account type later from Settings.",
        },
        screen: "type",
    },
    {
        id: "basics",
        step: "02 / 05",
        leftBg: "#1e40af",
        leftContent: {
            eyebrow: "Step 02 — Your details",
            headline: "Create your\naccount",
            sub: "No credit card. No commitment. Takes 2 minutes.",
            trust: ["256-bit encrypted", "MCA verified", "No spam, ever"],
        },
        screen: "basics",
    },
    {
        id: "otp",
        step: "03 / 05",
        leftBg: "#1e40af",
        leftContent: {
            eyebrow: "Step 03 — Verification",
            headline: "Verify your\nmobile number",
            sub: "We sent a 6-digit code to +91 98765 43210",
            note: "OTP is valid for 10 minutes.",
        },
        screen: "otp",
    },
    {
        id: "business",
        step: "04 / 05",
        leftBg: "#1e40af",
        leftContent: {
            eyebrow: "Step 04 — Business details",
            headline: "Tell us about\nyour company",
            sub: "We verify all businesses against MCA records.",
            note: "Verification takes under 60 seconds.",
        },
        screen: "business",
    },
    {
        id: "wallet",
        step: "05 / 05",
        leftBg: "#1e40af",
        leftContent: {
            eyebrow: "Step 05 — Wallet",
            headline: "Fund your\nwallet to bid",
            sub: "EMD is locked only when you place a bid — not before.",
            trust: [
                "Refunded within 24 hrs if you don't win",
                "Full visibility at all times",
                "Withdraw anytime",
            ],
        },
        screen: "wallet",
    },
    {
        id: "success",
        step: null,
        leftBg: "#1e40af",
        leftContent: {
            eyebrow: "Account ready",
            headline: "You're in.\nStart winning.",
            sub: "147 lots are live right now. Your first bid is one tap away.",
        },
        screen: "success",
    },
]

function RegScreen({ screen }) {
    const border = "#e0ddd6",
        stone = "#f2f1ed",
        offWh = "#fafaf8",
        blue = "#1e40af",
        ink = "#1e40af",
        ghost = "#888880",
        paleB = "#e0ddd6"
    const Input = ({
        label,
        placeholder,
        prefix,
        value,
        hint,
        error,
        type = "text",
    }) => (
        <div style={{ marginBottom: 20 }}>
            <div
                style={{
                    fontSize: 10,
                    letterSpacing: "0.22em",
                    color: ghost,
                    textTransform: "uppercase",
                    marginBottom: 8,
                    fontFamily: "Verdana",
                }}
            >
                {label}
            </div>
            <div
                style={{
                    display: "flex",
                    border: `1px solid ${error ? "#dc2626" : border}`,
                    overflow: "hidden",
                    background: "#fff",
                }}
            >
                {prefix && (
                    <div
                        style={{
                            padding: "13px 14px",
                            background: stone,
                            borderRight: `1px solid ${border}`,
                            fontSize: 13,
                            color: ghost,
                            fontFamily: "Verdana",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {prefix}
                    </div>
                )}
                <input
                    defaultValue={value}
                    placeholder={placeholder}
                    type={type}
                    readOnly
                    style={{
                        flex: 1,
                        border: "none",
                        outline: "none",
                        padding: "13px 14px",
                        fontSize: 14,
                        fontFamily: "Verdana",
                        color: ink,
                        background: "transparent",
                        width: "100%",
                    }}
                />
            </div>
            {hint && (
                <div style={{ fontSize: 11, color: ghost, marginTop: 5 }}>
                    {hint}
                </div>
            )}
            {error && (
                <div style={{ fontSize: 11, color: "#dc2626", marginTop: 5 }}>
                    {error}
                </div>
            )}
        </div>
    )
    const PrimaryBtn = ({ label }) => (
        <button
            style={{
                width: "100%",
                background: ink,
                border: "none",
                color: "#fff",
                padding: "16px 24px",
                fontFamily: "Verdana",
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 8,
            }}
        >
            <span>{label}</span>
            <span style={{ fontSize: 16 }}>→</span>
        </button>
    )
    if (screen === "entry")
        return (
            <div style={{ padding: "40px 44px" }}>
                <div
                    style={{
                        fontSize: 11,
                        color: ghost,
                        marginBottom: 28,
                        letterSpacing: "0.02em",
                    }}
                >
                    How would you like to continue?
                </div>
                <div
                    style={{
                        border: `1px solid ${border}`,
                        padding: "24px",
                        marginBottom: 12,
                        cursor: "pointer",
                        background: "#fff",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 20,
                    }}
                >
                    <div
                        style={{
                            width: 44,
                            height: 44,
                            border: `1px solid ${border}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 20,
                            flexShrink: 0,
                            background: stone,
                        }}
                    >
                        👁
                    </div>
                    <div style={{ flex: 1 }}>
                        <div
                            style={{
                                fontSize: 14,
                                color: ink,
                                fontFamily: "Verdana",
                                marginBottom: 4,
                            }}
                        >
                            Browse as Guest
                        </div>
                        <div
                            style={{
                                fontSize: 12,
                                color: ghost,
                                lineHeight: 1.6,
                            }}
                        >
                            See all 147 live lots, categories, and pricing — no
                            sign-up needed.
                        </div>
                    </div>
                    <div
                        style={{
                            fontSize: 18,
                            color: paleB,
                            alignSelf: "center",
                        }}
                    >
                        ›
                    </div>
                </div>
                <div
                    style={{
                        border: `1px solid ${ink}`,
                        padding: "24px",
                        cursor: "pointer",
                        background: ink,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 20,
                    }}
                >
                    <div
                        style={{
                            width: 44,
                            height: 44,
                            border: "1px solid rgba(255,255,255,0.15)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 20,
                            flexShrink: 0,
                            background: "rgba(255,255,255,0.08)",
                        }}
                    >
                        🏷
                    </div>
                    <div style={{ flex: 1 }}>
                        <div
                            style={{
                                fontSize: 14,
                                color: "#fff",
                                fontFamily: "Verdana",
                                marginBottom: 4,
                            }}
                        >
                            Create Account
                        </div>
                        <div
                            style={{
                                fontSize: 12,
                                color: "rgba(255,255,255,0.55)",
                                lineHeight: 1.6,
                            }}
                        >
                            Bid, win lots, track wallet — 2 minutes to set up.
                        </div>
                    </div>
                    <div
                        style={{
                            fontSize: 18,
                            color: "rgba(255,255,255,0.3)",
                            alignSelf: "center",
                        }}
                    >
                        ›
                    </div>
                </div>
                <div
                    style={{
                        marginTop: 28,
                        paddingTop: 24,
                        borderTop: `1px solid ${border}`,
                        fontSize: 12,
                        color: ghost,
                        textAlign: "center",
                    }}
                >
                    Already have an account?{" "}
                    <span style={{ color: blue, cursor: "pointer" }}>
                        Log in →
                    </span>
                </div>
            </div>
        )
    if (screen === "type")
        return (
            <div style={{ padding: "40px 44px" }}>
                <div style={{ fontSize: 11, color: ghost, marginBottom: 24 }}>
                    Select the option that best describes you
                </div>
                {[
                    {
                        icon: "🏢",
                        label: "Business",
                        tag: "Recommended",
                        sub: "GSTIN verified · Higher bid limits · Company invoice",
                        selected: true,
                    },
                    {
                        icon: "👤",
                        label: "Individual",
                        tag: "",
                        sub: "PAN card · Personal limits · Quick 90-sec setup",
                        selected: false,
                    },
                ].map((t, i) => (
                    <div
                        key={i}
                        style={{
                            border: `1px solid ${t.selected ? ink : border}`,
                            padding: "22px 24px",
                            marginBottom: 10,
                            cursor: "pointer",
                            background: t.selected ? ink : "#fff",
                            display: "flex",
                            alignItems: "center",
                            gap: 18,
                        }}
                    >
                        <div
                            style={{
                                width: 44,
                                height: 44,
                                border: `1px solid ${t.selected ? "rgba(255,255,255,0.15)" : border}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 20,
                                flexShrink: 0,
                                background: t.selected
                                    ? "rgba(255,255,255,0.08)"
                                    : stone,
                            }}
                        >
                            {t.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    marginBottom: 4,
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: 14,
                                        color: t.selected ? "#fff" : ink,
                                        fontFamily: "Verdana",
                                    }}
                                >
                                    {t.label}
                                </span>
                                {t.tag && (
                                    <span
                                        style={{
                                            fontSize: 9,
                                            letterSpacing: "0.16em",
                                            color: t.selected
                                                ? "rgba(255,255,255,0.5)"
                                                : blue,
                                            textTransform: "uppercase",
                                            border: `1px solid ${t.selected ? "rgba(255,255,255,0.2)" : "#bfdbfe"}`,
                                            padding: "2px 7px",
                                        }}
                                    >
                                        {t.tag}
                                    </span>
                                )}
                            </div>
                            <div
                                style={{
                                    fontSize: 12,
                                    color: t.selected
                                        ? "rgba(255,255,255,0.5)"
                                        : ghost,
                                    lineHeight: 1.6,
                                }}
                            >
                                {t.sub}
                            </div>
                        </div>
                        <div
                            style={{
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                border: `2px solid ${t.selected ? "#fff" : border}`,
                                background: t.selected ? "#fff" : "transparent",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            {t.selected && (
                                <div
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        background: ink,
                                    }}
                                />
                            )}
                        </div>
                    </div>
                ))}
                <PrimaryBtn label="Continue with Business account" />
            </div>
        )
    if (screen === "basics")
        return (
            <div style={{ padding: "40px 44px" }}>
                <Input
                    label="Full Name"
                    placeholder="As per PAN / Aadhaar"
                    value="Rajesh Kumar"
                />
                <Input
                    label="Mobile Number"
                    prefix="+91"
                    placeholder="98765 43210"
                    value="98765 43210"
                />
                <Input
                    label="Company Email"
                    placeholder="you@company.com"
                    value="rajesh@steelco.in"
                    type="email"
                />
                <PrimaryBtn label="Continue" />
                <div
                    style={{
                        marginTop: 16,
                        fontSize: 11,
                        color: ghost,
                        textAlign: "center",
                        lineHeight: 1.7,
                    }}
                >
                    By continuing you agree to our{" "}
                    <span style={{ color: blue, cursor: "pointer" }}>
                        Terms of Service
                    </span>
                    .
                </div>
            </div>
        )
    if (screen === "otp")
        return (
            <div style={{ padding: "40px 44px" }}>
                <div
                    style={{
                        fontSize: 12,
                        color: ghost,
                        marginBottom: 32,
                        lineHeight: 1.7,
                    }}
                >
                    Enter the 6-digit code sent to{" "}
                    <strong style={{ color: ink }}>+91 98765 43210</strong>
                </div>
                <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
                    {["9", "4", "_", "_", "_", "_"].map((d, i) => (
                        <div
                            key={i}
                            style={{
                                flex: 1,
                                aspectRatio: "1",
                                border: `2px solid ${d === "_" ? border : ink}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontFamily: "Verdana",
                                fontSize: 24,
                                color: ink,
                                background: d === "_" ? "#fff" : stone,
                            }}
                        >
                            {d === "_" ? "" : d}
                        </div>
                    ))}
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 28,
                    }}
                >
                    <div style={{ fontSize: 11, color: ghost }}>
                        <span style={{ color: ink, fontFamily: "Verdana" }}>
                            0:42
                        </span>{" "}
                        remaining
                    </div>
                    <span
                        style={{
                            fontSize: 11,
                            color: paleB,
                            cursor: "not-allowed",
                        }}
                    >
                        Resend code
                    </span>
                </div>
                <button
                    style={{
                        width: "100%",
                        background: blue,
                        border: "none",
                        color: "#fff",
                        padding: "16px 24px",
                        fontFamily: "Verdana",
                        fontSize: 12,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <span>Verify &amp; Continue</span>
                    <span style={{ fontSize: 16 }}>→</span>
                </button>
                <div
                    style={{
                        marginTop: 16,
                        fontSize: 11,
                        color: ghost,
                        textAlign: "center",
                    }}
                >
                    Wrong number?{" "}
                    <span style={{ color: blue, cursor: "pointer" }}>
                        Change mobile
                    </span>
                </div>
            </div>
        )
    if (screen === "business")
        return (
            <div style={{ padding: "40px 44px" }}>
                <div style={{ marginBottom: 20 }}>
                    <div
                        style={{
                            fontSize: 10,
                            letterSpacing: "0.22em",
                            color: ghost,
                            textTransform: "uppercase",
                            marginBottom: 8,
                        }}
                    >
                        Company Name
                    </div>
                    <div
                        style={{
                            border: `1px solid ${border}`,
                            padding: "13px 14px",
                            fontSize: 14,
                            fontFamily: "Verdana",
                            color: ink,
                        }}
                    >
                        SteelCo Industries Pvt. Ltd.
                    </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                    <div
                        style={{
                            fontSize: 10,
                            letterSpacing: "0.22em",
                            color: ghost,
                            textTransform: "uppercase",
                            marginBottom: 8,
                        }}
                    >
                        GSTIN
                    </div>
                    <div
                        style={{
                            border: `1px solid ${border}`,
                            padding: "13px 14px",
                            fontSize: 14,
                            fontFamily: "Verdana",
                            color: ink,
                        }}
                    >
                        27AABCS1429B1Z1
                    </div>
                    <div style={{ fontSize: 11, color: ghost, marginTop: 5 }}>
                        15-digit GSTIN as issued by GST portal
                    </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                    <div
                        style={{
                            fontSize: 10,
                            letterSpacing: "0.22em",
                            color: ghost,
                            textTransform: "uppercase",
                            marginBottom: 8,
                        }}
                    >
                        Primary Industry
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {[
                            "Steel",
                            "Polymers",
                            "Paper",
                            "Non-Ferrous",
                            "Chemicals",
                            "Others",
                        ].map((c, i) => (
                            <div
                                key={c}
                                style={{
                                    padding: "8px 16px",
                                    border: `1px solid ${i === 0 ? ink : border}`,
                                    fontSize: 12,
                                    color: i === 0 ? "#fff" : ghost,
                                    cursor: "pointer",
                                    background: i === 0 ? ink : "transparent",
                                }}
                            >
                                {c}
                            </div>
                        ))}
                    </div>
                </div>
                <div
                    style={{
                        background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        padding: "12px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 20,
                    }}
                >
                    <span style={{ fontSize: 14 }}>✓</span>
                    <span style={{ fontSize: 12, color: "#166534" }}>
                        GSTIN verified against MCA records in real-time
                    </span>
                </div>
                <button
                    style={{
                        width: "100%",
                        background: ink,
                        border: "none",
                        color: "#fff",
                        padding: "16px 24px",
                        fontFamily: "Verdana",
                        fontSize: 12,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: 8,
                    }}
                >
                    <span>Save &amp; Continue</span>
                    <span style={{ fontSize: 16 }}>→</span>
                </button>
            </div>
        )
    if (screen === "wallet")
        return (
            <div style={{ padding: "40px 44px" }}>
                <div style={{ marginBottom: 20 }}>
                    <div
                        style={{
                            fontSize: 10,
                            letterSpacing: "0.22em",
                            color: ghost,
                            textTransform: "uppercase",
                            marginBottom: 8,
                        }}
                    >
                        Add Amount
                    </div>
                    <div
                        style={{
                            display: "flex",
                            border: `2px solid ${ink}`,
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                padding: "16px 18px",
                                background: ink,
                                fontSize: 20,
                                color: "#fff",
                                fontFamily: "Verdana",
                                fontWeight: "bold",
                            }}
                        >
                            ₹
                        </div>
                        <input
                            defaultValue="50,000"
                            readOnly
                            style={{
                                flex: 1,
                                border: "none",
                                outline: "none",
                                padding: "16px 18px",
                                fontSize: 24,
                                fontFamily: "Verdana",
                                color: ink,
                                background: "#fff",
                            }}
                        />
                    </div>
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                    {["₹25,000", "₹50,000", "₹1,00,000"].map((a, i) => (
                        <button
                            key={a}
                            style={{
                                flex: 1,
                                padding: "10px",
                                border: `1px solid ${i === 1 ? ink : border}`,
                                background: i === 1 ? ink : "transparent",
                                color: i === 1 ? "#fff" : ghost,
                                fontFamily: "Verdana",
                                fontSize: 12,
                                cursor: "pointer",
                            }}
                        >
                            {a}
                        </button>
                    ))}
                </div>
                <div
                    style={{
                        border: `1px solid ${border}`,
                        marginBottom: 20,
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            background: stone,
                            padding: "10px 16px",
                            borderBottom: `1px solid ${border}`,
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <span
                            style={{
                                fontSize: 10,
                                letterSpacing: "0.18em",
                                color: ghost,
                                textTransform: "uppercase",
                            }}
                        >
                            After top-up
                        </span>
                        <span
                            style={{
                                fontFamily: "Verdana",
                                fontSize: 16,
                                color: ink,
                            }}
                        >
                            ₹50,000
                        </span>
                    </div>
                    {[
                        { dot: "#16a34a", l: "Available to bid", v: "₹50,000" },
                        {
                            dot: "#1e40af",
                            l: "EMD locked (when bidding)",
                            v: "₹0",
                        },
                        { dot: "#d97706", l: "Pending refunds", v: "₹0" },
                    ].map((r, i) => (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "10px 16px",
                                borderBottom:
                                    i < 2 ? `1px solid ${border}` : "none",
                                background: "#fff",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                <div
                                    style={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: "50%",
                                        background: r.dot,
                                    }}
                                />
                                <span style={{ fontSize: 12, color: ghost }}>
                                    {r.l}
                                </span>
                            </div>
                            <span style={{ fontSize: 13, color: ink }}>
                                {r.v}
                            </span>
                        </div>
                    ))}
                </div>
                <button
                    style={{
                        width: "100%",
                        background: blue,
                        border: "none",
                        color: "#fff",
                        padding: "16px 24px",
                        fontFamily: "Verdana",
                        fontSize: 12,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <span>Add Funds &amp; Start Bidding</span>
                    <span style={{ fontSize: 16 }}>→</span>
                </button>
                <div
                    style={{
                        marginTop: 12,
                        textAlign: "center",
                        fontSize: 11,
                        color: ghost,
                        cursor: "pointer",
                    }}
                >
                    Skip for now — browse without bidding
                </div>
            </div>
        )
    if (screen === "success")
        return (
            <div
                style={{
                    padding: "40px 44px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 0,
                }}
            >
                <div
                    style={{
                        border: "1px solid #e0ddd6",
                        overflow: "hidden",
                        marginBottom: 20,
                    }}
                >
                    <div
                        style={{
                            background: stone,
                            padding: "14px 20px",
                            borderBottom: `1px solid ${border}`,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <span
                            style={{
                                fontSize: 10,
                                letterSpacing: "0.18em",
                                color: ghost,
                                textTransform: "uppercase",
                            }}
                        >
                            Your Account
                        </span>
                        <span
                            style={{
                                fontSize: 9,
                                letterSpacing: "0.16em",
                                background: "#f0fdf4",
                                color: "#166534",
                                border: "1px solid #bbf7d0",
                                padding: "3px 10px",
                                textTransform: "uppercase",
                            }}
                        >
                            Verified
                        </span>
                    </div>
                    {[
                        { l: "Name", v: "Rajesh Kumar" },
                        { l: "Company", v: "SteelCo Industries Pvt. Ltd." },
                        { l: "GSTIN", v: "27AABCS1429B1Z1" },
                        { l: "Mobile", v: "+91 98765 43210" },
                        { l: "Wallet balance", v: "₹50,000" },
                    ].map((r, i) => (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "11px 20px",
                                borderBottom:
                                    i < 4 ? `1px solid ${border}` : "none",
                                background: "#fff",
                            }}
                        >
                            <span style={{ fontSize: 11, color: ghost }}>
                                {r.l}
                            </span>
                            <span
                                style={{
                                    fontSize: 13,
                                    color:
                                        r.l === "Wallet balance" ? blue : ink,
                                    fontFamily:
                                        r.l === "GSTIN"
                                            ? "monospace"
                                            : "Verdana",
                                }}
                            >
                                {r.v}
                            </span>
                        </div>
                    ))}
                </div>
                <div
                    style={{
                        background: ink,
                        padding: "16px 20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 12,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                        }}
                    >
                        <div
                            style={{
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                background: "#22c55e",
                                animation: "mpulse 1.5s infinite",
                            }}
                        />
                        <span
                            style={{
                                fontSize: 12,
                                color: "rgba(255,255,255,0.8)",
                            }}
                        >
                            147 lots live right now
                        </span>
                    </div>
                    <span
                        style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}
                    >
                        Steel · Polymers · Paper
                    </span>
                </div>
                <button
                    style={{
                        width: "100%",
                        background: blue,
                        border: "none",
                        color: "#fff",
                        padding: "16px 24px",
                        fontFamily: "Verdana",
                        fontSize: 12,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <span>Go to Marketplace</span>
                    <span style={{ fontSize: 16 }}>→</span>
                </button>
            </div>
        )
    return null
}

function RegistrationCarousel() {
    const [current, setCurrent] = useState(0)
    const [paused, setPaused] = useState(false)
    const total = REG_SCREENS.length
    useEffect(() => {
        if (paused) return
        const id = setInterval(() => setCurrent((c) => (c + 1) % total), 5000)
        return () => clearInterval(id)
    }, [paused, total])
    const goTo = (i) => setCurrent(i)
    const prev = () => setCurrent((c) => (c - 1 + total) % total)
    const next = () => setCurrent((c) => (c + 1) % total)
    const s = REG_SCREENS[current]
    const pct = ((current + 1) / total) * 100
    return (
        <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            style={{ fontFamily: "Verdana,sans-serif", position: "relative" }}
        >
            <style>{`@keyframes regSlideIn{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}.reg-panel-in{animation:regSlideIn 0.35s ease both;}`}</style>
            <div
                style={{
                    height: 3,
                    background: "#e0ddd6",
                    position: "relative",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        height: "100%",
                        background: "#1e40af",
                        width: `${pct}%`,
                        transition: "width 0.5s ease",
                    }}
                />
            </div>
            <div
                style={{
                    background: "#f2f1ed",
                    borderBottom: "1px solid #e0ddd6",
                    padding: "10px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ display: "flex", gap: 5 }}>
                        {["#ef4444", "#f59e0b", "#22c55e"].map((c, i) => (
                            <div
                                key={i}
                                style={{
                                    width: 9,
                                    height: 9,
                                    borderRadius: "50%",
                                    background: c,
                                }}
                            />
                        ))}
                    </div>
                    <div
                        style={{ width: 1, height: 12, background: "#e0ddd6" }}
                    />
                    <span
                        style={{
                            fontSize: 10,
                            letterSpacing: "0.18em",
                            color: "#aaa9a3",
                            textTransform: "uppercase",
                        }}
                    >
                        Registration · Screen {current + 1} of {total}
                    </span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                    {[
                        "Entry",
                        "Type",
                        "Basics",
                        "OTP",
                        "Business",
                        "Wallet",
                        "Done",
                    ]
                        .slice(0, total)
                        .map((l, i) => (
                            <div
                                key={i}
                                onClick={() => goTo(i)}
                                style={{
                                    padding: "3px 10px",
                                    background:
                                        i === current
                                            ? "#1e40af"
                                            : "transparent",
                                    border: `1px solid ${i === current ? "#1e40af" : "#e0ddd6"}`,
                                    color: i === current ? "#fff" : "#aaa9a3",
                                    fontSize: 9,
                                    letterSpacing: "0.14em",
                                    textTransform: "uppercase",
                                    cursor: "pointer",
                                }}
                            >
                                {l}
                            </div>
                        ))}
                </div>
            </div>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "40% 60%",
                    minHeight: 580,
                }}
            >
                <div
                    key={`left-${current}`}
                    className="reg-panel-in"
                    style={{
                        background: s.leftBg,
                        padding: "52px 44px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    {s.step && (
                        <div
                            style={{
                                position: "absolute",
                                right: -12,
                                top: -12,
                                fontFamily: "Verdana",
                                fontSize: 140,
                                color: "rgba(255,255,255,0.04)",
                                lineHeight: 1,
                                userSelect: "none",
                            }}
                        >
                            {s.step.split(" / ")[0]}
                        </div>
                    )}
                    <div style={{ position: "relative" }}>
                        <div
                            style={{
                                fontSize: 9,
                                letterSpacing: "0.28em",
                                color: "rgba(255,255,255,0.4)",
                                textTransform: "uppercase",
                                marginBottom: s.leftContent.stat ? 24 : 20,
                            }}
                        >
                            {s.leftContent.eyebrow}
                        </div>
                        {s.leftContent.stat && (
                            <div style={{ marginBottom: 20 }}>
                                <div
                                    style={{
                                        fontFamily: "Verdana",
                                        fontSize: 52,
                                        color: "#fff",
                                        lineHeight: 1,
                                        marginBottom: 6,
                                    }}
                                >
                                    {s.leftContent.stat}
                                </div>
                                <div
                                    style={{
                                        fontSize: 11,
                                        color: "rgba(255,255,255,0.4)",
                                        letterSpacing: "0.06em",
                                    }}
                                >
                                    {s.leftContent.statLabel}
                                </div>
                            </div>
                        )}
                        <div
                            style={{
                                fontFamily: "Verdana",
                                fontSize: s.leftContent.stat ? 22 : 32,
                                color: "#fff",
                                lineHeight: 1.15,
                                letterSpacing: "-0.01em",
                                whiteSpace: "pre-line",
                                marginBottom: 16,
                            }}
                        >
                            {s.leftContent.headline}
                        </div>
                        <p
                            style={{
                                fontSize: 12,
                                color: "rgba(255,255,255,0.45)",
                                lineHeight: 1.7,
                                margin: 0,
                            }}
                        >
                            {s.leftContent.sub}
                        </p>
                    </div>
                    <div>
                        {s.leftContent.trust && (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 10,
                                }}
                            >
                                {s.leftContent.trust.map((t, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 16,
                                                height: 16,
                                                borderRadius: "50%",
                                                border: "1px solid rgba(255,255,255,0.2)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: 9,
                                                    color: "rgba(255,255,255,0.6)",
                                                }}
                                            >
                                                ✓
                                            </div>
                                        </div>
                                        <span
                                            style={{
                                                fontSize: 11,
                                                color: "rgba(255,255,255,0.45)",
                                            }}
                                        >
                                            {t}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {s.leftContent.note && (
                            <div
                                style={{
                                    borderTop:
                                        "1px solid rgba(255,255,255,0.08)",
                                    paddingTop: 16,
                                    fontSize: 11,
                                    color: "rgba(255,255,255,0.3)",
                                    lineHeight: 1.6,
                                    fontStyle: "italic",
                                }}
                            >
                                {s.leftContent.note}
                            </div>
                        )}
                        {s.step && (
                            <div
                                style={{
                                    marginTop: 24,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                {REG_SCREENS.filter((r) => r.step).map(
                                    (r, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                height: 2,
                                                flex: 1,
                                                background:
                                                    i <= current - 1
                                                        ? "rgba(255,255,255,0.7)"
                                                        : "rgba(255,255,255,0.15)",
                                                transition: "background 0.4s",
                                            }}
                                        />
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div
                    key={`right-${current}`}
                    className="reg-panel-in"
                    style={{
                        background: "#ffffff",
                        borderLeft: "1px solid #e0ddd6",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <div
                        style={{
                            padding: "20px 44px",
                            borderBottom: "1px solid #e0ddd6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <div
                            style={{
                                fontFamily: "Verdana",
                                fontSize: 15,
                                color: "#111",
                            }}
                        >
                            BID<span style={{ color: "#1e40af" }}>NEXT</span>
                        </div>
                        {s.step && (
                            <div
                                style={{
                                    fontSize: 10,
                                    letterSpacing: "0.2em",
                                    color: "#aaa9a3",
                                    textTransform: "uppercase",
                                }}
                            >
                                {s.step}
                            </div>
                        )}
                    </div>
                    <div style={{ flex: 1 }}>
                        <RegScreen screen={s.screen} />
                    </div>
                </div>
            </div>
            <div
                style={{
                    background: "#fafaf8",
                    borderTop: "1px solid #e0ddd6",
                    padding: "14px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <button
                    onClick={prev}
                    style={{
                        width: 36,
                        height: 36,
                        border: "1px solid #e0ddd6",
                        background: "transparent",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        color: "#888880",
                    }}
                >
                    ←
                </button>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {REG_SCREENS.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            style={{
                                width: i === current ? 24 : 8,
                                height: 8,
                                background:
                                    i === current ? "#1e40af" : "#e0ddd6",
                                border: "none",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                padding: 0,
                            }}
                        />
                    ))}
                </div>
                <button
                    onClick={next}
                    style={{
                        width: 36,
                        height: 36,
                        border: "1px solid #e0ddd6",
                        background: "transparent",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        color: "#888880",
                    }}
                >
                    →
                </button>
            </div>
        </div>
    )
}

// ─── Wallet Screen ────────────────────────────────────────────────────────────
const TRANSACTIONS = [
    {
        date: "20 Feb",
        lot: "LOT-0047",
        material: "HR Steel Coils",
        type: "EMD Lock",
        amount: -100000,
        status: "locked",
        ref: "TXN-9204",
    },
    {
        date: "20 Feb",
        lot: "LOT-0063",
        material: "CR Steel Sheets",
        type: "EMD Lock",
        amount: -96000,
        status: "locked",
        ref: "TXN-9201",
    },
    {
        date: "18 Feb",
        lot: "LOT-0039",
        material: "Kraft Paper Rolls",
        type: "EMD Refund",
        amount: +62000,
        status: "refunded",
        ref: "TXN-9188",
    },
    {
        date: "17 Feb",
        lot: "LOT-0051",
        material: "LDPE Granules",
        type: "EMD Refund",
        amount: +44000,
        status: "refunded",
        ref: "TXN-9174",
    },
    {
        date: "15 Feb",
        lot: "—",
        material: "Wallet Top-up",
        type: "Added Funds",
        amount: +300000,
        status: "success",
        ref: "TXN-9102",
    },
    {
        date: "14 Feb",
        lot: "LOT-0031",
        material: "Aluminium Ingots",
        type: "Bid Won · Invoice",
        amount: -218000,
        status: "settled",
        ref: "TXN-9088",
    },
    {
        date: "12 Feb",
        lot: "LOT-0028",
        material: "Chemical Drums",
        type: "EMD Refund",
        amount: +18000,
        status: "refunded",
        ref: "TXN-9071",
    },
    {
        date: "10 Feb",
        lot: "—",
        material: "Wallet Top-up",
        type: "Added Funds",
        amount: +150000,
        status: "success",
        ref: "TXN-9044",
    },
]
const EMD_LOTS = [
    {
        id: "LOT-0047",
        material: "HR Steel Coils",
        emd: 100000,
        bidStatus: "Leading",
        rank: "#1 of 7",
        endsIn: 312,
        heat: "high",
    },
    {
        id: "LOT-0063",
        material: "CR Steel Sheets",
        emd: 96000,
        bidStatus: "Outbid",
        rank: "#3 of 9",
        endsIn: 178,
        heat: "critical",
    },
]

function WalletScreen() {
    const [tab, setTab] = useState("overview")
    const [expandedRow, setExpandedRow] = useState(null)
    const [addFundsAmt, setAddFundsAmt] = useState("1,00,000")
    const border = "#e0ddd6",
        stone = "#f2f1ed",
        offWh = "#fafaf8",
        blue = "#1e40af",
        ink = "#111111",
        ghost = "#888880",
        pale = "#cccac4"
    const TABS = ["overview", "emd", "transactions", "add funds"]
    const Badge = ({ status }) => {
        const map = {
            locked: {
                bg: "#eff6ff",
                color: "#1e40af",
                dot: "#1e40af",
                label: "EMD Locked",
            },
            refunded: {
                bg: "#f2f1ed",
                color: "#888880",
                dot: "#cccac4",
                label: "Refunded",
            },
            success: {
                bg: "#f0fdf4",
                color: "#166534",
                dot: "#16a34a",
                label: "Completed",
            },
            settled: {
                bg: "#111111",
                color: "#ffffff",
                dot: "#ffffff",
                label: "Settled",
            },
            pending: {
                bg: "#fffbeb",
                color: "#92400e",
                dot: "#d97706",
                label: "Pending",
            },
        }
        const s = map[status] || map.pending
        return (
            <span
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    background: s.bg,
                    color: s.color,
                    border: `1px solid ${s.dot}22`,
                    fontSize: 9,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    padding: "3px 9px",
                }}
            >
                <span
                    style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: s.dot,
                        flexShrink: 0,
                    }}
                />
                {s.label}
            </span>
        )
    }
    const fmtAmt = (n) => {
        const abs = Math.abs(n).toLocaleString("en-IN")
        return n < 0 ? `−₹${abs}` : `+₹${abs}`
    }
    const [ticks, setTicks] = useState({ 0: 312, 1: 178 })
    useEffect(() => {
        const id = setInterval(
            () =>
                setTicks((t) => ({
                    0: Math.max(0, t[0] - 1),
                    1: Math.max(0, t[1] - 1),
                })),
            1000
        )
        return () => clearInterval(id)
    }, [])
    const fmtT = (s) => {
        const m = Math.floor(s / 60),
            sec = s % 60
        return `${m}m ${String(sec).padStart(2, "0")}s`
    }
    return (
        <div
            style={{
                fontFamily: "Verdana,sans-serif",
                background: offWh,
                minHeight: 640,
            }}
        >
            <div
                style={{
                    background: stone,
                    borderBottom: `1px solid ${border}`,
                    padding: "9px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ display: "flex", gap: 5 }}>
                        {["#ef4444", "#f59e0b", "#22c55e"].map((c, i) => (
                            <div
                                key={i}
                                style={{
                                    width: 9,
                                    height: 9,
                                    borderRadius: "50%",
                                    background: c,
                                }}
                            />
                        ))}
                    </div>
                    <div style={{ width: 1, height: 12, background: border }} />
                    <span
                        style={{
                            fontSize: 10,
                            letterSpacing: "0.18em",
                            color: ghost,
                            textTransform: "uppercase",
                        }}
                    >
                        BID NEXT — Wallet &amp; EMD
                    </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                        style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "#16a34a",
                            animation: "mpulse 1.5s infinite",
                        }}
                    />
                    <span
                        style={{
                            fontSize: 10,
                            letterSpacing: "0.14em",
                            color: ghost,
                            textTransform: "uppercase",
                        }}
                    >
                        Live
                    </span>
                </div>
            </div>
            <div
                style={{
                    background: "#fff",
                    borderBottom: `1px solid ${border}`,
                    padding: "0 32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "16px 0",
                    }}
                >
                    <span
                        style={{
                            fontSize: 12,
                            color: ghost,
                            cursor: "pointer",
                        }}
                    >
                        Dashboard
                    </span>
                    <span style={{ fontSize: 12, color: pale }}>›</span>
                    <span style={{ fontSize: 12, color: ink }}>
                        Wallet &amp; EMD
                    </span>
                </div>
                <div
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: blue,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        color: "#fff",
                        fontFamily: "Verdana",
                    }}
                >
                    R
                </div>
            </div>
            <div style={{ background: blue, padding: "32px 32px 0" }}>
                <div
                    style={{
                        fontSize: 9,
                        letterSpacing: "0.28em",
                        color: "rgba(255,255,255,0.5)",
                        textTransform: "uppercase",
                        marginBottom: 8,
                    }}
                >
                    Total Wallet Balance
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 4,
                    }}
                >
                    <div
                        style={{
                            fontFamily: "Verdana",
                            fontSize: 52,
                            color: "#fff",
                            lineHeight: 1,
                        }}
                    >
                        ₹4,12,000
                    </div>
                    <button
                        onClick={() => setTab("add funds")}
                        style={{
                            background: "#fff",
                            color: blue,
                            border: "none",
                            padding: "12px 24px",
                            fontFamily: "Verdana",
                            fontSize: 11,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            cursor: "pointer",
                            fontWeight: 700,
                            flexShrink: 0,
                        }}
                    >
                        + Add Funds
                    </button>
                </div>
                <div
                    style={{
                        fontSize: 12,
                        color: "rgba(255,255,255,0.5)",
                        marginBottom: 28,
                    }}
                >
                    As of today, 20 Feb 2026 · 14:32 IST
                </div>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 1,
                    }}
                >
                    {[
                        {
                            label: "EMD Locked",
                            amount: "₹1,96,000",
                            dot: "#fff",
                            sub: "2 active lots",
                            pct: 48,
                        },
                        {
                            label: "Pending Refund",
                            amount: "₹0",
                            dot: "#fbbf24",
                            sub: "No pending refunds",
                            pct: 0,
                        },
                    ].map((c, i) => (
                        <div
                            key={i}
                            style={{
                                background: "rgba(255,255,255,0.08)",
                                padding: "20px 22px",
                                borderTop: "2px solid rgba(255,255,255,0.15)",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 7,
                                    marginBottom: 10,
                                }}
                            >
                                <div
                                    style={{
                                        width: 7,
                                        height: 7,
                                        borderRadius: "50%",
                                        background: c.dot,
                                        flexShrink: 0,
                                    }}
                                />
                                <span
                                    style={{
                                        fontSize: 9,
                                        letterSpacing: "0.2em",
                                        color: "rgba(255,255,255,0.5)",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    {c.label}
                                </span>
                            </div>
                            <div
                                style={{
                                    fontFamily: "Verdana",
                                    fontSize: 28,
                                    color: "#fff",
                                    lineHeight: 1,
                                    marginBottom: 6,
                                }}
                            >
                                {c.amount}
                            </div>
                            <div
                                style={{
                                    fontSize: 10,
                                    color: "rgba(255,255,255,0.4)",
                                    marginBottom: 10,
                                }}
                            >
                                {c.sub}
                            </div>
                            <div
                                style={{
                                    height: 2,
                                    background: "rgba(255,255,255,0.12)",
                                }}
                            >
                                <div
                                    style={{
                                        height: "100%",
                                        width: `${c.pct}%`,
                                        background: "rgba(255,255,255,0.6)",
                                        transition: "width 0.6s ease",
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ display: "flex", gap: 0, marginTop: 24 }}>
                    {TABS.map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            style={{
                                padding: "12px 24px",
                                background: tab === t ? "#fff" : "transparent",
                                border: "none",
                                borderTop:
                                    tab === t
                                        ? `2px solid ${blue}`
                                        : "2px solid transparent",
                                color:
                                    tab === t ? blue : "rgba(255,255,255,0.5)",
                                fontSize: 11,
                                letterSpacing: "0.14em",
                                textTransform: "uppercase",
                                cursor: "pointer",
                                fontFamily: "Verdana",
                            }}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>
            <div style={{ padding: 0 }}>
                {tab === "overview" && (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 1,
                            background: border,
                        }}
                    >
                        <div
                            style={{ background: "#fff", padding: "28px 28px" }}
                        >
                            <div
                                style={{
                                    fontSize: 10,
                                    letterSpacing: "0.22em",
                                    color: ghost,
                                    textTransform: "uppercase",
                                    marginBottom: 20,
                                }}
                            >
                                Active EMD Positions
                            </div>
                            {EMD_LOTS.map((lot, i) => {
                                const urgent = ticks[i] < 300
                                return (
                                    <div
                                        key={i}
                                        style={{
                                            border: `1px solid ${urgent ? "#fecaca" : border}`,
                                            marginBottom: 12,
                                            overflow: "hidden",
                                            background: urgent
                                                ? "#fff5f5"
                                                : "#fff",
                                        }}
                                    >
                                        <div
                                            style={{
                                                padding: "14px 18px",
                                                borderBottom: `1px solid ${urgent ? "#fecaca" : border}`,
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                background: urgent
                                                    ? "#fef2f2"
                                                    : stone,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 10,
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontFamily: "monospace",
                                                        fontSize: 11,
                                                        color: ghost,
                                                        background: "#fff",
                                                        border: `1px solid ${border}`,
                                                        padding: "2px 8px",
                                                    }}
                                                >
                                                    {lot.id}
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: 12,
                                                        color: ink,
                                                    }}
                                                >
                                                    {lot.material}
                                                </span>
                                            </div>
                                            <div
                                                style={{
                                                    fontFamily: "monospace",
                                                    fontSize: 13,
                                                    color: urgent
                                                        ? "#dc2626"
                                                        : ink,
                                                }}
                                            >
                                                ⏱ {fmtT(ticks[i])}
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns:
                                                    "1fr 1fr 1fr",
                                            }}
                                        >
                                            {[
                                                {
                                                    l: "EMD Locked",
                                                    v: `₹${lot.emd.toLocaleString("en-IN")}`,
                                                },
                                                { l: "Your Rank", v: lot.rank },
                                                {
                                                    l: "Bid Status",
                                                    v: lot.bidStatus,
                                                },
                                            ].map((r, j) => (
                                                <div
                                                    key={j}
                                                    style={{
                                                        padding: "12px 16px",
                                                        borderRight:
                                                            j < 2
                                                                ? `1px solid ${border}`
                                                                : "none",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            fontSize: 9,
                                                            letterSpacing:
                                                                "0.18em",
                                                            color: ghost,
                                                            textTransform:
                                                                "uppercase",
                                                            marginBottom: 5,
                                                        }}
                                                    >
                                                        {r.l}
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: 14,
                                                            fontFamily:
                                                                "Verdana",
                                                            color:
                                                                r.l ===
                                                                "Bid Status"
                                                                    ? lot.bidStatus ===
                                                                      "Leading"
                                                                        ? "#166534"
                                                                        : "#dc2626"
                                                                    : r.l ===
                                                                        "Your Rank"
                                                                      ? blue
                                                                      : ink,
                                                        }}
                                                    >
                                                        {r.v}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div
                                            style={{
                                                padding: "10px 16px",
                                                borderTop: `1px solid ${border}`,
                                                background: offWh,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    height: 3,
                                                    background: border,
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        height: "100%",
                                                        width:
                                                            lot.bidStatus ===
                                                            "Leading"
                                                                ? "100%"
                                                                : "60%",
                                                        background:
                                                            lot.bidStatus ===
                                                            "Leading"
                                                                ? "#16a34a"
                                                                : "#dc2626",
                                                        transition:
                                                            "width 0.6s",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div
                            style={{ background: "#fff", padding: "28px 28px" }}
                        >
                            <div
                                style={{
                                    fontSize: 10,
                                    letterSpacing: "0.22em",
                                    color: ghost,
                                    textTransform: "uppercase",
                                    marginBottom: 20,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <span>Recent Transactions</span>
                                <span
                                    onClick={() => setTab("transactions")}
                                    style={{
                                        fontSize: 10,
                                        color: blue,
                                        cursor: "pointer",
                                    }}
                                >
                                    View all →
                                </span>
                            </div>
                            {TRANSACTIONS.slice(0, 5).map((tx, i) => (
                                <div
                                    key={i}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "13px 0",
                                        borderBottom:
                                            i < 4
                                                ? `1px solid ${border}`
                                                : "none",
                                        cursor: "pointer",
                                    }}
                                    onClick={() =>
                                        setExpandedRow(
                                            expandedRow === i ? null : i
                                        )
                                    }
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 12,
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 34,
                                                height: 34,
                                                background:
                                                    tx.amount > 0
                                                        ? "#f0fdf4"
                                                        : tx.status ===
                                                            "settled"
                                                          ? "#111"
                                                          : "#eff6ff",
                                                border: `1px solid ${tx.amount > 0 ? "#bbf7d0" : tx.status === "settled" ? "#111" : "#bfdbfe"}`,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 14,
                                                flexShrink: 0,
                                            }}
                                        >
                                            {tx.amount > 0
                                                ? "↓"
                                                : tx.status === "settled"
                                                  ? "✓"
                                                  : "🔒"}
                                        </div>
                                        <div>
                                            <div
                                                style={{
                                                    fontSize: 12,
                                                    color: ink,
                                                    marginBottom: 2,
                                                }}
                                            >
                                                {tx.type}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 10,
                                                    color: ghost,
                                                }}
                                            >
                                                {tx.date} ·{" "}
                                                {tx.lot !== "—"
                                                    ? tx.lot
                                                    : tx.material}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div
                                            style={{
                                                fontFamily: "Verdana",
                                                fontSize: 14,
                                                color:
                                                    tx.amount > 0
                                                        ? "#16a34a"
                                                        : tx.status ===
                                                            "settled"
                                                          ? "#888880"
                                                          : blue,
                                            }}
                                        >
                                            {fmtAmt(tx.amount)}
                                        </div>
                                        <Badge status={tx.status} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {tab === "transactions" && (
                    <div style={{ background: "#fff" }}>
                        <div
                            style={{
                                padding: "18px 28px",
                                borderBottom: `1px solid ${border}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                background: stone,
                            }}
                        >
                            <div style={{ display: "flex", gap: 6 }}>
                                {[
                                    "All",
                                    "EMD Locks",
                                    "Refunds",
                                    "Top-ups",
                                    "Settlements",
                                ].map((f, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            padding: "7px 14px",
                                            background:
                                                i === 0 ? ink : "transparent",
                                            border: `1px solid ${i === 0 ? ink : border}`,
                                            fontSize: 10,
                                            letterSpacing: "0.12em",
                                            textTransform: "uppercase",
                                            color: i === 0 ? "#fff" : ghost,
                                            cursor: "pointer",
                                        }}
                                    >
                                        {f}
                                    </div>
                                ))}
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    border: `1px solid ${border}`,
                                    padding: "8px 14px",
                                    background: "#fff",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: 10,
                                        letterSpacing: "0.14em",
                                        color: ghost,
                                        textTransform: "uppercase",
                                        cursor: "pointer",
                                    }}
                                >
                                    Export CSV
                                </span>
                            </div>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "80px 120px 1fr 1fr 140px 100px",
                                background: stone,
                                borderBottom: `1px solid ${border}`,
                                padding: "10px 24px",
                            }}
                        >
                            {[
                                "Date",
                                "Lot Ref",
                                "Transaction",
                                "Material",
                                "Amount",
                                "Status",
                            ].map((h) => (
                                <div
                                    key={h}
                                    style={{
                                        fontSize: 9,
                                        letterSpacing: "0.18em",
                                        color: ghost,
                                        textTransform: "uppercase",
                                    }}
                                >
                                    {h}
                                </div>
                            ))}
                        </div>
                        {TRANSACTIONS.map((tx, i) => (
                            <div key={i}>
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "80px 120px 1fr 1fr 140px 100px",
                                        padding: "16px 24px",
                                        borderBottom: `1px solid ${border}`,
                                        alignItems: "center",
                                        cursor: "pointer",
                                        background: "#fff",
                                    }}
                                    onClick={() =>
                                        setExpandedRow(
                                            expandedRow === i ? null : i
                                        )
                                    }
                                >
                                    <div style={{ fontSize: 12, color: ghost }}>
                                        {tx.date}
                                    </div>
                                    <div
                                        style={{
                                            fontFamily: "monospace",
                                            fontSize: 11,
                                            color: ghost,
                                            background: stone,
                                            border: `1px solid ${border}`,
                                            padding: "3px 8px",
                                            width: "fit-content",
                                        }}
                                    >
                                        {tx.lot}
                                    </div>
                                    <div style={{ fontSize: 12, color: ink }}>
                                        {tx.type}
                                    </div>
                                    <div style={{ fontSize: 12, color: ghost }}>
                                        {tx.material}
                                    </div>
                                    <div
                                        style={{
                                            fontFamily: "Verdana",
                                            fontSize: 14,
                                            color:
                                                tx.amount > 0
                                                    ? "#16a34a"
                                                    : tx.status === "settled"
                                                      ? "#888880"
                                                      : blue,
                                        }}
                                    >
                                        {fmtAmt(tx.amount)}
                                    </div>
                                    <Badge status={tx.status} />
                                </div>
                                {expandedRow === i && (
                                    <div
                                        style={{
                                            background: stone,
                                            borderBottom: `1px solid ${border}`,
                                            padding: "16px 24px",
                                            display: "flex",
                                            gap: 48,
                                            alignItems: "center",
                                        }}
                                    >
                                        <div>
                                            <div
                                                style={{
                                                    fontSize: 9,
                                                    letterSpacing: "0.18em",
                                                    color: ghost,
                                                    textTransform: "uppercase",
                                                    marginBottom: 4,
                                                }}
                                            >
                                                Reference ID
                                            </div>
                                            <div
                                                style={{
                                                    fontFamily: "monospace",
                                                    fontSize: 12,
                                                    color: ink,
                                                }}
                                            >
                                                {tx.ref}
                                            </div>
                                        </div>
                                        <div style={{ marginLeft: "auto" }}>
                                            <span
                                                style={{
                                                    fontSize: 10,
                                                    letterSpacing: "0.14em",
                                                    color: blue,
                                                    textTransform: "uppercase",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Download Receipt →
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                {tab === "add funds" && (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 1,
                            background: border,
                        }}
                    >
                        <div
                            style={{ background: "#fff", padding: "36px 36px" }}
                        >
                            <div
                                style={{
                                    fontSize: 10,
                                    letterSpacing: "0.22em",
                                    color: ghost,
                                    textTransform: "uppercase",
                                    marginBottom: 24,
                                }}
                            >
                                Fund Your Wallet
                            </div>
                            <div style={{ marginBottom: 20 }}>
                                <div
                                    style={{
                                        fontSize: 10,
                                        letterSpacing: "0.2em",
                                        color: ghost,
                                        textTransform: "uppercase",
                                        marginBottom: 8,
                                    }}
                                >
                                    Amount
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        border: `2px solid ${ink}`,
                                        overflow: "hidden",
                                    }}
                                >
                                    <div
                                        style={{
                                            padding: "14px 18px",
                                            background: ink,
                                            fontSize: 18,
                                            color: "#fff",
                                            fontFamily: "Verdana",
                                        }}
                                    >
                                        ₹
                                    </div>
                                    <input
                                        value={addFundsAmt}
                                        onChange={(e) =>
                                            setAddFundsAmt(e.target.value)
                                        }
                                        style={{
                                            flex: 1,
                                            border: "none",
                                            outline: "none",
                                            padding: "14px 18px",
                                            fontSize: 22,
                                            fontFamily: "Verdana",
                                            color: ink,
                                        }}
                                    />
                                </div>
                            </div>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr 1fr",
                                    gap: 8,
                                    marginBottom: 28,
                                }}
                            >
                                {[
                                    ["₹25,000", "25,000"],
                                    ["₹50,000", "50,000"],
                                    ["₹1,00,000", "1,00,000"],
                                    ["₹2,00,000", "2,00,000"],
                                    ["₹5,00,000", "5,00,000"],
                                    ["₹10,00,000", "10,00,000"],
                                ].map(([l, v]) => (
                                    <button
                                        key={v}
                                        onClick={() => setAddFundsAmt(v)}
                                        style={{
                                            padding: "10px",
                                            border: `1px solid ${addFundsAmt === v ? ink : border}`,
                                            background:
                                                addFundsAmt === v
                                                    ? ink
                                                    : "transparent",
                                            color:
                                                addFundsAmt === v
                                                    ? "#fff"
                                                    : ghost,
                                            fontFamily: "Verdana",
                                            fontSize: 12,
                                            cursor: "pointer",
                                        }}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                            <div style={{ marginBottom: 24 }}>
                                <div
                                    style={{
                                        fontSize: 10,
                                        letterSpacing: "0.2em",
                                        color: ghost,
                                        textTransform: "uppercase",
                                        marginBottom: 10,
                                    }}
                                >
                                    Payment Method
                                </div>
                                {[
                                    {
                                        icon: "🏦",
                                        label: "NEFT / RTGS",
                                        sub: "Same day · No limit",
                                        selected: true,
                                    },
                                    {
                                        icon: "💳",
                                        label: "UPI",
                                        sub: "Instant · Up to ₹1 lakh",
                                        selected: false,
                                    },
                                    {
                                        icon: "🏛",
                                        label: "Net Banking",
                                        sub: "Next day · No limit",
                                        selected: false,
                                    },
                                ].map((m, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 14,
                                            padding: "13px 16px",
                                            border: `1px solid ${m.selected ? ink : border}`,
                                            marginBottom: 8,
                                            cursor: "pointer",
                                            background: m.selected
                                                ? offWh
                                                : "transparent",
                                        }}
                                    >
                                        <span style={{ fontSize: 18 }}>
                                            {m.icon}
                                        </span>
                                        <div style={{ flex: 1 }}>
                                            <div
                                                style={{
                                                    fontSize: 13,
                                                    color: ink,
                                                    marginBottom: 2,
                                                }}
                                            >
                                                {m.label}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 11,
                                                    color: ghost,
                                                }}
                                            >
                                                {m.sub}
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                width: 18,
                                                height: 18,
                                                borderRadius: "50%",
                                                border: `2px solid ${m.selected ? ink : border}`,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            {m.selected && (
                                                <div
                                                    style={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: "50%",
                                                        background: ink,
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                style={{
                                    width: "100%",
                                    background: blue,
                                    border: "none",
                                    color: "#fff",
                                    padding: "16px 24px",
                                    fontFamily: "Verdana",
                                    fontSize: 12,
                                    letterSpacing: "0.14em",
                                    textTransform: "uppercase",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <span>Proceed to Pay ₹{addFundsAmt}</span>
                                <span style={{ fontSize: 16 }}>→</span>
                            </button>
                        </div>
                        <div
                            style={{
                                background: offWh,
                                padding: "36px 36px",
                                display: "flex",
                                flexDirection: "column",
                                gap: 24,
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        fontSize: 10,
                                        letterSpacing: "0.22em",
                                        color: ghost,
                                        textTransform: "uppercase",
                                        marginBottom: 16,
                                    }}
                                >
                                    After Top-up
                                </div>
                                <div
                                    style={{
                                        border: `1px solid ${border}`,
                                        overflow: "hidden",
                                    }}
                                >
                                    <div
                                        style={{
                                            background: blue,
                                            padding: "16px 20px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: 9,
                                                letterSpacing: "0.2em",
                                                color: "rgba(255,255,255,0.5)",
                                                textTransform: "uppercase",
                                                marginBottom: 4,
                                            }}
                                        >
                                            New Balance
                                        </div>
                                        <div
                                            style={{
                                                fontFamily: "Verdana",
                                                fontSize: 28,
                                                color: "#fff",
                                            }}
                                        >
                                            ₹3,16,000
                                        </div>
                                    </div>
                                    {[
                                        {
                                            dot: "#22c55e",
                                            l: "Available",
                                            v: "₹3,16,000",
                                        },
                                        {
                                            dot: blue,
                                            l: "EMD Locked",
                                            v: "₹1,96,000",
                                        },
                                        {
                                            dot: "#d97706",
                                            l: "Pending Refund",
                                            v: "₹0",
                                        },
                                    ].map((r, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                padding: "11px 20px",
                                                borderBottom:
                                                    i < 2
                                                        ? `1px solid ${border}`
                                                        : "none",
                                                background: "#fff",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 8,
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: 6,
                                                        height: 6,
                                                        borderRadius: "50%",
                                                        background: r.dot,
                                                    }}
                                                />
                                                <span
                                                    style={{
                                                        fontSize: 12,
                                                        color: ghost,
                                                    }}
                                                >
                                                    {r.l}
                                                </span>
                                            </div>
                                            <span
                                                style={{
                                                    fontSize: 13,
                                                    color: ink,
                                                    fontFamily: "Verdana",
                                                }}
                                            >
                                                {r.v}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div
                                    style={{
                                        fontSize: 10,
                                        letterSpacing: "0.22em",
                                        color: ghost,
                                        textTransform: "uppercase",
                                        marginBottom: 14,
                                    }}
                                >
                                    EMD Policy
                                </div>
                                {[
                                    {
                                        icon: "🔒",
                                        t: "Locked only when bidding",
                                        d: "Your wallet balance is never charged unless you place a bid.",
                                    },
                                    {
                                        icon: "⏱",
                                        t: "Refunded within 24 hours",
                                        d: "If you don't win, EMD returns automatically.",
                                    },
                                    {
                                        icon: "👁",
                                        t: "Full visibility always",
                                        d: "Every rupee accounted for. Live status on this screen.",
                                    },
                                ].map((p, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            display: "flex",
                                            gap: 12,
                                            marginBottom: 14,
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 32,
                                                height: 32,
                                                border: `1px solid ${border}`,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 15,
                                                flexShrink: 0,
                                                background: "#fff",
                                            }}
                                        >
                                            {p.icon}
                                        </div>
                                        <div>
                                            <div
                                                style={{
                                                    fontSize: 12,
                                                    color: ink,
                                                    marginBottom: 3,
                                                }}
                                            >
                                                {p.t}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 11,
                                                    color: ghost,
                                                    lineHeight: 1.6,
                                                }}
                                            >
                                                {p.d}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// NEW UTILITY COMPONENTS  [ADDED — for scannability improvements]
// ─────────────────────────────────────────────────────────────────────────────

function ExpandableText({ children }) {
    return <>{children}</>
}

function PhaseBadge({ phase }) {
    const map = {
        context: {
            label: "PROJECT CONTEXT",
            bg: "#f2f1ed",
            color: "#888880",
            border: "#e0ddd6",
        },
        research: {
            label: "RESEARCH",
            bg: "#eff6ff",
            color: "#1e40af",
            border: "#bfdbfe",
        },
        approach: {
            label: "APPROACH",
            bg: "#f0fdf4",
            color: "#166534",
            border: "#bbf7d0",
        },
        outcome: {
            label: "OUTCOME",
            bg: "#fffbeb",
            color: "#92400e",
            border: "#fde68a",
        },
        takeaways: {
            label: "TAKEAWAYS",
            bg: "#fdf4ff",
            color: "#6b21a8",
            border: "#e9d5ff",
        },
    }
    const s = map[phase] || map.context
    return (
        <span
            style={{
                fontSize: 9,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                background: s.bg,
                color: s.color,
                border: `1px solid ${s.border}`,
                padding: "3px 10px",
                display: "inline-block",
                marginRight: 14,
            }}
        >
            {s.label}
        </span>
    )
}

function PhaseNav() {
    return (
        <div
            style={{
                position: "relative",
                zIndex: 10,
                background: "#fff",
                borderBottom: "1px solid #e0ddd6",
                padding: "0 48px",
                display: "flex",
                alignItems: "center",
                boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
            }}
        >
            <span
                style={{
                    fontSize: 11,
                    color: "#1e40af",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    marginRight: 40,
                    padding: "14px 0",
                    flexShrink: 0,
                }}
            >
                BIDNEXT
            </span>
            {[
                ["§01–02", "Context"],
                ["§03–06", "Research"],
                ["§07–11", "Approach"],
                ["§12", "Outcome"],
                ["§13–14", "Takeaways"],
            ].map(([num, label]) => (
                <div
                    key={label}
                    style={{
                        padding: "14px 18px",
                        fontSize: 10,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "#888880",
                        fontFamily: "Verdana",
                    }}
                >
                    <span
                        style={{
                            fontSize: 8,
                            color: "#cccac4",
                            marginRight: 6,
                        }}
                    >
                        {num}
                    </span>
                    {label}
                </div>
            ))}
        </div>
    )
}

// ─── WalletIterations stub (original file not available) ─────────────────────
function WalletIterations() {
    const D = {
        border: "#e0ddd6",
        bgStone: "#f2f1ed",
        ink: "#111",
        blue: "#1e40af",
        bgOff: "#fafaf8",
    }
    return (
        <div
            style={{
                padding: "32px 48px",
                borderBottom: `1px solid ${D.border}`,
                background: D.bgOff,
            }}
        >
            <div
                style={{
                    fontSize: 10,
                    letterSpacing: "0.22em",
                    color: "#888880",
                    textTransform: "uppercase",
                    marginBottom: 20,
                }}
            >
                Wallet — Design Iterations
            </div>
            <div
                style={{
                    display: "flex",
                    gap: 1,
                    background: D.border,
                    border: `1px solid ${D.border}`,
                }}
            >
                {[
                    "V1 — Buried in profile",
                    "V2 — Expand icon on dashboard",
                    "V3 — Persistent hero card",
                ].map((v, i) => (
                    <div
                        key={v}
                        style={{
                            flex: 1,
                            background: i === 2 ? D.ink : "#fff",
                            padding: "24px 20px",
                        }}
                    >
                        <div
                            style={{
                                fontSize: 9,
                                letterSpacing: "0.16em",
                                color:
                                    i === 2
                                        ? "rgba(255,255,255,0.4)"
                                        : "#888880",
                                textTransform: "uppercase",
                                marginBottom: 10,
                            }}
                        >
                            {i === 2
                                ? "Final"
                                : i === 1
                                  ? "Rejected"
                                  : "Original"}
                        </div>
                        <div
                            style={{
                                fontSize: 13,
                                color: i === 2 ? "#fff" : D.ink,
                                fontFamily: "Verdana",
                                lineHeight: 1.5,
                            }}
                        >
                            {v}
                        </div>
                        {i < 2 && (
                            <div
                                style={{
                                    marginTop: 10,
                                    fontSize: 11,
                                    color: "#dc2626",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                }}
                            >
                                <span>✕</span> Failed usability test
                            </div>
                        )}
                        {i === 2 && (
                            <div
                                style={{
                                    marginTop: 10,
                                    fontSize: 11,
                                    color: "#22c55e",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                }}
                            >
                                <span>✓</span> Validated — 29/33 tasks
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

// ─── PersonalisedDashboard stub ───────────────────────────────────────────────
function PersonalisedDashboard() {
    const border = "#e0ddd6",
        stone = "#f2f1ed",
        offWh = "#fafaf8",
        blue = "#1e40af",
        ink = "#111111",
        ghost = "#888880"
    const [ticks] = React.useState({ lot1: 312, lot2: 178 })
    return (
        <div style={{ fontFamily: "Verdana,sans-serif", background: offWh }}>
            <div
                style={{
                    background: stone,
                    borderBottom: `1px solid ${border}`,
                    padding: "10px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <span style={{ fontSize: 13, fontWeight: 700, color: ink }}>
                    BID<span style={{ color: blue }}>NEXT</span>
                </span>
                <div style={{ display: "flex", gap: 20 }}>
                    {["My Bids", "Auctions", "Wallet"].map((n) => (
                        <span
                            key={n}
                            style={{
                                fontSize: 11,
                                color: ghost,
                                cursor: "pointer",
                            }}
                        >
                            {n}
                        </span>
                    ))}
                </div>
            </div>
            <div style={{ padding: "24px 28px" }}>
                <div
                    style={{
                        fontSize: 10,
                        letterSpacing: "0.2em",
                        color: ghost,
                        textTransform: "uppercase",
                        marginBottom: 16,
                    }}
                >
                    Good morning, Rajesh
                </div>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3,1fr)",
                        gap: 1,
                        background: border,
                        border: `1px solid ${border}`,
                        marginBottom: 1,
                    }}
                >
                    {[
                        {
                            label: "Active Bids",
                            val: "2",
                            sub: "1 leading · 1 outbid",
                        },
                        {
                            label: "Wallet Balance",
                            val: "₹2,40,000",
                            sub: "₹1,16,000 available",
                        },
                        {
                            label: "Upcoming",
                            val: "3 auctions",
                            sub: "Next: Tomorrow 10am",
                        },
                    ].map((s, i) => (
                        <div
                            key={s.label}
                            style={{
                                background: i === 0 ? blue : "#fff",
                                padding: "20px 22px",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 9,
                                    letterSpacing: "0.18em",
                                    color:
                                        i === 0
                                            ? "rgba(255,255,255,0.5)"
                                            : ghost,
                                    textTransform: "uppercase",
                                    marginBottom: 6,
                                }}
                            >
                                {s.label}
                            </div>
                            <div
                                style={{
                                    fontFamily: "Verdana",
                                    fontSize: 22,
                                    color: i === 0 ? "#fff" : blue,
                                    lineHeight: 1,
                                    marginBottom: 4,
                                }}
                            >
                                {s.val}
                            </div>
                            <div
                                style={{
                                    fontSize: 11,
                                    color:
                                        i === 0
                                            ? "rgba(255,255,255,0.55)"
                                            : ghost,
                                }}
                            >
                                {s.sub}
                            </div>
                        </div>
                    ))}
                </div>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 1,
                        background: border,
                        border: `1px solid ${border}`,
                    }}
                >
                    {[
                        {
                            id: "LOT-0047",
                            mat: "HR Steel Coils",
                            bid: "₹1,24,000",
                            rank: "#1 of 7",
                            t: 312,
                            status: "leading",
                        },
                        {
                            id: "LOT-0063",
                            mat: "CR Steel Sheets",
                            bid: "₹8,62,000",
                            rank: "#3 of 9",
                            t: 178,
                            status: "outbid",
                        },
                    ].map((l) => (
                        <div
                            key={l.id}
                            style={{ background: "#fff", padding: "18px 22px" }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: 10,
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            fontSize: 9,
                                            color: ghost,
                                            marginBottom: 4,
                                            fontFamily: "monospace",
                                        }}
                                    >
                                        {l.id}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 13,
                                            color: ink,
                                            fontFamily: "Verdana",
                                        }}
                                    >
                                        {l.mat}
                                    </div>
                                </div>
                                <span
                                    style={{
                                        fontSize: 10,
                                        padding: "3px 10px",
                                        background:
                                            l.status === "leading"
                                                ? "#f0fdf4"
                                                : "#fef2f2",
                                        color:
                                            l.status === "leading"
                                                ? "#166534"
                                                : "#dc2626",
                                        border: `1px solid ${l.status === "leading" ? "#bbf7d0" : "#fecaca"}`,
                                        alignSelf: "flex-start",
                                    }}
                                >
                                    {l.status === "leading"
                                        ? "#1 — Leading"
                                        : "Outbid"}
                                </span>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            fontSize: 9,
                                            color: ghost,
                                            marginBottom: 2,
                                        }}
                                    >
                                        Your bid
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 18,
                                            color: ink,
                                            fontFamily: "Verdana",
                                        }}
                                    >
                                        {l.bid}
                                    </div>
                                </div>
                                <button
                                    style={{
                                        background: blue,
                                        color: "#fff",
                                        border: "none",
                                        padding: "8px 16px",
                                        fontSize: 10,
                                        fontFamily: "Verdana",
                                        cursor: "pointer",
                                        letterSpacing: "0.1em",
                                    }}
                                >
                                    BID NOW
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default function BIDNEXT() {
    const D = {
        bg: "#ffffff",
        bgOff: "#fafaf8",
        bgStone: "#f2f1ed",
        border: "#e0ddd6",
        borderMid: "#cccac4",
        ink: "#111111",
        inkMid: "#222222",
        inkBody: "#222222",
        blue: "#1e40af",
        blueSurf: "#eff6ff",
        blackBox: "#111111",
        divider: "#e0ddd6",
    }

    const css = `
    @keyframes mpulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.35;transform:scale(0.78)} }
    @keyframes mslideUp { from{transform:translateY(8px);opacity:0} to{transform:translateY(0);opacity:1} }
    @keyframes mfadeIn { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
    @keyframes mblink { 0%,100%{opacity:1} 50%{opacity:0.2} }
    .bn * { box-sizing:border-box; margin:0; padding:0; }
    .bn { background:${D.bg}; color:${D.ink}; font-family:Verdana,sans-serif; font-size:15px; line-height:1.7; width:100%; }
    .bn-sec  { padding:80px 48px; border-bottom:1px solid ${D.border}; width:100%; box-sizing:border-box; }
    .bn-sec-alt { background:${D.bgOff}; }
    .bn-sec-label { font-size:10px; letter-spacing:0.28em; color:#888880; text-transform:uppercase; margin-bottom:28px; display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
    .bn-sec-label::before { content:''; width:20px; height:1px; background:${D.borderMid}; display:block; flex-shrink:0; }
    .bn-h2  { font-family:Verdana,sans-serif; font-size:clamp(26px,3.5vw,42px); line-height:1.1; letter-spacing:-0.02em; margin-bottom:16px; color:${D.ink}; font-weight:200; }
    .bn-h2 em { font-style:normal; color:${D.blue}; font-weight:200; }
    .bn-h3  { font-family:Verdana,sans-serif; font-size:18px; line-height:1.3; color:${D.ink}; font-weight:200; margin-bottom:10px; }
    .bn-p   { color:${D.inkBody}; margin-bottom:14px; font-size:14px; line-height:1.8; }
    .bn-p strong { color:${D.ink}; font-weight:200; }
    .bn-p:last-child { margin-bottom:0; }
    .bn-note { font-size:11px; letter-spacing:0.12em; color:#888880; text-transform:uppercase; display:inline-block; margin-bottom:8px; }
    .bn-hero { padding:120px 48px 72px; border-bottom:1px solid ${D.border}; width:100%; }
    .bn-hero-meta { display:flex; gap:48px; margin-bottom:40px; flex-wrap:wrap; }
    .bn-meta-label { font-size:10px; letter-spacing:0.2em; color:#888880; text-transform:uppercase; margin-bottom:4px; }
    .bn-meta-value { font-size:13px; color:${D.inkBody}; line-height:1.5; }
    .bn-h1 { font-family:Verdana,sans-serif; font-size:clamp(36px,6vw,76px); line-height:1.0; letter-spacing:-0.02em; color:${D.ink}; font-weight:200; margin-bottom:24px; }
    .bn-h1 em { font-style:normal; color:${D.blue}; }
    .bn-hero-sub { color:${D.inkBody}; font-size:15px; line-height:1.8; max-width:640px; display:block; }
    .bn-rule { height:1px; background:${D.border}; margin:36px 0; }
    .bn-black-box { background:${D.blackBox}; padding:48px; margin:40px 0; }
    .bn-black-box p { font-size:clamp(17px,2vw,22px); line-height:1.5; color:#fff; margin:0 0 16px; }
    .bn-black-box-src { font-size:11px; letter-spacing:0.15em; color:rgba(255,255,255,0.4); text-transform:uppercase; }
    .bn-quote { padding:32px 0; border-top:1px solid ${D.border}; border-bottom:1px solid ${D.border}; margin:40px 0; display:grid; grid-template-columns:48px 1fr; gap:20px; align-items:start; }
    .bn-qmark { font-size:72px; color:${D.borderMid}; line-height:0.7; padding-top:10px; }
    .bn-qtext { font-family:Verdana; font-size:clamp(16px,2vw,20px); line-height:1.5; color:${D.ink}; }
    .bn-qsrc  { margin-top:12px; font-size:11px; letter-spacing:0.15em; color:#888880; text-transform:uppercase; display:block; }
    .bn-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:${D.border}; border:1px solid ${D.border}; }
    .bn-grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:${D.border}; border:1px solid ${D.border}; }
    .bn-grid-4 { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:${D.border}; border:1px solid ${D.border}; }
    .bn-grid-5 { display:grid; grid-template-columns:repeat(5,1fr); gap:1px; background:${D.border}; border:1px solid ${D.border}; }
    .bn-cell   { background:${D.bg}; padding:32px 28px; }
    .bn-cell-off { background:${D.bgOff}; padding:32px 28px; }
    .bn-cell-stone { background:${D.bgStone}; padding:32px 28px; }
    .bn-stat { font-family:Verdana; font-size:clamp(32px,4vw,52px); color:${D.blue}; line-height:1; margin-bottom:10px; }
    .bn-stat-label { font-size:12px; color:${D.inkBody}; line-height:1.6; }
    .bn-stat-note  { font-size:10px; letter-spacing:0.1em; color:#888880; text-transform:uppercase; margin-top:6px; }
    .bn-chal { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:${D.border}; border:1px solid ${D.border}; margin-top:40px; }
    .bn-chal-item { background:${D.bg}; padding:28px; display:flex; flex-direction:column; gap:10px; border-left:3px solid transparent; }
    .bn-chal-item.primary { border-left-color:${D.blue}; }
    .bn-chal-title { font-size:14px; color:${D.ink}; font-family:Verdana; }
    .bn-chal-body  { font-size:12px; color:${D.inkBody}; line-height:1.7; }
    .bn-chal-tag   { font-size:9px; letter-spacing:0.18em; color:${D.blue}; text-transform:uppercase; }
    .bn-stages { border:1px solid ${D.border}; overflow:hidden; margin-top:40px; width:100%; }
    .bn-stage-head { display:grid; grid-template-columns:repeat(4,1fr); background:${D.ink}; }
    .bn-stage-hcell { padding:16px 20px; font-size:10px; letter-spacing:0.2em; color:rgba(255,255,255,0.5); text-transform:uppercase; }
    .bn-stage-hcell.active { color:#fff; background:${D.blue}; }
    .bn-stage-row  { display:grid; grid-template-columns:repeat(4,1fr); border-top:1px solid ${D.border}; width:100%; }
    .bn-stage-cell { padding:18px 20px; font-size:12px; color:${D.inkBody}; line-height:1.7; border-right:1px solid ${D.border}; }
    .bn-stage-cell:last-child { border-right:none; }
    .bn-stage-row-label { font-size:10px; letter-spacing:0.16em; color:#888880; text-transform:uppercase; }
    .bn-stage-row.gray { background:${D.bgOff}; }
    .bn-personas { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:${D.border}; border:1px solid ${D.border}; margin-top:40px; }
    .bn-persona { background:${D.bg}; padding:32px 28px; display:flex; flex-direction:column; gap:16px; }
    .bn-persona-img { width:60px; height:60px; border-radius:50%; overflow:hidden; border:1px solid ${D.border}; }
    .bn-persona-img img { width:100%; height:100%; object-fit:cover; }
    .bn-persona-name { font-size:15px; color:${D.ink}; font-family:Verdana; margin-bottom:2px; }
    .bn-persona-role { font-size:11px; color:#888880; letter-spacing:0.1em; text-transform:uppercase; }
    .bn-persona-sec  { font-size:10px; letter-spacing:0.18em; color:#888880; text-transform:uppercase; display:block; margin-bottom:5px; }
    .bn-persona-text { font-size:12px; color:${D.inkBody}; line-height:1.7; }
    .bn-persona-quote { font-size:12px; color:${D.ink}; border-left:2px solid ${D.blue}; padding-left:12px; line-height:1.6; font-style:italic; }
    .bn-findings { display:flex; flex-direction:column; border:1px solid ${D.border}; margin-top:40px; }
    .bn-finding  { display:grid; grid-template-columns:56px 1fr; border-bottom:1px solid ${D.border}; }
    .bn-finding:last-child { border-bottom:none; }
    .bn-fnum  { padding:24px 16px; font-size:22px; color:${D.borderMid}; border-right:1px solid ${D.border}; display:flex; align-items:flex-start; font-family:Verdana; }
    .bn-fcont { padding:24px 28px; }
    .bn-ftitle { font-size:14px; color:${D.ink}; margin-bottom:8px; font-family:Verdana; }
    .bn-fbody  { font-size:13px; color:${D.inkBody}; line-height:1.8; }
    .bn-ftag   { font-size:9px; letter-spacing:0.18em; color:${D.blue}; text-transform:uppercase; margin-bottom:6px; display:block; }
    .bn-ut-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:${D.border}; border:1px solid ${D.border}; margin-top:32px; }
    .bn-ut-cell { background:${D.bg}; padding:28px; display:flex; flex-direction:column; gap:10px; }
    .bn-ut-title { font-size:14px; color:${D.ink}; font-family:Verdana; }
    .bn-ut-body  { font-size:12px; color:${D.inkBody}; line-height:1.7; }
    .bn-ut-sev   { font-size:9px; letter-spacing:0.18em; text-transform:uppercase; padding:3px 8px; display:inline-block; width:fit-content; }
    .bn-ut-sev.high { color:#dc2626; background:#fef2f2; border:1px solid #fecaca; }
    .bn-ut-sev.med  { color:#d97706; background:#fffbeb; border:1px solid #fde68a; }
    .bn-solutions { display:flex; flex-direction:column; gap:1px; background:${D.border}; border:1px solid ${D.border}; margin-top:40px; }
    .bn-solution  { background:${D.bg}; display:flex; flex-direction:column; }
    .bn-sol-head  { display:grid; grid-template-columns:72px 1fr; border-bottom:1px solid ${D.border}; }
    .bn-sol-num   { padding:28px 20px; font-family:Verdana; font-size:36px; color:${D.borderMid}; border-right:1px solid ${D.border}; display:flex; align-items:center; }
    .bn-sol-title { padding:28px 32px; font-family:Verdana; font-size:20px; color:${D.ink}; display:flex; align-items:center; font-weight:200; }
    .bn-sol-body  { display:grid; grid-template-columns:1fr 1fr; border-bottom:1px solid ${D.border}; }
    .bn-sol-problem   { padding:32px; border-right:1px solid ${D.border}; background:${D.bgOff}; }
    .bn-sol-decision  { padding:32px; }
    .bn-sol-prob-lbl  { font-size:10px; letter-spacing:0.2em; color:#888880; text-transform:uppercase; margin-bottom:12px; }
    .bn-sol-prob-text { font-size:13px; color:${D.inkBody}; line-height:1.8; }
    .bn-sol-dec-lbl   { font-size:10px; letter-spacing:0.2em; color:${D.blue}; text-transform:uppercase; display:block; margin-bottom:12px; }
    .bn-sol-dec-text  { font-size:13px; color:${D.inkBody}; line-height:1.8; margin-bottom:14px; }
    .bn-sol-bullets   { padding-left:18px; display:flex; flex-direction:column; gap:7px; }
    .bn-sol-bullets li { font-size:12px; color:${D.inkBody}; line-height:1.6; }
    .bn-outcomes { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:${D.border}; border:1px solid ${D.border}; margin-top:40px; }
    .bn-outcome  { background:${D.bg}; padding:32px 28px; display:flex; flex-direction:column; gap:10px; }
    .bn-out-icon  { font-size:24px; }
    .bn-out-title { font-size:14px; color:${D.ink}; line-height:1.4; font-family:Verdana; }
    .bn-out-body  { font-size:12px; color:${D.inkBody}; line-height:1.7; }
    .bn-out-tag   { font-size:9px; letter-spacing:0.16em; text-transform:uppercase; padding:2px 7px; width:fit-content; }
    .bn-out-tag.real { color:#166534; background:#f0fdf4; border:1px solid #bbf7d0; }
    .bn-out-tag.est  { color:#92400e; background:#fffbeb; border:1px solid #fde68a; }
    .bn-out-tag.hyp  { color:#1e40af; background:#eff6ff; border:1px solid #bfdbfe; }
    .bn-constraints { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:${D.border}; border:1px solid ${D.border}; margin-top:40px; }
    .bn-constraint  { background:${D.bg}; padding:32px 28px; }
    .bn-con-title { font-size:16px; color:${D.ink}; font-family:Verdana; margin-bottom:14px; padding-bottom:14px; border-bottom:1px solid ${D.border}; }
    .bn-con-body  { font-size:13px; color:${D.inkBody}; line-height:1.8; }
    .bn-reflect { display:flex; flex-direction:column; gap:0; border:1px solid ${D.border}; margin-top:40px; }
    .bn-ref-item { padding:32px; border-bottom:1px solid ${D.border}; display:grid; grid-template-columns:260px 1fr; gap:40px; }
    .bn-ref-item:last-child { border-bottom:none; }
    .bn-ref-title { font-size:14px; color:${D.ink}; font-family:Verdana; line-height:1.4; }
    .bn-ref-body  { font-size:13px; color:${D.inkBody}; line-height:1.8; }
    .bn-comp-grid { display:flex; flex-wrap:wrap; gap:1px; background:${D.border}; border:1px solid ${D.border}; margin-top:32px; }
    .bn-comp-item { background:${D.bg}; padding:18px 22px; display:flex; flex-direction:column; gap:4px; flex:1; min-width:140px; }
    .bn-comp-name { font-size:13px; color:${D.ink}; font-family:Verdana; }
    .bn-comp-type { font-size:10px; letter-spacing:0.12em; color:#888880; text-transform:uppercase; }
    @media(max-width:860px){
      .bn-sec { padding:60px 24px; }
      .bn-hero { padding:80px 24px 60px; }
      .bn-grid-2,.bn-grid-3,.bn-grid-4,.bn-grid-5 { grid-template-columns:1fr; }
      .bn-chal,.bn-personas,.bn-ut-grid,.bn-outcomes,.bn-constraints { grid-template-columns:1fr; }
      .bn-sol-body { grid-template-columns:1fr; }
      .bn-ref-item { grid-template-columns:1fr; gap:16px; }
      .bn-finding { grid-template-columns:44px 1fr; }
      .bn-hero-meta { gap:24px; }
    }
  `

    return (
        <div className="bn">
            <style>{css}</style>

            {/* ══ HERO ════════════════════════════════════════════════════════════════ */}
            <div className="bn-hero">
                {/* Project name header [NEW] */}
                <div
                    style={{
                        marginBottom: 20,
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                    }}
                ></div>
                <div className="bn-hero-meta">
                    {[
                        ["Client", "BIDNEXT"],
                        ["Platform", "B2B E-Auction · Industrial Materials"],
                        ["My Role", "Research · Strategy · Conceptualisation"],
                        [
                            "Users",
                            "MSME Traders · Procurement Managers · Finance Teams",
                        ],
                    ].map(([l, v]) => (
                        <div key={l}>
                            <div className="bn-meta-label">{l}</div>
                            <div className="bn-meta-value">{v}</div>
                        </div>
                    ))}
                </div>
                <h1 className="bn-h1">
                    Redesigning trust in an industry
                    <br />
                    where <em>every bid is high stakes</em>
                </h1>
                <p className="bn-hero-sub">
                    BIDNEXT is a large B2B e-commerce platform. This project
                    redesigned the entire buyer-facing auction experience — from
                    first visit to bid confirmation to post-auction settlement.
                </p>
            </div>

            {/* ══ PROJECT SUMMARY CARD ════════════════════════════════════════════════ */}
            <div
                style={{
                    background: "#111",
                    borderBottom: "1px solid #1a1a1a",
                    padding: "48px",
                }}
            >
                {/* Label */}
                <div
                    style={{
                        fontSize: 9,
                        letterSpacing: "0.28em",
                        color: "rgba(255,255,255,0.25)",
                        textTransform: "uppercase",
                        marginBottom: 32,
                    }}
                >
                    Project Summary
                </div>

                {/* Three columns: Problem · Approach · Outcome */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1px 1fr 1px 1fr",
                        gap: 0,
                        marginBottom: 40,
                    }}
                >
                    {/* Problem */}
                    <div style={{ paddingRight: 40 }}>
                        <div
                            style={{
                                fontSize: 10,
                                letterSpacing: "0.2em",
                                color: "rgba(255,255,255,0.3)",
                                textTransform: "uppercase",
                                marginBottom: 14,
                            }}
                        >
                            The Problem
                        </div>
                        <p
                            style={{
                                fontSize: 14,
                                color: "#fff",
                                fontFamily: "Verdana",
                                lineHeight: 1.7,
                                margin: 0,
                            }}
                        >
                            BIDNEXT ran two separate auction apps with split
                            logins, invisible EMD flows, and a registration
                            process that required offline document submission.
                        </p>
                    </div>
                    {/* Divider */}
                    <div style={{ background: "#2a2a2a", margin: "0 0" }} />
                    {/* Approach */}
                    <div style={{ padding: "0 40px" }}>
                        <div
                            style={{
                                fontSize: 10,
                                letterSpacing: "0.2em",
                                color: "rgba(255,255,255,0.3)",
                                textTransform: "uppercase",
                                marginBottom: 14,
                            }}
                        >
                            The Approach
                        </div>
                        <p
                            style={{
                                fontSize: 14,
                                color: "#fff",
                                fontFamily: "Verdana",
                                lineHeight: 1.7,
                                margin: 0,
                            }}
                        >
                            4-stage research across PAN India — discovery, user
                            research, formative testing, usability testing. 19
                            users. 33 tasks. Every design decision traceable to
                            a finding.
                        </p>
                    </div>
                    {/* Divider */}
                    <div style={{ background: "#2a2a2a", margin: "0 0" }} />
                    {/* Outcome */}
                    <div style={{ paddingLeft: 40 }}>
                        <div
                            style={{
                                fontSize: 10,
                                letterSpacing: "0.2em",
                                color: "rgba(255,255,255,0.3)",
                                textTransform: "uppercase",
                                marginBottom: 14,
                            }}
                        >
                            Outcome
                        </div>
                        <p
                            style={{
                                fontSize: 14,
                                color: "#fff",
                                fontFamily: "Verdana",
                                lineHeight: 1.7,
                                margin: 0,
                            }}
                        >
                            Unified marketplace · Progressive registration ·
                            Transparent wallet with live EMD tracking ·
                            Personalised dashboard. 29 of 33 tasks completed in
                            usability testing.
                        </p>
                    </div>
                </div>
            </div>

            {/* ══ 01 EXISTING CHALLENGES ══════════════════════════════════════════════ */}
            <div className="bn-sec bn-sec-alt">
                <div className="bn-sec-label">
                    <PhaseBadge phase="context" />
                    01 — Existing Challenges
                </div>
                <h2 className="bn-h2">
                    What we <em>learned before</em> design started
                </h2>

                <div className="bn-quote" style={{ marginBottom: 32 }}>
                    <div className="bn-qmark">"</div>
                    <div>
                        <p className="bn-qtext">
                            This is the most important project in our company
                            history. We want to make a 10x improvement to the
                            user experience. Strive for a 15-minute turnaround
                            time from interest to bid. Challenge all of our
                            assumptions — don't recreate the existing journeys.
                            Redefine them.
                        </p>
                        <span className="bn-qsrc">
                            BIDNEXT — Senior Leadership
                        </span>
                    </div>
                </div>

                <p className="bn-p">
                    <ExpandableText>
                        The project brief included an RFQ that documented the
                        platform's known pain points — six problem areas across
                        the entire auction lifecycle. These were identified by
                        the client before design began.
                    </ExpandableText>
                </p>

                <div className="bn-chal">
                    {[
                        {
                            title: "Overall UX",
                            tag: "Starting point",
                            body: "Buyers interact with two separate apps. Design is dated. No user analytics data to understand behaviour.",
                        },
                        {
                            title: "Acquisition & Intimation",
                            tag: "Registration",
                            body: "Lengthy registration process with many offline activities. Exhaustive form. Auction intimation done manually.",
                        },
                        {
                            title: "Attachment",
                            tag: "Information access",
                            body: "Auction information distributed in PDF. No standard format. Attachment is document-heavy and frequently done offline.",
                        },
                        {
                            title: "Bidding",
                            tag: "Core flow",
                            body: "Difficult to reach the bidding screen. Look and feel is poor. Buyers need to accept T&C every time they bid.",
                        },
                        {
                            title: "Post Auction",
                            tag: "Settlement",
                            body: "EMD refund is slow and opaque. Orders issued manually. Fund payment occurs offline. High turnaround time.",
                        },
                        {
                            title: "Value Added Services",
                            tag: "Ecosystem",
                            body: "Logistics, financing, and delivery are poorly integrated. Not surfaced in the buyer journey.",
                        },
                    ].map((c) => (
                        <div key={c.title} className="bn-chal-item primary">
                            <div className="bn-chal-tag">{c.tag}</div>
                            <div className="bn-chal-title">{c.title}</div>
                            <div className="bn-chal-body">{c.body}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ══ 02 BUSINESS OBJECTIVES ══════════════════════════════════════════════ */}
            <div className="bn-sec">
                <div className="bn-sec-label">
                    <PhaseBadge phase="context" />
                    02 — Business Objectives
                </div>
                <h2 className="bn-h2">
                    What the <em>SOW required</em> us to solve
                </h2>
                <p className="bn-p">
                    <ExpandableText>
                        Four business objectives from the Statement of Work —
                        the lens through which every design decision was
                        evaluated.
                    </ExpandableText>
                </p>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 1,
                        background: D.border,
                        border: `1px solid ${D.border}`,
                        marginTop: 36,
                        marginLeft: -48,
                        marginRight: -48,
                        width: "calc(100% + 96px)",
                    }}
                >
                    {[
                        {
                            title: "Value Driven Experience",
                            body: "Reimagine all existing buyer touch-points and simplify the end-to-end value purchase experience on the platform.",
                        },
                        {
                            title: "Process Automation",
                            body: "Significantly reduce transaction time by optimising task flows and automating offline processes that currently require manual intervention.",
                        },
                        {
                            title: "Integrate Support Areas",
                            body: "Determine essential service components — logistics, customer financing, sales, delivery orders — and their integration in the e-auction user journey.",
                        },
                        {
                            title: "Value Added Services",
                            body: "Identify the right value added services to be offered to buyers and design their application in the end-to-end journey.",
                        },
                    ].map((o) => (
                        <div
                            key={o.title}
                            style={{
                                background: D.bgOff,
                                padding: "44px 52px",
                            }}
                        >
                            <div
                                style={{
                                    width: 32,
                                    height: 3,
                                    background: D.blue,
                                    marginBottom: 18,
                                }}
                            />
                            <h3
                                style={{
                                    fontFamily: "Verdana",
                                    fontSize: 17,
                                    color: D.ink,
                                    fontWeight: 700,
                                    marginBottom: 10,
                                    lineHeight: 1.3,
                                }}
                            >
                                {o.title}
                            </h3>
                            <p
                                style={{
                                    fontSize: 13,
                                    color: D.inkBody,
                                    lineHeight: 1.8,
                                    margin: 0,
                                }}
                            >
                                {o.body}
                            </p>
                        </div>
                    ))}
                </div>

                <div
                    style={{
                        marginTop: 1,
                        marginLeft: -48,
                        marginRight: -48,
                        width: "calc(100% + 96px)",
                        padding: "32px 52px",
                        background: D.bgStone,
                        border: `1px solid ${D.border}`,
                    }}
                >
                    <div
                        style={{
                            fontSize: 10,
                            letterSpacing: "0.2em",
                            color: "#888880",
                            textTransform: "uppercase",
                            marginBottom: 14,
                        }}
                    >
                        Desired outcomes from SOW
                    </div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        {[
                            "Faster Onboarding",
                            "Easy Adoption",
                            "Third Party Integrations",
                            "Global Design Standards",
                            "Complete Transparency",
                        ].map((t) => (
                            <span
                                key={t}
                                style={{
                                    fontSize: 13,
                                    color: D.inkBody,
                                    background: D.bg,
                                    border: `1px solid ${D.border}`,
                                    padding: "7px 16px",
                                }}
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ══ 03 RESEARCH PROCESS ═════════════════════════════════════════════════ */}
            <div className="bn-sec bn-sec-alt">
                <div className="bn-sec-label">
                    <PhaseBadge phase="research" />
                    03 — Research Process
                </div>
                <h2 className="bn-h2">
                    Four stages from <em>discovery to validation</em>
                </h2>
                <p className="bn-p">
                    <ExpandableText>
                        Research was structured in four sequential stages. Each
                        built on the previous — discovery informed user research
                        depth, user research shaped concept designs, formative
                        testing refined them, and usability testing validated
                        final designs before handoff.
                    </ExpandableText>
                </p>

                <div
                    className="bn-stages"
                    style={{
                        marginLeft: -48,
                        marginRight: -48,
                        width: "calc(100% + 96px)",
                    }}
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4,1fr)",
                        }}
                    >
                        {[
                            { label: "Discovery Stage", blue: true },
                            { label: "User Research", blue: false },
                            { label: "Formative Testing", blue: true },
                            { label: "Usability Testing", blue: false },
                        ].map((s) => (
                            <div
                                key={s.label}
                                style={{
                                    padding: "16px 20px",
                                    fontSize: 10,
                                    letterSpacing: "0.2em",
                                    color: "#fff",
                                    textTransform: "uppercase",
                                    background: s.blue ? D.blue : D.ink,
                                    borderRight:
                                        "1px solid rgba(255,255,255,0.1)",
                                }}
                            >
                                {s.label}
                            </div>
                        ))}
                    </div>
                    {[
                        {
                            label: "Objective",
                            cells: [
                                "Understand needs, goals, existing system, and stakeholder expectations",
                                "Understand the customer and business model. Map customer journey expectations",
                                "Get user feedback on concept designs. Identify issues and opportunities",
                                "Validate detailed design flows for Phase 1 — live website and e-auction platform",
                            ],
                        },
                        {
                            label: "Approach",
                            cells: [
                                "Qualitative research. Workshops with client stakeholders",
                                "Qualitative research, questionnaires with users",
                                "Prototype flow of conceptual user journey, showcased to users",
                                "Observational study — users interact with prototype, assigned tasks",
                            ],
                        },
                        {
                            label: "Participants",
                            cells: [
                                "Core team + process specs from BIDNEXT",
                                "Mix of buyers, traders and bidders from PAN India Market (both metal and value auction)",
                                "Mix of buyers and bidders from PAN India Market (both platforms)",
                                "Mix of novice and experienced users from both metal and value auction",
                            ],
                        },
                    ].map((row, ri) => (
                        <div
                            key={ri}
                            className={`bn-stage-row ${ri % 2 === 1 ? "gray" : ""}`}
                        >
                            {row.cells.map((c, ci) => (
                                <div key={ci} className="bn-stage-cell">
                                    {ci === 0 && (
                                        <div
                                            className="bn-stage-row-label"
                                            style={{ marginBottom: 6 }}
                                        >
                                            {row.label}
                                        </div>
                                    )}
                                    {c}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* ══ 04 COMPETITIVE RESEARCH ═════════════════════════════════════════════ */}
            <div className="bn-sec">
                <div className="bn-sec-label">
                    <PhaseBadge phase="research" />
                    04 — Competitive Research
                </div>
                <h2 className="bn-h2">
                    Where the market <em>had already solved problems</em>
                </h2>
                <p className="bn-p">
                    <ExpandableText>
                        Ten competitor platforms audited across 11 dimensions —
                        from visual design and categorisation to payment
                        methods, buyer assist tools, and personalisation. Key
                        gaps identified: simple search with filtering,
                        lightweight registration, buyer assist tools, and value
                        added service promotion.
                    </ExpandableText>
                </p>
                <p
                    className="bn-p"
                    style={{
                        fontSize: 13,
                        background: D.bgStone,
                        border: `1px solid ${D.border}`,
                        padding: "12px 16px",
                        borderLeft: `3px solid ${D.blue}`,
                    }}
                >
                    <strong>Persona-specific influences:</strong> Ehsaan liked
                    MSTC's quick refunds. Tahir liked fixed closing times and
                    MSTC's filters. The factory director found MSTC easier for
                    discovering large auction volumes.
                </p>

                <div className="bn-comp-grid">
                    {[
                        { name: "GoIndustryDovebid", type: "Global auction" },
                        { name: "Bidspotter", type: "Industrial auction" },
                        { name: "Copart", type: "Vehicle auction" },
                        { name: "TATA Aashiyana", type: "Real estate" },
                        { name: "Kloeckner", type: "Steel distribution" },
                        { name: "Sothesby's", type: "Premium auction" },
                        { name: "Indiamart", type: "B2B marketplace" },
                        { name: "eBay", type: "Consumer auction" },
                        { name: "IKEA", type: "Retail — UX patterns" },
                        { name: "Amazon Business", type: "B2B commerce" },
                    ].map((c) => (
                        <div key={c.name} className="bn-comp-item">
                            <div className="bn-comp-name">{c.name}</div>
                            <div className="bn-comp-type">{c.type}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ══ 05 USER PERSONAS ════════════════════════════════════════════════════ */}
            <div className="bn-sec">
                <div className="bn-sec-label">
                    <PhaseBadge phase="research" />
                    05 — User Personas
                </div>
                <h2 className="bn-h2">
                    Three buyers, <em>three different relationships</em> with
                    risk
                </h2>
                <p className="bn-p">
                    <ExpandableText>
                        Personas developed from user research with a mix of
                        buyers, traders, and bidders from PAN India market
                        across both metal auction and value auction platforms.
                    </ExpandableText>
                </p>

                <div className="bn-personas">
                    <div className="bn-persona">
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 14,
                            }}
                        >
                            <div className="bn-persona-img">
                                <img
                                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop"
                                    alt="Ehsaan"
                                />
                            </div>
                            <div>
                                <div className="bn-persona-name">Ehsaan</div>
                                <div className="bn-persona-role">
                                    Procurement — Steel · 1 yr experience
                                </div>
                            </div>
                        </div>
                        <div className="bn-persona-quote">
                            "We procure steel scrap for an automobile company. I
                            don't have access to the company bank account, so I
                            have to ask finance to transfer money into my
                            wallet."
                        </div>
                        <div>
                            <span className="bn-persona-sec">
                                Key frustrations
                            </span>
                            <p className="bn-persona-text">
                                Insufficient catalogue details · Late
                                intimations · Difficulty logging in during
                                bidding · Refund process is exhausting
                            </p>
                        </div>
                        <div>
                            <span className="bn-persona-sec">
                                What he needs
                            </span>
                            <p className="bn-persona-text">
                                Predictable material source · Colour coding for
                                lots · Low turnaround time from win to arrival ·
                                Instant wallet reflection
                            </p>
                        </div>
                    </div>

                    <div className="bn-persona">
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 14,
                            }}
                        >
                            <div className="bn-persona-img">
                                <img
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop"
                                    alt="Tahir"
                                />
                            </div>
                            <div>
                                <div className="bn-persona-name">Tahir</div>
                                <div className="bn-persona-role">
                                    Trader · 5 yr experience
                                </div>
                            </div>
                        </div>
                        <div className="bn-persona-quote">
                            "After 5 years, BIDNEXT is a major part of our
                            business. I buy materials like iron and scrap, 5
                            staff segregate it, and we resell to 100 smaller
                            processors."
                        </div>
                        <div>
                            <span className="bn-persona-sec">
                                Key frustrations
                            </span>
                            <p className="bn-persona-text">
                                3–5 days to get H1 bid confirmation · Payment
                                and delivery process differs per seller · Drop
                                in market price leads to loss
                            </p>
                        </div>
                        <div>
                            <span className="bn-persona-sec">
                                What he needs
                            </span>
                            <p className="bn-persona-text">
                                Find relevant auctions fast · Multiple payment
                                methods for EMD · Auto-bid to set a limit ·
                                Immediate win/loss confirmation
                            </p>
                        </div>
                    </div>

                    <div className="bn-persona">
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 14,
                            }}
                        >
                            <div className="bn-persona-img">
                                <img
                                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&h=120&fit=crop"
                                    alt="Factory Director"
                                />
                            </div>
                            <div>
                                <div className="bn-persona-name">
                                    Factory Director
                                </div>
                                <div className="bn-persona-role">
                                    Financial Director · 10 yr experience
                                </div>
                            </div>
                        </div>
                        <div className="bn-persona-quote">
                            "We buy the factory, not the land. After purchase,
                            our team breaks it into metal, machinery and scrap.
                            Over a decade, we've purchased multiple factories on
                            the platform."
                        </div>
                        <div>
                            <span className="bn-persona-sec">
                                Key frustrations
                            </span>
                            <p className="bn-persona-text">
                                Large bid sizes — always worried about extra
                                zeros · Months for H1 confirmation · EMD locked
                                with no interest during that period
                            </p>
                        </div>
                        <div>
                            <span className="bn-persona-sec">
                                What he needs
                            </span>
                            <p className="bn-persona-text">
                                Bid increment button is critical · BIDNEXT to
                                manage payment process · Full visibility on
                                where money is and if it's working for them
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ══ 06 RESEARCH FINDINGS ════════════════════════════════════════════════ */}
            <div className="bn-sec bn-sec-alt">
                <div className="bn-sec-label">
                    <PhaseBadge phase="research" />
                    06 — Research Findings
                </div>
                <h2 className="bn-h2">
                    What users told us <em>across the journey</em>
                </h2>
                <p className="bn-p">
                    <ExpandableText>
                        Journey mapping was conducted for Ehsaan's end-to-end
                        pre-auction journey — from buyer registration through
                        auction intimation to catalogue viewing. Combined with
                        competitive research, four dominant themes emerged
                        consistently.
                    </ExpandableText>
                </p>

                <div className="bn-findings">
                    {[
                        {
                            num: "01",
                            tag: "Registration",
                            title: "Dependency on offline processes to complete registration",
                            body: "Registration required offline document submission. Buyers from remote locations had no path forward. No visibility on completion — users didn't know if they were approved or still pending.",
                        },
                        {
                            num: "02",
                            tag: "Platform Architecture",
                            title: "Two separate apps for a single business need",
                            body: "Buyers managed both metal auction and value auction platforms with separate logins. Users logged into the wrong app and concluded 'there are no auctions today.' The most frequent users were penalised most severely.",
                        },
                        {
                            num: "03",
                            tag: "Money & EMD",
                            title: "EMD flow was invisible — and silence felt like loss",
                            body: "EMD locked during bidding with no clear communication. Tahir mentioned 'permanent EMD with biggest suppliers' as a workaround. The factory director's primary trait: 'very focused on where their money is, and if it's working for them.'",
                        },
                        {
                            num: "04",
                            tag: "Bidding",
                            title: "Bid confirmation anxiety drove irrational bidding behaviour",
                            body: "Users received no immediate confirmation. Tahir noted H1 bid confirmation takes 3–5 days. Live bidding screen performed well in formative testing — but bidding history widget was not needed and was recommended to drop.",
                        },
                        {
                            num: "05",
                            tag: "Post Auction",
                            title: "Post-auction steps were unclear and mostly offline",
                            body: "Buyers appreciated tracking timeline, status, and next steps for lots they won. They also expressed preference to pay for lots directly through BIDNEXT — and interest in a delivery-to-location service.",
                        },
                    ].map((f) => (
                        <div key={f.num} className="bn-finding">
                            <div className="bn-fnum">{f.num}</div>
                            <div className="bn-fcont">
                                <span className="bn-ftag">{f.tag}</span>
                                <div className="bn-ftitle">{f.title}</div>
                                <p className="bn-fbody">
                                    <ExpandableText>{f.body}</ExpandableText>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ══ 07 INFORMATION ARCHITECTURE ════════════════════════════════════════ */}
            <div className="bn-sec">
                <div className="bn-sec-label">
                    <PhaseBadge phase="approach" />
                    07 — Information Architecture
                </div>
                <h2 className="bn-h2">
                    Navigation structure <em>pre and post login</em>
                </h2>
                <p className="bn-p">
                    <ExpandableText>
                        The IA unified both auction platforms into a single
                        coherent navigation system. Post-login adds My Bids as
                        the primary navigation node — surfacing bid activity
                        that was previously buried. Wallet and Message Centre
                        move into the persistent Profile dropdown.
                    </ExpandableText>
                </p>

                {/* IA Pre-login */}
                <div style={{ marginTop: 40 }}>
                    <div
                        style={{
                            fontSize: 10,
                            letterSpacing: "0.22em",
                            color: "#888880",
                            textTransform: "uppercase",
                            marginBottom: 20,
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        <span
                            style={{
                                display: "inline-block",
                                width: 16,
                                height: 1,
                                background: "#cccac4",
                            }}
                        />
                        IA — Pre-login
                    </div>
                    <div
                        style={{
                            background: "#111",
                            padding: 36,
                            overflowX: "auto",
                        }}
                    >
                        <div style={{ marginBottom: 32 }}>
                            <div
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    background: "#1e40af",
                                    color: "#fff",
                                    fontSize: 12,
                                    fontWeight: 700,
                                    padding: "8px 16px",
                                    borderRadius: 6,
                                    marginBottom: 16,
                                }}
                            >
                                BID NEXT E-auction website
                            </div>
                            <div
                                style={{
                                    marginLeft: 0,
                                    paddingLeft: 20,
                                    borderLeft: "1px solid #444",
                                    marginTop: 8,
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: 10,
                                        letterSpacing: "0.2em",
                                        color: "rgba(255,255,255,0.4)",
                                        textTransform: "uppercase",
                                        marginBottom: 10,
                                    }}
                                >
                                    Header globals
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 8,
                                    }}
                                >
                                    {[
                                        "Search",
                                        "Language selector",
                                        "Auction calendar",
                                        "Location selector",
                                        "Notification",
                                        "Login",
                                        "Register",
                                    ].map((n) => (
                                        <span
                                            key={n}
                                            style={{
                                                background: "#222",
                                                border: "1px solid #444",
                                                color: "#fff",
                                                fontSize: 11,
                                                padding: "5px 12px",
                                                borderRadius: 4,
                                            }}
                                        >
                                            {n}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                gap: 0,
                                alignItems: "flex-start",
                                overflowX: "auto",
                            }}
                        >
                            {[
                                { label: "Home", children: [] },
                                {
                                    label: "Auctions",
                                    children: ["All auctions", "Promotions"],
                                },
                                { label: "Categories", children: [] },
                                {
                                    label: "Sellers",
                                    children: [
                                        "Sell on BID NEXT",
                                        "Seller list",
                                    ],
                                },
                                {
                                    label: "Services",
                                    children: ["Buyer Finance"],
                                },
                                { label: "Pricing", children: [] },
                                { label: "Getting started", children: [] },
                            ].map((node) => (
                                <div
                                    key={node.label}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        minWidth: 140,
                                        position: "relative",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 1,
                                            height: 20,
                                            background: "#555",
                                        }}
                                    />
                                    <div
                                        style={{
                                            background: "#29b6f6",
                                            color: "#fff",
                                            fontSize: 11,
                                            padding: "7px 14px",
                                            borderRadius: 6,
                                            whiteSpace: "nowrap",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {node.label}
                                    </div>
                                    {node.children.length > 0 && (
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 5,
                                                marginTop: 10,
                                                paddingLeft: 12,
                                                borderLeft: "1px solid #444",
                                                alignSelf: "flex-start",
                                                marginLeft: 20,
                                            }}
                                        >
                                            {node.children.map((ch) => (
                                                <div
                                                    key={ch}
                                                    style={{
                                                        display: "flex",
                                                        gap: 6,
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            color: "#555",
                                                            fontSize: 12,
                                                        }}
                                                    >
                                                        →
                                                    </span>
                                                    <span
                                                        style={{
                                                            background:
                                                                "#1a1a1a",
                                                            border: "1px solid #333",
                                                            color: "#e0e0e0",
                                                            fontSize: 10,
                                                            padding: "4px 10px",
                                                            borderRadius: 4,
                                                        }}
                                                    >
                                                        {ch}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* IA Post-login */}
                <div style={{ marginTop: 28 }}>
                    <div
                        style={{
                            fontSize: 10,
                            letterSpacing: "0.22em",
                            color: "#888880",
                            textTransform: "uppercase",
                            marginBottom: 20,
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        <span
                            style={{
                                display: "inline-block",
                                width: 16,
                                height: 1,
                                background: "#cccac4",
                            }}
                        />
                        IA — Post-login
                    </div>
                    <div
                        style={{
                            background: "#111",
                            padding: 36,
                            overflowX: "auto",
                        }}
                    >
                        <div style={{ marginBottom: 32 }}>
                            <div
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    background: "#1e40af",
                                    color: "#fff",
                                    fontSize: 12,
                                    fontWeight: 700,
                                    padding: "8px 16px",
                                    borderRadius: 6,
                                    marginBottom: 16,
                                }}
                            >
                                BID NEXT E-auction website
                            </div>
                            <div
                                style={{
                                    marginLeft: 0,
                                    paddingLeft: 20,
                                    borderLeft: "1px solid #444",
                                    marginTop: 8,
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: 10,
                                        letterSpacing: "0.2em",
                                        color: "rgba(255,255,255,0.4)",
                                        textTransform: "uppercase",
                                        marginBottom: 10,
                                    }}
                                >
                                    Header globals
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 8,
                                        marginBottom: 8,
                                    }}
                                >
                                    {[
                                        "Search",
                                        "Language selector",
                                        "Location selector",
                                        "Notification",
                                        "Login",
                                        "My Auction calendar",
                                    ].map((n) => (
                                        <span
                                            key={n}
                                            style={{
                                                background: "#222",
                                                border: "1px solid #444",
                                                color: "#fff",
                                                fontSize: 11,
                                                padding: "5px 12px",
                                                borderRadius: 4,
                                            }}
                                        >
                                            {n}
                                        </span>
                                    ))}
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: 8,
                                        flexWrap: "wrap",
                                        alignItems: "center",
                                    }}
                                >
                                    <span
                                        style={{
                                            background: "#222",
                                            border: "1px solid #444",
                                            color: "#aaa",
                                            fontSize: 11,
                                            padding: "5px 12px",
                                            borderRadius: 4,
                                        }}
                                    >
                                        Profile ↓
                                    </span>
                                    {[
                                        "Profile and settings",
                                        "Wallet",
                                        "Message centre",
                                        "Logout",
                                    ].map((n) => (
                                        <span
                                            key={n}
                                            style={{
                                                background: "#1a1a1a",
                                                border: "1px solid #555",
                                                color: "#e0e0e0",
                                                fontSize: 10,
                                                padding: "4px 10px",
                                                borderRadius: 4,
                                            }}
                                        >
                                            {n}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                gap: 0,
                                alignItems: "flex-start",
                                overflowX: "auto",
                            }}
                        >
                            {[
                                { label: "Home", children: [] },
                                {
                                    label: "My bids",
                                    children: [
                                        { name: "Live", sub: [] },
                                        {
                                            name: "Post auction",
                                            sub: [
                                                "Lots Bid On",
                                                "Open Orders",
                                                "Closed Orders",
                                                "Bidding History",
                                            ],
                                        },
                                        {
                                            name: "My auction",
                                            sub: ["Upcoming", "Closed"],
                                        },
                                    ],
                                },
                                {
                                    label: "Auctions",
                                    children: [
                                        { name: "All auctions", sub: [] },
                                        { name: "Promotions", sub: [] },
                                    ],
                                },
                                { label: "Categories", children: [] },
                                {
                                    label: "Services",
                                    children: [
                                        { name: "Buyer Finance", sub: [] },
                                    ],
                                },
                                {
                                    label: "Sellers",
                                    children: [
                                        { name: "Seller list", sub: [] },
                                    ],
                                },
                                { label: "Training", children: [] },
                            ].map((node) => (
                                <div
                                    key={node.label}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        minWidth:
                                            node.children.length > 0
                                                ? 160
                                                : 120,
                                        position: "relative",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 1,
                                            height: 20,
                                            background: "#555",
                                        }}
                                    />
                                    <div
                                        style={{
                                            background: "#29b6f6",
                                            color: "#fff",
                                            fontSize: 11,
                                            padding: "7px 14px",
                                            borderRadius: 6,
                                            whiteSpace: "nowrap",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {node.label}
                                    </div>
                                    {node.children.length > 0 && (
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 5,
                                                marginTop: 10,
                                                paddingLeft: 12,
                                                borderLeft: "1px solid #444",
                                                alignSelf: "flex-start",
                                                marginLeft: 16,
                                            }}
                                        >
                                            {node.children.map((ch) => (
                                                <div key={ch.name}>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            gap: 6,
                                                            alignItems:
                                                                "center",
                                                            marginBottom:
                                                                ch.sub &&
                                                                ch.sub.length
                                                                    ? 5
                                                                    : 0,
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                color: "#555",
                                                                fontSize: 12,
                                                            }}
                                                        >
                                                            →
                                                        </span>
                                                        <span
                                                            style={{
                                                                background:
                                                                    "#b3e5fc",
                                                                color: "#000",
                                                                fontSize: 10,
                                                                padding:
                                                                    "4px 10px",
                                                                borderRadius: 4,
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            {ch.name}
                                                        </span>
                                                    </div>
                                                    {ch.sub &&
                                                        ch.sub.map((s) => (
                                                            <div
                                                                key={s}
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    gap: 6,
                                                                    alignItems:
                                                                        "center",
                                                                    marginLeft: 16,
                                                                    marginBottom: 3,
                                                                }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        color: "#444",
                                                                        fontSize: 10,
                                                                    }}
                                                                >
                                                                    →
                                                                </span>
                                                                <span
                                                                    style={{
                                                                        background:
                                                                            "#1a1a1a",
                                                                        border: "1px solid #333",
                                                                        color: "#e0e0e0",
                                                                        fontSize: 10,
                                                                        padding:
                                                                            "3px 9px",
                                                                        borderRadius: 4,
                                                                    }}
                                                                >
                                                                    {s}
                                                                </span>
                                                            </div>
                                                        ))}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ══ 08 FORMATIVE TESTING ════════════════════════════════════════════════ */}
            <div className="bn-sec bn-sec-alt">
                <div className="bn-sec-label">
                    <PhaseBadge phase="approach" />
                    08 — Formative Testing
                </div>
                <h2 className="bn-h2">
                    Testing concept designs <em>before detailed design</em>
                </h2>
                <p className="bn-p">
                    <ExpandableText>
                        Formative testing with buyers from major product
                        categories across metal and value auction. Goal: assess
                        concept designs from a user experience perspective.
                        Broadly successful — with positive feedback and specific
                        areas identified for iteration.
                    </ExpandableText>
                </p>

                {/* Concept wireframes */}
                <div style={{ marginTop: 40, marginBottom: 8 }}>
                    <div
                        style={{
                            fontSize: 10,
                            letterSpacing: "0.22em",
                            color: "#888880",
                            textTransform: "uppercase",
                            marginBottom: 20,
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        <span
                            style={{
                                display: "inline-block",
                                width: 16,
                                height: 1,
                                background: "#cccac4",
                            }}
                        />
                        Concept screens tested in formative sessions
                    </div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4,1fr)",
                            gap: 1,
                            background: "#e0ddd6",
                            border: "1px solid #e0ddd6",
                        }}
                    >
                        {/* WF1: Landing Page */}
                        <div
                            style={{
                                background: "#fff",
                                padding: 0,
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <div
                                style={{
                                    background: "#f2f1ed",
                                    padding: "10px 14px",
                                    borderBottom: "1px solid #e0ddd6",
                                    fontSize: 10,
                                    letterSpacing: "0.18em",
                                    color: "#888880",
                                    textTransform: "uppercase",
                                }}
                            >
                                Landing Page
                            </div>
                            <div
                                style={{
                                    padding: 14,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 6,
                                    flex: 1,
                                }}
                            >
                                <div
                                    style={{
                                        height: 20,
                                        background: "#111",
                                        borderRadius: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        paddingLeft: 8,
                                        gap: 6,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 28,
                                            height: 6,
                                            background: "#29b6f6",
                                            borderRadius: 2,
                                        }}
                                    />
                                    <div
                                        style={{
                                            flex: 1,
                                            display: "flex",
                                            gap: 4,
                                            justifyContent: "flex-end",
                                            paddingRight: 6,
                                        }}
                                    >
                                        {[20, 20, 20, 20, 16].map((w, i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    width: w,
                                                    height: 5,
                                                    background:
                                                        "rgba(255,255,255,0.3)",
                                                    borderRadius: 2,
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div
                                    style={{
                                        background: "#eff6ff",
                                        border: "1px solid #bfdbfe",
                                        borderRadius: 3,
                                        padding: 10,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "60%",
                                            height: 8,
                                            background: "#1e40af",
                                            borderRadius: 2,
                                            marginBottom: 6,
                                        }}
                                    />
                                    <div
                                        style={{
                                            width: "80%",
                                            height: 5,
                                            background: "#93c5fd",
                                            borderRadius: 2,
                                            marginBottom: 4,
                                        }}
                                    />
                                    <div
                                        style={{
                                            width: "70%",
                                            height: 5,
                                            background: "#93c5fd",
                                            borderRadius: 2,
                                            marginBottom: 8,
                                        }}
                                    />
                                    <div style={{ display: "flex", gap: 6 }}>
                                        <div
                                            style={{
                                                width: 60,
                                                height: 18,
                                                background: "#1e40af",
                                                borderRadius: 2,
                                            }}
                                        />
                                        <div
                                            style={{
                                                width: 60,
                                                height: 18,
                                                background: "#fff",
                                                border: "1px solid #1e40af",
                                                borderRadius: 2,
                                            }}
                                        />
                                    </div>
                                </div>
                                <div
                                    style={{
                                        fontSize: 8,
                                        color: "#888",
                                        marginBottom: 2,
                                    }}
                                >
                                    Featured categories
                                </div>
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(3,1fr)",
                                        gap: 4,
                                    }}
                                >
                                    {[
                                        "Steel",
                                        "Minerals",
                                        "Oil",
                                        "Assets",
                                        "Scrap",
                                        "More",
                                    ].map((c) => (
                                        <div
                                            key={c}
                                            style={{
                                                background: "#f9fafb",
                                                border: "1px solid #e5e7eb",
                                                borderRadius: 3,
                                                padding: "4px 2px",
                                                textAlign: "center",
                                                fontSize: 8,
                                                color: "#444",
                                            }}
                                        >
                                            {c}
                                        </div>
                                    ))}
                                </div>
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        style={{
                                            background: "#fafaf8",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: 3,
                                            padding: 6,
                                            display: "flex",
                                            gap: 6,
                                            alignItems: "center",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 24,
                                                height: 24,
                                                background: "#e5e7eb",
                                                borderRadius: 2,
                                                flexShrink: 0,
                                            }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <div
                                                style={{
                                                    height: 5,
                                                    background: "#333",
                                                    borderRadius: 2,
                                                    marginBottom: 3,
                                                    width: "70%",
                                                }}
                                            />
                                            <div
                                                style={{
                                                    height: 4,
                                                    background: "#ccc",
                                                    borderRadius: 2,
                                                    width: "50%",
                                                }}
                                            />
                                        </div>
                                        <div
                                            style={{
                                                width: 28,
                                                height: 12,
                                                background: "#1e40af",
                                                borderRadius: 2,
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* WF2: Auction Detail */}
                        <div
                            style={{
                                background: "#fff",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <div
                                style={{
                                    background: "#f2f1ed",
                                    padding: "10px 14px",
                                    borderBottom: "1px solid #e0ddd6",
                                    fontSize: 10,
                                    letterSpacing: "0.18em",
                                    color: "#888880",
                                    textTransform: "uppercase",
                                }}
                            >
                                Auction Detail
                            </div>
                            <div
                                style={{
                                    padding: 14,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 6,
                                    flex: 1,
                                }}
                            >
                                <div
                                    style={{
                                        height: 20,
                                        background: "#111",
                                        borderRadius: 2,
                                    }}
                                />
                                <div
                                    style={{
                                        display: "flex",
                                        gap: 4,
                                        alignItems: "center",
                                    }}
                                >
                                    {["Auctions", "›", "Steel Auction"].map(
                                        (c, i) => (
                                            <span
                                                key={i}
                                                style={{
                                                    fontSize: 8,
                                                    color:
                                                        i === 2
                                                            ? "#1e40af"
                                                            : "#888",
                                                }}
                                            >
                                                {c}
                                            </span>
                                        )
                                    )}
                                </div>
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: 6,
                                    }}
                                >
                                    <div
                                        style={{
                                            height: 60,
                                            background: "#e5e7eb",
                                            borderRadius: 3,
                                        }}
                                    />
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 4,
                                        }}
                                    >
                                        <div
                                            style={{
                                                height: 7,
                                                background: "#111",
                                                borderRadius: 2,
                                                width: "80%",
                                            }}
                                        />
                                        <div
                                            style={{
                                                height: 5,
                                                background: "#ccc",
                                                borderRadius: 2,
                                                width: "60%",
                                            }}
                                        />
                                        {[
                                            ["Date", "4th Apr"],
                                            ["Start", "02:00 PM"],
                                            ["Lots", "24 lots"],
                                            ["EMD", "3 Lakhs"],
                                        ].map(([l, v]) => (
                                            <div
                                                key={l}
                                                style={{
                                                    display: "flex",
                                                    gap: 4,
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontSize: 7,
                                                        color: "#888",
                                                        width: 28,
                                                    }}
                                                >
                                                    {l}
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: 7,
                                                        color: "#333",
                                                    }}
                                                >
                                                    {v}
                                                </span>
                                            </div>
                                        ))}
                                        <div
                                            style={{
                                                height: 16,
                                                background: "#1e40af",
                                                borderRadius: 2,
                                                marginTop: 4,
                                            }}
                                        />
                                    </div>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: 0,
                                        borderBottom: "1px solid #e5e7eb",
                                    }}
                                >
                                    {[
                                        "Lots",
                                        "Rules",
                                        "Eligibility",
                                        "T&C",
                                    ].map((t, i) => (
                                        <div
                                            key={t}
                                            style={{
                                                padding: "4px 8px",
                                                fontSize: 8,
                                                color:
                                                    i === 0
                                                        ? "#1e40af"
                                                        : "#888",
                                                borderBottom:
                                                    i === 0
                                                        ? "2px solid #1e40af"
                                                        : "none",
                                            }}
                                        >
                                            {t}
                                        </div>
                                    ))}
                                </div>
                                {[
                                    "Long Steel",
                                    "Flat Steel",
                                    "Steel Scrap",
                                ].map((l) => (
                                    <div
                                        key={l}
                                        style={{
                                            display: "flex",
                                            gap: 4,
                                            alignItems: "center",
                                            padding: "4px",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: 2,
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 8,
                                                height: 8,
                                                background: "#e5e7eb",
                                                borderRadius: 1,
                                            }}
                                        />
                                        <span
                                            style={{
                                                fontSize: 8,
                                                color: "#333",
                                                flex: 1,
                                            }}
                                        >
                                            {l}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: 7,
                                                color: "#888",
                                            }}
                                        >
                                            Lot#567
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* WF3: Live Bidding */}
                        <div
                            style={{
                                background: "#fff",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <div
                                style={{
                                    background: "#f2f1ed",
                                    padding: "10px 14px",
                                    borderBottom: "1px solid #e0ddd6",
                                    fontSize: 10,
                                    letterSpacing: "0.18em",
                                    color: "#888880",
                                    textTransform: "uppercase",
                                }}
                            >
                                Live Bidding
                            </div>
                            <div
                                style={{
                                    padding: 14,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 6,
                                    flex: 1,
                                }}
                            >
                                <div
                                    style={{
                                        height: 20,
                                        background: "#111",
                                        borderRadius: 2,
                                    }}
                                />
                                <div
                                    style={{
                                        display: "flex",
                                        gap: 6,
                                        alignItems: "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            background: "#dc2626",
                                            color: "#fff",
                                            fontSize: 7,
                                            padding: "2px 6px",
                                            borderRadius: 10,
                                        }}
                                    >
                                        ● LIVE
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 10,
                                            color: "#dc2626",
                                            fontWeight: 700,
                                        }}
                                    >
                                        04:23
                                    </div>
                                </div>
                                <div
                                    style={{
                                        background: "#eff6ff",
                                        border: "1px solid #bfdbfe",
                                        borderRadius: 3,
                                        padding: 8,
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: 7,
                                            color: "#888",
                                            marginBottom: 3,
                                        }}
                                    >
                                        Current Highest Bid
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 16,
                                            color: "#1e40af",
                                            fontWeight: 700,
                                        }}
                                    >
                                        ₹1,24,000
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 7,
                                            color: "#16a34a",
                                            marginTop: 2,
                                        }}
                                    >
                                        You are #1 of 7 bidders
                                    </div>
                                </div>
                                {[
                                    {
                                        name: "LOT-047",
                                        price: "₹1,24,000",
                                        status: "H1",
                                        bg: "#f0fdf4",
                                        bc: "#bbf7d0",
                                        tc: "#166534",
                                    },
                                    {
                                        name: "LOT-051",
                                        price: "₹44,000",
                                        status: "OUTBID",
                                        bg: "#fef2f2",
                                        bc: "#fecaca",
                                        tc: "#dc2626",
                                    },
                                    {
                                        name: "LOT-039",
                                        price: "₹62,000",
                                        status: "Watch",
                                        bg: "#fafaf8",
                                        bc: "#e5e7eb",
                                        tc: "#888",
                                    },
                                ].map((l) => (
                                    <div
                                        key={l.name}
                                        style={{
                                            border: `1px solid ${l.bc}`,
                                            background: l.bg,
                                            borderRadius: 3,
                                            padding: 6,
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: 8,
                                                    color: "#333",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {l.name}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: 7,
                                                    color: l.tc,
                                                    background: `${l.bc}66`,
                                                    padding: "2px 6px",
                                                    borderRadius: 10,
                                                }}
                                            >
                                                {l.status}
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 9,
                                                color: "#1e40af",
                                                fontWeight: 700,
                                                marginTop: 2,
                                            }}
                                        >
                                            {l.price}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* WF4: Wallet */}
                        <div
                            style={{
                                background: "#fff",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <div
                                style={{
                                    background: "#f2f1ed",
                                    padding: "10px 14px",
                                    borderBottom: "1px solid #e0ddd6",
                                    fontSize: 10,
                                    letterSpacing: "0.18em",
                                    color: "#888880",
                                    textTransform: "uppercase",
                                }}
                            >
                                Wallet & EMD
                            </div>
                            <div
                                style={{
                                    padding: 14,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 6,
                                    flex: 1,
                                }}
                            >
                                <div
                                    style={{
                                        height: 20,
                                        background: "#111",
                                        borderRadius: 2,
                                    }}
                                />
                                <div
                                    style={{
                                        background: "#1e40af",
                                        borderRadius: 4,
                                        padding: 10,
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: 7,
                                            color: "rgba(255,255,255,0.6)",
                                            marginBottom: 3,
                                        }}
                                    >
                                        Total Wallet Balance
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 18,
                                            color: "#fff",
                                            fontWeight: 700,
                                        }}
                                    >
                                        ₹4,12,000
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: 4,
                                            marginTop: 8,
                                        }}
                                    >
                                        {[
                                            ["Available", "₹2,44,000"],
                                            ["Locked", "₹1,44,000"],
                                            ["Refund", "₹24,000"],
                                        ].map(([l, v]) => (
                                            <div
                                                key={l}
                                                style={{
                                                    flex: 1,
                                                    background:
                                                        "rgba(255,255,255,0.12)",
                                                    borderRadius: 3,
                                                    padding: "4px 6px",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontSize: 6,
                                                        color: "rgba(255,255,255,0.6)",
                                                        marginBottom: 2,
                                                    }}
                                                >
                                                    {l}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: 8,
                                                        color: "#fff",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {v}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {[
                                    {
                                        lot: "LOT-047",
                                        amt: "₹1,24,000",
                                        status: "In Use",
                                        sc: "#dc2626",
                                        sbg: "#fef2f2",
                                    },
                                    {
                                        lot: "LOT-051",
                                        amt: "₹44,000",
                                        status: "Refund",
                                        sc: "#d97706",
                                        sbg: "#fffbeb",
                                    },
                                    {
                                        lot: "LOT-039",
                                        amt: "₹62,000",
                                        status: "Locked",
                                        sc: "#1e40af",
                                        sbg: "#eff6ff",
                                    },
                                ].map((r) => (
                                    <div
                                        key={r.lot}
                                        style={{
                                            display: "flex",
                                            gap: 6,
                                            alignItems: "center",
                                            padding: "5px 0",
                                            borderBottom: "1px solid #f3f4f6",
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <div
                                                style={{
                                                    fontSize: 8,
                                                    color: "#333",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {r.lot}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 7,
                                                    color: "#888",
                                                }}
                                            >
                                                {r.amt}
                                            </div>
                                        </div>
                                        <span
                                            style={{
                                                fontSize: 7,
                                                color: r.sc,
                                                background: r.sbg,
                                                padding: "2px 6px",
                                                borderRadius: 10,
                                            }}
                                        >
                                            {r.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Formative test outcomes */}
                    <div
                        style={{
                            display: "flex",
                            gap: 20,
                            marginTop: 10,
                            padding: "14px 16px",
                            background: "#fafaf8",
                            border: "1px solid #e0ddd6",
                            flexWrap: "wrap",
                        }}
                    >
                        {[
                            [
                                "Landing Page",
                                "Informative and intuitive — positive feedback",
                                "#16a34a",
                            ],
                            [
                                "Auction Detail",
                                "Colour coding for lots appreciated — validated",
                                "#16a34a",
                            ],
                            [
                                "Live Bidding",
                                "Bid history widget dropped — not needed during live bidding",
                                "#d97706",
                            ],
                            [
                                "Wallet",
                                "Discoverability issue → moved to persistent nav",
                                "#dc2626",
                            ],
                        ].map(([label, note, col]) => (
                            <div
                                key={label}
                                style={{
                                    display: "flex",
                                    gap: 8,
                                    alignItems: "flex-start",
                                    flex: 1,
                                    minWidth: 180,
                                }}
                            >
                                <span
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        background: col,
                                        flexShrink: 0,
                                        marginTop: 4,
                                    }}
                                />
                                <div>
                                    <div
                                        style={{
                                            fontSize: 11,
                                            color: "#111",
                                            fontWeight: 600,
                                            marginBottom: 2,
                                        }}
                                    >
                                        {label}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 11,
                                            color: "#444",
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        {note}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: 28 }} className="bn-grid-3">
                    <div className="bn-cell">
                        <div
                            style={{
                                fontSize: 10,
                                letterSpacing: "0.2em",
                                color: "#888880",
                                textTransform: "uppercase",
                                marginBottom: 14,
                            }}
                        >
                            Pre Auction
                        </div>
                        {[
                            {
                                positive: true,
                                text: "Landing page, search functionality, and auction detail pages found informative and intuitive.",
                            },
                            {
                                positive: false,
                                text: "Some buyers requested additional filters for refining search results.",
                            },
                            {
                                positive: true,
                                text: "Dashboard iterated to personalised UX to help buyers identify and bid on auctions.",
                            },
                            {
                                positive: false,
                                text: "Multiple payment methods should be provided, including net banking.",
                            },
                        ].map((t, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    gap: 10,
                                    marginBottom: 10,
                                    alignItems: "flex-start",
                                }}
                            >
                                <span
                                    style={{
                                        color: t.positive
                                            ? "#16a34a"
                                            : "#d97706",
                                        flexShrink: 0,
                                        marginTop: 2,
                                    }}
                                >
                                    {t.positive ? "✓" : "→"}
                                </span>
                                <p
                                    style={{
                                        fontSize: 12,
                                        color: D.inkBody,
                                        lineHeight: 1.7,
                                        margin: 0,
                                    }}
                                >
                                    {t.text}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="bn-cell-off">
                        <div
                            style={{
                                fontSize: 10,
                                letterSpacing: "0.2em",
                                color: "#888880",
                                textTransform: "uppercase",
                                marginBottom: 14,
                            }}
                        >
                            During Auction
                        </div>
                        {[
                            {
                                positive: true,
                                text: "Live bidding screen performed well. Buyers appreciated colour usage and the ability to expand lots.",
                            },
                            {
                                positive: false,
                                text: "Bidding history widget during live bidding — users didn't need it. Recommended to drop entirely.",
                            },
                        ].map((t, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    gap: 10,
                                    marginBottom: 10,
                                    alignItems: "flex-start",
                                }}
                            >
                                <span
                                    style={{
                                        color: t.positive
                                            ? "#16a34a"
                                            : "#d97706",
                                        flexShrink: 0,
                                        marginTop: 2,
                                    }}
                                >
                                    {t.positive ? "✓" : "→"}
                                </span>
                                <p
                                    style={{
                                        fontSize: 12,
                                        color: D.inkBody,
                                        lineHeight: 1.7,
                                        margin: 0,
                                    }}
                                >
                                    {t.text}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="bn-cell">
                        <div
                            style={{
                                fontSize: 10,
                                letterSpacing: "0.2em",
                                color: "#888880",
                                textTransform: "uppercase",
                                marginBottom: 14,
                            }}
                        >
                            Post Auction
                        </div>
                        {[
                            {
                                positive: true,
                                text: "Tracking timeline, status, and next steps per lot won — appreciated by buyers.",
                            },
                            {
                                positive: true,
                                text: "Buyers prefer to pay for lots directly through BIDNEXT — preference for consolidated payment.",
                            },
                            {
                                positive: false,
                                text: "Buyers interested in delivery to location if BIDNEXT can provide at competitive rates.",
                            },
                        ].map((t, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    gap: 10,
                                    marginBottom: 10,
                                    alignItems: "flex-start",
                                }}
                            >
                                <span
                                    style={{
                                        color: t.positive
                                            ? "#16a34a"
                                            : "#d97706",
                                        flexShrink: 0,
                                        marginTop: 2,
                                    }}
                                >
                                    {t.positive ? "✓" : "→"}
                                </span>
                                <p
                                    style={{
                                        fontSize: 12,
                                        color: D.inkBody,
                                        lineHeight: 1.7,
                                        margin: 0,
                                    }}
                                >
                                    {t.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ══ 09 USABILITY TESTING ════════════════════════════════════════════════ */}
            <div className="bn-sec">
                <div className="bn-sec-label">
                    <PhaseBadge phase="approach" />
                    09 — Usability Testing
                </div>
                <h2 className="bn-h2">
                    <em>19 users. 33 tasks. 29 completed.</em>
                </h2>
                <p className="bn-p">
                    Usability testing for Phase 1 detailed designs. Mix of
                    novice and experienced buyers from both metal and value
                    auction. 4 issue areas identified.
                </p>

                <div
                    style={{
                        display: "flex",
                        gap: 1,
                        background: D.border,
                        border: `1px solid ${D.border}`,
                        marginTop: 36,
                    }}
                >
                    {[
                        ["19", "Users tested", "Mix of novice and experienced"],
                        ["33", "Tasks assigned", "Across all major flows"],
                        ["29", "Tasks completed", "By majority of users"],
                        ["4", "Issue areas", "Identified for iteration"],
                    ].map(([n, l, s]) => (
                        <div
                            key={l}
                            style={{
                                flex: 1,
                                background: D.bg,
                                padding: "28px 24px",
                            }}
                        >
                            <div className="bn-stat">{n}</div>
                            <div className="bn-stat-label">{l}</div>
                            <div className="bn-stat-note">{s}</div>
                        </div>
                    ))}
                </div>

                <div className="bn-ut-grid">
                    {[
                        {
                            title: "Live Website",
                            sev: "med",
                            body: "Users were not able to filter out sellers based on location on the seller listing screen.",
                        },
                        {
                            title: "Attachment",
                            sev: "high",
                            body: "Users faced challenge getting started. 'Participate' CTA was not the first choice. Auction-wise vs lot-wise terminology confused users.",
                        },
                        {
                            title: "Upload Documents",
                            sev: "med",
                            body: "Upload documents section for hazardous waste auction went unnoticed by many users.",
                        },
                        {
                            title: "Wallet Management",
                            sev: "high",
                            body: "Some users had to be guided to reach the wallet screen. They did not notice the expand icon CTA on the dashboard.",
                        },
                    ].map((u) => (
                        <div key={u.title} className="bn-ut-cell">
                            <span className={`bn-ut-sev ${u.sev}`}>
                                {u.sev === "high"
                                    ? "High severity"
                                    : "Medium severity"}
                            </span>
                            <div className="bn-ut-title">{u.title}</div>
                            <p className="bn-ut-body">{u.body}</p>
                        </div>
                    ))}
                </div>

                <div
                    style={{
                        marginTop: 20,
                        padding: "18px 22px",
                        background: D.bgStone,
                        border: `1px solid ${D.border}`,
                        display: "flex",
                        gap: 12,
                        alignItems: "flex-start",
                    }}
                >
                    <span style={{ fontSize: 16, marginTop: 2 }}>ℹ</span>
                    <p
                        style={{
                            fontSize: 13,
                            color: D.inkBody,
                            lineHeight: 1.7,
                            margin: 0,
                        }}
                    >
                        The wallet discoverability issue was the primary driver
                        for making wallet a persistent element in navigation and
                        dashboard hero — not buried behind an expand icon.
                    </p>
                </div>
            </div>

            {/* ══ 10 DESIGN SYSTEM ════════════════════════════════════════════════════ */}
            <div className="bn-sec">
                <div className="bn-sec-label">
                    <PhaseBadge phase="approach" />
                    10 — Design System
                </div>
                <h2 className="bn-h2">
                    A single visual language <em>across both platforms</em>
                </h2>
                <p className="bn-p">
                    <ExpandableText>
                        Unifying two platforms required a shared design system —
                        not just a style guide. Every token, component, and
                        pattern was defined to work across metal auction and
                        value auction. The Verdana constraint meant building
                        hierarchy through weight, scale, and letter-spacing
                        alone.
                    </ExpandableText>
                </p>

                {/* Colour palette */}
                <div style={{ marginTop: 40 }}>
                    <div
                        style={{
                            fontSize: 10,
                            letterSpacing: "0.22em",
                            color: "#888880",
                            textTransform: "uppercase",
                            marginBottom: 14,
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        <span
                            style={{
                                display: "inline-block",
                                width: 16,
                                height: 1,
                                background: "#cccac4",
                            }}
                        />
                        Colour palette
                    </div>
                    <div
                        style={{
                            display: "flex",
                            gap: 1,
                            background: "#e0ddd6",
                            border: "1px solid #e0ddd6",
                        }}
                    >
                        {[
                            { name: "Primary Blue", hex: "#1e40af" },
                            { name: "Blue 500", hex: "#3b82f6" },
                            { name: "Blue Surface", hex: "#eff6ff" },
                            { name: "Ink", hex: "#111111" },
                            { name: "Ink Body", hex: "#222222" },
                            { name: "Ink Mid", hex: "#777770" },
                            { name: "Ink Ghost", hex: "#aaa9a3" },
                            { name: "Border", hex: "#e0ddd6" },
                            { name: "Stone", hex: "#f2f1ed" },
                            { name: "Surface", hex: "#fafaf8" },
                            { name: "Success", hex: "#16a34a" },
                            { name: "Error", hex: "#dc2626" },
                            { name: "Warning", hex: "#d97706" },
                        ].map((c) => (
                            <div
                                key={c.name}
                                style={{
                                    flex: 1,
                                    background: c.hex,
                                    minWidth: 0,
                                }}
                            >
                                <div style={{ height: 48 }} />
                                <div
                                    style={{
                                        background: "#fff",
                                        padding: "8px 8px 10px",
                                        borderTop: "1px solid #e0ddd6",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: 9,
                                            color: "#111",
                                            fontWeight: 600,
                                            marginBottom: 2,
                                            lineHeight: 1.3,
                                        }}
                                    >
                                        {c.name}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 9,
                                            color: "#888880",
                                            fontFamily: "monospace",
                                        }}
                                    >
                                        {c.hex}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Typography */}
                <div style={{ marginTop: 36 }}>
                    <div
                        style={{
                            fontSize: 10,
                            letterSpacing: "0.22em",
                            color: "#888880",
                            textTransform: "uppercase",
                            marginBottom: 14,
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        <span
                            style={{
                                display: "inline-block",
                                width: 16,
                                height: 1,
                                background: "#cccac4",
                            }}
                        />
                        Typography — Verdana
                    </div>
                    <div
                        style={{
                            border: "1px solid #e0ddd6",
                            overflow: "hidden",
                        }}
                    >
                        {[
                            {
                                role: "Display",
                                sizePx: "80px",
                                weight: 700,
                                sample: "Redesigning B2B auctions",
                            },
                            {
                                role: "H2 Section",
                                sizePx: "46px",
                                weight: 700,
                                sample: "Trust through transparency",
                            },
                            {
                                role: "H3 Sub-head",
                                sizePx: "18px",
                                weight: 700,
                                sample: "Wallet & EMD Management",
                            },
                            {
                                role: "Body",
                                sizePx: "15px",
                                weight: 400,
                                sample: "Users need to know where their money is at all times.",
                            },
                            {
                                role: "Small / Label",
                                sizePx: "12px",
                                weight: 400,
                                sample: "Transaction reference · LOT-0047 · EMD Locked",
                            },
                            {
                                role: "Caption",
                                sizePx: "10px",
                                weight: 400,
                                sample: "REGISTRATION · PHASE 1 · CONFIRMED IN TESTING",
                            },
                        ].map((t, i) => (
                            <div
                                key={t.role}
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "140px 70px 1fr",
                                    borderBottom:
                                        i < 5 ? "1px solid #e0ddd6" : "none",
                                    alignItems: "center",
                                }}
                            >
                                <div
                                    style={{
                                        padding: "18px 16px",
                                        fontSize: 10,
                                        letterSpacing: "0.16em",
                                        color: "#888880",
                                        textTransform: "uppercase",
                                        borderRight: "1px solid #e0ddd6",
                                        alignSelf: "stretch",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    {t.role}
                                </div>
                                <div
                                    style={{
                                        padding: "18px 14px",
                                        fontSize: 10,
                                        color: "#aaa",
                                        fontFamily: "monospace",
                                        borderRight: "1px solid #e0ddd6",
                                        alignSelf: "stretch",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    {t.sizePx}
                                </div>
                                <div
                                    style={{
                                        padding: "18px 24px",
                                        fontFamily: "Verdana",
                                        fontSize: t.sizePx,
                                        fontWeight: t.weight,
                                        color: "#111",
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {t.sample}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Core components */}
                <div style={{ marginTop: 36 }}>
                    <div
                        style={{
                            fontSize: 10,
                            letterSpacing: "0.22em",
                            color: "#888880",
                            textTransform: "uppercase",
                            marginBottom: 14,
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        <span
                            style={{
                                display: "inline-block",
                                width: 16,
                                height: 1,
                                background: "#cccac4",
                            }}
                        />
                        Core components
                    </div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4,1fr)",
                            gap: 1,
                            background: "#e0ddd6",
                            border: "1px solid #e0ddd6",
                        }}
                    >
                        <div style={{ background: "#fff", padding: 22 }}>
                            <div
                                style={{
                                    fontSize: 10,
                                    letterSpacing: "0.18em",
                                    color: "#888880",
                                    textTransform: "uppercase",
                                    marginBottom: 14,
                                }}
                            >
                                Buttons
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 8,
                                }}
                            >
                                {[
                                    {
                                        label: "Register to Bid",
                                        bg: "#1e40af",
                                        color: "#fff",
                                        border: "none",
                                    },
                                    {
                                        label: "View Auctions",
                                        bg: "#fff",
                                        color: "#1e40af",
                                        border: "1px solid #1e40af",
                                    },
                                    {
                                        label: "Outbid — Bid Again",
                                        bg: "#dc2626",
                                        color: "#fff",
                                        border: "none",
                                    },
                                    {
                                        label: "Disabled",
                                        bg: "#f2f1ed",
                                        color: "#888880",
                                        border: "1px solid #e0ddd6",
                                    },
                                ].map((b) => (
                                    <button
                                        key={b.label}
                                        style={{
                                            background: b.bg,
                                            color: b.color,
                                            border: b.border,
                                            padding: "9px 16px",
                                            fontSize: 12,
                                            fontFamily: "Verdana",
                                            cursor: "pointer",
                                            width: "100%",
                                        }}
                                    >
                                        {b.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={{ background: "#fafaf8", padding: 22 }}>
                            <div
                                style={{
                                    fontSize: 10,
                                    letterSpacing: "0.18em",
                                    color: "#888880",
                                    textTransform: "uppercase",
                                    marginBottom: 14,
                                }}
                            >
                                Status Badges
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 8,
                                }}
                            >
                                {[
                                    ["#1", "#f0fdf4", "#bbf7d0", "#166534"],
                                    ["Outbid", "#fef2f2", "#fecaca", "#dc2626"],
                                    [
                                        "EMD Locked",
                                        "#eff6ff",
                                        "#bfdbfe",
                                        "#1e40af",
                                    ],
                                    [
                                        "Refund Initiated",
                                        "#fffbeb",
                                        "#fde68a",
                                        "#92400e",
                                    ],
                                    ["Live", "#fef2f2", "#fca5a5", "#dc2626"],
                                    ["Closed", "#f2f1ed", "#e0ddd6", "#777770"],
                                ].map(([label, bg, border, color]) => (
                                    <span
                                        key={label}
                                        style={{
                                            fontSize: 11,
                                            color,
                                            background: bg,
                                            border: `1px solid ${border}`,
                                            padding: "4px 10px",
                                            display: "inline-block",
                                            width: "fit-content",
                                        }}
                                    >
                                        {label}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div style={{ background: "#fff", padding: 22 }}>
                            <div
                                style={{
                                    fontSize: 10,
                                    letterSpacing: "0.18em",
                                    color: "#888880",
                                    textTransform: "uppercase",
                                    marginBottom: 14,
                                }}
                            >
                                Form Inputs
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 10,
                                }}
                            >
                                {[
                                    {
                                        label: "Company Name",
                                        state: "default",
                                        border: "#e0ddd6",
                                        bg: "#fff",
                                        val: "Enter value...",
                                    },
                                    {
                                        label: "GST Number",
                                        state: "error",
                                        border: "#fecaca",
                                        bg: "#fef2f2",
                                        val: "Invalid format",
                                    },
                                    {
                                        label: "PAN Number",
                                        state: "success",
                                        border: "#bbf7d0",
                                        bg: "#f0fdf4",
                                        val: "Verified ✓",
                                    },
                                ].map((f) => (
                                    <div key={f.label}>
                                        <div
                                            style={{
                                                fontSize: 10,
                                                color: "#777770",
                                                marginBottom: 4,
                                                letterSpacing: "0.1em",
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            {f.label}
                                        </div>
                                        <div
                                            style={{
                                                border: `1px solid ${f.border}`,
                                                background: f.bg,
                                                padding: "8px 12px",
                                                fontSize: 12,
                                                color:
                                                    f.state === "error"
                                                        ? "#dc2626"
                                                        : f.state === "success"
                                                          ? "#166534"
                                                          : "#888",
                                            }}
                                        >
                                            {f.val}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ background: "#fafaf8", padding: 22 }}>
                            <div
                                style={{
                                    fontSize: 10,
                                    letterSpacing: "0.18em",
                                    color: "#888880",
                                    textTransform: "uppercase",
                                    marginBottom: 14,
                                }}
                            >
                                Lot Card
                            </div>
                            <div
                                style={{
                                    background: "#fff",
                                    border: "1px solid #e0ddd6",
                                    padding: 14,
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        marginBottom: 10,
                                    }}
                                >
                                    <div>
                                        <div
                                            style={{
                                                fontSize: 10,
                                                color: "#888880",
                                                marginBottom: 3,
                                            }}
                                        >
                                            LOT-0047
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 13,
                                                color: "#111",
                                                fontFamily: "Verdana",
                                                fontWeight: 600,
                                                lineHeight: 1.3,
                                            }}
                                        >
                                            HR Steel Coils
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 11,
                                                color: "#777770",
                                                marginTop: 2,
                                            }}
                                        >
                                            IS 2062 E250 · 50 MT
                                        </div>
                                    </div>
                                    <span
                                        style={{
                                            fontSize: 9,
                                            color: "#dc2626",
                                            background: "#fef2f2",
                                            border: "1px solid #fecaca",
                                            padding: "3px 8px",
                                        }}
                                    >
                                        HOT
                                    </span>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        paddingTop: 10,
                                        borderTop: "1px solid #e0ddd6",
                                    }}
                                >
                                    <div>
                                        <div
                                            style={{
                                                fontSize: 9,
                                                color: "#888880",
                                            }}
                                        >
                                            Current Bid
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 16,
                                                color: "#1e40af",
                                                fontWeight: 700,
                                            }}
                                        >
                                            ₹1,24,000
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div
                                            style={{
                                                fontSize: 9,
                                                color: "#888880",
                                            }}
                                        >
                                            EMD
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 12,
                                                color: "#111",
                                            }}
                                        >
                                            ₹12,400
                                        </div>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        marginTop: 10,
                                        background: "#1e40af",
                                        color: "#fff",
                                        padding: "8px",
                                        textAlign: "center",
                                        fontSize: 11,
                                        fontFamily: "Verdana",
                                    }}
                                >
                                    Place Bid
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Spacing scale */}
                <div style={{ marginTop: 32 }}>
                    <div
                        style={{
                            fontSize: 10,
                            letterSpacing: "0.22em",
                            color: "#888880",
                            textTransform: "uppercase",
                            marginBottom: 14,
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        <span
                            style={{
                                display: "inline-block",
                                width: 16,
                                height: 1,
                                background: "#cccac4",
                            }}
                        />
                        Spacing scale
                    </div>
                    <div
                        style={{
                            display: "flex",
                            gap: 1,
                            background: "#e0ddd6",
                            border: "1px solid #e0ddd6",
                        }}
                    >
                        {[
                            [4, "4px", "Micro"],
                            [8, "8px", "XS"],
                            [12, "12px", "S"],
                            [16, "16px", "Base"],
                            [24, "24px", "M"],
                            [32, "32px", "L"],
                            [48, "48px", "XL"],
                            [64, "64px", "2XL"],
                            [96, "96px", "3XL"],
                        ].map(([n, px, label]) => (
                            <div
                                key={px}
                                style={{
                                    flex: 1,
                                    background: "#fff",
                                    padding: "14px 10px",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 7,
                                }}
                            >
                                <div
                                    style={{
                                        width: n,
                                        height: n,
                                        background: "#1e40af",
                                        maxWidth: 56,
                                        maxHeight: 56,
                                    }}
                                />
                                <div
                                    style={{
                                        fontSize: 9,
                                        color: "#111",
                                        fontFamily: "monospace",
                                        textAlign: "center",
                                    }}
                                >
                                    {px}
                                </div>
                                <div
                                    style={{
                                        fontSize: 8,
                                        color: "#888880",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.1em",
                                    }}
                                >
                                    {label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ══ 11 DESIGN SOLUTIONS ═════════════════════════════════════════════════ */}
            <div className="bn-sec bn-sec-alt">
                <div className="bn-sec-label">
                    <PhaseBadge phase="approach" />
                    11 — Design Solutions
                </div>
                <h2 className="bn-h2">
                    Four flows <em>redesigned from the ground up</em>
                </h2>
                <p className="bn-p">
                    Each solution directly addresses a documented research
                    finding, formative testing outcome, or usability test
                    failure. Interactive prototypes below.
                </p>

                <div className="bn-solutions">
                    {[
                        {
                            n: "01",
                            t: "Unified Marketplace",
                            problem:
                                "Two separate auction apps created redundant logins, missed auctions, and split user context. From the RFQ: 'Buyers interact with two separate apps. Design is dated. No user analytics data.'",
                            decision:
                                "Unified both platforms into one adaptive experience with single sign-on. The 15-minute interest-to-bid goal made unification non-negotiable.",
                            bullets: [
                                "Single dashboard showing all auction types",
                                "Unified search and filter across both markets",
                                "One login, one wallet, one transaction history",
                                "Category-based discovery replacing app-switching",
                            ],
                            img: null,
                        },
                        {
                            n: "02",
                            t: "Progressive Registration with Guest Mode",
                            problem:
                                "Lengthy registration with many offline activities. Journey map showed 'eager, desperate, and confused' as emotional state at registration — with offline document submission and no visibility on completion.",
                            decision:
                                "Introduced guest browsing and split registration into business vs personal paths. KYC moved from registration gate to first-bid moment. Offline steps replaced with digital document upload.",
                            bullets: [
                                "Guest mode: browse auctions without registering",
                                "Clear fork: business registration vs guest path",
                                "Progressive disclosure: collect data only when it unlocks value",
                                "Digital document upload replacing offline submission",
                            ],
                            img: "REG_CAROUSEL",
                        },
                        {
                            n: "03",
                            t: "Transparent Wallet and EMD Tracking",
                            problem:
                                "EMD flow invisible to users. Wallet was a high-severity usability issue: 'Some users had to be guided to reach the wallet screen.' The factory director's primary trait: 'very focused on where their money is.'",
                            decision:
                                "Built unified wallet with real-time visibility. Made wallet a persistent, prominent element. Three-way balance split always above the fold.",
                            bullets: [
                                "Available balance, locked EMD, pending refunds — always visible",
                                "Transaction history with lot-level reference, filter, and export",
                                "Live EMD status per lot with countdown timers",
                                "Wallet surfaced prominently in dashboard — not hidden behind icon",
                            ],
                            img: "WALLET_SCREEN",
                        },
                        {
                            n: "04",
                            t: "Personalised Dashboard",
                            problem:
                                "No quick overview of ongoing auctions or wallet balance. Dashboard was iterated during formative testing specifically to help buyers identify auctions, bid on attached auctions, and manage historic wins.",
                            decision:
                                "Role-based dashboard showing relevant actions first. Wallet balance persistent in hero. Live countdowns. Bid rank visible without navigating away.",
                            bullets: [
                                "Hero stat cards: Active Bids, Wallet Balance, Upcoming Auctions",
                                "Live auction module with countdown and current rank",
                                "Personalised based on categories of interest and bid history",
                                "Wallet accessible directly from dashboard",
                            ],
                            img: "DASHBOARD",
                        },
                    ].map((s) => (
                        <div key={s.n} className="bn-solution">
                            <div className="bn-sol-head">
                                <div className="bn-sol-num">{s.n}</div>
                                <div className="bn-sol-title">{s.t}</div>
                            </div>
                            <div className="bn-sol-body">
                                <div className="bn-sol-problem">
                                    <div className="bn-sol-prob-lbl">
                                        Problem
                                    </div>
                                    <p className="bn-sol-prob-text">
                                        <ExpandableText>
                                            {s.problem}
                                        </ExpandableText>
                                    </p>
                                </div>
                                <div className="bn-sol-decision">
                                    <span className="bn-sol-dec-lbl">
                                        Design Decision
                                    </span>
                                    <p className="bn-sol-dec-text">
                                        {s.decision}
                                    </p>
                                    <ul className="bn-sol-bullets">
                                        {s.bullets.map((b) => (
                                            <li key={b}>{b}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            {s.img === null ? (
                                <div
                                    style={{
                                        borderTop: `1px solid ${D.border}`,
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            padding: "10px 22px",
                                            background: D.bgStone,
                                            borderBottom: `1px solid ${D.border}`,
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 16,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: 9,
                                                    letterSpacing: "0.22em",
                                                    color: "#888880",
                                                    textTransform: "uppercase",
                                                }}
                                            >
                                                Live prototype
                                            </span>
                                            <span
                                                style={{
                                                    width: 1,
                                                    height: 10,
                                                    background: D.border,
                                                    display: "inline-block",
                                                }}
                                            />
                                            <span
                                                style={{
                                                    fontSize: 9,
                                                    letterSpacing: "0.18em",
                                                    color: "#888880",
                                                    textTransform: "uppercase",
                                                }}
                                            >
                                                Fully interactive
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 5,
                                            }}
                                        >
                                            {[
                                                "#ef4444",
                                                "#f59e0b",
                                                "#22c55e",
                                            ].map((c, i) => (
                                                <span
                                                    key={i}
                                                    style={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: "50%",
                                                        background: c,
                                                        display: "inline-block",
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <LandingSection />
                                </div>
                            ) : s.img === "REG_CAROUSEL" ? (
                                <div
                                    style={{
                                        borderTop: `1px solid ${D.border}`,
                                    }}
                                >
                                    <RegistrationCarousel />
                                </div>
                            ) : s.img === "WALLET_SCREEN" ? (
                                <div
                                    style={{
                                        borderTop: `1px solid ${D.border}`,
                                    }}
                                >
                                    <WalletIterations />
                                    <WalletScreen />
                                </div>
                            ) : s.img === "DASHBOARD" ? (
                                <div
                                    style={{
                                        borderTop: `1px solid ${D.border}`,
                                    }}
                                >
                                    <PersonalisedDashboard />
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>

            {/* ══ 12 OUTCOMES ═════════════════════════════════════════════════════════ */}
            <div className="bn-sec">
                <div className="bn-sec-label">
                    <PhaseBadge phase="outcome" />
                    12 — Outcomes
                </div>
                <h2 className="bn-h2">
                    What we can say <em>with confidence</em>
                </h2>
                <p className="bn-p">
                    Outcomes categorised honestly — distinguishing between what
                    was directly observed in testing, what was projected based
                    on test findings, and what remains a hypothesis.
                </p>

                <div
                    style={{
                        display: "flex",
                        gap: 16,
                        marginBottom: 28,
                        marginTop: 28,
                        flexWrap: "wrap",
                    }}
                >
                    {[
                        ["Confirmed in testing", "real"],
                        ["Projected — based on usability results", "est"],
                        ["Hypothesis — to validate post-launch", "hyp"],
                    ].map(([l, cls]) => (
                        <div
                            key={l}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <span className={`bn-out-tag ${cls}`}>
                                {cls === "real"
                                    ? "Confirmed"
                                    : cls === "est"
                                      ? "Projected"
                                      : "Hypothesis"}
                            </span>
                            <span style={{ fontSize: 12, color: D.inkBody }}>
                                {l}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="bn-outcomes">
                    {[
                        {
                            tag: "real",
                            title: "Bidding history widget dropped",
                            body: "Confirmed in formative testing: users did not need the bidding history widget during live bidding. Removing it reduced visual complexity in the most time-pressured flow.",
                        },
                        {
                            tag: "real",
                            title: "Wallet discoverability solved",
                            body: "Confirmed in usability testing: the expand icon pattern failed. Wallet is now a persistent element in dashboard hero and main navigation — verified accessible in 29/33 task completions.",
                        },
                        {
                            tag: "real",
                            title: "Live bidding screen validated",
                            body: "Confirmed in formative testing: colour coding for lot status and the expandable lot detail pattern both performed well with buyers across PAN India market.",
                        },
                        {
                            tag: "est",
                            title: "Registration completion increase",
                            body: "Projected improvement based on progressive registration design and guest mode. Significant reduction in confusion at registration step observed in usability test.",
                        },
                        {
                            tag: "est",
                            title: "EMD support ticket reduction",
                            body: "Projected reduction based on wallet visibility improvements. All 4 high-severity usability issues in wallet management are addressed.",
                        },
                        {
                            tag: "hyp",
                            title: "Delivery service adoption",
                            body: "Hypothesis from formative testing: buyers expressed interest in paying for delivery through BIDNEXT if price is competitive. If implemented, strong adoption expected.",
                        },
                    ].map((o) => (
                        <div key={o.title} className="bn-outcome">
                            <span className={`bn-out-tag ${o.tag}`}>
                                {o.tag === "real"
                                    ? "Confirmed in testing"
                                    : o.tag === "est"
                                      ? "Projected"
                                      : "Hypothesis"}
                            </span>
                            <div className="bn-out-title">{o.title}</div>
                            <p className="bn-out-body">{o.body}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ══ 13 PROJECT CHALLENGES ═══════════════════════════════════════════════ */}
            <div className="bn-sec bn-sec-alt">
                <div className="bn-sec-label">
                    <PhaseBadge phase="takeaways" />
                    13 — Project Challenges
                </div>
                <h2 className="bn-h2">
                    What actually <em>made this hard</em>
                </h2>
                <p className="bn-p">
                    Real constraints documented in the project retrospective —
                    not obstacles designed around, but forces that affected
                    scope, timeline, and output quality.
                </p>

                <div className="bn-constraints">
                    {[
                        {
                            title: "We underestimated the user research",
                            body: "A research lead was assigned and then taken away. BIDNEXT rejected the first set of research results when we reported familiar and negative insights. We held the line, ran additional interviews, and validated the original findings.",
                        },
                        {
                            title: "There are no SPOCs at BIDNEXT",
                            body: "Multiple business units and a development team made it difficult to get clear requirements, schedule reviews, and get sign-off. Design decisions sometimes circulated without reaching the right decision-maker.",
                        },
                        {
                            title: "The plan was optimistic",
                            body: "We underestimated project scope. BIDNEXT pushed new requirements all the way to the last week. The plan assumed separation between boilerplate, web, platform, and phases — but the design that emerged was integrated.",
                        },
                        {
                            title: "Legacy trumps transformation",
                            body: "BIDNEXT is constrained by a decade of service to 140 clients. This made it difficult to challenge the way things are done — even when research clearly pointed to a better approach.",
                        },
                        {
                            title: "Development doesn't always work iteratively",
                            body: "Some development teams prefer to wait until all designs are signed off before beginning. This compressed the feedback loop between design and build, reducing the ability to course-correct.",
                        },
                        {
                            title: "Design system scope grew significantly",
                            body: "The initial brief didn't account for the scale of design system work required to unify two platforms. Working within the Verdana constraint while achieving modern design standards required careful typographic hierarchy work beyond original scope.",
                        },
                    ].map((c) => (
                        <div key={c.title} className="bn-constraint">
                            <div className="bn-con-title">{c.title}</div>
                            <p className="bn-con-body">
                                <ExpandableText>{c.body}</ExpandableText>
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ══ 14 REFLECTION ═══════════════════════════════════════════════════════ */}
            <div className="bn-sec">
                <div className="bn-sec-label">
                    <PhaseBadge phase="takeaways" />
                    14 — Reflection
                </div>
                <h2 className="bn-h2">
                    What I <em>actually learned</em>
                </h2>
                <p className="bn-p">
                    Not lessons framed as achievements. These are the genuine
                    takeaways — including the things I'd do differently.
                </p>

                <div className="bn-reflect" style={{ marginTop: 36 }}>
                    {[
                        {
                            title: "Clients can reject research that's inconvenient",
                            body: "When we reported familiar and negative insights, BIDNEXT pushed back. The instinct is to soften findings to avoid conflict — but the correct response is to defend the methodology and offer more evidence, not to change the conclusion. Stakeholder management is not just about presentation style — sometimes it's about being willing to repeat uncomfortable truths.",
                        },
                        {
                            title: "Formative testing saved the bidding history feature from being built",
                            body: "We designed a bidding history widget based on a reasonable assumption — that users would want to see bid history to refine strategy. Formative testing showed the opposite: users didn't want it during live bidding. Not testing this assumption would have meant building something that added noise to the most cognitively demanding screen in the platform.",
                        },
                        {
                            title: "The wallet needed to be findable before it could be useful",
                            body: "The usability test revealed that the wallet's discoverability was the problem — not its design. An expand icon on the dashboard is not a navigation pattern — it's a trap. Discoverability and utility are separate problems and both have to be solved.",
                        },
                        {
                            title: "Scope creep with no SPOC is a structural problem, not a planning problem",
                            body: "New requirements came in the last week. Without a single point of contact, requirements circulated through multiple business units and arrived late. In future projects with multiple business units, negotiate a SPOC or a change control process as a contractual condition — not as a project management preference.",
                        },
                    ].map((r) => (
                        <div key={r.title} className="bn-ref-item">
                            <div className="bn-ref-title">{r.title}</div>
                            <p className="bn-ref-body">
                                <ExpandableText limit={280}>
                                    {r.body}
                                </ExpandableText>
                            </p>
                        </div>
                    ))}
                </div>

                <div
                    style={{
                        marginTop: 40,
                        padding: "48px",
                        background: D.blackBox,
                    }}
                >
                    <p
                        style={{
                            fontFamily: "Verdana",
                            fontSize: "clamp(16px,2vw,22px)",
                            lineHeight: 1.5,
                            color: "#fff",
                            margin: "0 0 20px",
                        }}
                    >
                        The CEO brief was direct: 15 minutes from interest to
                        bid. Challenge every assumption. Don't recreate the
                        journeys — redefine them. The work that mattered most
                        wasn't the visual design. It was earning the right to
                        simplify.
                    </p>
                    <span
                        style={{
                            fontSize: 11,
                            letterSpacing: "0.15em",
                            color: "rgba(255,255,255,0.35)",
                            textTransform: "uppercase",
                        }}
                    >
                        BIDNEXT · B2B E-Auction Redesign · 4 Research Stages ·
                        19 Users · 33 Tasks
                    </span>
                </div>
            </div>
        </div>
    )
}
