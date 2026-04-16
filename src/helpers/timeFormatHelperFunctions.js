export const formatTransactionTime = (timestamp, minutes, timezone = "Asia/Bangkok") =>
{
    const endTimeUTC = new Date(timestamp);
    const durationMs = minutes * 60 * 1000;
    const startTimeUTC = new Date(endTimeUTC.getTime() - durationMs);

    const dateFormatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: timezone,
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });

    // Formatter for: 01:15:05 PM
    const timeFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });

    const durationMinutes = Math.floor(minutes);
    const durationSeconds = Math.round((minutes % 1) * 60);

    return {
        end_date: dateFormatter.format(endTimeUTC),
        start_time: timeFormatter.format(startTimeUTC),
        end_time: timeFormatter.format(endTimeUTC),
        duration: `${durationMinutes} min ${durationSeconds} sec`
    };
}

// export const formatDateTimeByTimezone = (timestamp, timezone = "Asia/Bangkok") =>
// {
//     const date = new Date(timestamp);

//     const dateFormatter = new Intl.DateTimeFormat("en-GB", {
//         timeZone: timezone,
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric"
//     });

//     const timeFormatter = new Intl.DateTimeFormat("en-US", {
//         timeZone: timezone,
//         hour: "2-digit",
//         minute: "2-digit",
//         second: "2-digit",
//         hour12: true
//     });

//     return {
//         date: dateFormatter.format(date),
//         time: timeFormatter.format(date)
//     };
// };

export const formatDateTimeByTimezone = (timestamp, locale = "en-GB", timezone = "Asia/Bangkok") =>
{
    return new Intl.DateTimeFormat(locale, {
        timeZone: timezone,
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    }).format(new Date(timestamp));
};

export const getISODateByTimezone = (timestamp, timezone = "Asia/Bangkok") =>
{
    const date = new Date(timestamp);

    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    }).formatToParts(date);

    const get = (type) => parts.find(p => p.type === type).value;

    return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}.000Z`;
};

export const formatDate = (date, timezone = "Asia/Bangkok") =>
{
    const dateFormatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: timezone,
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });

    return dateFormatter.format(date);
}

export const convertToMinutes = (timeString) =>
{
    if (!timeString) return 0;

    const [minutes, seconds] = timeString.split(':').map(Number);

    if (isNaN(minutes) || isNaN(seconds))
    {
        throw new Error('Invalid time format');
    }

    return Number((minutes + seconds / 60).toFixed(2));
}

export const getRelativeTime = (dateTime) =>
{
    if (!dateTime) return "";

    const diffMs = Date.now() - new Date(dateTime).getTime();
    const mins = Math.floor(diffMs / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);

    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min ago`;
    if (hrs < 24) return `${hrs} ${hrs === 1 ? "hour" : "hours"} ago`;
    return `${days} ${days === 1 ? "day" : "days"} ago`;
}

export const formatMinutesToClock = (totalMinutes) =>
{
    const mins = Math.floor(totalMinutes);

    const secs = Math.round((totalMinutes - mins) * 60);

    const formattedMins = String(mins).padStart(1, '0');
    const formattedSecs = String(secs).padStart(2, '0');

    return `${formattedMins}:${formattedSecs}`;
};