import type { GameBackupDownload } from "../game-backup/type";

export function downloadGameBackup(download: GameBackupDownload): void {
  const objectUrl = URL.createObjectURL(
    new Blob([download.json], { type: "application/json;charset=utf-8" }),
  );
  const link = document.createElement("a");

  link.download = download.fileName;
  link.href = objectUrl;
  link.click();
  URL.revokeObjectURL(objectUrl);
}
