module.exports = {
  apps: [
    {
      name: "prod-app-frontend",
      cwd: "/var/www/billapp/my-product/frontend",
      script: "npx",
      args: "serve -s build -l 3000",
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "prod-app-backend",
      cwd: "/var/www/billapp/my-product/new-backend",
      script: "npm",
      args: "run dev",
      env: {
        NODE_ENV: "development"
      }
    }
  ]
};