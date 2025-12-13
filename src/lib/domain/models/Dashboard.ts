export class Dashboard {
  constructor( private readonly selectedMonth: Date,
               private readonly income: number,
               private readonly expenses: number,
               private readonly saving: number,
               private readonly investment: number,
               private readonly freeMoney: number,
               private readonly monthState: string
  ) {}

  static empty(): Dashboard {
    return new Dashboard(new Date(), 0, 0, 0, 0, 0, 'neutral');
  }

  isEmpty(): boolean {
    return this.income === 0 && this.expenses === 0 && this.saving === 0 && this.investment === 0 && this.freeMoney === 0;
  }

  get month(){return this.selectedMonth}
  get totalIncome(){return this.income}
  get totalExpenses(){return this.expenses}
  get totalSaving(){return this.saving}
  get totalInvestment(){return this.investment}
  get totalFreeMoney(){return this.freeMoney}
  get state(){return this.monthState}
  get balance(){return this.income - this.expenses;}
}
