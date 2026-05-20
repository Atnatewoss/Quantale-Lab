# Residuated Quantale Chess Arena

An algebraic framework and interactive application modeling chess skill progressions, compositions, and residuals using a Residuated Quantale.

---

## 1. Domain Specification (What does $Q$ represent?)
The domain $Q$ represents the finite set of chess skill progression tiers ordered linearly:
$$Q = \{ \text{beginner}, \text{intermediate}, \text{advanced}, \text{master}, \text{grandmaster} \}$$
A total order ($\le$) is established over $Q$ representing skill progression:
$$\text{beginner} \le \text{intermediate} \le \text{advanced} \le \text{master} \le \text{grandmaster}$$
* **Top element ($\top$)**: $\text{grandmaster}$
* **Bottom element ($\bot$)**: $\text{beginner}$

---

## 2. Monoid Operation (What does $\otimes$ model?)
The multiplication/composition operator $\otimes$ models **skill interaction or cooperative play**.
* It is implemented as the **infimum meet** ($\wedge$) in the lattice (i.e., taking the minimum of two tiers).
* **Concept**: When two chess players interact or play in a team, their joint tactical coordination level is constrained by the understanding of the weaker player.
* **Example**: $\text{advanced} \otimes \text{beginner} = \text{beginner}$.
* **Identity**: $\text{grandmaster}$ is the monoid identity element, because interacting with a grandmaster preserves your own skill level as the limit: $\text{grandmaster} \otimes x = x$.

---

## 3. Right Residual (What question does $\rightarrow$ answer?)
The right residual $a \rightarrow c$ answers the following practical question:
> *"Given that I am a player of skill tier $a$, what is the strongest level partner $b$ I can cooperate with such that our joint performance does not exceed a limit tier $c$?"*

Mathematically, it finds the maximum element $b$ such that:
$$a \otimes b \le c$$

* **Example 1**: $\text{advanced} \rightarrow \text{master} = \text{grandmaster}$
  * *Reasoning*: Because the advanced player's limit ($\text{advanced}$) is already below the cap ($\text{master}$), no matter how strong the partner is (even a $\text{grandmaster}$), their joint performance will be limited by the advanced player to $\text{advanced}$ (which is $\le \text{master}$).
* **Example 2**: $\text{master} \rightarrow \text{advanced} = \text{advanced}$
  * *Reasoning*: Because you are a master, if your partner is higher than advanced, your joint performance will exceed the advanced cap. Therefore, your partner can at most be $\text{advanced}$.

---

## 4. How to Run the App

### Prerequisites
* Python 3.11+
* Node.js 18+

### Step 1: Run the Backend
Install the dependencies and run the backend entry script in the repository root using `uv`:
```bash
uv sync
uv run python app/main.py
```
*Note: `uv run python app/main.py` will print the mathematical verification tables of the quantale to console first (proving all verifier checks pass), then launch the FastAPI server on `http://127.0.0.1:8000`.*

### Step 2: Run the Web Client
Navigate to the client directory, install dependencies, and start the Next.js dev server:
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:3000` in your browser to interact with the Quantale Chess Arena UI and console.

---

## 5. Sample Output

Running `uv run python app/main.py` outputs the following mathematical verifications of the Residuated Quantale structure:

```text
============================================================
  Quantale — Chess Skill Demo
============================================================

── Elements ─────────────────────────────────────────────
  Q = {beginner, intermediate, advanced, master, grandmaster}
  ⊥ (bottom) = beginner
  ⊤ (top)    = grandmaster

── Hasse cover edges (a → b means a < b, direct) ────────
  beginner < intermediate
  intermediate < advanced
  advanced < master
  master < grandmaster

── Order queries ────────────────────────────────────────
  beginner ≤ grandmaster  (comparable)
  intermediate ≤ master  (comparable)
  advanced ≤ grandmaster  (comparable)
  master ≰ advanced  (comparable)

── Joins and meets (pairs) ───────────────────────────────
  beginner ⋁ advanced = advanced,   beginner ⋀ advanced = beginner
  intermediate ⋁ master = master,   intermediate ⋀ master = intermediate
  advanced ⋁ grandmaster = grandmaster,   advanced ⋀ grandmaster = advanced
  beginner ⋁ master = master,   beginner ⋀ master = beginner

── Arbitrary joins (complete lattice) ───────────────────
  ⋁['intermediate', 'advanced', 'master'] = master,   ⋀['intermediate', 'advanced', 'master'] = intermediate
  ⋁['beginner', 'intermediate'] = intermediate,   ⋀['beginner', 'intermediate'] = beginner
  ⋁['master', 'grandmaster'] = grandmaster,   ⋀['master', 'grandmaster'] = master
  ⋁['beginner', 'intermediate', 'advanced', 'master', 'grandmaster'] = grandmaster,   ⋀['beginner', 'intermediate', 'advanced', 'master', 'grandmaster'] = beginner

── Monoid (⊗ = weaker skill level) ───────────────────
  closure: True
  associativity: True
  identity: True
  advanced ⊗ beginner = beginner
  master ⊗ advanced = advanced
  grandmaster ⊗ intermediate = intermediate
  advanced ⊗ advanced = advanced

── Quantale properties ──────────────────────────────────
  is_commutative: True
  is_idempotent:  True
  is_integral:    True
  distributivity holds: True

── Residuals (right: a → c) ─────────────────────────────
  advanced → master = grandmaster  (maximum compatible partner level while staying within master)
  intermediate → advanced = grandmaster  (maximum improvement allowed without exceeding advanced)
  master → grandmaster = grandmaster  (maximum training influence while remaining within grandmaster)
  advanced → advanced = grandmaster  (maximum level allowed while staying at advanced)

── Adjunction verification ──────────────────────────────
  a⊗b≤c ⟺ b≤a→c ⟺ a≤c←b holds: True

── High-level API ───────────────────────────────────────
  can_do(master, advanced): True
  can_do(beginner, master): False
  effective skill([intermediate, master]): master
  max allowable improvement(advanced, master): grandmaster
  compose(advanced, beginner): beginner

============================================================
  All checks passed.
============================================================

  Starting Quantale Arena FastAPI Server on http://127.0.0.1:8000
INFO:     Started server process [20540]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```
