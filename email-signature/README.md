# Firma de email INCOLTEC

- `firma.html`: plantilla horizontal (tablas + estilos inline). Sustituye los marcadores `[NOMBRE]`, `[CARGO]`, `[MÓVIL]`, `[TELÉFONO]`, `[EMAIL]` (y sus versiones `_TEL` sin espacios).
- Imágenes en `public/email-signature/`; se sirven desde `https://incoltec.com/email-signature/` cuando la web esté publicada en ese dominio.

## Instalación
- **Gmail**: abre `firma.html` en Chrome, selecciona todo, copia y pega en Configuración → Firma.
- **Outlook (nuevo/web)**: Configuración → Cuentas → Firmas → pega el contenido copiado desde el navegador.
- **Outlook clásico**: Archivo → Opciones → Correo → Firmas → Nueva → pega.

## Pendiente
- Archivo autorizado del distintivo IFS (el actual se extrajo del PDF y su QR no es fiable) y validación con Calidad.
- Versión compacta, iconos PNG de LinkedIn/YouTube, banner opcional, generador y pruebas en Outlook/Gmail/móvil/modo oscuro.
