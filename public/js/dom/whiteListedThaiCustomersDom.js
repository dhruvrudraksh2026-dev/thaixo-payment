export const renderWhiteListedThaiCustomers = (data, tableBody) =>
{
    tableBody.empty();
    data.forEach((customer) => 
    {
        tableBody.append(`
            <tr data-id=${customer.id}>
                <td>#${customer.id}</td>
                <td>${customer.name}</td>
                <td>${customer.mobile_no}</td>
                <td><span class="badge text-bg-${customer.status ? "success" : "danger"}">${customer.status ? "Active" : "Inactive"}</span></td>
                <td><span class="badge text-bg-${customer.suspended ? "success" : "danger"}">${customer.suspended ? "Yes" : "No"}</span></td>
                <td><span class="badge text-bg-${customer.white_listed ? "success" : "danger"}">${customer.white_listed ? "Yes" : "No"}</span></td>
                <td>
                   <a href="/customer-transactions-details/${customer.id}"> <button class="btn btn-primary m-1 viewButton" data-id="${customer.id}">View</button> </a>
                </td>
            </tr>
        `);
    });
}

export const renderCustomerInfo = (data, container) =>
{
    container.empty();
    const { id, name, dob, gender, mobile_no, status, about_self, coins, suspended, white_listed } = data;
    const statusBadge = status === 1 ? `<span class="badge bg-success px-3 py-2">Active</span>` : `<span class="badge bg-danger px-3 py-2">Inactive</span>`;
    const whiteListedBadge = white_listed === 1 ? `<span class="badge bg-success px-4 py-1">Yes</span>` : `<span class="badge bg-danger px-4 py-1">No</span>`;
    const cardHTML = `
        <div class="card shadow-sm border-0 px-4 py-3 mb-0">
        <div class="d-flex align-items-center justify-content-between position-relative flex-wrap">

            <!-- Left: Primary Info -->
            <div class="d-flex align-items-center gap-3">
            <div>
                <h6 class="mb-1 fw-semibold">${name || "N/A"}</h6>
                <div class="d-flex align-items-center gap-2">
                    <small class="text-muted">ID: ${id || "-"}</small>
                    ${statusBadge}
                    <!-- Suspended Badge -->
                    ${suspended ? `
                    <div class="badge bg-danger-subtle text-danger fw-semibold px-3 py-2">
                        Suspended
                    </div>
                    ` : ""}
                </div>
            </div>
            </div>

            <!-- Middle: Details -->
            <div class="d-flex gap-5 align-items-center flex-wrap mt-3 mt-md-0">

            <div class="text-center">
                <small class="text-uppercase text-muted">Gender</small>
                <div class="fw-medium">${gender || "N/A"}</div>
            </div>

            <div class="text-center">
                <small class="text-uppercase text-muted">DOB</small>
                <div class="fw-medium">${dob || "N/A"}</div>
            </div>

            <div class="text-center">
                <small class="text-uppercase text-muted">Mobile</small>
                <div class="fw-medium">${mobile_no || "N/A"}</div>
            </div>

            <div style="max-width: 240px;">
                <small class="text-uppercase text-muted">Bio</small>
                <div class="fw-medium text-truncate">
                ${about_self || "N/A"}
                </div>
            </div>

            <div style="max-width: 240px;">
                <small class="text-uppercase text-muted">Coins</small>
                <div class="fw-medium text-truncate" id="coinsText">
                ${coins}
                </div>
            </div>

            <div class="text-center">
                <small class="text-uppercase text-black fw-semibold">White Listed</small>
                <div class="fw-medium" id="white-listed-badge">${whiteListedBadge}</div>
            </div>            
            </div>
        </div>
        </div>
    `;

    container.append(cardHTML);
};