// Importieren Sie die Kpathsea-Klasse und die FILE_FORMAT-Konstanten aus Ihrem Modul.
import { Kpathsea, FILE_FORMAT } from './index.js'

// Erstellen Sie eine neue Instanz.
// Dies funktioniert, wenn `kpsewhich` im System-PATH gefunden wird.
const kpse = new Kpathsea()

// Eine asynchrone Funktion, um die Dateisuche auszuführen.
async function findMyFiles() {
    try {
        // Finden einer TeX Font Metric-Datei
        const tfmPath = kpse.findFile("cmr10", FILE_FORMAT.TFM)
        console.log(`Gefunden: cmr10.tfm -> ${tfmPath}`)

        // Finden einer LaTeX-Klassendatei
        const styPath = await kpse.findFile("article.cls")
        console.log(`Gefunden: article.cls -> ${styPath}`)

        // Beispiel für eine Datei, die nicht gefunden wird (dies wird einen Fehler auslösen)
        console.log("\nTeste nun eine nicht existierende Datei...")
        await kpse.findFile("nonexistentfile.sty")

    } catch (error) {
        // Fängt den Fehler ab und gibt eine saubere Nachricht aus.
        console.error("Ein Fehler ist aufgetreten (wie erwartet):", error.message)
    }
}

// Rufen Sie die Funktion auf, um das Programm zu starten.
findMyFiles()