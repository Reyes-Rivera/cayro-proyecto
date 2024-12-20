import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import img from "@/assets/heroimg.png";
import { useNavigate } from "react-router-dom";
import sudadera from "@/assets/sudadera.png";
export default function HomePage() {
  const navigate = useNavigate();
  const handleContact = () => {
    navigate("/contact");
  }
  const handleProductDetails = (i:number) => {
    if(i===0){
      navigate("/product-details");
    };
  }
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="md:flex lg:items-center lg:justify-between">
            <div className="md:w-1/2 w-full">
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl">
                <span className="text-blue-cayro">Uniformes</span> de calidad a tu medida
              </h1>
              <p className="mt-3 sm:max-w-md w-full sm:text-start text-lg text-gray-500 dark:text-gray-300 sm:text-xl md:mt-5 md:max-w-3xl">
                Cayro Uniformes ofrece la mejor selección de uniformes profesionales para todo tipo de industrias. Calidad, comodidad y estilo en cada prenda.
              </p>
              <div className="mt-10 gap-3 flex justify-center lg:justify-start">
                <Button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-cayro hover:bg-blue-500 md:py-4 md:text-lg md:px-10">
                  Ver catálogo
                </Button>
                <Button
                onClick={handleContact}
                variant="outline" className="w-full flex items-center justify-center px-8 py-3 border text-base font-medium rounded-md text-gray-900 dark:text-gray-100 md:py-4 md:text-lg md:px-10">
                  Contactar
                </Button>
              </div>
            </div>
            <div className="md:flex hidden mt-10 lg:mt-0 md:w-1/2">
              <img src={img} alt="Uniformes Cayro" className="rounded-lg object-contain w-full h-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-8">Productos destacados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((product,i) => (
              <Card key={product} className="bg-white dark:bg-gray-700">
                <CardHeader className="h-72">
                  <img
                    src={`${i === 0 ? sudadera: ""}`}
                    alt={`Producto ${product}`}
                    
                    className="rounded-t-lg  w-52 m-auto"
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-gray-900 dark:text-gray-100">
                    {
                      i===0 ? "Sudadera Good Vibes" :`Uniforme Profesional ${product}`
                    }
                  </CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-300">
                    {
                      i===0 ?"Mezcla de algodón suave y duradera para mayor confort, ajuste regular con bolsillo tipo canguro y cordones en la capucha." :"Descripción breve del uniforme y sus características principales."
                    }
                    
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={()=>handleProductDetails(i)}>Ver detalles</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-8 text-center">
            ¿Por qué elegir Cayro Uniformes?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Calidad Premium", description: "Utilizamos los mejores materiales para garantizar la durabilidad y comodidad de nuestros uniformes." },
              { title: "Diseño Personalizado", description: "Ofrecemos servicios de personalización para adaptar los uniformes a las necesidades específicas de tu empresa." },
              { title: "Entrega Rápida", description: "Contamos con un eficiente sistema de producción y distribución para entregar tus pedidos en tiempo récord." }
            ].map((feature, index) => (
              <Card key={index} className="bg-white dark:bg-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-500 dark:text-gray-300">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
