import Swal from "sweetalert2";

// Configuración de animaciones mejoradas
const animations = {
  fadeIn: {
    showClass: {
      popup: "animate__animated animate__fadeInDown animate__faster",
      backdrop: "animate__animated animate__fadeIn animate__faster",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutUp animate__faster",
      backdrop: "animate__animated animate__fadeOut animate__faster",
    },
  },
  slideIn: {
    showClass: {
      popup: "animate__animated animate__slideInRight animate__faster",
    },
    hideClass: {
      popup: "animate__animated animate__slideOutRight animate__faster",
    },
  },
  bounce: {
    showClass: {
      popup: "animate__animated animate__bounceIn animate__faster",
    },
    hideClass: {
      popup: "animate__animated animate__bounceOut animate__faster",
    },
  },
};

// Configuración base mejorada
const baseConfig = {
  toast: true,
  position: "top-end" as const,
  timer: 4000,
  timerProgressBar: true,
  showConfirmButton: false,
  showCloseButton: true,
  customClass: {
    popup: "rounded-2xl shadow-2xl border-0 backdrop-blur-sm",
    title: "text-sm font-semibold",
    content: "text-xs",
    timerProgressBar: "h-1 rounded-full",
    closeButton: "text-gray-400 hover:text-gray-600 transition-colors",
  },
  ...animations.slideIn,
};

// Configuración para modales (no toast)
const modalConfig = {
  toast: false,
  position: "center" as const,
  showConfirmButton: true,
  showCloseButton: true,
  customClass: {
    popup: "rounded-3xl shadow-2xl border-0 backdrop-blur-sm p-8",
    title: "text-xl font-bold mb-2",
    content: "text-base text-gray-600",
    confirmButton:
      "px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105",
    cancelButton:
      "px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105",
  },
  ...animations.bounce,
};

export interface AlertOptions {
  title?: string;
  message: string;
  timer?: number;
  position?:
    | "top"
    | "top-start"
    | "top-end"
    | "center"
    | "center-start"
    | "center-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end";
  animation?: "fadeIn" | "slideIn" | "bounce";
  showProgressBar?: boolean;
  isModal?: boolean;
}

