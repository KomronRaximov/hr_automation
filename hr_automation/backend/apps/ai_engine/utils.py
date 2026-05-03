import re


def clean_text(text: str) -> str:
    text = text or ""
    text = text.replace("\x00", " ")
    lines = [re.sub(r"\s+", " ", line).strip() for line in text.splitlines()]
    seen = set()
    cleaned_lines = []
    for line in lines:
        key = line.lower()
        if line and key not in seen:
            seen.add(key)
            cleaned_lines.append(line)
    return re.sub(r"\s+", " ", "\n".join(cleaned_lines)).strip()
