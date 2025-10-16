ecommerce-backend/
├─ package.json
├─ tsconfig.json
├─ .env.example
├─ Dockerfile
├─ docker-compose.yml
├─ README.md
├─ /src
│  ├─ server.ts                 # entrypoint: connect DB -> start server
│  ├─ app.ts                    # express app (middlewares, routes)
│  ├─ /config
│  │  ├─ db.ts
│  │  ├─ redis.ts
│  │  └─ logger.ts
│  ├─ /routes
│  │  ├─ index.ts
│  │  ├─ auth.routes.ts
│  │  ├─ user.routes.ts
│  │  ├─ product.routes.ts
│  │  ├─ order.routes.ts
│  │  └─ admin.routes.ts
│  ├─ /controllers
│  │  ├─ auth.controller.ts
│  │  ├─ user.controller.ts
│  │  ├─ product.controller.ts
│  │  ├─ order.controller.ts
│  │  └─ payment.controller.ts
│  ├─ /services
│  │  ├─ auth.service.ts
│  │  ├─ product.service.ts
│  │  └─ order.service.ts
│  ├─ /models
│  │  ├─ user.model.ts
│  │  ├─ product.model.ts
│  │  ├─ category.model.ts
│  │  ├─ order.model.ts
│  │  ├─ cart.model.ts
│  │  ├─ coupon.model.ts
│  │  ├─ review.model.ts
│  │  └─ refreshToken.model.ts
│  ├─ /middlewares
│  │  ├─ auth.middleware.ts
│  │  ├─ error.middleware.ts
│  │  ├─ rateLimit.middleware.ts
│  │  ├─ validate.middleware.ts
│  │  └─ upload.middleware.ts
│  ├─ /validators
│  │  └─ auth.validator.ts
│  ├─ /utils
│  │  ├─ asyncHandler.ts
│  │  ├─ paginator.ts
│  │  ├─ s3.ts
│  │  ├─ email.ts
│  │  └─ slugify.ts
│  ├─ /jobs
│  │  ├─ queue.ts
│  │  └─ orderProcessor.ts
│  ├─ /integrations
│  │  └─ stripe.ts
│  ├─ /tests
│  │  ├─ auth.test.ts
│  │  └─ product.test.ts
│  └─ /seeds
│     └─ seedProducts.ts
├─ /infra
│  └─ k8s/ ...
└─ /docs
   └─ api.md





==========================================
<!-- seeds -->
products: 
ts-node-dev src/seeds/seedProducts.ts  
------------------------------------------

create model controller and routes:
npm run make:model -- Form -c -r

