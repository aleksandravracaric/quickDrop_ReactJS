import { getBlob } from "firebase/storage"

export async function downloadFile(fileRef) {
    try {
        const fileBlob = await getBlob(fileRef)
        const url = URL.createObjectURL(fileBlob)

        const link = document.createElement("a")
        link.href = url

        const fileName = fileRef.name
        link.download = fileName

        document.body.appendChild(link)
        link.click()

        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    } catch (error) {
        console.log(`Download error: ${error}`)
    }
}