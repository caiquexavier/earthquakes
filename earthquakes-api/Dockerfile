# syntax=docker/dockerfile:1

FROM python:3.11-slim

# Create and use a dedicated virtual environment inside the image
ENV VIRTUAL_ENV=/opt/venv
RUN python -m venv $VIRTUAL_ENV \
    && $VIRTUAL_ENV/bin/pip install --upgrade pip
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

WORKDIR /app

# Install dependencies first (better cache use)
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy application code
COPY . /app

EXPOSE 8080

CMD ["uvicorn", "main:application", "--host", "0.0.0.0", "--port", "8080"]


