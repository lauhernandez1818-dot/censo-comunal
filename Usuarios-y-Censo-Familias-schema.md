# Usuarios y Censo Familias — Schema

Esquema de las tablas para Supabase. Para crear todo desde cero, ejecuta el contenido de **supabase-setup-completo.sql** en Supabase → SQL Editor.

---

## 1. Tabla `public.usuarios`

| Columna     | Tipo        | Descripción                    |
|------------|-------------|--------------------------------|
| id         | UUID        | PK, autogenerado               |
| usuario    | TEXT        | UNIQUE NOT NULL (login)       |
| clave      | TEXT        | NOT NULL (contraseña)         |
| rol        | TEXT        | NOT NULL, default 'jefa'      |
| created_at | TIMESTAMPTZ | default NOW()                 |

**Usuarios admin:** YusleidyCN / CN2026 — MeryCN / CN2026$

---

## 2. Tabla `public.censo_familias`

| Columna                      | Tipo        | Descripción                          |
|-----------------------------|-------------|--------------------------------------|
| id                          | UUID        | PK, autogenerado                     |
| jefe_familia                | TEXT        | NOT NULL                             |
| cedula                      | TEXT        | NOT NULL                             |
| nro_integrantes             | INTEGER     | NOT NULL                             |
| nro_ninos                   | INTEGER     | default 0                            |
| nro_adultos                 | INTEGER     | default 0                            |
| nro_adultos_mayores         | INTEGER     | default 0                            |
| discapacidad                | BOOLEAN     | default FALSE                        |
| discapacidad_condicion      | TEXT        | default 'ninguna'                    |
| discapacidad_condicion_detalle | TEXT    | especificación disc/condición        |
| salud_observacion           | TEXT        | problema de salud / qué padece       |
| estado_vivienda              | TEXT        | NOT NULL, default 'Bueno'           |
| nudo_critico                | TEXT        |                                      |
| usuario_creador             | TEXT        | quién registró (usuario o null)      |
| created_at                  | TIMESTAMPTZ | default NOW()                        |

**Valores de `discapacidad_condicion`:** `'ninguna'` \| `'discapacidad'` \| `'condicion'`  
**Valores de `estado_vivienda`:** `'Bueno'` \| `'Regular'` \| `'Malo'`

---

## SQL para pegar (crear todo)

Use el archivo **supabase-setup-completo.sql** de este proyecto, o copie su contenido en Supabase → SQL Editor → New query → Run.
