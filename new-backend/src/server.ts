import 'dotenv/config';
import app from './app';
import connectDB from './config/db';
import { ensureDefaultSubscriptionPlans } from './services/subscription.service';

const PORT = process.env.PORT || 4000;

(async () => {
  await connectDB();
  await ensureDefaultSubscriptionPlans();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
