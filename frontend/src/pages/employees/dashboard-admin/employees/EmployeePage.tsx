"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { User, Sparkles } from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import {
  addEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
  updatePasswordEmployee,
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
      // Validate that passwords match
      if (data.password !== data.confirmPassword) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Las contraseñas no coinciden.",
          confirmButtonColor: "#2563EB",
        });
        return;
      }

      // Validate password requirements if not empty or if it's a new employee
      if ((data.password && !editId) || (data.password && editId)) {
        // Validate no invalid characters in password
        const invalidCharsRegex = /[<>'"`]/;
        if (invalidCharsRegex.test(data.password)) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "La contraseña no puede contener caracteres especiales como < > ' \" `",
            confirmButtonColor: "#2563EB",
          });
          return;
        }

        // Validate all security requirements
        if (!Object.values(passwordChecks).every(Boolean) && data.password) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "La contraseña no cumple con todos los requisitos de seguridad.",
            confirmButtonColor: "#2563EB",
          });
          return;
        }
      }

     
      const submitData = {
        name: data.name,
        surname:data.surname,
        email:data.email,
        phone:data.phone,
        birthdate:data.birthdate,
        gender:data.gender,
        role:data.role
      };
      if (editId !== null) {
        setIsLoading(true);
        const updatedItem = await updateEmployee(editId, submitData);
        if (updatedItem) {
          Swal.fire({
            icon: "success",
            title: "Empleado actualizado",
            text: "El empleado ha sido actualizado exitosamente.",
            confirmButtonColor: "#2563EB",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
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
        setIsLoading(true);
        const newItem = await addEmployee(submitData);
        if (newItem) {
          Swal.fire({
            icon: "success",
            title: "Empleado agregado",
            text: "El empleado ha sido agregado exitosamente.",
            confirmButtonColor: "#2563EB",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Ha ocurrido un error",
        confirmButtonColor: "#2563EB",
      });
    }
  };

  const onPasswordUpdate = async (data: PasswordFormData) => {
    try {
      // Validate that passwords match
      if (data.password !== data.confirmPassword) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Las contraseñas no coinciden.",
          confirmButtonColor: "#2563EB",
        });
        return;
      }

      // Validate password requirements
      if (data.password) {
        // Validate no invalid characters in password
        const invalidCharsRegex = /[<>'"`]/;
        if (invalidCharsRegex.test(data.password)) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "La contraseña no puede contener caracteres especiales como < > ' \" `",
            confirmButtonColor: "#2563EB",
          });
          return;
        }

        // Validate all security requirements
        if (!Object.values(passwordChecks).every(Boolean)) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "La contraseña no cumple con todos los requisitos de seguridad.",
            confirmButtonColor: "#2563EB",
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
        console.log(passwordData);
        const updatedItem = await updatePasswordEmployee(editId, passwordData);
        if (updatedItem) {
          Swal.fire({
            icon: "success",
            title: "Contraseña actualizada",
            text: "La contraseña ha sido actualizada exitosamente.",
            confirmButtonColor: "#2563EB",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          setIsLoading(false);
          setShowPasswordUpdateForm(false);
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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Ha ocurrido un error",
        confirmButtonColor: "#2563EB",
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
    setEditId(employee.id);
    setShowForm(true);
  };

  const handleDelete = async (employee: Employee) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Eliminarás al empleado "${employee.name} ${employee.surname}". Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: document.documentElement.classList.contains("dark")
        ? "#1F2937"
        : "#FFFFFF",
      color: document.documentElement.classList.contains("dark")
        ? "#F3F4F6"
        : "#111827",
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteEmployee(employee.id);
        if (response) {
          setItems((prev) => prev.filter((emp) => emp.id !== employee.id));

          Swal.fire({
            title: "Eliminado",
            text: `El empleado "${employee.name} ${employee.surname}" ha sido eliminado.`,
            icon: "success",
            confirmButtonColor: "#2563EB",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        } else {
          throw new Error("No se pudo eliminar el empleado.");
        }
      } catch (error: any) {
        setIsLoading(false);
        Swal.fire({
          title: "Error",
          text:
            error.response?.data?.message ||
            "Ha ocurrido un error al eliminar el empleado",
          icon: "error",
          confirmButtonColor: "#EF4444",
        });
      }
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const res = await getEmployees();
      setItems(res.data || []);
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
  };

  // Close form
  const closeForm = () => {
    setShowForm(false);
    setShowPasswordUpdateForm(false);
    setEditId(null);
    employeeFormMethods.reset();
    passwordFormMethods.reset();
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

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
    <motion.div
      className="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 md:space-y-8 bg-gray-50 dark:bg-gray-900 w-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 opacity-10 dark:opacity-20 rounded-xl sm:rounded-2xl md:rounded-3xl"></div>
        <div className="relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
              <div className="flex items-start gap-3 sm:gap-5">
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg text-white">
                  <User className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    Gestión de Empleados
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1 sm:mt-2 max-w-2xl">
                    Administra los empleados de tu empresa. Los empleados son
                    esenciales para el funcionamiento de tu negocio.
                  </p>
                </div>
              </div>
              {!showForm && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={openAddForm}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 w-full md:w-auto"
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Nuevo Empleado</span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-blue-500/10 to-blue-700/10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16 dark:from-blue-500/20 dark:to-blue-700/20"></div>
          <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-tr from-blue-400/10 to-blue-600/10 rounded-full -ml-8 sm:-ml-12 -mb-8 sm:-mb-12 dark:from-blue-400/20 dark:to-blue-600/20"></div>
        </div>
      </motion.div>

      {/* Main content: Table or Form */}
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
            refreshData={refreshData}
            openAddForm={openAddForm}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EmployeePage;
