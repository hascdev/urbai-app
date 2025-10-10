import { Button } from '@/components/ui/button'
import Header from '@/components/web/header'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default async function TermsPage() {



    return (
        <div className="min-h-screen bg-white">

            {/* Header */}
            <Header />

            {/* Terms and Conditions */}
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
                    <h1 className="text-3xl font-bold tracking-tight mt-4">Términos y Condiciones</h1>
                    <p className="text-muted-foreground my-4">Fecha de última actualización: 17 de junio de 2025</p>
                    <h2 className="text-2xl font-bold tracking-tight mt-8 mb-4">1. Introducción</h2>
                    <p className="text-justify py-2">
                        Estos Términos y Condiciones (en adelante, los "Términos") constituyen un acuerdo legal vinculante entre usted, ya sea a título personal o representante de una entidad, y urbai.cl ("Urbai", "nosotros" o "nuestro"). Urbai ofrece una plataforma de inteligencia artificial, accesible a través de WhatsApp, para proporcionar asistencia normativa y técnica a profesionales y empresas del área de arquitectura, ingeniería y construcción (los "Servicios"). Los Servicios incluyen nuestro sitio web urbai.cl, el acceso a nuestro agente en WhatsApp, y cualquier interfaz o módulo que diseñemos para interactuar con usted, ya sea en redes sociales, APIs, o formatos similares (colectivamente referidos como los "Canales" o los "Servicios").
                    </p>
                    <p className="text-justify py-2">
                        Algunas funcionalidades específicas podrán estar sujetas a condiciones adicionales que se publicarán en los Servicios o se le comunicarán directamente. Dichas condiciones adicionales se incorporan a estos Términos por referencia. En caso de discrepancia entre estos Términos y cualquier condición adicional, prevalecerán los términos expresamente indicados para esa funcionalidad.
                    </p>
                    <p className="text-justify py-2">
                        Al utilizar los Servicios, lo que incluye interactuar con Urbai a través de los Canales, usted declara que ha leído, comprende y acepta estos Términos y cualquier condición adicional, y que posee la capacidad legal necesaria (incluyendo haber cumplido 18 años) para celebrar este acuerdo. Si no está de acuerdo con estos Términos, le rogamos no utilizar los Servicios.
                    </p>

                    <h2 className="text-2xl font-bold tracking-tight mt-8 mb-4">2. Registro y planes de suscripción</h2>
                    <p className="text-justify py-2">
                        Registro: todos los usuarios deben registrarse y activar su cuenta mediante número de teléfono WhatsApp.
                    </p>
                    <p className="text-justify py-2">
                        Planes disponibles (valores indicados en pesos chilenos al día de la fecha):
                    </p>
                    <table className="w-full border-collapse mt-4 mb-6">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Plan</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Precio</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Consultas incluidas / mes</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Alcance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-900">Starter</td>
                                <td className="px-6 py-4 text-sm text-gray-900">Gratis</td>
                                <td className="px-6 py-4 text-sm text-gray-900">5</td>
                                <td className="px-6 py-4 text-sm text-gray-900">Normativa básica (LGUC, OGUC)</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-900">Basics</td>
                                <td className="px-6 py-4 text-sm text-gray-900">$9.990</td>
                                <td className="px-6 py-4 text-sm text-gray-900">Hasta 100</td>
                                <td className="px-6 py-4 text-sm text-gray-900">Normativa básica (LGUC, OGUC)</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-900">Pro</td>
                                <td className="px-6 py-4 text-sm text-gray-900">$24.990</td>
                                <td className="px-6 py-4 text-sm text-gray-900">Ilimitadas</td>
                                <td className="px-6 py-4 text-sm text-gray-900">Incluye circulares DDU, IPT, soporte prioritario</td>
                            </tr>
                        </tbody>
                    </table>
                    <p className="text-justify py-2">
                        Precios y disponibilidad pueden modificarse; los usuarios serán informados oportunamente.
                    </p>

                    <h2 className="text-2xl font-bold tracking-tight mt-8 mb-4">3. Uso del servicio</h2>
                    <p className="text-justify py-2">
                        Urbai se compromete a proporcionar respuestas precisas y actualizadas basadas en la normativa, pero no reemplaza la asesoría legal o profesional especializada. El usuario debe formular preguntas claras y específicas.
                    </p>

                    <h2 className="text-2xl font-bold tracking-tight mt-8 mb-4">4. Responsabilidad</h2>
                    <p className="text-justify py-2">
                        Urbai no será responsable de decisiones basadas exclusivamente en la información proporcionada. No garantiza exactitud absoluta ni continuidad del servicio ante situaciones de fuerza mayor o errores en la plataforma.
                    </p>

                    <h2 className="text-2xl font-bold tracking-tight mt-8 mb-4">5. Propiedad intelectual</h2>
                    <p className="text-justify py-2">
                        Todos los contenidos generados por Urbai —incluyendo respuestas, diseños, logos, interfaz— son propiedad exclusiva de Urbai y están protegidos por derechos de autor. Queda prohibida su reproducción, distribución o uso no autorizado.
                    </p>

                    <h2 className="text-2xl font-bold tracking-tight mt-8 mb-4">6. Modificación de los términos</h2>
                    <p className="text-justify py-2">
                        Estos términos rigen desde la fecha de contratación y pueden ser modificados por Urbai. Las modificaciones se comunicarán con al menos 30 días de anticipación a través de correo electrónico o por publicación en urbai.cl.
                    </p>

                    <h2 className="text-2xl font-bold tracking-tight mt-8 mb-4">7. Terminación del servicio</h2>
                    <p className="text-justify py-2">
                        El usuario puede cancelar su suscripción en cualquier momento. Urbai se reserva el derecho de suspender o cancelar el servicio por incumplimiento de estos términos, morosidad o actividades fraudulentas.
                    </p>

                    <h2 className="text-2xl font-bold tracking-tight mt-8 mb-4">8. Ley aplicable y jurisdicción</h2>
                    <p className="text-justify py-2">
                        Estos Términos se someten a la legislación chilena. Para cualquier controversia, ambas partes fijan domicilio en Santiago de Chile y se someten a los tribunales ordinarios de dicha jurisdicción.
                    </p>

                    <h2 className="text-2xl font-bold tracking-tight mt-8 mb-4">9. Contacto</h2>
                    <p className="text-justify py-2">
                        Para cualquier consulta o aclaración, puede contactar a hola@urbai.cl.
                    </p>
                    
                    
                </div>
            </section>

        </div>
    )
}