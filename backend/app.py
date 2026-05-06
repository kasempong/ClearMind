import sqlite3, os, secrets, sys
from datetime import datetime
from functools import wraps
from flask import Flask, request, jsonify, g, send_from_directory, send_file
from flask_cors import CORS

app = Flask(__name__)

ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
CORS(app, origins=ALLOWED_ORIGINS)

DB_PATH = os.environ.get("DB_PATH", "clearmind.db")
API_KEY = os.environ.get("API_KEY")
if not API_KEY:
    API_KEY = secrets.token_hex(32)
    print(f"[WARN] No API_KEY set — generated one: {API_KEY}", file=sys.stderr)

MAX_FIELD_LEN = {"ticker": 10, "setup": 1000, "notes": 2000}

ALLOWED_FIELDS = {
    "ticker",
    "direction",
    "emotion",
    "outcome",
    "confidence",
    "setup",
    "notes",
    "biases",
}

# ── Auth decorator ────────────────────────────────────────────────────────────────


def require_api_key(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        key = request.headers.get("X-API-Key", "")
        if not key or not secrets.compare_digest(key, API_KEY):
            return jsonify({"error": "Unauthorized"}), 401
        return f(*args, **kwargs)

    return decorated


# ── DB helpers ────────────────────────────────────────────────────────────────


def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
    return g.db


@app.teardown_appcontext
def close_db(e=None):
    db = g.pop("db", None)
    if db:
        db.close()


def init_db():
    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row
    with open(os.path.join(os.path.dirname(__file__), "schema.sql")) as f:
        db.executescript(f.read())
    if db.execute("SELECT COUNT(*) FROM entries").fetchone()[0] == 0:
        seed(db)
    db.commit()
    db.close()


def seed(db):
    entries = [
        (
            "NVDA",
            "long",
            "confident",
            "win",
            5,
            "Dominant in AI training chips — H100 demand from hyperscalers is unprecedented.",
            "Trimmed too early at 480. Should have held through the next leg.",
            "overconfident",
            "2024-03-15",
        ),
        (
            "TSLA",
            "long",
            "FOMO",
            "loss",
            2,
            "EV penetration slowing. China competition intensifying.",
            "Watched it drop 30% and still did not act. Fear of catching a falling knife.",
            "herd_following",
            "2024-03-10",
        ),
        (
            "AOT",
            "long",
            "calm",
            "win",
            4,
            "Airport of Thailand — tourism recovery on track. International pax back to 95%.",
            "Good entry. Waited for the technical confirmation rather than jumping in on news.",
            "anchoring",
            "2024-03-08",
        ),
        (
            "MSFT",
            "long",
            "calm",
            "open",
            4,
            "Azure growth reaccelerating. Copilot monetization just beginning.",
            "",
            "",
            "2024-03-20",
        ),
        (
            "GLD",
            "long",
            "calm",
            "win",
            3,
            "Gold as hedge against geopolitical risk and dollar weakness.",
            "Simple macro trade. Kept position size small.",
            "",
            "2024-02-28",
        ),
        (
            "META",
            "long",
            "confident",
            "win",
            5,
            "Year of efficiency paid off. Reels monetization improving.",
            "Got greedy and sold too late on the way up.",
            "overconfident",
            "2024-02-15",
        ),
        (
            "PTT",
            "long",
            "calm",
            "open",
            3,
            "State-owned energy giant. Dividend yield ~4.5%.",
            "",
            "",
            "2024-03-22",
        ),
        (
            "CRWD",
            "long",
            "calm",
            "open",
            4,
            "Best-of-breed in cybersecurity. Platform consolidation thesis intact.",
            "Still in trade. Following the plan.",
            "",
            "2024-03-18",
        ),
    ]
    db.executemany(
        "INSERT INTO entries (ticker, direction, emotion, outcome, confidence, setup, notes, biases, created_at, updated_at) "
        "VALUES (?,?,?,?,?,?,?,?,?,?)",
        [
            (t, d, em, ou, co, se, no, bi, cr, cr)
            for t, d, em, ou, co, se, no, bi, cr in entries
        ],
    )


# ── Field helpers ─────────────────────────────────────────────────────────────


def extract_fields(raw):
    data = {k: raw[k] for k in ALLOWED_FIELDS if k in raw}

    for field, maxlen in MAX_FIELD_LEN.items():
        if field in data and isinstance(data[field], str) and len(data[field]) > maxlen:
            data[field] = data[field][:maxlen]

    if "biases" in data and isinstance(data["biases"], list):
        data["biases"] = ",".join(b for b in data["biases"] if b)
    if "confidence" in data:
        try:
            data["confidence"] = max(1, min(5, int(data["confidence"])))
        except (TypeError, ValueError):
            data["confidence"] = 3
    return data


def row_to_dict(row):
    d = dict(row)
    biases_str = d.get("biases", "")
    d["biases"] = [b for b in biases_str.split(",") if b] if biases_str else []
    return d


# ── Routes ────────────────────────────────────────────────────────────────────


@app.route("/ping")
def ping():
    return jsonify({"version": "2.0", "auth": "disabled"})


@app.route("/entries", methods=["GET"])
def list_entries():
    db = get_db()
    page = max(1, int(request.args.get("page", 1)))
    per_page = min(100, max(1, int(request.args.get("per_page", 50))))
    offset = (page - 1) * per_page
    total = db.execute("SELECT COUNT(*) FROM entries").fetchone()[0]
    rows = db.execute(
        "SELECT * FROM entries ORDER BY created_at DESC LIMIT ? OFFSET ?",
        (per_page, offset),
    ).fetchall()
    return jsonify(
        {
            "entries": [row_to_dict(r) for r in rows],
            "pagination": {
                "page": page,
                "per_page": per_page,
                "total": total,
                "pages": (total + per_page - 1) // per_page if total else 0,
            },
        }
    )


@app.route("/entries", methods=["POST"])
def create_entry():
    raw = request.get_json()
    data = extract_fields(raw or {})
    if not data.get("ticker", "").strip():
        return jsonify({"error": "ticker is required"}), 400
    db = get_db()
    now = datetime.utcnow().isoformat()
    cols = list(data.keys())
    col_str = ", ".join(cols)
    placeholders = ", ".join(f":{c}" for c in cols)
    cur = db.execute(
        f"INSERT INTO entries ({col_str}, created_at, updated_at) VALUES ({placeholders}, :now, :now)",
        {**data, "now": now},
    )
    db.commit()
    row = db.execute("SELECT * FROM entries WHERE id=?", (cur.lastrowid,)).fetchone()
    return jsonify(row_to_dict(row)), 201


@app.route("/entries/<int:entry_id>", methods=["GET"])
def get_entry(entry_id):
    db = get_db()
    row = db.execute("SELECT * FROM entries WHERE id=?", (entry_id,)).fetchone()
    if not row:
        return jsonify({"error": "Not found"}), 404
    return jsonify(row_to_dict(row))


@app.route("/entries/<int:entry_id>", methods=["PUT"])
def update_entry(entry_id):
    raw = request.get_json()
    data = extract_fields(raw or {})
    if not data:
        return jsonify({"error": "No valid fields provided"}), 400
    db = get_db()
    if not db.execute("SELECT id FROM entries WHERE id=?", (entry_id,)).fetchone():
        return jsonify({"error": "Not found"}), 404
    now = datetime.utcnow().isoformat()
    sets = ", ".join(f"{c}=:{c}" for c in data.keys())
    db.execute(
        f"UPDATE entries SET {sets}, updated_at=:now WHERE id=:id",
        {**data, "now": now, "id": entry_id},
    )
    db.commit()
    row = db.execute("SELECT * FROM entries WHERE id=?", (entry_id,)).fetchone()
    return jsonify(row_to_dict(row))


@app.route("/entries/<int:entry_id>", methods=["DELETE"])
def delete_entry(entry_id):
    db = get_db()
    if not db.execute("SELECT id FROM entries WHERE id=?", (entry_id,)).fetchone():
        return jsonify({"error": "Not found"}), 404
    db.execute("DELETE FROM entries WHERE id=?", (entry_id,))
    db.commit()
    return "", 204


@app.route("/stats", methods=["GET"])
def stats():
    db = get_db()

    total = db.execute("SELECT COUNT(*) FROM entries").fetchone()[0]
    outcomes = dict(
        db.execute("SELECT outcome, COUNT(*) FROM entries GROUP BY outcome").fetchall()
    )
    emotions = dict(
        db.execute("SELECT emotion, COUNT(*) FROM entries GROUP BY emotion").fetchall()
    )
    fomo_count = db.execute(
        "SELECT COUNT(*) FROM entries WHERE emotion='FOMO'"
    ).fetchone()[0]

    win_count = outcomes.get("win", 0)
    loss_count = outcomes.get("loss", 0)
    closed = win_count + loss_count
    win_rate = round(win_count / closed * 100, 1) if closed > 0 else 0

    avg_conf = db.execute("SELECT AVG(confidence) FROM entries").fetchone()[0] or 0
    avg_conf = round(float(avg_conf), 1)

    emotion_wr_rows = db.execute("""
        SELECT emotion,
               SUM(CASE WHEN outcome='win' THEN 1 ELSE 0 END) as wins,
               COUNT(*) as total
        FROM entries GROUP BY emotion
    """).fetchall()
    emotion_wr = {
        r["emotion"]: round(r["wins"] / r["total"] * 100, 1)
        for r in emotion_wr_rows
        if r["total"] > 0
    }

    biases = {}
    bias_pct = {}
    for row in db.execute('SELECT biases FROM entries').fetchall():
        for b in (row['biases'] or '').split(','):
            b = b.strip()
            if b:
                biases[b] = biases.get(b, 0) + 1
    if biases:
        total_biases = sum(biases.values())
        bias_pct = {b: round(c / total_biases * 100) for b, c in biases.items()}

    return jsonify(
        {
            "total": total,
            "win_rate": win_rate,
            "fomo_count": fomo_count,
            "avg_confidence": avg_conf,
            "outcomes": outcomes,
            "emotions": emotions,
            "biases": biases,
            "bias_pct": bias_pct,
            "emotion_win_rate": emotion_wr,
        }
    )


# ── Frontend static serving ───────────────────────────────────────────────────

FRONTEND_DIST = os.environ.get(
    "FRONTEND_DIST",
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "frontend", "dist"),
)


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    if not os.path.isdir(FRONTEND_DIST):
        return jsonify(
            {"error": "Frontend not built. Run: cd frontend && npm run build"}
        ), 404
    full = os.path.join(FRONTEND_DIST, path)
    if path and os.path.exists(full):
        return send_from_directory(FRONTEND_DIST, path)
    return send_file(os.path.join(FRONTEND_DIST, "index.html"))


# ── Boot ─────────────────────────────────────────────────────────────────────

with app.app_context():
    init_db()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=os.environ.get("FLASK_DEBUG", "false").lower() == "true", port=port)
