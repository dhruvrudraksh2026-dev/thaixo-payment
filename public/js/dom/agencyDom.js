import { codes } from "../utils/country_codes.js";

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
                    <a href="/agency-details/${agency.id}"> <button class="btn btn-primary btn-sm m-1 viewButton" data-id="${agency.id}">View</button> </a>
                    <button class="btn btn-info btn-sm m-1 copyAgencyCodeBtn text-white" data-code="${agency.id || ''}">
                        <i class="ti ti-copy"></i> Code
                    </button>
                </td>
            </tr>
        `);
    });
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
        <a href="/agency-details/${data.id}"> <button class="btn btn-primary btn-sm m-1 viewButton" data-id="${data.id}">View</button> </a>
        <button class="btn btn-info btn-sm m-1 copyAgencyCodeBtn text-white" data-code="${data.id || ''}"><i class="ti ti-copy"></i> Code</button>
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
        <a href="/agency-details/${data.id}"> <button class="btn btn-primary btn-sm m-1 viewButton" data-id="${data.id}">View</button> </a>
        <button class="btn btn-info btn-sm m-1 copyAgencyCodeBtn text-white" data-code="${data.id || ''}"><i class="ti ti-copy"></i> Code</button>
        `
    ];

    const rowSelector = $(`tr[data-id="${data.id}"]`);
    dataTable.row(rowSelector).data(dataToRender).draw(false);
};

// ===============================================================================================================
// For Agency Info Page
// ===============================================================================================================
export const renderAgencyInfo = (data, container) => 
{
    container.empty();

    const { id, name, owner_name, bank_name, bank_account_number, photo_id, status } = data;

    const statusBadge = status === 1
        ? `<span class="badge bg-success px-3 py-2">Active</span>`
        : `<span class="badge bg-danger px-3 py-2">Inactive</span>`;

    const cardHTML = `
        <div class="card shadow-sm border-0 px-4 py-3 mb-3">
        <div class="d-flex align-items-center justify-content-between flex-wrap">

            <!-- Left -->
            <div class="d-flex align-items-center gap-3">

                <div class="agency-photo cursor-pointer"                     
                     data-photo="${photo_id}">
                     
                     <a href="${photo_id || '/assets/icon/default.png'}"
                        class="glightbox-customer"
                        data-gallery="profile-${id}"
                        data-title="${name} - Agency Photo">

                        <img src="${photo_id || '/assets/icon/default.png'}"
                            class="rounded border"
                         style="width:250px;object-fit:cover;cursor:pointer;">
                     </a>
                </div>

                <div>
                    <h6 class="mb-1 fw-semibold">${name || "N/A"}</h6>

                    <div class="d-flex align-items-center gap-2">
                        <small class="text-muted">ID: ${id}</small>
                        ${statusBadge}
                    </div>
                </div>
            </div>

            <!-- Details -->
            <div class="d-flex gap-5 align-items-center flex-wrap mt-3 mt-md-0">

                <div class="text-center">
                    <small class="text-uppercase text-muted">Owner</small>
                    <div class="fw-medium">${owner_name || "N/A"}</div>
                </div>

                <div class="text-center">
                    <small class="text-uppercase text-muted">Bank</small>
                    <div class="fw-medium">${bank_name || "N/A"}</div>
                </div>

                <div class="text-center">
                    <small class="text-uppercase text-muted">Account</small>
                    <div class="fw-medium">${bank_account_number || "N/A"}</div>
                </div>

            </div>
        </div>
        </div>        
    `;

    container.append(cardHTML);
};

export const renderAgencyCustomers = (data, tableBody) => 
{
    tableBody.empty();
    data.forEach((customer) => 
    {
        const country = codes.find(c => c.countryCodes[0] === customer.country_code.replace("+", ""));
        tableBody.append(`
            <tr data-id=${customer.id}>
                <td>#${customer.id}</td>
                <td>${customer.name}</td>
                <td>${customer.email || "N/A"}</td>
                <td>${`+${country.countryCodes[0]} - <span>${country.country}</span>` || "N/A"}</td>
                <td>${customer.mobile_no}</td>
                <td><span class="badge text-bg-${customer.status ? "success" : "danger"}">${customer.status ? "Active" : "Inactive"}</span></td>
                <td><span class="badge text-bg-${customer.is_verified ? "success" : "danger"}">${customer.is_verified ? "Yes" : "No"}</span></td>
                <td><span class="badge text-bg-${customer.is_creator ? "success" : "danger"}">${customer.is_creator ? "Yes" : "No"}</span></td>
                <td><span class="badge text-bg-${customer.suspended ? "success" : "danger"}">${customer.suspended ? "Yes" : "No"}</span></td>
                <td>                    
                    <a href="/customer-transactions-details/${customer.id}"> <button class="btn btn-primary btn-sm m-1 viewButton" data-id="${customer.id}">View</button> </a>
                </td>
            </tr>
        `);
    });
};
// ===============================================================================================================