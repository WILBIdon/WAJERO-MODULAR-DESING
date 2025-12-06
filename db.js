import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Configurar conexión a PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Inicializar base de datos (crear tabla si no existe)
export async function initDB() {
    try {
        const client = await pool.connect();

        await client.query(`
      CREATE TABLE IF NOT EXISTS invitaciones (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Crear índice en slug para búsquedas rápidas
        await client.query(`
      CREATE INDEX IF NOT EXISTS idx_invitaciones_slug ON invitaciones(slug)
    `);

        client.release();
        console.log('✅ Base de datos inicializada correctamente');
    } catch (error) {
        console.error('❌ Error al inicializar la base de datos:', error);
        throw error;
    }
}

// Guardar una invitación
export async function saveInvitation(slug, data) {
    try {
        const client = await pool.connect();

        const query = `
      INSERT INTO invitaciones (slug, data)
      VALUES ($1, $2)
      ON CONFLICT (slug) 
      DO UPDATE SET data = $2, updated_at = CURRENT_TIMESTAMP
      RETURNING id, slug, created_at
    `;

        const result = await client.query(query, [slug, JSON.stringify(data)]);
        client.release();

        console.log(`✅ Invitación guardada: ${slug}`);
        return result.rows[0];
    } catch (error) {
        console.error('❌ Error al guardar invitación:', error);
        throw error;
    }
}

// Obtener una invitación por slug
export async function getInvitationBySlug(slug) {
    try {
        const client = await pool.connect();

        const query = `
      SELECT id, slug, data, created_at, updated_at
      FROM invitaciones
      WHERE slug = $1
    `;

        const result = await client.query(query, [slug]);
        client.release();

        if (result.rows.length === 0) {
            return null;
        }

        return result.rows[0].data;
    } catch (error) {
        console.error('❌ Error al obtener invitación:', error);
        throw error;
    }
}

// Obtener todas las invitaciones (opcional, para panel de admin futuro)
export async function getAllInvitations(limit = 50, offset = 0) {
    try {
        const client = await pool.connect();

        const query = `
      SELECT id, slug, created_at, updated_at
      FROM invitaciones
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;

        const result = await client.query(query, [limit, offset]);
        client.release();

        return result.rows;
    } catch (error) {
        console.error('❌ Error al obtener invitaciones:', error);
        throw error;
    }
}

// Cerrar pool de conexiones (para shutdown graceful)
export async function closeDB() {
    await pool.end();
    console.log('🔌 Conexión a base de datos cerrada');
}
