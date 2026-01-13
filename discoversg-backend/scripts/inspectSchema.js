require('dotenv').config();

const db = require('../database');

(async () => {
    const [dbRow] = await db.execute('SELECT DATABASE() AS db');
    // eslint-disable-next-line no-console
    console.log('DB', dbRow?.[0]?.db);

    const [tables] = await db.execute(
        'SELECT table_name AS name FROM information_schema.tables WHERE table_schema = DATABASE() ORDER BY table_name'
    );
    // eslint-disable-next-line no-console
    console.log('TABLES', tables.map((t) => t.name));

    const interesting = ['booking', 'activitysession', 'activity', 'itinerary', 'itineraryitem', 'payment'];

    for (const table of interesting) {
        const [cols] = await db.execute(
            'SELECT column_name AS col, data_type AS type, column_type AS fullType, is_nullable AS nullable, column_key AS keyType ' +
            'FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ? ORDER BY ordinal_position',
            [table]
        );

        // eslint-disable-next-line no-console
        console.log(`\nCOLUMNS ${table} (${cols.length})`);
        // eslint-disable-next-line no-console
        console.table(cols);
    }

    process.exit(0);
})().catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
});
