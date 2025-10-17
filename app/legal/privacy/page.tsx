"use client"    
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function PrivacyPage() {

    return (
        <div className="min-h-screen bg-white">

            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-sm bg-white/80 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Image src="/images/urbai-logo.png" alt="Urbai" width={120} height={40} className="h-8 w-auto" />
                        </div>
                        <nav className="hidden md:flex space-x-8 ml-auto mr-8">
                            <a href="/#que" className="text-gray-900 hover:text-[#625BF6] font-medium transition-colors">
                                ¿Qué?
                            </a>
                            <a href="/#caracteristicas" className="text-gray-900 hover:text-[#625BF6] font-medium transition-colors">
                                Características
                            </a>
                            <a href="/#libreria" className="text-gray-900 hover:text-[#625BF6] font-medium transition-colors">
                                Librería
                            </a>
                            <a href="/#planes" className="text-gray-900 hover:text-[#625BF6] font-medium transition-colors">
                                Planes
                            </a>
                            <a href="/#faq" className="text-gray-900 hover:text-[#625BF6] font-medium transition-colors">
                                FAQ
                            </a>
                        </nav>
                        <Button
                            className="bg-[#625BF6] hover:bg-[#5048E5] text-white font-medium transition-colors"
                            onClick={() => (window.location.href = "/app")}
                        >
                            Comenzar ahora
                        </Button>
                    </div>
                </div>
            </header>

            {/* Privacy Policy */}
            <section className="py-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <Link href={`/`}>
                            <Button variant="ghost" size="sm" className="h-8 !px-0 hover:bg-transparent hover:text-urbai">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver
                            </Button>
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mt-4">Política de Privacidad</h1>
                    <p className="text-muted-foreground my-4">Fecha de última actualización: 17 de octubre de 2025</p>
                    <p className="text-justify py-2">
                        En <strong>urbai.cl</strong> (en adelante la <strong>"Compañía"</strong>), consideramos la protección de tus datos personales como parte de nuestra propuesta de valor.
                    </p>
                    <p className="text-justify py-2">
                        Por lo anterior, cuidar los datos personales que nos compartes, es una parte fundamental de nuestro compromiso. Por ello, en este documento te explicamos quién es el responsable del tratamiento de tus datos personales, cuál es la finalidad y legitimación con la que los tratamos, a quién podemos comunicarlos, por cuánto tiempo almacenamos tus datos, cómo y por qué los recabamos, de qué manera los utilizamos, y también te explicamos los procesos que hemos dispuesto para proteger tu privacidad y los derechos que te asisten.
                    </p>
                    <p className="text-justify py-2">
                        Esta Política de Privacidad se integra a los Términos y Condiciones de contratación con la Compañía y, en general, de cualquier tipo de relación con la misma. Te invitamos a leer detalladamente nuestra Política de Privacidad y, si tienes alguna pregunta u observación, no dudes en contactarnos al correo electrónico hola@urbai.cl
                    </p>

                    <h2 className="text-2xl font-bold tracking-tight mt-8 mb-4">1. Responsable del tratamiento de tus datos personales</h2>
                    <p className="text-justify py-2">
                        Según la normativa vigente, el responsable del tratamiento de tus datos personales es la persona natural o jurídica, pública o privada, que decide sobre los fines y medios del tratamiento. En este caso, el responsable es la Compañía, con domicilio en Las Condes, Santiago, Chile.
                    </p>

                    <h2 className="text-2xl font-bold tracking-tight mt-8 mb-4">2. Datos recolectados</h2>
                    <p className="text-justify py-2">
                        Para la prestación de nuestros servicios, la Compañía puede recopilar los siguientes datos personales:
                    </p>
                    <ul className="list-disc list-inside py-2">
                        <li>Datos de identificación y contacto: nombre, teléfono (WhatsApp), correo electrónico.</li>
                        <li>Datos de uso: historial de consultas, fechas y contenidos de interacción.</li>
                        <li>Datos técnicos: tipo de dispositivo, IP, sistema operativo y hora de acceso.</li>
                        <li>Datos sensibles opcionales: sólo si el usuario lo autoriza expresamente, por ejemplo, profesional y organización.</li>
                    </ul>

                    <h2 className="text-2xl font-bold tracking-tight mt-8 mb-4">3. Finalidades del tratamiento</h2>
                    <p className="text-justify py-2">
                        Más allá de lo previo, los datos personales que nos compartes, serán utilizados para:
                    </p>
                    <ul className="list-disc list-inside py-2">
                        <li>Registro y acceso al servicio.</li>
                        <li>Entrega de respuestas y soporte personalizado y eficiente.</li>
                        <li>Facturación y gestión de pagos.</li>
                        <li>Mejora continua del servicio: análisis estadístico de uso, encuestas opcionales de satisfacción.</li>
                        <li>Cumplimiento legal (normas tributarias, contables).</li>
                        <li>Marketing y comunicaciones comerciales, sólo si se ha otorgado permiso expreso.</li>
                        <li>Verificación de identidad, mediante herramientas electrónicas o biométricas, si se necesitara validar profesionalidad.</li>
                    </ul>

                    <h2 className="text-2xl font-bold tracking-tight mt-8 mb-4">4. Bases legales</h2>
                    <ul className="list-disc list-inside py-2">
                        <li>Ejecución del contrato: para registro, entrega del servicio y facturación.</li>
                        <li>Consentimiento libre y específico: para comunicaciones comerciales y datos opcionales.</li>
                        <li>Interés legítimo, cuidadosamente ponderado (mejora del servicio, análisis de tendencias).</li>
                        <li>Obligaciones legales: como retención de información financiera.</li>
                    </ul>

                    <h2 className="text-2xl font-bold tracking-tight mt-8 mb-4">5. Transferencia y acceso de terceros</h2>
                    <ul className="list-disc list-inside py-2">
                        <li>No se venden datos personales.</li>
                        <li>Compartimos con proveedores autorizados (hosting, pagos, herramientas externas), todos bajo contratos de confidencialidad como encargados.</li>
                        <li>Si se incluyen datos en comunicaciones comerciales autorizadas, podrían compartirse con aliados comerciales (otras entidades del grupo Urbai), también bajo estrictos acuerdos.</li>
                    </ul>

                    <h2 className="text-2xl font-bold tracking-tight mt-8 mb-4">6. Seguridad de los datos</h2>
                    <p className="text-justify py-2">
                        Implementamos medidas robustas: cifrado TLS, firewalls, acceso restringido, evaluaciones periódicas de seguridad y registro de accesos.
                    </p>

                    <h2 className="text-2xl font-bold tracking-tight mt-8 mb-4">7. Conservación y anonimización</h2>
                    <p className="text-justify py-2">
                        Los datos personales se conservarán durante el tiempo necesario para cumplir con las finalidades para las que fueron recabados, o durante el tiempo necesario para cumplir con una obligación legal.
                    </p>

                    <h2 className="text-2xl font-bold tracking-tight mt-8 mb-4">8. Derechos de los titulares</h2>
                    <p className="text-justify py-2">
                        Puedes ejercer tus derechos a través de hola@urbai.cl.
                    </p>
                    <ul className="list-disc list-inside py-2">
                        <li>Acceder a tus datos.</li>
                        <li>Rectificarlos, actualizarlos o corregirlos.</li>
                        <li>Eliminar o solicitar su supresión.</li>
                        <li>Limitar su uso.</li>
                        <li>Oponerte a su tratamiento.</li>
                        <li>Solicitar portabilidad.</li>
                        <li>Retirar tu consentimiento (sin afectar tratamientos previos).</li>
                    </ul>

                    <h2 className="text-2xl font-bold tracking-tight mt-8 mb-4">9. Perfilamiento y decisiones automatizadas</h2>
                    <ul className="list-disc list-inside py-2">
                        <li>No realizamos decisiones automatizadas que afecten legalmente al usuario sin intervención humana.</li>
                        <li>Cualquier análisis de uso o tendencia se hace en forma agregada o anonimizada.</li>
                    </ul>

                    <h2 className="text-2xl font-bold tracking-tight mt-8 mb-4">10. Menores de edad</h2>
                    <p className="text-justify py-2">
                        Sólo personas mayores de 18 años pueden usar el servicio. No solicitamos conscientemente datos de menores.
                    </p>

                    <h2 className="text-2xl font-bold tracking-tight mt-8 mb-4">11. Cambios en la Política de Privacidad</h2>
                    <p className="text-justify py-2">
                        La Compañía se reserva el derecho de actualizar esta Política de Privacidad en cualquier momento. Te notificaremos de los cambios importantes
                    </p>
                    <ul className="list-disc list-inside py-2">
                        <li>Las actualizaciones se publicarán en urbai.cl.</li>
                        <li>Se indicará visiblemente la “Fecha de última actualización”.</li>
                    </ul>


                </div>
            </section>

        </div>
    )
}