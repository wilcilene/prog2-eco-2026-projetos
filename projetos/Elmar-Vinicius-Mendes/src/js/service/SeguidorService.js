const SeguidorRepository = require('../repository/SeguidorRepository');

class SeguidorService {


    async seguir(seguidor_id, seguindo_id) {
        return await SeguidorRepository.seguir(seguidor_id, seguindo_id);
    }

    async desseguir(seguidor_id, seguindo_id) {
        return await SeguidorRepository.desseguir(seguidor_id, seguindo_id);
    }


    async listarSeguidores(usuario_id) {
    const [usuarios] = await SeguidorRepository.listarSeguidores(usuario_id);
    return usuarios;
}
 
 
async listarSeguindo(usuario_id) {
    const [usuarios] = await SeguidorRepository.listarSeguindo(usuario_id);
    return usuarios;
}


    async contar(usuario_id) {
        const [rows] = await SeguidorRepository.contar(usuario_id);
        return rows[0];
    }


    async checar(seguidor_id, seguindo_id) {
        const [rows] = await SeguidorRepository.checar(seguidor_id, seguindo_id);
        return rows.length > 0;
    }
}

module.exports = new SeguidorService();