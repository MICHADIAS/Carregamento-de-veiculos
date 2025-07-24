const db = require('../db');

exports.carregarKmInicial = async (req, res) => {
  const veiculo_id = req.params.veiculo_id;
  try {
    const [rows] = await db.query(`
      SELECT km_final FROM recargas 
      WHERE veiculo_id = ? AND status = 'Finalizado' 
      ORDER BY fim DESC LIMIT 1
    `, [veiculo_id]);

    const km_final = rows[0]?.km_final || 0;

    res.status(200).json({ km_final });
  } catch (err) {
    console.error('Erro ao iniciar recarga:', err);
    res.status(500).json({
      erro: 'Erro na query',
      detalhes: err.message || err.sqlMessage || 'Erro desconhecido',
    });
  }
};

// Iniciar recarga
exports.iniciarRecarga = async (req, res) => {
  const { veiculo_id, operador_id, eletroposto_id, percentual_inicio, km_inicial, km_final } = req.body;

  try {
    if (km_inicial >= km_final) {
      return res.status(400).json({ erro: `KM atual deve ser maior que ${km_inicial}` });
    }

    const [result] = await db.query(`
      INSERT INTO recargas
      (veiculo_id, operador_id, eletroposto_id, data, inicio, percentual_inicio, km_inicial, km_final, status)
      VALUES (?, ?, ?, CURDATE(), NOW(), ?, ?, ?, 'Iniciado')
    `, [veiculo_id, operador_id, eletroposto_id, percentual_inicio, km_inicial, km_final]);

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error('Erro ao iniciar recarga:', err);
    res.status(500).json({
      erro: 'Erro na query',
      detalhes: err.message || err.sqlMessage || 'Erro desconhecido',
    });
  }
};

// Finalizar recarga
exports.finalizarRecarga = async (req, res) => {
  const { recarga_id, percentual_final, kwh } = req.body;

  try {
    const [recarga] = await db.query(`SELECT * FROM recargas WHERE id = ? AND status = 'Iniciado'`, [recarga_id]);

    if (recarga.length === 0) {
      return res.status(404).json({ erro: 'Recarga não encontrada ou já finalizada' });
    }

    await db.query(`
      UPDATE recargas SET
        fim = NOW(),
        percentual_final = ?,
        kwh = ?,
        status = 'Finalizado'
      WHERE id = ?
    `, [percentual_final, kwh, recarga_id]);

    res.status(200).json({ msg: 'Recarga finalizada com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao finalizar recarga' });
  }
};

// Listar recargas iniciadas (por operador opcional)
exports.recargasIniciadas = async (req, res) => {
  const operador_id = req.params.operador_id;

  try {
    const [rows] = await db.query(`
      SELECT * FROM recargas 
      WHERE status = 'Iniciado' ${operador_id ? 'AND operador_id = ?' : ''}
    `, operador_id ? [operador_id] : []);

    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar recargas' });
  }
};

// Última recarga finalizada por veículo
exports.ultimaRecarga = async (req, res) => {
  const veiculo_id = req.params.veiculo_id;

  try {
    const [rows] = await db.query(`
      SELECT * FROM recargas 
      WHERE veiculo_id = ? AND status = 'Finalizado' 
      ORDER BY fim DESC LIMIT 1
    `, [veiculo_id]);

    res.status(200).json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar última recarga' });
  }
};
