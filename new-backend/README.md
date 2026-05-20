ecommerce-backend/
├─ package.json
├─ tsconfig.json
├─ .env.example
├─ Dockerfile
├─ docker-compose.yml
├─ README.md
├─ /src
│ ├─ server.ts # entrypoint: connect DB -> start server
│ ├─ app.ts # express app (middlewares, routes)
│ ├─ /config
│ │ ├─ db.ts
│ │ ├─ redis.ts
│ │ └─ logger.ts
│ ├─ /routes
│ │ ├─ index.ts
│ │ ├─ auth.routes.ts
│ │ ├─ user.routes.ts
│ │ ├─ product.routes.ts
│ │ ├─ order.routes.ts
│ │ └─ admin.routes.ts
│ ├─ /controllers
│ │ ├─ auth.controller.ts
│ │ ├─ user.controller.ts
│ │ ├─ product.controller.ts
│ │ ├─ order.controller.ts
│ │ └─ payment.controller.ts
│ ├─ /services
│ │ ├─ auth.service.ts
│ │ ├─ product.service.ts
│ │ └─ order.service.ts
│ ├─ /models
│ │ ├─ user.model.ts
│ │ ├─ product.model.ts
│ │ ├─ category.model.ts
│ │ ├─ order.model.ts
│ │ ├─ cart.model.ts
│ │ ├─ coupon.model.ts
│ │ ├─ review.model.ts
│ │ └─ refreshToken.model.ts
│ ├─ /middlewares
│ │ ├─ auth.middleware.ts
│ │ ├─ error.middleware.ts
│ │ ├─ rateLimit.middleware.ts
│ │ ├─ validate.middleware.ts
│ │ └─ upload.middleware.ts
│ ├─ /validators
│ │ └─ auth.validator.ts
│ ├─ /utils
│ │ ├─ asyncHandler.ts
│ │ ├─ paginator.ts
│ │ ├─ s3.ts
│ │ ├─ email.ts
│ │ └─ slugify.ts
│ ├─ /jobs
│ │ ├─ queue.ts
│ │ └─ orderProcessor.ts
│ ├─ /integrations
│ │ └─ stripe.ts
│ ├─ /tests
│ │ ├─ auth.test.ts
│ │ └─ product.test.ts
│ └─ /seeds
│ └─ seedProducts.ts
├─ /infra
│ └─ k8s/ ...
└─ /docs
└─ api.md

==========================================

<!-- seeds -->

products:
ts-node-dev src/seeds/seedProducts.ts

---

create model controller and routes:
npm run make:model -- Form -c -r

<!-- for server  -->

pm2 start npm --name "new-backend" -- start

npm run build
pm2 restart new-backend

<!-- mongo  -->

use admin
db.createUser({
user: "admin",
pwd: "StrongPasswordHere",
roles: [
{ role: "userAdminAnyDatabase", db: "admin" },
{ role: "readWriteAnyDatabase", db: "admin" }
]
})

... user: "appuser",
... pwd: "AppPassword123",
... roles: [ { role: "readWrite", db: "mydb" } ]

to dump from server :
mongodump \
 --uri="mongodb://admin:StrongPasswordHere@localhost:27017/ecommerce?authSource=admin" \
 --out ~/dump/ecommerce*$(date +%F*%H-%M)

info:
~/data/db ✅ Your old data
/opt/homebrew/var/mongodb ❌ Empty new DB

------------------------------------------------
register new user:
http://72.62.75.203:4002/api/v1/auth/register

accountName: "",
email: "",
password: "",
name: "",
settings: "
{
"currency": "RS"
}"

----------------------------------------------
db on terminal:
ssh -L 27018:127.0.0.1:27017 root@72.62.75.203



-----------------
mongod --dbpath /opt/homebrew/var/mongodb
