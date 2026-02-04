# Plan de Pruebas - COBOL Account System

Este documento contiene el plan de pruebas dirigido a validar la lógica de negocio actual del sistema COBOL. Cada caso de prueba sigue el formato solicitado y está pensado para validar comportamientos ante stakeholders.

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
|---|---|---|---|---|---|---|---|
| TC-001 | Ver saldo inicial | Aplicación iniciada; saldo inicial = 1000.00 | 1) Seleccionar opción 1 (Ver Balance) 2) Observar salida | Se muestra el saldo actual: 001000.00 (formato con ceros a la izquierda) |  |  | `DataProgram` devuelve `STORAGE-BALANCE` con 2 decimales. |
| TC-002 | Acreditar cuenta (monto válido) | Saldo inicial = 1000.00 | 1) Seleccionar opción 2 (Acreditar) 2) Ingresar `250.75` 3) Observar salida | Mensaje: "Amount credited. New balance: 001250.75" y saldo interno actualizado a 1250.75 |  |  | Se llama a `DataProgram` con 'READ' y luego 'WRITE'. |
| TC-003 | Debitar cuenta (fondos suficientes) | Saldo inicial = 1000.00 | 1) Seleccionar opción 3 (Debitar) 2) Ingresar `500.50` 3) Observar salida | Mensaje: "Amount debited. New balance: 000499.50" y saldo interno actualizado a 499.50 |  |  | Verifica resta correcta y persistencia en ejecución. |
| TC-004 | Debitar cuenta (fondos insuficientes) | Saldo inicial = 1000.00 | 1) Seleccionar opción 3 (Debitar) 2) Ingresar `1500.00` 3) Observar salida | Mensaje: "Insufficient funds for this debit." y saldo no cambia (permanece 1000.00) |  |  | Comprueba rechazo de sobregiro. |
| TC-005 | Precisión de centavos | Saldo inicial = 1000.00 | 1) Seleccionar opción 2 (Acreditar) 2) Ingresar `0.99` 3) Observar salida | Nuevo saldo: 001000.99 (centavos preservados) |  |  | `PIC 9(6)V99` debe mantener dos decimales. |
| TC-006 | Límite máximo de monto (bordes de PIC) | Saldo inicial cercano al máximo soportado por PIC | 1) Intentar acreditar cantidad que provoque exceder 999999.99 2) Observar salida | Comportamiento esperado (negocio): rechazar monto que exceda capacidad; Implementación actual: sin validación explícita — posible overflow/resultado inesperado |  |  | Requiere definición de regla de negocio; código actual no valida límites. |
| TC-007 | Opción inválida de menú | Aplicación iniciada | 1) Ingresar opción `5` (u otro fuera 1-4) | Mensaje: "Invalid choice, please select 1-4." y pedir nueva entrada |  |  | Validación mínima ya presente en `MAIN-LOGIC`. |
| TC-008 | Persistencia entre ejecuciones | Ejecutar: acreditar 100; salir; reiniciar aplicación | 1) Acreditar 100 2) Salir 3) Reiniciar la aplicación 4) Ver saldo | Comportamiento actual: No hay persistencia entre ejecuciones; el saldo vuelve a 1000.00 |  |  | `STORAGE-BALANCE` está en memoria; para persistencia se requiere almacenamiento externo. |
| TC-009 | Formato y lectura de monto inválido | Aplicación iniciada | 1) Seleccionar acreditar/debit 2) Ingresar texto no numérico (p.ej. `abc`) | Comportamiento esperado (negocio): rechazar entrada no numérica; Implementación actual: acepta entrada tal cual o falla en tiempo de ejecución (sin sanitización) |  |  | Recomendación: añadir validación/sanitización de entrada. |

---

Instrucciones de uso para stakeholders:

- Para cada caso, completar `Actual Result` y marcar `Status` como `Pass` o `Fail` según la ejecución.
- Añadir comentarios adicionales en la columna `Comments` (p.ej. reproducibilidad o pasos ad-hoc).
- Las filas marcadas como "Requiere definición de regla de negocio" deben ser discutidas y acordadas con el equipo antes de implementar tests automáticos.

Si quieres, puedo convertir estos casos en pruebas unitarias e integradas en Node.js (propuesta de estructura de tests y fixtures). 
