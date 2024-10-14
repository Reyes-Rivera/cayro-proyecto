import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function OrdersTab() {
    const orders = [
      { id: '1234', date: '2023-05-01', total: '89.99', status: 'Entregado' },
      { id: '5678', date: '2023-04-15', total: '129.99', status: 'En camino' },
      { id: '9012', date: '2023-03-30', total: '59.99', status: 'Procesando' },
    ]
  
    return (
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle>Pedido #{order.id}</CardTitle>
              <CardDescription>Realizado el {order.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Total: ${order.total}</p>
              <p>Estado: {order.status}</p>
              <Button variant="outline" className="mt-2">Ver detalles</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }