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
          <Card key={address.id}>
            <CardHeader>
              <CardTitle>{address.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{address.street}</p>
              <p>{address.city}, {address.zip}</p>
              <div className="mt-2 space-x-2">
                <Button variant="outline">Editar</Button>
                <Button variant="outline">Eliminar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        <Button>Agregar nueva dirección</Button>
      </div>
    )
  }