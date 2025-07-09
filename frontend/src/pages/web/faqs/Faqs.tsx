import React, { useState, useEffect, useRef, memo } from "react";
import {
  motion,
  AnimatePresence,
  useAnimation,
  useInView,
} from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Search,
  XCircle,
  MessageSquare,
  Filter,
  Tag,
  Loader2,
  HelpCircle,
  ChevronRight,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategoriesFaqs, getFaqs } from "@/api/faqs";
import Breadcrumbs from "@/components/web-components/Breadcrumbs";
import Loader from "@/components/web-components/Loader";
import { AlertHelper } from "@/utils/alert.util";

// Types based on database models
export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  categoryId: number;
  createdAt?: string;
  updatedAt?: string;
  category?: {
    id: number;
    name: string;
  };
}

export interface FaqCategory {
  id: number;
  name: string;
}

interface FaqProps {
  title?: string;
  description?: string;
  allowSearch?: boolean;
  allowFiltering?: boolean;
  className?: string;
  itemClassName?: string;
  showCategoryBadges?: boolean;
}

// Animated Section Component
interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
}

const AnimatedSection = memo(
  ({ children, className, id, delay = 0 }: AnimatedSectionProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
    const mainControls = useAnimation();

    useEffect(() => {
      if (isInView) {
        mainControls.start("visible");
      }
    }, [isInView, mainControls]);

    return (
      <motion.section
        id={id}
        ref={ref}
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
          delay: delay,
        }}
        className={className}
      >
        {children}
      </motion.section>
    );
  }
);
AnimatedSection.displayName = "AnimatedSection";

