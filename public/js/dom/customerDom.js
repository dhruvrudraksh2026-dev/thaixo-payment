const verificationStatusColors = {
    "NOT_STARTED": { class: "bg-secondary", text: "Not Started", iconClass: "fa-solid fa-ban" },
    "PENDING": { class: "bg-warning text-dark", text: "Pending", iconClass: "fa-regular fa-hourglass" },
    "APPROVED": { class: "bg-success", text: "Approved", iconClass: "fa-regular fa-circle-check" },
    "REJECTED": { class: "bg-danger", text: "Rejected", iconClass: "fa-regular fa-circle-xmark" }
};

export const renderCustomers = (data, tableBody) => 
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
                <td><span class="badge text-bg-${customer.is_creator ? "success" : "danger"}">${customer.is_creator ? "Yes" : "No"}</span></td>
                <td>
                   <a href="/customer-transactions-details/${customer.id}"> <button class="btn btn-primary m-1 viewButton" data-id="${customer.id}">View</button> </a>
                </td>
            </tr>
        `);
    });
};

function renderLegalDetails(containerId, data)
{
    const $container = $("#" + containerId);
    $container.empty();

    if (Object.keys(data).length === 0)
    {
        $container.append(`
            <div class="d-flex justify-content-center py-2 w-100">
                <span class="text-muted">No Legal Details</span>
            </div>
        `);
        return;
    }

    $.each(data, function (key, value)
    {
        const row = `
            <div class="d-flex justify-content-between border-bottom py-2 w-100">
                <span class="fw-semibold text-capitalize fs-6">${key.replace(/_/g, " ")}</span>
                <span class="text-muted fs-6">${value ?? "-"}</span>
            </div>
        `;

        $container.append(row);
    });
}

export const renderCustomerInfo = (data, container) =>
{
    container.empty();
    const { id, name, dob, gender, mobile_no, status, about_self, coins, suspended, is_creator, photos, customer_legal_details, is_legal_details_verified, legal_details_verification_status, is_from_agency } = data;
    const statusBadge = status === 1 ? `<span class="badge bg-success px-3 py-2">Active</span>` : `<span class="badge bg-danger px-3 py-2">Inactive</span>`;
    const creatorBadge = is_creator === 1 ? `<span class="badge bg-success px-4 py-1">Yes</span>` : `<span class="badge bg-danger px-4 py-1">No</span>`;

    const isCreator = is_creator == 1;
    let customerLegalPhotos = (customer_legal_details?.legal_id_image && customer_legal_details?.passbook_image) ? [customer_legal_details.legal_id_image, customer_legal_details.passbook_image] : [];
    if (is_from_agency === 1)
    {
        customerLegalPhotos.push(customer_legal_details.passport_image);
    }

    const customerLegalDetailsJson = Object.keys(customer_legal_details).length > 0 ? { bank_name: customer_legal_details?.bank_name, legal_name: customer_legal_details?.legal_name, document_type: customer_legal_details?.document_type, bank_account_no: customer_legal_details?.bank_account_no } : {};

    const isCustomerLegalDetailsVerificationPending = legal_details_verification_status === "PENDING" && !is_legal_details_verified;
    const legalDetailsVerificationStatus = verificationStatusColors[legal_details_verification_status] || verificationStatusColors["NOT_STARTED"];

    const agencyCreatorBadge = is_from_agency === 1 ? `<span class="badge bg-success px-3 py-2">Agency Creator</span>` : ``;

    const renderPhotos = (arr, galleryName) =>
        arr && arr.length
            ? arr.map((photo, index) => `
        <a href="${photo}"
           class="glightbox-customer"
           target="_blank"
           data-gallery="${galleryName}"
           data-title="Legal Image ${index + 1}">
           
           <img src="${photo}"
                class="rounded border"
                style="max-width:350px; max-height:350px; object-fit:cover; cursor:pointer;">
        </a>
      `).join("")
            : `<span class="text-muted">No Photos</span>`;

    const cardHTML = `
        <div class="card shadow-sm border-0 px-4 py-3 mb-0">
            <div class="d-flex align-items-center justify-content-between position-relative flex-wrap">

                <!-- Left: Primary Info -->
                <div class="d-flex align-items-center gap-3">
                    <div>
                        <h6 class="mb-1 fw-semibold">${name || "N/A"}</h6>
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <small class="text-muted">ID: ${id || "-"}</small>
                            ${statusBadge}
                            <!-- Suspended Badge -->
                            ${suspended ? `
                            <div class="badge bg-danger-subtle text-danger fw-semibold px-3 py-2">
                                Suspended
                            </div>
                            ` : ""}
                            ${agencyCreatorBadge}
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

            <hr>

            <div class="d-flex gap-5 align-items-center justify-content-start flex-wrap mt-3 mt-md-0">
                <div id="isLegalDetailsVerified" class="text-center">
                    <div>
                        <small class="text-uppercase text-black fw-semibold">Legal Details Verification</small>
                    </div>
                    <div id="isCustomerLegalDetailsVerifiedBadge">
                        ${is_legal_details_verified ? `
                            <span class="badge bg-success p-2 fs-6">
                                <i class="fa-regular fa-circle-check"></i>
                                Verified
                            </span>
                        `: `
                            <span class="badge bg-danger p-2 fs-6">
                                <i class="fa-regular fa-circle-xmark"></i>
                                Not Verified
                            </span>
                        `}
                    </div>
                </div>

                <div id="isLegalDetailsVerifiedStatus" class="text-center">
                    <div>
                        <small class="text-uppercase text-black fw-semibold">Legal Details Verification Status</small>
                    </div>
                    <div id="customerLegalDetailsVerificationStatus">
                        <span class="badge rounded-pill fs-6 px-3 py-2 ${legalDetailsVerificationStatus.class}">
                            <i class="${legalDetailsVerificationStatus.iconClass} me-1"></i>
                            ${legalDetailsVerificationStatus.text}
                        </span>
                    </div>
                </div>
            </div>

            ${isCreator ? `
                <hr>
                <div class="mb-3 p-1 w-100">
                    <h4 class="fw-bold mb-3">Customer Legal Details</h4>
                    <div id="customerLegalDetails" class="row w-100 m-0">
                        <div id="customerLegalPhotos" class="col-12 col-md-5 d-flex flex-wrap gap-3 justify-content-center align-items-center p-0 pe-md-3 mb-4 mb-md-0">${renderPhotos(customerLegalPhotos, `customer-legal-photos-${id}`)}</div>
                        <div class="col-12 col-md-1 p-0 ps-md-3 d-flex flex-column justify-content-center">
                            <div style="width: 0.5%; height: 100%; background-color: #6d6d6dff; align-self: stretch; margin: 0 1px;"></div>
                        </div>
                        <div id="customerLegalDetailsJson" class="col-12 col-md-6 p-0 ps-md-3 d-flex flex-column justify-content-center"></div>
                    </div>
                </div>
                <hr>
                ${!is_from_agency && (isCustomerLegalDetailsVerificationPending || (["PENDING", "APPROVED"].includes(legal_details_verification_status))) ? `
                    <div class="row mb-3" id="customerLegalDetailsVerificationBtns">
                        <h4 class="fw-bold mb-3">Customer Legal Details Verification</h4>
                        <div class="col d-flex align-items-center justify-content-start gap-3 flex-wrap">                        
                            <!-- Approve Customer Legal Details Verification Request Button -->
                            <button type="button" class="btn btn-success me-2 text-truncate" data-id="${id}" id="approveCustomerLegalDetailsBtn">
                                <span class="spinner-border spinner-border-sm d-none" id="approveCustomerLegalDetailsSpinner"></span>
                                <i class="fa-regular fa-circle-check"></i>
                                Approve Customer Legal Details Verification
                            </button>

                            <!-- Reject Customer Legal Details Verification Request Button -->
                            <button type="button" class="btn btn-danger" data-id="${id}" id="rejectCustomerLegalDetailsBtn">
                                <span class="spinner-border spinner-border-sm d-none" id="rejectCustomerLegalDetailsSpinner"></span>
                                <i class="fa-regular fa-circle-xmark"></i>
                                Reject Customer Legal Details Verification
                            </button>
                        </div>
                    </div>
                    <hr>
                `: ``}
            ` : ``}
        </div>
    `;

    container.append(cardHTML);

    renderLegalDetails("customerLegalDetailsJson", customerLegalDetailsJson);
};

export const handlerCustomerLegalDetailsVerificationStatusUpdate = (status) =>
{
    updateAndRenderCustomerLegalDetailsVerificationStatus(status ? "APPROVED" : "REJECTED");
    updateAndRenderIsCustomerLegalDetailsVerified(status ? true : false);
    if (!status)
    {
        renderCustomerLegalPhotosDeletion();
        $("#customerLegalDetailsVerificationBtns").addClass("d-none");
        renderLegalDetails("customerLegalDetailsJson", {});
    }
}

export const renderCustomerLegalPhotosDeletion = () =>
{
    const photosDivison = $("#customerLegalPhotos");
    photosDivison.html(
        `<span class="text-muted">No Photos</span>`
    );
}

export const updateAndRenderIsCustomerLegalDetailsVerified = (isCustomerLegalDetailsVerified) =>
{
    const badge = $("#isCustomerLegalDetailsVerifiedBadge");
    if (isCustomerLegalDetailsVerified)
    {
        badge.html(`
      <span class="badge bg-success p-2 fs-6">
         <i class="fa-regular fa-circle-check"></i>
         Verified
      </span>
   `);
    } else
    {
        badge.html(`
      <span class="badge bg-danger p-2 fs-6">
         <i class="fa-regular fa-circle-xmark"></i>
         Not Verified
      </span>
         `);
    }
}

export const updateAndRenderCustomerLegalDetailsVerificationStatus = (status) =>
{
    const verificationStatus = verificationStatusColors[status] || verificationStatusColors["NOT_STARTED"];
    const verificationStatusDivison = $("#customerLegalDetailsVerificationStatus");
    verificationStatusDivison.html(
        `
      <span class="badge rounded-pill fs-6 px-3 py-2 ${verificationStatus.class}">
         <i class="${verificationStatus.iconClass} me-1"></i>
         ${verificationStatus.text}
      </span>
      `
    );
}