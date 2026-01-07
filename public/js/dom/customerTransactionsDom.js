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
                <td>${transaction.created_at ?? ""}</td>
            </tr>
        `);
    });
}

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