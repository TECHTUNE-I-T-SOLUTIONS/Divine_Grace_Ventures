'use client';

import { Text, Card } from '@nextui-org/react';

export default function AdminNotificationsPage() {
  return (
    <div className="p-4">
      <Text h2>Notifications</Text>
      <Card css={{ p: "$10" }}>
        <Text>This section will show notifications and allow sending alerts to users.</Text>
      </Card>
    </div>
  );
}
