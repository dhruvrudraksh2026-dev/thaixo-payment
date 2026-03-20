import dotenv from "dotenv";
dotenv.config();

export function datetimeConverter(uiDateTime)
{
    if (!uiDateTime) return null;

    // Expected: "27 Jan 2026, 04:47:13 PM"
    const regex = /^(\d{2}) (\w{3}) (\d{4}), (\d{2}):(\d{2}):(\d{2}) (AM|PM)$/;
    const match = uiDateTime.match(regex);

    if (!match)
    {
        throw new Error('Invalid UI datetime format');
    }

    let [
        _,
        day,
        monStr,
        year,
        hour,
        min,
        sec,
        meridiem
    ] = match;

    const monthMap = {
        Jan: '01', Feb: '02', Mar: '03', Apr: '04',
        May: '05', Jun: '06', Jul: '07', Aug: '08',
        Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    };

    const month = monthMap[monStr];
    if (!month)
    {
        throw new Error('Invalid month');
    }

    hour = parseInt(hour, 10);

    // Convert to 24-hour
    if (meridiem === 'PM' && hour !== 12) hour += 12;
    if (meridiem === 'AM' && hour === 12) hour = 0;

    const hh = String(hour).padStart(2, '0');

    return `${year}-${month}-${day} ${hh}:${min}:${sec}`;
}

// Must Include UserId in Folder Name
export const getImageUrl = (folderName, fileName) =>
{
    if (!fileName) return null;
    return `${process.env.BASE_IMAGE_URL}/${folderName}/${fileName}`;
};