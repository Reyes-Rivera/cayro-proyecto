import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import img from "./assets/rb_8256.png";
export function AddressSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-full h-64 rounded-md overflow-hidden">
          <img
            src={img}
            alt="Imagen de dirección"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="col-span-2 space-y-6">
        <h2 className="text-2xl font-bold  mb-4">Dirección</h2>
        <Input id="address" defaultValue="Calle Principal #123, Ciudad, País" />
        <div className="flex justify-end">
          <Button className="px-4 py-2 bg-blue-600 font-bold text-white  rounded-lg shadow-lg hover:bg-blue-700 transition-all text-lg hover:scale-105 transform ">
            Guardar Dirección
          </Button>
        </div>
      </div>
    </div>
  );
}
