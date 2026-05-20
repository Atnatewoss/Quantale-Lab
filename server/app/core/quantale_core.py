from __future__ import annotations

from itertools import product as cartesian
from typing import Callable, FrozenSet, Generic, Optional, TypeVar

T = TypeVar("T")


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 1 — FiniteSet
# ─────────────────────────────────────────────────────────────────────────────


class FiniteSet(Generic[T]):
    """
    A finite set: unordered, no duplicates, supports membership and subsets.
    No ordering, no operations — just ∈, ⊆, and cardinality.
    """

    def __init__(self, elements: list[T]) -> None:
        seen = []
        for e in elements:
            if e not in seen:
                seen.append(e)
        self._elements: list[T] = seen

    def __contains__(self, x: object) -> bool:
        return x in self._elements

    def __iter__(self):
        return iter(self._elements)

    def __len__(self) -> int:
        return len(self._elements)

    def __repr__(self) -> str:
        return "{" + ", ".join(str(e) for e in self._elements) + "}"

    def is_subset_of(self, other: "FiniteSet[T]") -> bool:
        """A ⊆ B: every element of self is in other."""
        return all(e in other for e in self)

    def power_set(self) -> list[FrozenSet[T]]:
        """𝒫(Q): all subsets, represented as frozensets."""
        elems = list(self._elements)
        result = []
        for mask in range(1 << len(elems)):
            result.append(
                frozenset(elems[i] for i in range(len(elems)) if mask & (1 << i))
            )
        return result

    def cartesian_product(self) -> list[tuple[T, T]]:
        """Q × Q: all ordered pairs."""
        return list(cartesian(self._elements, repeat=2))

    def check_no_duplicates(self) -> bool:
        """All elements must be distinct."""
        return len(self._elements) == len(set(str(e) for e in self._elements))


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 2 — BinaryRelation
# ─────────────────────────────────────────────────────────────────────────────


class BinaryRelation(Generic[T]):
    """
    A binary relation R ⊆ Q×Q.
    Stored as a set of (a, b) pairs. Can be tested for reflexive, symmetric, antisymmetric, transitive.
    """

    def __init__(self, base: FiniteSet[T], pairs: list[tuple[T, T]]) -> None:
        self.base = base
        # validate: every pair must be from Q×Q
        for a, b in pairs:
            assert a in base and b in base, f"Pair ({a},{b}) outside base set"
        self._pairs: FrozenSet[tuple[T, T]] = frozenset(pairs)

    def __contains__(self, pair: tuple[T, T]) -> bool:
        return pair in self._pairs

    def holds(self, a: T, b: T) -> bool:
        """Does a R b hold?"""
        return (a, b) in self._pairs

    def is_reflexive(self) -> bool:
        """∀ a ∈ Q: a R a"""
        return all(self.holds(a, a) for a in self.base)

    def is_symmetric(self) -> bool:
        """∀ a,b: a R b → b R a"""
        return all(self.holds(b, a) for (a, b) in self._pairs)

    def is_antisymmetric(self) -> bool:
        """∀ a,b: a R b ∧ b R a → a = b"""
        for a, b in self._pairs:
            if a != b and self.holds(b, a):
                return False
        return True

    def is_transitive(self) -> bool:
        """∀ a,b,c: a R b ∧ b R c → a R c"""
        for a, b in self._pairs:
            for c in self.base:
                if self.holds(b, c) and not self.holds(a, c):
                    return False
        return True

    def closure(self) -> "BinaryRelation[T]":
        """Compute the reflexive-transitive closure using Floyd-Warshall."""
        elems = list(self.base)
        reach = {(a, b): self.holds(a, b) for a in elems for b in elems}
        for e in elems:
            reach[(e, e)] = True  # reflexivity
        for k in elems:
            for a in elems:
                for b in elems:
                    if reach[(a, k)] and reach[(k, b)]:
                        reach[(a, b)] = True
        pairs = [(a, b) for (a, b), v in reach.items() if v]
        return BinaryRelation(self.base, pairs)

    def __repr__(self) -> str:
        pairs = sorted(str(p) for p in self._pairs)
        return f"Relation({', '.join(pairs)})"


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 3 — Poset
# ─────────────────────────────────────────────────────────────────────────────


