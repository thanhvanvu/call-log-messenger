// Helper function to read a file as text
const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = (e) => resolve(e?.target?.result as string);
    reader.onerror = () => reject(new Error("Failed to read the file."));
  });
};

const convertTimeToWholeHour = (timeString: string) => {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return hours + minutes / 60 + seconds / 3600;
};

function decode(s: string) {
  const decoder = new TextDecoder();
  const charCodes = Array.from(s).map((char) => char.charCodeAt(0));
  return decoder.decode(new Uint8Array(charCodes));
}

const convertTimeStampToDate = (number: number) => {
  const hours = Math.floor(number / 3600);
  const minutes = Math.floor((number % 3600) / 60);
  const seconds = number % 60;
  const formattedDuration = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return formattedDuration;
};

export { readFileAsText, convertTimeToWholeHour, decode, convertTimeStampToDate };
