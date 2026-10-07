FROM node:20-slim
RUN npm install -g @autenai/mcp@0.1.1
ENTRYPOINT ["auten-mcp"]
