# Stage 1: Build frontend
FROM node:24-alpine AS frontend-build

WORKDIR /app
COPY RemotePlan.Server/package*.json ./
RUN npm ci
COPY RemotePlan.Server/src ./src
COPY RemotePlan.Server/webpack.config.js RemotePlan.Server/tsconfig.json ./
RUN npm run build

# Stage 2: Build .NET backend
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS dotnet-build

WORKDIR /app
COPY RemotePlan.Server/RemotePlan.Server.csproj .
RUN dotnet restore

COPY RemotePlan.Server/ .
COPY --from=frontend-build /app/wwwroot ./wwwroot

RUN dotnet publish -c Release -o /publish

# Stage 3: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0

WORKDIR /app
COPY --from=dotnet-build /publish .

ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "RemotePlan.Server.dll"]
