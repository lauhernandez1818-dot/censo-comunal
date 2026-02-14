# ✅ Verificación Final en Supabase

## Pasos para Verificar que Todo Está Bien

### 1. Verificar Tabla `usuarios`

1. Ve a **Table Editor** → selecciona tabla `usuarios`
2. Verifica que tenga estas columnas:
   - ✅ `id`
   - ✅ `usuario`
   - ✅ `clave`
   - ✅ `rol`
   - ✅ `telefono` ← **NUEVA**
   - ✅ `cedula` ← **NUEVA**
   - ✅ `jefa_calle_id` ← **NUEVA**
   - ✅ `nombre_display` ← **NUEVA**
   - ✅ `created_at`

3. Verifica que MeryCN tenga:
   - `rol` = `jefa_calle` (no `admin`)
   - `nombre_display` = `Jefa De Calle 1 (Mery)`

---

### 2. Verificar Tabla `censo_familias`

1. Ve a **Table Editor** → selecciona tabla `censo_familias`
2. Verifica que tenga estas columnas:
   - ✅ `id`
   - ✅ `jefe_familia`
   - ✅ `cedula`
   - ✅ `nro_integrantes`
   - ✅ `nro_ninos` ← **NUEVA**
   - ✅ `nro_adultos` ← **NUEVA**
   - ✅ `nro_adultos_mayores` ← **NUEVA**
   - ✅ `discapacidad` ← **NUEVA**
   - ✅ `discapacidad_condicion` ← **NUEVA**
   - ✅ `discapacidad_condicion_detalle` ← **NUEVA**
   - ✅ `salud_observacion` ← **NUEVA**
   - ✅ `estado_vivienda` ← **NUEVA**
   - ✅ `nudo_critico` ← **NUEVA**
   - ✅ `usuario_creador` ← **NUEVA**
   - ✅ `jefa_calle_id` ← **NUEVA**
   - ✅ `created_at`

---

### 3. Verificar Tabla `otp_codes`

1. Ve a **Table Editor** → busca tabla `otp_codes`
2. Debe existir con estas columnas:
   - ✅ `id`
   - ✅ `telefono`
   - ✅ `cedula`
   - ✅ `codigo`
   - ✅ `usado`
   - ✅ `expira_en`
   - ✅ `created_at`

---

## ✅ Si Todo Está Correcto

Si ves todas las columnas mencionadas arriba, **¡todo está perfecto!** 🎉

Ya puedes:
- ✅ Probar la app en localhost
- ✅ Registrar usuarios con teléfono y cédula
- ✅ Verificar códigos OTP (en desarrollo se muestran en alert)
- ✅ Seleccionar jefa de calle al registrarse
- ✅ MeryCN entrará como jefa de calle (no admin)

---

## ⚠️ Si Falta Algo

Si alguna columna no aparece:
1. Ve a **SQL Editor**
2. Abre la query correspondiente (JefasCalle, SMSOTP, etc.)
3. Haz clic en **Run** otra vez
4. Verifica que diga "Success"

---

## 🎯 Próximo Paso

¡Prueba la app en localhost y verifica que:
- El login funcione
- El registro pida teléfono, cédula y jefa de calle
- Los códigos OTP se muestren en alert (modo desarrollo)
- MeryCN entre como jefa de calle
