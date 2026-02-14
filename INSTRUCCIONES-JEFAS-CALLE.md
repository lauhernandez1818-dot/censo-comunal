# Instrucciones para Sistema de Jefas de Calle

## 1. Ejecutar SQL en Supabase

Ejecuta el archivo `supabase-jefas-calle-setup.sql` en Supabase > SQL Editor. Esto:
- Añade campo `jefa_calle_id` a la tabla `usuarios` (para usuarios normales)
- Cambia MeryCN de `admin` a `jefa_calle`
- Añade campo `jefa_calle_id` a la tabla `censo_familias` (para filtrar por comunidad)
- Crea índices para búsquedas rápidas

## 2. Roles y Permisos

### Administradora (YusleidyCN)
- ✅ Ve **todas** las familias del censo
- ✅ Puede registrar familias
- ✅ Puede editar y eliminar cualquier familia
- ✅ Ve gráficos y puede exportar datos

### Jefa de Calle (MeryCN y futuras jefas)
- ✅ Ve su propia familia + todas las familias de su comunidad
- ✅ Puede registrar familias
- ✅ Puede editar y eliminar familias de su comunidad
- ✅ Ve gráficos y puede exportar datos de su comunidad

### Usuario Normal
- ✅ Ve **solo** su propia familia
- ✅ Puede registrar una familia (una por usuario)
- ✅ Puede editar y eliminar solo su familia
- ❌ No ve gráficos ni exportar

## 3. Flujo de Registro

Cuando un usuario se registra:
1. Ingresa usuario y contraseña
2. **Selecciona su jefa de calle** (obligatorio)
3. Ingresa teléfono y cédula
4. Verifica código OTP
5. Se crea la cuenta con `jefa_calle_id` asignado

## 4. Cómo se Filtran las Familias

- **Admin**: Ve todas las familias (sin filtro)
- **Jefa de Calle**: Ve familias donde `jefa_calle_id` = su `id` O `usuario_creador` = su `usuario`
- **Usuario Normal**: Ve familias donde `usuario_creador` = su `usuario`

## 5. Añadir Más Jefas de Calle

Para añadir una nueva jefa de calle:

```sql
-- Crear usuario con rol jefa_calle y nombre descriptivo
INSERT INTO public.usuarios (usuario, clave, rol, telefono, cedula, nombre_display)
VALUES ('NuevaJefa', 'contraseña123', 'jefa_calle', '04121234567', 'V12345678', 'Jefa De Calle 2 (Nombre)');
```

El campo `nombre_display` es el que se mostrará en el selector. Si no se especifica, se mostrará "Jefa De Calle (usuario)".

**Ejemplo para añadir las 4 jefas de calle:**
```sql
-- Jefa De Calle 1 (Mery) - Ya existe
-- Jefa De Calle 2
INSERT INTO public.usuarios (usuario, clave, rol, telefono, cedula, nombre_display)
VALUES ('Jefa2', 'contraseña123', 'jefa_calle', '04121234568', 'V12345679', 'Jefa De Calle 2 (Nombre)');

-- Jefa De Calle 3
INSERT INTO public.usuarios (usuario, clave, rol, telefono, cedula, nombre_display)
VALUES ('Jefa3', 'contraseña123', 'jefa_calle', '04121234569', 'V12345680', 'Jefa De Calle 3 (Nombre)');

-- Jefa De Calle 4
INSERT INTO public.usuarios (usuario, clave, rol, telefono, cedula, nombre_display)
VALUES ('Jefa4', 'contraseña123', 'jefa_calle', '04121234570', 'V12345681', 'Jefa De Calle 4 (Nombre)');
```

Luego aparecerán automáticamente en el selector de jefas de calle cuando los usuarios se registren.

## 6. Notas Importantes

- Una cédula solo puede tener una cuenta (evita multicuentas)
- Los usuarios deben seleccionar una jefa de calle al registrarse
- Las familias se asocian automáticamente a la jefa de calle del usuario que las crea
- MeryCN ahora es jefa de calle, no administradora
- Solo YusleidyCN tiene acceso completo a todos los datos
