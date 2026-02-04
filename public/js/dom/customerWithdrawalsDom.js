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

export const renderPayoutDetails = (payoutDetails) =>
{
    return Object.entries(payoutDetails)
        .map(([key, value]) => `
            <div class="mt-1">
                <span class="fw-semibold">${key}:</span> 
                <span>${value}</span>
            </div>
        `).join('');
}

export const renderCustomerWithdrawals = (withdrawals, tableBody) =>
{
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
                <td># ${withdrawal.id ?? "NA"}</td>
                <td># ${withdrawal.customer_id ?? "NA"}</td>
                <td>${withdrawal.withdrawal_method ?? "NA"}</td>
                <td>${withdrawal.withdrawal_amount ?? "NA"}</td>
                <td>${formattedPayoutDetails}</td>
                <td>${withdrawalStatusBadge}</td>
                <td>${withdrawal.created_at ?? "NA"}</td>
                <td><button class="btn btn-warning btn-sm editBtn" data-id="${withdrawal.id}" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button></td>
            </tr>
        `);
    });
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
        `# ${data.customer_id ?? "NA"}`,
        data.withdrawal_method ?? "NA",
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
    const rowSelector = `tr[data-id="${data.id}"]`;
    const withdrawalStatusBadge = WITHDRAWAL_STATUS[data.status]?.badge;

    const formattedPayoutDetails =
        isJSONParsable(data.payout_details)
            ? renderPayoutDetails(safeJSONParse(data.payout_details))
            : (typeof data.payout_details === "object")
                ? renderPayoutDetails(data.payout_details)
                : data.payout_details || "NA";

    dataTable.row(rowSelector).data([
        `# ${data.id ?? "NA"}`,
        `# ${data.customer_id ?? "NA"}`,
        data.withdrawal_method ?? "NA",
        data.withdrawal_amount ?? "NA",
        formattedPayoutDetails,
        withdrawalStatusBadge,
        data.created_at ?? "",
        `
        <button class="btn btn-warning btn-sm editBtn" data-id="${data.id}" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>
        `
    ]).draw(false);
};