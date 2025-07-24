const db = require('../db');

exports.listarVeiculos = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT V.*
      FROM veiculos V
      JOIN (
          SELECT R1.veiculo_id
          FROM recargas R1
          LEFT JOIN recargas R2
            ON R1.veiculo_id = R2.veiculo_id AND R1.fim < R2.fim
          WHERE R2.id IS NULL AND R1.status = 'Finalizado'
      ) AS UltimaFinalizada ON V.id = UltimaFinalizada.veiculo_id;
    `);

    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar veículos' });
  }
};
