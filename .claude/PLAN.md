
# Personal Finance Tracker with Google Sheets Backend

## 1. Project Overview

I need to build a mobile-first web application to manage personal finances. The application will serve as a UI for an existing **Google Sheet** database. The system must Read and Write data to specific rows based on the current date/month, ensuring that existing spreadsheet formulas are preserved and updated correctly.

## 2. Database Schema (Google Sheets)

The application must strictly map to the following structure found in the `.xlsx` file:

### Tab 1: "Dashboard" (Monthly Goals & Summary)

Description: A historical table where each row represents a month's summary.

Columns:

-   `Col A` **MES** (Date, YYYY-MM-DD): _Primary Key. Represents the 1st of the month._

-   `Col B` **INGRESOS** (Number): _User Input (Monthly Salary)._

-   `Col C` **GASTOS** (Number): _Read Only. Calculated by Excel formula summing the 'Gastos' tab._

-   `Col D` **AHORRO** (Number): _User Input (Savings Goal for cash)._

-   `Col E` **INVERSION** (Number): _User Input (Investment Goal for ETFs)._

-   `Col F` **DINERO LIBRE** (Number): _Read Only. Calculated by Excel formula._

-   `Col G` **ESTADO** (String): _Read Only. Status output (e.g., "🚀 Va bien")._


### Tab 2: "Gastos" (Transaction Log)

Description: An append-only list of individual expenses.

Columns:

-   `Col A` **FECHA COBRO** (Date): _Transaction date._

-   `Col B` **CONCEPTO** (String): _Description._

-   `Col C` **IMPORTE (€)** (Number): _Amount._

-   `Col D` **CATEGORIA** (String): _Category (e.g., Super, Ocio, Coche)._


### Tab 3: "Patrimonio" (Net Worth History)

Description: A historical snapshot of assets per month.

Columns:

-   `Col A` **MES** (Date, YYYY-MM-DD): _Primary Key._

-   `Col B` **HUCHA** (Number): _User Input (Total Cash available)._

-   `Col C` **INVERTIDO** (Number): _User Input (Total Value of Investments)._

-   `Col D` **TOTAL** (Number): _Read Only. Calculated by Excel formula._


## 3. Core Functionality & Logic

### A. Dashboard View (Read Operation)

Objective: Display the financial status for the current month.

Logic:

1.  Determine the current date.

2.  Query the **"Dashboard"** tab and find the row where `MES` matches the current month (e.g., `2025-12-01`).

3.  **Display:**

    -   **Main Metric:** "DINERO LIBRE" (Col F).

    -   **Summary:** Ingresos vs. Gastos vs. Goals (Ahorro + Inversion).

    -   **Status:** Display the emoji/text from Col G.


### B. Add Transaction (Write Operation)

Objective: Log a new expense.

UI Inputs: Date (default today), Concept, Amount, Category.

Logic:

1.  Receive inputs.

2.  **Append** a new row to the **"Gastos"** tab with the provided data.

3.  _Note:_ The application relies on the Google Sheet to recalculate the "GASTOS" total in the Dashboard tab. The app should re-fetch the Dashboard data after a successful submission.


### C. Update Monthly Settings (Write Operation)

Objective: Adjust income or goals for the current month.

UI Inputs: Salary, Savings Goal, Investment Goal.

Logic:

1.  Find the row for the current month in the **"Dashboard"** tab.

2.  **Update only** Columns B (INGRESOS), D (AHORRO), and E (INVERSION).

3.  _Constraint:_ Do NOT overwrite Columns C, F, or G as they contain formulas.


### D. Update Net Worth (Write Operation)

Objective: Update the current value of assets.

UI Inputs: Total Cash (Hucha), Total Invested.

Logic:

1.  Find the row for the current month in the **"Patrimonio"** tab.

    -   _If the row does not exist (new month), create it._

2.  **Update** Columns B (HUCHA) and C (INVERTIDO).

3.  Fetch and display the calculated Total from Col D.


## 4. Technical Requirements

1.  **Google Sheets API:** The backend must communicate using the Google Sheets API (v4).

2.  **Authentication:** Use a **Service Account** (JSON credentials) for server-side authentication. The user should not need to log in with Google; the app acts as an admin interface for the sheet.

3.  **Formula Preservation:** Write operations must be precise (targeting specific cells or appending rows) to avoid breaking existing spreadsheet formulas.

4.  **Mobile First:** The UI layout must be optimized for mobile screens.


## 5. Output Needed

Based on these specifications, please provide:

1.  **Tech Stack Recommendation:** The best modern stack for this specific use case (fast, simple, robust).

2.  **Project Structure:** Folder organization.

3.  **Implementation Code:**

    -   Setup for Google Sheets API authentication.

    -   Functions to `appendRow` (for expenses).

    -   Functions to `findRowByDate` and `updateRow` (for Dashboard/Patrimonio).