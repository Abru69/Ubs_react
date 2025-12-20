// src/utils/utils.js

/**
 * Obtiene el nombre del barbero a partir de su ID.
 * @param {string} barberoId - ID del barbero.
 * @param {Array} barberosArray - Lista completa de barberos.
 * @returns {string} Nombre del barbero.
 */
export const getBarberName = (barberoId, barberosArray) => {
    const barbero = barberosArray.find(b => b.id === barberoId);
    return barbero ? barbero.nombre : 'Cualquiera';
};