const Faq = ({
  title = "Preguntas Frecuentes",
  description = "Encuentra respuestas a las preguntas más comunes sobre nuestros servicios.",
  allowSearch = true,
  allowFiltering = true,
  className,
  itemClassName,
  showCategoryBadges = true,
}: FaqProps) => {
  // States
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [items, setItems] = useState<FaqItem[]>([]);
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [filteredItems, setFilteredItems] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animateHero, setAnimateHero] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);

  // Simulate page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
      // Activate hero animations after loading screen disappears
      setTimeout(() => {
        setAnimateHero(true);
      }, 100);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Smooth scroll function using requestAnimationFrame
  const scrollToContent = () => {
    const faqSection = document.getElementById("faq-content");
    if (faqSection) {
      const startPosition = window.pageYOffset;
      const targetPosition =
        faqSection.getBoundingClientRect().top + window.pageYOffset - 80; // Added offset for better positioning
      const distance = targetPosition - startPosition;
      const duration = 600; // ms - slightly longer for smoother feel
      let startTime: number | null = null;

      function animation(currentTime: number) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        // Cubic bezier easing for more natural motion
        const easeOutCubic = (t: number): number => {
          return 1 - Math.pow(1 - t, 3);
        };

        window.scrollTo(0, startPosition + distance * easeOutCubic(progress));

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      }

      requestAnimationFrame(animation);
    }
  };

  // Load data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [categoriesResponse, faqsResponse] = await Promise.all([
          getCategoriesFaqs(),
          getFaqs(),
        ]);

        if (categoriesResponse?.data) {
          setCategories(categoriesResponse.data);
        }

        if (faqsResponse?.data) {
          setItems(faqsResponse.data);
          setFilteredItems(faqsResponse.data);
        }
      } catch (error: any) {
        setError(
          "No se pudieron cargar las preguntas frecuentes. Por favor, intenta de nuevo más tarde."
        );
        AlertHelper.error({
          title: "Error al cargar los datos",
          message:
            error.response?.data?.message ||
            "No se pudieron cargar las preguntas frecuentes. Intenta más tarde.",
          animation: "slideIn",
          timer: 4000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter items when search term or category changes
  useEffect(() => {
    let result = items;

    // Filter by search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.question.toLowerCase().includes(lowerSearchTerm) ||
          item.answer.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Filter by category
    if (selectedCategory !== null) {
      result = result.filter((item) => item.categoryId === selectedCategory);
    }

    setFilteredItems(result);
  }, [items, searchTerm, selectedCategory]);

  // Toggle item expansion
  const toggleItem = (id: number) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  // Get category name by ID
  const getCategoryName = (categoryId: number) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "General";
  };

  return (
    <>
      {isPageLoading && <Loader />}
      <div className="min-h-screen mt-5 bg-white dark:bg-gray-900 overflow-x-hidden">
        {/* Hero Section */}
        <div className="relative min-h-screen bg-white dark:bg-gray-900 flex items-center">
          {/* Background decoration - Enhanced */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-blue-50/80 to-transparent dark:from-blue-950/20 dark:to-transparent"></div>
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-70 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-60 blur-3xl"></div>

            {/* Added subtle grid pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]"></div>

            {/* Added decorative circles */}
            <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400 dark:bg-blue-500 rounded-full opacity-20"></div>
            <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-blue-500 dark:bg-blue-400 rounded-full opacity-20"></div>
            <div className="absolute bottom-1/4 right-1/4 w-5 h-5 bg-blue-300 dark:bg-blue-600 rounded-full opacity-20"></div>
          </div>

          <div className="container mx-auto px-6 py-16 relative z-10 max-w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left column - Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={
                  animateHero ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }
                }
                transition={{
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="space-y-8"
              >
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={
                    animateHero ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }
                  }
                  transition={{
                    duration: 0.7,
                    delay: 0.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={
                      animateHero
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.9 }
                    }
                    transition={{
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="mb-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 px-4 py-1.5 border border-blue-100 dark:border-blue-800/30"
                  >
                    <HelpCircle className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      CENTRO DE AYUDA
                    </span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={
                      animateHero
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: -20 }
                    }
                    transition={{
                      duration: 0.7,
                      delay: 0.3,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
                  >
                    {title}{" "}
                    <span className="relative inline-block">
                      <span className="relative z-10 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                        que necesitas saber
                      </span>
                      <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-600/20 -z-10 rounded"></span>
                    </span>
                  </motion.h1>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={animateHero ? { opacity: 1 } : { opacity: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-lg"
                >
                  {description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    animateHero ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{
                    duration: 0.7,
                    delay: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex flex-col sm:flex-row gap-4 mt-8"
                >
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-full transition-all flex items-center justify-center shadow-lg shadow-blue-600/20"
                    onClick={scrollToContent}
                  >
                    <span className="flex items-center">
                      Ver preguntas frecuentes
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{
                          repeat: Infinity,
                          repeatType: "reverse",
                          duration: 1.5,
                          ease: "easeInOut",
                        }}
                      >
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </motion.div>
                    </span>
                  </motion.button>

                  <motion.a
                    href="/contacto"
                    whileHover={{
                      scale: 1.03,
                      borderColor: "rgb(59, 130, 246)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="border border-gray-300 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-500 text-gray-900 dark:text-white font-medium py-3 px-6 rounded-full transition-all flex items-center justify-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Contactar soporte
                  </motion.a>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={animateHero ? { opacity: 1 } : { opacity: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.9,
                  }}
                >
                  <Breadcrumbs />
                </motion.div>
              </motion.div>

              {/* Right column - FAQ Preview */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={
                  animateHero ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }
                }
                transition={{
                  duration: 0.8,
                  delay: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative"
              >
                {/* Main featured FAQ preview */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={
                    animateHero ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }
                  }
                  transition={{
                    duration: 0.7,
                    delay: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative z-20 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 border border-blue-500/20"
                >
                  <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                  <div className="p-8 relative">
                    <div className="flex items-center mb-6">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="ml-auto">
                        <HelpCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      <span className="bg-white/20 rounded-md w-7 h-7 inline-flex items-center justify-center mr-2">
                        <HelpCircle className="w-4 h-4 text-white" />
                      </span>
                      Preguntas Frecuentes
                    </h3>

                    <div className="space-y-4">
                      <motion.div
                        className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/10"
                        whileHover={{
                          y: -2,
                          backgroundColor: "rgba(255, 255, 255, 0.15)",
                          transition: { duration: 0.2 },
                        }}
                      >
                        <div className="flex items-center text-white/80 text-sm mb-1">
                          <HelpCircle className="w-4 h-4 mr-2" />
                          <span className="font-medium">
                            ¿Cómo puedo realizar un pedido?
                          </span>
                        </div>
                        <div className="h-2 w-3/4 bg-white/20 rounded-full"></div>
                      </motion.div>

                      <motion.div
                        className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/10"
                        whileHover={{
                          y: -2,
                          backgroundColor: "rgba(255, 255, 255, 0.15)",
                          transition: { duration: 0.2 },
                        }}
                      >
                        <div className="flex items-center text-white/80 text-sm mb-1">
                          <HelpCircle className="w-4 h-4 mr-2" />
                          <span className="font-medium">
                            ¿Cuáles son los tiempos de entrega?
                          </span>
                        </div>
                        <div className="h-2 w-4/5 bg-white/20 rounded-full"></div>
                      </motion.div>

                      <motion.div
                        className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/10"
                        whileHover={{
                          y: -2,
                          backgroundColor: "rgba(255, 255, 255, 0.15)",
                          transition: { duration: 0.2 },
                        }}
                      >
                        <div className="flex items-center text-white/80 text-sm mb-1">
                          <HelpCircle className="w-4 h-4 mr-2" />
                          <span className="font-medium">
                            ¿Ofrecen descuentos por volumen?
                          </span>
                        </div>
                        <div className="h-2 w-1/2 bg-white/20 rounded-full"></div>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="bg-white text-blue-600 text-center py-2.5 rounded-lg font-medium flex items-center justify-center shadow-md cursor-pointer"
                      >
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Ver más preguntas
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Decorative elements - Enhanced */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-50 z-0"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-50 z-0"></div>

                {/* Floating badges */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={
                    animateHero
                      ? { scale: 1, opacity: 1 }
                      : { scale: 0.8, opacity: 0 }
                  }
                  transition={{
                    duration: 0.5,
                    delay: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute top-4 -right-4 bg-white dark:bg-gray-800 shadow-lg rounded-full px-4 py-2 z-30 border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    <span className="font-bold text-gray-900 dark:text-white text-sm">
                      Respuestas Claras
                    </span>
                  </div>
                </motion.div>

                {/* Added new floating badge */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={
                    animateHero
                      ? { scale: 1, opacity: 1 }
                      : { scale: 0.8, opacity: 0 }
                  }
                  transition={{
                    duration: 0.5,
                    delay: 1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute -bottom-2 -left-4 bg-white dark:bg-gray-800 shadow-lg rounded-full px-4 py-2 z-30 border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="font-bold text-gray-900 dark:text-white text-sm">
                      Soporte 24/7
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* FAQ Content */}
        <AnimatedSection
          id="faq-content"
          className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden"
        >
          {/* Background decoration - Enhanced */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/5 rounded-full"></div>
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500/5 rounded-full"></div>
            <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/5 rounded-full"></div>
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10 max-w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 px-4 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 mb-4 border border-blue-100 dark:border-blue-800/30">
                PREGUNTAS FRECUENTES
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
                Respuestas a tus{" "}
                <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                  dudas
                </span>
              </h2>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "6rem" }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="h-1 bg-gradient-to-r from-blue-600 to-blue-500 mx-auto mt-6 rounded-full"
              ></motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={cn(
                "bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden relative p-8 md:p-10 max-w-full border border-gray-100 dark:border-gray-700",
                className
              )}
            >
              {/* Background decoration */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full"></div>
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/5 rounded-full"></div>
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]"></div>
              </div>

              {/* Search and filters */}
              {(allowSearch || (allowFiltering && categories.length > 0)) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="mb-8 space-y-4 relative z-10 max-w-full"
                >
                  {allowSearch && (
                    <div className="relative">
                      <div
                        className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-opacity ${
                          searchFocused
                            ? "text-blue-600"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        <Search className="h-5 w-5" />
                      </div>
                      <input
                        type="text"
                        placeholder="Buscar preguntas..."
                        className={`pl-10 pr-10 py-3.5 w-full border ${
                          searchFocused
                            ? "border-blue-500 ring-2 ring-blue-500/20"
                            : "border-gray-200 dark:border-gray-600"
                        } rounded-lg outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                      />
                      {searchTerm && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          onClick={clearSearch}
                        >
                          <X className="w-5 h-5" />
                        </motion.button>
                      )}
                    </div>
                  )}

                  {allowFiltering && categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 max-w-full">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Filter className="w-4 h-4 text-blue-600" />
                        <span>Filtrar por:</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(null)}
                        className={cn(
                          "px-3 py-1.5 text-sm rounded-full transition-colors",
                          selectedCategory === null
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium shadow-md shadow-blue-600/20"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
                        )}
                      >
                        Todas
                      </motion.button>
                      {categories.map((category) => (
                        <motion.button
                          key={category.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedCategory(category.id)}
                          className={cn(
                            "px-3 py-1.5 text-sm rounded-full transition-colors",
                            selectedCategory === category.id
                              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium shadow-md shadow-blue-600/20"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
                          )}
                        >
                          {category.name}
                        </motion.button>
                      ))}
                      {(searchTerm || selectedCategory !== null) && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={clearFilters}
                          className="px-3 py-1.5 text-sm rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors ml-auto flex items-center gap-1 border border-red-200 dark:border-red-800/30"
                        >
                          <X className="w-3.5 h-3.5" />
                          Limpiar filtros
                        </motion.button>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Loading state */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-16 max-w-full">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-md mb-4">
                    <Loader2 className="w-12 h-12 animate-spin" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-lg mt-4">
                    Cargando preguntas frecuentes...
                  </p>
                </div>
              )}

              {/* Error state */}
              {error && (
                <div className="text-center py-16 px-4 max-w-full">
                  <div className="inline-flex items-center justify-center p-4 bg-red-100 dark:bg-red-900/30 rounded-full mb-4 border border-red-200 dark:border-red-800/30">
                    <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Algo salió mal
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {error}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-colors shadow-md"
                  >
                    Intentar de nuevo
                  </motion.button>
                </div>
              )}

              {/* FAQ Items */}
              {!isLoading && !error && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="space-y-4 relative z-10 max-w-full"
                >
                  <AnimatePresence>
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          custom={index}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={itemVariants}
                          className={cn(
                            "border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 max-w-full",
                            expandedId === item.id
                              ? "ring-2 ring-blue-500/20"
                              : "",
                            itemClassName
                          )}
                        >
                          <button
                            onClick={() => toggleItem(item.id)}
                            className="w-full text-left px-6 py-5 flex justify-between items-center gap-4"
                          >
                            <div className="flex items-start gap-4">
                              <div
                                className={cn(
                                  "p-3 rounded-full flex-shrink-0 transition-all duration-300",
                                  expandedId === item.id
                                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-600/20"
                                    : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                )}
                              >
                                <HelpCircle className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-900 dark:text-white text-base sm:text-lg">
                                  {item.question}
                                </h3>
                                {showCategoryBadges && item.categoryId && (
                                  <div className="mt-1 flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800/30">
                                      <Tag className="w-3 h-3" />
                                      {getCategoryName(item.categoryId)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              {expandedId === item.id ? (
                                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-2 rounded-full shadow-md shadow-blue-600/20">
                                  <ChevronUp className="w-5 h-5" />
                                </div>
                              ) : (
                                <div className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 p-2 rounded-full border border-gray-200 dark:border-gray-600">
                                  <ChevronDown className="w-5 h-5" />
                                </div>
                              )}
                            </div>
                          </button>

                          <AnimatePresence>
                            {expandedId === item.id && (
                              <motion.div
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={contentVariants}
                                className="overflow-hidden max-w-full"
                              >
                                <div className="px-6 pb-6 pt-0 prose prose-sm dark:prose-invert max-w-none">
                                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-1">
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                      {item.answer}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16 px-4 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 max-w-full"
                      >
                        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full mb-6 shadow-md shadow-blue-600/20">
                          <MessageSquare className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          No se encontraron resultados
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                          {searchTerm
                            ? `No hay preguntas que coincidan con "${searchTerm}"`
                            : selectedCategory !== null
                            ? "No hay preguntas disponibles en esta categoría"
                            : "No hay preguntas frecuentes disponibles"}
                        </p>
                        {(searchTerm || selectedCategory !== null) && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={clearFilters}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-colors shadow-md shadow-blue-600/20"
                          >
                            Ver todas las preguntas
                          </motion.button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </motion.div>
          </div>
        </AnimatedSection>

        {/* CTA Section - Enhanced */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <svg
              className="absolute bottom-0 left-0 w-full h-64 text-white/5"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                opacity=".25"
                fill="currentColor"
              ></path>
              <path
                d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                opacity=".5"
                fill="currentColor"
              ></path>
            </svg>
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

            {/* Added floating particles */}
            <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white rounded-full opacity-20"></div>
            <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-white rounded-full opacity-20"></div>
            <div className="absolute bottom-1/4 right-1/4 w-5 h-5 bg-white rounded-full opacity-20"></div>
            <div className="absolute top-2/4 left-1/3 w-3 h-3 bg-white rounded-full opacity-20"></div>
          </div>

          <div className="container mx-auto px-6 text-center relative z-10 max-w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-3xl md:text-5xl font-bold mb-6"
              >
                ¿No encontraste lo que buscabas?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-blue-100 text-lg max-w-2xl mx-auto mb-10"
              >
                Nuestro equipo de soporte está listo para ayudarte con cualquier
                pregunta adicional que puedas tener.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex flex-col sm:flex-row justify-center gap-4"
              >
                <motion.a
                  href="/contacto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 bg-white text-blue-700 font-bold rounded-full hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Contáctanos ahora
                    <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </motion.span>
                  </span>
                  <span className="absolute inset-0 bg-blue-50 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
                </motion.a>
              </motion.div>

              {/* Floating badges */}
              <div className="mt-12 flex flex-wrap justify-center gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  animate={{
                    y: [0, -8, 0],
                    transition: {
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 3,
                      ease: "easeInOut",
                    },
                  }}
                  className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm font-medium">Respuesta Rápida</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  animate={{
                    y: [0, -8, 0],
                    transition: {
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 3.5,
                      ease: "easeInOut",
                      delay: 0.5,
                    },
                  }}
                  className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-blue-300" />
                  <span className="text-sm font-medium">
                    Información Detallada
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  animate={{
                    y: [0, -8, 0],
                    transition: {
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 4,
                      ease: "easeInOut",
                      delay: 1,
                    },
                  }}
                  className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 flex items-center gap-2"
                >
                  <Clock className="w-5 h-5 text-green-300" />
                  <span className="text-sm font-medium">Soporte 24/7</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default memo(Faq);
