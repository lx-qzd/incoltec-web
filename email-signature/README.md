# Firma de email corporativa INCOLTEC

## Archivos

| Archivo | Para qué |
| --- | --- |
| `generador.html` | **Forma recomendada.** Ábrelo en Chrome/Edge, rellena tus datos y pulsa «Copiar firma». Permite elegir versión, banner y distintivo IFS, y ver la firma en modo oscuro y sin imágenes. |
| `firma.html` | Plantilla horizontal (correos nuevos), sin banner. |
| `firma-con-banner.html` | Plantilla horizontal con el banner de productos. |
| `firma-compacta.html` | Versión reducida para respuestas y reenvíos (sin imágenes). |
| `pruebas/` | Capturas de las pruebas: claro, banner, modo oscuro, imágenes bloqueadas, compacta y móvil. |

Las plantillas usan los marcadores `[NOMBRE]`, `[CARGO]`, `[MÓVIL]`, `[MÓVIL_TEL]`, `[TELÉFONO]`, `[TELÉFONO_TEL]` y `[EMAIL]`. Los `_TEL` son el número sin espacios para el enlace `tel:` (por ejemplo `+34600111222`).

## Imágenes

Las imágenes de la firma (`logo-incoltec.png`, `icon-linkedin.png`, `icon-youtube.png`, `ifs-broker-logo.png`, `banner-productos.jpg`) están en `public/email-signature/` y se publican con la web.

- **Ahora:** se sirven desde la web de pruebas, `https://incoltec-web-sbbi.vercel.app/email-signature/` (valor por defecto del generador). Solo existen allí cuando el último cambio de la web está publicado (merge en `main`).
- **Cuando la web nueva esté en incoltec.com:** se puede cambiar a `https://incoltec.com/email-signature/` en «Opciones avanzadas» y volver a copiar la firma. La dirección de Vercel seguirá funcionando, así que las firmas ya instaladas no se rompen.
- Si alguna imagen no se puede cargar, el generador lo avisa: no copies la firma hasta que el aviso desaparezca.

## Instalación

**Gmail (web):** Configuración (rueda) → Ver todos los ajustes → General → Firma → Crear → pega la firma (Cmd/Ctrl+V) → elige si se usa en correos nuevos y en respuestas → Guardar cambios. Gmail para móvil usa una firma de solo texto aparte.

**Outlook nuevo y Outlook web:** Configuración → Cuentas → Firmas → Nueva firma → pega → elige las firmas predeterminadas para mensajes nuevos (horizontal) y respuestas (compacta) → Guardar.

**Outlook clásico (Windows):** Archivo → Opciones → Correo → Firmas → Nueva → pega en el cuadro de edición → asigna la firma a mensajes nuevos y respuestas → Aceptar. Si las imágenes no aparecen, pega desde Chrome o Edge, no desde Firefox.

**Apple Mail (Mac):** Mail → Ajustes → Firmas → + → desmarca «Usar siempre la fuente por omisión de mi mensaje» → pega.

**iPhone (Mail):** Ajustes → Apps → Mail → Firma → pega. iOS conserva el formato básico; si no, usa la versión compacta.

## Actualizar la firma

Abre `generador.html`, cambia los datos y vuelve a copiar y pegar en cada cliente. Para cambiar el diseño de todas las firmas, edita las plantillas dentro de `generador.html` y regenera `firma*.html`.

## Pruebas realizadas y pendientes

Hechas en navegador (capturas en `pruebas/`): versión horizontal, con banner, modo oscuro, imágenes bloqueadas (se ve el texto alternativo y los datos de contacto siguen siendo texto), versión compacta y generador en móvil (375 px).

Pendientes de hacer en los clientes reales con una cuenta de Incoltec: Outlook clásico y nuevo, Outlook web, Gmail web y móvil, Apple Mail, iPhone, y un hilo con respuesta y reenvío.

## Notas

- La firma tiene fondo blanco propio para que el texto se lea en el modo oscuro de Apple Mail; Gmail y Outlook invierten fondo y texto a la vez.
- El distintivo usado es el logotipo oficial «Certified IFS Broker – Bureau Veritas» que ya estaba en la web. Calidad debe confirmar su uso y la vigencia del certificado.
