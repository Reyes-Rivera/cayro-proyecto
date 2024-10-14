import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PasswordTab() {
    return (
      <form className="space-y-4">
        <div>
          <Label htmlFor="current-password">Contraseña actual</Label>
          <Input id="current-password" type="password" />
        </div>
        <div>
          <Label htmlFor="new-password">Nueva contraseña</Label>
          <Input id="new-password" type="password" />
        </div>
        <div>
          <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
          <Input id="confirm-password" type="password" />
        </div>
        <Button type="submit">Cambiar contraseña</Button>
      </form>
    )
  }