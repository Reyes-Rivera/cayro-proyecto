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
        <Card
          key={order.id}
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-md dark:shadow-lg"
        >
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-gray-900 dark:text-white">
              Pedido #{order.id}
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Realizado el {order.date}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-gray-700 dark:text-gray-300">
            <p>Total: ${order.total}</p>
            <p>Estado: {order.status}</p>
            <Button
              variant="outline"
              className="mt-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Ver detalles
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>

  )
}