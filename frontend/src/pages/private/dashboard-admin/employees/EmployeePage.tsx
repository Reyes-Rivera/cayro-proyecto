"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { AnimatePresence } from "framer-motion";
import { User, Sparkles, Users } from "lucide-react";

import {
  addEmployee,
  deleteEmployee,
  getEmployees,
  newPasswordEmployee,
  updateEmployee,
} from "@/api/users";
import { useNavigate } from "react-router-dom";
import type {
  Employee,
  EmployeeFormData,
  PasswordFormData,
  SortOption,
} from "./types/employee";
import { sortOptions } from "./constants/employee-constants";
import { containsSequentialPatterns } from "./utils/password-utils";
import EmployeeTable from "./components/employee-table";
import EmployeeForm from "./components/employee-form";
import PasswordUpdateForm from "./components/password-update-form";
import EmployeeDetails from "./components/employee-details";
import { AlertHelper } from "@/utils/alert.util";

const EmployeePage = () => {
  const [items, setItems] = useState<Employee[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    noSequential: false,
    noInvalidChars: false,
  });

  // Estado para ordenación
  const [sortBy, setSortBy] = useState<SortOption>(sortOptions[0]);
  const [showSortOptions, setShowSortOptions] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // State for password update form
  const [showPasswordUpdateForm, setShowPasswordUpdateForm] = useState(false);

  // State for employee details view
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [showDetails, setShowDetails] = useState(false);

  const employeeFormMethods = useForm<EmployeeFormData>();
  const passwordFormMethods = useForm<PasswordFormData>();

  const navigate = useNavigate();

  const newPassword = employeeFormMethods.watch("password", "");
  const passwordUpdateValue = passwordFormMethods.watch("password", "");

  // Validate password when it changes
  useEffect(() => {
    const currentPassword = showPasswordUpdateForm
      ? passwordUpdateValue
      : newPassword;
    if (!currentPassword) {
      setPasswordChecks({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
        noSequential: false,
        noInvalidChars: false,
      });
      setPasswordStrength(0);
      return;
    }

    const invalidCharsRegex = /[<>'"`]/;
    const checks = {
      length: currentPassword.length >= 8,
      uppercase: /[A-Z]/.test(currentPassword),
      lowercase: /[a-z]/.test(currentPassword),
      number: /[0-9]/.test(currentPassword),
      special: /[!@#$%^&*(),.?:{}|[\]\\]/.test(currentPassword),
      noSequential: !containsSequentialPatterns(currentPassword),
      noInvalidChars: !invalidCharsRegex.test(currentPassword),
    };

    setPasswordChecks(checks);

    // Calculate strength (with 7 checks)
    const passedChecks = Object.values(checks).filter(Boolean).length;
    setPasswordStrength(Math.floor((passedChecks / 7) * 100));
  }, [newPassword, passwordUpdateValue, showPasswordUpdateForm]);

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      if (data.password !== data.confirmPassword) {
        AlertHelper.error({
          title: "Error",
          message: "Las contraseñas no coinciden.",
          animation: "fadeIn",
        });
        return;
      }
      if ((data.password && !editId) || (data.password && editId)) {
        // Validate no invalid characters in password
        const invalidCharsRegex = /[<>'"`]/;
        if (invalidCharsRegex.test(data.password)) {
          AlertHelper.error({
            title: "Error",
            message:
              "La contraseña no puede contener caracteres especiales como < > ' \" `",
            animation: "fadeIn",
          });
          return;
        }

        // Validate all security requirements
        if (!Object.values(passwordChecks).every(Boolean) && data.password) {
          AlertHelper.error({
            title: "Error",
            message:
              "La contraseña no cumple con todos los requisitos de seguridad.",
            animation: "fadeIn",
          });
          return;
        }
      }

      // Remove confirmPassword before sending to server
      const submitData = {
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        birthdate: data.birthdate,
        gender: data.gender,
        role: data.role,
        active: String(data.active).toLowerCase() === "true" ? true : false,
      };
      if (editId !== null) {
        setIsLoading(true);
        const updatedItem = await updateEmployee(editId, submitData);
        if (updatedItem) {
          AlertHelper.success({
            title: "Empleado actualizado",
            message: "El empleado ha sido actualizado exitosamente.",
            animation: "slideIn",
          });
          setItems((prev) =>
            prev.map((emp) =>
              emp.id === editId ? { ...emp, ...submitData } : emp
            )
          );
          setIsLoading(false);
          setEditId(null);
          employeeFormMethods.reset();
          setShowForm(false);
          return;
        }
        setIsLoading(false);
        setEditId(null);
      } else {
        const submitDataAdd = {
          name: data.name,
          surname: data.surname,
          email: data.email,
          phone: data.phone,
          birthdate: data.birthdate,
          gender: data.gender,
          role: data.role,
          password: data.password,
          active: String(data.active).toLowerCase() === "true" ? true : false,
        };
        setIsLoading(true);
        const newItem = await addEmployee(submitDataAdd);
        if (newItem) {
          AlertHelper.success({
            title: "Empleado agregado",
            message: "El empleado ha sido agregado exitosamente.",
            animation: "slideIn",
          });
          setItems((prev) => [...prev, { id: prev.length + 1, ...submitData }]);
          setIsLoading(false);
          employeeFormMethods.reset();
          setShowForm(false);
          return;
        }
      }
    } catch (error: any) {
      setIsLoading(false);
      if (error === "Error interno en el servidor.") {
        navigate("/500", { state: { fromError: true } });
        return;
      }
      AlertHelper.error({
        title: "Error",
        error,
        message: "Ha ocurrido un error",
        animation: "fadeIn",
      });
    }
  };

  const onPasswordUpdate = async (data: PasswordFormData) => {
    try {
      // Validate that passwords match
      if (data.password !== data.confirmPassword) {
        AlertHelper.error({
          title: "Error",
          message: "Las contraseñas no coinciden.",
          animation: "fadeIn",
        });
        return;
      }

      // Validate password requirements
      if (data.password) {
        // Validate no invalid characters in password
        const invalidCharsRegex = /[<>'"`]/;
        if (invalidCharsRegex.test(data.password)) {
          AlertHelper.error({
            title: "Error",
            message:
              "La contraseña no puede contener caracteres especiales como < > ' \" `",
            animation: "fadeIn",
          });
          return;
        }

        // Validate all security requirements
        if (!Object.values(passwordChecks).every(Boolean)) {
          AlertHelper.error({
            title: "Error",
            message:
              "La contraseña no cumple con todos los requisitos de seguridad.",
            animation: "fadeIn",
          });
          return;
        }
      }

      if (editId !== null) {
        setIsLoading(true);
        // Only send password to update
        const passwordData = {
          password: data.password,
        };

        const updatedItem = await newPasswordEmployee(editId, passwordData);
        if (updatedItem) {
          AlertHelper.success({
            title: "Contraseña actualizada",
            message: "La contraseña ha sido actualizada exitosamente.",
            animation: "slideIn",
          });
          setIsLoading(false);
          setShowPasswordUpdateForm(false);
          setShowForm(false);
          setShowDetails(false);
          setSelectedEmployee(null);
          setEditId(null);
          passwordFormMethods.reset();
          return;
        }
        setIsLoading(false);
      }
    } catch (error: any) {
      setIsLoading(false);
      if (error === "Error interno en el servidor.") {
        navigate("/500", { state: { fromError: true } });
        return;
      }
      AlertHelper.error({
        title: "Error",
        error,
        message: "Ha ocurrido un error",
        animation: "fadeIn",
      });
    }
  };

  const handleEdit = (employee: Employee) => {
    employeeFormMethods.setValue("name", employee.name);
    employeeFormMethods.setValue("surname", employee.surname);
    employeeFormMethods.setValue("email", employee.email);
    employeeFormMethods.setValue("phone", employee.phone);
    // Format the ISO date string to YYYY-MM-DD for the date input
    const birthdate = employee.birthdate.split("T")[0];
    employeeFormMethods.setValue("birthdate", birthdate);
    employeeFormMethods.setValue("password", ""); // Empty password field when editing
    employeeFormMethods.setValue("confirmPassword", ""); // Empty confirm password field
    employeeFormMethods.setValue("gender", employee.gender);
    employeeFormMethods.setValue("role", employee.role);
    employeeFormMethods.setValue("active", employee.active); // Incluir el campo active
    setEditId(employee.id);
    setShowForm(true);
    setShowDetails(false);
  };

  const handleDelete = async (employee: Employee) => {
    const confirmed = await AlertHelper.confirm({
      title: "¿Estás seguro?",
      message: `Eliminarás al empleado "${employee.name} ${employee.surname}". Esta acción no se puede deshacer.`,
      confirmText: "Sí, eliminar",
      cancelText: "Cancelar",
      type: "warning",
      animation: "bounce",
    });

    if (!confirmed) return;

    try {
      const response = await deleteEmployee(employee.id);
      if (response) {
        setItems((prev) => prev.filter((emp) => emp.id !== employee.id));

        AlertHelper.success({
          title: "Eliminado",
          message: `El empleado "${employee.name} ${employee.surname}" ha sido eliminado.`,
          animation: "slideIn",
        });

        if (
          showDetails &&
          selectedEmployee &&
          selectedEmployee.id === employee.id
        ) {
          setShowDetails(false);
          setSelectedEmployee(null);
        }
      } else {
        throw new Error("No se pudo eliminar el empleado.");
      }
    } catch (error: any) {
      setIsLoading(false);
      AlertHelper.error({
        title: "Error",
        message: "Ha ocurrido un error al eliminar el empleado.",
        error,
        animation: "fadeIn",
      });
    }
  };

  // Handle viewing employee details
  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowDetails(true);
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const res = await getEmployees();
      setItems(res.data || []);
      // If we're viewing details, update the selected employee with fresh data
      if (showDetails && selectedEmployee) {
        const updatedEmployee = res.data.find(
          (emp: Employee) => emp.id === selectedEmployee.id
        );
        if (updatedEmployee) {
          setSelectedEmployee(updatedEmployee);
        }
      }
      setTimeout(() => {
        setIsRefreshing(false);
      }, 600); // Small delay to show animation
    } catch (error) {
      setIsRefreshing(false);
      if (error === "Error interno en el servidor.") {
        navigate("/500", { state: { fromError: true } });
      }
    }
  };

  // Filter and sort employees
  const filteredAndSortedItems = items
    .filter((item) =>
      `${item.name} ${item.surname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy.value as keyof Employee];
      const bValue = b[sortBy.value as keyof Employee];
      if (sortBy.value === "name" || sortBy.value === "surname") {
        return sortBy.direction === "asc"
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      }
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortBy.direction === "asc" ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });

  // Pagination calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSortedItems.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);

  // Open form to add new employee
  const openAddForm = () => {
    setEditId(null);
    employeeFormMethods.reset();
    setShowForm(true);
    setShowDetails(false);
  };

  // Close form
  const closeForm = () => {
    setShowForm(false);
    setShowPasswordUpdateForm(false);
    setEditId(null);
    employeeFormMethods.reset();
    passwordFormMethods.reset();
  };

  // Close details view
  const closeDetails = () => {
    setShowDetails(false);
    setSelectedEmployee(null);
  };

  useEffect(() => {
    const fetchItems = async () => {
      setIsInitialLoading(true);
      try {
        const res = await getEmployees();
        setItems(res.data || []);
      } catch (error) {
        if (error === "Error interno en el servidor.") {
          navigate("/500", { state: { fromError: true } });
        }
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchItems();
  }, [navigate]);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showSortOptions && !target.closest('[data-sort-dropdown="true"]')) {
        setShowSortOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSortOptions]);

  return (
    <div className=" bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header section */}
      <div className="bg-blue-500 rounded-xl shadow-xl overflow-hidden relative mb-6">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-600/20 to-transparent"></div>
        </div>

        <div className="p-4 sm:p-6 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <div className="bg-white/20 p-2.5 sm:p-3 rounded-full mr-3 sm:mr-4">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Gestión de Empleados
                </h2>
                <p className="mt-1 text-white/80 flex items-center text-sm sm:text-base">
                  <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 inline" />
                  {filteredAndSortedItems.length}{" "}
                  {filteredAndSortedItems.length === 1
                    ? "empleado"
                    : "empleados"}{" "}
                  registrados
                </p>
              </div>
            </div>

            {!showForm && !showDetails && (
              <button
                className="w-full sm:w-auto bg-white/20 hover:bg-white/30 transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center"
                onClick={openAddForm}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Nuevo Empleado
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main content: Table, Form, or Details */}
      <AnimatePresence mode="wait">
        {showForm ? (
          showPasswordUpdateForm ? (
            <FormProvider {...passwordFormMethods}>
              <form
                onSubmit={passwordFormMethods.handleSubmit(onPasswordUpdate)}
              >
                <PasswordUpdateForm
                  employee={
                    editId
                      ? items.find((item) => item.id === editId) || null
                      : null
                  }
                  isLoading={isLoading}
                  closeForm={() => setShowPasswordUpdateForm(false)}
                  showPassword={showPassword}
                  showConfirmPassword={showConfirmPassword}
                  setShowPassword={setShowPassword}
                  setShowConfirmPassword={setShowConfirmPassword}
                  passwordStrength={passwordStrength}
                  passwordChecks={passwordChecks}
                />
              </form>
            </FormProvider>
          ) : (
            <FormProvider {...employeeFormMethods}>
              <form onSubmit={employeeFormMethods.handleSubmit(onSubmit)}>
                <EmployeeForm
                  editId={editId}
                  isLoading={isLoading}
                  closeForm={closeForm}
                  setShowPasswordUpdateForm={setShowPasswordUpdateForm}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  showConfirmPassword={showConfirmPassword}
                  setShowConfirmPassword={setShowConfirmPassword}
                  passwordStrength={passwordStrength}
                  passwordChecks={passwordChecks}
                />
              </form>
            </FormProvider>
          )
        ) : showDetails && selectedEmployee ? (
          <EmployeeDetails
            employee={selectedEmployee}
            onBack={closeDetails}
            onEdit={handleEdit}
            onPasswordUpdate={() => {
              setEditId(selectedEmployee.id);
              setShowPasswordUpdateForm(true);
              setShowForm(true);
              setShowDetails(false);
            }}
          />
        ) : (
          <EmployeeTable
            items={items}
            filteredAndSortedItems={filteredAndSortedItems}
            currentItems={currentItems}
            isInitialLoading={isInitialLoading}
            isRefreshing={isRefreshing}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortBy={sortBy}
            setSortBy={setSortBy}
            showSortOptions={showSortOptions}
            setShowSortOptions={setShowSortOptions}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            totalPages={totalPages}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleViewDetails={handleViewDetails}
            refreshData={refreshData}
            openAddForm={openAddForm}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmployeePage;
