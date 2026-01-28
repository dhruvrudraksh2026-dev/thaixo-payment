const TRANSACTION_STATUS = {
    PENDING: {
        label: "Pending",
        badge: `<span class="badge bg-warning text-dark">Pending</span>`
    },
    DONE: {
        label: "Done",
        badge: `<span class="badge bg-success">Done</span>`
    },
    CANCELLED: {
        label: "Cancelled",
        badge: `<span class="badge bg-danger">Cancelled</span>`
    }
};

export const renderCustomerTransactions = (transactions, tableBody) =>
{
    tableBody.empty();
    transactions.forEach((transaction, index) => 
    {
        const transactionStatusBadge = TRANSACTION_STATUS[transaction.status]?.badge;
        tableBody.append(`
            <tr data-id=${index}>
                <td>${index ?? ""}</td>
                <td>${transaction.package_name ?? ""}</td>
                <td>${transaction.minutes ?? ""}</td>
                <td>${transaction.rate_per_minute ?? ""}</td>
                <td>${transaction.earnings ?? ""}</td>
                <td>${transactionStatusBadge}</td>
                <td>${transaction.created_at ?? ""}</td>
                <td><button class="btn btn-warning btn-sm editBtn" data-id="${index}" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button></td>
            </tr>
        `);
    });
}

export const addDataTableRow = (dataTable, data) => 
{
    const index = dataTable.rows().count();
    const transactionStatusBadge = TRANSACTION_STATUS[data.status]?.badge;
    const rowNode = dataTable.row.add([
        index,
        data.package_name ?? "",
        data.minutes ?? "",
        data.rate_per_minute ?? "",
        data.earnings ?? "",
        transactionStatusBadge,
        data.created_at ?? "",
        `
            <button class="btn btn-warning btn-sm editBtn" data-id="${index}" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>
        `
    ]).draw(false).node();

    $(rowNode).attr("data-id", index);
};

export const editDataTableRow = (dataTable, data) => 
{
    const index = data.index;
    const rowSelector = `tr[data-id="${index}"]`;
    const transactionStatusBadge = TRANSACTION_STATUS[data.status]?.badge;
    dataTable.row(rowSelector).data([
        index,
        data.package_name ?? "",
        data.minutes ?? "",
        data.rate_per_minute ?? "",
        data.earnings ?? "",
        transactionStatusBadge,
        data.created_at ?? "",
        `
            <button class="btn btn-warning btn-sm editBtn" data-id="${index}" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>
        `
    ]).draw(false);
};

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

export const renderTotalPaidAmount = (data, container) =>
{
    container.empty();
    container.html(
        `
        <div class="card-body px-4 py-1">
            <h6 class="fs-5 fw-semibold mb-1">Total Paid Amount</h6>
            <div class="fw-semibold fs-6 text-danger mb-0">
                ₹ <span id="totalEarningsValue">${data.total_paid || "0.00"}</span>
            </div>
        </div>
        `
    );
}

export const renderTotalDateRangeEarnings = (data, container) =>
{
    container.empty();
    container.html(
        `
        <div class="card-body px-4 py-1">
            <h6 class="fs-5 fw-semibold mb-1">Earnings Amount</h6>
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