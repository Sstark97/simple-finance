import { NextResponse } from 'next/server';
import { AddTransaction } from '../../../application/use-cases/AddTransaction';
import { GetTransactions } from '../../../application/use-cases/GetTransactions';
import { GoogleSheetsTransactionRepository } from '../../../infrastructure/repositories/GoogleSheetsTransactionRepository';
import { Transaction } from '../../../domain/models/Transaction';

export async function GET() {
  try {
    const transactionRepository = new GoogleSheetsTransactionRepository();
    const getTransactionsUseCase = new GetTransactions(transactionRepository);

    const transactions = await getTransactionsUseCase.execute();

    return NextResponse.json(transactions, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ message: 'Error fetching transactions', error: error.message }, { status: 500 });
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
    console.error('Error adding transaction:', error);
    return NextResponse.json({ message: 'Error adding transaction', error: error.message }, { status: 500 });
  }
}
