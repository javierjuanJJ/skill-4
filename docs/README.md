# Documentación del código COBOL

Este repositorio contiene un pequeño sistema de gestión de cuentas (estudiantes) implementado en COBOL. A continuación se documenta el propósito de cada archivo, las funciones clave y las reglas de negocio detectadas.

## Archivos

- `src/cobol/data.cob`:
  - Propósito: Actúa como módulo de datos que mantiene el saldo almacenado (`STORAGE-BALANCE`) y expone operaciones básicas de lectura/escritura.
  - Funciones clave:
    - `PROCEDURE DIVISION USING PASSED-OPERATION BALANCE`: espera una operación (`'READ'` o `'WRITE'`) y un parámetro `BALANCE` para leer o actualizar `STORAGE-BALANCE`.
  - Notas: `STORAGE-BALANCE` inicializado a `1000.00`.

- `src/cobol/main.cob`:
  - Propósito: Interfaz de usuario en consola; presenta un menú y delega operaciones a `Operations`.
  - Funciones clave:
    - `MAIN-LOGIC`: bucle principal que muestra el menú (Ver Saldo, Acreditar, Debitar, Salir) y llama a `Operations` con códigos de operación.
  - Notas: La validación de entrada es mínima (solo rechaza opciones fuera de 1-4).

- `src/cobol/operations.cob`:
  - Propósito: Lógica de negocio para las operaciones de cuenta: mostrar saldo, acreditar y debitar.
  - Funciones clave:
    - `PROCEDURE DIVISION USING PASSED-OPERATION`: interpreta `PASSED-OPERATION` (`'TOTAL '`, `'CREDIT'`, `'DEBIT '`) y realiza la secuencia apropiada.
    - Para `'TOTAL '`: llama a `DataProgram` con `'READ'` y muestra el saldo.
    - Para `'CREDIT'`: solicita monto, lee saldo, suma, escribe nuevo saldo y muestra resultado.
    - Para `'DEBIT '`: solicita monto, lee saldo, comprueba fondos, resta y escribe nuevo saldo; si no hay fondos suficientes, muestra un mensaje de error.

## Reglas de negocio (relacionadas con cuentas de estudiantes)

- Saldo inicial: `1000.00` (definido en `DataProgram` y `Operations`).
- Precisión: los montos usan `PIC 9(6)V99` → dos decimales (centavos) y capacidad máxima de hasta `999999.99`.
- No se permite sobregiro: antes de debitar se verifica `FINAL-BALANCE >= AMOUNT`; si no hay fondos suficientes se rechaza la operación con un mensaje.
- Las operaciones se identifican por códigos de 6 caracteres (p.ej. `'TOTAL '` incluye un espacio para completar longitud); las llamadas dependen de coincidencia exacta.

## Riesgos y mejoras sugeridas

- Validación de entrada: actualmente se acepta cualquier valor numérico sin comprobaciones de rango ni formato; sería recomendable sanitizar y validar montos.
- Manejo de concurrencia/persistencia: el almacenamiento está en variables de programa (`STORAGE-BALANCE`). Si el sistema se divide en programas separados en ejecución real, sería necesario persistir el saldo en un archivo o base de datos y manejar concurrencia.
- Mensajes y UX: mejorar mensajes de error y formato de visualización de montos.
- Código repetido: extraer operaciones comunes y mejorar la normalización de códigos de operación (evitar espacios manuales).

## Ubicación

Archivo creado: `docs/README.md`

---
Si quieres, puedo:
- Añadir ejemplos de uso y comandos para ejecutar el programa.
- Crear pruebas básicas o mejorar validaciones de entrada.
