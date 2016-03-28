FROM python:2.7

WORKDIR /app

ADD app /app
RUN pip install -r /app/requirements.txt

EXPOSE 8000
EXPOSE 9090

CMD /app/start.sh
