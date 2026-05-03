from pathlib import Path

from .utils import clean_text


class ResumeParseError(ValueError):
    pass


def extract_text_from_resume(file_path: str) -> str:
    path = Path(file_path)
    suffix = path.suffix.lower()

    if suffix == ".pdf":
        return clean_text(_extract_pdf(path))
    if suffix == ".docx":
        return clean_text(_extract_docx(path))

    raise ResumeParseError("Only PDF and DOCX resume files are supported.")


def _extract_pdf(path: Path) -> str:
    try:
        import pdfplumber
    except ImportError as exc:
        raise ResumeParseError("pdfplumber is required to parse PDF files.") from exc

    with pdfplumber.open(path) as pdf:
        return "\n".join(page.extract_text() or "" for page in pdf.pages)


def _extract_docx(path: Path) -> str:
    try:
        from docx import Document
    except ImportError as exc:
        raise ResumeParseError("python-docx is required to parse DOCX files.") from exc

    document = Document(path)
    return "\n".join(paragraph.text for paragraph in document.paragraphs)
