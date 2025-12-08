import { NextResponse } from 'next/server';
import { AddTransaction } from '@/lib/application/use-cases/AddTransaction';
import { GetTransactions } from '@/lib/application/use-cases/GetTransactions';
import { GoogleSheetsTransactionRepository } from '@/lib/infrastructure/repositories/GoogleSheetsTransactionRepository';
import { Transaction } from '@/lib/domain/models/Transaction';

export async function GET() {
  try {
    const transactionRepository = new GoogleSheetsTransactionRepository();
    const getTransactionsUseCase = new GetTransactions(transactionRepository);

    const transactions = await getTransactionsUseCase.execute();

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ message: 'Error fetching transactions', error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { fechaCobro, concepto, importe, categoria } = await request.json();

    // Validar los datos de entrada
    if (!fechaCobro || !concepto || typeof importe !== 'number' || !categoria) {
      return NextResponse.json({ message: 'Missing or invalid transaction data' }, { status: 400 });
    }

    const transactionRepository = new GoogleSheetsTransactionRepository();
    const addTransactionUseCase = new AddTransaction(transactionRepository);

    const newTransaction: Omit<Transaction, 'fechaCobro'> & { fechaCobro: string } = {
        fechaCobro, // Ya viene como string YYYY-MM-DD
        concepto,
        importe,
        categoria,
    };

    const addedTransaction = await addTransactionUseCase.execute(newTransaction);

    return NextResponse.json(addedTransaction, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error adding transaction:', error);
    return NextResponse.json({ message: 'Error adding transaction', error: message }, { status: 500 });
  }
}
