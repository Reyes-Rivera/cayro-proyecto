export const sortOptions = [
  { label: "Más recientes", value: "id", direction: "desc" },
  { label: "Más antiguos", value: "id", direction: "asc" },
  { label: "Nombre (A-Z)", value: "name", direction: "asc" },
  { label: "Nombre (Z-A)", value: "name", direction: "desc" },
  { label: "Apellido (A-Z)", value: "surname", direction: "asc" },
  { label: "Apellido (Z-A)", value: "surname", direction: "desc" },
] as const;

export const genderOptions = [
  { label: "Masculino", value: "MALE" },
  { label: "Femenino", value: "FEMALE" },
  { label: "Otro", value: "OTHER" },
] as const;

export const roleOptions = [
  { label: "Admin", value: "ADMIN" },
  { label: "Empleado", value: "EMPLOYEE" },
] as const;
