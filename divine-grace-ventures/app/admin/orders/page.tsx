'use client';

import { Text, Card } from '@nextui-org/react';

export default function AdminOrdersPage() {
  return (
    <div className="p-4">
      <Text h2>Orders</Text>
      <Card css={{ p: "$10" }}>
        <Text>This section will display recent orders and allow management of order status.</Text>
      </Card>
    </div>
  );
}
