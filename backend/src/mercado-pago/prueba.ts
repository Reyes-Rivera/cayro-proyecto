// import { Controller, Post, Body, Get, Query, Res, UseGuards, Req } from '@nestjs/common';
// import { MercadoPagoService } from './mercado-pago.service';
// import { PagoService } from './pago/pago.service';
// import { Response } from 'express'; // ✅
// import { CreateOrderDto } from './dto/create-order.dto'; // Asegúrate de que este DTO esté definido correctamente
// import { Roles } from 'src/role/role.decorator';
// import { AuthGuard } from 'src/role/guards/authguard/authguard.guard';
// import { RoleGuard } from 'src/role/guards/role/role.guard';

// @Controller('mercado-pago')
// export class MercadoPagoController {
//     constructor(
//         private readonly mpService: MercadoPagoService,
//         private readonly pagoService: PagoService,
//     ) { }

//     @Post('create-order')
//     async createOrder(@Body() orden: CreateOrderDto) {
//         const result = await this.mpService.createOrder(orden);
//         return { id: result.id, init_point: result.init_point };
//     }

//     @Get('success')
//     @Roles('cliente')
//     @UseGuards(AuthGuard, RoleGuard)
//     async success(
//         @Query('payment_id') paymentId: string,
//         @Res() res: Response,
//         @Req() req: any,
//     ) {
//         console.log('📥 Entró al success');
//         console.log('🧾 payment_id:', paymentId);

//         const pago = await this.mpService.obtenerPago(paymentId);
//         console.log('💳 Pago obtenido:', pago.status);

//         if (pago.status === 'approved') {
//             try {
//                 const idReparacion = parseInt(pago.additional_info.items[0].id);
//                 console.log('🔧 Id reparacion obtenido:', idReparacion);

//                 // Registrar pago (opcional, si lo usas)
//                 await this.pagoService.registrarPago({
//                     servicio: pago.additional_info.items[0].title,
//                     total: pago.transaction_amount,
//                     idCliente: req.user?.userId,
//                     fecha: new Date().toISOString().slice(0, 10),
//                     hora: new Date().toTimeString().slice(0, 8),
//                     formaPago: 'Mercado Pago',
//                 });
//                 // console.log('✅ Pago registrado');

//                 // Cambiar estado reparación
//                 await this.pagoService.marcarReparacionComoPagada(idReparacion);
//                 console.log('✅ Estado reparación actualizado');

//             } catch (error) {
//                 console.error('❌ Error al actualizar reparación:', error);
//                 return res.status(500).json({ mensaje: 'Error interno al actualizar reparación' });
//             }

//             return res.redirect('http://localhost:3001/pagarreparacion');
//         }

//         return res.status(400).json({
//             mensaje: '❌ El pago no fue aprobado.',
//             status: pago.status,
//         });
//     }


//     @Get('failure')
//     handleFailure(@Res() res: Response) {
//         res.send('❌ Pago fallido');
//     }

//     @Get('pending')
//     handlePending(@Res() res: Response) {
//         res.send('⏳ Pago pendiente');
//     }

//     @Post('webhook')
//     async webhook(@Query() query, @Body() body) {
//         if (body.type === 'payment') {
//             const paymentId = body.data.id;
//             const pago = await this.mpService.obtenerPago(paymentId);

//             if (pago.status === 'approved') {
//                 // ✅ Aquí marcas la reparación como pagada en la base de datos
//                 console.log(Pago aprobado: reparación ID ${pago.external_reference});
//             }
//         }

//         return { received: true };
//     }
// }


// import { Injectable } from '@nestjs/common';
// import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
// import { CreateOrderDto } from './dto/create-order.dto';

// @Injectable()
// export class MercadoPagoService {
//     private mp = new MercadoPagoConfig({
//         accessToken: 'APP_USR-3031384509086196-060312-fd1bf321e91364839d61d223b5db6d4f-2473231577',
//     });

//     async createOrder(orden: CreateOrderDto) {  // <-- sin parámetro
//         const preference = new Preference(this.mp);

//         // Estructura estática que quieres usar
//         /*const orden = {
//             id: 18,
//             servicio: ["Cambio de aceite", "Chips de fresas"],
//             totalFinal: "1400.00",
//         };*/

//         const result = await preference.create({
//             body: {
//                 items: [
//                     {
//                         id: String(orden.id),
//                         title: orden.servicio.join(", "), // concatenar servicios
//                         quantity: 1,
//                         unit_price: parseFloat(orden.totalFinal),
//                         currency_id: 'MXN',
//                     },
//                 ],
//                 back_urls: {
//                     success: 'https://localhost:3000/mercado-pago/success',
//                     failure: 'https://localhost:3000/mercado-pago/failure',
//                     pending: 'https://localhost:3000/mercado-pago/pending',
//                 },
//                 //notification_url: 'https://867b-200-68-183-172.ngrok-free.app/mercado-pago/webhook',
//             },
//         });

//         return result;
//     }

//     async obtenerPago(paymentId: string) {
//         const payment = new Payment(this.mp);
//         const response = await payment.get({ id: paymentId });
//         return response;
//     }
// }
