FROM node:10.19.0

LABEL author="Nguyen Tri, admin@nguyentri.me"

WORKDIR /home/opt/chatbot

ADD / /home/opt/chatbot/

RUN yarn install --non-interactive

CMD ["yarn", "start"]