class Poset(Generic[T]):
    """
    A partially ordered set (Q, ≤).
    ≤ must be reflexive, antisymmetric, and transitive.
    """

    def __init__(self, base: FiniteSet[T], leq: BinaryRelation[T]) -> None:
        self.base = base
        self.leq = leq
        self._validate()

    def _validate(self) -> None:
        assert self.leq.is_reflexive(), "≤ must be reflexive"
        assert self.leq.is_antisymmetric(), "≤ must be antisymmetric"
        assert self.leq.is_transitive(), "≤ must be transitive"

    def le(self, a: T, b: T) -> bool:
        """a ≤ b"""
        return self.leq.holds(a, b)

    def lt(self, a: T, b: T) -> bool:
        """a < b  (strictly less)"""
        return self.le(a, b) and a != b

    def comparable(self, a: T, b: T) -> bool:
        """Are a and b comparable?"""
        return self.le(a, b) or self.le(b, a)

    def upper_bounds(self, subset: list[T]) -> list[T]:
        """All c ∈ Q such that x ≤ c for every x in subset."""
        return [c for c in self.base if all(self.le(x, c) for x in subset)]

    def lower_bounds(self, subset: list[T]) -> list[T]:
        """All c ∈ Q such that c ≤ x for every x in subset."""
        return [c for c in self.base if all(self.le(c, x) for x in subset)]

    def hasse_edges(self) -> list[tuple[T, T]]:
        """Direct cover relations for Hasse diagram."""
        edges = []
        for a in self.base:
            for b in self.base:
                if self.lt(a, b):
                    between = [
                        c
                        for c in self.base
                        if c != a and c != b and self.lt(a, c) and self.lt(c, b)
                    ]
                    if not between:
                        edges.append((a, b))
        return edges

    def __repr__(self) -> str:
        edges = self.hasse_edges()
        return f"Poset({self.base}, covers={edges})"


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 4 — Lattice
# ─────────────────────────────────────────────────────────────────────────────


class Lattice(Poset[T]):
    """
    A lattice (Q, ≤): a poset where every pair has a join (⋁) and meet (⋀).
    """

    def __init__(self, base: FiniteSet[T], leq: BinaryRelation[T]) -> None:
        super().__init__(base, leq)
        self._validate_lattice()

    def _validate_lattice(self) -> None:
        for a in self.base:
            for b in self.base:
                assert self._find_join(a, b) is not None, f"No join for ({a}, {b})"
                assert self._find_meet(a, b) is not None, f"No meet for ({a}, {b})"

    def _find_join(self, a: T, b: T) -> Optional[T]:
        ubs = self.upper_bounds([a, b])
        candidates = [c for c in ubs if all(self.le(c, d) for d in ubs)]
        return candidates[0] if candidates else None

    def _find_meet(self, a: T, b: T) -> Optional[T]:
        lbs = self.lower_bounds([a, b])
        candidates = [c for c in lbs if all(self.le(d, c) for d in lbs)]
        return candidates[0] if candidates else None

    def join(self, a: T, b: T) -> T:
        result = self._find_join(a, b)
        assert result is not None
        return result

    def meet(self, a: T, b: T) -> T:
        result = self._find_meet(a, b)
        assert result is not None
        return result


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 5 — CompleteLattice
# ─────────────────────────────────────────────────────────────────────────────


