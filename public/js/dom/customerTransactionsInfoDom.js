// (1.) For Customer Transactions
// ====================================================================
export const renderCustomerTransactions = (transactions, tableBody) =>
{
    tableBody.empty();
    transactions.forEach((transaction, index) => 
    {
        tableBody.append(`
            <tr data-id=${index}>
                <td>${index ?? ""}</td>
                <td>${transaction.package_name ?? ""}</td>
                <td>${transaction.minutes ?? ""}</td>
                <td>${transaction.rate_per_minute ?? ""}</td>
                <td>${transaction.earnings ?? ""}</td>
                <td>${transaction.created_at ?? ""}</td>
            </tr>
        `);
    });
}

// Rendering The Customer's Transactions Data After Applying The Date Range Filter
export const renderCustomerTransactionsFilter = (transactions, dataTable) => 
{
    const rows = transactions.map((transaction, index) => (
        [
            index,
            transaction.package_name ?? '',
            transaction.minutes ?? '',
            transaction.rate_per_minute ?? '',
            transaction.earnings ?? '',
            transaction.created_at ?? '',
        ]));

    dataTable.clear();
    dataTable.rows.add(rows);
    dataTable.draw();
}

// (2.) For OTP And Toggle White Listed
// ====================================================================
export const renderCustomerOtpSection = (data, division) =>
{
    division.html
        (
            `
                <button type="button" data-id="${data.id}" class="btn btn-info" id="generate-secure-otp-btn"><i class="fa fa-lock" aria-hidden="true"></i> Generate Secure OTP</button>
                <div 
                    id="secure-otp"
                    class="alert alert-success d-flex align-items-center gap-2 p-2 mb-0 d-none">                                        
                </div>
            `
        );
}

export const renderCustomerOtp = (data, division) =>
{
    const secureOTP = data.secure_otp;
    division.removeClass("d-none").html
        (
            `
                ${secureOTP ? `<i class="fa fa-check-circle" aria-hidden="true"></i> <div class="fw-semibold">Secure OTP Is: ${secureOTP}</div>` : ``}
            `
        );
}

export const renderToggleWhiteListedSection = (data, division) =>
{
    division.html
        (
            `
                <button type="button" data-id="${data.id}" class="btn btn-warning py-1" style="width: 100px;" id="toggle-white-listed-btn">${data.white_listed ? "Unlist" : "List"}</button>
            `
        );
}

export const renderWhiteListedBadge = (data, division) =>
{
    const whiteListedBadge = data.white_listed === 1 ? `<span class="badge bg-success px-4 py-1">Yes</span>` : `<span class="badge bg-danger px-4 py-1">No</span>`;
    division.html
        (
            `
                ${whiteListedBadge}
            `
        );
}

export const renderCoinsValue = (data, container) =>
{
    container.empty();
    container.html(
        `
            ${data.coins}
            `
    );
}
// ================================================================

// (3.) For Date Range
// ====================================================================
export const renderTotalDateRangeEarnings = (data, container) =>
{
    container.empty();
    container.html(
        `
        <div class="card-body px-4 py-1">
            <h6 class="fs-5 fw-semibold mb-1">Total Earnings Amount <small class="text-muted fw-normal">(Date Range)</small></h6>
            <div class="fw-semibold fs-6 text-success mb-0">
                <div id="dateRangeEarningsSpinner" class="d-none d-flex justify-content-start align-items-center my-4">
                    <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                </div>
                <span id="dateRangeEarningsValue">₹ ${data.total_earnings || "0.00"}</span>
            </div>
        </div>
        `
    );
}
// ====================================================================

// (5.) For Stats
// ====================================================================
export const renderTotalEarningAmount = (data, container) =>
{
    container.empty();
    container.html(
        `
        <div class="card-body px-4 py-1">
            <h6 class="fs-5 fw-semibold mb-1">Lifetime Earnings Amount</h6>
            <div class="fw-semibold fs-6 text-success mb-0">
                ₹ <span id="totalEarningsValue">${data.total_earnings || "0.00"}</span>
            </div>
        </div>
        `
    );
}

export const renderTotalPaidWithdrawals = (data, container) =>
{
    container.empty();
    container.html(
        `
        <div class="card-body px-4 py-1">
            <h6 class="fs-5 fw-semibold mb-1">Total Paid Withdrawal</h6>
            <div class="fw-semibold fs-6 text-danger mb-0">
                ₹ <span id="totalPaidWithdrawalsValue">${data.total_paid || "0.00"}</span>
            </div>
        </div>
        `
    );
}

export const renderTotalPendingWithdrawals = (data, container) =>
{
    container.empty();
    container.html(
        `
        <div class="card-body px-4 py-1">
            <h6 class="fs-5 fw-semibold mb-1">Total Pending Withdrawal <small class="text-muted fw-normal">(Requested)</small></h6>
            <div class="fw-semibold fs-6 text-info mb-0">
                ₹ <span id="totalEarningsValue">${data.total_pending || "0.00"}</span>
            </div>
        </div>
        `
    );
}
// ====================================================================

// Miscellaneous - According to the white listed status
export const renderCustomerBreadcrumbs = (isWhiteListed, container) =>
{
    container.empty();
    const breadcrumb = isWhiteListed ? "White Listed Thai Customers" : "Non White Listed Thai Customers";
    container.append(`
        <div class="col">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="/thai-customers/${isWhiteListed ? "white-listed" : "non-white-listed"}">${breadcrumb}</a>
                </li>
                <li class="breadcrumb-item active" aria-current="page">Customer Transactions</li>
            </ol>
        </div>
    `);
};

export const renderCustomerWithdrawalsTableHeader = (isWhiteListed, container) =>
{
    container.empty();
    container.append(`
        <h4>Customer Withdrawal Info</h4>
        ${isWhiteListed ? `<button class="btn btn-primary addBtn" data-bs-toggle="modal" data-bs-target="#addModal">Add Withdrawal</button>` : ""}
    `);
};

export const createKVRow = (key = "", value = "") =>
{
    return `
      <div class="row g-2 align-items-center kv-row mb-2">
        <div class="col-md-5">
          <input type="text" name="keys[]" class="form-control" value="${key}" required>
        </div>
        <div class="col-md-5">
          <input type="text" name="values[]" class="form-control" value="${value}" required>
        </div>
        <div class="col-md-2 text-center">
            <button type="button" class="btn btn-danger btn-sm py-1 remove-row">
                <i class="ti ti-trash fs-5"></i>
            </button>
        </div>
      </div>
    `;
}

export const resetForm = (form) =>
{
    $(form)[0].reset();
}