export class AlertHelper {
  // Alerta de éxito mejorada
  static success(options: string | AlertOptions) {
    const config = typeof options === "string" ? { message: options } : options;

    return Swal.fire({
      icon: "success",
      title: config.title || "¡Perfecto!",
      text: config.message,
      background: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)",
      color: "#15803D",
      iconColor: "#22C55E",
      timer: config.timer || baseConfig.timer,
      timerProgressBar: config.showProgressBar !== false,
      ...(config.isModal ? modalConfig : baseConfig),
      // Sobrescribir propiedades específicas después del spread
      position:
        config.position ||
        (config.isModal ? modalConfig.position : baseConfig.position),
      showConfirmButton: config.isModal || false,
      ...(config.animation ? animations[config.animation] : baseConfig),
      customClass: {
        ...(config.isModal ? modalConfig.customClass : baseConfig.customClass),
        timerProgressBar: "bg-green-500 h-1 rounded-full",
        confirmButton: "bg-green-500 hover:bg-green-600 text-white shadow-lg",
      },
    });
  }

  // Alerta de error mejorada
  static error(
    options: string | (AlertOptions & { error?: any; showToast?: boolean })
  ) {
    const config = typeof options === "string" ? { message: options } : options;
    const errorMessage =
      config.error?.response?.data?.message ||
      config.error?.message ||
      config.message ||
      "Ha ocurrido un error inesperado";

    return Swal.fire({
      icon: "error",
      title: config.title || "¡Ups! Algo salió mal",
      text: errorMessage,
      background: "linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)",
      color: "#B91C1C",
      iconColor: "#EF4444",
      timer:
        config.showToast !== false
          ? config.timer || baseConfig.timer
          : undefined,
      timerProgressBar:
        config.showProgressBar !== false && config.showToast !== false,
      ...(config.isModal || config.showToast === false
        ? modalConfig
        : baseConfig),
      // Sobrescribir propiedades específicas después del spread
      position:
        config.position ||
        (config.isModal || config.showToast === false
          ? modalConfig.position
          : baseConfig.position),
      showConfirmButton: config.showToast === false || config.isModal,
      ...(config.animation ? animations[config.animation] : baseConfig),
      customClass: {
        ...(config.isModal || config.showToast === false
          ? modalConfig.customClass
          : baseConfig.customClass),
        timerProgressBar: "bg-red-500 h-1 rounded-full",
        confirmButton: "bg-red-500 hover:bg-red-600 text-white shadow-lg",
      },
    });
  }

  // Alerta de información mejorada
  static info(options: string | AlertOptions) {
    const config = typeof options === "string" ? { message: options } : options;

    return Swal.fire({
      icon: "info",
      title: config.title || "Información",
      text: config.message,
      background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
      color: "#1E40AF",
      iconColor: "#3B82F6",
      timer: config.timer || baseConfig.timer,
      timerProgressBar: config.showProgressBar !== false,
      ...(config.isModal ? modalConfig : baseConfig),
      // Sobrescribir propiedades específicas después del spread
      position:
        config.position ||
        (config.isModal ? modalConfig.position : baseConfig.position),
      showConfirmButton: config.isModal || false,
      ...(config.animation ? animations[config.animation] : baseConfig),
      customClass: {
        ...(config.isModal ? modalConfig.customClass : baseConfig.customClass),
        timerProgressBar: "bg-blue-500 h-1 rounded-full",
        confirmButton: "bg-blue-500 hover:bg-blue-600 text-white shadow-lg",
      },
    });
  }

  // Nueva alerta de advertencia
  static warning(options: string | AlertOptions) {
    const config = typeof options === "string" ? { message: options } : options;

    return Swal.fire({
      icon: "warning",
      title: config.title || "¡Atención!",
      text: config.message,
      background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
      color: "#D97706",
      iconColor: "#F59E0B",
      timer: config.timer || baseConfig.timer,
      timerProgressBar: config.showProgressBar !== false,
      ...(config.isModal ? modalConfig : baseConfig),
      // Sobrescribir propiedades específicas después del spread
      position:
        config.position ||
        (config.isModal ? modalConfig.position : baseConfig.position),
      showConfirmButton: config.isModal || false,
      ...(config.animation ? animations[config.animation] : baseConfig),
      customClass: {
        ...(config.isModal ? modalConfig.customClass : baseConfig.customClass),
        timerProgressBar: "bg-yellow-500 h-1 rounded-full",
        confirmButton: "bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg",
      },
    });
  }

  // Nueva alerta de confirmación
  static async confirm(options: {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: "warning" | "question" | "info";
    animation?: "fadeIn" | "slideIn" | "bounce";
  }) {
    const result = await Swal.fire({
      icon: options.type || "question",
      title: options.title || "¿Estás seguro?",
      text: options.message,
      showCancelButton: true,
      confirmButtonText: options.confirmText || "Sí, continuar",
      cancelButtonText: options.cancelText || "Cancelar",
      background: "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)",
      color: "#334155",
      iconColor: options.type === "warning" ? "#F59E0B" : "#3B82F6",
      reverseButtons: true,
      focusCancel: true,
      ...modalConfig,
      ...(options.animation
        ? animations[options.animation]
        : animations.bounce),
      customClass: {
        ...modalConfig.customClass,
        confirmButton:
          "bg-blue-500 hover:bg-blue-600 text-white shadow-lg mr-3",
        cancelButton: "bg-gray-300 hover:bg-gray-400 text-gray-700 shadow-lg",
      },
    });

    return result.isConfirmed;
  }

  // Alerta de carga/loading
  static loading(message = "Cargando...") {
    return Swal.fire({
      title: message,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      background: "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)",
      color: "#64748B",
      customClass: {
        popup: "rounded-2xl shadow-2xl border-0 backdrop-blur-sm",
        title: "text-lg font-medium",
      },
      ...animations.fadeIn,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  // Cerrar alerta de carga
  static closeLoading() {
    Swal.close();
  }

  // Alerta personalizada
  static custom(config: any) {
    return Swal.fire({
      ...baseConfig,
      ...config,
      customClass: {
        ...baseConfig.customClass,
        ...config.customClass,
      },
    });
  }
}