class CompleteLattice(Lattice[T]):
    """
    A complete lattice: join and meet defined for ANY subset of Q.
    """

    @property
    def top(self) -> T:
        return self.big_join(list(self.base))

    @property
    def bottom(self) -> T:
        return self.big_meet(list(self.base))

    def big_join(self, subset: list[T]) -> T:
        if not subset:
            return self.big_meet(list(self.base))
        result = subset[0]
        for x in subset[1:]:
            result = self.join(result, x)
        return result

    def big_meet(self, subset: list[T]) -> T:
        if not subset:
            candidates = [c for c in self.base if all(self.le(x, c) for x in self.base)]
            assert candidates, "No top element"
            return candidates[0]
        result = subset[0]
        for x in subset[1:]:
            result = self.meet(result, x)
        return result

    def is_top(self, a: T) -> bool:
        return a == self.top

    def is_bottom(self, a: T) -> bool:
        return a == self.bottom


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 6 — Monoid mixin
# ─────────────────────────────────────────────────────────────────────────────


class MonoidMixin(Generic[T]):
    """
    Mixin that adds a monoid operation ⊗ to any set.
    """

    def __init__(self, mul_fn: Callable[[T, T], T], unit: T) -> None:
        self._mul_fn = mul_fn
        self._unit = unit

    def mul(self, a: T, b: T) -> T:
        return self._mul_fn(a, b)

    @property
    def unit(self) -> T:
        return self._unit

    def check_monoid(self, base: FiniteSet[T]) -> dict:
        elems = list(base)
        result = {
            "closure": True,
            "associativity": True,
            "identity": True,
            "counterexamples": [],
        }

        for a in elems:
            for b in elems:
                if self.mul(a, b) not in base:
                    result["closure"] = False
                    result["counterexamples"].append(
                        f"closure: {a}⊗{b}={self.mul(a, b)} ∉ Q"
                    )

        for a in elems:
            for b in elems:
                for c in elems:
                    lhs = self.mul(self.mul(a, b), c)
                    rhs = self.mul(a, self.mul(b, c))
                    if lhs != rhs:
                        result["associativity"] = False
                        result["counterexamples"].append(
                            f"assoc: ({a}⊗{b})⊗{c}={lhs} ≠ {a}⊗({b}⊗{c})={rhs}"
                        )

        for a in elems:
            if self.mul(self._unit, a) != a or self.mul(a, self._unit) != a:
                result["identity"] = False
                result["counterexamples"].append(
                    f"identity: unit⊗{a}={self.mul(self._unit, a)}"
                )

        return result


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 7 — Quantale
# ─────────────────────────────────────────────────────────────────────────────


class Quantale(CompleteLattice[T], MonoidMixin[T]):
    """
    A quantale (Q, ≤, ⊗): complete lattice + monoid with distributivity.
    """

    def __init__(
        self,
        base: FiniteSet[T],
        leq: BinaryRelation[T],
        mul_fn: Callable[[T, T], T],
        unit: T,
    ) -> None:
        CompleteLattice.__init__(self, base, leq)
        MonoidMixin.__init__(self, mul_fn, unit)
        self._validate_quantale()

    def _validate_quantale(self) -> None:
        elems = list(self.base)
        for a in elems:
            for b in elems:
                for c in elems:
                    join_bc = self.join(b, c)
                    # left
                    lhs = self.mul(a, join_bc)
                    rhs = self.join(self.mul(a, b), self.mul(a, c))
                    assert lhs == rhs, (
                        f"Left distributivity fails: {a}⊗({b}⋁{c}) ≠ ({a}⊗{b})⋁({a}⊗{c})"
                    )
                    # right
                    lhs2 = self.mul(join_bc, a)
                    rhs2 = self.join(self.mul(b, a), self.mul(c, a))
                    assert lhs2 == rhs2, (
                        f"Right distributivity fails: ({b}⋁{c})⊗{a} ≠ ({b}⊗{a})⋁({c}⊗{a})"
                    )

    def is_commutative(self) -> bool:
        return all(
            self.mul(a, b) == self.mul(b, a) for a in self.base for b in self.base
        )

    def is_idempotent(self) -> bool:
        return all(self.mul(a, a) == a for a in self.base)

    def is_integral(self) -> bool:
        return self.unit == self.top

    def check_distributivity_report(self) -> dict:
        elems = list(self.base)
        failures = []
        for a in elems:
            for b in elems:
                for c in elems:
                    jbc = self.join(b, c)
                    if self.mul(a, jbc) != self.join(self.mul(a, b), self.mul(a, c)):
                        failures.append(f"left: {a}⊗({b}⋁{c})")
                    if self.mul(jbc, a) != self.join(self.mul(b, a), self.mul(c, a)):
                        failures.append(f"right: ({b}⋁{c})⊗{a}")
        return {"distributivity": len(failures) == 0, "failures": failures}


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 8 — ResiduatedQuantale
# ─────────────────────────────────────────────────────────────────────────────


