import numpy as np


def cosine_similarity_percent(left: list[float], right: list[float]) -> float:
    left_vector = np.asarray(left, dtype=float)
    right_vector = np.asarray(right, dtype=float)

    left_norm = np.linalg.norm(left_vector)
    right_norm = np.linalg.norm(right_vector)
    if left_norm == 0 or right_norm == 0:
        return 0.0

    similarity = float(np.dot(left_vector, right_vector) / (left_norm * right_norm))
    return round(max(0.0, min(1.0, similarity)) * 100, 2)


def build_explanation(score: float) -> str:
    if score >= 80:
        return "Strong semantic match with the job requirements."
    if score >= 60:
        return "Good match, with several relevant resume signals."
    if score >= 40:
        return "Partial match; review the candidate manually."
    return "Low semantic match for the provided job description."
