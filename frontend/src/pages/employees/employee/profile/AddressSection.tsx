import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import img from "./assets/rb_8256.png";
import axios from "axios";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
const token = import.meta.env.VITE_REACT_APP_TOKEN_COPOMEX;

export function AddressSection() {
  const [codigoPostal, setCodigoPostal] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [estado, setEstado] = useState("");
  const [colonias, setColonias] = useState([]);
  const [calles, setCalles] = useState([]);
  const [coloniaSeleccionada, setColoniaSeleccionada] = useState("");
  const [calleSeleccionada, setCalleSeleccionada] = useState("");

  const buscarCodigoPostal = async () => {
    try {
      const response = await axios.get(
        `https://api.copomex.com/query/info_cp/${codigoPostal}?token=${token}`
      );

      const data = response.data;
      console.log(data);
      if (data.error) {
        alert(data.error_message);
        return;
      }

      setCiudad(data[0].response.ciudad || "");
      setEstado(data[0].response.estado || "");
      setColonias(data.colonias || []);
      setCalles(data.calles || []);
    } catch (error) {
      console.error("Error al buscar el código postal:", error);
      alert("Hubo un error al buscar el código postal. Inténtalo de nuevo.");
    }
  };
  console.log(ciudad);
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
        <h2 className="text-2xl font-bold mb-4">Dirección</h2>
        <form>
          {/* Input de Código Postal */}
          <div className="flex gap-4">
            <Input
              id="cp"
              placeholder="Código postal"
              value={codigoPostal}
              onChange={(e) => setCodigoPostal(e.target.value)}
            />
            <Button
              type="button"
              onClick={buscarCodigoPostal}
              className="px-4 py-2 bg-blue-600 font-bold text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all text-lg hover:scale-105 transform"
            >
              Buscar
            </Button>
          </div>

          {/* Input de Ciudad */}
          <Input
            type="text"
            placeholder="Ciudad"
            value={ciudad}
            readOnly
            className="mt-4"
          />

          {/* Input de Estado */}
          <Input
            type="text"
            placeholder="Estado"
            value={estado}
            readOnly
            className="mt-4"
          />

          {/* Select de Colonias */}
          <Select onValueChange={(value) => setColoniaSeleccionada(value)}>
            <SelectTrigger className="w-full mt-4">
              <SelectValue placeholder="Selecciona una colonia" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Colonias</SelectLabel>
                {colonias.map((colonia, index) => (
                  <SelectItem key={index} value={colonia}>
                    {colonia}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Select de Calles */}
          <Select onValueChange={(value) => setCalleSeleccionada(value)}>
            <SelectTrigger className="w-full mt-4">
              <SelectValue placeholder="Selecciona una calle" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Calles</SelectLabel>
                {calles.map((calle, index) => (
                  <SelectItem key={index} value={calle}>
                    {calle}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </form>

        {/* Botón para guardar dirección */}
        <div className="flex justify-end">
          <Button
            className="px-4 py-2 bg-blue-600 font-bold text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all text-lg hover:scale-105 transform"
            onClick={() => {
              console.log({
                codigoPostal,
                ciudad,
                estado,
                coloniaSeleccionada,
                calleSeleccionada,
              });
              alert("Dirección guardada correctamente.");
            }}
          >
            Guardar Dirección
          </Button>
        </div>
      </div>
    </div>
  );
}