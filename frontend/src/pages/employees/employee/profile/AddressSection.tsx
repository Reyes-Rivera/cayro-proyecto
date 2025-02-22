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
export function AddressSection() {
  const [codigoPostal, setCodigoPostal] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [estado, setEstado] = useState("");
  const [colonias, setColonias] = useState([]);
  // const [calles, setCalles] = useState([]);

  // const handleCodigoPostalChange = (e) => {
  //   setCodigoPostal(e.target.value);
  // };

  const buscarCodigoPostal = async () => {
    try {
      const response = await axios.get(
        `https://api.copomex.com/query/info_cp/${codigoPostal}?token=${process.env.REACT_APP_TOKEN_COPOMEX}`
      );

      const data = response.data;

      if (data.error) {
        alert(data.error_message);
        return;
      }

      setCiudad(data.ciudad);
      setEstado(data.estado);
      setColonias(data.colonias);
      // setCalles(data.calles);
    } catch (error) {
      console.error("Error al buscar el código postal:", error);
    }
  };
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
        <form>
          <Input
            id="cp"
            placeholder="Codigo postal"
            onChange={(e) => setCodigoPostal(e.target.value)}
          />
          <button
            onClick={() => {
              buscarCodigoPostal();
            }}
          >
            Enviar
          </button>

          <Input type="text" value={ciudad} />
          <Input type="text" value={estado} />
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecciona una colonia." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Colonia</SelectLabel>
                {colonias.map((item) => (
                  <SelectItem key={item} value="apple">
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </form>
        <div className="flex justify-end">
          <Button className="px-4 py-2 bg-blue-600 font-bold text-white  rounded-lg shadow-lg hover:bg-blue-700 transition-all text-lg hover:scale-105 transform ">
            Guardar Dirección
          </Button>
        </div>
      </div>
    </div>
  );
}