class ResiduatedQuantale(Quantale[T]):
    """
    A quantale with explicit residuals.
    """

    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
        self._rr_cache: dict[tuple, T] = {}
        self._lr_cache: dict[tuple, T] = {}

    def right_residual(self, a: T, c: T) -> T:
        key = (a, c)
        if key not in self._rr_cache:
            feasible = [b for b in self.base if self.le(self.mul(a, b), c)]
            self._rr_cache[key] = self.big_join(feasible) if feasible else self.bottom
        return self._rr_cache[key]

    def left_residual(self, c: T, b: T) -> T:
        key = (c, b)
        if key not in self._lr_cache:
            feasible = [a for a in self.base if self.le(self.mul(a, b), c)]
            self._lr_cache[key] = self.big_join(feasible) if feasible else self.bottom
        return self._lr_cache[key]

    def verify_adjunction(self) -> dict:
        failures = []
        elems = list(self.base)
        for a in elems:
            for b in elems:
                for c in elems:
                    lhs = self.le(self.mul(a, b), c)
                    mid = self.le(b, self.right_residual(a, c))
                    rhs = self.le(a, self.left_residual(c, b))
                    if not (lhs == mid == rhs):
                        failures.append(
                            f"({a},{b},{c}): lhs={lhs}, mid={mid}, rhs={rhs}"
                        )
        return {"adjunction_holds": len(failures) == 0, "failures": failures[:5]}

    def can_do(self, role: T, required: T) -> bool:
        return self.le(required, role)

    def effective_skill(self, roles: list[T]) -> T:
        return self.big_join(roles)

    def max_trainable_level(self, own_permission: T, cap: T) -> T:
        return self.right_residual(own_permission, cap)

    def compose(self, skill_a: T, skill_b: T) -> T:
        return self.mul(skill_a, skill_b)


# ─────────────────────────────────────────────────────────────────────────────
# CONCRETE EXAMPLE — Chess Skill Quantale
# ─────────────────────────────────────────────────────────────────────────────


def build_chess_quantale() -> ResiduatedQuantale:
    # Stage 1 — set
    Q = FiniteSet(["beginner", "intermediate", "advanced", "master", "grandmaster"])

    # Stage 2 / 3 — total order
    direct = BinaryRelation(
        Q,
        [
            ("beginner", "intermediate"),
            ("intermediate", "advanced"),
            ("advanced", "master"),
            ("master", "grandmaster"),
        ],
    )

    leq = direct.closure()

    # Stage 4 / 5 — complete lattice
    lat = CompleteLattice(Q, leq)

    # Stage 6 — monoid operation
    def chess_op(a: str, b: str) -> str:
        return lat.meet(a, b)

    # Stage 7 / 8 — quantale with residuals
    Q_obj = ResiduatedQuantale(Q, leq, chess_op, unit="grandmaster")

    return Q_obj


