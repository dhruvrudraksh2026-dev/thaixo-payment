import fs from 'fs'
import path from 'path'

export const uploadFile = (file, filename, destination) =>
{
    if (!fs.existsSync(destination))
    {
        fs.mkdirSync(destination, { recursive: true });
    }
    const filePath = path.join(destination, filename);
    fs.writeFileSync(filePath, file.buffer);
}
export const copyFile = (oldPath, newPath, filename) =>
{
    if (!fs.existsSync(newPath))
    {
        fs.mkdirSync(newPath, { recursive: true })
    }
    const destination = path.join(newPath, filename);
    fs.copyFileSync(oldPath, destination);
}
export const deleteFile = (fileName, destination) =>
{
    const filePath = path.join(destination, fileName);

    if (fs.existsSync(filePath))
    {
        fs.unlinkSync(filePath);
    }
}
export const deleteFolder = (folderPath) =>
{
    if (fs.existsSync(folderPath))
    {
        fs.rmSync(folderPath, { recursive: true, force: true });
    }
}