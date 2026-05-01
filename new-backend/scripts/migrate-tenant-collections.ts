import 'dotenv/config';
import connectDB from '../src/config/db';
import Tenant from '../src/models/tenant.model';
import { getTenantConnection } from '../src/config/tenant';
import { initializeTenantCollections } from '../src/services/tenant.service';

const run = async () => {
  try {
    await connectDB();

    const tenants = await Tenant.find();
    if (!tenants.length) {
      console.log('No tenants found in the accounts collection.');
      process.exit(0);
    }

    for (const tenant of tenants) {
      console.log(`Initializing collections for tenant ${tenant.tenantId} (${tenant.slug}) in DB ${tenant.dbName}`);
      const connection = getTenantConnection(tenant);
      await initializeTenantCollections(connection);
    }

    console.log('Tenant collection migration complete.');
    process.exit(0);
  } catch (error) {
    console.error('Tenant migration failed:', error);
    process.exit(1);
  }
};

run();
