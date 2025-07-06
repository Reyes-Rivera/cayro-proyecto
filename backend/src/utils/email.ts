export const createPasswordRecoveryEmail = (
  token,
  companyInfo,
  dataConfig,
  currentYear,
) => {
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recupera tu contraseña de tu cuenta en Cayro</title>
        <!--[if mso]>
        <noscript>
            <xml>
                <o:OfficeDocumentSettings>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
            </xml>
        </noscript>
        <![endif]-->
        <style>
            @media only screen and (max-width: 600px) {
                .mobile-full-width { width: 100% !important; max-width: 100% !important; }
                .mobile-padding { padding: 20px !important; }
                .mobile-header-padding { padding: 30px 20px !important; }
                .mobile-logo { height: 120px !important; }
                .mobile-title { font-size: 24px !important; }
                .mobile-greeting { font-size: 20px !important; }
                .mobile-message { font-size: 15px !important; }
                .mobile-button { font-size: 16px !important; padding: 16px 30px !important; display: block !important; max-width: 280px !important; margin: 0 auto !important; }
                .mobile-info-padding { padding: 20px !important; margin: 20px 0 !important; }
                .mobile-footer-padding { padding: 30px 20px !important; }
                .mobile-company-name { font-size: 16px !important; }
                .mobile-hide-border { border-left: none !important; border-right: none !important; }
            }
            
            @media only screen and (max-width: 480px) {
                .mobile-header-padding { padding: 25px 15px !important; }
                .mobile-padding { padding: 25px 15px !important; }
                .mobile-logo { height: 100px !important; }
                .mobile-title { font-size: 22px !important; }
                .mobile-greeting { font-size: 18px !important; }
                .mobile-button { font-size: 15px !important; padding: 14px 25px !important; }
            }
        </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #374151; background-color: #f3f4f6; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
        
        <!-- Email Wrapper -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6; padding: 20px 0;">
            <tr>
                <td align="center" style="padding: 0;">
                    
                    <!-- Email Container -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="mobile-full-width" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        
                        <!-- Header -->
                        <tr>
                            <td class="mobile-header-padding" style="background-color: #2563eb; color: white; text-align: center; padding: 40px 30px;">
                                <img src="${companyInfo.logoUrl}" alt="Cayro Uniformes" class="mobile-logo" style="height: 180px; width: auto; max-width: 100%; margin-bottom: 20px; filter: brightness(0) invert(1); display: block; margin-left: auto; margin-right: auto;">
                                <h1 class="mobile-title" style="font-size: 28px; font-weight: 700; margin: 0; color: white; letter-spacing: -0.5px;">
                                    ${dataConfig?.title || 'Recuperación Segura'}
                                </h1>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td class="mobile-padding" style="padding: 40px 30px;">
                                
                                <!-- Greeting -->
                                <h2 class="mobile-greeting" style="font-size: 24px; font-weight: 600; color: #1f2937; text-align: center; margin: 0 0 15px 0;">
                                    ${dataConfig?.greeting || '¡Hola!'}
                                </h2>
                                
                                <!-- Message -->
                                <p class="mobile-message" style="font-size: 17px; color: #6b7280; text-align: center; margin: 0 0 30px 0; line-height: 1.6;">
                                    ${dataConfig?.maininstruction || 'Recibimos una solicitud para restablecer la contraseña de tu cuenta. Para continuar de forma segura, haz clic en el botón de abajo.'}
                                </p>
                                
                                <!-- CTA Button -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 30px 0;">
                                    <tr>
                                        <td align="center" style="padding: 0;">
                                            <a href="http://localhost:5173/restaurar-password/${token}" class="mobile-button" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; font-size: 18px; font-weight: 600; padding: 18px 40px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);">
                                                🔐 Restablecer Contraseña
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Warning Box -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 25px 0;">
                                    <tr>
                                        <td style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 20px; text-align: center;">
                                            <p style="color: #92400e; font-size: 14px; font-weight: 500; margin: 0;">
                                                ⏰ ${dataConfig?.expirationtime || 'Este enlace es válido por 10 minutos'}
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Info Card -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 25px 0;">
                                    <tr>
                                        <td class="mobile-info-padding" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 25px;">
                                            
                                            <!-- First Info Section -->
                                            <h3 style="font-size: 16px; font-weight: 600; color: #1f2937; margin: 0 0 10px 0;">¿No solicitaste este cambio?</h3>
                                            <p style="font-size: 14px; color: #6b7280; margin: 0 0 20px 0; line-height: 1.5;">
                                                ${dataConfig?.secondaryinstruction || 'Si no solicitaste restablecer tu contraseña, puedes ignorar este mensaje de forma segura. Tu cuenta permanece protegida.'}
                                            </p>
                                            
                                            <!-- Second Info Section -->
                                            <h3 style="font-size: 16px; font-weight: 600; color: #1f2937; margin: 0 0 10px 0;">¿Problemas con el botón?</h3>
                                            <p style="font-size: 14px; color: #6b7280; margin: 0 0 15px 0;">Copia y pega este enlace en tu navegador:</p>
                                            
                                            <!-- Backup Link -->
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                <tr>
                                                    <td style="background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 6px; padding: 12px; text-align: center;">
                                                        <div style="font-family: 'Courier New', monospace; font-size: 11px; color: #2563eb; word-break: break-all; line-height: 1.4;">
                                                            http://localhost:5173/restaurar-password/${token}
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                            
                                        </td>
                                    </tr>
                                </table>
                                
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td class="mobile-footer-padding" style="background-color: #f8fafc; border-top: 1px solid #e5e7eb; padding: 30px; text-align: center;">
                                <div class="mobile-company-name" style="font-size: 18px; font-weight: 700; color: #2563eb; margin-bottom: 15px;">
                                    ${dataConfig?.finalMessage || 'Cayro Uniformes'}
                                </div>
                                
                                <p style="font-size: 15px; color: #6b7280; margin: 0 0 20px 0; line-height: 1.5;">
                                    ¿Necesitas ayuda? Contáctanos en 
                                    <a href="mailto:${companyInfo.contactInfo[0].email || 'cayrouniformes@gmail.com'}" style="color: #2563eb; text-decoration: none; font-weight: 500;">${companyInfo.contactInfo[0].email || 'cayrouniformes@gmail.com'}</a>
                                </p>
                                
                                <div style="font-size: 13px; color: #9ca3af; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; line-height: 1.4;">
                                    © ${currentYear} Cayro Uniformes. Todos los derechos reservados.
                                    <br>
                                    Este es un mensaje automático, por favor no respondas a este email.
                                </div>
                            </td>
                        </tr>
                        
                    </table>
                    
                </td>
            </tr>
        </table>
        
    </body>
    </html>
  `;
  return html;
};

export const createShippingNotificationEmail = (
  emailData: any,
  companyInfo: any,
  dataConfig: any,
  currentYear: number,
) => {
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tu pedido ha sido enviado - ${emailData.saleReference}</title>
        <!--[if mso]>
        <noscript>
            <xml>
                <o:OfficeDocumentSettings>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
            </xml>
        </noscript>
        <![endif]-->
        <style>
            @media only screen and (max-width: 600px) {
                .mobile-full-width { width: 100% !important; max-width: 100% !important; }
                .mobile-padding { padding: 20px !important; }
                .mobile-header-padding { padding: 30px 20px !important; }
                .mobile-logo { height: 120px !important; }
                .mobile-title { font-size: 24px !important; }
                .mobile-subtitle { font-size: 16px !important; }
                .mobile-greeting { font-size: 22px !important; }
                .mobile-message { font-size: 16px !important; }
                .mobile-tracking-number { font-size: 20px !important; padding: 15px !important; }
                .mobile-stack { display: block !important; width: 100% !important; }
                .mobile-stack-item { width: 100% !important; display: block !important; margin-bottom: 10px !important; }
                .mobile-product-stack { display: block !important; text-align: left !important; }
                .mobile-product-quantity { margin: 10px 0 !important; text-align: left !important; }
                .mobile-product-price { text-align: right !important; margin-top: 10px !important; }
                .mobile-hide-border { border-left: none !important; border-right: none !important; }
            }
        </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #374151; background-color: #f3f4f6; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
        
        <!-- Email Wrapper -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6; padding: 20px 0;">
            <tr>
                <td align="center" style="padding: 0;">
                    
                    <!-- Email Container -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="mobile-full-width" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        
                        <!-- Header -->
                        <tr>
                            <td class="mobile-header-padding" style="background-color: #2563eb; color: white; text-align: center; padding: 40px 30px;">
                                <img src="${companyInfo.logoUrl}" alt="Cayro Uniformes" class="mobile-logo" style="height: 180px; width: auto; max-width: 100%; margin-bottom: 20px; filter: brightness(0) invert(1); display: block; margin-left: auto; margin-right: auto;">
                                <h1 class="mobile-title" style="font-size: 28px; font-weight: 700; margin: 0 0 10px 0; color: white;">¡Tu pedido está en camino!</h1>
                                <p class="mobile-subtitle" style="font-size: 18px; font-weight: 400; margin: 0; color: rgba(255, 255, 255, 0.9);">Pedido #${emailData.saleReference}</p>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td class="mobile-padding" style="padding: 40px 30px;">
                                
                                <!-- Greeting -->
                                <h2 class="mobile-greeting" style="font-size: 24px; font-weight: 600; color: #2563eb; text-align: center; margin: 0 0 15px 0;">¡Hola ${emailData.customerName}!</h2>
                                
                                <!-- Message -->
                                <p class="mobile-message" style="font-size: 17px; color: #6b7280; text-align: center; margin: 0 0 30px 0; line-height: 1.6;">
                                    Nos complace informarte que tu pedido ha sido enviado y está en camino hacia ti. 
                                    Aquí tienes toda la información de seguimiento para que puedas rastrear tu paquete.
                                </p>
                                
                                <!-- Tracking Card -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 25px 0;">
                                    <tr>
                                        <td style="background-color: #dbeafe; border: 2px solid #2563eb; border-radius: 8px; padding: 25px; text-align: center;">
                                            <h3 style="font-size: 20px; font-weight: 700; color: #2563eb; margin: 0 0 15px 0;">📦 Información de Seguimiento</h3>
                                            <div class="mobile-tracking-number" style="font-size: 24px; font-weight: 800; color: #2563eb; font-family: 'Courier New', monospace; background: white; padding: 18px 20px; border-radius: 6px; margin: 15px 0; letter-spacing: 1px; border: 1px solid #93c5fd; word-break: break-all;">${emailData.trackingNumber}</div>
                                            <div style="font-size: 16px; font-weight: 600; color: #374151; margin-top: 10px;">Enviado por: <strong>${emailData.shippingCompany}</strong></div>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Order Summary -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 25px 0;">
                                    <tr>
                                        <td style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 25px;">
                                            <h3 style="font-size: 18px; font-weight: 600; color: #2563eb; margin: 0 0 20px 0; text-align: center;">📋 Resumen del Pedido</h3>
                                            
                                            <!-- Order Info - Mobile Optimized -->
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="mobile-stack">
                                                <tr class="mobile-stack">
                                                    <td class="mobile-stack-item" style="width: 50%; padding-right: 5px; vertical-align: top;">
                                                        <div style="background: white; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; margin-bottom: 10px;">
                                                            <div style="font-size: 14px; font-weight: 500; color: #6b7280; margin-bottom: 5px;">Pedido:</div>
                                                            <div style="font-size: 16px; font-weight: 600; color: #2563eb;">#${emailData.saleReference}</div>
                                                        </div>
                                                    </td>
                                                    <td class="mobile-stack-item" style="width: 50%; padding-left: 5px; vertical-align: top;">
                                                        <div style="background: white; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; margin-bottom: 10px;">
                                                            <div style="font-size: 14px; font-weight: 500; color: #6b7280; margin-bottom: 5px;">Fecha del pedido:</div>
                                                            <div style="font-size: 16px; font-weight: 600; color: #2563eb;">${emailData.orderDate}</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr class="mobile-stack">
                                                    <td class="mobile-stack-item" style="width: 50%; padding-right: 5px; vertical-align: top;">
                                                        <div style="background: white; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; margin-bottom: 10px;">
                                                            <div style="font-size: 14px; font-weight: 500; color: #6b7280; margin-bottom: 5px;">Fecha de envío:</div>
                                                            <div style="font-size: 16px; font-weight: 600; color: #2563eb;">${emailData.shippedDate}</div>
                                                        </div>
                                                    </td>
                                                    <td class="mobile-stack-item" style="width: 50%; padding-left: 5px; vertical-align: top;">
                                                        <div style="background: white; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; margin-bottom: 10px;">
                                                            <div style="font-size: 14px; font-weight: 500; color: #6b7280; margin-bottom: 5px;">Total de artículos:</div>
                                                            <div style="font-size: 16px; font-weight: 600; color: #2563eb;">${emailData.totalItems}</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Products Section -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 25px 0;">
                                    <tr>
                                        <td>
                                            <h3 style="font-size: 18px; font-weight: 600; color: #2563eb; margin: 0 0 20px 0; text-align: center;">🛍️ Productos Enviados</h3>
                                            
                                            ${emailData.products
                                              .map(
                                                (product) => `
                                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 15px;">
                                                    <tr>
                                                        <td style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #ffffff;">
                                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="mobile-product-stack">
                                                                <tr class="mobile-product-stack">
                                                                    <td class="mobile-product-stack" style="vertical-align: top; width: 60%;">
                                                                        <div style="font-weight: 600; color: #1f2937; margin-bottom: 8px; font-size: 16px;">${product.name}</div>
                                                                        <div style="font-size: 14px; color: #6b7280; line-height: 1.4;">
                                                                            Color: ${product.color}<br>
                                                                            Talla: ${product.size}<br>
                                                                            Código: ${product.barcode}
                                                                        </div>
                                                                    </td>
                                                                    <td class="mobile-product-quantity" style="text-align: center; vertical-align: middle; width: 20%;">
                                                                        <div style="font-weight: 600; color: #374151; background: #eff6ff; padding: 8px 12px; border-radius: 6px; border: 1px solid #bfdbfe; font-size: 14px; white-space: nowrap;">Cant: ${product.quantity}</div>
                                                                    </td>
                                                                    <td class="mobile-product-price" style="text-align: right; vertical-align: middle; width: 20%;">
                                                                        <div style="font-weight: 700; color: #2563eb; font-size: 16px; white-space: nowrap;">${product.totalPriceFormatted}</div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            `,
                                              )
                                              .join('')}
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Shipping Address -->
                                ${
                                  emailData.shippingAddress
                                    ? `
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 25px 0;">
                                    <tr>
                                        <td style="background-color: #fef3ff; border: 1px solid #d8b4fe; border-radius: 8px; padding: 25px;">
                                            <h3 style="font-size: 16px; font-weight: 600; color: #7c3aed; margin: 0 0 15px 0;">🏠 Dirección de Entrega</h3>
                                            <div style="font-size: 15px; color: #374151; line-height: 1.6;">
                                                <strong>${emailData.customerName}</strong><br>
                                                ${emailData.shippingAddress.fullAddress}<br>
                                                ${emailData.references !== 'Sin referencias' ? `Referencias: ${emailData.references}<br>` : ''}
                                                ${
                                                  emailData.betweenStreets
                                                    .streetOne &&
                                                  emailData.betweenStreets
                                                    .streetTwo
                                                    ? `Entre: ${emailData.betweenStreets.streetOne} y ${emailData.betweenStreets.streetTwo}<br>`
                                                    : ''
                                                }
                                                Teléfono: ${emailData.customerPhone}
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                                `
                                    : ''
                                }
                                
                                <!-- Total Section -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 25px 0;">
                                    <tr>
                                        <td style="background-color: #eff6ff; border: 2px solid #2563eb; border-radius: 8px; padding: 25px;">
                                            
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                <tr>
                                                    <td style="padding: 8px 0;">
                                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                            <tr>
                                                                <td style="font-size: 16px; color: #374151;">Subtotal:</td>
                                                                <td style="text-align: right; font-size: 16px; font-weight: 600; color: #2563eb;">${emailData.subtotalFormatted}</td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 8px 0;">
                                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                            <tr>
                                                                <td style="font-size: 16px; color: #374151;">Envío:</td>
                                                                <td style="text-align: right; font-size: 16px; font-weight: 600; color: #2563eb;">${emailData.shippingCostFormatted}</td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="border-top: 2px solid #2563eb; padding-top: 15px; margin-top: 15px;">
                                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: rgba(37, 99, 235, 0.1); padding: 15px; border-radius: 6px;">
                                                            <tr>
                                                                <td style="font-size: 18px; font-weight: 700; color: #1e40af;">Total Pagado:</td>
                                                                <td style="text-align: right; font-size: 20px; font-weight: 800; color: #1e40af;">${emailData.totalAmountFormatted}</td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td class="mobile-padding" style="background-color: #f8fafc; border-top: 1px solid #e5e7eb; padding: 30px; text-align: center;">
                                <div style="font-size: 18px; font-weight: 700; color: #2563eb; margin-bottom: 15px;">Cayro Uniformes</div>
                                
                                <p style="font-size: 15px; color: #6b7280; margin: 0 0 20px 0; line-height: 1.5;">
                                    ¿Tienes alguna pregunta sobre tu pedido? Contáctanos en 
                                    <a href="mailto:${companyInfo.contactInfo[0].email || 'cayrouniformes@gmail.com'}" style="color: #2563eb; text-decoration: none; font-weight: 500;">
                                        ${companyInfo.contactInfo[0].email || 'cayrouniformes@gmail.com'}
                                    </a>
                                </p>
                                
                                <div style="font-size: 13px; color: #9ca3af; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; line-height: 1.4;">
                                    © ${currentYear} Cayro Uniformes. Todos los derechos reservados.
                                    <br>
                                    Este es un mensaje automático, por favor no respondas a este email.
                                </div>
                            </td>
                        </tr>
                        
                    </table>
                    
                </td>
            </tr>
        </table>
        
    </body>
    </html>
  `;
  return html;
};

