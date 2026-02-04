const path = require('path');

// Helper to reload module (simulate fresh start)
function reloadModule() {
  const p = path.resolve(__dirname, '../index.js');
  delete require.cache[require.resolve(p)];
  return require(p);
}

describe('Accounting app unit tests (mirror TESTPLAN)', () => {
  let mod;

  beforeEach(() => {
    mod = reloadModule();
    // Ensure reset to default before each test
    mod.resetStorageBalance();
  });

  test('TC-001 Ver saldo inicial', () => {
    const bal = mod.dataProgram('READ');
    expect(mod.formatCentsAsDisplay(bal)).toBe('001000.00');
  });

  test('TC-002 Acreditar cuenta (monto válido)', () => {
    const bal0 = mod.dataProgram('READ');
    const amt = mod.parseAmountToCents('250.75');
    expect(amt).toBe(25075);
    const bal1 = bal0 + amt;
    mod.dataProgram('WRITE', bal1);
    expect(mod.formatCentsAsDisplay(mod.dataProgram('READ'))).toBe('001250.75');
  });

  test('TC-003 Debitar cuenta (fondos suficientes)', () => {
    const bal0 = mod.dataProgram('READ');
    const amt = mod.parseAmountToCents('500.50');
    expect(amt).toBe(50050);
    expect(bal0).toBeGreaterThanOrEqual(amt);
    const bal1 = bal0 - amt;
    mod.dataProgram('WRITE', bal1);
    expect(mod.formatCentsAsDisplay(mod.dataProgram('READ'))).toBe('000499.50');
  });

  test('TC-004 Debitar cuenta (fondos insuficientes)', () => {
    // Set balance low and attempt large debit
    mod.setStorageBalanceCents(mod.parseAmountToCents('50.00'));
    const bal0 = mod.dataProgram('READ');
    const amt = mod.parseAmountToCents('150.00');
    expect(bal0).toBeLessThan(amt);
    // Simulate operation logic: should not write new balance
    if (bal0 >= amt) {
      mod.dataProgram('WRITE', bal0 - amt);
    }
    expect(mod.formatCentsAsDisplay(mod.dataProgram('READ'))).toBe('000050.00');
  });

  test('TC-005 Precisión de centavos', () => {
    const bal0 = mod.dataProgram('READ');
    const amt = mod.parseAmountToCents('0.99');
    expect(amt).toBe(99);
    const bal1 = bal0 + amt;
    mod.dataProgram('WRITE', bal1);
    expect(mod.formatCentsAsDisplay(mod.dataProgram('READ'))).toBe('001000.99');
  });

  test('TC-006 Límite máximo de monto (comportamiento actual)', () => {
    // Implementation currently does not enforce PIC limits; test current behavior
    const huge = mod.parseAmountToCents('900000.00'); // 900k
    const bal0 = mod.dataProgram('READ');
    const bal1 = bal0 + huge; // may exceed 999999.99
    mod.dataProgram('WRITE', bal1);
    // Expect implementation to store the value (no validation)
    expect(mod.dataProgram('READ')).toBe(bal1);
  });

  test('TC-007 Opción inválida de menú (parse behavior not applicable)', () => {
    // The CLI prints an invalid choice message; unit tests validate parsing/validation elsewhere
    // Here we assert parseAmountToCents rejects invalid numeric input
    expect(mod.parseAmountToCents('abc')).toBeNull();
  });

  test('TC-008 Persistencia entre ejecuciones', () => {
    // Simulate change and then reset module state (no persistence expected)
    const amt = mod.parseAmountToCents('100.00');
    const bal0 = mod.dataProgram('READ');
    const bal1 = bal0 + amt;
    mod.dataProgram('WRITE', bal1);
    // Simulate application restart by resetting storage to default
    mod.resetStorageBalance();
    expect(mod.dataProgram('READ')).toBe(mod.parseAmountToCents('1000.00'));
  });

  test('TC-009 Formato y lectura de monto inválido', () => {
    expect(mod.parseAmountToCents('abc')).toBeNull();
    expect(mod.parseAmountToCents('12.345')).toBeNull();
    expect(mod.parseAmountToCents('12.3')).toBe(1230);
  });
});