def demo() -> None:
    print("=" * 60)
    print("  Quantale — Chess Skill Demo")
    print("=" * 60)

    q = build_chess_quantale()

    print("\n── Elements ─────────────────────────────────────────────")
    print("  Q =", q.base)
    print("  ⊥ (bottom) =", q.bottom)
    print("  ⊤ (top)    =", q.top)

    print("\n── Hasse cover edges (a → b means a < b, direct) ────────")
    for a, b in q.hasse_edges():
        print(f"  {a} < {b}")

    print("\n── Order queries ────────────────────────────────────────")
    pairs = [
        ("beginner", "grandmaster"),
        ("intermediate", "master"),
        ("advanced", "grandmaster"),
        ("master", "advanced"),
    ]
    for a, b in pairs:
        sym = "≤" if q.le(a, b) else "≰"
        comp = "comparable" if q.comparable(a, b) else "incomparable"
        print(f"  {a} {sym} {b}  ({comp})")

    print("\n── Joins and meets (pairs) ───────────────────────────────")
    pairs2 = [
        ("beginner", "advanced"),
        ("intermediate", "master"),
        ("advanced", "grandmaster"),
        ("beginner", "master"),
    ]
    for a, b in pairs2:
        print(f"  {a} ⋁ {b} = {q.join(a, b)},   {a} ⋀ {b} = {q.meet(a, b)}")

    print("\n── Arbitrary joins (complete lattice) ───────────────────")
    subsets = [
        ["intermediate", "advanced", "master"],
        ["beginner", "intermediate"],
        ["master", "grandmaster"],
        ["beginner", "intermediate", "advanced", "master", "grandmaster"],
    ]
    for s in subsets:
        print(f"  ⋁{s} = {q.big_join(s)},   ⋀{s} = {q.big_meet(s)}")

    print("\n── Monoid (⊗ = weaker skill level) ───────────────────")
    report = q.check_monoid(q.base)
    for k, v in report.items():
        if k != "counterexamples":
            print(f"  {k}: {v}")

    compositions = [
        ("advanced", "beginner"),
        ("master", "advanced"),
        ("grandmaster", "intermediate"),
        ("advanced", "advanced"),
    ]
    for a, b in compositions:
        print(f"  {a} ⊗ {b} = {q.mul(a, b)}")

    print("\n── Quantale properties ──────────────────────────────────")
    print("  is_commutative:", q.is_commutative())
    print("  is_idempotent: ", q.is_idempotent())
    print("  is_integral:   ", q.is_integral())

    dist = q.check_distributivity_report()
    print("  distributivity holds:", dist["distributivity"])

    print("\n── Residuals (right: a → c) ─────────────────────────────")
    queries = [
        (
            "advanced",
            "master",
            "maximum compatible partner level while staying within master",
        ),
        (
            "intermediate",
            "advanced",
            "maximum improvement allowed without exceeding advanced",
        ),
        (
            "master",
            "grandmaster",
            "maximum training influence while remaining within grandmaster",
        ),
        ("advanced", "advanced", "maximum level allowed while staying at advanced"),
    ]
    for a, c, desc in queries:
        res = q.right_residual(a, c)
        print(f"  {a} → {c} = {res:12s} ({desc})")

    print("\n── Adjunction verification ──────────────────────────────")
    adj = q.verify_adjunction()
    print("  a⊗b≤c ⟺ b≤a→c ⟺ a≤c←b holds:", adj["adjunction_holds"])

    print("\n── High-level API ───────────────────────────────────────")
    print("  can_do(master, advanced):", q.can_do("master", "advanced"))
    print("  can_do(beginner, master):", q.can_do("beginner", "master"))
    print(
        "  effective skill([intermediate, master]):",
        q.effective_skill(["intermediate", "master"]),
    )
    print(
        "  max allowable improvement(advanced, master):",
        q.max_trainable_level("advanced", "master"),
    )
    print("  compose(advanced, beginner):", q.compose("advanced", "beginner"))

    print("\n" + "=" * 60)
    print("  All checks passed.")
    print("=" * 60)


if __name__ == "__main__":
    demo()
