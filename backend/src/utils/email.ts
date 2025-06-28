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
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                line-height: 1.6;
                color: #374151;
                background-color: #f1f5f9;
            }
            
            .email-wrapper {
                width: 100%;
                background-color: #f1f5f9;
                padding: 20px 0;
            }
            
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            }
            
            .header {
                background-color: #2563eb;
                color: white;
                text-align: center;
                padding: 40px 30px;
                position: relative;
            }
            
            .header::before {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 20px;
                background: linear-gradient(135deg, transparent 50%, #ffffff 50%);
            }
            
            .logo {
                height: 160px;
                width: auto;
                margin-bottom: 30px;
                filter: brightness(0) invert(1);
            }
            
            .header-title {
                font-size: 28px;
                font-weight: 700;
                margin: 0;
                letter-spacing: -0.5px;
            }
            
            .content {
                padding: 50px 40px;
            }
            
            .greeting {
                font-size: 24px;
                font-weight: 600;
                color: #1f2937;
                text-align: center;
                margin-bottom: 15px;
            }
            
            .message {
                font-size: 16px;
                color: #6b7280;
                text-align: center;
                margin-bottom: 40px;
                line-height: 1.7;
            }
            
            .cta-section {
                text-align: center;
                margin: 40px 0;
            }
            
            .cta-button {
                display: inline-block;
                background-color: #2563eb;
                color: white;
                text-decoration: none;
                font-size: 18px;
                font-weight: 600;
                padding: 18px 40px;
                border-radius: 12px;
                box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
                transition: all 0.3s ease;
                transform: translateY(0);
            }
            
            .cta-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 25px rgba(37, 99, 235, 0.4);
            }
            
            .warning-box {
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                border-left: 4px solid #f59e0b;
                border-radius: 12px;
                padding: 20px;
                margin: 30px 0;
                text-align: center;
            }
            
            .warning-text {
                color: #92400e;
                font-size: 14px;
                font-weight: 500;
                margin: 0;
            }
            
            .info-card {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                padding: 25px;
                margin: 30px 0;
            }
            
            .info-title {
                font-size: 16px;
                font-weight: 600;
                color: #1f2937;
                margin-bottom: 10px;
            }
            
            .info-text {
                font-size: 14px;
                color: #6b7280;
                margin-bottom: 15px;
            }
            
            .backup-link {
                background: #f1f5f9;
                border: 1px solid #cbd5e1;
                border-radius: 8px;
                padding: 12px;
                font-family: 'Monaco', 'Menlo', monospace;
                font-size: 11px;
                color: #2563eb;
                word-break: break-all;
                text-align: center;
            }
            
            .footer {
                background: #f8fafc;
                border-top: 1px solid #e2e8f0;
                padding: 40px 30px;
                text-align: center;
            }
            
            .company-name {
                font-size: 18px;
                font-weight: 700;
                color: #1f2937;
                margin-bottom: 15px;
            }
            
            .support-text {
                font-size: 14px;
                color: #6b7280;
                margin-bottom: 20px;
            }
            
            .support-link {
                color: #2563eb;
                text-decoration: none;
                font-weight: 500;
            }
            
            .copyright {
                font-size: 12px;
                color: #9ca3af;
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
            }
            
            /* Responsive Design */
            @media only screen and (max-width: 600px) {
                .email-wrapper {
                    padding: 10px;
                }
                
                .email-container {
                    margin: 0 10px;
                    border-radius: 12px;
                }
                
                .header {
                    padding: 30px 20px;
                }
                
                .logo {
                    height: 120px;
                }
                
                .header-title {
                    font-size: 24px;
                }
                
                .content {
                    padding: 30px 20px;
                }
                
                .greeting {
                    font-size: 20px;
                }
                
                .message {
                    font-size: 15px;
                }
                
                .cta-button {
                    font-size: 16px;
                    padding: 16px 30px;
                    display: block;
                    margin: 0 auto;
                    max-width: 280px;
                }
                
                .info-card {
                    padding: 20px;
                    margin: 20px 0;
                }
                
                .footer {
                    padding: 30px 20px;
                }
                
                .company-name {
                    font-size: 16px;
                }
            }
            
            @media only screen and (max-width: 480px) {
                .header {
                    padding: 25px 15px;
                }
                
                .content {
                    padding: 25px 15px;
                }
                
                .logo {
                    height: 100px;
                }
                
                .header-title {
                    font-size: 22px;
                }
                
                .greeting {
                    font-size: 18px;
                }
                
                .cta-button {
                    font-size: 15px;
                    padding: 14px 25px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-wrapper">
            <div class="email-container">
                
                <!-- Header -->
                <div class="header">
                    <img src="${companyInfo.logoUrl}" alt="Cayro Uniformes" class="logo">
                    
                    <h1 class="header-title">
                        ${dataConfig?.title || 'Recuperación Segura'}
                    </h1>
                </div>
                
                <!-- Content -->
                <div class="content">
                    <h2 class="greeting">
                        ${dataConfig?.greeting || '¡Hola!'}
                    </h2>
                    
                    <p class="message">
                        ${dataConfig?.maininstruction || 'Recibimos una solicitud para restablecer la contraseña de tu cuenta. Para continuar de forma segura, haz clic en el botón de abajo.'}
                    </p>
                    
                    <!-- CTA Button -->
                    <div class="cta-section">
                        <a href="http://localhost:5173/restaurar-password/${token}" class="cta-button">
                            🔐 Restablecer Contraseña
                        </a>
                    </div>
                    
                    <!-- Warning Box -->
                    <div class="warning-box">
                        <p class="warning-text">
                            ⏰ ${dataConfig?.expirationtime || 'Este enlace es válido por 10 minutos'}
                        </p>
                    </div>
                    
                    <!-- Info Card -->
                    <div class="info-card">
                        <h3 class="info-title">¿No solicitaste este cambio?</h3>
                        <p class="info-text">
                            ${dataConfig?.secondaryinstruction || 'Si no solicitaste restablecer tu contraseña, puedes ignorar este mensaje de forma segura. Tu cuenta permanece protegida.'}
                        </p>
                        
                        <h3 class="info-title">¿Problemas con el botón?</h3>
                        <p class="info-text">Copia y pega este enlace en tu navegador:</p>
                        <div class="backup-link">
                            http://localhost:5173/restaurar-password/${token}
                        </div>
                    </div>
                </div>
                
                <!-- Footer -->
                <div class="footer">
                    <div class="company-name">
                        ${dataConfig?.finalMessage || 'Cayro Uniformes'}
                    </div>
                    
                    <p class="support-text">
                        ¿Necesitas ayuda? Contáctanos en 
                        <a href="mailto:soporte@cayro.com" class="support-link">soporte@cayro.com</a>
                    </p>
                    
                    <div class="copyright">
                        © ${currentYear} Cayro Uniformes. Todos los derechos reservados.
                        <br>
                        Este es un mensaje automático, por favor no respondas a este email.
                    </div>
                </div>
                
            </div>
        </div>
    </body>
    </html>
  `;

  return html;
};
