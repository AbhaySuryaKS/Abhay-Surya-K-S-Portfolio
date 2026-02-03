"use server" 
import fs from "fs";
import path from "path";

export async function getQuote() {
    try {
        const filePath = path.join(process.cwd(), "public", "quote.txt");
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const quotes = fileContent
            .split("\n")
            .map(line => line.replace(/^\d+\.\s*/, "").trim()) 
            .filter(line => line !== "");

        if (quotes.length === 0) {
            return "Innovation is the ability to see change as an opportunity, not a threat.";
        }
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    } catch (error) {
        return "Virtualization is the liberation of resources.";
    }
}