module.exports = {
  apps: [
    {
      name: "bill-app-frontend",
      cwd: "/var/www/billapp/my-product/frontend",
      script: "npx",
      args: "serve -s build -l 3001",
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "bill-app-backend",
      cwd: "/var/www/billapp/my-product/backend",
      script: "npm",
      args: "run dev",
      env: {
        NODE_ENV: "development"
      }
    }
  ]
};