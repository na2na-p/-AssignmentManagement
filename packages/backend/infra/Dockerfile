ARG NODE_VERSION=20.11.0-bookworm

FROM node:${NODE_VERSION} AS builder

RUN corepack enable

WORKDIR /app

COPY --link . /app

RUN --mount=type=cache,target=/root/.local/share/pnpm/store,sharing=locked \
	pnpm i --frozen-lockfile --aggregate-output

ARG NODE_ENV=production

WORKDIR /app/packages/backend
RUN pnpm build

FROM node:${NODE_VERSION}-slim AS backendRunner

ARG UID="991"
ARG GID="991"

RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
	tini \
	&& corepack enable \
	&& groupadd -g "${GID}" app \
	&& useradd -l -u "${UID}" -g "${GID}" -m -d /app app \
	&& find / -type d -path /proc -prune -o -type f -perm /u+s -ignore_readdir_race -exec chmod u-s {} \; \
	&& find / -type d -path /proc -prune -o -type f -perm /g+s -ignore_readdir_race -exec chmod g-s {} \; \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists

USER app
WORKDIR /app

COPY --chown=app:app --from=builder /app/node_modules /app/node_modules
COPY --chown=app:app --from=builder /app/packages/backend/package.json /app/packages/backend/package.json
COPY --chown=app:app --from=builder /app/packages/backend/dist /app/packages/backend/dist

ENV NODE_ENV=production
ENTRYPOINT ["/usr/bin/tini", "--"]
WORKDIR /app/packages/backend
CMD ["pnpm", "start:prod"]
