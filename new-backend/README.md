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


--------------------------
update subscription :

npm run subscription:plan:update -- --code monthly --amount 299 --dry-run
npm run subscription:plan:update -- --code monthly --amount 299

Optional flags:
--currency INR
--name "Monthly"
--description "Updated monthly plan"
--duration-months 1
--duration-days 7

--------------------------
## Platform billing administration

Open `/billing-admin` in the frontend to add, edit, delete, or pause plans and
extend a selected tenant's access. The sidebar entry appears only for authorized
users. Ordinary tenant admins (including tenant-assigned `super_admin` roles)
cannot use these platform-wide APIs.

To grant access to a specific existing user, add this server-only setting to
`new-backend/.env`, then restart the backend:

```dotenv
BILLING_ADMIN_USERS=0001:USER_MONGODB_ID
```

Use the exact `tenant.tenantId` and user `_id` returned by login or `GET
/api/v1/users/me`; keep leading zeroes in tenant IDs. Multiple identities are
comma-separated (`0001:USER_ID,0002:OTHER_USER_ID`). An empty/missing setting grants
nobody access. Both the user and their tenant must remain active. Never put this
setting in the frontend environment. Refresh the app after changing it.

Plans have unique immutable codes, INR prices, and weekly/monthly/quarterly/yearly
billing intervals. Duration is derived from the interval. Deleted plans disappear
from sale but remain stored for existing subscriptions, invoices, and gateway
webhooks. Codes cannot be reused after deletion. Price/interval edits apply to
new purchases; existing gateway subscriptions retain their original plan terms.
Default plan seeding now inserts missing records only and preserves edits/deletes.

Extensions add 1–3650 days from the latest of now, the valid paid/trial period end,
and an existing extension. The required reason, operator identity, timestamp,
and resulting expiry are stored on the tenant. Access extensions do not charge
money or change Razorpay renewal dates. They survive payment/webhook updates;
the tenant should refresh their app to load updated access. An extension does
not reactivate an inactive account.

Authenticated API endpoints under `/api/v1/subscriptions/admin`:

- `GET /capabilities` — current user's `{ canManageBilling }`.
- `GET /plans`, `POST /plans`, `PATCH /plans/:code`, `DELETE /plans/:code`.
- `GET /tenants?q=search&page=1` — 20 tenants per page.
- `POST /tenants/:tenantId/extend` — `{ "days": 7, "reason": "Support extension" }`.

All endpoints except the capability check require the server allowlist and an
active database identity. Run focused backend checks with `npm run test:billing-admin`.
