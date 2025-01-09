import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import sudadera from "@/assets/sudadera-removebg-preview.png"
import qr from "@/assets/qr.png"
export default function ProductDetails() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="text-sm mb-8">
                    <Link to="/" className="text-gray-600 hover:text-primary">Inicio</Link>
                    <span className="mx-2">{'>'}</span>
                    <span className="text-gray-900">Detalle producto</span>
                </div>

                {/* Product Section */}
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Product Image and Description */}
                    <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Product Image */}
                        <div className="bg-gray-100 rounded-lg p-4">
                            <img
                                src={sudadera}
                                alt="Sudadera"
                                width={250}
                                height={250}
                                className="mx-auto"
                            />
                        </div>

                        {/* Product Description */}
                        <div className="space-y-6">
                            <h1 className="text-2xl font-bold">Sudadera Good Vibes</h1>
                            <div className="text-2xl font-bold mt-2">$480.00</div>
                            <div className="space-y-4 mt-4">
                                <p className="text-gray-600">
                                    Mantén el estilo y la comodidad con esta sudadera con capucha de color negro, diseñada para transmitir buenas vibras. Presenta un estampado retro con la frase "Good Vibes" en colores vibrantes que destacan sobre el fondo oscuro.
                                </p>
                                <p className="text-gray-600">
                                    Mezcla de algodón suave y duradera para mayor confort, ajuste regular con bolsillo tipo canguro y cordones en la capucha.
                                </p>
                            </div>


                        </div>
                    </div>

                    {/* QR Section */}
                    <div className="flex flex-col justify-center items-center">
                        <div className="border p-4 rounded-lg bg-white shadow-lg">
                            <h3 className="text-center font-bold mb-2">Escanea el QR para más detalles.</h3>
                            <img
                                src={qr}
                                alt="QR Code"
                                className="mx-auto w-32 h-32"
                            />
                        </div>
                        <div className="">
                            {/* Color Selection */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Color:</label>
                                <div className="flex space-x-2">
                                    <button className="w-8 h-8 rounded-full bg-black border-2 border-gray-300 focus:ring-2 focus:ring-primary"></button>
                                    <button className="w-8 h-8 rounded-full bg-blue-500 border-2 border-gray-300 focus:ring-2 focus:ring-primary"></button>
                                    <button className="w-8 h-8 rounded-full bg-red-500 border-2 border-gray-300 focus:ring-2 focus:ring-primary"></button>
                                    <button className="w-8 h-8 rounded-full bg-green-500 border-2 border-gray-300 focus:ring-2 focus:ring-primary"></button>
                                    <button className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-gray-300 focus:ring-2 focus:ring-primary"></button>
                                    <button className="w-8 h-8 rounded-full bg-lime-300 border-2 border-gray-300 focus:ring-2 focus:ring-primary"></button>
                                </div>
                            </div>

                            {/* Size Selection */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Talla:</label>
                                <div className="flex space-x-2">
                                    {['ECH', 'CH', 'M', 'G', 'EG'].map((size) => (
                                        <Button
                                            key={size}
                                            variant="outline"
                                            className="w-12 h-12"
                                        >
                                            {size}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Cantidad:</label>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="number"
                                        min="1"
                                        defaultValue="1"
                                        className="w-20"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-4">
                                <Button className="flex-1">Comprar ahora</Button>
                                <Button variant="outline" className="flex-1">Agregar al carrito</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
