import hashlib
import math
import re
from functools import lru_cache

import numpy as np


MODEL_NAME = "all-MiniLM-L6-v2"
FALLBACK_DIMENSIONS = 384


@lru_cache(maxsize=1)
def _load_model():
    try:
        from sentence_transformers import SentenceTransformer
    except ImportError:
        return None
    return SentenceTransformer(MODEL_NAME)


def generate_embedding(text: str) -> list[float]:
    model = _load_model()
    if model is not None:
        vector = model.encode(text or "", normalize_embeddings=True)
        return np.asarray(vector, dtype=float).tolist()

    return _hash_embedding(text or "")


def _hash_embedding(text: str) -> list[float]:
    tokens = re.findall(r"[a-zA-Z0-9+#.]+", text.lower())
    vector = np.zeros(FALLBACK_DIMENSIONS, dtype=float)

    for token in tokens:
        digest = hashlib.sha256(token.encode("utf-8")).digest()
        index = int.from_bytes(digest[:4], "big") % FALLBACK_DIMENSIONS
        sign = 1 if digest[4] % 2 == 0 else -1
        vector[index] += sign

    norm = math.sqrt(float(np.dot(vector, vector)))
    if norm == 0:
        return vector.tolist()
    return (vector / norm).tolist()
