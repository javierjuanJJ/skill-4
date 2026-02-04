#!/usr/bin/env node
const readline = require('readline');

// In-memory storage (representa STORAGE-BALANCE en COBOL) en centavos
let STORAGE_BALANCE_CENTS = 1000 * 100; // 1000.00
const DEFAULT_BALANCE_CENTS = 1000 * 100;

// DataProgram equivalente: 'READ' devuelve balance, 'WRITE' actualiza
function dataProgram(operation, balanceCents) {
  const op = String(operation).trim().toUpperCase();
  if (op === 'READ') return STORAGE_BALANCE_CENTS;
  if (op === 'WRITE') {
    STORAGE_BALANCE_CENTS = Number(balanceCents) | 0;
    return;
  }
}

// Utilities
function parseAmountToCents(input) {
  if (typeof input !== 'string' && typeof input !== 'number') return null;
  const s = String(input).trim();
  if (!/^[-+]?[0-9]+(\.[0-9]{1,2})?$/.test(s)) return null;
  const negative = s.startsWith('-');
  const parts = s.replace('+','').replace('-','').split('.');
  const intPart = parseInt(parts[0], 10) || 0;
  const fracPart = parts[1] ? (parts[1].padEnd(2,'0').slice(0,2)) : '00';
  const cents = intPart * 100 + parseInt(fracPart, 10);
  return negative ? -cents : cents;
}

function formatCentsAsDisplay(cents) {
  const negative = cents < 0;
  const abs = Math.abs(cents);
  const intPart = Math.floor(abs / 100).toString().padStart(6, '0');
  const frac = (abs % 100).toString().padStart(2, '0');
  return (negative ? '-' : '') + intPart + '.' + frac;
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  function question(prompt) {
    return new Promise((resolve) => rl.question(prompt, resolve));
  }

  let continueFlag = true;
  while (continueFlag) {
    console.log('--------------------------------');
    console.log('Account Management System');
    console.log('1. View Balance');
    console.log('2. Credit Account');
    console.log('3. Debit Account');
    console.log('4. Exit');
    console.log('--------------------------------');
    const choice = await question('Enter your choice (1-4): ');

    switch (String(choice).trim()) {
      case '1': {
        const bal = dataProgram('READ');
        console.log('Current balance: ' + formatCentsAsDisplay(bal));
        break;
      }
      case '2': {
        const amtStr = await question('Enter credit amount: ');
        const amt = parseAmountToCents(amtStr);
        if (amt === null) {
          console.log('Invalid amount format. Use numbers with up to 2 decimals.');
          break;
        }
        let bal = dataProgram('READ');
        bal += amt;
        dataProgram('WRITE', bal);
        console.log('Amount credited. New balance: ' + formatCentsAsDisplay(bal));
        break;
      }
      case '3': {
        const amtStr = await question('Enter debit amount: ');
        const amt = parseAmountToCents(amtStr);
        if (amt === null) {
          console.log('Invalid amount format. Use numbers with up to 2 decimals.');
          break;
        }
        let bal = dataProgram('READ');
        if (bal >= amt) {
          bal -= amt;
          dataProgram('WRITE', bal);
          console.log('Amount debited. New balance: ' + formatCentsAsDisplay(bal));
        } else {
          console.log('Insufficient funds for this debit.');
        }
        break;
      }
      case '4': {
        continueFlag = false;
        break;
      }
      default: {
        console.log('Invalid choice, please select 1-4.');
      }
    }
  }

  console.log('Exiting the program. Goodbye!');
  rl.close();
}

if (require.main === module) {
  main().catch((err) => {
    console.error('Unhandled error:', err);
    process.exit(1);
  });
}

module.exports = { dataProgram, parseAmountToCents, formatCentsAsDisplay };

// Testing / helper APIs
function setStorageBalanceCents(cents) {
  STORAGE_BALANCE_CENTS = Number(cents) | 0;
}

function getStorageBalanceCents() {
  return STORAGE_BALANCE_CENTS;
}

function resetStorageBalance() {
  STORAGE_BALANCE_CENTS = DEFAULT_BALANCE_CENTS;
}

module.exports = Object.assign(module.exports, {
  setStorageBalanceCents,
  getStorageBalanceCents,
  resetStorageBalance,
});
