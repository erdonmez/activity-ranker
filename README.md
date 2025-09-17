# Activity Ranker

A well-structured, scalable web application that ranks activities (skiing, surfing, outdoor sightseeing, indoor sightseeing) for the next 7 days based on weather data from Open-Meteo API.

## 🏗️ Architecture Overview

### **Monorepo Structure**

```
activity-ranker/
├── client/              # Next.js frontend (React + TypeScript)
├── server/              # Apollo GraphQL server (Node.js + TypeScript)
│   └── Dockerfile       # Docker configuration for ECS Fargate
├── packages/
│   └── shared/          # Shared TypeScript types and utilities
├── .env.example         # Environment configuration template
```

### **Technical Stack**

- **Frontend**: Next.js, React, Apollo Client, Tailwind CSS
- **Backend**: Apollo Server, Node.js, TypeScript, Zod validation
- **Data Source**: Open-Meteo API (weather + geocoding)
- **Caching**: In-memory server cache + Apollo Client cache
- **Package Manager**: pnpm with workspace support
- **Deployment**: Docker, AWS ECS Fargate, ALB, Amplify (Projected)

## 🎯 Key Technical Decisions

### **1. Monorepo Architecture**

- **Rationale**: Shared types between frontend/backend, unified dependency management
- **Benefits**: Type safety across layers, single source of truth for data models
- **Trade-off**: Slightly more complex setup, but better maintainability

### **2. GraphQL over REST**

- **Rationale**: Type-safe API contracts, efficient data fetching, built-in introspection
- **Benefits**: Frontend gets exactly what it needs, strong typing, great developer experience
- **Implementation**: Apollo Server with standalone server (no Express dependency)

### **3. Serverless-Ready Design**

- **Rationale**: Modern deployment patterns, cost-effective scaling
- **Benefits**: Easy deployment to AWS ECS Fargate, automatic scaling, pay-per-use
- **Implementation**: Dockerized containers, stateless server, environment-based configuration

### **4. Layered Caching Strategy**

- **Server Cache**: 30-minute TTL for external API calls (reduces costs)
- **Client Cache**: Apollo Client automatic query caching (improves UX)
- **Rationale**: Balance between data freshness and performance

### **5. Input Validation & Security**

- **Server**: Zod schema validation with custom error handling
- **Client**: Real-time validation with user-friendly error messages
- **Rationale**: Prevent invalid requests, improve UX, security best practices

## 🚀 Quick Start

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

3. **Start all services:**

   ```bash
   pnpm dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - GraphQL Playground: http://localhost:4000

## 🔧 Run Services Separately

**Backend only:**

```bash
cd server
pnpm install
pnpm build
pnpm dev
```

**Frontend only:**

```bash
cd client
pnpm install
pnpm build
pnpm dev
```

## 🚀 Production Deployment

### **AWS Architecture**

- **Frontend**: AWS Amplify (automatic deployments from Git)
- **Backend**: ECS Fargate with Docker containers
- **Load Balancer**: Application Load Balancer (ALB) for auto-scaling
- **Container Registry**: Amazon ECR for Docker images

### **Deployment Steps (Not Implemented)**

1. **Build Docker images:**

   ```bash
   # Build server image
   docker build -t activity-ranker-server ./server

   # Build client image (if needed)
   docker build -t activity-ranker-client ./client
   ```

2. **Deploy to ECS Fargate:**

   - Push images to ECR
   - Create ECS cluster and service
   - Configure ALB with auto-scaling policies
   - Set up environment variables

3. **Deploy Frontend to Amplify:**
   - Connect GitHub repository
   - Configure build settings
   - Set environment variables
   - Enable automatic deployments

### **Auto-Scaling Configuration**

- **ECS Service**: Min 1, Max 10 tasks based on CPU/Memory
- **ALB**: Health checks and target group management
- **CloudWatch**: Monitoring and alerting

## 🔧 Environment Configuration

### Client (.env.local)

- `NEXT_PUBLIC_API_URL` - GraphQL API endpoint

### Server (.env)

- `PORT` - Server port (default: 4000)
- `NODE_ENV` - Environment mode
- `CACHE_TTL_MS` - Cache TTL in milliseconds (default: 30 minutes)

## 📊 Features Implemented

### **Core Functionality**

- ✅ City-based activity ranking for 7 days
- ✅ Real-time weather data integration
- ✅ Four activity types: Skiing, Surfing, Outdoor/Indoor sightseeing
- ✅ Responsive UI with loading states and error handling

### **Technical Features**

- ✅ Type-safe GraphQL API with validation
- ✅ Multi-layer caching strategy
- ✅ Input validation on both client and server
- ✅ Recent searches with localStorage
- ✅ Color-coded activity scores
- ✅ Environment-based configuration

### **Developer Experience**

- ✅ Monorepo with shared types
- ✅ TypeScript throughout
- ✅ ESLint and Prettier configuration
- ✅ Hot reloading for development

## 🤖 AI Assistance in Development

**Copilot** used for autocompletion and code generation throughout development.

## ⚠️ Omissions & Trade-offs

### **Intentionally Omitted Features:**

1. **Authentication/Authorization**: Not required for MVP, would add complexity
2. **Database Persistence**: In-memory cache sufficient for demo, would add Redis/PostgreSQL
3. **Rate Limiting**: Simple implementation, would add Redis for production
4. **Advanced Caching**: No cache invalidation strategy, would add cache warming
5. **Testing**: No unit/integration tests, would add Jest/Vitest for production
6. **Monitoring**: No logging/monitoring, would add Winston/Sentry for production
7. **CI/CD**: No automated deployment, would add GitHub Actions

### **Shortcuts Taken:**

1. **Hardcoded Scoring Logic**: Activity scoring is placeholder, would implement real weather-based algorithms
2. **Simple Error Handling**: Basic error messages, would add structured error responses
3. **No Data Validation**: External API responses not validated, would add response schemas
4. **Basic UI**: Minimal styling, would add more sophisticated design system

### **How to Fix Shortcuts:**

1. **Implement Real Scoring**: Create weather-based algorithms for each activity type
2. **Add Comprehensive Testing**: Unit tests for business logic, integration tests for API
3. **Production Monitoring**: Add structured logging, error tracking, and performance metrics
4. **Database Integration**: Replace in-memory cache with Redis for scalability
5. **Security Hardening**: Add rate limiting, input sanitization, and CORS configuration

## 🎯 Success Metrics

- **Performance**: <200ms API response time for cached requests
- **Reliability**: 99%+ uptime with proper error handling
- **Maintainability**: Clear separation of concerns, well-documented code
- **Scalability**: Stateless design ready for horizontal scaling
- **User Experience**: Intuitive interface with real-time feedback

## 📝 Next Steps for Production

1. **Add comprehensive testing suite**
2. **Implement real weather-based scoring algorithms**
3. **Add database persistence and advanced caching**
4. **Set up monitoring and logging**
5. **Add CI/CD pipeline for automated deployment**
6. **Implement security best practices**
7. **Add performance optimization and monitoring**
8. **Create Dockerfiles for containerization**
9. **Set up ECS Fargate cluster with auto-scaling**
10. **Configure ALB with health checks and SSL**
11. **Deploy frontend to AWS Amplify**
12. **Set up CloudWatch monitoring and alerts**
