const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgres://postgres.rdheotxnkhyokzhdirhm:Geh1CDjAjVBpEQmY@aws-0-us-east-1.pooler.supabase.com:6543/postgres', ssl: { rejectUnauthorized: false } });
const q = 'insert into "views" ("slug", "count") values (\'test2\', 1) on conflict ("slug") do update set "count" = views.count + 1 returning "slug", "count"';
pool.query(q).then(res => { console.log('SUCCESS:', res.rows); process.exit(0); }).catch(err => { console.error('ERROR:', err); process.exit(1); });
