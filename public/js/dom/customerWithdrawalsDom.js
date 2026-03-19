import { safeJSONParse } from "../utils/helper.js";

const WITHDRAWAL_STATUS = {
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

const isJSONParsable = (data) =>
{
    if (!data)
    {
        return false;
    }

    if (typeof data !== 'string')
    {
        return false;
    }

    try
    {
        JSON.parse(data);
        return true;
    } catch (e)
    {
        return false;
    }
};

export const resetForm = (form) =>
{
    $(form)[0].reset();
}

export const renderObjectDetails = (obj) =>
{
    return Object.entries(obj)
        .map(([key, value]) => `
            <div class="mt-1">
                <span class="fw-semibold">${key}:</span>
                <span>${value ?? "NA"}</span>
            </div>
        `)
        .join('');
};

export const renderPayoutDetails = (payoutDetails) =>
{
    if (Array.isArray(payoutDetails))
    {
        if (payoutDetails.length === 1)
        {
            return renderObjectDetails(payoutDetails[0]);
        }

        return payoutDetails
            .map((item, index) => `
                <div class="mb-2">
                    <div class="fw-bold text-primary">
                        Entry ${index + 1}
                    </div>
                    ${renderObjectDetails(item)}
                </div>
            `)
            .join('');
    }

    if (typeof payoutDetails === "object" && payoutDetails !== null)
    {
        return renderObjectDetails(payoutDetails);
    }

    return "NA";
};

export const renderCustomerWithdrawals = (withdrawals, tableBody) =>
{
    const path = window.location.pathname;
    tableBody.empty();
    withdrawals.forEach((withdrawal) => 
    {
        const withdrawalStatusBadge = WITHDRAWAL_STATUS[withdrawal.status]?.badge;

        const formattedPayoutDetails =
            isJSONParsable(withdrawal.payout_details)
                ? renderPayoutDetails(safeJSONParse(withdrawal.payout_details))
                : (typeof withdrawal.payout_details === "object")
                    ? renderPayoutDetails(withdrawal.payout_details)
                    : withdrawal.payout_details || "NA";

        tableBody.append(
            `
            <tr data-id=${withdrawal.id}>
                ${path === "/customer-withdrawals" || path === "/pending-customer-withdrawals"
                ? `<td class="p-2">
                        <input type="checkbox" class="row-checkbox cursor-pointer" value="${withdrawal.id}">
                    </td>`
                : ""}
                <td># ${withdrawal.id ?? "NA"}</td>
                <td>${`${withdrawal.customer_id} - ${withdrawal.customer_name}` ?? "NA"}</td>
                <td>${withdrawal.method ?? "NA"}</td>
                <td>${withdrawal.withdrawal_amount ?? "NA"}</td>
                <td>${formattedPayoutDetails}</td>
                <td>${withdrawalStatusBadge}</td>
                <td>${withdrawal.created_at ?? "NA"}</td>
                <td><button class="btn btn-warning btn-sm editBtn" data-id="${withdrawal.id}" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button></td>
            </tr>
        `);
    });
}

export const removeDataTableRow = (dataTable, ids) =>
{
    ids.forEach((id) =>
    {
        const row = $(`tr[data-id="${id}"]`);
        dataTable.row(row).remove().draw(false);
    });
};

export const renderCustomerWithdrawalsFilter = (withdrawals, dataTable) => 
{
    const path = window.location.pathname;
    const rows = withdrawals.map((withdrawal, index) => 
    {
        const formattedPayoutDetails =
            isJSONParsable(withdrawal.payout_details)
                ? renderPayoutDetails(safeJSONParse(withdrawal.payout_details))
                : (typeof withdrawal.payout_details === "object")
                    ? renderPayoutDetails(withdrawal.payout_details)
                    : withdrawal.payout_details || "NA";

        if (path === "/customer-withdrawals")
        {
            return (
                [
                    `<input type="checkbox" class="row-checkbox cursor-pointer" value="${withdrawal.id}">`,
                    `# ${withdrawal.id ?? "NA"}`,
                    `${withdrawal.customer_id} - ${withdrawal.customer_name}`,
                    withdrawal.method ?? '',
                    withdrawal.withdrawal_amount ?? '',
                    formattedPayoutDetails,
                    WITHDRAWAL_STATUS[withdrawal.status]?.badge ?? '',
                    withdrawal.created_at ?? '',
                    `
                <button class="btn btn-warning btn-sm editBtn" data-id="${withdrawal.id}" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>
            `
                ]);
        }

        return (
            [
                `# ${withdrawal.id ?? "NA"}`,
                `${withdrawal.customer_id} - ${withdrawal.customer_name}`,
                withdrawal.method ?? '',
                withdrawal.withdrawal_amount ?? '',
                formattedPayoutDetails,
                WITHDRAWAL_STATUS[withdrawal.status]?.badge ?? '',
                withdrawal.created_at ?? '',
                `
                <button class="btn btn-warning btn-sm editBtn" data-id="${withdrawal.id}" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>
            `
            ]);
    });

    dataTable.clear();
    const addedRows = dataTable.rows.add(rows);
    dataTable.draw();

    const nodes = addedRows.nodes();
    for (let i = 0; i < nodes.length; i++)
    {
        $(nodes[i]).attr("data-id", withdrawals[i].id);
    }
}

export const renderTotalDateRangeWithdrawals = (data, container) =>
{
    container.empty();
    container.html(
        `
        <div class="card-body px-4 py-1">
            <h6 class="fs-5 fw-semibold mb-1">Total Withdrawals Amount <small class="text-muted fw-normal">(Date Range)</small></h6>
            <div class="fw-semibold fs-6 text-success mb-0">
                <div id="dateRangeWithdrawalSpinner" class="d-none d-flex justify-content-start align-items-center my-4">
                    <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                </div>
                <span id="dateRangeWithdrawalValue">฿ ${data.withdrawal_amount || "0.00"}</span>
            </div>
        </div>
        `
    );
}

export const renderTotalPendingWithdrawalsAmount = (data, container) =>
{
    container.empty();
    container.html(
        `
        <div class="card-body px-4 py-1">
            <h6 class="fs-5 fw-semibold mb-1">Total Pending Withdrawals Amount</h6>
            <div class="fw-semibold fs-6 text-success mb-0">
                ฿ <span id="totalPendingWithdrawalsValue">${data.total_pending || "0.00"}</span>
            </div>
        </div>
        `
    );
}

export const addDataTableRow = (dataTable, data) =>
{
    const formattedPayoutDetails =
        isJSONParsable(data.payout_details)
            ? renderPayoutDetails(safeJSONParse(data.payout_details))
            : (typeof data.payout_details === "object")
                ? renderPayoutDetails(data.payout_details)
                : data.payout_details || "NA";

    const rowNode = dataTable.row.add([
        `# ${data.id ?? "NA"}`,
        `${data.customer_id} - ${data.customer_name}`,
        data.method ?? "NA",
        data.withdrawal_amount ?? "NA",
        formattedPayoutDetails,
        WITHDRAWAL_STATUS[data.status]?.badge ?? "NA",
        data.created_at ?? "NA",
        `
        <button class="btn btn-warning btn-sm editBtn" data-id="${data.id}" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>
        `
    ]).draw(false).node();

    $(rowNode).attr("data-id", data.id);
};

export const editDataTableRow = (dataTable, data) =>
{
    console.log(data);
    const path = window.location.pathname;
    const rowSelector = `tr[data-id="${data.id}"]`;
    const withdrawalStatusBadge = WITHDRAWAL_STATUS[data.status]?.badge;

    const formattedPayoutDetails =
        isJSONParsable(data.payout_details)
            ? renderPayoutDetails(safeJSONParse(data.payout_details))
            : (typeof data.payout_details === "object")
                ? renderPayoutDetails(data.payout_details)
                : data.payout_details || "NA";

    const dataToRender = [
        `# ${data.id ?? "NA"}`,
        `${data.customer_id} - ${data.customer_name}`,
        data.method ?? "NA",
        data.withdrawal_amount ?? "NA",
        formattedPayoutDetails,
        withdrawalStatusBadge,
        data.created_at ?? "",
        `
        <button class="btn btn-warning btn-sm editBtn" data-id="${data.id}" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>
        `
    ];

    (path === "/customer-withdrawals" || path === "/pending-customer-withdrawals") ? dataToRender.unshift(`<input type="checkbox" class="row-checkbox cursor-pointer" value="${data.id}">`) : null;

    dataTable.row(rowSelector).data(dataToRender).draw(false);
};

export const editDataTableRowStatus = (dataTable, ids, status) =>
{
    ids.forEach((id) =>
    {
        const rowSelector = `tr[data-id="${id}"]`;
        const withdrawalStatusBadge = WITHDRAWAL_STATUS[status]?.badge;
        dataTable.cell(rowSelector, 6).data(withdrawalStatusBadge).draw(false);
    });
}

export const createKVRow = (key = "", value = "") =>
{
    return `
      <div class="row g-2 align-items-center kv-row mb-2">
        <div class="col-md-5">
          <input type="text" name="keys[]" class="form-control" placeholder="Key" value="${key}" required>
        </div>
        <div class="col-md-5">
          <input type="text" name="values[]" class="form-control" placeholder="Value" value="${value}" required>
        </div>
        <div class="col-md-2 text-center">
            <button type="button" class="btn btn-danger btn-sm py-1 remove-row">
                <i class="ti ti-trash fs-5"></i>
            </button>
        </div>
      </div>
    `;
}

// For All Customer Withdrawals

export const renderTotalAllWithdrawalsAmount = (data, container) =>
{
    container.empty();
    container.html(
        `
        <div class="card-body px-4 py-1">
            <h6 class="fs-5 fw-semibold mb-1">Total Withdrawals Amount</h6>
            <div class="fw-semibold fs-6 text-success mb-0">
                ฿ <span id="totalAllWithdrawalsValue">${data.total_amount || "0.00"}</span>
            </div>
        </div>
        `
    );
}