export const createAccountVerificationEmail = (verificationCode, timeToken, companyInfo, dataConfig, currentYear) => {
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verificación de Cuenta</title>
        <!--[if mso]>
        <noscript>
            <xml>
                <o:OfficeDocumentSettings>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
            </xml>
        </noscript>
        <![endif]-->
        <style>
            @media only screen and (max-width: 600px) {
                .mobile-full-width { width: 100% !important; max-width: 100% !important; }
                .mobile-padding { padding: 20px !important; }
                .mobile-header-padding { padding: 30px 20px !important; }
                .mobile-logo { height: 120px !important; }
                .mobile-title { font-size: 24px !important; }
                .mobile-greeting { font-size: 20px !important; }
                .mobile-message { font-size: 15px !important; }
                .mobile-verification-code { font-size: 20px !important; padding: 15px !important; letter-spacing: 4px !important; }
                .mobile-info-padding { padding: 20px !important; margin: 20px 0 !important; }
                .mobile-footer-padding { padding: 30px 20px !important; }
                .mobile-company-name { font-size: 16px !important; }
                .mobile-hide-border { border-left: none !important; border-right: none !important; }
            }
            
            @media only screen and (max-width: 480px) {
                .mobile-header-padding { padding: 25px 15px !important; }
                .mobile-padding { padding: 25px 15px !important; }
                .mobile-logo { height: 100px !important; }
                .mobile-title { font-size: 22px !important; }
                .mobile-greeting { font-size: 18px !important; }
                .mobile-verification-code { font-size: 18px !important; padding: 12px 15px !important; letter-spacing: 2px !important; }
            }
        </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #374151; background-color: #f3f4f6; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
        
        <!-- Email Wrapper -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6; padding: 20px 0;">
            <tr>
                <td align="center" style="padding: 0;">
                    
                    <!-- Email Container -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="mobile-full-width" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        
                        <!-- Header -->
                        <tr>
                            <td class="mobile-header-padding" style="background-color: #2563eb; color: white; text-align: center; padding: 40px 30px;">
                                <img src="${companyInfo.logoUrl}" alt="Cayro Uniformes" class="mobile-logo" style="height: 180px; width: auto; max-width: 100%; margin-bottom: 20px; filter: brightness(0) invert(1); display: block; margin-left: auto; margin-right: auto;">
                                <h1 class="mobile-title" style="font-size: 28px; font-weight: 700; margin: 0; color: white; letter-spacing: -0.5px;">
                                    ${dataConfig?.title || "Verificación de Cuenta"}
                                </h1>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td class="mobile-padding" style="padding: 40px 30px;">
                                
                                <!-- Greeting -->
                                <h2 class="mobile-greeting" style="font-size: 24px; font-weight: 600; color: #1f2937; text-align: center; margin: 0 0 15px 0;">
                                    ${dataConfig?.greeting || "¡Hola!"}
                                </h2>
                                
                                <!-- Message -->
                                <p class="mobile-message" style="font-size: 17px; color: #6b7280; text-align: center; margin: 0 0 30px 0; line-height: 1.6;">
                                    ${dataConfig?.maininstruction || "Utiliza el siguiente código para verificar tu cuenta y completar el proceso de registro."}
                                </p>
                                
                                <!-- Verification Code Card -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 25px 0;">
                                    <tr>
                                        <td style="background-color: #dbeafe; border: 2px solid #2563eb; border-radius: 8px; padding: 25px; text-align: center;">
                                            <h3 style="font-size: 20px; font-weight: 700; color: #2563eb; margin: 0 0 15px 0;">🔐 Código de Verificación</h3>
                                            <div class="mobile-verification-code" style="font-size: 32px; font-weight: 800; color: #2563eb; font-family: 'Courier New', monospace; background: white; padding: 20px 25px; border-radius: 6px; margin: 15px 0; letter-spacing: 8px; border: 1px solid #93c5fd; word-break: break-all;">${verificationCode}</div>
                                            <div style="font-size: 16px; font-weight: 600; color: #374151; margin-top: 10px;">Ingresa este código en la aplicación</div>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Warning Box -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 25px 0;">
                                    <tr>
                                        <td style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 20px; text-align: center;">
                                            <p style="color: #92400e; font-size: 14px; font-weight: 500; margin: 0;">
                                                ⏰ ${dataConfig?.expirationtime || `Este código expira en ${timeToken} minutos`}
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Info Card -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 25px 0;">
                                    <tr>
                                        <td class="mobile-info-padding" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 25px;">
                                            
                                            <!-- First Info Section -->
                                            <h3 style="font-size: 16px; font-weight: 600; color: #1f2937; margin: 0 0 10px 0;">¿No solicitaste esta verificación?</h3>
                                            <p style="font-size: 14px; color: #6b7280; margin: 0 0 20px 0; line-height: 1.5;">
                                                ${dataConfig?.secondaryinstruction || "Si no creaste una cuenta, puedes ignorar este mensaje de forma segura. No se realizará ninguna acción en tu nombre."}
                                            </p>
                                            
                                            <!-- Second Info Section -->
                                            <h3 style="font-size: 16px; font-weight: 600; color: #1f2937; margin: 0 0 10px 0;">¿Problemas con el código?</h3>
                                            <p style="font-size: 14px; color: #6b7280; margin: 0 0 15px 0;">Si el código no funciona, solicita uno nuevo desde la aplicación o contáctanos para recibir ayuda.</p>
                                            
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Signature -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 30px; padding-top: 25px; border-top: 2px solid #e2e8f0;">
                                    <tr>
                                        <td>
                                            <p style="color: #475569; font-weight: 500; font-size: 16px; margin: 0; text-align: center;">
                                                ${dataConfig?.signature || "Atentamente, el equipo de Cayro Uniformes"}
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                                
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td class="mobile-footer-padding" style="background-color: #f8fafc; border-top: 1px solid #e5e7eb; padding: 30px; text-align: center;">
                                <div class="mobile-company-name" style="font-size: 18px; font-weight: 700; color: #2563eb; margin-bottom: 15px;">
                                    ${dataConfig?.finalMessage || "Cayro Uniformes"}
                                </div>
                                
                                <p style="font-size: 15px; color: #6b7280; margin: 0 0 20px 0; line-height: 1.5;">
                                    ¿Necesitas ayuda? Contáctanos en 
                                    <a href="mailto:${companyInfo.contactInfo?.[0]?.email || "cayrouniformes@gmail.com"}" style="color: #2563eb; text-decoration: none; font-weight: 500;">${companyInfo.contactInfo?.[0]?.email || "cayrouniformes@gmail.com"}</a>
                                </p>
                                
                                <div style="font-size: 13px; color: #9ca3af; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; line-height: 1.4;">
                                    © ${currentYear} Cayro Uniformes. Todos los derechos reservados.
                                    <br>
                                    Este es un mensaje automático, por favor no respondas a este email.
                                </div>
                            </td>
                        </tr>
                        
                    </table>
                    
                </td>
            </tr>
        </table>
        
    </body>
    </html>
  `
  return html
}

