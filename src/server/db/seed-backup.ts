import { db } from "./index";
import { users } from "./schema";

async function main() {
    console.log('Start seeding!');

    await db.insert(users).values({
        name: 'Superadmin',
        email: 'kacamatakoe.store@gmail.com',
        emailVerified: new Date(),
        role: 'superadmin',
    });

    console.log('Seed complete!');
}

await main();