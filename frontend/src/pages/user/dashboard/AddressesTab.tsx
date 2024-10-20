import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AddressesTab() {
  const addresses = [
    { id: 1, name: 'Casa', street: 'Calle Principal 123', city: 'Madrid', zip: '28001' },
    { id: 2, name: 'Oficina', street: 'Avenida Negocios 456', city: 'Barcelona', zip: '08001' },
  ]

  return (
    <div className="space-y-4">
      {addresses.map((address) => (
        <Card
          key={address.id}
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-md dark:shadow-lg"
        >
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-gray-900 dark:text-white">
              {address.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 dark:text-gray-300">
            <p>{address.street}</p>
            <p>{address.city}, {address.zip}</p>
            <div className="mt-2 space-x-2">
              <Button
                variant="outline"
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Editar
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Eliminar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button className="w-full bg-[#2F93D1] dark:bg-blue-600 hover:bg-blue-500 dark:hover:bg-blue-700 text-white">
        Agregar nueva dirección
      </Button>
    </div>

  )
}