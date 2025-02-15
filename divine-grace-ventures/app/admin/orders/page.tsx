'use client';

import { Card } from '@nextui-org/react';
import Typography from '@mui/material/Typography';

export default function AdminOrdersPage() {
  return (
    <div className="p-4 bg-gradient-to-r from-indigo-900 to-purple-900 min-h-screen text-white">
      <Typography variant="h2" component="h2" gutterBottom>
        Orders
      </Typography>
      <Card css={{ p: '2.5rem' }}>
        <Typography variant="body1">
          This section will display recent orders and allow management of order status.
        </Typography>
      </Card>
    </div>
  );
}
