export const renderAgencies = (data, tableBody) => 
{
    tableBody.empty();
    data.forEach((agency) => 
    {
        tableBody.append(`
            <tr data-id=${agency.id}>
                <td>#${agency.id}</td>
                <td>${agency.name}</td>
                <td>${agency.owner_name}</td>
                <td>
                    <image src="${agency.photo_id}" alt="Photo Id" width="150" style="object-fit: cover;">
                </td>
                <td>${agency.bank_name}</td>
                <td>${agency.bank_account_number}</td>
                <td><span class="badge text-bg-${agency.status ? "success" : "danger"}">${agency.status ? "Active" : "Inactive"}</span></td>
                <td>
                    <button class="btn btn-warning btn-sm editBtn" data-id="${agency.id}" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>
                </td>
            </tr>
        `);
    });
    // <td>
    // <a href="/agency-transactions-details/${agency.id}"> <button class="btn btn-primary m-1 viewButton" data-id="${agency.id}">View</button> </a>
    // </td>
};

export const addAgencyTableRow = (dataTable, data) =>
{
    const rowNode = dataTable.row.add([
        `# ${data.id ?? "NA"}`,
        `${data.name}`,
        `${data.owner_name}`,
        `<image src="${data.photo_id}" alt="Photo Id" width="150" style="object-fit: cover;">`,
        `${data.bank_name}`,
        `${data.bank_account_number}`,
        `<span class="badge text-bg-${data.status ? "success" : "danger"}">${data.status ? "Active" : "Inactive"}</span>`,
        `
        <button class="btn btn-warning btn-sm editBtn" data-id="${data.id}" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>
        `
    ]).draw(false).node();

    $(rowNode).attr("data-id", data.id);
};

export const editDataTableRow = (dataTable, data) =>
{
    const dataToRender = [
        `# ${data.id ?? "NA"}`,
        `${data.name}`,
        `${data.owner_name}`,
        `<image src="${data.photo_id}" alt="Photo Id" width="150" style="object-fit: cover;">`,
        `${data.bank_name}`,
        `${data.bank_account_number}`,
        `<span class="badge text-bg-${data.status ? "success" : "danger"}">${data.status ? "Active" : "Inactive"}</span>`,
        `
        <button class="btn btn-warning btn-sm editBtn" data-id="${data.id}" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>
        `
    ];

    const rowSelector = $(`tr[data-id="${data.id}"]`);
    dataTable.row(rowSelector).data(dataToRender).draw(false);
};

export const renderAgencyInfo = (data, container) =>
{
    container.empty();
    const { id, name, dob, gender, mobile_no, status, about_self, coins, suspended, is_creator } = data;
    const statusBadge = status === 1 ? `<span class="badge bg-success px-3 py-2">Active</span>` : `<span class="badge bg-danger px-3 py-2">Inactive</span>`;
    const creatorBadge = is_creator === 1 ? `<span class="badge bg-success px-4 py-1">Yes</span>` : `<span class="badge bg-danger px-4 py-1">No</span>`;
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
                <small class="text-uppercase text-black fw-semibold">Creator</small>
                <div class="fw-medium" id="creator-badge">${creatorBadge}</div>
            </div>            
            </div>
        </div>
        </div>
    `;

    container.append(cardHTML);
};