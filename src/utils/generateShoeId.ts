import { prismaClient } from "../main";

/**
 * Generuje losowe ID o długości 12 znaków składające się z cyfr i liter (A-Z, a-z, 0-9)
 * Sprawdza unikatowość w bazie danych i regeneruje jeśli ID już istnieje
 */
export async function generateShoeId(): Promise<string> {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let isUnique = false;
  let generatedId = "";

  while (!isUnique) {
    // Generowanie 12-znakowego ID
    generatedId = "";
    for (let i = 0; i < 12; i++) {
      generatedId += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    // Sprawdzenie unikalności w bazie danych
    const existingShoe = await prismaClient.shoe.findUnique({
      where: {
        id: generatedId,
      },
    });

    if (!existingShoe) {
      isUnique = true;
    }
  }

  return generatedId;
}
