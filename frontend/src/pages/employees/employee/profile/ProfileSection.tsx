import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CameraIcon, SaveIcon, EditIcon, XIcon } from "lucide-react";
import pictureMen from "@/assets/rb_859.png";
import { useAuth } from "@/context/AuthContextType";

export function ProfileSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(pictureMen);
  const {user} = useAuth();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleEditing = () => setIsEditing((prev) => !prev);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 dark:bg-gray-800 dark:text-gray-100">
    {/* Imagen de usuario */}
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-full h-64 rounded-md overflow-hidden">
        <img
          src={profileImage || pictureMen}
          alt="Imagen del usuario"
          className="w-full h-full object-cover"
        />
        <label
          htmlFor="profile-image-upload"
          className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <CameraIcon className="w-5 h-5 text-blue-600 dark:text-blue-300" />
        </label>
        <input
          id="profile-image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>
    </div>
  
    {/* Información del usuario */}
    <div className="col-span-2 space-y-6">
      <h2 className="text-2xl font-bold">Perfil del Usuario</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <Label htmlFor="firstName">
            Nombre
          </Label>
          <Input
            id="firstName"
            defaultValue={user?.name}
            disabled={!isEditing}
            className={`${
              isEditing
                ? "bg-white dark:bg-gray-800 dark:text-gray-100"
                : "bg-gray-100 dark:bg-gray-600 dark:text-white"
            } rounded-md`}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="lastName">
            Apellidos
          </Label>
          <Input
            id="lastName"
            defaultValue={user?.surname}
            disabled={!isEditing}
            className={`${
              isEditing
                ? "bg-white dark:bg-gray-800 dark:text-gray-100"
                : "bg-gray-100 dark:bg-gray-600 dark:text-white"
            }  rounded-md`}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">
            Correo
          </Label>
          <Input
            id="email"
            type="email"
            defaultValue={user?.email}
            disabled={!isEditing}
            className={`${
              isEditing
                ? "bg-white dark:bg-gray-800 dark:text-gray-100"
                : "bg-gray-100 dark:bg-gray-600 dark:text-white"
            }  rounded-md`}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="phone">
            Teléfono
          </Label>
          <Input
            id="phone"
            type="tel"
            defaultValue={user?.phone}
            disabled={!isEditing}
            className={`${
              isEditing
                ? "bg-white dark:bg-gray-800 dark:text-gray-100"
                : "bg-gray-100 dark:bg-gray-600 dark:text-white"
            } rounded-md`}
          />
        </div>
      </div>
  
      <div className="flex gap-4 mt-6 justify-end">
        <Button
          onClick={toggleEditing}
          className={`${
            isEditing
              ? "bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800"
              : "bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600"
          } px-6 py-3 rounded-md text-lg flex items-center gap-2`}
        >
          {isEditing ? <XIcon className="w-5 h-5" /> : <EditIcon className="w-5 h-5" />}
          {isEditing ? "Cancelar" : "Editar"}
        </Button>
        {isEditing && (
          <Button
            className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 flex items-center gap-2"
          >
            <SaveIcon className="w-5 h-5" />
            Guardar Cambios
          </Button>
        )}
      </div>
    </div>
  </div>
  
  );
}
